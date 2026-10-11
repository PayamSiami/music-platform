import { Track } from '@/helpers/types'
import { useEffect, useState } from 'react'

export const useLastActiveTrack = (activeTrack: Track | null | undefined) => {
  const [lastActiveTrack, setLastActiveTrack] = useState<Track | undefined>()

  useEffect(() => {
    if (!activeTrack) return

    setLastActiveTrack(activeTrack)
  }, [activeTrack])

  return lastActiveTrack
}