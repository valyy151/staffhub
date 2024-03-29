import { useRef } from "react"

import { Input } from "@/app/_components/ui/input"
import { TableCell, TableRow } from "@/app/_components/ui/table"
import {
  formatDate,
  formatDay,
  handleScheduleTimeChange,
  handleTimeWithClick,
  renderTotal,
} from "@/lib/utils"
import type { ScheduleData } from "@/lib/types"

type Props = {
  data: ScheduleData
  index: number
  shiftModel: string
  item: {
    date: number
    end?: string | undefined
    start?: string | undefined
  }
  sickDays: number[]
  vacationDays: number[]
  setData: (data: ScheduleData) => void
}

export default function ShiftRow({
  data,
  item,
  index,
  shiftModel,
  setData,
  sickDays,
  vacationDays,
}: Props) {
  const endRef = useRef<HTMLInputElement>(null)
  const startRef = useRef<HTMLInputElement>(null)

  return (
    <TableRow className="hover:bg-inherit">
      <TableCell className="flex pt-6">
        <span> {formatDay(item.date, "long")}</span>
        <span className="ml-auto">{formatDate(item.date, "long")}</span>
      </TableCell>
      {shiftModel ? (
        <>
          <TableCell
            onClick={() =>
              handleTimeWithClick(index, shiftModel, data, setData)
            }
          >
            <Input
              type="text"
              ref={startRef}
              value={item.start!}
              onKeyDown={(e) => {
                if (e.key === "Backspace") {
                  e.currentTarget.select()
                  handleScheduleTimeChange(index, "", "start", data, setData)
                  endRef.current?.select()
                  handleScheduleTimeChange(index, "", "end", data, setData)
                }
              }}
              placeholder={
                vacationDays.includes(item.date)
                  ? "Vacation"
                  : undefined || sickDays.includes(item.date)
                    ? "Sick"
                    : undefined
              }
              disabled={
                sickDays.includes(item.date) || vacationDays.includes(item.date)
              }
              className={`w-fit ${
                shiftModel &&
                !vacationDays.includes(item.date) &&
                "hover:ring-0.5 w-fit cursor-pointer ring-gray-800 dark:ring-gray-50"
              }`}
            />
          </TableCell>
          <TableCell
            onClick={() =>
              handleTimeWithClick(index, shiftModel, data, setData)
            }
          >
            <Input
              ref={endRef}
              value={item.end!}
              onKeyDown={(e) => {
                if (e.key === "Backspace") {
                  e.currentTarget.select()
                  handleScheduleTimeChange(index, "", "end", data, setData)
                  startRef.current?.select()
                  handleScheduleTimeChange(index, "", "start", data, setData)
                }
              }}
              disabled={
                sickDays.includes(item.date) || vacationDays.includes(item.date)
              }
              className={`w-fit ${
                shiftModel &&
                !vacationDays.includes(item.date) &&
                "hover:ring-0.5 w-fit cursor-pointer ring-gray-800 dark:ring-gray-50"
              }`}
              type="text"
            />
          </TableCell>
        </>
      ) : (
        <>
          <TableCell>
            <Input
              type="text"
              autoFocus={index === 0}
              placeholder={
                vacationDays.includes(item.date)
                  ? "Vacation"
                  : undefined || sickDays.includes(item.date)
                    ? "Sick"
                    : undefined
              }
              onKeyDown={(e) => {
                if (e.key === "Backspace") {
                  e.currentTarget.select()
                  handleScheduleTimeChange(index, "", "start", data, setData)
                  endRef.current?.select()
                  handleScheduleTimeChange(index, "", "end", data, setData)
                }
              }}
              disabled={
                sickDays.includes(item.date) || vacationDays.includes(item.date)
              }
              value={item.start!}
              onChange={(e) =>
                handleScheduleTimeChange(
                  index,
                  e.target.value,
                  "start",
                  data,
                  setData,
                )
              }
              className="w-fit "
            />
          </TableCell>

          <TableCell>
            <Input
              value={item.end!}
              disabled={
                sickDays.includes(item.date) || vacationDays.includes(item.date)
              }
              onChange={(e) =>
                handleScheduleTimeChange(
                  index,
                  e.target.value,
                  "end",
                  data,
                  setData,
                )
              }
              onKeyDown={(e) => {
                if (e.key === "Backspace") {
                  e.currentTarget.select()
                  handleScheduleTimeChange(index, "", "end", data, setData)
                  startRef.current?.select()
                  handleScheduleTimeChange(index, "", "start", data, setData)
                }
              }}
              className="w-fit"
              type="text"
            />
          </TableCell>
        </>
      )}

      {item.start && item.end ? (
        <TableCell title="Total hours in shift" className="text-right">
          {renderTotal(item.start, item.end)}
        </TableCell>
      ) : null}

      {(vacationDays.includes(item.date) || sickDays.includes(item.date)) && (
        <TableCell title="Total hours in shift" className="text-right">
          8h
        </TableCell>
      )}

      {!item.end &&
        !item.start &&
        !sickDays.includes(item.date) &&
        !vacationDays.includes(item.date) && (
          <TableCell title="Total hours in shift" className="text-right">
            -
          </TableCell>
        )}
    </TableRow>
  )
}
