'use client'

import { useFormStatus } from 'react-dom'
import { Button } from '../ui/button'

export function SubmitButton() {
	const { pending } = useFormStatus()
	return (
		<Button className='w-full' type='submit' aria-disabled={pending} disabled={pending}>
			Create User
		</Button>
	)
}
