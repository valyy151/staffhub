import type { Absence, Shift } from '@/app/lib/types'
import { PhoneIcon, MailIcon, HomeIcon } from 'lucide-react'
import { calculateHours, checkAbsence, findAbsences } from '@/app/lib/utils'
import { Card, CardTitle, CardContent, CardDescription, CardFooter, CardHeader } from '@/app/_components/ui/card'
import type { StaffIdOutput } from '@/trpc/shared'

export default function ProfileCards({ employee }: { employee: StaffIdOutput }) {
	const hours = calculateHours(employee?.shifts as Shift[])
	const currentMonth = new Date().toLocaleDateString(undefined, { month: 'long', year: 'numeric' })

	const sickDays = findAbsences(employee?.sickLeaves as Absence[])
	const absence = checkAbsence(employee?.sickLeaves as Absence[], employee?.vacations as Absence[])

	return (
		<>
			<section className='mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
				<Card className='min-w-[24rem]'>
					<CardHeader>
						<CardTitle>Personal Info</CardTitle>
					</CardHeader>

					<CardContent>
						<CardDescription>
							<span className='flex items-center'>
								<PhoneIcon
									size={16}
									className='mr-2'
								/>
								Phone: {employee?.phoneNumber}
							</span>
							<span className='flex items-center'>
								<MailIcon
									size={16}
									className='mr-2'
								/>
								Email: {employee?.email}
							</span>
							<span className='flex items-center'>
								<HomeIcon
									size={16}
									className='mr-2'
								/>
								Address: {employee?.address}
							</span>
						</CardDescription>
					</CardContent>
					<CardFooter>
						<button>Edit</button>
					</CardFooter>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>Absence Status</CardTitle>
					</CardHeader>
					<CardContent>
						<CardDescription>{absence}</CardDescription>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>Recent Notes</CardTitle>
					</CardHeader>
					<CardContent>
						<CardDescription className='flex flex-col space-y-1'>
							{employee?.notes.length! > 0 ? (
								employee?.notes.map((note) => (
									<span
										key={note.id}
										className='flex justify-between items-center'>
										<span className='truncate max-w-xs'>{note.content}</span>
										<span className='text-xs ml-2'>
											{note.createdAt.toLocaleDateString('en-GB', {
												day: 'numeric',
												month: 'short',
												year: 'numeric',
												hour: 'numeric',
												minute: 'numeric',
											})}
										</span>
									</span>
								))
							) : (
								<span> No notes</span>
							)}
						</CardDescription>
					</CardContent>
				</Card>
			</section>
			<Card className='mt-4'>
				<CardHeader>
					<CardTitle>Statistics for {currentMonth}</CardTitle>
				</CardHeader>
				<CardContent>
					<CardDescription className='flex flex-col space-y-1'>
						<span>Sick Days: {sickDays}</span>
						<span>Total Work Hours: {hours}</span>
					</CardDescription>
				</CardContent>
			</Card>
		</>
	)
}
