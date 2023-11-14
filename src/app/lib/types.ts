export type Absence = { id: string; start: bigint; end: bigint }

export type Shift = { id?: string; date: number; start: number; end: number; workDayId?: string; vacation?: boolean; sickLeave?: boolean; role?: { id: string; name: string } | null }
