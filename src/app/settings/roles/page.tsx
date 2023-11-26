import CreateRole from '@/app/_components/settings/create-role'
import StaffRole from '@/app/_components/settings/staff-role'
import Heading from '@/app/_components/ui/heading'
import { api } from '@/trpc/server'

export const metadata = {
	title: 'Settings | StaffHub',
	description: 'Manage your account settings.',
	icons: [{ rel: 'icon', url: '/favicon.ico' }],
}

export default async function RolesSettings() {
	const roles = await api.role.get.query()
	return (
		<section className='p-4'>
			<Heading
				size={'xs'}
				className='mb-2'>
				Add and manage Staff Roles
			</Heading>
			<CreateRole />
			<Heading
				size={'xxs'}
				className='mt-8 mb-2'>
				My Staff Roles
			</Heading>
			{roles.length > 0 && (
				<div className='flex gap-4 flex-wrap max-w-4xl'>
					{roles.map((role) => (
						<StaffRole
							role={role}
							key={role.id}
						/>
					))}
				</div>
			)}
		</section>
	)
}
