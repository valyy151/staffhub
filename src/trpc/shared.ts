import superjson from "superjson";

import { AppRouter } from "@/server/api/root";
import { inferRouterInputs, inferRouterOutputs } from "@trpc/server";

export const transformer = superjson

function getBaseUrl() {
	if (typeof window !== 'undefined') return '' // browser should use relative url
	if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}` // SSR should use vercel url
	if (process.env.INTERNAL_ADDRESS) return `http://${process.env.INTERNAL_ADDRESS}:${process.env.PORT ?? 3000}`
	return `http://localhost:${process.env.PORT ?? 3000}` // dev SSR should use localhost
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

export type WorkDayShiftsOutput = Pick<WorkDayOutput, 'shifts'>

export type WorkDayOutput = RouterOutputs['workDay']['getShifts']

export type StaffScheduleOutput = RouterOutputs['staff']['getSchedule']

export type StaffPreferenceOutput = RouterOutputs['staff']['getPreference']

export type StaffDropdownOutput = RouterOutputs['staff']['getDropdown'][number]

export type StaffAbsenceOutput = RouterOutputs['staff']['getSickLeaves'] | RouterOutputs['staff']['getVacations']
