import { Loader } from "lucide-react";

export default function Loading() {
	return (
		<main className='mt-4 flex flex-col items-center'>
			<h1 className='mb-4 bg-gradient-to-r from-primary/80 to-primary/50 bg-clip-text text-5xl font-bold tracking-tighter text-transparent'>StaffHub</h1>
			<Loader
				size={28}
				className='animate-spin'
			/>
		</main>
	)
}
