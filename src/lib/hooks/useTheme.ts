'use client'

import { useState, useEffect } from 'react'

type Theme = 'dark' | 'light'

export function useTheme() {
    const [theme, setTheme] = useState<Theme>('dark')

    useEffect(() => {
        const saved = localStorage.getItem('theme') as Theme | null
        if (saved) {
            setTheme(saved)
            applyTheme(saved)
        }
    }, [])

    const applyTheme = (newTheme: Theme) => {
        const html = document.documentElement
        if (newTheme === 'light') {
            html.classList.remove('dark')
            html.classList.add('light')
        } else {
            html.classList.remove('light')
            html.classList.add('dark')
        }
    }

    const toggleTheme = () => {
        const newTheme = theme === 'dark' ? 'light' : 'dark'
        setTheme(newTheme)
        localStorage.setItem('theme', newTheme)
        applyTheme(newTheme)
    }

    return { theme, toggleTheme }
}
