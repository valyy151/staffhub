'use client'
import { ClipboardEdit, Clock, MoreVertical, Trash2 } from 'lucide-react'
import { useRouter } from 'next-nprogress-bar'
import Link from 'next/link'
import { useState } from 'react'

import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from '@/app/_components/ui/alert-dialog'
import { Input } from '@/app/_components/ui/input'
import { PopoverContent } from '@/app/_components/ui/popover'
import { Switch } from '@/app/_components/ui/switch'
import { TableCell, TableRow } from '@/app/_components/ui/table'
import { useToast } from '@/app/_components/ui/use-toast'
import type { ShiftEmployee, ShiftModel, ShiftRow } from '@/app/lib/types'
import { formatDate, formatDay, formatTime, formatTotal } from '@/app/lib/utils'
import { api } from '@/trpc/react'
import { Popover, PopoverTrigger } from '@radix-ui/react-popover'

import EditShift from '../ui/edit-shift'
import FormModal from '../ui/form-modal'

type ShiftProps = {
	shift: ShiftRow
	shiftModels: ShiftModel[] | undefined
}

export default function Shift({ shift, shiftModels }: ShiftProps) {
	const [showModal, setShowModal] = useState(false)

	const [approved, setApproved] = useState<boolean>(shift.absence?.approved || false)

	const [absent, setAbsent] = useState<boolean>(shift.absence?.absent || false)

	const [editMode, setEditMode] = useState<boolean>(false)

	const [reason, setReason] = useState<string>(shift.absence?.reason || '')

	const [editAbsence, setEditAbsence] = useState<boolean>(false)

	const { toast } = useToast()

	const router = useRouter()

	const updateAbsenceMutation = api.shift.createOrUpdateAbsence.useMutation({
		onSuccess: () => {
			toast({
				title: 'Absence updated successfully.',
			})
			setEditAbsence(false)
			router.refresh()
		},

		onError: () => {
			toast({
				title: 'There was a problem updating the absence.',
				variant: 'destructive',
			})
		},
	})

	const deleteShiftMutation = api.shift.delete.useMutation({
		onSuccess: () => {
			toast({
				title: 'Shift deleted successfully.',
			})
			setShowModal(false)
			router.refresh()
		},

		onError: () => {
			toast({
				title: 'There was a problem deleting the shift.',
				variant: 'destructive',
			})
		},
	})

	return (
		<>
			<TableRow className='hover:bg-inherit'>
				<TableCell>
					<Link
						href={`/staff/${shift.employee.id}`}
						className='underline-offset-4 hover:underline'>
						{shift.employee.name}
					</Link>
				</TableCell>
				<TableCell>
					<span
						onClick={() => setEditMode(true)}
						className='cursor-pointer hover:underline'>
						{formatTime(shift.start)} - {formatTime(shift.end)}
					</span>
				</TableCell>
				<TableCell>
					<span
						onClick={() => setEditMode(true)}
						className='cursor-pointer hover:underline'>
						{shift.role?.name || '-'}
					</span>
				</TableCell>
				<TableCell>{formatTotal(shift.start, shift.end)}</TableCell>
				<TableCell className='text-right'>
					<span
						onClick={() => setEditAbsence(true)}
						className='cursor-pointer hover:underline'>
						{shift.absence?.absent ? 'Absent' : '-'}
					</span>
				</TableCell>

				<TableCell>
					<Popover>
						<PopoverTrigger className='rounded bg-transparent p-2 text-black hover:bg-gray-200 active:bg-gray-300 dark:text-gray-300 dark:hover:bg-gray-600 dark:active:bg-gray-500'>
							<MoreVertical size={16} />
						</PopoverTrigger>
						<PopoverContent className='w-40 bg-white dark:bg-gray-800'>
							<button
								onClick={() => setEditMode(true)}
								className='flex w-full items-center space-x-2 rounded-lg px-2 py-2 text-gray-500 hover:bg-gray-200 active:bg-gray-300 dark:text-gray-400 dark:hover:bg-gray-600 dark:active:bg-gray-500'>
								<Clock size={16} />
								<span className='text-sm font-medium'>Edit Shift</span>
							</button>

							<button
								onClick={() => setEditAbsence(true)}
								className='flex w-full items-center space-x-2 rounded-lg px-2 py-2 text-gray-500 hover:bg-gray-200 active:bg-gray-300 dark:text-gray-400 dark:hover:bg-gray-600 dark:active:bg-gray-500'>
								<ClipboardEdit size={16} />
								<span className='text-sm font-medium'>Edit Absence</span>
							</button>

							<button
								onClick={() => setShowModal(true)}
								className='flex w-full items-center space-x-2 rounded-lg px-2 py-2 text-gray-500 hover:bg-gray-200 active:bg-gray-300 dark:text-gray-400 dark:hover:bg-gray-600 dark:active:bg-gray-500'>
								<Trash2 size={16} />
								<span className='text-sm font-medium'>Delete</span>
							</button>
						</PopoverContent>
					</Popover>
				</TableCell>
			</TableRow>
			{editMode && (
				<EditShift
					shift={shift}
					setEdit={setEditMode}
					shiftModels={shiftModels}
					employee={shift.employee as ShiftEmployee}
				/>
			)}
			{editAbsence && (
				<AlertDialog open>
					<AlertDialogContent>
						<AlertDialogHeader>
							<AlertDialogTitle>Edit Absence for {shift.employee.name}</AlertDialogTitle>
							<AlertDialogDescription>
								{formatDay(shift.date, 'long')}, {formatDate(shift.date, 'long')}
							</AlertDialogDescription>
						</AlertDialogHeader>

						<label
							htmlFor='absent'
							className='flex w-fit flex-col'>
							Absent
							<Switch
								id='absent'
								checked={absent}
								className='mt-0.5'
								onClick={() => setAbsent(!absent)}
							/>
						</label>
						{absent && (
							<label
								htmlFor='approved'
								className='flex w-fit flex-col'>
								Approved
								<Switch
									id='approved'
									checked={approved}
									className='mt-0.5'
									onClick={() => setApproved(!approved)}
								/>
							</label>
						)}
						<label htmlFor='reason'>
							Reason
							<Input
								type='text'
								id='reason'
								value={reason}
								className='mt-0.5 w-fit'
								onChange={(e) => setReason(e.target.value)}
							/>
						</label>
						<AlertDialogFooter>
							<AlertDialogCancel onClick={() => setEditAbsence(false)}>Cancel</AlertDialogCancel>
							<AlertDialogAction
								onClick={() => {
									updateAbsenceMutation.mutate({
										reason,
										absent,
										approved,
										shiftId: shift.id,
									})
								}}>
								Continue
							</AlertDialogAction>
						</AlertDialogFooter>
					</AlertDialogContent>
				</AlertDialog>
			)}
			{showModal && (
				<FormModal
					heading='Delete Shift?'
					showModal={showModal}
					cancel={() => setShowModal(false)}
					pending={deleteShiftMutation.isLoading}
					text='Are you sure you want to delete this shift?'
					submit={() => deleteShiftMutation.mutate({ shiftId: shift.id })}
				/>
			)}
		</>
	)
}
