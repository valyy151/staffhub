'use client'

import { HeartPulseIcon, MoreVerticalIcon, Trash2Icon } from 'lucide-react'
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '../ui/dropdown-menu'
import Heading from '../ui/heading'
import { Absence } from '@/app/lib/types'
import { useState } from 'react'
import FormModal from '../ui/form-modal'
import { useToast } from '../ui/use-toast'
import { api } from '@/trpc/react'
import { useRouter } from 'next/navigation'

export default function sickLeave({ sickLeave }: { sickLeave: Absence }) {
	const [showModal, setShowModal] = useState(false)

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
		<div className='bg-red-500 px-2 text-white rounded-md border mt-4 py-2 flex justify-between items-center'>
			<Heading
				size={'xxs'}
				className='flex items-center'>
				<HeartPulseIcon
					size={42}
					className='ml-1 mr-2'
				/>
				Currently Sick
			</Heading>

			<p className='font-semibold'>
				{new Date(Number(sickLeave?.start)).toLocaleDateString(undefined, {
					month: 'short',
					day: 'numeric',
					year: 'numeric',
				})}{' '}
				-{' '}
				{new Date(Number(sickLeave?.end)).toLocaleDateString(undefined, {
					month: 'short',
					day: 'numeric',
					year: 'numeric',
				})}
			</p>
			<p className='font-semibold'>Ends in {Math.round((Number(sickLeave?.end) - Date.now()) / 86400000)} days</p>

			<DropdownMenu>
				<DropdownMenuTrigger className='focus-visible:outline-none'>
					<MoreVerticalIcon size={20} />
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
		</div>
	)
}
