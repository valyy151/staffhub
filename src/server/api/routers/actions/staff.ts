'use server'

import { api } from '@/trpc/server'
import { TRPCClientError } from '@trpc/client'

type StaffData = { email: string; lastName: string; firstName: string }

export async function createStaff(prevState: any, formData: FormData) {
	const { email, lastName, firstName } = Object.fromEntries(formData.entries()) as StaffData

	try {
		if (!email || !lastName || !firstName) {
			throw new TRPCClientError(JSON.stringify([{ message: 'Please fill in all the fields' }]))
		}

		await api.staff.create.mutate({ email, lastName, firstName })

		return { message: 'Staff member created successfully' }
	} catch (err) {
		if (err instanceof TRPCClientError) {
			return { message: JSON.parse(err.message)[0].message }
		}
	}
}
