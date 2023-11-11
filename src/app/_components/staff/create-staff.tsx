'use client'

import { useState } from 'react'
import { api } from '@/trpc/react'
import { Button } from '../ui/button'
import { useRouter } from 'next/navigation'
import { Input } from '@/app/_components/ui/input'
import { useToast } from '@/app/_components/ui/use-toast'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/app/_components/ui/card'

export default function CreateStaffForm() {
	const [email, setEmail] = useState('')
	const [lastName, setLastName] = useState('')
	const [firstName, setFirstName] = useState('')

	const { toast } = useToast()

	const router = useRouter()

	const createStaff = api.staff.create.useMutation({
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

		createStaff.mutate({ email, firstName, lastName })
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

						{/* {roles?.length! > 0 && (
            <div className="space-y-2">
              <label htmlFor="role">Role</label>
              <Select onValueChange={(value) => setRole(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Role</SelectLabel>
                    {roles?.map((role) => (
                      <SelectItem key={role.id} value={role.id}>
                        {role.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          )} */}
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
