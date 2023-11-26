import Schedule from '@/app/_components/staff/staff-schedule'
import { api } from '@/trpc/server'

import type { Metadata } from 'next/types'

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
	const id = params.id
	const employee = await api.staff.getName.query({ id })

	return {
		title: employee?.name,
		openGraph: { images: ['/favicon.ico'] },
		description: `Profile for ${employee?.name}`,
	}
}

export default async function StaffSchedule({ params }: { params: { id: string } }) {
	const employee = await api.staff.getSchedule.query({ id: params.id })
	return <Schedule employee={employee} />
}
