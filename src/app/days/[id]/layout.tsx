'use client'
import Link from 'next/link'
import { ClockIcon, ClipboardListIcon, UserCogIcon } from 'lucide-react'
import { usePathname, useSelectedLayoutSegment } from 'next/navigation'

export default function WorkDayLayout({ children }: { children: React.ReactNode }) {
	const path = usePathname()
	const id = path.split('/')[2]

	const segment = useSelectedLayoutSegment()

	return (
		<div className='flex'>
			<aside className='sticky top-0 h-screen w-56 border-r p-4'>
				<nav className='space-y-2'>
					<Link
						scroll={false}
						href={`/days/${id as string}/shifts`}
						className={`flex w-full items-center space-x-2 rounded-lg px-2 py-2 hover:bg-accent ${segment === 'shifts' && 'bg-secondary'}`}>
						<ClockIcon />
						<span className='text-sm font-medium'>Shifts</span>
					</Link>
					<Link
						scroll={false}
						href={`/days/${id as string}/notes`}
						className={`flex w-full items-center space-x-2 rounded-lg px-2 py-2 hover:bg-accent ${segment === 'notes' && 'bg-secondary'}`}>
						<ClipboardListIcon />
						<span className='text-sm font-medium'>Notes</span>
					</Link>
					<Link
						scroll={false}
						href={`/days/${id as string}/roles`}
						className={`flex w-full items-center space-x-2 rounded-lg px-2 py-2 hover:bg-accent ${segment === 'roles' && 'bg-secondary'}`}>
						<UserCogIcon />
						<span className='text-sm font-medium'>Roles</span>
					</Link>
				</nav>
			</aside>
			<main className='pt-4 w-full'>{children}</main>
		</div>
	)
}
