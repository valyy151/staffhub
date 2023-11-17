export default function ScheduleLoading() {
	return (
		<div className='p-4 flex space-x-14'>
			<div className='w-fit'>
				<div className='flex justify-between'>
					<div className='h-10 w-48 rounded bg-muted animate-pulse' />
					<div className='h-10 w-56 rounded bg-muted animate-pulse' />
				</div>
				<div className='h-[81vh] mt-2 w-[50vw] rounded bg-muted animate-pulse' />
			</div>
			<div className='flex flex-col space-y-4'>
				<div className='h-10 w-52 rounded bg-muted animate-pulse' />

				<div className='h-80 w-52 rounded bg-muted animate-pulse' />
			</div>
		</div>
	)
}
