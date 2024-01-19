import Spinner from "@/app/_components/ui/spinner"
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "@/app/_components/ui/select"
import Calendar from "react-calendar"
import { Button } from "@/app/_components/ui/button"
import type { DashboardFirstAndLastDayOutput } from "@/trpc/shared"

type DashboardSidebarProps = {
  value: Date
  page: number
  isFetching: boolean
  showCalendar: boolean
  setPage: (page: number) => void
  setValue: (value: Date) => void
  setShowCalendar: (showCalendar: boolean) => void
  firstAndLastDays: DashboardFirstAndLastDayOutput
}

export default function DashboardSidebar({
  page,
  setPage,
  value,
  setValue,
  showCalendar,
  setShowCalendar,
  firstAndLastDays,
  isFetching,
}: DashboardSidebarProps) {
  return (
    <aside className="hidden h-screen overflow-auto border-r lg:block">
      <nav className="flex flex-col gap-4 p-4">
        <h2 className="text-lg font-semibold">Filters</h2>
        <div className="space-y-4">
          <Select open={showCalendar} onOpenChange={setShowCalendar}>
            <SelectTrigger
              onClick={() => setShowCalendar(!showCalendar)}
              className="focus:ring-0 focus:ring-offset-0"
            >
              <SelectValue
                placeholder={new Date(value).toLocaleDateString("en-GB", {
                  year: "numeric",
                  month: "long",
                })}
              />
            </SelectTrigger>
            <SelectContent>
              <Calendar
                view="month"
                maxDetail="year"
                next2Label={null}
                prev2Label={null}
                onChange={(value) => {
                  setValue(value as Date)
                  setShowCalendar(false)
                }}
                value={new Date(value)}
                minDetail="month"
                maxDate={new Date(1000 * firstAndLastDays?.[1]?.date!)}
                minDate={new Date(1000 * firstAndLastDays?.[0]?.date!)}
              />
            </SelectContent>
          </Select>
          <div className="flex space-x-1">
            <Button
              variant={"outline"}
              title="Previous Week"
              disabled={isFetching}
              aria-disabled={isFetching}
              className="active:scale-95"
              onClick={() => setPage(page - 1)}
            >
              Prev Week
            </Button>

            <Button
              variant={"outline"}
              title="Next Week"
              disabled={isFetching}
              aria-disabled={isFetching}
              className="active:scale-95"
              onClick={() => setPage(page + 1)}
            >
              Next Week
            </Button>
          </div>
        </div>
      </nav>
      {isFetching && (
        <div className="flex justify-center">
          <Spinner noMargin />
        </div>
      )}
    </aside>
  )
}
