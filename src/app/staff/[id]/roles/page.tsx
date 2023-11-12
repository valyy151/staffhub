import EditRoles from '@/app/_components/staff/edit-roles'
import RolesTable from '@/app/_components/staff/roles-table'
import Heading from '@/app/_components/ui/heading'
import { api } from '@/trpc/server'

export default async function StaffRoles({ params }: { params: { id: string } }) {
	const employee = await api.staff.getRoles.query({ id: params.id })
	return (
		<div>
			<div className='flex justify-between items-center'>
				<Heading size={'xs'}>Roles for {employee?.name}</Heading>
				<EditRoles employee={employee} />
			</div>

			{employee?.roles.length! > 0 ? <RolesTable roles={employee?.roles} /> : <p className='mr-auto mt-8'>There are no roles for {employee?.name}.</p>}
		</div>
	)
}
