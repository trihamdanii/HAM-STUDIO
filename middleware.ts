export { default } from 'next-auth/middleware'

export const config = {
  matcher: [
    /*
     * Match all routes EXCEPT:
     * - /login
     * - /join-discord
     * - /api/auth (NextAuth routes)
     * - /_next (Next.js internals)
     * - /favicon.ico, /logo.png
     */
    '/((?!login|join-discord|api/auth|_next|favicon|logo).*)',
  ],
}
