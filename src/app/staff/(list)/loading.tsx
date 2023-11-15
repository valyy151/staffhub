export default function StaffLoading() {
	return (
		<main className='py-8 px-36'>
			<div className='flex justify-between mb-2 mt-8'>
				<div className='h-10 w-[26rem] bg-accent animate-pulse rounded-md'></div>
				<div className='flex space-x-2'>
					<div className='bg-accent animate-pulse h-10 w-[17rem] rounded-md'></div>
					<div className='bg-accent animate-pulse h-10 w-40 rounded-md'></div>
				</div>
			</div>

			<section className='w-full h-[36.5rem] bg-accent animate-pulse rounded-md'></section>
		</main>
	)
}
