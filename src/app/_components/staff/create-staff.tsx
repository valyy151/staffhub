'use client'

import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/app/_components/ui/card'
import { Input } from '@/app/_components/ui/input'
import { useToast } from '@/app/_components/ui/use-toast'
import { createStaff } from '@/server/api/routers/actions/staff'
import { useFormState, useFormStatus } from 'react-dom'
import { Button } from '../ui/button'
import { useEffect } from 'react'

export default function CreateStaffForm() {
	const { toast } = useToast()
	const initialState = { message: null }

	const [state, formAction] = useFormState(createStaff, initialState)

	useEffect(() => {
		state?.message && toast({ title: state?.message })
	}, [state])

	return (
		<form action={formAction} className='mb-10 mt-20 flex-grow'>
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
								<Input id='firstName' name='firstName' placeholder='John' />
							</div>
							<div className='space-y-2'>
								<label htmlFor='lastName'>Last name</label>
								<Input id='lastName' name='lastName' placeholder='Doe' />
							</div>
						</div>
						<div className='space-y-2'>
							<label htmlFor='email'>Email</label>
							<Input id='email' name='email' type='string' placeholder='johndoe@example.com' />
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
					<SubmitButton />
				</CardFooter>
			</Card>
		</form>
	)
}

function SubmitButton() {
	const { pending } = useFormStatus()
	return (
		<Button type='submit' className='w-full' disabled={pending} aria-disabled={pending}>
			Create User
		</Button>
	)
}
