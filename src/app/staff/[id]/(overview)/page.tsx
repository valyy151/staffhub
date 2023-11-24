import { api } from '@/trpc/server'
import type { Metadata } from 'next/types'
import DeleteStaff from '@/app/_components/staff/delete-staff'
import ProfileCards from '@/app/_components/staff/profile-cards'

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
	const id = params.id
	const employee = await api.staff.getName.query({ id })

	return {
		title: employee?.name,
		openGraph: { images: ['/favicon.ico'] },
		description: `Profile for ${employee?.name}`,
	}
}

export default async function StaffProfile({ params }: { params: { id: string } }) {
	const employee = await api.staff.getId.query({ id: params.id })

	return (
		<div>
			<h1 className='text-3xl font-bold px-1'>{employee?.name}</h1>
			<ProfileCards employee={employee} />
			<DeleteStaff id={params.id} />
		</div>
	)
}
