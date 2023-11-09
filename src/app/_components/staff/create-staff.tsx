"use client";

import { SubmitButton } from "./submit-button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/app/_components/ui/card";
import { Input } from "@/app/_components/ui/input";
import { useToast } from "@/app/_components/ui/use-toast";
import { api } from "@/trpc/react";

export default function CreateStaffForm() {
  const { toast } = useToast();

  const createStaff = api.staff.create.useMutation({
    onSuccess: () => {
      toast({
        title: "Staff created",
        description: "The staff has been created successfully.",
      });
      setTimeout(() => {
        location.href = "/staff";
      }, 1000);
    },

    onError: () => {
      toast({
        title: "Error",
        description: "An error occurred while creating the staff.",
      });
    },
  });

  const handleSubmit = async (formData: FormData) => {
    const { email, lastName, firstName } = Object.fromEntries(
      formData.entries(),
    );

    if (!email || !lastName || !firstName)
      return toast({
        title: "Please fill out all fields.",
      });

    createStaff.mutateAsync({
      email: email as string,
      lastName: lastName as string,
      firstName: firstName as string,
    });
  };

  return (
    <form
      action={(formData: FormData) => handleSubmit(formData)}
      className="mb-10 mt-20 flex-grow"
    >
      <Card className="mx-auto max-w-2xl">
        <CardHeader>
          <CardTitle>Create a New Employee</CardTitle>
          <CardDescription>
            Fill out the form below to create a new employee.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="firstName">First name</label>
                <Input id="firstName" name="firstName" placeholder="John" />
              </div>
              <div className="space-y-2">
                <label htmlFor="lastName">Last name</label>
                <Input id="lastName" name="lastName" placeholder="Doe" />
              </div>
            </div>
            <div className="space-y-2">
              <label htmlFor="email">Email</label>
              <Input
                id="email"
                name="email"
                placeholder="johndoe@example.com"
                type="email"
              />
            </div>

            {/* {roles?.length! > 0 && (
            <div className="space-y-2">
              <label htmlFor="role">Role</label>
              <Select onValueChange={(value) => setRole(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Role</SelectLabel>
                    {roles?.map((role) => (
                      <SelectItem key={role.id} value={role.id}>
                        {role.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          )} */}
          </div>
        </CardContent>
        <CardFooter>
          <SubmitButton />
        </CardFooter>
      </Card>
    </form>
  );
}
