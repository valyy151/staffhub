import Image from 'next/image'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/app/_components/ui/card'
import DeleteAccount from '@/app/_components/delete-account'
import { api } from '@/trpc/server'

export default async function AccountSettings() {
	const user = await api.user.get.query()

	console.log(user)
	return (
		<main className='flex flex-col items-center mt-4'>
			<Card className='flex flex-col items-center px-8'>
				<CardHeader className='flex flex-row items-center space-x-2'>
					<Image
						width={30}
						height={30}
						className='rounded-full'
						alt={user?.name as string}
						src={user?.image as string}
					/>
					<CardTitle className='text-xl'>{user?.name}</CardTitle>
				</CardHeader>
				<CardContent>
					<CardDescription className='text-md'>Staff Members: {user?.staff}</CardDescription>
				</CardContent>
				<CardFooter>
					<DeleteAccount />
				</CardFooter>
			</Card>
		</main>
	)
}
