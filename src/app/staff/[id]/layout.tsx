"use client"
import {
  BarChart3,
  CalendarSearch,
  ClipboardList,
  HeartPulse,
  Palmtree,
  Sticker,
  UserCog,
} from "lucide-react"
import Link from "next/link"
import { usePathname, useSelectedLayoutSegment } from "next/navigation"

export default function StaffProfileLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const path = usePathname()
  const id = path.split("/")[2]

  const segment = useSelectedLayoutSegment()

  return (
    <main className="flex">
      <aside className="sticky top-0 h-screen w-fit border-r py-3 pl-2 pr-5 md:mr-4 md:p-4">
        <nav className="space-y-2">
          <Link
            href={`/staff/${id as string}`}
            className={`flex w-fit items-center rounded-lg p-2 hover:bg-accent md:w-52 md:space-x-2 ${
              segment === "(overview)" && "bg-secondary"
            }`}
          >
            <BarChart3 />
            <span className="hidden text-sm font-medium md:block">
              Overview
            </span>
          </Link>
          <Link
            href={`/staff/${id as string}/notes`}
            className={`flex w-fit items-center rounded-lg p-2 hover:bg-accent md:w-52 md:space-x-2 ${
              segment === "notes" && "bg-secondary"
            }`}
          >
            <ClipboardList />
            <span className="hidden text-sm font-medium md:block">Notes</span>
          </Link>
          <Link
            href={`/staff/${id as string}/roles`}
            className={`flex w-fit items-center rounded-lg p-2 hover:bg-accent md:w-52 md:space-x-2 ${
              segment === "roles" && "bg-secondary"
            }`}
          >
            <UserCog />
            <span className="hidden text-sm font-medium md:block">Roles</span>
          </Link>
          <Link
            href={`/staff/${id as string}/sick-leave`}
            className={`flex w-fit items-center rounded-lg p-2 hover:bg-accent md:w-52 md:space-x-2 ${
              segment === "sick-leave" && "bg-secondary"
            }`}
          >
            <HeartPulse />
            <span className="hidden text-sm font-medium md:block">
              Sick Leave
            </span>
          </Link>
          <Link
            href={`/staff/${id as string}/vacation`}
            className={`flex w-fit items-center rounded-lg p-2 hover:bg-accent md:w-52 md:space-x-2 ${
              segment === "vacation" && "bg-secondary"
            }`}
          >
            <Palmtree />
            <span className="hidden text-sm font-medium md:block">
              Vacation
            </span>
          </Link>
          <Link
            href={`/staff/${id as string}/preferences`}
            className={`flex w-fit items-center rounded-lg p-2 hover:bg-accent md:w-52 md:space-x-2 ${
              segment === "preferences" && "bg-secondary"
            }`}
          >
            <Sticker />
            <span className="hidden text-sm font-medium md:block">
              Schedule Preferences
            </span>
          </Link>
          <Link
            href={`/staff/${id as string}/schedule`}
            className={`flex w-fit items-center rounded-lg p-2 hover:bg-accent md:w-52 md:space-x-2 ${
              segment === "schedule" && "bg-secondary"
            }`}
          >
            <CalendarSearch />
            <span className="hidden text-sm font-medium md:block">
              Monthly Schedules
            </span>
          </Link>
          {/* <div className='border-t pt-4'>
						<SelectEmployee links name={employee?.name} employees={employees} />
					</div> */}
        </nav>
      </aside>
      <div className="mt-2 px-1 md:mt-4 md:px-0">{children}</div>
    </main>
  )
}
