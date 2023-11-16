export type Absence = { id: string; start: bigint; end: bigint }

export type Shift = { id?: string; date: number; start: number; end: number; workDayId?: string; vacation?: boolean; sickLeave?: boolean; role?: { id: string; name: string } | null }

export type ShiftModel = { id: string; start: number; end: number }

export type Note = {
	id: string
	date: number
	userId: string
	content: string
	createdAt: Date
	workDayId: string
}

export type DashboardAbsence = {
	shifts: { id: string; approved: boolean; date: number }[]
	reason: string
	absent: boolean
	approved: boolean
	employee: {
		name: string
		id: string
	}
	amount: number
}
