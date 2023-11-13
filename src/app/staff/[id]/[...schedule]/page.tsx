import { api } from '@/trpc/server'
import Schedule from '@/app/_components/staff/staff-schedule'

export default async function StaffSchedule({ params }: { params: { id: string } }) {
	const employee = await api.staff.getSchedule.query({ id: params.id })
	return <Schedule employee={employee} />
}
