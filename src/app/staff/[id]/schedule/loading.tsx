export default function StaffScheduleLoading() {
	return (
		<div className='flex flex-col'>
			<div className='h-8 rounded w-[28rem] bg-muted animate-pulse' />
			<div className='flex mt-4 space-x-10'>
				<div className='h-[46.2rem] bg-muted animate-pulse min-w-[40vw] rounded' />
				<div className='flex flex-col'>
					<div className='bg-muted animate-pulse rounded h-[20.5rem] w-[22rem]' />
					<div className='bg-muted animate-pulse rounded-md h-11 w-36 mt-2' />
				</div>
			</div>
		</div>
	)
}
