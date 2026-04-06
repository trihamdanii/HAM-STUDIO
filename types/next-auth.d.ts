import { DefaultSession } from 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      discordId?: string | null
      discordUsername?: string | null
      isServerMember?: boolean
      robloxUserId?: string | null
      robloxUsername?: string | null
      plan?: string
      role?: string
      locale?: string
    } & DefaultSession['user']
  }

  interface User {
    discordId?: string | null
    discordUsername?: string | null
    isServerMember?: boolean
    plan?: string
    role?: string
  }
}
