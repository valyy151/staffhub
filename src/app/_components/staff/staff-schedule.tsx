'use client'
import Link from 'next/link'
import Heading from '../ui/heading'
import { api } from '@/trpc/react'
import ShiftRow from './shift-row'
import Spinner from '../ui/spinner'
import { Shift } from '@/app/lib/types'
import 'react-calendar/dist/Calendar.css'
import { Calendar } from 'react-calendar'
import { useEffect, useState } from 'react'
import type { StaffScheduleOutput } from '@/trpc/shared'
import { calculateHours, formatDate, formatDay } from '@/app/lib/utils'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import dynamic from 'next/dynamic'

const PDFButton = dynamic(() => import('@/app/_components/PDFButton'), {
	ssr: false,
})

export default function StaffSchedule({ employee }: { employee: StaffScheduleOutput }) {
	const [value, setValue] = useState({ date: new Date(), refetch: false })

	const [month, setMonth] = useState(value.date.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' }))

	const [shifts, setShifts] = useState(employee?.shifts)

	const { refetch, isFetching } = api.shift.schedule.useQuery(
		{ id: employee?.id as string, month: value.date },
		{
			enabled: false,
		}
	)

	useEffect(() => {
		if (value.date.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' }) === month && !value.refetch) {
			return
		}

		refetch().then(({ data }) => {
			if (data) {
				setShifts(data)
				setMonth(value.date.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' }))
			}
		})
	}, [value])

	return (
		<section className='flex'>
			<div>
				<Heading
					size={'xs'}
					className='mb-4 ml-2'>
					{employee?.name}, {month} - {calculateHours(shifts as Shift[])}
				</Heading>
				<div className='border max-h-[46.2rem] overflow-y-scroll'>
					<Table className='min-w-[40vw]'>
						<TableHeader className='sticky top-0 bg-card shadow shadow-border'>
							<TableRow className='hover:bg-inherit'>
								<TableHead className='border-r'>Day</TableHead>
								<TableHead className='border-r'>Date</TableHead>
								<TableHead className='text-right'>Shift</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{shifts.map((shift) => (
								<TableRow
									key={shift.workDayId}
									className='hover:bg-inherit'>
									<TableCell
										className={`border-r ${(formatDay(shift.date, 'short') === 'Sat' && 'font-bold text-rose-500') || (formatDay(shift.date, 'short') === 'Sun' && 'font-bold text-rose-500')}`}>
										<Link
											href={`/days/${shift.workDayId}/shifts`}
											className={`py-3 pr-2 underline-offset-2 hover:underline`}>
											{formatDay(shift.date, 'short')}
										</Link>
									</TableCell>
									<TableCell
										className={`border-r font-medium  ${
											(formatDay(shift.date, 'short') === 'Sat' && 'font-bold text-rose-500') || (formatDay(shift.date, 'short') === 'Sun' && 'font-bold text-rose-500')
										}`}>
										<Link
											href={`/days/${shift.workDayId}/shifts`}
											className={`py-3 pr-2 underline-offset-2 hover:underline`}>
											{formatDate(shift.date, 'long')}
										</Link>
									</TableCell>

									<ShiftRow
										shift={shift}
										setValue={setValue}
										employee={employee}
									/>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</div>
			</div>

			<div className='relative ml-8 mt-12'>
				<Calendar
					value={value.date}
					view={'month'}
					maxDetail='year'
					className='h-fit'
					next2Label={null}
					prev2Label={null}
					activeStartDate={value.date}
					onChange={(value) => setValue({ date: value as Date, refetch: false })}
				/>

				<PDFButton
					month={month}
					shifts={shifts}
					employee={employee}
				/>

				{isFetching && (
					<div className='mt-4'>
						<Spinner noMargin />
					</div>
				)}
			</div>
		</section>
	)
}
