"use client"

import { InfoIcon, UserCogIcon } from "lucide-react"
import { useRouter } from "next-nprogress-bar"
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
import Heading from "@/app/_components/ui/heading"
import { Input } from "@/app/_components/ui/input"
import { handleTimeChange, renderTotal } from "@/lib/utils"
import { api } from "@/trpc/react"

import { Button } from "../../../_components/ui/button"
import InfoModal from "../../../_components/ui/info-modal"
import { useToast } from "../../../_components/ui/use-toast"

const sentences = [
  "Shift models are a way to describe the different types of shifts available that you use most often. For example: 06:00 - 14:00 or 12:00 - 20:00",
  "You can use this to create schedules faster by selecting a shift model and applying it quickly to a day.",
  "You can also use it to assign it to your staff if they have a preference to work those shifts.",
]

export default function CreateModel() {
  const router = useRouter()
  const { toast } = useToast()

  const [end, setEnd] = useState("")
  const [start, setStart] = useState("")

  const [showModal, setShowModal] = useState(false)
  const [showCreate, setShowCreate] = useState(false)

  const handleSubmit = () => {
    const date = new Date()

    const [hour, minute] = start.split(":")

    date.setHours(Number(hour))
    date.setMinutes(Number(minute))

    const startUnixTime = Math.floor(date.getTime() / 1000)

    date.setHours(Number(end.split(":")[0]))
    date.setMinutes(Number(end.split(":")[1]))

    const endUnixTime = Math.floor(date.getTime() / 1000)

    createModel.mutate({
      end: endUnixTime,
      start: startUnixTime,
    })
  }

  const createModel = api.shiftModel.create.useMutation({
    onSuccess: () => {
      toast({
        title: `Shift Model created`,
      })
      setShowCreate(false)
      router.refresh()
    },

    onError: () => {
      toast({
        title: `Error creating Shift Model`,
        variant: "destructive",
      })
    },
  })

  return (
    <>
      <div className="flex flex-col gap-1 md:flex-row">
        <Button onClick={() => setShowCreate(true)}>
          <UserCogIcon className="mr-2" /> New Shift Model
        </Button>
        <Button variant={"secondary"} onClick={() => setShowModal(true)}>
          <InfoIcon className="mr-2" /> What are Shift Models?
        </Button>
      </div>
      <AlertDialog open={showCreate}>
        <AlertDialogContent className="min-w-[35rem]">
          <AlertDialogHeader>
            <AlertDialogTitle> New Shift Model</AlertDialogTitle>
          </AlertDialogHeader>
          <div className="flex w-full flex-col items-center gap-2">
            <div className="w-full">
              <label htmlFor="start">Start</label>

              <Input
                type="text"
                name="start"
                value={start}
                className="w-full"
                placeholder="Start time"
                onChange={(e) =>
                  handleTimeChange(e.target.value, "start", setStart, setEnd)
                }
              />
            </div>

            <div className="w-full">
              <label htmlFor="end">End</label>

              <Input
                name="end"
                type="text"
                value={end}
                className="w-full"
                placeholder="End time"
                onChange={(e) =>
                  handleTimeChange(e.target.value, "end", setStart, setEnd)
                }
              />
            </div>
            <div className="flex items-baseline">
              <label htmlFor="end" className="ml-2">
                Total:
              </label>

              <Heading size={"xxs"} className="ml-2 mt-2">
                {renderTotal(start, end)}
              </Heading>
            </div>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowCreate(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleSubmit}
              disabled={createModel.isLoading}
              aria-disabled={createModel.isLoading}
            >
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <InfoModal
        open={showModal}
        text={sentences}
        close={setShowModal}
        heading={"What are Shift Models?"}
      />
    </>
  )
}
