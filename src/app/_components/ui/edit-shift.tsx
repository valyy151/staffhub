import { useState } from "react";

import { ShiftModel } from "@/app/lib/types";
import { formatTime, formatTotal } from "@/app/lib/utils";
import { api } from "@/trpc/react";
import { WorkDayShiftsOutput } from "@/trpc/shared";

import {
    AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogFooter,
    AlertDialogHeader, AlertDialogTitle
} from "./alert-dialog";
import { Button } from "./button";
import FormModal from "./form-modal";
import Heading from "./heading";
import { Input } from "./input";
import RolesDropdown from "./roles-dropdown";
import { useToast } from "./use-toast";

export default function EditShift({
	shift,
	setEdit,
	employee,
	setValue,
	shiftModels,
}: {
	setEdit: (edit: boolean) => void
	shiftModels: ShiftModel[] | undefined
	shift: WorkDayShiftsOutput['shifts'][number]
	setValue?: ({ date, refetch }: { date: Date; refetch: boolean }) => void
	employee: { id: string; name: string; roles: { id: string; name: string }[] }
}) {
	const [end, setEnd] = useState(shift?.end ?? 0)
	const [start, setStart] = useState(shift?.start ?? 0)
	const [role, setRole] = useState({ id: shift?.role?.id ?? '', name: shift?.role?.name ?? '' })

	const [showDelete, setShowDelete] = useState(false)

	const { toast } = useToast()

	const handleTimeChange = (newTime: string, field: 'start' | 'end'): void => {
		try {
			const [hour, minute]: string[] = newTime.split(':')
			const newDate: Date = new Date(shift.date! * 1000)
			newDate.setHours(Number(hour))
			newDate.setMinutes(Number(minute))
			const newUnixTime = Math.floor(newDate.getTime() / 1000)

			field === 'start' ? setStart(newUnixTime) : setEnd(newUnixTime)
		} catch (e) {
			console.error(e)
		}
	}

	const createShiftMutation = api.shift.create.useMutation({
		onSuccess: () => {
			setValue && setValue({ date: new Date(shift.date! * 1000), refetch: true })
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
			setValue && setValue({ date: new Date(shift.date! * 1000), refetch: true })
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
			setValue && setValue({ date: new Date(shift.date! * 1000), refetch: true })
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

	const updateShift = (shiftId: string | null) => {
		if (!shiftId) {
			createShiftMutation.mutate({
				end,
				start,
				roleId: role.id,
				date: shift.date!,
				employeeId: employee.id!,
			})
			return
		}
		updateShiftMutation.mutate({
			shiftId,
			shift: { start, end, roleId: role.id },
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
									value={formatTime(start)}
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
									value={formatTime(end)}
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
									{formatTotal(start, end)}
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
							onClick={() => updateShift(shift?.id ?? null)}>
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
