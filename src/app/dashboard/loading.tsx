export default function DashboardLoading() {
	return (
		<div className='flex'>
			<div className='w-[16rem] p-4 border-r h-screen'>
				<div className='h-8 w-24 animate-pulse rounded bg-muted' />
				<div className='h-10 w-full mt-3 animate-pulse rounded bg-muted' />
				<div className='mt-4 flex space-x-2'>
					<div className='h-10 w-28 animate-pulse rounded bg-muted' />
					<div className='h-10 w-28 animate-pulse rounded bg-muted' />
				</div>
			</div>
			<div className='p-4 w-full'>
				<div className='h-8 w-96 rounded bg-muted animate-pulse' />
				<div className='h-96 mt-4 w-full rounded bg-muted animate-pulse' />
			</div>
		</div>
	)
}
