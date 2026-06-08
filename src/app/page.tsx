"use client";

import { useEffect, useRef, useState } from "react";
import LogoAnimation from "./logo-animation";

type Bg = { src: string; color: string };

const FADE_MS = 1500;

function preload(src: string) {
  return new Promise<void>((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = reject;
    img.src = src;
  });
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export default function Home() {
  const [phase, setPhase] = useState<"logo" | "text" | "images">("logo");
  const [background, setBackground] = useState<Bg | null>(null);
  const [imageVisible, setImageVisible] = useState(false);

  const showImagesRef = useRef(false);

  useEffect(() => {
    fetch("/api/backgrounds")
      .then((res) => res.json())
      .then((data: Bg[]) => {
        if (data.length === 0) return;
        setBackground(data[Math.floor(Math.random() * data.length)]);
      })
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

  const showText = phase === "text" || phase === "images";
  const showImages = phase === "images";
  showImagesRef.current = showImages;

  useEffect(() => {
    if (!background) return;

    let cancelled = false;

    (async () => {
      await preload(background.src);
      if (cancelled) return;

      while (!showImagesRef.current && !cancelled) {
        await sleep(50);
      }
      if (cancelled) return;

      setImageVisible(true);
    })();

    return () => {
      cancelled = true;
    };
  }, [background]);

  const backgroundColor =
    showImages && background ? background.color : "#ffffff";

  return (
    <div
      className="relative flex flex-1 items-center justify-center overflow-hidden transition-colors ease-in-out"
      style={{ transitionDuration: `${FADE_MS}ms`, backgroundColor }}
    >
      {background && (
        <div className="absolute inset-0 z-0">
          <img
            src={background.src}
            alt=""
            className="absolute inset-0 h-full w-full object-cover transition-opacity ease-in-out"
            style={{
              transitionDuration: `${FADE_MS}ms`,
              opacity: imageVisible ? 1 : 0,
            }}
          />
          <div
            className="absolute inset-0 bg-black/35 transition-opacity ease-in-out"
            style={{
              transitionDuration: `${FADE_MS}ms`,
              opacity: imageVisible ? 1 : 0,
            }}
          />
        </div>
      )}

      <div
        className="absolute inset-0 pointer-events-none opacity-[0.08] mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
          backgroundSize: "256px 256px",
        }}
      />

      <LogoAnimation showText={showText} showHints={showImages} />
    </div>
  );
}
