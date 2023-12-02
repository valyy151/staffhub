import Link from 'next/link'

import { api } from '@/trpc/server'

import DashboardTable from '../_components/dashboard/dashboard-table'
import Heading from '../_components/ui/heading'

export const metadata = {
	title: 'Dashboard | StaffHub',
	description: 'Dashboard for StaffHub',
	icons: [{ rel: 'icon', url: '/favicon.ico' }],
}

export default async function Dashboard() {
	const numberOfStaff = await api.staff.getNumberOfStaff.query()

	return (
		<>
			{numberOfStaff > 0 ? (
				<DashboardTable />
			) : (
				<div className='flex flex-col items-center py-4'>
					<Heading size={'sm'}>It seems like you don't have any staff members yet.</Heading>
					<Link
						href={'/staff/create'}
						className='bg-primary px-4 py-2 rounded-md text-secondary mt-2'>
						Add one
					</Link>
				</div>
			)}
		</>
	)
}
