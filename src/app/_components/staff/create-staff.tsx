"use client";

import { Input } from "@/app/_components/ui/input";
import { createStaff } from "@/app/api/auth/staff";
import { Button } from "@/app/_components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/app/_components/ui/card";
import { SubmitButton } from "./submit-button";
import { useFormState } from "react-dom";

export default function CreateStaffForm() {
  const initialState = { message: null, type: null };
  const [formState, formAction] = useFormState(createStaff, initialState);
  return (
    <form action={formAction} className="mb-10 mt-20 flex-grow">
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
                <label htmlFor="first-name">First name</label>
                <Input
                  id="firstName"
                  name="firstName"
                  defaultValue=""
                  placeholder="John"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="last-name">Last name</label>
                <Input
                  id="lastName"
                  name="lastName"
                  placeholder="Doe"
                  defaultValue=""
                />
              </div>
            </div>
            <div className="space-y-2">
              <label htmlFor="email">Email</label>
              <Input
                id="email"
                name="email"
                placeholder="johndoe@example.com"
                type="email"
                defaultValue=""
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
              <Selectlabel>Role</Selectlabel>
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

          <span
            className={`${
              formState.type === "error" && "text-red-500"
            } mt-2 flex h-2 flex-col items-center font-medium`}
          >
            {formState.message}
          </span>
        </CardContent>
        <CardFooter>
          <SubmitButton />
        </CardFooter>
      </Card>
    </form>
  );
}
