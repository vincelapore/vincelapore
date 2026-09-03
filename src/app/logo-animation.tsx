"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { MorphSVGPlugin } from "gsap/MorphSVGPlugin";
import { Draggable } from "gsap/Draggable";
import { InertiaPlugin } from "gsap/InertiaPlugin";

if (typeof window !== "undefined") {
  gsap.registerPlugin(MorphSVGPlugin, Draggable, InertiaPlugin);
}

const LOGO_PATH =
  "M285.904 203.227L490.345 120.628L572.684 324.423L368.242 407.021L368.473 407.591L164.677 489.93L0 82.3389L203.796 0L285.904 203.227Z";

type AnimationType = "stroke-draw" | "blob-morph";

const ANIMATIONS: AnimationType[] = ["stroke-draw", "blob-morph"];

const LINKS = [
  {
    title: "github",
    subtitle: "code",
    href: "https://github.com/vincelapore",
  },
  {
    title: "linkedin",
    subtitle: "connect",
    href: "https://www.linkedin.com/in/vincelapore",
  },
  {
    title: "grademate",
    subtitle: "grademate.dev",
    href: "https://www.grademate.dev",
  },
  {
    title: "yorick",
    subtitle: "yorick.live",
    href: "https://www.yorick.live",
  },
] as const;

const ENTER_MS = 1000;
const STAGGER_MS = 180;

function SiteLink({
  title,
  subtitle,
  href,
  showText,
  staggerIndex,
}: {
  title: string;
  subtitle: string;
  href: string;
  showText: boolean;
  staggerIndex: number;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`group flex flex-col items-center ease-out ${showText ? "pointer-events-auto" : "pointer-events-none"}`}
      style={{
        opacity: showText ? 1 : 0,
        transform: showText ? "translateY(0)" : "translateY(10px)",
        transitionProperty: "opacity, transform",
        transitionDuration: `${ENTER_MS}ms`,
        transitionDelay: showText ? `${staggerIndex * STAGGER_MS}ms` : "0ms",
      }}
    >
      <span className="flex flex-col items-center gap-0.5 opacity-100 transition-[opacity,transform] duration-300 ease-out group-hover:opacity-85 group-hover:-translate-y-px">
        <span
          className="whitespace-nowrap text-[1.05rem] transition-[letter-spacing] duration-300 ease-out group-hover:tracking-[0.04em]"
          style={{ fontWeight: 900 }}
        >
          {title}
        </span>
        <span
          className="tracking-[0.15em] text-[0.45rem] opacity-90 transition-[letter-spacing,opacity] duration-300 ease-out group-hover:tracking-[0.22em] group-hover:opacity-100"
          style={{ fontWeight: 300 }}
        >
          {subtitle}
        </span>
      </span>
    </a>
  );
}

export default function LogoAnimation({ showText }: { showText: boolean }) {
  const svgRef = useRef<SVGSVGElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const blurRef = useRef<SVGFEGaussianBlurElement>(null);

  useEffect(() => {
    const svg = svgRef.current;
    const path = pathRef.current;
    if (!svg || !path) return;

    const idx = parseInt(localStorage.getItem("logo-anim-idx") || "0", 10);
    const animation = ANIMATIONS[idx % ANIMATIONS.length];
    localStorage.setItem("logo-anim-idx", String(idx + 1));

    if (animation === "stroke-draw") {
      svg.classList.add("logo-draw");
    } else {
      path.setAttribute("stroke", "none");
      path.setAttribute("stroke-width", "0");
      path.setAttribute("fill-opacity", "1");

      // Intermediate blob shapes — each one slightly more "logo-like"
      const cx = 286,
        cy = 245;
      const stages = [
        // 1: tiny circle
        `M${cx},${cy - 8} A8,8 0 1,1 ${cx},${cy + 8} A8,8 0 1,1 ${cx},${cy - 8}Z`,
        // 2: small blob
        `M${cx - 20},${cy - 15} Q${cx},${cy - 30} ${cx + 20},${cy - 15} Q${cx + 35},${cy} ${cx + 20},${cy + 15} Q${cx},${cy + 30} ${cx - 20},${cy + 15} Q${cx - 35},${cy} ${cx - 20},${cy - 15}Z`,
        // 3: taller blob leaning right
        `M${cx - 30},${cy - 40} Q${cx + 10},${cy - 70} ${cx + 50},${cy - 40} Q${cx + 80},${cy} ${cx + 50},${cy + 50} Q${cx},${cy + 80} ${cx - 40},${cy + 50} Q${cx - 60},${cy} ${cx - 30},${cy - 40}Z`,
        // 4: angular blob approaching L-shape proportions
        `M${cx - 50},${cy - 80} Q${cx + 30},${cy - 110} ${cx + 100},${cy - 60} Q${cx + 140},${cy + 10} ${cx + 80},${cy + 80} Q${cx + 40},${cy + 120} ${cx - 60},${cy + 120} Q${cx - 100},${cy + 80} ${cx - 80},${cy} Q${cx - 70},${cy - 50} ${cx - 50},${cy - 80}Z`,
        // 5: near-logo blob
        `M240,180 Q350,100 490,121 Q580,200 573,324 Q500,420 368,407 Q300,430 165,490 Q-20,350 0,82 Q100,-20 204,0 Q260,80 240,180Z`,
        // 6: final logo
        LOGO_PATH,
      ];

      // Start from tiny circle
      path.setAttribute("d", stages[0]);

      // Apply blur filter during blob stages
      const blur = blurRef.current;
      if (blur) {
        blur.setAttribute("stdDeviation", "12");
        svg.style.filter = "url(#logo-blur)";
      }

      const tl = gsap.timeline();
      let t = 0;

      for (let i = 1; i < stages.length; i++) {
        const isLast = i === stages.length - 1;
        const dur = isLast ? 0.3 : 0.12;

        tl.to(
          path,
          {
            morphSVG: {
              shape: stages[i],
              shapeIndex: "auto",
            },
            duration: dur,
            ease: isLast ? "power2.out" : "power1.inOut",
          },
          t,
        );
        t += dur;
      }

      // Animate blur from heavy to sharp, finishing with the last morph
      if (blur) {
        tl.to(
          blur,
          {
            attr: { stdDeviation: 0 },
            duration: 0.3,
            ease: "power2.out",
            onComplete: () => {
              svg.style.filter = "none";
            },
          },
          t - 0.4,
        );
      }

      return () => {
        tl.kill();
      };
    }
  }, []);

  // Scroll-spin + drag/flick
  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    // Lock page scroll entirely
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";

    let rotation = 0;
    let resetTimer: ReturnType<typeof setTimeout>;

    function scheduleReset() {
      clearTimeout(resetTimer);
      resetTimer = setTimeout(() => {
        rotation = 0;
        gsap.to(svg, {
          x: 0,
          y: 0,
          rotation: 0,
          duration: 1,
          ease: "elastic.out(1, 0.6)",
          overwrite: true,
        });
      }, 800);
    }

    function spinBy(delta: number) {
      rotation += delta;
      gsap.to(svg, {
        rotation,
        duration: 0.4,
        ease: "power2.out",
        overwrite: "auto",
      });
      scheduleReset();
    }

    // Desktop: wheel
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      spinBy(e.deltaY * 0.3);
    };
    window.addEventListener("wheel", onWheel, { passive: false });

    // Mobile: touch-swipe anywhere outside the logo
    let touchStartX = 0;
    let touchStartY = 0;
    const onTouchStart = (e: TouchEvent) => {
      if (svg.contains(e.target as Node)) return;
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
    };
    const onTouchMove = (e: TouchEvent) => {
      if (svg.contains(e.target as Node)) return;
      e.preventDefault();
      const dx = e.touches[0].clientX - touchStartX;
      const dy = e.touches[0].clientY - touchStartY;
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
      spinBy((dx + dy) * 0.5);
    };
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: false });

    function getBounds() {
      const r = svg!.getBoundingClientRect();
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      const hw = r.width / 2;
      const hh = r.height / 2;
      return {
        minX: -(cx - hw),
        maxX: cx - hw,
        minY: -(cy - hh),
        maxY: cy - hh,
      };
    }

    const draggable = Draggable.create(svg, {
      type: "x,y",
      inertia: true,
      bounds: getBounds(),
      edgeResistance: 1,
      onDrag() {
        clearTimeout(resetTimer);
        rotation += this.deltaX * 0.5;
        gsap.set(svg, { rotation });
      },
      onThrowUpdate() {
        rotation += this.deltaX * 0.5;
        gsap.set(svg, { rotation });
      },
      onThrowComplete() {
        scheduleReset();
      },
    })[0];

    const onResize = () => {
      draggable.applyBounds(getBounds());
    };
    window.addEventListener("resize", onResize);

    return () => {
      clearTimeout(resetTimer);
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("resize", onResize);
      draggable.kill();
    };
  }, []);

  return (
    <>
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 mix-blend-difference pointer-events-none">
        <svg
          ref={svgRef}
          width="573"
          height="490"
          viewBox="-10 -10 593 510"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-[120px] h-auto overflow-visible cursor-grab active:cursor-grabbing pointer-events-auto"
        >
          <defs>
            <filter id="logo-blur" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur
                ref={blurRef}
                in="SourceGraphic"
                stdDeviation="0"
              />
            </filter>
          </defs>
          <path
            ref={pathRef}
            d={LOGO_PATH}
            fill="white"
            fillOpacity={0}
            stroke="white"
            strokeWidth={8}
          />
        </svg>
      </div>

      <div
        className="fixed left-1/2 -translate-x-1/2 flex flex-col items-center gap-0.5 mix-blend-difference pointer-events-none font-[family-name:var(--font-zalando-sans-expanded)] text-[0.55rem] text-white"
        style={{ top: "calc(50% + 80px)", fontWeight: 300 }}
      >
        <div className="mt-3 flex flex-col items-center gap-4">
          {LINKS.map((link, i) => (
            <SiteLink
              key={link.title}
              title={link.title}
              subtitle={link.subtitle}
              href={link.href}
              showText={showText}
              staggerIndex={i}
            />
          ))}
        </div>
      </div>
    </>
  );
}
