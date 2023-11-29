import { useRef } from 'react'

import { Input } from '@/app/_components/ui/input'
import { TableCell, TableRow } from '@/app/_components/ui/table'
import { formatDate, formatDay, renderTotal } from '@/app/lib/utils'

type Props = {
	data: Data
	index: number
	shiftModel: string
	item: {
		date: number
		end?: string | undefined
		start?: string | undefined
	}
	sickDays: number[]
	vacationDays: number[]
	setData: (data: Data) => void
}

type Data = { date: number; end?: string; start?: string }[]

export default function ShiftRow({ data, item, index, shiftModel, setData, sickDays, vacationDays }: Props) {
	const endRef = useRef<HTMLInputElement>(null)
	const startRef = useRef<HTMLInputElement>(null)

	const handleTimeChange = (index: number, newTime: string, field: 'start' | 'end') => {
		if (newTime.length > 5) {
			return
		}

		if (newTime.length === 2) {
			if (Number(newTime) > 23) {
				return
			}
			newTime += ':'
		}

		const newData = data.map((d, i) => (i === index ? { ...d, [field]: newTime } : d))
		setData(newData)
	}

	//function like handleTimeChange but it will apply it for both start and end
	const handleTimeWithClick = (index: number) => {
		const [start, end] = shiftModel?.split('-') as string[]

		if (!start || !end) {
			return
		}

		const newData = data.map((d, i) => (i === index ? { ...d, start: start, end: end } : d))
		setData(newData)
	}

	return (
		<TableRow
			key={index}
			className='hover:bg-inherit'>
			<TableCell className='flex pt-6'>
				<span> {formatDay(item.date, 'long')}</span>
				<span className='ml-auto'>{formatDate(item.date, 'long')}</span>
			</TableCell>
			{shiftModel ? (
				<>
					<TableCell onClick={() => handleTimeWithClick(index)}>
						<Input
							type='text'
							ref={startRef}
							value={item.start!}
							onKeyDown={(e) => {
								if (e.key === 'Backspace') {
									e.currentTarget.select()
									handleTimeChange(index, '', 'start')
									endRef.current?.select()
									handleTimeChange(index, '', 'end')
								}
							}}
							placeholder={vacationDays.includes(item.date) ? 'Vacation' : undefined || sickDays.includes(item.date) ? 'Sick' : undefined}
							disabled={sickDays.includes(item.date) || vacationDays.includes(item.date)}
							className={`w-fit ${shiftModel && !vacationDays.includes(item.date) && 'hover:ring-0.5 w-fit cursor-pointer ring-gray-800 dark:ring-gray-50'}`}
						/>
					</TableCell>
					<TableCell onClick={() => handleTimeWithClick(index)}>
						<Input
							ref={endRef}
							value={item.end!}
							onKeyDown={(e) => {
								if (e.key === 'Backspace') {
									e.currentTarget.select()
									handleTimeChange(index, '', 'end')
									startRef.current?.select()
									handleTimeChange(index, '', 'start')
								}
							}}
							disabled={sickDays.includes(item.date) || vacationDays.includes(item.date)}
							className={`w-fit ${shiftModel && !vacationDays.includes(item.date) && 'hover:ring-0.5 w-fit cursor-pointer ring-gray-800 dark:ring-gray-50'}`}
							type='text'
						/>
					</TableCell>
				</>
			) : (
				<>
					<TableCell>
						<Input
							type='text'
							autoFocus={index === 0}
							placeholder={vacationDays.includes(item.date) ? 'Vacation' : undefined || sickDays.includes(item.date) ? 'Sick' : undefined}
							onKeyDown={(e) => {
								if (e.key === 'Backspace') {
									e.currentTarget.select()
									handleTimeChange(index, '', 'start')
									endRef.current?.select()
									handleTimeChange(index, '', 'end')
								}
							}}
							disabled={sickDays.includes(item.date) || vacationDays.includes(item.date)}
							value={item.start!}
							onChange={(e) => handleTimeChange(index, e.target.value, 'start')}
							className='w-fit '
						/>
					</TableCell>

					<TableCell>
						<Input
							value={item.end!}
							disabled={sickDays.includes(item.date) || vacationDays.includes(item.date)}
							onChange={(e) => handleTimeChange(index, e.target.value, 'end')}
							onKeyDown={(e) => {
								if (e.key === 'Backspace') {
									e.currentTarget.select()
									handleTimeChange(index, '', 'end')
									startRef.current?.select()
									handleTimeChange(index, '', 'start')
								}
							}}
							className='w-fit'
							type='text'
						/>
					</TableCell>
				</>
			)}

			{item.start && item.end ? (
				<TableCell
					title='Total hours in shift'
					className='text-right'>
					{renderTotal(item.start, item.end)}
				</TableCell>
			) : null}

			{(vacationDays.includes(item.date) || sickDays.includes(item.date)) && (
				<TableCell
					title='Total hours in shift'
					className='text-right'>
					8h
				</TableCell>
			)}

			{!item.end && !item.start && !sickDays.includes(item.date) && !vacationDays.includes(item.date) && (
				<TableCell
					title='Total hours in shift'
					className='text-right'>
					-
				</TableCell>
			)}
		</TableRow>
	)
}
