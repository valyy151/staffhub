"use client"

import { useRouter } from "next-nprogress-bar"
import { useState } from "react"

import { formatTime, handleTimeChange, renderTotal } from "@/lib/utils"
import { api } from "@/trpc/react"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../../../_components/ui/alert-dialog"
import { Button } from "../../../_components/ui/button"
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../../_components/ui/card"
import FormModal from "../../../_components/ui/form-modal"
import Heading from "../../../_components/ui/heading"
import { Input } from "../../../_components/ui/input"
import { useToast } from "../../../_components/ui/use-toast"

export default function ShiftModel({
  shiftModel,
}: {
  shiftModel: { id: string; start: number; end: number }
}) {
  const router = useRouter()
  const { toast } = useToast()

  const [edit, setEdit] = useState(false)
  const [showModal, setShowModal] = useState(false)

  const [end, setEnd] = useState<string>(formatTime(shiftModel.end))
  const [start, setStart] = useState<string>(formatTime(shiftModel.start))

  const editShiftModel = api.shiftModel.update.useMutation({
    onSuccess: () => {
      setEdit(false)
      router.refresh()
      toast({
        title: "Shift model updated successfully.",
      })
    },

    onError: () => {
      toast({
        title: "There was a problem updating the shift model.",
        variant: "destructive",
      })
    },
  })

  const deleteShiftModel = api.shiftModel.delete.useMutation({
    onSuccess: () => {
      router.refresh()
      toast({
        title: "Shift model deleted successfully.",
      })
    },

    onError: () => {
      toast({
        title: "There was a problem deleting the shift model.",
        variant: "destructive",
      })
    },
  })

  const handleSubmit = () => {
    const date = new Date()

    const [hour, minute] = start.split(":")

    date.setHours(Number(hour))

    date.setMinutes(Number(minute))

    const startUnixTime = Math.floor(date.getTime() / 1000)

    date.setHours(Number(end.split(":")[0]))

    date.setMinutes(Number(end.split(":")[1]))

    const endUnixTime = Math.floor(date.getTime() / 1000)

    editShiftModel.mutate({
      id: shiftModel.id,
      start: startUnixTime,
      end: endUnixTime,
    })
  }

  return (
    <>
      <Card className="w-fit">
        <CardHeader>
          <CardTitle>
            {start} - {end}
          </CardTitle>
          <CardDescription className="text-lg">
            Total hours: {renderTotal(start, end)}
          </CardDescription>
        </CardHeader>

        <CardFooter className="space-x-2">
          <Button size={"lg"} onClick={() => setEdit(true)}>
            Edit
          </Button>
          <Button
            size={"lg"}
            variant={"secondary"}
            onClick={() => setShowModal(true)}
          >
            Delete
          </Button>
        </CardFooter>
      </Card>
      {edit && (
        <AlertDialog open>
          <AlertDialogContent className="min-w-[35rem]">
            <AlertDialogHeader>
              <AlertDialogTitle> Edit Shift Model</AlertDialogTitle>
            </AlertDialogHeader>
            <div className="flex items-center space-x-4">
              <div>
                <label>Start Time</label>
                <Input
                  type="text"
                  value={start}
                  onChange={(e) =>
                    handleTimeChange(e.target.value, "start", setStart, setEnd)
                  }
                />
              </div>
              <div>
                <label>End Time</label>
                <Input
                  type="text"
                  value={end}
                  onChange={(e) =>
                    handleTimeChange(e.target.value, "end", setStart, setEnd)
                  }
                />
              </div>
              <div>
                <label htmlFor="end" className="ml-2">
                  Total
                </label>

                <Heading size={"xxs"} className="ml-2 mt-2">
                  {renderTotal(start, end)}
                </Heading>
              </div>
            </div>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setEdit(false)}>
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleSubmit}
                disabled={editShiftModel.isLoading}
                aria-disabled={editShiftModel.isLoading}
              >
                Continue
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
      {showModal && (
        <FormModal
          showModal={showModal}
          pending={deleteShiftModel.isLoading}
          heading={"Delete Shift Model?"}
          cancel={() => setShowModal(false)}
          text="Are you sure you want to delete this shift model?"
          submit={() => deleteShiftModel.mutate({ id: shiftModel.id })}
        />
      )}
    </>
  )
}
