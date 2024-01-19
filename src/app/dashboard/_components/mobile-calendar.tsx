import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "@/app/_components/ui/select"
import Calendar from "react-calendar"
import type { DashboardFirstAndLastDayOutput } from "@/trpc/shared"

export default function MobileCalendar({
  value,
  setValue,
  firstAndLastDays,
  showMobileCalendar,
  setShowMobileCalendar,
}: {
  value: Date
  showMobileCalendar: boolean
  setValue: (value: Date) => void
  firstAndLastDays: DashboardFirstAndLastDayOutput
  setShowMobileCalendar: (showMobileCalendar: boolean) => void
}) {
  return (
    <Select open={showMobileCalendar} onOpenChange={setShowMobileCalendar}>
      <SelectTrigger
        onClick={() => setShowMobileCalendar(!showMobileCalendar)}
        className="focus:ring-0 focus:ring-offset-0 lg:hidden"
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
            setShowMobileCalendar(false)
          }}
          value={new Date(value)}
          minDetail="month"
          maxDate={new Date(1000 * firstAndLastDays?.[1]?.date!)}
          minDate={new Date(1000 * firstAndLastDays?.[0]?.date!)}
        />
      </SelectContent>
    </Select>
  )
}
