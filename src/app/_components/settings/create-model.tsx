'use client'

import { useState } from 'react'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/app/_components/ui/alert-dialog'
import { Input } from '@/app/_components/ui/input'
import Heading from '@/app/_components/ui/heading'
import { formatTime, formatTotal } from '@/app/lib/utils'
import { Button } from '../ui/button'
import { InfoIcon, UserCogIcon } from 'lucide-react'
import InfoModal from '../ui/info-modal'

const sentences = {
	data: [
		'Shift models are a way to describe the different types of shifts available that you use most often. For example: 06:00 - 14:00 or 12:00 - 20:00',
		'You can use this to create schedules faster by selecting a shift model and applying it quickly to a day.',
		'You can also use it to assign it to your staff if they have a preference to work those shifts.',
	],
}

export default function CreateModel() {
	const [end, setEnd] = useState(0)
	const [start, setStart] = useState(0)
	const [showModal, setShowModal] = useState(false)
	const [showCreate, setShowCreate] = useState(false)

	const handleSubmit = () => {}

	const handleTimeChange = (newTime: string, field: 'start' | 'end') => {
		const [hour, minute]: string[] = newTime.split(':')
		const newDate: any = new Date()
		newDate.setHours(hour)
		newDate.setMinutes(minute)
		const newUnixTime = Math.floor(newDate.getTime() / 1000)

		field === 'start' ? setStart(newUnixTime) : setEnd(newUnixTime)
	}

	return (
		<>
			<div className='space-x-2'>
				<Button
					size={'lg'}
					onClick={() => setShowCreate(true)}>
					<UserCogIcon className='mr-2' /> New Shift Model
				</Button>
				<Button
					size={'lg'}
					variant={'secondary'}
					onClick={() => setShowModal(true)}>
					<InfoIcon className='mr-2' /> What are Shift Models?
				</Button>
			</div>
			{showCreate && (
				<AlertDialog open>
					<AlertDialogContent>
						<AlertDialogHeader>
							<AlertDialogTitle> New Shift Model</AlertDialogTitle>
						</AlertDialogHeader>
						<div className='flex space-x-2'>
							<div>
								<label htmlFor='start'>Start</label>

								<Input
									type='text'
									name='start'
									className='w-44'
									placeholder='Start time'
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
								<label htmlFor='end'>End</label>

								<Input
									name='end'
									type='text'
									className='w-44'
									placeholder='End time'
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
							<div>
								<label
									htmlFor='end'
									className='ml-2'>
									Total
								</label>

								<Heading
									size={'xxs'}
									className='ml-2 mt-2'>
									{formatTotal(start, end)}
								</Heading>
							</div>
						</div>
						<AlertDialogFooter>
							<AlertDialogCancel onClick={() => setShowCreate(false)}>Cancel</AlertDialogCancel>
							<AlertDialogAction onClick={handleSubmit}>Continue</AlertDialogAction>
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
