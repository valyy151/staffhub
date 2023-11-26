'use client'

import { InfoIcon, UserCogIcon } from "lucide-react";
import { useRouter } from "next-nprogress-bar";
import { useState } from "react";

import {
    AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogFooter,
    AlertDialogHeader, AlertDialogTitle
} from "@/app/_components/ui/alert-dialog";
import Heading from "@/app/_components/ui/heading";
import { Input } from "@/app/_components/ui/input";
import { formatTime, renderTotal } from "@/app/lib/utils";
import { api } from "@/trpc/react";

import { Button } from "../ui/button";
import InfoModal from "../ui/info-modal";
import { useToast } from "../ui/use-toast";

const sentences = {
	data: [
		'Shift models are a way to describe the different types of shifts available that you use most often. For example: 06:00 - 14:00 or 12:00 - 20:00',
		'You can use this to create schedules faster by selecting a shift model and applying it quickly to a day.',
		'You can also use it to assign it to your staff if they have a preference to work those shifts.',
	],
}

export default function CreateModel() {
	const router = useRouter()
	const { toast } = useToast()

	const [end, setEnd] = useState('')
	const [start, setStart] = useState('')

	const [showModal, setShowModal] = useState(false)
	const [showCreate, setShowCreate] = useState(false)

	const handleSubmit = () => {
		const date = new Date()

		const [hour, minute] = start.split(':')

		date.setHours(Number(hour))
		date.setMinutes(Number(minute))

		const startUnixTime = Math.floor(date.getTime() / 1000)

		date.setHours(Number(end.split(':')[0]))
		date.setMinutes(Number(end.split(':')[1]))

		const endUnixTime = Math.floor(date.getTime() / 1000)

		createModel.mutate({
			end: endUnixTime,
			start: startUnixTime,
		})
	}

	const createModel = api.shiftModel.create.useMutation({
		onSuccess: () => {
			toast({
				title: `Shift Model created`,
			})
			setShowCreate(false)
			router.refresh()
		},

		onError: () => {
			toast({
				title: `Error creating Shift Model`,
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

	return (
		<>
			<div className='space-x-2'>
				<Button onClick={() => setShowCreate(true)}>
					<UserCogIcon className='mr-2' /> New Shift Model
				</Button>
				<Button
					variant={'secondary'}
					onClick={() => setShowModal(true)}>
					<InfoIcon className='mr-2' /> What are Shift Models?
				</Button>
			</div>
			{showCreate && (
				<AlertDialog open>
					<AlertDialogContent className='min-w-[35rem]'>
						<AlertDialogHeader>
							<AlertDialogTitle> New Shift Model</AlertDialogTitle>
						</AlertDialogHeader>
						<div className='flex items-center space-x-4'>
							<div>
								<label htmlFor='start'>Start</label>

								<Input
									type='text'
									name='start'
									value={start}
									className='w-44'
									placeholder='Start time'
									onChange={(e) => handleTimeChange(e.target.value, 'start')}
								/>
							</div>

							<div>
								<label htmlFor='end'>End</label>

								<Input
									name='end'
									type='text'
									value={end}
									className='w-44'
									placeholder='End time'
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
							<AlertDialogCancel onClick={() => setShowCreate(false)}>Cancel</AlertDialogCancel>
							<AlertDialogAction
								onClick={handleSubmit}
								disabled={createModel.isLoading}
								aria-disabled={createModel.isLoading}>
								Continue
							</AlertDialogAction>
						</AlertDialogFooter>
					</AlertDialogContent>
				</AlertDialog>
			)}

			{showModal && (
				<InfoModal
					text={sentences}
					heading={'What are Shift Models?'}
					close={() => setShowModal(false)}
				/>
			)}
		</>
	)
}
