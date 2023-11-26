import { CalendarClock, Cog, FileSearch, Forward, Palmtree, Users } from "lucide-react";
import { redirect } from "next/navigation";

import { getServerAuthSession } from "@/server/auth";

import { GetStartedButton, SignInButton } from "./_components/auth-buttons";

export default async function Home() {
	const session = await getServerAuthSession()

	if (session?.user) {
		redirect('/dashboard')
	}

	return (
		<main className='mt-4 flex flex-col items-center px-2 sm:px-0'>
			<section className='w-full py-12'>
				<div className='container px-4 md:px-6'>
					<div className='grid items-center gap-6'>
						<div className='flex flex-col justify-center space-y-8 text-center'>
							<div className='space-y-2'>
								<h1 className='bg-gradient-to-r from-primary to-primary/50 bg-clip-text text-3xl font-bold tracking-tighter text-transparent sm:text-5xl xl:text-6xl/none'>
									Simplify Administration, Maximize Results
								</h1>
								<p className='mx-auto max-w-[600px] md:text-xl'>Designed to enhance your productivity and streamline your workflow.</p>
							</div>
							<div className='mx-auto w-full max-w-full space-y-4'>
								<div className='grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3'>
									<div className='flex flex-col items-center space-y-2 rounded-lg border-gray-800 p-4'>
										<div className='p-2'>
											<Users />
										</div>
										<h2 className='text-xl font-bold '>Staff Overview</h2>
										<p>All your staff in one place. See their shifts, availability, and contact information.</p>
									</div>
									<div className='flex flex-col items-center space-y-2 rounded-lg border-gray-800 p-4'>
										<div className='p-2'>
											<CalendarClock />
										</div>
										<h2 className='text-xl font-bold '>Schedule Planing</h2>
										<p>Create and share schedules with your staff. Easily add or remove shifts.</p>
									</div>{' '}
									<div className='flex flex-col items-center space-y-2 rounded-lg border-gray-800 p-4'>
										<div className=' p-2'>
											<Forward />
										</div>
										<h2 className='text-xl font-bold '>Share Documents</h2>
										<p>Share schedules and documents with your team easily.</p>
									</div>
									<div className='flex flex-col items-center space-y-2 rounded-lg border-gray-800 p-4'>
										<div className='p-2'>
											<Palmtree />
										</div>
										<h2 className='text-xl font-bold '>Vacation and Sick Days</h2>
										<p>Plan vacations for your staff and keep track of their sick days.</p>
									</div>
									<div className='flex flex-col items-center space-y-2 rounded-lg border-gray-800 p-4'>
										<div className='p-2'>
											<FileSearch />
										</div>
										<h2 className='text-xl font-bold '>Keep Track of Everything</h2>
										<p>Keep track of your staff's hours, notes, overtime, and more.</p>
									</div>
									<div className='flex flex-col items-center space-y-2 rounded-lg border-gray-800 p-4'>
										<div className='p-2'>
											<Cog />
										</div>
										<h2 className='text-xl font-bold '>Advanced Customization</h2>
										<p>Every business is different. Customize StaffHub to fit your needs.</p>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>

			<div className='flex space-x-1'>
				<SignInButton text='Get Started' />
				<GetStartedButton />
			</div>
		</main>
	)
}
