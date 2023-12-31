'use client'
import 'react-calendar/dist/Calendar.css'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Calendar } from 'react-calendar'
import type { ShiftEmployee, ShiftRow } from '@/lib/types'
import { calculateStaffHours, formatDate, formatDay } from '@/lib/utils'

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/app/_components/ui/table'
import ShiftRowComponent from './shift-row'
import { useRouter } from 'next-nprogress-bar'

import Heading from '@/app/_components/ui/heading'
import PDFButton from './pdf-button'

export default function StaffSchedule({ employee, month }: { employee: ShiftEmployee; month: Date }) {
	const [value, setValue] = useState(month)

	const router = useRouter()

	useEffect(() => {
		router.push(`?month=${value.toLocaleDateString('en-GB', { month: 'numeric', year: 'numeric' }).replace('/', '_')}`)
	}, [value])

	return (
		<section className='flex'>
			<div>
				<Heading
					size={'xs'}
					className='mb-4 ml-2'>
					{employee?.name}, {value.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })} -{' '}
					{calculateStaffHours(employee?.shifts as ShiftRow[])}
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
							{employee?.shifts.map((shift) => (
								<TableRow
									key={shift.workDayId}
									className='hover:bg-inherit'>
									<TableCell
										className={`border-r ${
											(formatDay(shift.date, 'short') === 'Sat' && 'font-bold text-rose-500') ||
											(formatDay(shift.date, 'short') === 'Sun' && 'font-bold text-rose-500')
										}`}>
										<Link
											href={`/days/${shift.workDayId}/shifts`}
											className={`py-3 pr-2 underline-offset-2 hover:underline`}>
											{formatDay(shift.date, 'short')}
										</Link>
									</TableCell>
									<TableCell
										className={`border-r font-medium  ${
											(formatDay(shift.date, 'short') === 'Sat' && 'font-bold text-rose-500') ||
											(formatDay(shift.date, 'short') === 'Sun' && 'font-bold text-rose-500')
										}`}>
										<Link
											href={`/days/${shift.workDayId}/shifts`}
											className={`py-3 pr-2 underline-offset-2 hover:underline`}>
											{formatDate(shift.date, 'long')}
										</Link>
									</TableCell>

									<ShiftRowComponent
										employee={employee}
										shift={shift as ShiftRow}
									/>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</div>
			</div>

			<div className='relative ml-8 mt-12'>
				<Calendar
					value={value}
					view={'month'}
					maxDetail='year'
					className='h-fit'
					next2Label={null}
					prev2Label={null}
					activeStartDate={value}
					onChange={(value) => setValue(value as Date)}
				/>

				<PDFButton
					employee={employee}
					shifts={employee?.shifts}
					month={value.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })}
				/>
			</div>
		</section>
	)
}
