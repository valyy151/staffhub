'use client'
import { cn } from '@/app/lib/utils'
import * as React from 'react'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, type, ...props }, ref) => {
	return (
		<input
			type={type}
			className={cn(
				'flex h-10 w-full rounded-md border bg-transparent px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus:border-primary disabled:cursor-not-allowed focus-visible:outline-none focus-visible:border-primary focus-visible:ring-1 focus-visible:ring-primary',
				className
			)}
			ref={ref}
			{...props}
		/>
	)
})
Input.displayName = 'Input'

export { Input }
