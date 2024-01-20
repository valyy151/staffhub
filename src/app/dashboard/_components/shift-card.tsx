import { formatTime } from "@/lib/utils"
import type { DashboardOutput } from "@/trpc/shared"
import { UserIcon } from "lucide-react"
import Link from "next/link"

type Shift = DashboardOutput["shifts"][number]

export default function ShiftCard({ shift }: { shift: Shift }) {
  return (
    <div
      key={shift.id}
      title={shift.employee.name}
      className="flex w-full min-w-full flex-row items-start justify-between border-b px-1 lg:flex-col 2xl:flex-row 2xl:items-center 2xl:border-b-0 2xl:px-2"
    >
      <p className="flex items-center text-xs">
        <UserIcon
          className={`ml-1 ${shift.absence?.absent && "text-rose-500"}`}
        />
        <Link
          href={`/staff/${shift.employee.id}`}
          className={`text-left hover:underline ${
            shift.absence?.absent && "text-muted-foreground"
          }`}
        >
          {shift.employee.name.split(" ")[0]}
        </Link>
      </p>
      <p className="mt-1 flex items-center text-xs font-semibold 2xl:mt-0 ">
        <span
          className={`ml-1 ${shift.absence?.absent && "text-muted-foreground"}`}
        >
          {formatTime(shift.start)}
        </span>
        <span className={`${shift.absence?.absent && "text-muted-foreground"}`}>
          -
        </span>
        <span className={`${shift.absence?.absent && "text-muted-foreground"}`}>
          {formatTime(shift.end)}
        </span>
      </p>
    </div>
  )
}
