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

const CENTER_X = 286;
const CENTER_Y = 245;
const DOT_R = 2;
const DOT_PATH = `M${CENTER_X - DOT_R},${CENTER_Y} A${DOT_R},${DOT_R} 0 1,1 ${CENTER_X + DOT_R},${CENTER_Y} A${DOT_R},${DOT_R} 0 1,1 ${CENTER_X - DOT_R},${CENTER_Y}Z`;

type AnimationType = "stroke-draw" | "blob-morph";

const ANIMATIONS: AnimationType[] = ["stroke-draw", "blob-morph"];

export default function LogoAnimation({ showHints }: { showHints: boolean }) {
  const svgRef = useRef<SVGSVGElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const blurRef = useRef<SVGFEGaussianBlurElement>(null);
  const dragHintRef = useRef<HTMLSpanElement>(null);
  const scrollHintRef = useRef<HTMLSpanElement>(null);
  const dragDismissed = useRef(false);
  const scrollDismissed = useRef(false);

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

  // Fade in hints when images start
  useEffect(() => {
    if (!showHints) return;
    const dragHint = dragHintRef.current;
    const scrollHint = scrollHintRef.current;
    if (!dragHint || !scrollHint) return;
    if (dragDismissed.current && scrollDismissed.current) return;

    const tl = gsap.timeline();
    if (!dragDismissed.current) {
      tl.fromTo(
        dragHint,
        { opacity: 0, y: 6 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" },
      );
    }
    if (!scrollDismissed.current) {
      tl.fromTo(
        scrollHint,
        { opacity: 0, y: 6 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" },
        "-=0.4",
      );
    }

    return () => {
      tl.kill();
    };
  }, [showHints]);

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

    function dismissScrollHint() {
      if (!scrollDismissed.current && scrollHintRef.current) {
        scrollDismissed.current = true;
        gsap.to(scrollHintRef.current, {
          opacity: 0,
          y: -8,
          duration: 0.4,
          ease: "power2.in",
        });
      }
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
      dismissScrollHint();
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

        if (!dragDismissed.current && dragHintRef.current) {
          dragDismissed.current = true;
          gsap.to(dragHintRef.current, {
            opacity: 0,
            y: -8,
            duration: 0.4,
            ease: "power2.in",
          });
        }
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
        className="fixed left-1/2 -translate-x-1/2 flex flex-col items-center gap-0.5 mix-blend-difference pointer-events-none font-[family-name:var(--font-zalando-sans-expanded)] text-[0.55rem] tracking-[0.15em] text-white"
        style={{ top: "calc(50% + 80px)", fontWeight: 300 }}
      >
        <span ref={dragHintRef} className="opacity-0">
          drag me
        </span>
        <span ref={scrollHintRef} className="opacity-0">
          scroll
        </span>
      </div>
    </>
  );
}
