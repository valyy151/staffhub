export default function Loading() {
	return (
		<>
			<div className='w-40 h-10 bg-accent animate-pulse rounded-md'></div>
			<section className='mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
				<div className='w-96 h-52 bg-accent animate-pulse rounded-md'></div>
				<div className='w-96 h-52 bg-accent animate-pulse'></div>
				<div className='w-96 h-52 bg-accent animate-pulse'></div>
			</section>
		</>
	)
}
