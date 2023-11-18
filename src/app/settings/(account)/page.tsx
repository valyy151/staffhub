import Image from 'next/image'
import { getServerAuthSession } from '@/server/auth'
import { Card, CardFooter, CardHeader, CardTitle } from '@/app/_components/ui/card'
import DeleteAccount from '@/app/_components/delete-account'

export default async function AccountSettings() {
	const session = await getServerAuthSession()
	return (
		<main className='flex flex-col items-center mt-4'>
			<Card className='flex flex-col items-center px-8'>
				<CardHeader className='flex flex-row items-center space-x-2'>
					<Image
						width={30}
						height={30}
						className='rounded-full'
						alt={session?.user.name as string}
						src={session?.user.image as string}
					/>
					<CardTitle className='text-xl'>{session?.user.name}</CardTitle>
				</CardHeader>
				<CardFooter>
					<DeleteAccount />
				</CardFooter>
			</Card>
		</main>
	)
}
