'use client'

import { useRouter } from "next-nprogress-bar";
import { useState } from "react";

import { formatTime, renderTotal } from "@/app/lib/utils";
import { api } from "@/trpc/react";

import {
    AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogFooter,
    AlertDialogHeader, AlertDialogTitle
} from "../ui/alert-dialog";
import { Button } from "../ui/button";
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";
import FormModal from "../ui/form-modal";
import Heading from "../ui/heading";
import { Input } from "../ui/input";
import { useToast } from "../ui/use-toast";

export default function ShiftModel({ shiftModel }: { shiftModel: { id: string; start: number; end: number } }) {
	const router = useRouter()
	const { toast } = useToast()

	const [edit, setEdit] = useState(false)
	const [showModal, setShowModal] = useState(false)

	const [end, setEnd] = useState<string>(formatTime(shiftModel.end))
	const [start, setStart] = useState<string>(formatTime(shiftModel.start))

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

	const handleSubmit = () => {
		const date = new Date()

		const [hour, minute] = start.split(':')

		date.setHours(Number(hour))

		date.setMinutes(Number(minute))

		const startUnixTime = Math.floor(date.getTime() / 1000)

		date.setHours(Number(end.split(':')[0]))

		date.setMinutes(Number(end.split(':')[1]))

		const endUnixTime = Math.floor(date.getTime() / 1000)

		editShiftModel.mutate({ id: shiftModel.id, start: startUnixTime, end: endUnixTime })
	}

	return (
		<>
			<Card className='w-fit'>
				<CardHeader>
					<CardTitle>
						{start} - {end}
					</CardTitle>
					<CardDescription className='text-lg'>Total hours: {renderTotal(start, end)}</CardDescription>
				</CardHeader>

				<CardFooter className='space-x-2'>
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
				</CardFooter>
			</Card>
			{edit && (
				<AlertDialog open>
					<AlertDialogContent className='min-w-[35rem]'>
						<AlertDialogHeader>
							<AlertDialogTitle> Edit Shift Model</AlertDialogTitle>
						</AlertDialogHeader>
						<div className='flex items-center space-x-4'>
							<div>
								<label>Start Time</label>
								<Input
									type='text'
									value={start}
									onChange={(e) => handleTimeChange(e.target.value, 'start')}
								/>
							</div>
							<div>
								<label>End Time</label>
								<Input
									type='text'
									value={end}
									onChange={(e) => handleTimeChange(e.target.value, 'end')}
								/>
							</div>
							<div>
								<label
									htmlFor='end'
									className='ml-2'>
									Total
								</label>

								<Heading
									size={'xxs'}
									className='ml-2 mt-2'>
									{renderTotal(start, end)}
								</Heading>
							</div>
						</div>
						<AlertDialogFooter>
							<AlertDialogCancel onClick={() => setEdit(false)}>Cancel</AlertDialogCancel>
							<AlertDialogAction
								onClick={handleSubmit}
								disabled={editShiftModel.isLoading}
								aria-disabled={editShiftModel.isLoading}>
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
		</>
	)
}
