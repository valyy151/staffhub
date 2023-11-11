'use client'

import { useRouter } from 'next/navigation'
import { useToast } from '../ui/use-toast'
import { useState } from 'react'
import { api } from '@/trpc/react'
import { Button } from '../ui/button'
import FormModal from '../ui/form-modal'

export default function DeleteStaff({ id }: { id: string }) {
	const { toast } = useToast()

	const router = useRouter()

	const [showModal, setShowModal] = useState(false)

	const deleteStaff = api.staff.delete.useMutation({
		onSettled(_, error) {
			if (error) {
				toast({
					title: 'Error Deleting Staff Member',
					variant: 'destructive',
					description: JSON.parse(error.message)[0].message ?? 'Unknown error',
				})
			} else {
				setShowModal(false)
				router.push('/staff')
				router.refresh()
				toast({ title: 'Staff Member Deleted' })
			}
		},
	})

	return (
		<>
			<Button
				className='mt-4'
				variant={'destructive'}
				onClick={() => setShowModal(true)}>
				Delete Employee
			</Button>
			{showModal && (
				<FormModal
					showModal={showModal}
					pending={deleteStaff.isLoading}
					cancel={() => setShowModal(false)}
					submit={() => deleteStaff.mutate({ id })}
					text='Are you sure you want to delete this employee?'
				/>
			)}
		</>
	)
}
