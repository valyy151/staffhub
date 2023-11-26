import Image from "next/image";

import DeleteAccount from "@/app/_components/delete-account";
import {
    Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle
} from "@/app/_components/ui/card";
import { api } from "@/trpc/server";

export const metadata = {
	title: 'Settings | StaffHub',
	description: 'Manage your account settings.',
	icons: [{ rel: 'icon', url: '/favicon.ico' }],
}

export default async function AccountSettings() {
	const user = await api.user.get.query()

	return (
		<main className='p-4'>
			<Card className='flex w-fit flex-col min-w-[20rem]'>
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
