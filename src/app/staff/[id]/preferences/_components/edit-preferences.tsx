'use client'
import { Sticker } from 'lucide-react'
import { useRouter } from 'next-nprogress-bar'
import { useState } from 'react'

import { formatTime } from '@/lib/utils'
import { api } from '@/trpc/react'
import { StaffPreferenceOutput } from '@/trpc/shared'

import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from '../../../../_components/ui/alert-dialog'
import { Button } from '../../../../_components/ui/button'
import { Input } from '../../../../_components/ui/input'
import { useToast } from '../../../../_components/ui/use-toast'

export default function EditPreferences({ employee }: { employee: StaffPreferenceOutput }) {
	const { data: shiftModels } = api.shiftModel.get.useQuery()

	const { toast } = useToast()

	const router = useRouter()

	const [showEdit, setShowEdit] = useState(false)
	const [hoursPerMonth, setHoursPerMonth] = useState(employee?.schedulePreference?.hoursPerMonth.toString() ?? '')

	const [shiftModelIds, setShiftModelIds] = useState(
		employee?.schedulePreference?.shiftModels.map((shiftModel) => shiftModel.id) ?? []
	)

	const editPreference = api.staff.editPreference.useMutation({
		onSuccess: () => {
			router.refresh()
			setShowEdit(false)
			toast({
				title: 'Schedule preferences updated',
			})
		},
		onError: () => {
			toast({
				title: 'Error updating preferences',
			})
		},
	})

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const re = /^[0-9\b]+$/
		if (e.target.value === '' || re.test(e.target.value)) {
			setHoursPerMonth(e.target.value)
		}
	}

	return (
		<>
			<Button
				className='w-fit ml-8'
				onClick={() => setShowEdit(true)}>
				<Sticker className='mr-2' />
				Edit Schedule Preferences
			</Button>
			{showEdit && (
				<AlertDialog open>
					<AlertDialogContent>
						<AlertDialogHeader>
							<AlertDialogTitle>Edit schedule preferences for {employee?.name}</AlertDialogTitle>
							<AlertDialogDescription>
								Select the shift models and the amount of work hours per month.
							</AlertDialogDescription>
						</AlertDialogHeader>

						<div className='flex w-fit flex-col space-y-2'>
							{shiftModels?.map((shiftModel) => (
								<div className='flex'>
									<input
										type='checkbox'
										id={shiftModel.id}
										name={shiftModel.id}
										checked={shiftModelIds.includes(shiftModel.id)}
										onChange={(e) => {
											e.target.checked
												? setShiftModelIds([...shiftModelIds, shiftModel.id])
												: setShiftModelIds(shiftModelIds.filter((id) => id !== shiftModel.id))
										}}
										className='my-0.5 mr-2 h-6 w-6 cursor-pointer focus:ring-0 focus:ring-offset-0 accent-primary'
									/>
									<label
										htmlFor={shiftModel.id}
										className='cursor-pointer'>
										{formatTime(shiftModel.start * 1000)} - {formatTime(shiftModel.end * 1000)}
									</label>
								</div>
							))}
						</div>
						<div className='mt-4 flex flex-col'>
							<label className='w-fit'>
								Hours per month:
								<Input
									type='string'
									value={hoursPerMonth}
									className='mt-1 w-fit'
									onChange={handleChange}
								/>
							</label>
						</div>
						<AlertDialogFooter>
							<AlertDialogCancel onClick={() => setShowEdit(false)}>Cancel</AlertDialogCancel>
							<AlertDialogAction
								disabled={editPreference.isLoading}
								aria-disabled={editPreference.isLoading}
								onClick={() =>
									editPreference.mutate({
										shiftModelIds,
										id: employee?.id as string,
										hoursPerMonth: Number(hoursPerMonth),
									})
								}>
								Continue
							</AlertDialogAction>
						</AlertDialogFooter>
					</AlertDialogContent>
				</AlertDialog>
			)}
		</>
	)
}
