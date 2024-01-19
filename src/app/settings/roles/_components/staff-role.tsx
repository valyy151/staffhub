"use client"

import { UserCogIcon } from "lucide-react"
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

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/app/_components/ui/card"
import { useToast } from "@/app/_components/ui/use-toast"
import { Button } from "@/app/_components/ui/button"
import FormModal from "@/app/_components/ui/form-modal"
import { Input } from "@/app/_components/ui/input"

type Role = {
  id: string
  numberPerDay: number | null
  name: string
  userId: string
  color: string | null
}

export default function StaffRole({ role }: { role: Role }) {
  const { toast } = useToast()
  const router = useRouter()
  const [edit, setEdit] = useState(false)
  const [showModal, setShowModal] = useState(false)

  const [name, setName] = useState(role.name)
  const [numberPerDay, setNumberPerDay] = useState(
    role.numberPerDay?.toString(),
  )

  const deleteStaffRole = api.role.delete.useMutation({
    onSuccess: () => {
      toast({
        title: "Staff Role deleted successfully.",
      })
      setShowModal(false)
      router.refresh()
    },

    onError: () => {
      toast({
        title: "There was a problem deleting the staff role.",
        variant: "destructive",
      })
    },
  })

  const updateStaffRole = api.role.update.useMutation({
    onSuccess: () => {
      toast({
        title: "Staff Role updated successfully.",
      })
      setEdit(false)
      router.refresh()
    },

    onError: () => {
      toast({
        title: "There was a problem updating the staff role.",
        variant: "destructive",
      })
    },
  })

  function handleSubmit() {
    updateStaffRole.mutate({
      name,
      staffRoleId: role.id,
      numberPerDay: Number(numberPerDay),
    })
  }

  return (
    <>
      <Card className="w-fit">
        <CardHeader>
          <CardTitle className="flex items-center text-lg">
            <UserCogIcon className="mr-2" /> {role.name}
          </CardTitle>
        </CardHeader>
        <CardContent>Minimum per day: {role.numberPerDay}</CardContent>
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
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle> Edit Staff Role</AlertDialogTitle>
            </AlertDialogHeader>
            <div className="flex items-center space-x-4">
              <div>
                <label htmlFor="name">Name</label>

                <Input
                  type="text"
                  name="name"
                  placeholder="Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div>
                <label htmlFor="numberPerDay">Minimum per day</label>

                <Input
                  type="number"
                  name="numberPerDay"
                  placeholder="Minimum"
                  value={numberPerDay}
                  className="[appearance:textfield]  [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                  onChange={(e) => setNumberPerDay(e.target.value)}
                />
              </div>
            </div>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setEdit(false)}>
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction onClick={handleSubmit}>
                Continue
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
      {showModal && (
        <FormModal
          showModal={showModal}
          heading={"Delete Staff Role?"}
          cancel={() => setShowModal(false)}
          pending={deleteStaffRole.isLoading}
          submit={() => deleteStaffRole.mutate({ id: role.id })}
          text={`Are you sure you want to delete the ${role.name} staff role?`}
        />
      )}
    </>
  )
}
