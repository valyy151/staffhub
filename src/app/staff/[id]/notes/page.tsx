import CreateNote from '@/app/_components/ui/create-note'
import Heading from '@/app/_components/ui/heading'
import Note from '@/app/_components/ui/note'
import { api } from '@/trpc/server'
import type { Metadata } from 'next/types'

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
	const id = params.id
	const employee = await api.staff.getName.query({ id })

	return {
		title: employee?.name,
		openGraph: { images: ['/favicon.ico'] },
		description: `Profile for ${employee?.name}`,
	}
}

export default async function StaffNotes({ params }: { params: { id: string } }) {
	const employee = await api.staff.getNotes.query({ id: params.id })
	return (
		<div>
			<div className='flex justify-between items-center'>
				<Heading
					size={'xs'}
					className='min-w-[28rem]'>
					Notes for {employee?.name}
				</Heading>
				<CreateNote
					id={employee?.id as string}
					type='employee'
				/>
			</div>

			{employee?.notes.length! > 0 ? (
				<div className='mt-4'>
					{employee?.notes?.map((note) => (
						<Note
							note={note}
							key={note.id}
							type='employee'
						/>
					))}
				</div>
			) : (
				<p className='mr-auto mt-8'>There are no notes for {employee?.name}.</p>
			)}
		</div>
	)
}
