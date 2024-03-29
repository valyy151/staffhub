"use client"
import { ClockIcon } from "lucide-react"
import { useRouter } from "next-nprogress-bar"
import Link from "next/link"
import { useEffect, useState } from "react"

import { Input } from "@/app/_components/ui/input"
import { useToast } from "@/app/_components/ui/use-toast"
import { formatTime, handleTimeChange, renderTotal } from "@/lib/utils"
import { api } from "@/trpc/react"
import type { StaffDropdownOutput } from "@/trpc/shared"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/app/_components/ui/alert-dialog"
import { Button } from "@/app/_components/ui/button"
import RolesDropdown from "@/app/_components/roles-dropdown"
import Heading from "@/app/_components/ui/heading"
import SelectStaff from "@/app/_components/select-staff"

type AddShiftProps = {
  date: number
}

export default function AddShift({ date }: AddShiftProps) {
  const [showAddShift, setShowAddShift] = useState<boolean>(false)
  const [employee, setEmployee] = useState<StaffDropdownOutput>(
    {} as StaffDropdownOutput,
  )

  const { data: shiftModels } = api.shiftModel.get.useQuery()

  const [role, setRole] = useState<{ id: string; name: string }>(
    {} as {
      id: string
      name: string
    },
  )
  const [end, setEnd] = useState<string>("")
  const [start, setStart] = useState<string>("")

  const [endDate, setEndDate] = useState<number>(0)
  const [isSick, setIsSick] = useState<boolean>(false)
  const [remainingDays, setRemainingDays] = useState<number>(0)
  const [isOnVacation, setIsOnVacation] = useState<boolean>(false)

  function checkIfSickOrVacation(employee: StaffDropdownOutput) {
    setIsSick(false)
    setIsOnVacation(false)
    const currentDate = Date.now()

    for (const sickLeave of employee.sickLeaves) {
      const startDate: Date = new Date(Number(sickLeave.start))
      const endDate: Date = new Date(Number(sickLeave.end))

      if (
        Number(currentDate) >= Number(startDate) &&
        Number(currentDate) <= Number(endDate)
      ) {
        const remainingDays = Math.ceil(
          (Number(endDate) - currentDate) / (1000 * 60 * 60 * 24),
        )

        setIsSick(true)
        setEndDate(Number(endDate))
        setRemainingDays(remainingDays)
        return
      }
    }

    for (const vacation of employee.vacations) {
      const startDate: Date = new Date(Number(vacation.start))
      const endDate: Date = new Date(Number(vacation.end))

      if (
        Number(currentDate) >= Number(startDate) &&
        Number(currentDate) <= Number(endDate)
      ) {
        const remainingDays = Math.ceil(
          (Number(endDate) - currentDate) / (1000 * 60 * 60 * 24),
        )

        setIsOnVacation(true)
        setEndDate(Number(endDate))
        setRemainingDays(remainingDays)
        return
      }
    }
  }

  useEffect(() => {
    if (employee.id) {
      checkIfSickOrVacation(employee)
    }
  }, [employee])

  const { data: employees } = api.staff.getDropdown.useQuery()

  const { toast } = useToast()

  const router = useRouter()

  const createShift = api.shift.create.useMutation({
    onSuccess: () => {
      toast({
        title: "Shift created successfully.",
      })
      setShowAddShift(false)
      router.refresh()
    },
    onError: () => {
      toast({
        title: "There was a problem creating the shift.",
        variant: "destructive",
      })
    },
  })

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (!end || !start) {
      toast({
        title: "Please select a start and end time.",
      })
      return
    }

    const startDate = new Date(date * 1000)
    const endDate = new Date(date * 1000)

    const [startHour, startMinute] = start.split(":")
    const [endHour, endMinute] = end.split(":")

    startDate.setHours(Number(startHour))
    startDate.setMinutes(Number(startMinute))

    endDate.setHours(Number(endHour))
    endDate.setMinutes(Number(endMinute))

    createShift.mutate({
      date,
      roleId: role.id,
      employeeId: employee.id,
      end: Math.floor(endDate.getTime() / 1000),
      start: Math.floor(startDate.getTime() / 1000),
    })
  }

  return (
    <>
      <Button onClick={() => setShowAddShift(true)}>
        <ClockIcon size={18} className="mr-2" />
        Create Shift
      </Button>
      {showAddShift && (
        <AlertDialog open>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                Add a new shift {employee.name && "for"}{" "}
                <Link
                  href={`/staff/${employee.id}`}
                  className="hover:text-sky-500"
                >
                  {employee.name}
                </Link>
              </AlertDialogTitle>
            </AlertDialogHeader>
            <div className="mt-4 flex flex-col space-y-4">
              <SelectStaff
                staff={employees}
                employee={employee}
                setEmployee={setEmployee}
              />
              {employee.roles?.length > 0 && (
                <RolesDropdown
                  role={role}
                  setRole={setRole}
                  roles={employee.roles}
                />
              )}
              <div className="mt-4 flex space-x-1">
                <div>
                  <label className="ml-2">Start</label>
                  <Input
                    value={start}
                    className="w-36 text-lg"
                    onKeyDown={(e) => {
                      if (e.key === "Backspace") {
                        e.currentTarget.select()
                        handleTimeChange("", "start", setStart, setEnd)
                      }
                    }}
                    onChange={(e) =>
                      handleTimeChange(
                        e.target.value,
                        "start",
                        setStart,
                        setEnd,
                      )
                    }
                  />
                </div>
                <div>
                  <label className="ml-2">End</label>
                  <Input
                    value={end}
                    className="w-36 text-lg"
                    onKeyDown={(e) => {
                      if (e.key === "Backspace") {
                        e.currentTarget.select()
                        handleTimeChange("", "end", setStart, setEnd)
                      }
                    }}
                    onChange={(e) =>
                      handleTimeChange(e.target.value, "end", setStart, setEnd)
                    }
                  />
                </div>
                <div>
                  <label className="ml-4">Total</label>
                  <Heading
                    size={"xs"}
                    className="h-14 border-none px-4 py-1 text-2xl disabled:cursor-default"
                  >
                    {renderTotal(start, end)}
                  </Heading>
                </div>
              </div>

              {shiftModels?.length! > 0 && (
                <>
                  <Heading size={"xxs"}>Choose a shift:</Heading>
                  <div className="mt-1 flex w-96 flex-wrap">
                    {shiftModels?.map((shiftModel) => (
                      <Heading
                        key={shiftModel.id}
                        size={"xxs"}
                        onClick={() => {
                          handleTimeChange(
                            formatTime(shiftModel.start),
                            "start",
                            setStart,
                            setEnd,
                          )
                          handleTimeChange(
                            formatTime(shiftModel.end) === "00:00"
                              ? "24:00"
                              : formatTime(shiftModel.end),
                            "end",
                            setStart,
                            setEnd,
                          )
                        }}
                        className="mr-auto w-fit cursor-pointer font-medium hover:text-sky-500"
                      >
                        {formatTime(shiftModel.start)} -{" "}
                        {formatTime(shiftModel.end)}
                      </Heading>
                    ))}
                  </div>
                </>
              )}

              {isSick && (
                <Heading
                  size={"xxs"}
                  className="mt-4 font-normal text-rose-700 dark:text-rose-400"
                >
                  {employee.name} is on sick leave untill{" "}
                  {new Date(endDate).toLocaleDateString("en-GB", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                  . Ends in {remainingDays} days.
                </Heading>
              )}

              {isOnVacation && (
                <>
                  <Heading
                    size={"xxs"}
                    className="mt-4 font-normal text-rose-700 dark:text-rose-400"
                  >
                    {employee.name} is on vacation untill{" "}
                    {new Date(endDate).toLocaleDateString("en-GB", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                    .
                  </Heading>
                  <Heading size={"xxs"} className="mt-2 font-normal">
                    Ends in {remainingDays} days.
                  </Heading>
                </>
              )}
            </div>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setShowAddShift(false)}>
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleSubmit}
                disabled={createShift.isLoading}
                aria-disabled={createShift.isLoading}
              >
                Continue
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </>
  )
}
