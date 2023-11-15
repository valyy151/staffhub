'use client'
import Link from 'next/link'
import { usePathname, useSelectedLayoutSegment } from 'next/navigation'
import { BarChart3, ClipboardList, HeartPulse, UserCog, Palmtree, Sticker, CalendarSearch } from 'lucide-react'

export default function StaffProfileLayout({ children }: { children: React.ReactNode }) {
	const path = usePathname()
	const id = path.split('/')[2]

	const segment = useSelectedLayoutSegment()

	console.log(segment)

	return (
		<main className='flex'>
			<aside className='sticky top-0 mr-4 h-screen w-fit border-r p-4'>
				<nav className='space-y-2'>
					<Link
						href={`/staff/${id as string}`}
						className={`flex w-52 items-center space-x-2 rounded-lg px-2 py-2 hover:bg-accent ${segment === '(overview)' && 'bg-secondary'}`}>
						<BarChart3 />
						<span className='text-sm font-medium'>Overview</span>
					</Link>
					<Link
						href={`/staff/${id as string}/notes`}
						className={`flex w-52 items-center space-x-2 rounded-lg px-2 py-2 hover:bg-accent ${segment === 'notes' && 'bg-secondary'}`}>
						<ClipboardList />
						<span className='text-sm font-medium'>Notes</span>
					</Link>
					<Link
						href={`/staff/${id as string}/roles`}
						className={`flex w-52 items-center space-x-2 rounded-lg px-2 py-2 hover:bg-accent ${segment === 'roles' && 'bg-secondary'}`}>
						<UserCog />
						<span className='text-sm font-medium'>Roles</span>
					</Link>
					<Link
						href={`/staff/${id as string}/sick-leave`}
						className={`flex w-52 items-center space-x-2 rounded-lg px-2 py-2 hover:bg-accent ${segment === 'sick-leave' && 'bg-secondary'}`}>
						<HeartPulse />
						<span className='text-sm font-medium'>Sick Leave</span>
					</Link>
					<Link
						href={`/staff/${id as string}/vacation`}
						className={`flex w-52 items-center space-x-2 rounded-lg px-2 py-2 hover:bg-accent ${segment === 'vacation' && 'bg-secondary'}`}>
						<Palmtree />
						<span className='text-sm font-medium'>Vacation</span>
					</Link>
					<Link
						href={`/staff/${id as string}/preferences`}
						className={`flex w-52 items-center space-x-2 rounded-lg px-2 py-2 hover:bg-accent ${segment === 'preferences' && 'bg-secondary'}`}>
						<Sticker />
						<span className='text-sm font-medium'>Schedule Preferences</span>
					</Link>
					<Link
						href={`/staff/${id as string}/schedule`}
						className={`flex w-52 items-center space-x-2 rounded-lg px-2 py-2 hover:bg-accent ${segment === 'schedule' && 'bg-secondary'}`}>
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
