'use client'
import { api } from '@/trpc/react'
import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css'
import { useEffect, useState } from 'react'
import { Button } from '../_components/ui/button'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { Select, SelectContent, SelectTrigger, SelectValue } from '@/app/_components/ui/select'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
	const router = useRouter()
	const searchParams = useSearchParams()

	const pathname = usePathname()

	const pageParams = Number(searchParams.get('page'))
	const monthParams = new Date(String(searchParams.get('month')).split('/').reverse().join('-'))

	const { data: firstAndLastDays } = api.dashboard.findFirstAndLastDay.useQuery()

	const [page, setPage] = useState<number>(pageParams)
	const [value, setValue] = useState<Date>(new Date(String(monthParams).split('/').reverse().join('-')))

	const [showCalendar, setShowCalendar] = useState<boolean>(false)

	useEffect(() => {
		router.push(`${pathname}?page=${page}&month=${value.toLocaleDateString('en-GB', { year: 'numeric', month: 'numeric' })}`)
	}, [page, value])

	useEffect(() => {
		setPage(0)
	}, [value])

	return (
		<div className='flex'>
			<aside className='w-72 overflow-auto border-r h-screen'>
				<nav className='flex flex-col gap-4 p-4'>
					<h2 className='text-lg font-semibold'>Filters</h2>
					<div className='space-y-4'>
						<Select
							open={showCalendar}
							onOpenChange={() => setShowCalendar(!showCalendar)}>
							<SelectTrigger
								onClick={() => setShowCalendar(!showCalendar)}
								className='focus:ring-0 focus:ring-offset-0'>
								<SelectValue
									placeholder={new Date(value).toLocaleDateString('en-GB', {
										year: 'numeric',
										month: 'long',
									})}
								/>
							</SelectTrigger>
							<SelectContent>
								<Calendar
									view='month'
									maxDetail='year'
									next2Label={null}
									prev2Label={null}
									activeStartDate={value!}
									onChange={(value) => {
										setValue(value as Date)
										setShowCalendar(false)
									}}
									maxDate={new Date(1000 * firstAndLastDays?.[1]?.date!)}
									minDate={new Date(1000 * firstAndLastDays?.[0]?.date!)}
								/>
							</SelectContent>
						</Select>
						<div className='flex space-x-1'>
							<Button
								variant={'outline'}
								title='Previous Week'
								onClick={() => {
									setPage(page - 1)
								}}>
								Prev Week
							</Button>

							<Button
								variant={'outline'}
								title='Next Week'
								onClick={() => {
									setPage(page + 1)
								}}>
								Next Week
							</Button>
						</div>
						{/* <div className='flex justify-center pt-6'>{isLoading && <Spinner noMargin />}</div> */}
					</div>
				</nav>
			</aside>
			<main className='w-full'>{children}</main>
		</div>
	)
}
