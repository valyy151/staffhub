'use client'

import { Button } from './ui/button'
import { signIn, signOut } from 'next-auth/react'

export function SignInButton({ text }: { text?: string }) {
	return <Button onClick={() => signIn('google')}>{text ?? 'Sign In'}</Button>
}

export function SignOutButton() {
	return <Button onClick={() => signOut()}>Sign Out</Button>
}
