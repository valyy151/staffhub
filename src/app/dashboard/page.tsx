import { api } from '@/trpc/server'
import DashboardTable from '../_components/dashboard/dashboard-table'
import Heading from '../_components/ui/heading'
import Link from 'next/link'

export default async function Dashboard({ searchParams }: { searchParams: { page: string; month: string } }) {
	const { page, month } = searchParams

	const [numberOfStaff, shifts] = await Promise.all([
		api.staff.getNumberOfStaff.query(),
		api.dashboard.find.query({
			page: Number(page),
			month: new Date(String(month).split('/').reverse().join('-')),
		}),
	])

	return (
		<>
			{numberOfStaff > 0 ? (
				<DashboardTable shifts={shifts} />
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
