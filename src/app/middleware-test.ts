// import { NextResponse } from 'next/server'
// import type { NextRequest } from 'next/server'
// // import { verify } from 'jsonwebtoken'

// const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

// export function middleware(request: NextRequest) {
//   const token = request.cookies.get('token')?.value

//   const { pathname } = request.nextUrl

//   if (pathname.startsWith('/api/') && !pathname.startsWith('/api/auth/')) {
//     if (!token) {
//       return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
//     }

//     try {
//       // verify(token, JWT_SECRET)
//     } catch (error) {
//       return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
//     }
//   }

//   if (pathname === '/login') {
//     if (token) {
//       return NextResponse.redirect(new URL('/', request.url))
//     }
//   } else if (pathname !== '/api/auth/login') {
//     if (!token) {
//       return NextResponse.redirect(new URL('/login', request.url))
//     }
//   }

//   return NextResponse.next()
// }

// export const config = {
//   matcher: ['/((?!_next/static|favicon.ico).*)'],
// }

