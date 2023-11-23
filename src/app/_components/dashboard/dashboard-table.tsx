'use client'

import Link from 'next/link'
import AbsenceCard from './absence-card'
import { DashboardOutput } from '@/trpc/shared'
import Heading from '@/app/_components/ui/heading'
import Paragraph from '@/app/_components/ui/paragraph'
import { DashboardAbsence, Note } from '@/app/lib/types'
import { formatDay, formatDate, formatTime } from '@/app/lib/utils'
import { CalendarOff, Scroll, ScrollText, User } from 'lucide-react'

export default function DashboardTable({ shifts }: { shifts: DashboardOutput }) {
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
		<div className='flex min-h-screen flex-col'>
			<div className='flex flex-1 overflow-hidden'>
				<main className='flex-1 p-4'>
					<div className='grid gap-4'>
						{shifts && (
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
						)}

						{shifts && (
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
				</main>
			</div>
		</div>
	)
}
