"use client"
import { ClipboardListIcon, UserCogIcon, UserIcon } from "lucide-react"
import Link from "next/link"
import { useSelectedLayoutSegment } from "next/navigation"

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const segment = useSelectedLayoutSegment()

  return (
    <div className="flex">
      <aside className="sticky top-0 h-screen border-r p-4 md:w-56">
        <nav className="space-y-2">
          <Link
            scroll={false}
            href={`/settings`}
            className={`flex w-full items-center gap-2 rounded-lg px-2 py-2 hover:bg-accent ${
              segment === "(account)" && "bg-secondary"
            }`}
          >
            <UserIcon />
            <span className="hidden text-sm font-medium md:inline-flex">
              Account
            </span>
          </Link>
          <Link
            scroll={false}
            href={`/settings/roles`}
            className={`flex w-full items-center space-x-2 rounded-lg px-2 py-2 hover:bg-accent ${
              segment === "roles" && "bg-secondary"
            }`}
          >
            <ClipboardListIcon />
            <span className="hidden text-sm font-medium md:inline-flex">
              Staff Roles
            </span>
          </Link>
          <Link
            scroll={false}
            href={`/settings/shift-models`}
            className={`flex w-full items-center space-x-2 rounded-lg px-2 py-2 hover:bg-accent ${
              segment === "shift-models" && "bg-secondary"
            }`}
          >
            <UserCogIcon />
            <span className="hidden text-sm font-medium md:inline-flex">
              Shift Models
            </span>
          </Link>
        </nav>
      </aside>
      <main className="w-full">{children}</main>
    </div>
  )
}
