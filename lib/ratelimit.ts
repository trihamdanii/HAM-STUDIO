import { prisma } from './prisma'

interface RateLimitResult {
  allowed: boolean
  remaining: number
  resetInMinutes: number
}

const LIMITS = {
  FREE: { perHour: 2 },
  WEEKLY: { perHour: 999 },
  MONTHLY: { perHour: 999 },
}

/**
 * Check if user is within rate limit
 * Free plan: 2 conversions per hour
 */
export async function checkRateLimit(userId: string, plan: string): Promise<RateLimitResult> {
  const limit = LIMITS[plan as keyof typeof LIMITS] || LIMITS.FREE

  if (limit.perHour >= 999) {
    return { allowed: true, remaining: 999, resetInMinutes: 0 }
  }

  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000)

  const recentJobs = await prisma.conversionJob.count({
    where: {
      userId,
      createdAt: { gte: oneHourAgo },
      status: { not: 'CANCELLED' },
    },
  })

  const remaining = Math.max(0, limit.perHour - recentJobs)
  const allowed = remaining > 0

  // Find oldest job in window to calculate reset time
  let resetInMinutes = 60
  if (!allowed) {
    const oldest = await prisma.conversionJob.findFirst({
      where: {
        userId,
        createdAt: { gte: oneHourAgo },
        status: { not: 'CANCELLED' },
      },
      orderBy: { createdAt: 'asc' },
      select: { createdAt: true },
    })

    if (oldest) {
      const resetAt = new Date(oldest.createdAt.getTime() + 60 * 60 * 1000)
      resetInMinutes = Math.ceil((resetAt.getTime() - Date.now()) / 60_000)
    }
  }

  return { allowed, remaining, resetInMinutes }
}
