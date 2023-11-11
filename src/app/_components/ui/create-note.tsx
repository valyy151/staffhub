'use client'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/app/_components/ui/alert-dialog'
import { api } from '@/trpc/react'
import { useState } from 'react'
import { useToast } from './use-toast'
import { Button } from './button'
import { ScrollTextIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function CreateNote({ employeeId }: { employeeId: string }) {
	const [content, setContent] = useState('')
	const [showAddNote, setShowAddNote] = useState(false)

	const router = useRouter()

	const { toast } = useToast()

	const createNoteMutation = api.staffNote.create.useMutation({
		onSuccess: () => {
			toast({
				title: 'Note created successfully',
			})
			setContent('')
			router.refresh()
			setShowAddNote(false)
		},

		onError: () => {
			toast({
				title: 'There was a problem creating the note',
				variant: 'destructive',
			})
		},
	})

	return (
		<>
			<Button
				onClick={() => setShowAddNote(true)}
				className='mt-2 w-fit'>
				<ScrollTextIcon className='mr-2' />
				New Note
			</Button>
			{showAddNote && (
				<AlertDialog open={showAddNote}>
					<AlertDialogContent>
						<AlertDialogHeader>
							<AlertDialogTitle> Add a Note</AlertDialogTitle>
						</AlertDialogHeader>
						<textarea
							rows={4}
							cols={40}
							value={content}
							placeholder=' Add a note...'
							className='dark:focus: resize-none rounded-lg border   bg-transparent px-3 py-2 placeholder:text-gray-500 focus:border-black focus:ring-black disabled:cursor-not-allowed disabled:opacity-50 dark:bg-transparent dark:text-gray-50 dark:placeholder:text-gray-400 dark:focus:ring-gray-300'
							onChange={(e) => setContent(e.target.value)}
						/>
						<AlertDialogFooter>
							<AlertDialogCancel onClick={() => setShowAddNote(false)}>Cancel</AlertDialogCancel>
							<AlertDialogAction
								disabled={createNoteMutation.isLoading}
								aria-disabled={createNoteMutation.isLoading}
								onClick={() => createNoteMutation.mutate({ content, employeeId })}>
								Continue
							</AlertDialogAction>
						</AlertDialogFooter>
					</AlertDialogContent>
				</AlertDialog>
			)}
		</>
	)
}
