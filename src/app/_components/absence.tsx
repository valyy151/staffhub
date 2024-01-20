"use client"
import type { Absence } from "@/lib/types"
import { MoreVerticalIcon, Trash2Icon } from "lucide-react"
import { useRouter } from "next-nprogress-bar"
import { useState } from "react"

import { Card, CardHeader, CardTitle } from "@/app/_components/ui/card"
import { howManyDays } from "@/lib/utils"
import { api } from "@/trpc/react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu"
import FormModal from "./ui/form-modal"
import { useToast } from "./ui/use-toast"

export default function Absence({
  absence,
  type,
}: {
  absence: Absence
  type: "vacation" | "sick"
}) {
  const [showModal, setShowModal] = useState<boolean>(false)

  const { toast } = useToast()

  const router = useRouter()

  const mutation =
    type === "vacation" ? api.vacation.delete : api.sickLeave.delete

  const toastText = type === "vacation" ? "Vacation" : "Sick Leave"

  const deleteAbsence = mutation.useMutation({
    onSuccess: () => {
      toast({
        title: `${toastText} deleted`,
      })
      setShowModal(false)
      router.refresh()
    },
    onError: () => {
      toast({
        title: `Error deleting ${toastText}`,
        variant: "destructive",
      })
    },
  })

  return (
    <Card className="mb-2 md:mb-4">
      <CardHeader className="px-2 py-2 md:px-4">
        <div className="md:text-md flex flex-col text-xs text-muted-foreground">
          <div className="flex items-center justify-between pb-6">
            <CardTitle className="text-md md:text-lg">
              Amount: {howManyDays(absence) + 1}{" "}
              {type === "vacation" ? "Vacation" : "Sick"}{" "}
              {howManyDays(absence) + 1 === 1 ? "Day" : "Days"}
            </CardTitle>
            <DropdownMenu>
              <DropdownMenuTrigger className="focus-visible:outline-none">
                <MoreVerticalIcon size={18} />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="mt-2">
                <DropdownMenuItem
                  className="cursor-pointer text-sm"
                  onClick={() => setShowModal(true)}
                >
                  <Trash2Icon size={18} className="mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <span className="flex justify-between">
            <span>
              Start:{" "}
              {new Date(Number(absence.start)).toLocaleDateString("en-GB", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </span>
            <span>
              End:{" "}
              {new Date(Number(absence.end)).toLocaleDateString("en-GB", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </span>
          </span>
        </div>
      </CardHeader>

      <FormModal
        open={showModal}
        cancel={setShowModal}
        pending={deleteAbsence.isLoading}
        submit={() => deleteAbsence.mutate({ id: absence.id })}
        heading={`Delete ${type === "vacation" ? "vacation" : "sick Leave"}?`}
        text={`Are you sure you want to delete this ${
          type === "vacation" ? "vacation" : "sick leave"
        }?`}
      />
    </Card>
  )
}
