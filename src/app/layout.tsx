import type { Metadata, Viewport } from "next";
import "@fontsource-variable/zalando-sans-expanded/wght.css";
import "./globals.css";

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
    <html lang="en" className="h-full antialiased">
      <body className="flex min-h-dvh flex-col">{children}</body>
    </html>
  );
}
