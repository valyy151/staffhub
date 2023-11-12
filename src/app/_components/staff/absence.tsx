'use client'
import type { Absence } from '@/app/lib/types'
import { useToast } from '../ui/use-toast'
import { useState } from 'react'
import { api } from '@/trpc/react'
import { Trash2Icon, MoreVerticalIcon } from 'lucide-react'
import FormModal from '../ui/form-modal'
import { useRouter } from 'next/navigation'
import { Card, CardTitle, CardHeader } from '@/app/_components/ui/card'
import { howManyDays } from '@/app/lib/utils'
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '../ui/dropdown-menu'

export default function Absence({ absence, type }: { absence: Absence; type: 'vacation' | 'sick' }) {
	const [showModal, setShowModal] = useState<boolean>(false)

	const { toast } = useToast()

	const router = useRouter()

	const mutation = type === 'vacation' ? api.vacation.delete : api.sickLeave.delete

	const toastText = type === 'vacation' ? 'Vacation' : 'Sick Leave'

	const deleteAbsence = mutation.useMutation({
		onSuccess: () => {
			toast({
				title: `${toastText} deleted`,
			})
			setShowModal(false)
			router.refresh()
		},
		onError: () => {
			toast({
				title: `Error deleting ${toastText}`,
				variant: 'destructive',
			})
		},
	})

	return (
		<Card className='mb-4'>
			<CardHeader className='px-4 py-2'>
				<div className='text-md flex flex-col text-muted-foreground'>
					<div className='flex justify-between items-center pb-6'>
						<CardTitle className='text-lg'>
							Amount: {howManyDays(absence) + 1} {type === 'vacation' ? 'Vacation' : 'Sick'} {howManyDays(absence) + 1 === 1 ? 'Day' : 'Days'}
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
							{new Date(Number(absence.start)).toLocaleDateString('en-GB', {
								day: 'numeric',
								month: 'long',
								year: 'numeric',
							})}
						</span>
						<span>
							End:{' '}
							{new Date(Number(absence.end)).toLocaleDateString('en-GB', {
								day: 'numeric',
								month: 'long',
								year: 'numeric',
							})}
						</span>
					</span>
				</div>
			</CardHeader>

			{showModal && (
				<FormModal
					showModal={showModal}
					cancel={() => setShowModal(false)}
					pending={deleteAbsence.isLoading}
					submit={() => deleteAbsence.mutate({ id: absence.id })}
					heading={`Delete ${type === 'vacation' ? 'vacation' : 'sick Leave'}?`}
					text={`Are you sure you want to delete this ${type === 'vacation' ? 'vacation' : 'sick leave'}?`}
				/>
			)}
		</Card>
	)
}
