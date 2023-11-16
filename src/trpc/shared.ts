import { type inferRouterInputs, type inferRouterOutputs } from '@trpc/server'
import superjson from 'superjson'

import { type AppRouter } from '@/server/api/root'

export const transformer = superjson

function getBaseUrl() {
	if (typeof window !== 'undefined') return ''
	if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`
	return `http://localhost:${process.env.PORT ?? 3000}`
}

export function getUrl() {
	return getBaseUrl() + '/api/trpc'
}

/**
 * Inference helper for inputs.
 *
 * @example type HelloInput = RouterInputs['example']['hello']
 */
export type RouterInputs = inferRouterInputs<AppRouter>

/**
 * Inference helper for outputs.
 *
 * @example type HelloOutput = RouterOutputs['example']['hello']
 */
export type RouterOutputs = inferRouterOutputs<AppRouter>

export type StaffOutput = RouterOutputs['staff']['get'][number]

export type StaffIdOutput = RouterOutputs['staff']['getId']

export type DashboardOutput = RouterOutputs['dashboard']['find']

export type StaffRolesOutput = RouterOutputs['staff']['getRoles']

export type StaffScheduleOutput = RouterOutputs['staff']['getSchedule']

export type StaffPreferenceOutput = RouterOutputs['staff']['getPreference']

export type StaffDropdownOutput = RouterOutputs['staff']['getDropdown'][number]

export type StaffAbsenceOutput = RouterOutputs['staff']['getSickLeaves'] | RouterOutputs['staff']['getVacations']
