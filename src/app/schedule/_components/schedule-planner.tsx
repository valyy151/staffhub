"use client"

import { CalendarPlusIcon, InfoIcon } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import Calendar from "react-calendar"
import "react-calendar/dist/Calendar.css"

import {
  calculateHours,
  changeMonth,
  findAbsenceDays,
  formatTime,
  generateYearArray,
} from "@/lib/utils"
import { api } from "@/trpc/react"
import type { StaffDropdownOutput } from "@/trpc/shared"

import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogContent,
} from "@/app/_components/ui/dialog"
import { ScheduleTable } from "./schedule-table"
import { useToast } from "@/app/_components/ui/use-toast"
import Heading from "@/app/_components/ui/heading"
import SelectStaff from "@/app/_components/select-staff"
import SelectShiftModel from "@/app/_components/select-shift-model"
import { Button } from "@/app/_components/ui/button"
import InfoModal from "@/app/_components/ui/info-modal"
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/app/_components/ui/drawer"
import { MobileScheduleTable } from "./schedule-table"

type ShiftModel = { id: string; end: number; start: number }

const sentences = [
  "Start by selecting a staff member and choosing which month you want to make a schedule for.",
  "If the staff member has any schedule preferences, you will see them below the table. You can use the shift models from there to quickly assign a shift to a day.",
  "Alternatively you can write the schedule manually. You can do this by clicking on the day you want to edit.",
  "For each day, there are 2 inputs: one for the start time and one for the end time.",
  "Type the start time and end time in the format HH:MM (24 hour format). For example 09:00 - 16:45.",
  "If you already made the schedule but want to make changes, go to the Dashboard and edit that particular day.",
]

export default function SchedulePlanner({
  shiftModels,
}: {
  shiftModels: ShiftModel[]
}) {
  const [loading, setLoading] = useState<boolean>(false)

  const [value, setValue] = useState<Date>(new Date())
  const [schedule, setSchedule] = useState(changeMonth(new Date()))

  const [shiftModel, setShiftModel] = useState<string>("")

  const [yearArray, setYearArray] = useState(
    generateYearArray(new Date().getFullYear()),
  )

  const [employee, setEmployee] = useState<StaffDropdownOutput>()

  const [showCalendar, setShowCalendar] = useState<boolean>(false)

  const [showModal, setShowModal] = useState(false)

  const { data: staff } = api.staff.getDropdown.useQuery()

  const { toast } = useToast()

  const createShift = api.shift.createMany.useMutation({
    onSuccess: () => {
      toast({
        title: "Schedule created successfully.",
      })
    },
    onError: () => {
      toast({
        title: "There was a problem creating the schedule.",
        variant: "destructive",
      })
      setLoading(false)
    },
    onSettled: () => {
      setLoading(false)
    },
  })

  const createDay = api.workDay.createMany.useMutation()

  const { refetch } = api.workDay.yearExists.useQuery(
    {
      date: schedule[0]?.date!,
    },
    { enabled: false },
  )

  const handleMonthChange = (date: Date) => {
    setValue(date)
    const year = date.getFullYear()
    setYearArray(generateYearArray(year))
    setSchedule(changeMonth(date))
  }

  const createSchedule = () => {
    setLoading(true)

    if (!employee?.id) {
      toast({
        title: "Please select an employee.",
      })
      setLoading(false)
      return
    }

    refetch().then(({ data }) => {
      if (!data) {
        createDay.mutate(yearArray)
      }

      const filteredSchedule = schedule.filter(
        (shift) => shift.start && shift.end,
      )

      if (filteredSchedule.length === 0) {
        toast({
          title: "Please select a shift.",
        })
        setLoading(false)
        return
      }

      createShift.mutate({
        employeeId: employee.id,
        schedule: filteredSchedule as {
          start: string
          end: string
          date: number
        }[],
      })
    })
  }

  const { sickDays, vacationDays } = findAbsenceDays(
    [...(employee?.vacations ?? []), ...(employee?.sickLeaves ?? [])],
    schedule,
  )

  return (
    <main
      onContextMenu={(e) => {
        e.preventDefault()
        setShiftModel("")
      }}
      className="p-2 pb-48 xl:p-4 xl:pb-0"
    >
      <section className="hidden xl:flex">
        <div className="flex">
          <div>
            {employee?.name && schedule ? (
              <div className="mb-4 flex justify-between">
                <Heading
                  size={"xs"}
                  onClick={() => setShowCalendar(true)}
                  className="cursor-pointer underline-offset-2 hover:underline"
                >
                  {value.toLocaleDateString("en-GB", {
                    month: "long",
                    year: "numeric",
                  })}
                </Heading>

                <div className="flex items-baseline justify-end">
                  <Heading
                    size={"xxs"}
                    className="mr-2 cursor-pointer underline-offset-2 hover:underline"
                  >
                    <Link href={`/staff/${employee?.id}`}>
                      {" "}
                      {employee?.name}
                    </Link>
                  </Heading>

                  <Heading size={"xxs"} className="text-left font-normal">
                    will work{" "}
                    <span className="font-bold">
                      {calculateHours(schedule)}
                    </span>{" "}
                    in{" "}
                    <span className="font-bold">
                      {new Date(schedule[0]!.date * 1000).toLocaleDateString(
                        "en-GB",
                        {
                          month: "long",
                          year: "numeric",
                        },
                      )}
                    </span>
                  </Heading>
                </div>
              </div>
            ) : (
              <div className="mb-4 flex justify-between">
                <Heading
                  size={"xs"}
                  onClick={() => setShowCalendar(true)}
                  className="cursor-pointer underline-offset-8 hover:underline"
                >
                  {value.toLocaleDateString("en-GB", {
                    month: "long",
                    year: "numeric",
                  })}
                </Heading>
                <Heading size={"xxs"} className="mr-2">
                  No employee selected
                </Heading>
              </div>
            )}
            <ScheduleTable
              data={schedule}
              sickDays={sickDays}
              setData={setSchedule}
              shiftModel={shiftModel}
              vacationDays={vacationDays}
            />
          </div>

          <div className="ml-12">
            <div>
              <SelectStaff
                staff={staff}
                employee={employee}
                setEmployee={setEmployee}
              />
              {employee?.name && (
                <div className="mt-2 flex flex-col items-baseline">
                  <Heading size={"xs"}>Shift Preferences</Heading>
                  <div className="flex flex-col">
                    {employee.schedulePreference?.shiftModels.length! > 0 ? (
                      employee.schedulePreference?.shiftModels.map((item) => (
                        <Heading
                          size={"xxs"}
                          key={item.id}
                          className=" my-0.5 font-normal"
                        >
                          ({formatTime(item.start)} - {formatTime(item.end)})
                        </Heading>
                      ))
                    ) : (
                      <Heading
                        size={"xxs"}
                        className="mr-4 text-left font-normal"
                      >
                        No shift models set
                      </Heading>
                    )}
                  </div>
                </div>
              )}
              <div className="flex flex-col pt-2">
                {shiftModels?.length! > 0 && (
                  <SelectShiftModel
                    shiftModel={shiftModel}
                    shiftModels={shiftModels}
                    setShiftModel={setShiftModel}
                  />
                )}
              </div>

              <Heading size={"xs"} className="mt-2">
                Hours per month
              </Heading>
              <Heading size={"xxs"} className=" font-normal">
                <span>{calculateHours(schedule)}</span> /{" "}
                {employee?.schedulePreference?.hoursPerMonth} per month
              </Heading>

              <div className="flex w-fit flex-col space-y-1 pt-4">
                <Button
                  title="Create schedule"
                  disabled={loading}
                  onClick={createSchedule}
                >
                  <CalendarPlusIcon className="mr-2" /> Submit
                </Button>
                <Button
                  variant={"secondary"}
                  title="How do I make a schedule?"
                  onClick={() => setShowModal(true)}
                >
                  <InfoIcon className="mr-2" /> How do I write a schedule?
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="flex flex-col items-center xl:hidden">
        <Button
          size={"lg"}
          variant={"secondary"}
          className="border"
          title="How do I make a schedule?"
          onClick={() => setShowModal(true)}
        >
          <InfoIcon className="mr-2" /> How do I write a schedule?
        </Button>

        <MobileScheduleTable
          data={schedule}
          sickDays={sickDays}
          setData={setSchedule}
          shiftModel={shiftModel}
          vacationDays={vacationDays}
        />
        <Button
          title="Create schedule"
          className="mt-4 w-48"
          size={"lg"}
          disabled={loading}
          onClick={createSchedule}
        >
          <CalendarPlusIcon className="mr-2" /> Submit
        </Button>
        <div className="fixed bottom-0 flex w-full items-center justify-center border-t bg-card p-4">
          <Drawer>
            <DrawerTrigger>
              <Heading size={"xs"}>
                {employee?.name ?? "Select a staff member"} -{" "}
                {value.toLocaleDateString("en-GB", {
                  month: "long",
                  year: "numeric",
                })}
              </Heading>

              {shiftModel && employee?.name && shiftModel !== "None" && (
                <Heading size={"xxs"} className="space-x-2">
                  <span>Shift model selected:</span>
                  <span className="text-sm font-normal">{shiftModel}</span>
                </Heading>
              )}
              {employee?.name && (
                <Heading size={"xxs"} className="space-x-2">
                  <span> Hours planned this month:</span>
                  <span className="text-sm font-normal">
                    {" "}
                    {calculateHours(schedule)}
                  </span>
                </Heading>
              )}
            </DrawerTrigger>
            <DrawerContent className="flex flex-col items-center py-4">
              <DrawerHeader>
                <Button onClick={() => setShowCalendar(true)} size={"lg"}>
                  {value.toLocaleDateString("en-GB", {
                    month: "long",
                    year: "numeric",
                  })}
                </Button>
              </DrawerHeader>
              <DrawerHeader>
                <DrawerTitle>Select a staff member </DrawerTitle>
              </DrawerHeader>
              <SelectStaff
                staff={staff}
                employee={employee}
                setEmployee={setEmployee}
              />

              {employee?.name &&
                employee.schedulePreference?.shiftModels.length! > 0 && (
                  <div className="mt-2 flex flex-col items-center">
                    <Heading size={"xxs"}>Shift Preferences</Heading>
                    <div className="flex flex-col items-center">
                      {employee.schedulePreference?.shiftModels.map((item) => (
                        <p key={item.id} className=" my-0.5 text-sm">
                          ({formatTime(item.start)} - {formatTime(item.end)})
                        </p>
                      ))}
                    </div>
                  </div>
                )}
              {shiftModels?.length! > 0 && (
                <DrawerHeader>
                  <DrawerTitle>Select a shift model </DrawerTitle>
                  <SelectShiftModel
                    shiftModel={shiftModel}
                    shiftModels={shiftModels}
                    setShiftModel={setShiftModel}
                  />
                </DrawerHeader>
              )}
            </DrawerContent>
          </Drawer>
        </div>
      </section>

      <Dialog open={showCalendar} onOpenChange={setShowCalendar}>
        <DialogContent className="justify-center">
          <DialogHeader>
            <DialogTitle>Choose a Month</DialogTitle>
          </DialogHeader>
          <Calendar
            view="month"
            maxDetail="year"
            next2Label={null}
            prev2Label={null}
            value={new Date(value)}
            minDetail="month"
            onChange={(value) => {
              setShowCalendar(false)
              setValue(value as Date)
              handleMonthChange(value as Date)
            }}
          />
        </DialogContent>
      </Dialog>

      <InfoModal
        open={showModal}
        text={sentences}
        close={setShowModal}
        heading="How do I write a schedule?"
      />
    </main>
  )
}
