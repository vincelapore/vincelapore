'use client'

import { useLayoutEffect } from 'react'
import { preloadVideos } from '@/lib/preload-videos'

/**
 * Starts the shared video warm as early as the client tree mounts —
 * before / in parallel with intro animation work.
 */
export function VideoBoot() {
  useLayoutEffect(() => {
    void preloadVideos()
  }, [])

  return null
}
