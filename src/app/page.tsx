"use client";

import { useEffect, useState } from "react";
import LogoAnimation from "./logo-animation";

export default function Home() {
  const [showText, setShowText] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setShowText(true), 2000);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="relative flex min-h-dvh flex-1 items-center justify-center overflow-hidden bg-[#0a0a0a]">
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.08] mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
          backgroundSize: "256px 256px",
        }}
      />

      <LogoAnimation showText={showText} />
    </div>
  );
}
