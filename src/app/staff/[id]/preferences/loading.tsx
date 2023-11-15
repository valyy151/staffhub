export default function StaffPreferencesLoading() {
	return (
		<div className='flex flex-col min-w-[46.5rem]'>
			<div className='flex justify-between'>
				<div className='h-11 rounded w-[30rem] bg-muted animate-pulse' />
				<div className='h-11 rounded w-56 bg-muted animate-pulse' />
			</div>

			<div className='flex justify-between w-full mt-4'>
				<div className='h-40 w-[22rem] rounded animate-pulse bg-muted' />
				<div className='h-24 w-[22rem] rounded animate-pulse bg-muted' />
			</div>
		</div>
	)
}
