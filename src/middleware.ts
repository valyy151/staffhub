import { NextResponse } from "next/server";

import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
	if (!request.cookies.get('__Secure-next-auth.session-token') && !request.cookies.get('next-auth.session-token')) {
		return NextResponse.redirect(new URL('/', request.url))
	}

	if (request.nextUrl.pathname === '/dashboard' && !request.nextUrl.searchParams.get('page') && !request.nextUrl.searchParams.get('month')) {
		return NextResponse.redirect(new URL(`/dashboard?page=${0}&month=${new Date().toLocaleDateString('en-GB', { month: '2-digit', year: 'numeric' })}`, request.url))
	}
}

export const config = {
	matcher: ['/:path/:slug'],
}
