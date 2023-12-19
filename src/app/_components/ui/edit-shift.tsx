import { useState } from 'react'

import type { ShiftEmployee, ShiftModel, ShiftRow } from '@/app/lib/types'
import { formatTime, renderTotal } from '@/app/lib/utils'
import { api } from '@/trpc/react'

import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from './alert-dialog'
import { Button } from './button'
import FormModal from './form-modal'
import Heading from './heading'
import { Input } from './input'
import RolesDropdown from './roles-dropdown'
import { useToast } from './use-toast'
import { useRouter } from 'next/navigation'

export default function EditShift({
	shift,
	setEdit,
	employee,
	shiftModels,
}: {
	shift: ShiftRow
	employee: ShiftEmployee
	setEdit: (edit: boolean) => void
	shiftModels: ShiftModel[] | undefined
}) {
	const [end, setEnd] = useState(formatTime(shift?.end) ?? '')
	const [start, setStart] = useState(formatTime(shift?.start ?? ''))
	const [role, setRole] = useState({ id: shift?.role?.id ?? '', name: shift?.role?.name ?? '' })

	const [showDelete, setShowDelete] = useState(false)

	const { toast } = useToast()

	const router = useRouter()

	const handleTimeChange = (newTime: string, field: 'start' | 'end'): void => {
		if (newTime.length > 5) {
			return
		}

		field === 'start' ? setStart(newTime) : setEnd(newTime)

		if (newTime.length === 2) {
			if (Number(newTime) > 23) {
				field === 'start' ? setStart('00:') : setEnd('00:')
			} else {
				field === 'start' ? setStart(`${newTime}:`) : setEnd(`${newTime}:`)
			}
		}

		if (Number(newTime.split(':')[1]) > 59) {
			field === 'start' ? setStart(`${newTime.split(':')[0]}:00`) : setEnd(`${newTime.split(':')[0]}:00`)
		}

		const date = new Date()

		const [hour, minute] = newTime.split(':')

		date.setHours(Number(hour))
		date.setMinutes(Number(minute))

		const newUnixTime = Math.floor(date.getTime() / 1000)

		if (minute?.length === 5) {
			field === 'start' ? setStart(formatTime(newUnixTime)) : setEnd(formatTime(newUnixTime))
		}
	}

	const createShiftMutation = api.shift.create.useMutation({
		onSuccess: () => {
			router.refresh()
			setEdit(false)
			toast({
				title: 'Shift created successfully.',
			})
		},

		onError: () => {
			toast({
				title: 'There was a problem creating the shift.',
				variant: 'destructive',
			})
		},
	})

	const updateShiftMutation = api.shift.update.useMutation({
		onSuccess: () => {
			router.refresh()
			setEdit(false)
			toast({
				title: 'Shift updated successfully.',
			})
		},

		onError: () => {
			toast({
				title: 'There was a problem updating the shift.',
				variant: 'destructive',
			})
		},
	})

	const deleteShiftMutation = api.shift.delete.useMutation({
		onSuccess: () => {
			router.refresh()
			setEdit(false)
			toast({
				title: 'Shift deleted successfully.',
			})
		},

		onError: () => {
			toast({
				title: 'There was a problem deleting the shift.',
				variant: 'destructive',
			})
		},
	})

	const updateShift = (shiftId: string | null, date: number) => {
		const startDate = new Date(date * 1000)
		const endDate = new Date(date * 1000)

		const [startHour, startMinute] = start.split(':')
		const [endHour, endMinute] = end.split(':')

		startDate.setHours(Number(startHour))
		startDate.setMinutes(Number(startMinute))

		endDate.setHours(Number(endHour))
		endDate.setMinutes(Number(endMinute))

		if (!shiftId) {
			createShiftMutation.mutate({
				roleId: role.id,
				date: shift.date!,
				employeeId: employee.id!,
				end: Math.floor(endDate.getTime() / 1000),
				start: Math.floor(startDate.getTime() / 1000),
			})
			return
		}

		updateShiftMutation.mutate({
			shiftId,
			shift: {
				roleId: role.id,
				end: Math.floor(endDate.getTime() / 1000),
				start: Math.floor(startDate.getTime() / 1000),
			},
		})
	}

	const deleteShift = () => {
		deleteShiftMutation.mutate({
			shiftId: shift?.id!,
		})
	}

	return (
		<>
			<AlertDialog open>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>
							{employee.name} -{'  '}
							{new Date(shift.date! * 1000).toLocaleDateString('en-GB', {
								weekday: 'long',
								year: 'numeric',
								month: 'long',
								day: 'numeric',
							})}
						</AlertDialogTitle>
					</AlertDialogHeader>
					<div className='flex w-fit flex-col'>
						{employee?.roles?.length! > 0 && (
							<RolesDropdown
								role={role}
								setRole={setRole}
								roles={employee.roles}
							/>
						)}
						<div className='mt-4 flex space-x-1'>
							<div>
								<label className='ml-2'>Start</label>
								<Input
									value={start}
									className='w-36 text-lg'
									onKeyDown={(e) => {
										if (e.key === 'Backspace') {
											e.currentTarget.select()
											handleTimeChange('', 'start')
										}
									}}
									onChange={(e) => handleTimeChange(e.target.value, 'start')}
								/>
							</div>
							<div>
								<label className='ml-2'>End</label>
								<Input
									value={end}
									className='w-36 text-lg'
									onKeyDown={(e) => {
										if (e.key === 'Backspace') {
											e.currentTarget.select()
											handleTimeChange('', 'end')
										}
									}}
									onChange={(e) => handleTimeChange(e.target.value, 'end')}
								/>
							</div>
							<div>
								<label className='ml-4'>Total</label>
								<Heading
									size={'xs'}
									className='h-14 border-none px-4 py-1 text-2xl disabled:cursor-default'>
									{renderTotal(start, end)}
								</Heading>
							</div>
						</div>
					</div>
					{shiftModels?.length! > 0 && (
						<>
							<Heading size={'xxs'}>Choose a shift:</Heading>
							<div className='mt-1 flex w-96 flex-wrap'>
								{shiftModels?.map((shiftModel) => (
									<Heading
										key={shiftModel.id}
										size={'xxs'}
										onClick={() => {
											handleTimeChange(formatTime(shiftModel.start), 'start')
											handleTimeChange(formatTime(shiftModel.end) === '00:00' ? '24:00' : formatTime(shiftModel.end), 'end')
										}}
										className='cursor-pointer mr-auto font-medium w-fit hover:text-sky-500'>
										{formatTime(shiftModel.start)} - {formatTime(shiftModel.end)}
									</Heading>
								))}
							</div>
						</>
					)}

					<AlertDialogFooter className='mt-2'>
						{shift.start ? (
							<Button
								variant={'link'}
								onClick={() => setShowDelete(true)}
								className='mr-auto pb-0 pl-0 hover:text-rose-500'>
								Delete Shift
							</Button>
						) : null}
						<AlertDialogCancel onClick={() => setEdit(false)}>Cancel</AlertDialogCancel>
						<AlertDialogAction
							disabled={updateShiftMutation.isLoading || createShiftMutation.isLoading}
							aria-disabled={updateShiftMutation.isLoading || createShiftMutation.isLoading}
							onClick={() => updateShift(shift?.id ?? null, shift.date)}>
							Continue
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
			{showDelete && (
				<FormModal
					submit={deleteShift}
					showModal={showDelete}
					heading='Are you absolutely sure?'
					cancel={() => setShowDelete(false)}
					pending={deleteShiftMutation.isLoading}
					text='Are you sure you want to delete this shift?'
				/>
			)}
		</>
	)
}
