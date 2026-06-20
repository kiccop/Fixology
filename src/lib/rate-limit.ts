import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'

interface RateLimitConfig {
    maxRequests: number
    windowMs: number
}

// In-memory store (for production, use Redis or similar)
const requestCounts = new Map<string, { count: number; resetTime: number }>()

const DEFAULT_CONFIG: RateLimitConfig = {
    maxRequests: 100,
    windowMs: 15 * 60 * 1000, // 15 minutes
}

export async function rateLimit(
    request: NextRequest,
    config: RateLimitConfig = DEFAULT_CONFIG
): Promise<NextResponse | null> {
    const headersList = await headers()
    const ip = headersList.get('x-forwarded-for')?.split(',')[0] ||
               headersList.get('x-real-ip') ||
               'unknown'

    const now = Date.now()
    const key = `${ip}:${request.nextUrl.pathname}`

    const record = requestCounts.get(key)

    if (!record || now > record.resetTime) {
        requestCounts.set(key, {
            count: 1,
            resetTime: now + config.windowMs,
        })
        return null
    }

    record.count++

    if (record.count > config.maxRequests) {
        const retryAfter = Math.ceil((record.resetTime - now) / 1000)

        return NextResponse.json(
            {
                error: 'Too many requests',
                message: `Rate limit exceeded. Try again in ${retryAfter} seconds.`,
            },
            {
                status: 429,
                headers: {
                    'Retry-After': retryAfter.toString(),
                    'X-RateLimit-Limit': config.maxRequests.toString(),
                    'X-RateLimit-Remaining': '0',
                    'X-RateLimit-Reset': record.resetTime.toString(),
                },
            }
        )
    }

    return null
}
