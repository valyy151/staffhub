import CreateRole from '@/app/_components/settings/create-role'
import StaffRole from '@/app/_components/settings/staff-role'
import Heading from '@/app/_components/ui/heading'
import { api } from '@/trpc/server'

export default async function RolesSettings() {
	const roles = await api.role.get.query()
	return (
		<main className='p-4'>
			<section className='mt-4'>
				<Heading
					size={'sm'}
					className='mb-2'>
					Add and manage Staff Roles
				</Heading>
				<CreateRole />
				{roles.length > 0 && (
					<div>
						<Heading className='mt-4 border-b   py-1'>My Staff Roles</Heading>
						{roles.map((role) => (
							<StaffRole
								role={role}
								key={role.id}
							/>
						))}
					</div>
				)}
			</section>
		</main>
	)
}
