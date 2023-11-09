"use server";

import { api } from "@/trpc/server";

export async function createStaff(formData: FormData) {
  await api.staff.create.mutate({
    email: formData.get("email") as string,
    lastName: formData.get("lastName") as string,
    firstName: formData.get("firstName") as string,
  });
}
