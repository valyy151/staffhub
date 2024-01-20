"use client"
import { addDays, differenceInDays, startOfToday } from "date-fns"
import { HeartPulseIcon, PalmtreeIcon } from "lucide-react"
import { useRouter } from "next-nprogress-bar"
import { useState } from "react"

import { api } from "@/trpc/react"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog"
import { Button } from "./ui/button"
import { DatePickerWithRange } from "./ui/date-range-picker"
import { useToast } from "./ui/use-toast"

import type { StaffAbsenceOutput } from "@/trpc/shared"
import type { DateRange } from "react-day-picker"
export default function NewAbsence({
  employee,
  type,
}: {
  employee: StaffAbsenceOutput
  type: "vacation" | "sick"
}) {
  const [showCreate, setShowCreate] = useState(false)

  const [date, setDate] = useState<DateRange | undefined>({
    from: startOfToday(),
    to: addDays(new Date(), 5),
  })

  const { toast } = useToast()

  const router = useRouter()

  const mutation =
    type === "vacation" ? api.vacation.create : api.sickLeave.create

  const toastText = type === "vacation" ? "Vacation" : "Sick Leave"

  const createAbsence = mutation.useMutation({
    onSuccess: () => {
      toast({
        title: `${toastText} created`,
      })
      setShowCreate(false)
      router.refresh()
    },

    onError: () => {
      toast({
        title: `Error creating ${toastText}`,
        variant: "destructive",
      })
    },
  })

  return (
    <>
      <Button onClick={() => setShowCreate(true)} className="md:ml-16">
        {type === "vacation" ? (
          <PalmtreeIcon size={20} className="mr-2"></PalmtreeIcon>
        ) : (
          <HeartPulseIcon size={20} className="mr-2" />
        )}
        New {type === "vacation" ? "Vacation" : "Sick Leave"}
      </Button>

      <Dialog open={showCreate} onOpenChange={setShowCreate}>
        <DialogContent className="min-h-max">
          <DialogHeader>
            <DialogTitle>
              New {type === "vacation" ? "Vacation" : "Sick Leave"}{" "}
            </DialogTitle>
            <DialogDescription>
              Days planned:{" "}
              <span>
                {differenceInDays(date?.to!, date?.from!) + 1 > 0
                  ? differenceInDays(date?.to!, date?.from!) + 1
                  : 0}
              </span>
            </DialogDescription>
          </DialogHeader>
          <DatePickerWithRange date={date} setDate={setDate} />

          <DialogFooter>
            <Button
              onClick={() => {
                createAbsence.mutate({
                  employeeId: employee?.id as string,
                  end: date?.to?.getTime() as number,
                  start: date?.from?.getTime() as number,
                })
              }}
              disabled={createAbsence.isLoading}
              aria-disabled={createAbsence.isLoading}
            >
              Submit
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
