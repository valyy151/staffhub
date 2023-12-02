import Schedule from '@/app/_components/staff/staff-schedule'
import { api } from '@/trpc/server'

import type { Metadata } from 'next/types'

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
	const id = params.id
	const employee = await api.staff.getName.query({ id })

	return {
		title: employee?.name,
		description: `Profile for ${employee?.name}`,
		icons: [{ rel: 'icon', url: '/favicon.ico' }],
	}
}

export default async function StaffSchedule({
	params,
	searchParams,
}: {
	params: { id: string }
	searchParams: { month: string }
}) {
	const month = new Date(String(searchParams.month).split('_').reverse().join('-'))
	const employee = await api.staff.getSchedule.query({ id: params.id, month })

	return (
		<Schedule
			month={month}
			employee={employee}
		/>
	)
}
