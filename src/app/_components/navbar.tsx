import { getServerAuthSession } from "@/server/auth"
import React from "react"
import Image from "next/image"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/app/_components/ui/navigation-menu"

import { SignInButton } from "./auth-buttons"
import ThemeToggle from "./theme-toggle"
import { cn } from "@/lib/utils"
import { MenuIcon } from "lucide-react"
import Link from "next/link"

const links: { title: string; href: string; description: string }[] = [
  {
    title: "Account",
    href: "/settings",
    description: "Manage your account settings.",
  },
  {
    title: "Staff Roles",
    href: "/settings/roles",
    description: "Manage the roles that your staff can have.",
  },
  {
    title: "Shift Models",
    href: "/settings/shift-models",
    description: "Manage the shift models that your staff can have.",
  },
  {
    title: "Sign Out",
    href: "/api/auth/signout?callbackUrl=/",
    description: "Sign out of your account.",
  },
]

export default async function Navbar() {
  const session = await getServerAuthSession()

  return (
    <nav className="flex justify-between border-b py-2 md:justify-around">
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuLink
              href={session?.user ? "/dashboard" : "/"}
              className="group hidden h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50 md:inline-flex"
            >
              {session?.user ? "Dashboard" : "StaffHub"}
            </NavigationMenuLink>
          </NavigationMenuItem>

          <NavigationMenuItem className="md:hidden">
            <NavigationMenuTrigger className="flex items-center">
              <MenuIcon />
            </NavigationMenuTrigger>
            <NavigationMenuContent className="flex w-[150px] flex-col gap-3 p-2 md:w-[500px] lg:w-[600px] ">
              <NavigationMenuLink
                className={cn(
                  "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                )}
              >
                <Link
                  href="/dashboard"
                  className="text-sm font-medium leading-none"
                >
                  Dashboard
                </Link>
              </NavigationMenuLink>
              <NavigationMenuLink
                className={cn(
                  "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                )}
              >
                <Link
                  href="/staff"
                  className="text-sm font-medium leading-none"
                >
                  Staff
                </Link>
              </NavigationMenuLink>
              <NavigationMenuLink
                className={cn(
                  "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                )}
              >
                <Link
                  href="/schedule"
                  className="text-sm font-medium leading-none"
                >
                  Schedule
                </Link>
              </NavigationMenuLink>
              <NavigationMenuLink
                className={cn(
                  "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                )}
              >
                <Link
                  href="https://staffhub-docs.vercel.app"
                  className="text-sm font-medium leading-none"
                >
                  Getting Started
                </Link>
              </NavigationMenuLink>
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem className="inline-flex">
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
                  href={"/staff"}
                  className="group hidden h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50 md:inline-flex"
                >
                  Staff
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink
                  href={"/schedule"}
                  className="group hidden h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50 md:inline-flex"
                >
                  Schedule
                </NavigationMenuLink>
              </NavigationMenuItem>
            </>
          )}

          <NavigationMenuItem>
            <NavigationMenuLink
              target="_blank"
              className="group hidden h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50 md:inline-flex"
              href="https://staffhub-docs.vercel.app"
            >
              Getting Started
            </NavigationMenuLink>
          </NavigationMenuItem>

          {session?.user ? (
            <NavigationMenuItem>
              <NavigationMenuTrigger className="flex items-center">
                <Image
                  width={22}
                  height={22}
                  alt={session?.user.name!}
                  src={session?.user.image!}
                  className="mr-2 rounded-full"
                />
                <span>Settings</span>
              </NavigationMenuTrigger>

              <NavigationMenuContent>
                <ul className="grid w-full gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
                  {links.map((link) => (
                    <ListItem
                      key={link.title}
                      href={link.href}
                      title={link.title}
                      className={
                        link.href === "/api/auth/signout?callbackUrl=/"
                          ? "hover:text-rose-500"
                          : ""
                      }
                    >
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

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className,
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 hidden text-sm leading-snug text-muted-foreground md:inline-flex">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  )
})
ListItem.displayName = "ListItem"
