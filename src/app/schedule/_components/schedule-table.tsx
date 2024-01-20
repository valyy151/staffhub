import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/app/_components/ui/table"

import ShiftRow from "./table-shift-row"

import ShiftCard from "./shift-card"
import type { ScheduleTableProps } from "@/lib/types"

export function ScheduleTable({
  data,
  shiftModel,
  setData,
  sickDays,
  vacationDays,
}: ScheduleTableProps) {
  return (
    <div className="max-h-[81vh] overflow-y-scroll border">
      <Table className="min-w-[50vw]">
        <TableHeader className="sticky top-0 bg-background shadow shadow-border dark:shadow-md dark:shadow-border">
          <TableRow className="hover:bg-inherit">
            <TableHead>Date</TableHead>
            <TableHead>Start</TableHead>
            <TableHead>End</TableHead>
            <TableHead className="text-right">Total</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item, index) => (
            <ShiftRow
              key={index}
              data={data}
              item={item}
              shiftModel={shiftModel}
              index={index}
              setData={setData}
              sickDays={sickDays}
              vacationDays={vacationDays}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

export function MobileScheduleTable({
  data,
  shiftModel,
  sickDays,
  vacationDays,
  setData,
}: ScheduleTableProps) {
  return (
    <div className="mt-4 flex w-full flex-col gap-2">
      {data.map((item, index) => (
        <ShiftCard
          key={index}
          data={data}
          item={item}
          index={index}
          setData={setData}
          sickDays={sickDays}
          shiftModel={shiftModel}
          vacationDays={vacationDays}
        />
      ))}
    </div>
  )
}
