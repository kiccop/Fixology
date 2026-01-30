// Vercel build trigger v2
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { NextIntlClientProvider } from 'next-intl';
import { getLocale, getMessages } from 'next-intl/server';
import { Toaster } from 'sonner';
import { MobileInitializer } from '@/components/MobileInitializer';
import { CookieBanner } from '@/components/CookieBanner';
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: "myBikeLog - La tua bici, sempre al massimo",
  description: "Monitora l'usura dei componenti della tua bici, ricevi notifiche di manutenzione e sincronizza con Strava per tenere traccia dei tuoi chilometri.",
  keywords: ["bici", "manutenzione", "ciclismo", "strava", "componenti", "usura", "notifiche"],
  authors: [{ name: "myBikeLog" }],
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
    userScalable: true,
  },
  openGraph: {
    title: "myBikeLog - La tua bici, sempre al massimo",
    description: "Monitora l'usura dei componenti della tua bici e ricevi notifiche di manutenzione.",
    type: "website",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html lang={locale} className="dark">
      <body className={`${inter.variable} font-sans antialiased`}>
        <MobileInitializer />
        <NextIntlClientProvider messages={messages}>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: 'var(--neutral-800)',
                border: '1px solid var(--glass-border)',
                color: 'var(--neutral-100)',
              },
            }}
          />
          <CookieBanner />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
