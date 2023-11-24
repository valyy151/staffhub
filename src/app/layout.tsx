import '@/styles/globals.css'

import { Inter } from 'next/font/google'
import { cookies } from 'next/headers'

import { TRPCReactProvider } from '@/trpc/react'
import { ThemeProvider } from './_components/theme-provider'
import { Toaster } from '@/app/_components/ui/toaster'

import Navbar from './_components/navbar'
import ProgressBar from './_components/progress-bar'

const inter = Inter({
	subsets: ['latin'],
	variable: '--font-sans',
})

export const metadata = {
	title: 'StaffHub',
	description: 'StaffHub is a web application that helps you manage your staff and their shifts.',
	icons: [{ rel: 'icon', url: '/favicon.ico' }],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang='en'>
			<body className={`font-sans ${inter.variable}`}>
				<TRPCReactProvider cookies={cookies().toString()}>
					<ThemeProvider attribute='class'>
						<Navbar />
						<ProgressBar />
						{children}
						<Toaster />
					</ThemeProvider>
				</TRPCReactProvider>
			</body>
		</html>
	)
}
