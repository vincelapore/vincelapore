import type { Metadata } from "next";
import { Zalando_Sans_Expanded } from "next/font/google";
import "./globals.css";

const zalandoSansExpanded = Zalando_Sans_Expanded({
  variable: "--font-zalando-sans-expanded",
  weight: ["300", "900"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Vince Lapore",
  description: "The creative portfolio of Vince Lapore.",
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
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
