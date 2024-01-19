"use client"

import {
  HeartPulseIcon,
  MoreVerticalIcon,
  PalmtreeIcon,
  Trash2Icon,
} from "lucide-react"
import { useRouter } from "next-nprogress-bar"
import { useState } from "react"

import type { Absence } from "@/lib/types"
import { api } from "@/trpc/react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu"
import FormModal from "./ui/form-modal"
import Heading from "./ui/heading"
import { useToast } from "./ui/use-toast"

export default function Absence({
  absence,
  type,
}: {
  absence: Absence
  type: "vacation" | "sick"
}) {
  const [showModal, setShowModal] = useState(false)

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
    <div className="mt-4 flex min-w-[46rem] items-center justify-between rounded-md border bg-red-500 px-2 py-2 text-white">
      <Heading size={"xxs"} className="flex items-center">
        {type === "vacation" ? (
          <PalmtreeIcon size={42} className="ml-1 mr-2" />
        ) : (
          <HeartPulseIcon size={42} className="ml-1 mr-2" />
        )}
        Currently on {type === "vacation" ? "Vacation" : "Sick Leave"}
      </Heading>

      <p className="font-semibold">
        {new Date(Number(absence?.start)).toLocaleDateString(undefined, {
          month: "short",
          day: "numeric",
          year: "numeric",
        })}{" "}
        -{" "}
        {new Date(Number(absence?.end)).toLocaleDateString(undefined, {
          month: "short",
          day: "numeric",
          year: "numeric",
        })}{" "}
        (Ends in {Math.round((Number(absence?.end) - Date.now()) / 86400000)}{" "}
        days)
      </p>

      <DropdownMenu>
        <DropdownMenuTrigger className="focus-visible:outline-none">
          <MoreVerticalIcon size={20} />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem
            className="cursor-pointer text-sm"
            onClick={() => setShowModal(true)}
          >
            <Trash2Icon size={18} className="mr-2" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {showModal && (
        <FormModal
          showModal={showModal}
          pending={deleteAbsence.isLoading}
          cancel={() => setShowModal(false)}
          submit={() => deleteAbsence.mutate({ id: absence.id })}
          heading={`Delete ${type === "vacation" ? "vacation" : "sick leave"}?`}
          text={`Are you sure you want to delete this ${
            type === "vacation" ? "vacation" : "sick leave"
          }?`}
        />
      )}
    </div>
  )
}
