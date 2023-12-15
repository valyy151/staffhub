import Image from 'next/image'
import React from 'react'

import {
	NavigationMenu,
	NavigationMenuContent,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
	NavigationMenuTrigger,
} from '@/app/_components/ui/navigation-menu'
import { cn } from '@/app/lib/utils'
import { getServerAuthSession } from '@/server/auth'

import { SignInButton } from './auth-buttons'
import ThemeToggle from './theme-toggle'

const links: { title: string; href: string; description: string }[] = [
	{
		title: 'Account',
		href: '/settings',
		description: 'Manage your account settings.',
	},
	{
		title: 'Staff Roles',
		href: '/settings/roles',
		description: 'Manage the roles that your staff can have.',
	},
	{
		title: 'Shift Models',
		href: '/settings/shift-models',
		description: 'Manage the shift models that your staff can have.',
	},
	{
		title: 'Sign Out',
		href: '/api/auth/signout?callbackUrl=/',
		description: 'Sign out of your account.',
	},
]

export default async function Navbar() {
	const session = await getServerAuthSession()

	return (
		<nav className='flex justify-around border-b py-2'>
			<NavigationMenu>
				<NavigationMenuList>
					<NavigationMenuItem>
						<NavigationMenuLink
							href={session?.user ? '/dashboard' : '/'}
							className='bg-background hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground data-[active]:bg-accent/50 data-[state=open]:bg-accent/50 group inline-flex h-10 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors focus:outline-none disabled:pointer-events-none disabled:opacity-50'>
							{session?.user ? 'Dashboard' : 'StaffHub'}
						</NavigationMenuLink>
					</NavigationMenuItem>

					<NavigationMenuItem>
						<ThemeToggle />
					</NavigationMenuItem>
				</NavigationMenuList>
			</NavigationMenu>

			<NavigationMenu>
				<NavigationMenuList>
					{session?.user && (
						<>
							<NavigationMenuItem>
								<NavigationMenuLink
									href={'/staff'}
									className='bg-background hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground data-[active]:bg-accent/50 data-[state=open]:bg-accent/50 group inline-flex h-10 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors focus:outline-none disabled:pointer-events-none disabled:opacity-50'>
									Staff
								</NavigationMenuLink>
							</NavigationMenuItem>
							<NavigationMenuItem>
								<NavigationMenuLink
									href={'/schedule'}
									className='bg-background hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground data-[active]:bg-accent/50 data-[state=open]:bg-accent/50 group inline-flex h-10 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors focus:outline-none disabled:pointer-events-none disabled:opacity-50'>
									Schedule
								</NavigationMenuLink>
							</NavigationMenuItem>
						</>
					)}

					<NavigationMenuItem>
						<NavigationMenuLink
							target='_blank'
							className='bg-background hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground data-[active]:bg-accent/50 data-[state=open]:bg-accent/50 group inline-flex h-10 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors focus:outline-none disabled:pointer-events-none disabled:opacity-50'
							href='https://staffhub-docs.vercel.app'>
							Getting Started
						</NavigationMenuLink>
					</NavigationMenuItem>

					{session?.user ? (
						<NavigationMenuItem>
							<NavigationMenuTrigger className='flex items-center'>
								<Image
									width={22}
									height={22}
									alt={session?.user.name!}
									src={session?.user.image!}
									className='mr-2 rounded-full'
								/>
								<span>Settings</span>
							</NavigationMenuTrigger>

							<NavigationMenuContent>
								<ul className='grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] '>
									{links.map((link) => (
										<ListItem
											key={link.title}
											href={link.href}
											title={link.title}
											className={link.href === '/api/auth/signout?callbackUrl=/' ? 'hover:text-rose-500' : ''}>
											{link.description}
										</ListItem>
									))}
								</ul>
							</NavigationMenuContent>
						</NavigationMenuItem>
					) : (
						<NavigationMenuItem>
							<SignInButton />
						</NavigationMenuItem>
					)}
				</NavigationMenuList>
			</NavigationMenu>
		</nav>
	)
}

const ListItem = React.forwardRef<React.ElementRef<'a'>, React.ComponentPropsWithoutRef<'a'>>(
	({ className, title, children, ...props }, ref) => {
		return (
			<li>
				<NavigationMenuLink asChild>
					<a
						ref={ref}
						className={cn(
							'hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors',
							className
						)}
						{...props}>
						<div className='text-sm font-medium leading-none'>{title}</div>
						<p className='text-muted-foreground line-clamp-2 text-sm leading-snug'>{children}</p>
					</a>
				</NavigationMenuLink>
			</li>
		)
	}
)
ListItem.displayName = 'ListItem'
