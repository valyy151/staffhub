import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import type { Absence, Shift } from './types'

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs))
}

export const generatePagination = (currentPage: number, totalPages: number) => {
	// If the total number of pages is 7 or less,
	// display all pages without any ellipsis.
	if (totalPages <= 7) {
		return Array.from({ length: totalPages }, (_, i) => i + 1)
	}

	// If the current page is among the first 3 pages,
	// show the first 3, an ellipsis, and the last 2 pages.
	if (currentPage <= 3) {
		return [1, 2, 3, '...', totalPages - 1, totalPages]
	}

	// If the current page is among the last 3 pages,
	// show the first 2, an ellipsis, and the last 3 pages.
	if (currentPage >= totalPages - 2) {
		return [1, 2, '...', totalPages - 2, totalPages - 1, totalPages]
	}

	// If the current page is somewhere in the middle,
	// show the first page, an ellipsis, the current page and its neighbors,
	// another ellipsis, and the last page.
	return [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages]
}

export const checkAbsence = (sickLeaves: Absence[], vacations: Absence[]) => {
	const currentDate = Date.now()

	for (const sickLeave of sickLeaves) {
		const startDate: Date = new Date(Number(sickLeave.start))
		const endDate: Date = new Date(Number(sickLeave.end))

		if (Number(currentDate) >= Number(startDate) && Number(currentDate) <= Number(endDate)) {
			const remainingDays = Math.ceil((Number(endDate) - currentDate) / (1000 * 60 * 60 * 24))
			return 'Currently on sick leave for ' + remainingDays + ' more days'
		}
	}

	for (const vacation of vacations) {
		const startDate: Date = new Date(Number(vacation.start))
		const endDate: Date = new Date(Number(vacation.end))

		if (Number(currentDate) >= Number(startDate) && Number(currentDate) <= Number(endDate)) {
			const remainingDays = Math.ceil((Number(endDate) - currentDate) / (1000 * 60 * 60 * 24))
			return 'Currently on vacation for ' + remainingDays + ' more days'
		}
	}

	return 'Currently working'
}

export const findAbsences = (sickLeaves: Absence[]) => {
	let days = 0

	const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1).getTime()
	const endOfMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getTime()

	for (const sickLeave of sickLeaves) {
		const startDate: Date = new Date(Number(sickLeave.start))
		const endDate: Date = new Date(Number(sickLeave.end))

		if (Number(startDate) >= startOfMonth && Number(endDate) <= endOfMonth) {
			days += Math.ceil((Number(endDate) - Number(startDate)) / (1000 * 60 * 60 * 24))
		}
	}

	return days
}

export const calculateHours = (shifts: Shift[]): string => {
	let hours = 0
	let minutes = 0

	for (const shift of shifts) {
		if (shift.start && shift.end) {
			const diff = Number(shift.end) - Number(shift.start)

			const diffHours = Math.floor(diff / 3600)

			const diffMinutes = Math.floor((diff % 3600) / 60)

			hours += diffHours
			minutes += diffMinutes
		}
	}

	hours += Math.floor(minutes / 60)

	if (minutes === 0) {
		return hours + 'h'
	}

	return hours + 'h ' + (minutes % 60) + 'm'
}

export const getMonth = (date: Date) => {
	date.setDate(1)
	date.setHours(0, 0, 0, 0)
	const startOfMonth = Math.floor(date.getTime() / 1000)

	date.setMonth(date.getMonth() + 1)
	date.setDate(date.getDate() - 1)
	date.setHours(23, 59, 59, 999)
	const endOfMonth = Math.floor(date.getTime() / 1000)

	return [startOfMonth, endOfMonth]
}

export const checkAbsences = (absences: Absence[]): [Absence[], Absence | undefined, Absence[]] => {
	const today = new Date().getTime()

	const currentAbsence = absences.find((absence) => {
		return absence.start < BigInt(today) && absence.end > BigInt(today)
	})

	const pastAbsences = absences.filter((absence) => {
		return absence.end < BigInt(today)
	})

	const upcomingAbsences = absences.filter((absence) => {
		return absence.start > BigInt(today)
	})

	return [pastAbsences, currentAbsence, upcomingAbsences]
}

export const howManyDays = (sickLeave: Absence) => {
	const days = (sickLeave.end - sickLeave.start) / BigInt(86400000)
	return Number(days)
}

export const formatTime = (unix: number) => {
	return new Date(unix).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
}
