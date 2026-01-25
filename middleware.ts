import { NextRequest, NextResponse } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

export async function middleware(request: NextRequest) {
    // 1. Gestione Sessione Supabase (Auth + Redirect)
    const supabaseResponse = await updateSession(request)

    // Se updateSession ha già deciso un redirect (es. non autenticato), lo ritorniamo
    if (supabaseResponse.status === 307 || supabaseResponse.status === 302) {
        return supabaseResponse
    }

    // 2. Gestione Lingua (Locale)
    const pathname = request.nextUrl.pathname

    // Non applichiamo i18n ai file statici o API
    if (
        pathname.startsWith('/_next') ||
        pathname.includes('/api/') ||
        pathname.includes('.')
    ) {
        return supabaseResponse
    }

    // Puoi aggiungere qui logica per il routing basato sul prefisso /it/, /en/ ecc.
    // Per ora manteniamo la gestione via cookie implementata in i18n/request.ts
    // ma assicuriamoci che il cookie sia presente o inizializzato.

    const locale = request.cookies.get('locale')?.value || 'it'

    // Se volessimo forzare il locale nell'header per next-intl
    supabaseResponse.headers.set('x-next-intl-locale', locale)

    return supabaseResponse
}

export const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
}
