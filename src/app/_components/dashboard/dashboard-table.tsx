'use client'

import "react-calendar/dist/Calendar.css";

import { CalendarOff, Scroll, ScrollText, User } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Calendar from "react-calendar";

import Heading from "@/app/_components/ui/heading";
import Paragraph from "@/app/_components/ui/paragraph";
import { Select, SelectContent, SelectTrigger, SelectValue } from "@/app/_components/ui/select";
import { DashboardAbsence, Note } from "@/app/lib/types";
import { formatDate, formatDay, formatTime } from "@/app/lib/utils";
import { api } from "@/trpc/react";

import { Button } from "../ui/button";
import Spinner from "../ui/spinner";
import AbsenceCard from "./absence-card";

export default function DashboardTable() {
	const router = useRouter()
	const searchParams = useSearchParams()

	const pathname = usePathname()

	const pageParams = Number(searchParams.get('page'))
	const monthParams = new Date(String(searchParams.get('month')).split('/').reverse().join('-'))

	const [page, setPage] = useState<number>(pageParams)
	const [value, setValue] = useState<Date>(new Date(String(monthParams).split('/').reverse().join('-')))

	const { data: firstAndLastDays } = api.dashboard.findFirstAndLastDay.useQuery()

	const { data, refetch, isFetching } = api.dashboard.find.useQuery({
		page: pageParams,
		month: monthParams,
	})

	const [shifts, setShifts] = useState(data)

	const [showCalendar, setShowCalendar] = useState<boolean>(false)

	useEffect(() => {
		router.push(`${pathname}?page=${page}&month=${value.toLocaleDateString('en-GB', { year: 'numeric', month: 'numeric' })}`)
	}, [page, value])

	useEffect(() => {
		refetch().then(({ data }) => data && setShifts(data))
	}, [searchParams.get('page'), searchParams.get('month')])

	const absencesArray: DashboardAbsence[] | null = []
	const notesArray: Note[] = shifts?.map((day) => day.notes.map((note) => ({ ...note, date: day.date }))).flat() ?? []

	//calculate amount of absences for each employee then push to absencesArray
	shifts?.map((day) =>
		day.shifts.map((shift) => {
			if (shift.absence?.absent) {
				const index = absencesArray.findIndex((absence) => absence.employee.id === shift.employee.id)

				if (index === -1) {
					absencesArray.push({
						shifts: [
							{
								id: shift.id,
								approved: shift.absence.approved,
								date: shift.date,
							},
						],
						reason: shift.absence.reason,
						absent: shift.absence.absent,
						approved: shift.absence.approved,
						employee: {
							name: shift.employee.name,
							id: shift.employee.id,
						},
						amount: 1,
					})
				} else {
					absencesArray[index]!.shifts.push({
						id: shift.id,
						date: shift.date,
						approved: shift.absence.approved,
					})
					absencesArray[index]!.amount += 1
				}
			}
		})
	)

	return (
		<main className='flex'>
			<aside className='overflow-auto border-r h-screen'>
				<nav className='flex flex-col gap-4 p-4'>
					<h2 className='text-lg font-semibold'>Filters</h2>
					<div className='space-y-4'>
						<Select
							open={showCalendar}
							onOpenChange={() => setShowCalendar(!showCalendar)}>
							<SelectTrigger
								onClick={() => setShowCalendar(!showCalendar)}
								className='focus:ring-0 focus:ring-offset-0'>
								<SelectValue
									placeholder={new Date(value).toLocaleDateString('en-GB', {
										year: 'numeric',
										month: 'long',
									})}
								/>
							</SelectTrigger>
							<SelectContent>
								<Calendar
									view='month'
									maxDetail='year'
									next2Label={null}
									prev2Label={null}
									activeStartDate={value!}
									onChange={(value) => {
										setValue(value as Date)
										setShowCalendar(false)
									}}
									maxDate={new Date(1000 * firstAndLastDays?.[1]?.date!)}
									minDate={new Date(1000 * firstAndLastDays?.[0]?.date!)}
								/>
							</SelectContent>
						</Select>
						<div className='flex space-x-1'>
							<Button
								variant={'outline'}
								title='Previous Week'
								disabled={isFetching}
								aria-disabled={isFetching}
								className='active:scale-95'
								onClick={() => setPage(page - 1)}>
								Prev Week
							</Button>

							<Button
								variant={'outline'}
								title='Next Week'
								disabled={isFetching}
								aria-disabled={isFetching}
								className='active:scale-95'
								onClick={() => setPage(page + 1)}>
								Next Week
							</Button>
						</div>
					</div>
				</nav>
				{isFetching && (
					<div className='flex justify-center'>
						<Spinner noMargin />
					</div>
				)}
			</aside>
			<div className='flex flex-1 overflow-hidden'>
				<div className='flex-1 p-4'>
					<div className='grid gap-4'>
						{shifts ? (
							<Heading
								size={'sm'}
								className='ml-2'>
								{new Date(shifts[0]!.date * 1000).toLocaleDateString('en-GB', {
									year: 'numeric',
									month: 'long',
									day: 'numeric',
								})}{' '}
								-{' '}
								{new Date(shifts[6]!.date * 1000).toLocaleDateString('en-GB', {
									year: 'numeric',
									month: 'long',
									day: 'numeric',
								})}{' '}
							</Heading>
						) : (
							<div className='h-8 w-96 rounded bg-muted animate-pulse' />
						)}

						{shifts ? (
							<div className='flex min-h-[24rem] rounded-lg border-b border-t'>
								{shifts?.map((day, index) => {
									return (
										<div
											key={day.id}
											className={`flex w-full flex-col items-center border-x  ${index === 0 && 'rounded-s-lg'} ${index === 6 && 'rounded-e-lg'}`}>
											<Link
												href={`/days/${day.id}/shifts`}
												className='group w-full text-center'>
												<Heading
													size={'xs'}
													className='px-3 pt-6'>
													{formatDay(day.date, 'long')}
												</Heading>
												<Paragraph className='w-full border-b-2 py-2 text-center duration-150 group-hover:border-primary'>{day && formatDate(day.date, 'short')}</Paragraph>
											</Link>
											<div className='mt-4 flex w-full flex-col items-center'>
												{day.shifts.length > 0 ? (
													day.shifts
														.sort((a, b) => a.start - b.start)
														.map((shift) => {
															return (
																<div
																	key={shift.id}
																	title={shift.employee.name}
																	className='w-full'>
																	<p className='text-md flex items-center'>
																		<User className={`ml-1 ${shift.absence?.absent && 'text-rose-500'}`} />
																		<Link
																			href={`/staff/${shift.employee.id}`}
																			className={`text-left hover:underline ${shift.absence?.absent && 'text-muted-foreground'}`}>
																			{shift.employee.name.split(' ')[0]}
																		</Link>

																		<span className={`ml-auto ${shift.absence?.absent && 'text-muted-foreground'}`}>{formatTime(shift.start)}</span>
																		<span className={`mx-0.5 ${shift.absence?.absent && 'text-muted-foreground'}`}>-</span>
																		<span className={`mr-2 ${shift.absence?.absent && 'text-muted-foreground'}`}>{formatTime(shift.end)}</span>
																	</p>
																</div>
															)
														})
												) : (
													<Paragraph className='flex items-center'>
														<CalendarOff className='mr-2' />
														No Shifts
													</Paragraph>
												)}
											</div>

											<Link
												href={`/days/${day.id}/notes`}
												title={`${day.notes.length} ${day.notes.length === 1 ? 'note' : 'notes'}`}
												className='mt-auto flex items-center border-b-2 border-transparent px-3 py-2 text-2xl duration-150 hover:border-primary'>
												{day.notes.length}
												{day.notes.length > 0 ? <ScrollText className='ml-2 h-6 w-6' /> : <Scroll className='ml-2 h-6 w-6' />}
											</Link>
										</div>
									)
								})}
							</div>
						) : (
							<div className='h-96 w-full rounded bg-muted animate-pulse' />
						)}

						{absencesArray.length > 0 && (
							<>
								<Heading
									size={'xs'}
									className='ml-2'>
									Absences
								</Heading>
								<div className='grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3'>
									{absencesArray.map((absence, index) => (
										<AbsenceCard
											absence={absence}
											key={index}
										/>
									))}
								</div>
							</>
						)}

						{notesArray.length > 0 && (
							<>
								<Heading
									size={'xs'}
									className='ml-2'>
									Notes
								</Heading>
								<div className='grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3'>
									{notesArray
										.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
										.map((note) => (
											<div
												key={note.id}
												className='flex min-h-[6rem] w-full flex-col rounded-lg border bg-card py-1'>
												<Link
													href={`/days/${note.workDayId}/notes`}
													className='w-fit px-2 text-sm font-medium underline-offset-2 hover:underline'>
													{new Date(note.date * 1000).toLocaleString('en-GB', {
														day: 'numeric',
														month: 'short',
														year: 'numeric',
													})}
												</Link>

												<Paragraph
													size={'sm'}
													className='px-2 pb-2 text-justify font-light'>
													{note.content}
												</Paragraph>
											</div>
										))}
								</div>
							</>
						)}
					</div>
				</div>
			</div>
		</main>
	)
}
