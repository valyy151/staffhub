'use client'

import { useState } from 'react'
import { useToast } from '../ui/use-toast'
import { api } from '@/trpc/react'
import { useRouter } from 'next/navigation'
import { UserCogIcon } from 'lucide-react'
import Heading from '../ui/heading'
import Paragraph from '../ui/paragraph'
import { Button } from '../ui/button'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '../ui/alert-dialog'
import { Input } from '../ui/input'
import FormModal from '../ui/form-modal'

type Role = {
	id: string
	numberPerDay: number | null
	name: string
	userId: string
	color: string | null
}

export default function StaffRole({ role }: { role: Role }) {
	const { toast } = useToast()
	const router = useRouter()
	const [edit, setEdit] = useState(false)
	const [showModal, setShowModal] = useState(false)

	const [name, setName] = useState(role.name)
	const [numberPerDay, setNumberPerDay] = useState(role.numberPerDay?.toString())

	const deleteStaffRole = api.role.delete.useMutation({
		onSuccess: () => {
			toast({
				title: 'Staff Role deleted successfully.',
			})
			setShowModal(false)
			router.refresh()
		},

		onError: () => {
			toast({
				title: 'There was a problem deleting the staff role.',
				variant: 'destructive',
			})
		},
	})

	const updateStaffRole = api.role.update.useMutation({
		onSuccess: () => {
			toast({
				title: 'Staff Role updated successfully.',
			})
			setEdit(false)
			router.refresh()
		},

		onError: () => {
			toast({
				title: 'There was a problem updating the staff role.',
				variant: 'destructive',
			})
		},
	})

	function handleSubmit() {
		updateStaffRole.mutate({
			name,
			staffRoleId: role.id,
			numberPerDay: Number(numberPerDay),
		})
	}

	return (
		<div className='flex h-20 items-center justify-between border-b   py-2'>
			<div className='flex items-center space-x-2'>
				<UserCogIcon size={28} />
				<Heading size={'xxs'}>{role.name}</Heading>
			</div>

			<div className='flex items-center'>
				{role.numberPerDay !== null && role.numberPerDay > 0 && (
					<>
						<Paragraph className='ml-8 '>Minimum</Paragraph>
						<Paragraph className='ml-2  font-bold'>{role.numberPerDay}</Paragraph>
						<Paragraph className='ml-2 '>per work day</Paragraph>
					</>
				)}
				<div className='space-x-2 pl-2'>
					<Button
						size={'lg'}
						onClick={() => setEdit(true)}>
						Edit
					</Button>

					<Button
						size={'lg'}
						variant={'secondary'}
						onClick={() => setShowModal(true)}>
						Delete
					</Button>
				</div>
			</div>

			{edit && (
				<AlertDialog open>
					<AlertDialogContent>
						<AlertDialogHeader>
							<AlertDialogTitle> Edit Staff Role</AlertDialogTitle>
						</AlertDialogHeader>

						<div className='mt-4'>
							<label htmlFor='name'>Name</label>

							<Input
								type='text'
								name='name'
								placeholder='Name'
								value={name}
								onChange={(e) => setName(e.target.value)}
							/>
						</div>

						<div className='mt-4'>
							<label htmlFor='numberPerDay'>Minimum per day</label>

							<Input
								type='number'
								name='numberPerDay'
								placeholder='Minimum'
								value={numberPerDay}
								className='[appearance:textfield]  [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none'
								onChange={(e) => setNumberPerDay(e.target.value)}
							/>
						</div>

						<AlertDialogFooter>
							<AlertDialogCancel onClick={() => setEdit(false)}>Cancel</AlertDialogCancel>
							<AlertDialogAction onClick={handleSubmit}>Continue</AlertDialogAction>
						</AlertDialogFooter>
					</AlertDialogContent>
				</AlertDialog>
			)}
			{showModal && (
				<FormModal
					showModal={showModal}
					heading={'Delete Staff Role?'}
					cancel={() => setShowModal(false)}
					pending={deleteStaffRole.isLoading}
					submit={() => deleteStaffRole.mutate({ id: role.id })}
					text={`Are you sure you want to delete the ${role.name} staff role?`}
				/>
			)}
		</div>
	)
}
