"use client"
import { HomeIcon, MailIcon, PhoneIcon } from "lucide-react"
import { useRouter } from "next-nprogress-bar"
import { useState } from "react"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/app/_components/ui/alert-dialog"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/app/_components/ui/card"
import { Input } from "@/app/_components/ui/input"
import { api } from "@/trpc/react"
import type { StaffIdOutput } from "@/trpc/shared"
import { useToast } from "@/app/_components/ui/use-toast"

export default function PersonalInfoCard({
  employee,
}: {
  employee: StaffIdOutput
}) {
  const [edit, setEdit] = useState(false)
  const [email, setEmail] = useState(employee?.email)
  const [phone, setPhone] = useState(employee?.phoneNumber)
  const [address, setAddress] = useState(employee?.address)
  const [lastName, setLastName] = useState(employee?.name.split(" ")[1])
  const [firstName, setFirstName] = useState(employee?.name.split(" ")[0])

  const { toast } = useToast()

  const router = useRouter()

  const updateMutation = api.staff.createOrUpdate.useMutation({
    onSuccess: () => {
      toast({ title: "Staff Member Updated" })
      setEdit(false)
      router.refresh()
    },

    onError: () => {
      toast({ title: "Error Updating Staff Member", variant: "destructive" })
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !firstName || !lastName) {
      return toast({
        title: "Please fill out all the required fields",
        variant: "destructive",
      })
    }

    updateMutation.mutate({
      email,
      firstName,
      lastName,
      phone,
      address,
      id: employee?.id,
    })
  }

  return (
    <>
      <Card className="min-w-[24rem]">
        <CardHeader>
          <CardTitle>Personal Info</CardTitle>
        </CardHeader>

        <CardContent>
          <CardDescription>
            <span className="flex items-center">
              <PhoneIcon size={16} className="mr-2" />
              Phone: {employee?.phoneNumber}
            </span>
            <span className="flex items-center">
              <MailIcon size={16} className="mr-2" />
              Email: {employee?.email}
            </span>
            <span className="flex items-center">
              <HomeIcon size={16} className="mr-2" />
              Address: {employee?.address}
            </span>
          </CardDescription>
        </CardContent>
        <CardFooter>
          <button onClick={() => setEdit(true)}>Edit</button>
        </CardFooter>
      </Card>
      {edit && (
        <AlertDialog open>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Edit Employee Information</AlertDialogTitle>
              <AlertDialogDescription>
                Edit the employee's information below.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="space-y-2">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="first-name">First name</label>
                    <Input
                      id="first-name"
                      placeholder="John"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="last-name">Last name</label>
                    <Input
                      id="last-name"
                      placeholder="Doe"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label htmlFor="email">Email</label>
                  <Input
                    id="email"
                    placeholder="johndoe@example.com"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <h2 className="pt-1 font-bold">Optional Fields</h2>
                <div className="space-y-2">
                  <label htmlFor="phone">Phone</label>
                  <Input
                    id="phone"
                    placeholder="555-555-5555"
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="address">Address</label>
                  <Input
                    id="address"
                    placeholder="1234 Main St"
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                </div>
              </div>
              <AlertDialogFooter className="mt-4">
                <AlertDialogCancel type="button" onClick={() => setEdit(false)}>
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  type="submit"
                  aria-disabled={updateMutation.isLoading}
                  disabled={updateMutation.isLoading}
                >
                  Continue
                </AlertDialogAction>
              </AlertDialogFooter>
            </form>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </>
  )
}
