'use server'

import { api } from '@/trpc/server'

type StaffData = { email: string; lastName: string; firstName: string }

export async function createStaff(prevState: any, formData: FormData) {
	const { email, lastName, firstName } = Object.fromEntries(formData.entries()) as StaffData

	try {
		if (!email || !lastName || !firstName) {
			throw new Error('Please fill out all fields')
		}

		await api.staff.create.mutate({ email, lastName, firstName })

		return { message: 'Staff member created successfully' }
	} catch (err) {
		if (err instanceof Error) {
			return { message: JSON.parse(err.message)[0].message }
		}
	}
}
