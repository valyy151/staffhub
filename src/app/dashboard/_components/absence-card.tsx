import Link from "next/link"
import { useState } from "react"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/app/_components/ui/alert-dialog"
import { Switch } from "@/app/_components/ui/switch"
import { useToast } from "@/app/_components/ui/use-toast"
import { api } from "@/trpc/react"
import { useQueryClient } from "@tanstack/react-query"

type Props = {
  absence: {
    shifts: { id: string; approved: boolean; date: number }[]
    reason: string
    absent: boolean
    approved: boolean
    employee: {
      name: string
      id: string
    }
    amount: number
  }
}

export default function AbsenceCard({ absence }: Props) {
  const { toast } = useToast()

  const [approveAll, setApproveAll] = useState<boolean>(
    absence.shifts.every((shift) => shift.approved),
  )
  const [showAbsence, setShowAbsence] = useState<boolean>(false)

  const queryClient = useQueryClient()

  const handleSwitchChange = (shiftId: string) => {
    const shift = absence.shifts.find((shift) => shift.id === shiftId)
    if (shift) {
      shift.approved = !shift.approved
      setShifts([...absence.shifts])
    }
  }

  const [shifts, setShifts] = useState(absence.shifts)

  const updateAbsences = api.shift.updateAbsences.useMutation({
    onSuccess: () => {
      toast({
        title: "Absences updated",
        description: "Absences have been updated successfully",
      })
      setShowAbsence(false)
      queryClient.invalidateQueries()
    },

    onError: () => {
      toast({
        variant: "destructive",
        title: "Something went wrong",
        description: "There was an error updating absences",
      })
    },
  })

  return (
    <div className="rounded-lg border bg-card py-2">
      <p className="border-b px-2 pb-1">
        <Link
          className="underline-offset-4 hover:underline"
          href={`/staff/${absence.employee.id}`}
        >
          {absence.employee.name}
        </Link>
      </p>

      <div
        onClick={() => setShowAbsence(true)}
        className="group flex cursor-pointer justify-between px-2 pb-1 pt-4 text-sm"
      >
        <p>
          <span>Reason:</span> {absence.reason}
        </p>
        <p>
          <span> Amount: </span> {absence.amount}
        </p>
        <p
          className={`${absence.approved ? "text-green-500" : "text-rose-500"}`}
        >
          <span className="text-foreground underline-offset-4 group-hover:underline">
            Approved:{" "}
          </span>{" "}
          {absence.approved ? "Yes" : "No"}
        </p>
      </div>

      {showAbsence && (
        <AlertDialog open>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Approve Absences</AlertDialogTitle>
            </AlertDialogHeader>
            <label className="flex w-fit flex-col">
              Approve all
              <Switch
                className="mt-1"
                checked={approveAll}
                onClick={() => {
                  setApproveAll(!approveAll)
                  setShifts(
                    absence.shifts.map((shift) => {
                      shift.approved = !approveAll
                      return shift
                    }),
                  )
                }}
              />
            </label>
            {shifts.map((shift) => (
              <div
                key={shift.id}
                className="flex items-center justify-between border-b pb-1"
              >
                <p>
                  {new Date(shift.date * 1000).toLocaleDateString("en-GB", {
                    weekday: "short",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
                <label htmlFor={shift.id} className="flex w-fit flex-col">
                  Approved
                  <Switch
                    id={shift.id}
                    className="mt-1"
                    checked={shift.approved}
                    onClick={() => handleSwitchChange(shift.id)}
                  />
                </label>
              </div>
            ))}
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setShowAbsence(false)}>
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={() =>
                  updateAbsences.mutate(
                    shifts.map((shift) => ({
                      id: shift.id,
                      approved: shift.approved,
                    })),
                  )
                }
              >
                Continue
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  )
}
