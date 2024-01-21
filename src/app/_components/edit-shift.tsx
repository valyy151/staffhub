import { useEffect, useState } from "react"

import type { ShiftEmployee, ShiftModel, ShiftRow } from "@/lib/types"
import { formatTime, renderTotal } from "@/lib/utils"
import { api } from "@/trpc/react"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog"
import { Button } from "./ui/button"
import FormModal from "./ui/form-modal"
import Heading from "./ui/heading"
import { Input } from "./ui/input"
import RolesDropdown from "./roles-dropdown"
import { useToast } from "./ui/use-toast"
import { useRouter } from "next/navigation"
import SelectShiftModel from "./select-shift-model"

export default function EditShift({
  shift,
  setEdit,
  employee,
  shiftModels,
}: {
  shift: ShiftRow
  employee: ShiftEmployee
  setEdit: (edit: boolean) => void
  shiftModels: ShiftModel[] | undefined
}) {
  const [end, setEnd] = useState(formatTime(shift?.end) ?? "")
  const [start, setStart] = useState(formatTime(shift?.start ?? ""))
  const [shiftModel, setShiftModel] = useState<string>("")
  const [role, setRole] = useState({
    id: shift?.role?.id ?? "",
    name: shift?.role?.name ?? "",
  })

  const [showDelete, setShowDelete] = useState(false)

  const { toast } = useToast()

  const router = useRouter()

  const handleTimeChange = (newTime: string, field: "start" | "end"): void => {
    if (newTime.length > 5) {
      return
    }

    field === "start" ? setStart(newTime) : setEnd(newTime)

    if (newTime.length === 2) {
      if (Number(newTime) > 23) {
        field === "start" ? setStart("00:") : setEnd("00:")
      } else {
        field === "start" ? setStart(`${newTime}:`) : setEnd(`${newTime}:`)
      }
    }

    if (Number(newTime.split(":")[1]) > 59) {
      field === "start"
        ? setStart(`${newTime.split(":")[0]}:00`)
        : setEnd(`${newTime.split(":")[0]}:00`)
    }

    const date = new Date()

    const [hour, minute] = newTime.split(":")

    date.setHours(Number(hour))
    date.setMinutes(Number(minute))

    const newUnixTime = Math.floor(date.getTime() / 1000)

    if (minute?.length === 5) {
      field === "start"
        ? setStart(formatTime(newUnixTime))
        : setEnd(formatTime(newUnixTime))
    }
  }

  const createShiftMutation = api.shift.create.useMutation({
    onSuccess: () => {
      router.refresh()
      setEdit(false)
      toast({
        title: "Shift created successfully.",
      })
    },

    onError: () => {
      toast({
        title: "There was a problem creating the shift.",
        variant: "destructive",
      })
    },
  })

  const updateShiftMutation = api.shift.update.useMutation({
    onSuccess: () => {
      router.refresh()
      setEdit(false)
      toast({
        title: "Shift updated successfully.",
      })
    },

    onError: () => {
      toast({
        title: "There was a problem updating the shift.",
        variant: "destructive",
      })
    },
  })

  const deleteShiftMutation = api.shift.delete.useMutation({
    onSuccess: () => {
      router.refresh()
      setEdit(false)
      toast({
        title: "Shift deleted successfully.",
      })
    },

    onError: () => {
      toast({
        title: "There was a problem deleting the shift.",
        variant: "destructive",
      })
    },
  })

  const updateShift = (shiftId: string | null, date: number) => {
    const startDate = new Date(date * 1000)
    const endDate = new Date(date * 1000)

    const [startHour, startMinute] = start.split(":")
    const [endHour, endMinute] = end.split(":")

    startDate.setHours(Number(startHour))
    startDate.setMinutes(Number(startMinute))

    endDate.setHours(Number(endHour))
    endDate.setMinutes(Number(endMinute))

    if (!shiftId) {
      createShiftMutation.mutate({
        roleId: role.id,
        date: shift.date!,
        employeeId: employee.id!,
        end: Math.floor(endDate.getTime() / 1000),
        start: Math.floor(startDate.getTime() / 1000),
      })
      return
    }

    updateShiftMutation.mutate({
      shiftId,
      shift: {
        roleId: role.id,
        end: Math.floor(endDate.getTime() / 1000),
        start: Math.floor(startDate.getTime() / 1000),
      },
    })
  }

  const deleteShift = () => {
    deleteShiftMutation.mutate({
      shiftId: shift?.id!,
    })
  }

  useEffect(() => {
    if (shiftModel) {
      handleTimeChange(shiftModel.split(" - ")[0] as string, "start")
      handleTimeChange(
        shiftModel.split(" - ")[1] === "00:00"
          ? "24:00"
          : (shiftModel.split(" - ")[1] as string),
        "end",
      )
    }
  }, [shiftModel])

  return (
    <>
      <AlertDialog open>
        <AlertDialogContent className="flex w-fit min-w-0 flex-col items-center">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex flex-col items-center">
              <span> {employee.name}</span>
              <span>
                {new Date(shift.date! * 1000).toLocaleDateString("en-GB", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </AlertDialogTitle>
          </AlertDialogHeader>
          <div className="flex w-fit flex-col items-center">
            {employee?.roles?.length! > 0 && (
              <RolesDropdown
                role={role}
                setRole={setRole}
                roles={employee.roles}
              />
            )}
            <div className="mt-4  flex flex-col items-center">
              <div>
                <label className="ml-2">Start</label>
                <Input
                  value={start}
                  className="w-full text-lg"
                  onKeyDown={(e) => {
                    if (e.key === "Backspace") {
                      e.currentTarget.select()
                      handleTimeChange("", "start")
                    }
                  }}
                  onChange={(e) => handleTimeChange(e.target.value, "start")}
                />
              </div>
              <div>
                <label className="ml-2">End</label>
                <Input
                  value={end}
                  className="w-full text-lg"
                  onKeyDown={(e) => {
                    if (e.key === "Backspace") {
                      e.currentTarget.select()
                      handleTimeChange("", "end")
                    }
                  }}
                  onChange={(e) => handleTimeChange(e.target.value, "end")}
                />
              </div>
              <div className="mt-2 flex items-baseline gap-2">
                <label className="ml-4">Total:</label>
                <h1 className="text-xl font-bold disabled:cursor-default">
                  {renderTotal(start, end)}
                </h1>
              </div>
            </div>
          </div>
          {shiftModels?.length! > 0 && (
            <>
              <Heading size={"xxs"}>Choose a shift:</Heading>

              <SelectShiftModel
                shiftModel={shiftModel}
                setShiftModel={setShiftModel}
                shiftModels={shiftModels as ShiftModel[]}
              />
            </>
          )}

          <AlertDialogFooter className="mt-2 w-full">
            {shift.start ? (
              <Button
                variant={"link"}
                onClick={() => setShowDelete(true)}
                className="pb-0 pl-0 hover:text-rose-500"
              >
                Delete Shift
              </Button>
            ) : null}
            <AlertDialogCancel onClick={() => setEdit(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              disabled={
                updateShiftMutation.isLoading || createShiftMutation.isLoading
              }
              aria-disabled={
                updateShiftMutation.isLoading || createShiftMutation.isLoading
              }
              onClick={() => updateShift(shift?.id ?? null, shift.date)}
            >
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <FormModal
        open={showDelete}
        submit={deleteShift}
        cancel={setShowDelete}
        heading="Are you absolutely sure?"
        pending={deleteShiftMutation.isLoading}
        text="Are you sure you want to delete this shift?"
      />
    </>
  )
}
