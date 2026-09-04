import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import { Header } from './header'
import { Footer } from './footer'
import { ThemeProvider } from 'next-themes'
import { LogoNav } from '@/components/logo-nav'
import { IntroLoader } from '@/components/intro-loader'

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#09090b' },
  ],
  colorScheme: 'light dark',
}

export const metadata: Metadata = {
  metadataBase: new URL('https://vincelapore.com'),
  alternates: {
    canonical: '/',
  },
  title: {
    default: 'Vince Lapore',
    template: '%s | Vince Lapore',
  },
  description:
    'Vince Lapore is a Junior Product Engineer based in Australia, building products at the intersection of design, engineering, and growth.',
  applicationName: 'Vince Lapore',
  authors: [{ name: 'Vince Lapore', url: 'https://vincelapore.com' }],
  creator: 'Vince Lapore',
  publisher: 'Vince Lapore',
  keywords: [
    'Vince Lapore',
    'Junior Product Engineer',
    'Product Engineer',
    'Australia',
    'Grademate',
    'yorick.live',
  ],
  openGraph: {
    title: 'Vince Lapore',
    description:
      'Junior Product Engineer building products at the intersection of design, engineering, and growth.',
    url: 'https://vincelapore.com',
    siteName: 'Vince Lapore',
    locale: 'en_AU',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Vince Lapore',
    description:
      'Junior Product Engineer building products at the intersection of design, engineering, and growth.',
  },
  icons: {
    icon: [
      { url: '/icon.svg', type: 'image/svg+xml' },
      { url: '/icon.png', type: 'image/png', sizes: '32x32' },
    ],
    apple: [{ url: '/apple-icon.png', sizes: '180x180', type: 'image/png' }],
  },
}

const geist = Geist({
  variable: '--font-geist',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geist.variable} ${geistMono.variable} bg-white tracking-tight antialiased dark:bg-zinc-950`}
      >
        <ThemeProvider
          enableSystem={true}
          attribute="class"
          storageKey="theme"
          defaultTheme="system"
        >
          <IntroLoader>
            <LogoNav>
              <div className="flex min-h-screen w-full flex-col font-[family-name:var(--font-inter-tight)]">
                <div className="relative mx-auto w-full max-w-screen-sm flex-1 px-4 pt-24">
                  <Header />
                  {children}
                  <Footer />
                </div>
              </div>
            </LogoNav>
          </IntroLoader>
        </ThemeProvider>
      </body>
    </html>
  )
}
