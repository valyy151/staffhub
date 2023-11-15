export default function Loading() {
	return (
		<>
			<div className='w-40 h-10 bg-muted animate-pulse rounded' />
			<section className='mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
				<div className='w-96 h-52 bg-muted animate-pulse rounded' />
				<div className='w-96 h-52 bg-muted animate-pulse' />
				<div className='w-96 h-52 bg-muted animate-pulse' />
			</section>
			<div className='w-full h-52 bg-muted animate-pulse mt-4' />
		</>
	)
}
