"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import LandingIntro from "./components/landing-intro";
import FluidWebglBackground from "./components/fluid-webgl-background";

const projects = [
    {
        name: "yorick.live",
        tag: "DEVELOPER",
        description:
            "Theatre discovery map for indie shows. Visit yorick.live.",
        href: "https://yorick.live"
    },
    {
        name: "eightysix.bar",
        tag: "DEVELOPER",
        description: "Spec library SaaS for bar teams. Visit eightysix.bar.",
        href: "https://eightysix.bar"
    },
    {
        name: "prehistoric",
        tag: "ARTIST",
        description: "A tender, physical stage production."
    }
];

function usePrevious<T>(value: T) {
    const ref = useRef<T>(value);
    useEffect(() => {
        ref.current = value;
    }, [value]);
    return ref.current;
}

function AnimatedMenuItem({
    num,
    name,
    tag,
    cta,
    maxLen,
    slots,
    projectName,
    href,
    isAnchor,
    handlers,
    onClick,
    showNumbers
}: {
    num: string;
    name: string;
    tag: string;
    cta: string;
    maxLen: number;
    slots: unknown[];
    projectName: string;
    href?: string;
    isAnchor: boolean;
    handlers: {
        onMouseEnter: () => void;
        onMouseLeave: () => void;
        onFocus: () => void;
    };
    onClick?: () => void;
    showNumbers: boolean;
}) {
    const prevName = usePrevious(name);
    const [outgoing, setOutgoing] = useState<string | null>(null);
    const timeoutRef = useRef<number | null>(null);

    useEffect(() => {
        if (prevName === name) return;
        setOutgoing(prevName);

        if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
        timeoutRef.current = window.setTimeout(() => {
            setOutgoing(null);
        }, 900);

        return () => {
            if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
        };
    }, [prevName, name]);

    const renderContent = (displayName: string, mode: "in" | "out", baseDelayMs: number) => {
        const chars = displayName.split("");
        const n = chars.length;
        const nameEndDelay = baseDelayMs + (n - 1) * 14;

        return (
            <span
                className={`landing__menu-content landing__menu-content--${mode}`}
                style={
                    mode === "in"
                        ? {
                              ["--name-length" as string]: n.toString()
                          }
                        : undefined
                }
            >
                {showNumbers && (
                    <span className='landing__menu-num'>
                        {num}
                    </span>
                )}
                <span className='landing__menu-label'>
                    <span className='landing__menu-name-swap'>
                        {chars.map((char, index) => {
                            const delay = baseDelayMs + (n - index - 1) * 14;
                            return (
                                <span
                                    key={`${mode}-${displayName}-${index}`}
                                    className='landing__menu-name-char'
                                    style={{ animationDelay: `${delay}ms` }}
                                >
                                    {char === " " ? "\u00A0" : char}
                                </span>
                            );
                        })}
                    </span>
                    <span className='landing__menu-tag-group'>
                        {slots.map((_, index) => {
                            const tagChar = tag[index] ?? " ";
                            const ctaChar = cta[index] ?? " ";
                            const delayMs = (maxLen - index - 1) * 10;

                            return (
                                <span
                                    key={`${projectName}-slot-${index}`}
                                    className='landing__menu-tag-slot'
                                >
                                    <span
                                        className='landing__menu-tag-char landing__menu-tag-char--tag'
                                        style={{
                                            transitionDelay: `${delayMs}ms`
                                        }}
                                    >
                                        {tagChar === " " ? "\u00A0" : tagChar}
                                    </span>
                                    <span
                                        className='landing__menu-tag-char landing__menu-tag-char--cta'
                                        style={{
                                            transitionDelay: `${delayMs}ms`
                                        }}
                                    >
                                        {ctaChar === " " ? "\u00A0" : ctaChar}
                                    </span>
                                </span>
                            );
                        })}
                    </span>
                </span>
            </span>
        );
    };

    const Element = isAnchor ? "a" : "button";
    const elementProps = isAnchor
        ? { href, target: "_blank" as const, rel: "noreferrer" as const }
        : { onClick, type: "button" as const };

    return (
        <Element
            className='landing__menu-link landing__menu-link-swap'
            {...elementProps}
            {...handlers}
        >
            {outgoing && renderContent(outgoing, "out", 0)}
            {renderContent(name, "in", outgoing ? 360 : 0)}
        </Element>
    );
}

export default function Page() {
    const router = useRouter();
    const [hoverItem, setHoverItem] = useState<string | null>(null);
    const [activeItem, setActiveItem] = useState<string | null>(null);
    const [showMoreMenu, setShowMoreMenu] = useState(false);
    const [wiggleWave, setWiggleWave] = useState(0);

    const interactionItem = hoverItem ?? activeItem;
    const activeProject = projects.find(
        (project) => project.name === interactionItem
    );

    const bottomNameMap: Record<string, string> = {
        "yorick.live": "yorick",
        "eightysix.bar": "86",
        prehistoric: "theatre"
    };

    const moreMenuBottomNameMap: Record<string, string> = {
        "about": "me",
        "contact": "email",
        "wiggle": "yeah"
    };

    const getBottomName = () => {
        if (!activeProject) return "LAPORE";
        
        if (showMoreMenu) {
            // Map project names to display names in more menu
            const displayNameMap: Record<string, string> = {
                "yorick.live": "about",
                "eightysix.bar": "contact",
                prehistoric: "wiggle"
            };
            const displayName = displayNameMap[activeProject.name];
            return moreMenuBottomNameMap[displayName] ?? "LAPORE";
        }
        
        return bottomNameMap[activeProject.name] ?? "LAPORE";
    };

    const bottomName = getBottomName().toUpperCase();

    const displayNameByProject = useMemo<Record<string, string>>(() => {
        if (!showMoreMenu) {
            return Object.fromEntries(projects.map((p) => [p.name, p.name]));
        }

        return {
            "yorick.live": "about",
            "eightysix.bar": "contact",
            prehistoric: "wiggle"
        };
    }, [showMoreMenu]);

    useEffect(() => {
        document.body.classList.add("landing-scroll-lock");
        document.documentElement.classList.add("landing-scroll-lock");

        return () => {
            document.body.classList.remove("landing-scroll-lock");
            document.documentElement.classList.remove("landing-scroll-lock");
        };
    }, []);

    return (
        <section
            className={`landing${
                wiggleWave % 2 === 1 ? " landing--wiggle" : ""
            }`}
        >
            <LandingIntro />
            <FluidWebglBackground />
            <div className='landing__names'>
                <div className='landing__name landing__name--top'>VINCE</div>
                <div className='landing__name landing__name--bottom'>
                    <span
                        key={bottomName}
                        className='landing__name-bottom-text'
                    >
                        {bottomName}
                    </span>
                </div>
            </div>

            <div className='landing__corners'>
                <a
                    href='mailto:hello@vincelapore.com'
                    className='landing__corner-link'
                >
                    contact
                </a>
            </div>

            <nav className='landing__menu-bar'>
                {projects.map((project, i) => {
                    const displayName =
                        displayNameByProject[project.name] ?? project.name;

                    // Determine tag and CTA based on menu state and project
                    let tag: string;
                    let cta: string;

                    if (showMoreMenu && displayName === "contact") {
                        tag = "hello@vincelapore.com";
                        cta = "send an email";
                    } else {
                        tag = project.tag.toLowerCase();
                        cta = "click to open";
                    }

                    const maxLen = Math.max(tag.length, cta.length);
                    const slots = Array.from({ length: maxLen });

                    const handleClick = () => {
                        if (!showMoreMenu) {
                            // Regular project links handled by href
                            return;
                        }

                        // Handle "more" menu actions
                        if (displayName === "wiggle") {
                            setWiggleWave((prev) => prev + 1);
                        } else if (displayName === "contact") {
                            window.location.href = "mailto:hello@vincelapore.com";
                        } else if (displayName === "about") {
                            // Navigate to about page if it exists, or handle as needed
                            router.push("/about");
                        }
                    };

                    return (
                        <div key={project.name} className='landing__menu-item'>
                            <AnimatedMenuItem
                                num={String(i + 1).padStart(2, "0")}
                                name={displayName}
                                tag={tag}
                                cta={cta}
                                maxLen={maxLen}
                                slots={slots}
                                projectName={project.name}
                                href={showMoreMenu ? undefined : project.href}
                                isAnchor={showMoreMenu ? false : !!project.href}
                                handlers={{
                                    onMouseEnter: () => setHoverItem(project.name),
                                    onMouseLeave: () => setHoverItem(null),
                                    onFocus: () => setActiveItem(project.name)
                                }}
                                onClick={showMoreMenu ? handleClick : undefined}
                                showNumbers={!showMoreMenu}
                            />
                        </div>
                    );
                })}
            </nav>
        </section>
    );
}
