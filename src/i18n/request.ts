import { getRequestConfig } from 'next-intl/server'
import { cookies, headers } from 'next/headers'

export const locales = ['it', 'en', 'fr', 'es'] as const
export type Locale = (typeof locales)[number]
export const defaultLocale: Locale = 'it'

export default getRequestConfig(async () => {
    // Try to get locale from cookie first
    const cookieStore = await cookies()
    let locale = cookieStore.get('locale')?.value as Locale | undefined

    // Fallback to Accept-Language header
    if (!locale || !locales.includes(locale)) {
        const headersList = await headers()
        const acceptLanguage = headersList.get('accept-language')
        if (acceptLanguage) {
            const preferred = acceptLanguage.split(',')[0].split('-')[0] as Locale
            if (locales.includes(preferred)) {
                locale = preferred
            }
        }
    }

    // Final fallback to default
    if (!locale || !locales.includes(locale)) {
        locale = defaultLocale
    }

    return {
        locale,
        messages: (await import(`../../messages/${locale}.json`)).default
    }
})
