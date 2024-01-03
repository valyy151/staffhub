'use client'

import { CalendarPlusIcon, InfoIcon, XIcon } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css'

import { calculateHours, changeMonth, findAbsenceDays, formatTime, generateYearArray } from '@/app/lib/utils'
import { api } from '@/trpc/react'
import { StaffDropdownOutput } from '@/trpc/shared'

import SelectStaff from '../staff/select-staff'
import { AlertDialog, AlertDialogHeader, AlertDialogTitle, AlertDialogContent } from '../ui/alert-dialog'
import { Button } from '../ui/button'
import Heading from '../ui/heading'
import InfoModal from '../ui/info-modal'
import { useToast } from '../ui/use-toast'
import ScheduleTable from './schedule-table'
import SelectShiftModel from './select-shift-model'

type ShiftModel = { id: string; end: number; start: number }

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

export default function SchedulePlanner({ shiftModels }: { shiftModels: ShiftModel[] }) {
	const [isOpen, setIsOpen] = useState<boolean>(false)

	const [loading, setLoading] = useState<boolean>(false)

	const [value, setValue] = useState<Date>(new Date())
	const [schedule, setSchedule] = useState(changeMonth(new Date()))

	const [shiftModel, setShiftModel] = useState<string>('')

	const [yearArray, setYearArray] = useState(generateYearArray(new Date().getFullYear()))

	const [employee, setEmployee] = useState<StaffDropdownOutput>()

	const [showCalendar, setShowCalendar] = useState<boolean>(false)

	const [showModal, setShowModal] = useState(false)

	const { data: staff } = api.staff.getDropdown.useQuery()

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
			setLoading(false)
		},
		onSettled: () => {
			setLoading(false)
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
		setValue(date)
		const year = date.getFullYear()
		setYearArray(generateYearArray(year))
		setSchedule(changeMonth(date))
	}

	const createSchedule = () => {
		setLoading(true)

		if (!employee?.id) {
			toast({
				title: 'Please select an employee.',
			})
			setLoading(false)
			return
		}

		refetch().then(({ data }) => {
			if (!data) {
				createDay.mutate(yearArray)
			}

			const filteredSchedule = schedule.filter((shift) => shift.start && shift.end)

			if (filteredSchedule.length === 0) {
				toast({
					title: 'Please select a shift.',
				})
				setLoading(false)
				return
			}

			createShift.mutate({
				employeeId: employee.id,
				schedule: filteredSchedule as { start: string; end: string; date: number }[],
			})
		})
	}

	const { sickDays, vacationDays } = findAbsenceDays(
		[...(employee?.vacations ?? []), ...(employee?.sickLeaves ?? [])],
		schedule
	)

	return (
		<main
			onContextMenu={(e) => {
				e.preventDefault()
				setShiftModel('')
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
							data={schedule}
							sickDays={sickDays}
							setData={setSchedule}
							shiftModel={shiftModel}
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
									<SelectShiftModel
										shiftModel={shiftModel}
										shiftModels={shiftModels}
										setShiftModel={setShiftModel}
									/>
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
								<span>{calculateHours(schedule)}</span> / {employee?.schedulePreference?.hoursPerMonth} per month
							</Heading>

							<div className='flex w-fit flex-col space-y-1 pt-4'>
								<Button
									title='Create schedule'
									disabled={loading}
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
