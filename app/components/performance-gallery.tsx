"use client";

import Image, { type StaticImageData } from "next/image";
import { useState } from "react";

type GalleryImage = {
    src: StaticImageData | string;
    alt: string;
    width?: number;
    height?: number;
    blurDataURL?: string;
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

    const resolveWidth = (image: GalleryImage) => {
        if (image.width) {
            return image.width;
        }
        if (typeof image.src !== "string") {
            return image.src.width;
        }
        return 800;
    };

    const resolveHeight = (image: GalleryImage) => {
        if (image.height) {
            return image.height;
        }
        if (typeof image.src !== "string") {
            return image.src.height;
        }
        return 1000;
    };

    const resolveBlur = (image: GalleryImage) => {
        if (image.blurDataURL) {
            return image.blurDataURL;
        }
        if (typeof image.src !== "string") {
            return image.src.blurDataURL;
        }
        return undefined;
    };

    if (!images.length) {
        return null;
    }

    return (
        <div className='space-y-4 [content-visibility:auto] [contain-intrinsic-size:1000px]'>
            <div className='columns-1 gap-4 sm:columns-2 lg:columns-3'>
                {visibleImages.map((image, index) => {
                    const key =
                        typeof image.src === "string"
                            ? image.src
                            : image.src.src;
                    const blurValue = resolveBlur(image);

                    return (
                        <div
                            key={key}
                            className='mb-4 break-inside-avoid overflow-hidden rounded-lg border border-neutral-200 bg-neutral-100 dark:border-neutral-800 dark:bg-neutral-900'
                        >
                            <Image
                                src={image.src}
                                alt={image.alt}
                                width={resolveWidth(image)}
                                height={resolveHeight(image)}
                                className='h-auto w-full object-cover'
                                sizes='(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw'
                                placeholder={blurValue ? "blur" : "empty"}
                                blurDataURL={blurValue}
                                priority={index < priorityCount && !expanded}
                            />
                        </div>
                    );
                })}
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
