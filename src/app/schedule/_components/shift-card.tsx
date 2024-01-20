import { Card } from "@/app/_components/ui/card"
import {
  formatDate,
  formatDay,
  handleScheduleTimeChange,
  handleTimeWithClick,
  renderTotal,
} from "@/lib/utils"
import { Input } from "@/app/_components/ui/input"
import { useRef } from "react"
import type { ScheduleData, ScheduleTableProps } from "@/lib/types"

export default function ShiftCard({
  data,
  item,
  index,
  setData,
  sickDays,
  shiftModel,
  vacationDays,
}: ScheduleTableProps & { item: ScheduleData[number]; index: number }) {
  const endRef = useRef<HTMLInputElement>(null)
  const startRef = useRef<HTMLInputElement>(null)

  return (
    <Card className="p-4 shadow">
      <div className="flex items-center justify-between pb-2">
        <span> {formatDay(item.date, "long")}</span>
        <span className="ml-auto">{formatDate(item.date, "long")}</span>
      </div>
      {shiftModel ? (
        <>
          <div
            className="flex flex-col items-center py-1"
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
                    : undefined ?? "Start"
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
          </div>
          <div
            className="flex flex-col items-center py-1"
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
              placeholder={
                vacationDays.includes(item.date)
                  ? "Vacation"
                  : undefined || sickDays.includes(item.date)
                    ? "Sick"
                    : undefined ?? "End"
              }
              className={`w-fit ${
                shiftModel &&
                !vacationDays.includes(item.date) &&
                "hover:ring-0.5 w-fit cursor-pointer ring-gray-800 dark:ring-gray-50"
              }`}
              type="text"
            />
          </div>
        </>
      ) : (
        <>
          <div className="flex flex-col items-center py-1">
            <Input
              type="text"
              autoFocus={index === 0}
              placeholder={
                vacationDays.includes(item.date)
                  ? "Vacation"
                  : undefined || sickDays.includes(item.date)
                    ? "Sick"
                    : undefined ?? "Start"
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
          </div>

          <div className="flex flex-col items-center py-1">
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
              placeholder={
                vacationDays.includes(item.date)
                  ? "Vacation"
                  : undefined || sickDays.includes(item.date)
                    ? "Sick"
                    : undefined ?? "End"
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
          </div>
        </>
      )}

      {item.start && item.end ? (
        <div title="Total hours in shift" className="text-center">
          Total: {renderTotal(item.start, item.end)}
        </div>
      ) : null}

      {(vacationDays.includes(item.date) || sickDays.includes(item.date)) && (
        <div title="Total hours in shift" className="text-center">
          Total: 8h
        </div>
      )}

      {!item.end &&
        !item.start &&
        !sickDays.includes(item.date) &&
        !vacationDays.includes(item.date) && (
          <div title="Total hours in shift" className="text-center">
            -
          </div>
        )}
    </Card>
  )
}
