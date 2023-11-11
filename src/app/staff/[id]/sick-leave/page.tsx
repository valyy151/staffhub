import { api } from '@/trpc/server'

export default async function StaffSickLeave({ params }: { params: { id: string } }) {
	const employee = await api.staff.getId.query({ id: params.id })
	return <div>{employee?.name} Sick Leave</div>
}
