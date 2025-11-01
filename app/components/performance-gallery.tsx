'use client';

import Image from "next/image";
import { useState } from "react";

type GalleryImage = {
    src: string;
    alt: string;
};

type PerformanceGalleryProps = {
    title: string;
    images: GalleryImage[];
    previewCount?: number;
    priorityCount?: number;
};

const DEFAULT_PREVIEW_COUNT = 4;

export function PerformanceGallery({
    title,
    images,
    previewCount = DEFAULT_PREVIEW_COUNT,
    priorityCount = 0
}: PerformanceGalleryProps) {
    const [expanded, setExpanded] = useState(false);
    const visibleImages = expanded ? images : images.slice(0, previewCount);

    if (!images.length) {
        return null;
    }

    return (
        <div className='space-y-4'>
            <div className='columns-1 gap-4 sm:columns-2 lg:columns-3'>
                {visibleImages.map((image, index) => (
                    <div
                        key={image.src}
                        className='mb-4 break-inside-avoid overflow-hidden rounded-lg border border-neutral-200 bg-neutral-100 dark:border-neutral-800 dark:bg-neutral-900'
                    >
                        <Image
                            src={image.src}
                            alt={image.alt}
                            width={800}
                            height={1000}
                            className='h-auto w-full object-cover'
                            sizes='(min-width: 1280px) 30vw, (min-width: 1024px) 40vw, (min-width: 640px) 50vw, 100vw'
                            priority={index < priorityCount && !expanded}
                        />
                    </div>
                ))}
            </div>

            {images.length > previewCount && (
                <button
                    type='button'
                    onClick={() => setExpanded((prev) => !prev)}
                    className='rounded-full border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-700 transition hover:bg-neutral-100 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800'
                    aria-label={
                        expanded
                            ? `Collapse photo gallery for ${title}`
                            : `Show full photo gallery for ${title}`
                    }
                >
                    {expanded
                        ? "Show fewer photos"
                        : `Show all ${images.length} photos`}
                </button>
            )}
        </div>
    );
}
