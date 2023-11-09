import { api } from '@/trpc/server'

export default async function StaffPersonal({ params }: { params: { id: string } }) {
	const employee = await api.staff.getStaffMember.query({ id: params.id })
	return <div>{employee?.name} Personal</div>
}
