'use client'

import { generateYearArray, changeMonth, calculateHours, formatTime, findAbsenceDays } from '@/app/lib/utils'
import { api } from '@/trpc/react'
import { useState } from 'react'
import { useToast } from '../ui/use-toast'
import Calendar from 'react-calendar'
import Heading from '../ui/heading'
import Link from 'next/link'
import { Button } from '../ui/button'
import { CalendarPlusIcon, InfoIcon, XIcon } from 'lucide-react'
import { AlertDialog, AlertDialogHeader, AlertDialogTitle } from '../ui/alert-dialog'
import { AlertDialogContent } from '@radix-ui/react-alert-dialog'
import InfoModal from '../ui/info-modal'
import SelectStaff from '../staff/select-staff'
import { StaffDropdownOutput } from '@/trpc/shared'
import ScheduleTable from './schedule-table'

const sentences = {
	data: [
		'Start by selecting a staff member on the left and choosing which month you want to make a schedule for.',
		'If the staff member has any schedule preferences, you will see them below the table. You can use the shift models from there to quickly assign a shift to a day.',
		'Alternatively you can write the schedule manually. You can do this by clicking on the day you want to edit.',
		'For each day, there are 2 inputs: one for the start time and one for the end time.',
		'Type the start time and end time in the format HH:MM (24 hour format). For example 09:00 - 16:45.',
		'If you already made the schedule but want to make changes, go to the Dashboard and edit that particular day.',
	],
}

export default function SchedulePlanner() {
	const [isOpen, setIsOpen] = useState<boolean>(false)

	const [value, setValue] = useState<Date>(new Date())
	const [schedule, setSchedule] = useState(changeMonth(new Date()))

	const [shift, setShift] = useState<string>('')

	const [yearArray, setYearArray] = useState(generateYearArray(new Date().getFullYear()))

	const [employee, setEmployee] = useState<StaffDropdownOutput>()

	const [showCalendar, setShowCalendar] = useState<boolean>(false)

	const [showModal, setShowModal] = useState(false)

	const { data: staff } = api.staff.getDropdown.useQuery()

	const { data: shiftModels } = api.shiftModel.get.useQuery()

	const { toast } = useToast()

	const createShift = api.shift.createMany.useMutation({
		onSuccess: () => {
			toast({
				title: 'Schedule created successfully.',
			})
		},
		onError: () => {
			toast({
				title: 'There was a problem creating the schedule.',
				variant: 'destructive',
			})
		},
	})

	const createDay = api.workDay.createMany.useMutation()

	const { refetch } = api.workDay.yearExists.useQuery(
		{
			date: schedule[0]?.date!,
		},
		{ enabled: false }
	)

	const handleMonthChange = (date: Date) => {
		setValue(date as Date)
		const year = date.getFullYear()
		setYearArray(generateYearArray(year))
		setSchedule(changeMonth(date))
	}

	const createSchedule = () => {
		if (!employee?.id) {
			return toast({
				title: 'Please select an employee.',
			})
		}

		refetch().then(({ data }) => {
			if (!data) {
				createDay.mutate(yearArray)
			}

			const filteredSchedule = schedule.filter((shift) => shift.start && shift.end)

			if (filteredSchedule.length === 0) {
				return toast({
					title: 'Please select a shift.',
				})
			}

			createShift.mutate({
				employeeId: employee.id,
				schedule: filteredSchedule as { start: number; end: number; date: number }[],
			})
		})
	}

	const { sickDays, vacationDays } = findAbsenceDays([...employee?.vacations!, ...employee?.sickLeaves!], schedule)

	return (
		<main
			onContextMenu={(e) => {
				e.preventDefault()
				setShift('')
			}}
			onClick={() => isOpen && setIsOpen(false)}
			className='p-4'>
			<section className='flex'>
				<div className='flex'>
					<div>
						{employee?.name && schedule ? (
							<div className='mb-4 flex justify-between'>
								<Heading
									size={'xs'}
									onClick={() => setShowCalendar(true)}
									className='cursor-pointer underline-offset-2 hover:underline'>
									{value.toLocaleDateString('en-GB', {
										month: 'long',
										year: 'numeric',
									})}
								</Heading>

								<div className='flex items-baseline justify-end'>
									<Heading
										size={'xxs'}
										className='mr-2 cursor-pointer underline-offset-2 hover:underline'>
										<Link href={`/staff/${employee?.id}`}> {employee?.name}</Link>
									</Heading>

									<Heading
										size={'xxs'}
										className='text-left font-normal'>
										will work <span className='font-bold'>{calculateHours(schedule)}</span> in{' '}
										<span className='font-bold'>
											{new Date(schedule[0]!.date * 1000).toLocaleDateString('en-GB', {
												month: 'long',
												year: 'numeric',
											})}
										</span>
									</Heading>
								</div>
							</div>
						) : (
							<div className='mb-4 flex justify-between'>
								<Heading
									size={'xs'}
									onClick={() => setShowCalendar(true)}
									className='cursor-pointer underline-offset-8 hover:underline'>
									{value.toLocaleDateString('en-GB', {
										month: 'long',
										year: 'numeric',
									})}
								</Heading>
								<Heading
									size={'xxs'}
									className='mr-2'>
									No employee selected
								</Heading>
							</div>
						)}
						<ScheduleTable
							shift={shift}
							data={schedule}
							sickDays={sickDays}
							setData={setSchedule}
							vacationDays={vacationDays}
						/>
					</div>

					<div className='ml-12'>
						<div>
							<SelectStaff
								staff={staff}
								employee={employee}
								setEmployee={setEmployee}
							/>
							{employee?.name && (
								<div className='mt-2 flex flex-col items-baseline'>
									<Heading size={'xs'}>Shift Preferences</Heading>
									<div className='flex flex-col'>
										{employee.schedulePreference?.shiftModels.length! > 0 ? (
											employee.schedulePreference?.shiftModels.map((item) => (
												<Heading
													size={'xxs'}
													key={item.id}
													className=' my-0.5 font-normal'>
													({formatTime(item.start)} - {formatTime(item.end)})
												</Heading>
											))
										) : (
											<Heading
												size={'xxs'}
												className='mr-4 text-left font-normal'>
												No shift models set
											</Heading>
										)}
									</div>
								</div>
							)}
							<div className='flex flex-col pt-2'>
								{shiftModels?.length! > 0 && (
									<>
										<Heading size={'xs'}>Select a shift</Heading>
										<div className='flex flex-col'>
											{shiftModels?.map((model) => (
												<Heading
													size={'xxs'}
													key={model.id}
													onClick={() => {
														shift === `${formatTime(model.start)} - ${formatTime(model.end) == '00:00' ? '24:00' : formatTime(model.end)}`
															? setShift('')
															: setShift(`${formatTime(model.start)} - ${formatTime(model.end) == '00:00' ? '24:00' : formatTime(model.end)}`)
													}}
													className={`my-0.5 w-fit cursor-pointer text-left font-medium ${
														shift === `${formatTime(model.start)} - ${formatTime(model.end) == '00:00' ? '24:00' : formatTime(model.end)}` ? 'text-sky-500' : ''
													}`}>
													[{formatTime(model.start)} - {formatTime(model.end)}]
												</Heading>
											))}
										</div>
									</>
								)}
							</div>

							<Heading
								size={'xs'}
								className='mt-2'>
								Hours per month
							</Heading>
							<Heading
								size={'xxs'}
								className=' font-normal'>
								<span>{calculateHours(schedule)}</span> / {employee?.schedulePreference?.hoursPerMonth} hours per month
							</Heading>

							<div className='flex w-fit flex-col space-y-1 pt-4'>
								<Button
									title='Create schedule'
									onClick={createSchedule}>
									<CalendarPlusIcon className='mr-2' /> Submit
								</Button>
								<Button
									variant={'secondary'}
									title='How do I make a schedule?'
									onClick={() => setShowModal(true)}>
									<InfoIcon className='mr-2' /> How do I write a schedule?
								</Button>
							</div>
						</div>
					</div>
				</div>
			</section>

			{showCalendar && (
				<AlertDialog open>
					<AlertDialogContent className='justify-center'>
						<Button
							variant={'link'}
							onClick={() => setShowCalendar(false)}
							className='absolute right-2 top-0 w-fit p-1'>
							<XIcon size={16} />
						</Button>
						<AlertDialogHeader>
							<AlertDialogTitle>Choose a Month</AlertDialogTitle>
						</AlertDialogHeader>
						<Calendar
							maxDetail='year'
							next2Label={null}
							prev2Label={null}
							onChange={(value) => {
								setShowCalendar(false)
								setValue(value as Date)
								handleMonthChange(value as Date)
							}}
						/>
					</AlertDialogContent>
				</AlertDialog>
			)}
			{showModal && (
				<InfoModal
					text={sentences}
					close={() => setShowModal(false)}
					heading='How do I write a schedule?'
				/>
			)}
		</main>
	)
}
