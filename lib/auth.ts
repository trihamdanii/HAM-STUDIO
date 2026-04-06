import { NextAuthOptions } from 'next-auth'
import DiscordProvider from 'next-auth/providers/discord'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import { prisma } from './prisma'

const DISCORD_GUILD_ID = process.env.DISCORD_GUILD_ID!

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID!,
      clientSecret: process.env.DISCORD_CLIENT_SECRET!,
      authorization: {
        params: {
          scope: 'identify email guilds guilds.members.read',
        },
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === 'discord') {
        const discordProfile = profile as {
          id: string
          username: string
          avatar: string
          email: string
        }

        // Check if user is in the Discord guild
        let isServerMember = false
        try {
          const res = await fetch(
            `https://discord.com/api/guilds/${DISCORD_GUILD_ID}/members/${discordProfile.id}`,
            {
              headers: {
                Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}`,
              },
            }
          )
          isServerMember = res.ok
        } catch {
          // If bot token not configured, skip guild check
          isServerMember = true
        }

        // Update discord fields
        await prisma.user.upsert({
          where: { discordId: discordProfile.id },
          update: {
            discordUsername: discordProfile.username,
            discordAvatar: discordProfile.avatar,
            discordEmail: discordProfile.email,
            isServerMember,
            serverMemberVerifiedAt: isServerMember ? new Date() : undefined,
            name: discordProfile.username,
            image: discordProfile.avatar
              ? `https://cdn.discordapp.com/avatars/${discordProfile.id}/${discordProfile.avatar}.png`
              : null,
          },
          create: {
            discordId: discordProfile.id,
            discordUsername: discordProfile.username,
            discordAvatar: discordProfile.avatar,
            discordEmail: discordProfile.email,
            email: discordProfile.email,
            name: discordProfile.username,
            image: discordProfile.avatar
              ? `https://cdn.discordapp.com/avatars/${discordProfile.id}/${discordProfile.avatar}.png`
              : null,
            isServerMember,
            serverMemberVerifiedAt: isServerMember ? new Date() : undefined,
          },
        })

        if (!isServerMember && process.env.REQUIRE_DISCORD_GUILD === 'true') {
          return '/join-discord'
        }
      }
      return true
    },

    async session({ session, user }) {
      // Attach full user data to session
      const dbUser = await prisma.user.findUnique({
        where: { id: user.id },
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
          discordId: true,
          discordUsername: true,
          discordAvatar: true,
          isServerMember: true,
          robloxUserId: true,
          robloxUsername: true,
          plan: true,
          planExpiresAt: true,
          role: true,
          locale: true,
          createdAt: true,
        },
      })

      if (dbUser) {
        session.user = {
          ...session.user,
          ...dbUser,
        } as typeof session.user
      }

      return session
    },
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  session: {
    strategy: 'database',
  },
  secret: process.env.NEXTAUTH_SECRET,
}
