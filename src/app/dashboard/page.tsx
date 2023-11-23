import { api } from '@/trpc/server'
import DashboardTable from '../_components/dashboard/dashboard-table'
import Heading from '../_components/ui/heading'
import Link from 'next/link'

export default async function Dashboard() {
	await new Promise((resolve) => setTimeout(resolve, 2000))
	const numberOfStaff = await api.staff.getNumberOfStaff.query()

	return (
		<>
			{numberOfStaff > 0 ? (
				<DashboardTable />
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
