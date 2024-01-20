import Heading from "@/app/_components/ui/heading"
import Paragraph from "@/app/_components/ui/paragraph"
import { formatDate, formatDay } from "@/lib/utils"
import type { DashboardOutput } from "@/trpc/shared"
import { CalendarOffIcon, ScrollIcon, ScrollTextIcon } from "lucide-react"
import Link from "next/link"
import ShiftCard from "./shift-card"

export default function WorkDayCard({
  index,
  day,
}: {
  index: number
  day: DashboardOutput
}) {
  return (
    <div
      key={day.id}
      className={`lg:border-y-none flex w-full flex-col items-center rounded-lg border-x border-y shadow lg:rounded-none lg:shadow-none  ${
        index === 0 && "rounded-s-lg"
      } ${index === 6 && "rounded-e-lg"}`}
    >
      <Link
        href={`/days/${day.id}/shifts`}
        className="group flex w-full flex-col items-center"
      >
        <Heading size={"xxs"} className="px-3 pt-6">
          {formatDay(day.date, "long")}
        </Heading>
        <Paragraph className="flex w-full max-w-full flex-col items-center border-b-2 py-2 duration-150 group-hover:border-primary">
          {day && formatDate(day.date, "short")}
        </Paragraph>
      </Link>
      <div className="flex w-full flex-col items-center gap-1 pb-2 pt-4">
        {day.shifts.length > 0 ? (
          day.shifts
            .sort((a, b) => a.start - b.start)
            .map((shift) => {
              return <ShiftCard key={shift.id} shift={shift} />
            })
        ) : (
          <p className="flex items-center text-xs">
            <CalendarOffIcon size={20} className="mr-2" />
            No Shifts
          </p>
        )}
      </div>
      <div className="mt-auto flex w-full justify-center border-t">
        <Link
          href={`/days/${day.id}/notes`}
          title={`${day.notes.length} ${
            day.notes.length === 1 ? "note" : "notes"
          }`}
          className="mt-auto flex items-center border-b-2 border-transparent px-3 py-2 text-2xl duration-150 hover:border-primary"
        >
          {day.notes.length}
          {day.notes.length > 0 ? (
            <ScrollTextIcon className="ml-2 h-6 w-6" />
          ) : (
            <ScrollIcon className="ml-2 h-6 w-6" />
          )}
        </Link>
      </div>
    </div>
  )
}
