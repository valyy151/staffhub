import Link from 'next/link'

import { api } from '@/trpc/server'

import SchedulePlanner from '../_components/schedule/schedule-planner'
import Heading from '../_components/ui/heading'

export const metadata = {
	title: 'New Schedule | StaffHub',
	description: 'Create a new schedule.',
	icons: [{ rel: 'icon', url: '/favicon.ico' }],
}

export default async function SchedulePage() {
	const [shiftModels, numberOfStaff] = await Promise.all([api.shiftModel.get.query(), api.staff.getNumberOfStaff.query()])

	return (
		<>
			{numberOfStaff > 0 ? (
				<SchedulePlanner shiftModels={shiftModels} />
			) : (
				<main className='flex flex-col items-center py-4'>
					<Heading size={'sm'}>It seems like you don't have any staff members yet.</Heading>
					<Link
						href={'/staff/create'}
						className='bg-primary px-4 py-2 rounded-md text-secondary mt-2'>
						Add one
					</Link>
				</main>
			)}
		</>
	)
}
