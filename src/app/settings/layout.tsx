'use client'
import Link from 'next/link'
import { useSelectedLayoutSegment } from 'next/navigation'
import { ClipboardListIcon, ClockIcon, UserCogIcon } from 'lucide-react'

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
	const segment = useSelectedLayoutSegment()

	return (
		<div className='flex'>
			<aside className='sticky top-0 h-screen w-56 border-r p-4'>
				<nav className='space-y-2'>
					<Link
						scroll={false}
						href={`/settings`}
						className={`flex w-full items-center space-x-2 rounded-lg px-2 py-2 hover:bg-accent ${segment === '(account)' && 'bg-secondary'}`}>
						<ClockIcon />
						<span className='text-sm font-medium'>Account</span>
					</Link>
					<Link
						scroll={false}
						href={`/settings/roles`}
						className={`flex w-full items-center space-x-2 rounded-lg px-2 py-2 hover:bg-accent ${segment === 'roles' && 'bg-secondary'}`}>
						<ClipboardListIcon />
						<span className='text-sm font-medium'>Staff Roles</span>
					</Link>
					<Link
						scroll={false}
						href={`/settings/shift-models`}
						className={`flex w-full items-center space-x-2 rounded-lg px-2 py-2 hover:bg-accent ${segment === 'shift-models' && 'bg-secondary'}`}>
						<UserCogIcon />
						<span className='text-sm font-medium'>Shift Models</span>
					</Link>
				</nav>
			</aside>
			<main className='w-full'>{children}</main>
		</div>
	)
}
