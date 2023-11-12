'use client'
import { HeartPulseIcon } from 'lucide-react'
import { Button } from '../ui/button'
import Heading from '../ui/heading'
import type { StaffIdOutput } from '@/trpc/shared'
import { useState } from 'react'

export default function NewSickLeave({ employee }: { employee: StaffIdOutput }) {
	const [showCreate, setShowCreate] = useState(false)
	return (
		<div className='flex justify-between items-center'>
			<Heading size={'xs'}>Sick Leaves for {employee?.name}</Heading>
			<Button
				onClick={() => setShowCreate(true)}
				className='ml-8'>
				<HeartPulseIcon
					size={20}
					className='mr-2'
				/>
				New Sick Leave
			</Button>

			{showCreate && <div></div>}
		</div>
	)
}
