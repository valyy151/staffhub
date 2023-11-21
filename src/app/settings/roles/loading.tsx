export default function RolesSettingsLoading() {
	return (
		<div className='p-4'>
			<div className='h-8 w-80 rounded bg-muted animate-pulse' />
			<div className='flex space-x-2 mt-2'>
				<div className='h-10 w-36 rounded bg-muted animate-pulse' />
				<div className='h-10 w-48 rounded bg-muted animate-pulse' />
			</div>

			<div className='h-8 w-32 mt-8 rounded bg-muted animate-pulse' />
			<div className='flex gap-4 my-2'>
				<div className='h-48 w-64 rounded-md bg-muted animate-pulse' />
				<div className='h-48 w-64 rounded-md bg-muted animate-pulse' />
				<div className='h-48 w-64 rounded-md bg-muted animate-pulse' />
			</div>
		</div>
	)
}
