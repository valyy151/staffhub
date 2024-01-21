"use client"
import "react-calendar/dist/Calendar.css"

import Link from "next/link"
import { useEffect, useState } from "react"
import { Calendar } from "react-calendar"
import type { ShiftEmployee, ShiftRow } from "@/lib/types"
import { calculateStaffHours, formatDate, formatDay } from "@/lib/utils"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/app/_components/ui/table"
import ShiftRowComponent from "./shift-row"
import { useRouter } from "next-nprogress-bar"

import PDFButton from "./pdf-button"
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/app/_components/ui/drawer"

export default function StaffSchedule({
  employee,
  month,
}: {
  employee: ShiftEmployee
  month: Date
}) {
  const [value, setValue] = useState(month)
  const [showDrawer, setShowDrawer] = useState(false)

  const router = useRouter()

  useEffect(() => {
    router.push(
      `?month=${value
        .toLocaleDateString("en-GB", { month: "numeric", year: "numeric" })
        .replace("/", "_")}`,
    )
  }, [value])

  return (
    <>
      <section className="flex w-full flex-col pb-32 md:flex-row md:pb-8">
        <div>
          <h1 className="mb-2 hidden flex-col font-bold md:mb-4 md:ml-2 md:flex">
            <span> {employee?.name}</span>
            <span>
              {value.toLocaleDateString("en-GB", {
                month: "long",
                year: "numeric",
              })}{" "}
              - {calculateStaffHours(employee?.shifts as ShiftRow[])}
            </span>
          </h1>
          <div className="border md:max-h-[46.2rem] md:overflow-y-scroll">
            <Table className="md:text-md w-full min-w-[40vw] text-xs">
              <TableHeader className="sticky top-0 bg-card shadow shadow-border">
                <TableRow className="hover:bg-inherit">
                  <TableHead className="border-r">Day</TableHead>
                  <TableHead className="border-r">Date</TableHead>
                  <TableHead className="text-right">Shift</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {employee?.shifts.map((shift) => (
                  <TableRow key={shift.workDayId} className="hover:bg-inherit">
                    <TableCell
                      className={`border-r ${
                        (formatDay(shift.date, "short") === "Sat" &&
                          "font-bold text-rose-500") ||
                        (formatDay(shift.date, "short") === "Sun" &&
                          "font-bold text-rose-500")
                      }`}
                    >
                      <Link
                        href={`/days/${shift.workDayId}/shifts`}
                        className={`py-3 pr-2 underline-offset-2 hover:underline`}
                      >
                        {formatDay(shift.date, "short")}
                      </Link>
                    </TableCell>
                    <TableCell
                      className={`border-r font-medium  ${
                        (formatDay(shift.date, "short") === "Sat" &&
                          "font-bold text-rose-500") ||
                        (formatDay(shift.date, "short") === "Sun" &&
                          "font-bold text-rose-500")
                      }`}
                    >
                      <Link
                        href={`/days/${shift.workDayId}/shifts`}
                        className={`py-3 pr-2 underline-offset-2 hover:underline`}
                      >
                        {formatDate(shift.date, "long")}
                      </Link>
                    </TableCell>

                    <ShiftRowComponent
                      employee={employee}
                      shift={shift as ShiftRow}
                    />
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        <div className="relative ml-8 mt-12 hidden md:block">
          <Calendar
            value={value}
            view={"month"}
            maxDetail="year"
            className="h-fit"
            next2Label={null}
            prev2Label={null}
            activeStartDate={value}
            onChange={(value) => setValue(value as Date)}
          />

          <PDFButton
            employee={employee}
            shifts={employee?.shifts}
            month={value.toLocaleDateString("en-GB", {
              month: "long",
              year: "numeric",
            })}
          />
        </div>

        <div className="flex w-full md:hidden">
          <PDFButton
            employee={employee}
            shifts={employee?.shifts}
            month={value.toLocaleDateString("en-GB", {
              month: "long",
              year: "numeric",
            })}
          />
        </div>
      </section>

      <div className="fixed bottom-0 flex w-full flex-col items-center border-t bg-card py-4 md:hidden">
        <Drawer open={showDrawer} onOpenChange={setShowDrawer}>
          <DrawerTrigger className="flex w-full flex-col items-center">
            <span className="mr-16 font-medium"> {employee?.name}</span>
            <span className="mr-16 w-fit font-bold">
              {value.toLocaleDateString("en-GB", {
                month: "long",
                year: "numeric",
              })}
            </span>
          </DrawerTrigger>
          <DrawerContent className="flex flex-col items-center py-4">
            <DrawerHeader>
              <DrawerTitle>
                Select a month to view {employee?.name}'s schedule
              </DrawerTitle>
            </DrawerHeader>
            <Calendar
              value={value}
              view={"month"}
              maxDetail="year"
              className="h-fit"
              next2Label={null}
              prev2Label={null}
              activeStartDate={value}
              onChange={(value) => {
                setValue(value as Date)
                setShowDrawer(false)
              }}
            />
          </DrawerContent>
        </Drawer>
      </div>
    </>
  )
}
