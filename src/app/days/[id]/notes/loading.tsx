export default function NotesLoading() {
	return (
		<div className='px-4'>
			<div className='h-8 w-64 bg-muted animate-pulse rounded' />

			<div className='w-full mb-4 justify-end flex'>
				<div className='h-10 w-32 bg-muted animate-pulse rounded' />
			</div>
			<div className='space-y-1'>
				<div className='h-24 w-full bg-muted animate-pulse rounded' />
				<div className='h-24 w-full bg-muted animate-pulse rounded' />
			</div>
		</div>
	)
}
