'use client'

import Link from 'next/link'
import { Button, buttonVariants } from './ui/button'
import { signIn } from 'next-auth/react'

export function SignInButton({ text }: { text?: string }) {
	return (
		<Button
			className={`${!text && 'ml-1'}`}
			onClick={() => signIn('google')}>
			{text ?? 'Sign In'}
		</Button>
	)
}

export function GetStartedButton() {
	return (
		<Link
			target='_blank'
			href='https://staffhub-docs.vercel.app'
			className={buttonVariants({ variant: 'secondary' })}>
			How to use
		</Link>
	)
}
