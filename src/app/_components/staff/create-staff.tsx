'use client'

import { InfoIcon } from "lucide-react";
import { useRouter } from "next-nprogress-bar";
import { useState } from "react";

import {
    Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle
} from "@/app/_components/ui/card";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/app/_components/ui/hover-card";
import { Input } from "@/app/_components/ui/input";
import { useToast } from "@/app/_components/ui/use-toast";
import { api } from "@/trpc/react";

import { Button } from "../ui/button";

export default function CreateStaffForm() {
	const [email, setEmail] = useState('')
	const [lastName, setLastName] = useState('')
	const [firstName, setFirstName] = useState('')

	const [phone, setPhone] = useState('')
	const [address, setAddress] = useState('')

	const { toast } = useToast()

	const router = useRouter()

	const createStaff = api.staff.createOrUpdate.useMutation({
		onSettled(_, error) {
			if (error) {
				toast({
					title: 'Error Creating Staff Member',
					variant: 'destructive',
					description: JSON.parse(error.message)[0].message ?? 'Unknown error',
				})
			} else {
				router.push('/staff')
				router.refresh()
				toast({ title: 'Staff Member Created' })
			}
		},
	})

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		if (!email || !firstName || !lastName) {
			return toast({
				title: 'Please fill out all fields',
				variant: 'destructive',
			})
		}

		createStaff.mutate({ email, firstName, lastName, phone, address })
	}

	return (
		<form
			onSubmit={handleSubmit}
			className='mb-10 mt-20 flex-grow'>
			<Card className='mx-auto max-w-2xl'>
				<CardHeader>
					<CardTitle>Create a New Employee</CardTitle>
					<CardDescription>Fill out the form below to create a new employee.</CardDescription>
				</CardHeader>
				<CardContent>
					<div className='space-y-4'>
						<div className='grid grid-cols-2 gap-4'>
							<div className='space-y-2'>
								<label htmlFor='firstName'>First name</label>
								<Input
									autoFocus
									id='firstName'
									name='firstName'
									value={firstName}
									placeholder='John'
									onChange={(e) => setFirstName(e.target.value)}
								/>
							</div>
							<div className='space-y-2'>
								<label htmlFor='lastName'>Last name</label>
								<Input
									id='lastName'
									name='lastName'
									value={lastName}
									placeholder='Doe'
									onChange={(e) => setLastName(e.target.value)}
								/>
							</div>
						</div>
						<div className='space-y-2'>
							<label htmlFor='email'>Email</label>
							<Input
								id='email'
								name='email'
								type='string'
								value={email}
								placeholder='johndoe@example.com'
								onChange={(e) => setEmail(e.target.value)}
							/>
						</div>
						<h2 className='border-t pt-2 font-bold flex items-center'>
							Optional Fields
							<HoverCard>
								<HoverCardTrigger>
									<InfoIcon
										size={18}
										className='ml-2 cursor-pointer'
									/>
								</HoverCardTrigger>
								<HoverCardContent className='text-sm'>You can fill out these fields later if you want.</HoverCardContent>
							</HoverCard>
						</h2>
						<div className='flex space-x-2'>
							<div className='space-y-2 w-full'>
								<label htmlFor='address'>Address</label>
								<Input
									id='address'
									name='address'
									type='string'
									value={address}
									placeholder='123 Main St.'
									onChange={(e) => setAddress(e.target.value)}
								/>
							</div>
							<div className='space-y-2 w-full'>
								<label htmlFor='phone'>Phone</label>
								<Input
									id='phone'
									name='phone'
									type='string'
									value={phone}
									placeholder='(555) 555-5555'
									onChange={(e) => setPhone(e.target.value)}
								/>
							</div>
						</div>
					</div>
				</CardContent>
				<CardFooter>
					<Button
						type='submit'
						className='w-full'
						disabled={createStaff.isLoading}
						aria-disabled={createStaff.isLoading}>
						Create User
					</Button>
				</CardFooter>
			</Card>
		</form>
	)
}
