import CreateStaffForm from '@/app/_components/staff/create-staff'

export const metadata = {
	title: 'Create Staff | StaffHub',
	description: 'Add a new staff member',
	icons: [{ rel: 'icon', url: '/favicon.ico' }],
}

export default function StaffCreate() {
	return <CreateStaffForm />
}
