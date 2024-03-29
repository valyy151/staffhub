"use client"

import { InfoIcon, UserCogIcon } from "lucide-react"
import { useRouter } from "next-nprogress-bar"
import { useState } from "react"

import { api } from "@/trpc/react"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/app/_components/ui/alert-dialog"
import { useToast } from "@/app/_components/ui/use-toast"
import { Button } from "@/app/_components/ui/button"
import { Input } from "@/app/_components/ui/input"
import InfoModal from "@/app/_components/ui/info-modal"

const sentences = [
  "Staff roles are used to assign permissions to staff members.",
  "For example, you can create a role called 'Manager' or 'Drive' and assign it to one of your staff members.",
  "You can then use these roles when planning your schedules to know what roles are filled and what roles need to be filled.",
]

export default function CreateRole() {
  const { toast } = useToast()

  const router = useRouter()

  const [showModal, setShowModal] = useState(false)
  const [showCreate, setShowCreate] = useState(false)

  const [role, setRole] = useState("")
  const [number, setNumber] = useState("")

  const createStaffRole = api.role.create.useMutation({
    onSuccess: ({ name }) => {
      toast({
        title: `Staff Role ${name} created successfully.`,
      })
      setRole("")
      setNumber("")
      setShowCreate(false)
      router.refresh()
    },

    onError: () => {
      toast({
        title: "There was a problem creating the staff role.",
        variant: "destructive",
      })
    },
  })

  function handleSubmit() {
    if (!role) {
      toast({
        title: "Please enter a role name.",
      })
      return
    }

    createStaffRole.mutate({
      name: role,
      numberPerDay: parseInt(number) | 0,
    })
  }

  return (
    <>
      <div className="flex flex-col gap-1 md:flex-row">
        <Button onClick={() => setShowCreate(true)}>
          <UserCogIcon className="mr-2" /> New Staff Role
        </Button>
        <Button variant={"secondary"} onClick={() => setShowModal(true)}>
          <InfoIcon className="mr-2" /> What are Staff Roles?
        </Button>
      </div>
      <InfoModal
        open={showModal}
        text={sentences}
        close={setShowModal}
        heading="What are Staff Roles?"
      />

      {showCreate && (
        <AlertDialog open>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle> New Staff Role</AlertDialogTitle>
            </AlertDialogHeader>
            <div className="flex flex-col space-y-4">
              <div>
                <label>Staff Role</label>
                <Input
                  value={role}
                  placeholder="Enter the role name..."
                  onChange={(e) => setRole(e.target.value)}
                />
              </div>
              <div>
                <label className="leading-5">
                  How many of this role do you need in one day? (Leave blank if
                  not sure)
                </label>
                <Input
                  type="number"
                  value={number}
                  placeholder="Enter the number..."
                  onChange={(e) =>
                    setNumber(parseInt(e.target.value).toString())
                  }
                  className="[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                />
              </div>
            </div>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setShowCreate(false)}>
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleSubmit}
                disabled={createStaffRole.isLoading}
                aria-disabled={createStaffRole.isLoading}
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
