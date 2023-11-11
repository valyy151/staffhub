import CreateNote from '@/app/_components/ui/create-note'
import Heading from '@/app/_components/ui/heading'
import Note from '@/app/_components/ui/note'
import { api } from '@/trpc/server'

export default async function StaffNotes({ params }: { params: { id: string } }) {
	const employee = await api.staff.getNotes.query({ id: params.id })
	return (
		<div>
			<Heading size={'sm'}>Notes for {employee?.name}</Heading>
			<CreateNote employeeId={employee?.id!!} />

			{employee?.notes.length! > 0 ? (
				<div className='mt-4'>
					{employee?.notes?.map((note) => (
						<Note
							note={note}
							employeeId={employee.id}
							key={note.id}
						/>
					))}
				</div>
			) : (
				<p className='mr-auto mt-8'>There are no notes for {employee?.name}.</p>
			)}
		</div>
	)
}