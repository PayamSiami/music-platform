import { Track } from '@/helpers/types'
import { useState } from 'react'

export const useLastActiveTrack = (activeTrack: Track | null | undefined) => {
  const [lastActiveTrack, setLastActiveTrack] = useState<Track | undefined>(
    activeTrack ?? undefined,
  )

  // Adjusting state during render is the documented pattern for remembering
  // information from previous renders.
  if (activeTrack && activeTrack !== lastActiveTrack) {
    setLastActiveTrack(activeTrack)
  }

  return lastActiveTrack
}
