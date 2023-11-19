'use client'

import { api } from '@/trpc/react'
import { useToast } from '../ui/use-toast'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Heading from '../ui/heading'
import { formatTime, formatTotal } from '@/app/lib/utils'
import { Button } from '../ui/button'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '../ui/alert-dialog'
import { Input } from '../ui/input'
import FormModal from '../ui/form-modal'

export default function ShiftModel({ shiftModel }: { shiftModel: { id: string; start: number; end: number } }) {
	const router = useRouter()
	const { toast } = useToast()

	const [edit, setEdit] = useState(false)
	const [showModal, setShowModal] = useState(false)

	const [end, setEnd] = useState<number>(shiftModel.end)
	const [start, setStart] = useState<number>(shiftModel.start)

	const editShiftModel = api.shiftModel.update.useMutation({
		onSuccess: () => {
			setEdit(false)
			router.refresh()
			toast({
				title: 'Shift model updated successfully.',
			})
		},

		onError: () => {
			toast({
				title: 'There was a problem updating the shift model.',
				variant: 'destructive',
			})
		},
	})

	const deleteShiftModel = api.shiftModel.delete.useMutation({
		onSuccess: () => {
			router.refresh()
			toast({
				title: 'Shift model deleted successfully.',
			})
		},

		onError: () => {
			toast({
				title: 'There was a problem deleting the shift model.',
				variant: 'destructive',
			})
		},
	})

	const handleTimeChange = (newTime: string, field: 'start' | 'end') => {
		const [hour, minute]: string[] = newTime.split(':')
		const newDate = new Date(shiftModel.start * 1000)
		newDate.setHours(Number(hour))
		newDate.setMinutes(Number(minute))
		const newUnixTime = Math.floor(newDate.getTime() / 1000)

		field === 'start' ? setStart(newUnixTime) : setEnd(newUnixTime)
	}

	return (
		<div className='flex h-20 items-center w-fit justify-between border-b py-2'>
			<div className='flex space-x-2'>
				<Heading size={'xs'}>{formatTime(shiftModel.start)}</Heading>
				<Heading size={'xs'}>-</Heading>
				<Heading size={'xs'}>{formatTime(shiftModel.end)}</Heading>
			</div>
			<div>
				<Heading
					size={'xs'}
					className='mx-12'>
					{formatTotal(shiftModel.start, shiftModel.end)}
				</Heading>
			</div>
			<div className='space-x-2'>
				<Button
					size={'lg'}
					onClick={() => setEdit(true)}>
					Edit
				</Button>
				<Button
					size={'lg'}
					variant={'secondary'}
					onClick={() => setShowModal(true)}>
					Delete
				</Button>
			</div>

			{edit && (
				<AlertDialog open>
					<AlertDialogContent>
						<AlertDialogHeader>
							<AlertDialogTitle> Edit Shift Model</AlertDialogTitle>
						</AlertDialogHeader>
						<div className='mt-4 flex flex-col space-y-4'>
							<div>
								<label>Start Time</label>
								<Input
									type='text'
									value={formatTime(start)}
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
								<label>End Time</label>
								<Input
									type='text'
									value={formatTime(end)}
									onKeyDown={(e) => {
										if (e.key === 'Backspace') {
											e.currentTarget.select()
											handleTimeChange('', 'end')
										}
									}}
									onChange={(e) => handleTimeChange(e.target.value, 'end')}
								/>
							</div>
						</div>
						<AlertDialogFooter>
							<AlertDialogCancel onClick={() => setEdit(false)}>Cancel</AlertDialogCancel>
							<AlertDialogAction
								disabled={editShiftModel.isLoading}
								aria-disabled={editShiftModel.isLoading}
								onClick={() => editShiftModel.mutate({ id: shiftModel.id, start, end })}>
								Continue
							</AlertDialogAction>
						</AlertDialogFooter>
					</AlertDialogContent>
				</AlertDialog>
			)}
			{showModal && (
				<FormModal
					showModal={showModal}
					pending={deleteShiftModel.isLoading}
					heading={'Delete Shift Model?'}
					cancel={() => setShowModal(false)}
					text='Are you sure you want to delete this shift model?'
					submit={() => deleteShiftModel.mutate({ id: shiftModel.id })}
				/>
			)}
		</div>
	)
}
