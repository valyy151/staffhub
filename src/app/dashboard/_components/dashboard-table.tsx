"use client"

import "react-calendar/dist/Calendar.css"

import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"

import Heading from "@/app/_components/ui/heading"

import type { DashboardAbsence, Note } from "@/lib/types"
import { api } from "@/trpc/react"

import AbsenceCard from "./absence-card"
import { Button } from "@/app/_components/ui/button"
import WorkDayCard from "./work-day-card"
import DashboardSidebar from "./dashboard-sidebar"
import DashboardNote from "./dashboard-note"
import MobileCalendar from "./mobile-calendar"
import DateHeadings from "./date-headings"
import type {
  DashboardFirstAndLastDayOutput,
  DashboardOutput,
} from "@/trpc/shared"

export default function DashboardTable() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const pageParams = Number(searchParams.get("page"))
  const monthParams = new Date(
    String(searchParams.get("month")).split("_").reverse().join("-"),
  )

  const [page, setPage] = useState<number>(pageParams)
  const [value, setValue] = useState<Date>(
    new Date(String(monthParams).split("_").reverse().join("-")),
  )

  const { data: firstAndLastDays } =
    api.dashboard.findFirstAndLastDay.useQuery()

  const { data, refetch, isFetching } = api.dashboard.find.useQuery({
    page: pageParams,
    month: monthParams,
  })

  const [workDays, setWorkDays] = useState(data)

  const [showCalendar, setShowCalendar] = useState<boolean>(false)
  const [showMobileCalendar, setShowMobileCalendar] = useState<boolean>(false)

  useEffect(() => {
    router.push(
      `?page=${page}&month=${value
        .toLocaleDateString("en-GB", { year: "numeric", month: "numeric" })
        .replace("/", "_")}`,
    )
  }, [page, value])

  useEffect(() => {
    refetch().then(({ data }) => data && setWorkDays(data))
  }, [searchParams.get("page"), searchParams.get("month")])

  const absencesArray: DashboardAbsence[] | null = []
  const notesArray: Note[] =
    workDays
      ?.map((day) => day.notes.map((note) => ({ ...note, date: day.date })))
      .flat() ?? []

  //calculate amount of absences for each employee then push to absencesArray
  workDays?.map((day) =>
    day.shifts.map((shift) => {
      if (shift.absence?.absent) {
        const index = absencesArray.findIndex(
          (absence) => absence.employee.id === shift.employee.id,
        )

        if (index === -1) {
          absencesArray.push({
            shifts: [
              {
                id: shift.id,
                approved: shift.absence.approved,
                date: shift.date,
              },
            ],
            reason: shift.absence.reason,
            absent: shift.absence.absent,
            approved: shift.absence.approved,
            employee: {
              name: shift.employee.name,
              id: shift.employee.id,
            },
            amount: 1,
          })
        } else {
          absencesArray[index]!.shifts.push({
            id: shift.id,
            date: shift.date,
            approved: shift.absence.approved,
          })
          absencesArray[index]!.amount += 1
        }
      }
    }),
  )

  return (
    <main className="flex pb-24 md:pb-0">
      <DashboardSidebar
        page={page}
        value={value}
        setPage={setPage}
        setValue={setValue}
        isFetching={isFetching}
        showCalendar={showCalendar}
        setShowCalendar={setShowCalendar}
        firstAndLastDays={firstAndLastDays as DashboardFirstAndLastDayOutput}
      />
      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1 p-4">
          <div className="grid gap-4">
            <DateHeadings workDays={workDays as DashboardOutput[]} />

            <MobileCalendar
              value={value}
              setValue={setValue}
              showMobileCalendar={showMobileCalendar}
              setShowMobileCalendar={setShowMobileCalendar}
              firstAndLastDays={
                firstAndLastDays as DashboardFirstAndLastDayOutput
              }
            />

            {!workDays && (
              <div className="h-8 w-96 animate-pulse rounded bg-muted" />
            )}
            {!workDays && (
              <div className="h-96 w-full animate-pulse rounded bg-muted" />
            )}

            {workDays && (
              <div className="flex min-h-[24rem] flex-col gap-2 rounded-lg border-b md:border-b-0 lg:flex-row lg:gap-0">
                {workDays?.map((day, index) => (
                  <WorkDayCard key={index} day={day} index={index} />
                ))}
              </div>
            )}

            {absencesArray.length > 0 && (
              <>
                <Heading size={"xs"} className="ml-2">
                  Absences
                </Heading>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {absencesArray.map((absence, index) => (
                    <AbsenceCard absence={absence} key={index} />
                  ))}
                </div>
              </>
            )}
            {notesArray.length > 0 && (
              <>
                <Heading size={"xs"} className="ml-2">
                  Notes
                </Heading>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {notesArray
                    .sort(
                      (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
                    )
                    .map((note) => (
                      <DashboardNote key={note.id} note={note} />
                    ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      <div className="fixed bottom-0 flex w-full justify-center border-t bg-card py-3 lg:hidden">
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
    </main>
  )
}
