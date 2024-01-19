"use client"

import { Button, buttonVariants } from "@/app/_components/ui/button"
import { signIn } from "next-auth/react"
import Link from "next/link"

export function SignInButton({ text }: { text?: string }) {
  return (
    <Button
      className={`${!text && "ml-1"}`}
      onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
    >
      {text ?? "Sign In"}
    </Button>
  )
}

export function GetStartedButton() {
  return (
    <Link
      target="_blank"
      href="https://staffhub-docs.vercel.app"
      className={buttonVariants({ variant: "secondary" })}
    >
      How to use
    </Link>
  )
}
