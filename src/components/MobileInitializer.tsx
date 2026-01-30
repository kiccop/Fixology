'use client'

import { useEffect } from 'react'
import { initializeMobileApp } from '@/lib/mobile/init'

export function MobileInitializer() {
    useEffect(() => {
        initializeMobileApp()
    }, [])

    return null
}
