'use client'
import type { Absence } from '@/app/lib/types'
import { useToast } from '../ui/use-toast'
import { useState } from 'react'
import { api } from '@/trpc/react'
import { Trash2Icon, MoreVerticalIcon } from 'lucide-react'
import FormModal from '../ui/form-modal'
import { useRouter } from 'next/navigation'
import { Card, CardTitle, CardDescription, CardHeader } from '@/app/_components/ui/card'
import { howManyDays } from '@/app/lib/utils'
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '../ui/dropdown-menu'

export default function SickLeave({ sickLeave }: { sickLeave: Absence }) {
	const [showModal, setShowModal] = useState<boolean>(false)

	const { toast } = useToast()

	const router = useRouter()

	const deleteSickLeave = api.sickLeave.delete.useMutation({
		onSuccess: () => {
			toast({
				title: 'Sick leave deleted successfully.',
			})
			setShowModal(false)
			router.refresh()
		},
		onError: () => {
			toast({
				title: 'There was a problem deleting the sick leave.',
				variant: 'destructive',
			})
		},
	})

	return (
		<Card>
			<CardHeader className='px-4 py-2'>
				<CardDescription className='text-md flex flex-col'>
					<div className='flex justify-between items-center pb-6'>
						<CardTitle className='text-lg'>
							Total: {howManyDays(sickLeave) + 1} Sick {howManyDays(sickLeave) + 1 === 1 ? 'Day' : 'Days'}
						</CardTitle>
						<DropdownMenu>
							<DropdownMenuTrigger className='focus-visible:outline-none'>
								<MoreVerticalIcon size={18} />
							</DropdownMenuTrigger>
							<DropdownMenuContent>
								<DropdownMenuItem
									className='text-sm cursor-pointer'
									onClick={() => setShowModal(true)}>
									<Trash2Icon
										size={18}
										className='mr-2'
									/>
									Delete
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					</div>
					<span className='flex justify-between'>
						<span>
							Start:{' '}
							{new Date(Number(sickLeave.start)).toLocaleDateString('en-GB', {
								day: 'numeric',
								month: 'long',
								year: 'numeric',
							})}
						</span>
						<span>
							End:{' '}
							{new Date(Number(sickLeave.end)).toLocaleDateString('en-GB', {
								day: 'numeric',
								month: 'long',
								year: 'numeric',
							})}
						</span>
					</span>
				</CardDescription>
			</CardHeader>

			{showModal && (
				<FormModal
					showModal={showModal}
					heading={'Delete sick leave?'}
					cancel={() => setShowModal(false)}
					pending={deleteSickLeave.isLoading}
					text={'Are you sure you want to delete this sick leave?'}
					submit={() => deleteSickLeave.mutate({ id: sickLeave.id })}
				/>
			)}
		</Card>
	)
}
