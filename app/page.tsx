"use client";

import { useState } from "react";
import LandingIntro from "./components/landing-intro";

const projects = [
    {
        name: "yorick.live",
        tag: "DEVELOPER",
        description: "Theatre discovery map for indie shows. Visit yorick.live.",
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

export default function Page() {
    const [hoverItem, setHoverItem] = useState<string | null>(null);

    const currentItem = hoverItem;
    const activeProject = projects.find((project) => project.name === currentItem);

    return (
        <section className='landing'>
            <LandingIntro />
            <div className='landing__names'>
                <div className='landing__name landing__name--top'>VINCE</div>
                <div className='landing__name landing__name--bottom'>
                    LAPORE
                </div>
            </div>

            <nav className='landing__nav landing__nav--left'>
                <button
                    type='button'
                    className='landing__link landing__about'
                    onMouseEnter={() => setHoverItem("about")}
                    onMouseLeave={() => setHoverItem(null)}
                >
                    about
                </button>
                <button
                    type='button'
                    className='landing__link landing__contact'
                    onMouseEnter={() => setHoverItem("contact")}
                    onMouseLeave={() => setHoverItem(null)}
                >
                    contact
                </button>
            </nav>

            <aside className='landing__nav landing__nav--right'>
                <div className='landing__projects-title'>PROJECTS</div>
                <div className='landing__projects'>
                    {projects.map((project) => (
                        <div key={project.name} className='landing__project'>
                            {project.href ? (
                                <a
                                    className='landing__project-name'
                                    href={project.href}
                                    target='_blank'
                                    rel='noreferrer'
                                    onMouseEnter={() => setHoverItem(project.name)}
                                    onMouseLeave={() => setHoverItem(null)}
                                >
                                    {project.name}
                                </a>
                            ) : (
                                <span
                                    className='landing__project-name'
                                    onMouseEnter={() => setHoverItem(project.name)}
                                    onMouseLeave={() => setHoverItem(null)}
                                >
                                    {project.name}
                                </span>
                            )}
                            <div className='landing__project-tag'>
                                {project.tag}
                            </div>
                        </div>
                    ))}
                </div>
            </aside>

            <div className='landing__overlay'>
                {currentItem && (
                    <>
                        <h2 className='landing__overlay-title'>
                            {currentItem === "contact"
                                ? "Contact"
                                : activeProject
                                  ? activeProject.name
                                  : "About"}
                        </h2>
                        <p className='landing__overlay-text'>
                            {currentItem === "contact"
                                ? "Email me at vincelapore@icloud.com. always open to collaboration."
                                : activeProject
                                  ? activeProject.description
                                  : "Hello. My name's Vince, a creative who just happens to code. I build tools and systems, design brands, and like to perform. All from Meanjin (Brisbane)."}
                        </p>
                    </>
                )}
            </div>
        </section>
    );
}
