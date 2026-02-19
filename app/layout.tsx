import "./global.css";
import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { baseUrl } from "./sitemap";
import LandingIntro from "./components/landing-intro";

export const viewport: Viewport = {
    themeColor: "#010302",
    colorScheme: "dark"
};

export const metadata: Metadata = {
    metadataBase: new URL(baseUrl),
    title: {
        default: "Vince Lapore",
        template: "%s | Vince Lapore"
    },
    description: "This is Vince Lapore's Portfolio hehe.",
    openGraph: {
        title: "Vince Lapore",
        description: "Vince Lapore's website!",
        url: baseUrl,
        siteName: "Vince Lapore",
        locale: "en_AU",
        type: "website"
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            "max-video-preview": -1,
            "max-image-preview": "large",
            "max-snippet": -1
        }
    }
};

const cx = (...classes) => classes.filter(Boolean).join(" ");

export default function RootLayout({
    children
}: {
    children: React.ReactNode;
}) {
    return (
        <html
            lang='en'
            className={cx(
                "text-black bg-white dark:text-white dark:bg-black",
                GeistSans.variable,
                GeistMono.variable
            )}
        >
            <body className='antialiased'>
                <main className='site-main flex-auto min-w-0'>
                    {children}
                    <Analytics />
                    <SpeedInsights />
                </main>
            </body>
        </html>
    );
}
