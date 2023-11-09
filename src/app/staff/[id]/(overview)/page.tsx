import { Card, CardTitle, CardContent, CardDescription, CardFooter, CardHeader } from '@/app/_components/ui/card'
import { api } from '@/trpc/server'
import { PhoneIcon, MailIcon, HomeIcon } from 'lucide-react'

export default async function StaffProfile({ params }: { params: { id: string } }) {
	const employee = await api.staff.getStaffMember.query({ id: params.id })
	return (
		<div>
			<h1 className='text-3xl font-bold px-1'>{employee?.name}</h1>
			<section className='mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
				<Card>
					<CardHeader>
						<CardTitle>Personal Info</CardTitle>
					</CardHeader>

					<CardContent>
						<CardDescription>
							<p className='flex items-center'>
								<PhoneIcon size={16} className='mr-2' />
								Phone: {employee?.phoneNumber}
							</p>
							<p className='flex items-center'>
								<MailIcon size={16} className='mr-2' />
								Email: {employee?.email}
							</p>
							<p className='flex items-center'>
								<HomeIcon size={16} className='mr-2' />
								Address: {employee?.address}
							</p>
						</CardDescription>
					</CardContent>
					<CardFooter>
						<button>Edit</button>
					</CardFooter>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>Recent Notes</CardTitle>
					</CardHeader>
					<CardContent>
						<CardDescription>Notes go here</CardDescription>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>Absence Status</CardTitle>
					</CardHeader>
					<CardContent>
						<CardDescription>Status goes here</CardDescription>
					</CardContent>
				</Card>
			</section>
		</div>
	)
}
