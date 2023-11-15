export default function StaffSickLeaveLoading() {
	return (
		<div className='flex flex-col'>
			<div className='flex justify-between'>
				<div className='h-11 rounded w-80 bg-muted animate-pulse' />
				<div className='h-11 rounded w-40 bg-muted animate-pulse' />
			</div>
			<div className='mt-4 space-y-2'>
				<div className='h-16 rounded animate-pulse bg-muted w-[46rem]' />
			</div>

			<div className='h-12 mt-10 mb-2 rounded w-56 bg-muted animate-pulse' />
			<div className='space-y-4'>
				<div className='h-[5.7rem] rounded animate-pulse bg-muted w-[46rem]' />
				<div className='h-[5.7rem] rounded animate-pulse bg-muted w-[46rem]' />
				<div className='h-[5.7rem] rounded animate-pulse bg-muted w-[46rem]' />
			</div>
		</div>
	)
}
