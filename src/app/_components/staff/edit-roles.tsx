'use client'
import { useState } from 'react'
import { Button } from '../ui/button'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '../ui/alert-dialog'
import { StaffRolesOutput } from '@/trpc/shared'
import { api } from '@/trpc/react'
import { useToast } from '../ui/use-toast'
import { useRouter } from 'next/navigation'

export default function EditRoles({ employee }: { employee: StaffRolesOutput }) {
	const [showEdit, setShowEdit] = useState(false)

	const [roles, setRoles] = useState(employee?.roles ?? [])

	const { toast } = useToast()

	const router = useRouter()

	const { data: allRoles } = api.role.get.useQuery()

	const updateRoles = api.role.assignToEmployee.useMutation({
		onSuccess: () => {
			toast({ title: 'Roles updated' })
			setShowEdit(false)
			router.refresh()
		},
		onError: () => {
			toast({ title: 'Error updating roles' })
		},
	})

	return (
		<>
			<Button
				className='ml-8'
				onClick={() => setShowEdit(true)}>
				Edit Roles
			</Button>
			{showEdit && (
				<AlertDialog open>
					<AlertDialogContent>
						<AlertDialogHeader>
							<AlertDialogTitle>Roles for {employee?.name}</AlertDialogTitle>
							<AlertDialogDescription>
								{allRoles?.map((role) => (
									<div
										key={role.id}
										className='flex items-center gap-2 space-y-2'>
										<input
											type='checkbox'
											className='h-6 w-6 accent-primary cursor-pointer'
											id={role.id}
											name={role.id}
											checked={roles?.some((r) => r.id === role.id)}
											onChange={(e) => {
												e.target.checked ? setRoles([...roles, role]) : setRoles(roles.filter((r) => r.id !== role.id))
											}}
										/>
										<label
											htmlFor={role.id}
											className='cursor-pointer'>
											{role.name}
										</label>
									</div>
								))}
							</AlertDialogDescription>
						</AlertDialogHeader>

						<AlertDialogFooter>
							<AlertDialogCancel
								onClick={() => {
									setShowEdit(false)
									setRoles(employee?.roles ?? [])
								}}>
								Cancel
							</AlertDialogCancel>
							<AlertDialogAction
								disabled={updateRoles.isLoading}
								aria-disabled={updateRoles.isLoading}
								onClick={() => {
									updateRoles.mutate({ employeeId: employee?.id as string, roleIds: roles.map((r) => r.id) })
								}}>
								Continue
							</AlertDialogAction>
						</AlertDialogFooter>
					</AlertDialogContent>
				</AlertDialog>
			)}
		</>
	)
}
