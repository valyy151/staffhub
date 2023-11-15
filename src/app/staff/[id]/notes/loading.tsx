export default function StaffNotesLoading() {
	return (
		<div className='flex flex-col mt-2'>
			<div className='flex justify-between'>
				<div className='h-11 rounded w-80 bg-muted animate-pulse' />
				<div className='h-11 rounded w-32 bg-muted animate-pulse ml-44' />
			</div>
			<div className='mt-4 space-y-2'>
				<div className='w-full h-24 rounded animate-pulse bg-muted' />
				<div className='w-full h-24 rounded animate-pulse bg-muted' />
				<div className='w-full h-24 rounded animate-pulse bg-muted' />
				<div className='w-full h-24 rounded animate-pulse bg-muted' />
				<div className='w-full h-24 rounded animate-pulse bg-muted' />
			</div>
		</div>
	)
}
