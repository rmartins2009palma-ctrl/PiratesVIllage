import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Inter, Fraunces } from 'next/font/google'
import { TooltipProvider } from '@/components/ui/tooltip'
import { BRAND_PRIMARY } from '@/lib/brand-constants'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

// Variable display face. SOFT rounds the terminals for warmth; opsz lets the
// same family stay legible from a 18px section title up to a 36px page heading.
const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-fraunces',
  display: 'swap',
  axes: ['SOFT', 'opsz'],
})

export const metadata: Metadata = {
  title: 'Pirates Village Kids Club',
  description:
    'Crew management console for the Pirates Village Kids Club — fast, paperless check-in and registration for hotel miniclubs.',
  generator: 'v0.app',
}

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: BRAND_PRIMARY,
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${fraunces.variable} bg-background`}>
      <body className="font-sans antialiased">
        <TooltipProvider>{children}</TooltipProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
