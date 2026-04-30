"use client";

import { useEffect, useState } from "react";
import LogoAnimation from "./logo-animation";

export default function Home() {
  const [phase, setPhase] = useState<"logo" | "text" | "images">("logo");
  const [current, setCurrent] = useState(0);
  const [backgrounds, setBackgrounds] = useState<{ src: string }[]>([]);

  useEffect(() => {
    fetch("/api/backgrounds")
      .then((res) => res.json())
      .then((data) => setBackgrounds(data))
      .catch(() => {});
  }, []);

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("text"), 2000);
    const t2 = setTimeout(() => setPhase("images"), 4000);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  useEffect(() => {
    if (phase !== "images" || backgrounds.length === 0) return;
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % backgrounds.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [phase, backgrounds.length]);

  const showLogo = phase === "logo" || phase === "text" || phase === "images";
  const showText = phase === "text" || phase === "images";
  const showImages = phase === "images";

  return (
    <div
      className="relative flex flex-1 items-center justify-center overflow-hidden transition-colors duration-[1500ms] ease-in-out "
      style={{
        backgroundColor: showImages ? "#1a1a1a" : "#ffffff",
      }}
    >
      {/* Background images */}
      <div className="absolute inset-8">
        {backgrounds.map((bg, i) => (
          <div
            key={bg.src}
            className="absolute inset-0 transition-opacity duration-[1500ms] ease-in-out"
            style={{
              opacity: showImages && i === current ? 1 : 0,
              backgroundImage: `url(${bg.src})`,
              backgroundSize: "contain",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }}
          />
        ))}
      </div>

      {/* Grain overlay — always visible, adds texture */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.08] mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
          backgroundSize: "256px 256px",
        }}
      />

      {/* Logo layer */}
      <LogoAnimation showHints={showImages} />

      {/* Text layer */}
      <p
        className="fixed top-1/2 left-1/2 mix-blend-difference whitespace-nowrap font-[family-name:var(--font-zalando-sans-expanded)] text-[1.4rem] text-white pointer-events-none transition-all duration-1000 ease-out"
        style={{
          fontWeight: 900,
          opacity: showText ? 1 : 0,
          transform: `translate(-50%, ${showText ? "-50%" : "calc(-50% + 10px)"})`,
        }}
      >
        coming soon
      </p>
    </div>
  );
}
