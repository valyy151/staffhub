"use client"
import { useRouter } from "next-nprogress-bar"

import { Button } from "./_components/ui/button"

export default function Error() {
  const router = useRouter()

  return (
    <div className="mt-4 flex flex-col items-center">
      <h1 className="text-4xl font-semibold">
        There was an error loading the page.
      </h1>

      <Button
        variant={"secondary"}
        onClick={() => router.back()}
        className="mt-4 text-xl"
      >
        Go Back
      </Button>
    </div>
  )
}
