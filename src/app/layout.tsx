import type { Metadata, Viewport } from "next";
import { Zalando_Sans_Expanded } from "next/font/google";
import "./globals.css";

const zalandoSansExpanded = Zalando_Sans_Expanded({
  variable: "--font-zalando-sans-expanded",
  weight: ["300", "900"],
  subsets: ["latin"],
});

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
  colorScheme: "dark",
  viewportFit: "cover",
};

export const metadata: Metadata = {
  title: "Vince Lapore",
  description: "The creative portfolio of Vince Lapore.",
  appleWebApp: {
    statusBarStyle: "black-translucent",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${zalandoSansExpanded.variable} h-full antialiased`}
    >
      <body className="flex min-h-dvh flex-col">{children}</body>
    </html>
  );
}
