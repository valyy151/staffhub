'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { BarChart3, ClipboardList, HeartPulse, UserCog, Palmtree, Sticker, CalendarSearch } from 'lucide-react'

export default function StaffProfileLayout({ children }: { children: React.ReactNode }) {
	const path = usePathname()
	const id = path.split('/')[2]

	return (
		<main className='flex'>
			<aside className='sticky top-0 mr-4 h-screen w-64 border-r p-4'>
				<nav className='space-y-2'>
					<Link
						href={`/staff/${id}`}
						className={`flex w-full items-center space-x-2 rounded-lg px-2 py-2 hover:bg-accent ${path.endsWith(id as string) && 'bg-secondary'}`}>
						<BarChart3 />
						<span className='text-sm font-medium'>Overview</span>
					</Link>
					<Link
						href={`/staff/${id}/notes`}
						className={`flex w-full items-center space-x-2 rounded-lg px-2 py-2 hover:bg-accent ${path.endsWith('notes') && 'bg-secondary'}`}>
						<ClipboardList />
						<span className='text-sm font-medium'>Notes</span>
					</Link>
					<Link
						href={`/staff/${id}/roles`}
						className={`flex w-full items-center space-x-2 rounded-lg px-2 py-2 hover:bg-accent ${path.endsWith('roles') && 'bg-secondary'}`}>
						<UserCog />
						<span className='text-sm font-medium'>Roles</span>
					</Link>
					<Link
						href={`/staff/${id}/sick-leave`}
						className={`flex w-full items-center space-x-2 rounded-lg px-2 py-2 hover:bg-accent ${path.endsWith('sick-leave') && 'bg-secondary'}`}>
						<HeartPulse />
						<span className='text-sm font-medium'>Sick Leave</span>
					</Link>
					<Link
						href={`/staff/${id}/vacation`}
						className={`flex w-full items-center space-x-2 rounded-lg px-2 py-2 hover:bg-accent ${path.endsWith('vacation') && 'bg-secondary'}`}>
						<Palmtree />
						<span className='text-sm font-medium'>Vacation</span>
					</Link>
					<Link
						href={`/staff/${id}/preferences`}
						className={`flex w-full items-center space-x-2 rounded-lg px-2 py-2 hover:bg-accent ${path.endsWith('preferences') && 'bg-secondary'}`}>
						<Sticker />
						<span className='text-sm font-medium'>Schedule Preferences</span>
					</Link>
					<Link
						href={`/staff/${id}/schedule`}
						className={`flex w-full items-center space-x-2 rounded-lg px-2 py-2 hover:bg-accent ${path.includes('schedule') && 'bg-secondary'}`}>
						<CalendarSearch />
						<span className='text-sm font-medium'>Monthly Schedules</span>
					</Link>
					{/* <div className='border-t pt-4'>
						<SelectEmployee links name={employee?.name} employees={employees} />
					</div> */}
				</nav>
			</aside>
			<div className='mt-4'>{children}</div>
		</main>
	)
}
