// @/context/PlayerContext.tsx
import { Track } from '@/helpers/types'
import { useLibraryStore } from '@/store/library'
import { useAudioPlayer } from 'expo-audio'
import { createContext, useContext, useEffect, useState } from 'react'

type PlayerContextValue = {
  player: ReturnType<typeof useAudioPlayer>
  activeTrack: Track | null
  activeIndex: number
  setActiveIndex: (index: number) => void
}

const PlayerContext = createContext<PlayerContextValue | null>(null)

export const PlayerProvider = ({ children }: { children: React.ReactNode }) => {
  const tracks = useLibraryStore((state) => state.tracks)
  const [activeIndex, setActiveIndex] = useState(0)
  const activeTrack = tracks[activeIndex] ?? null

  const player = useAudioPlayer(
    activeTrack ? { uri: activeTrack.url } : undefined
  )

  useEffect(() => {
    if (!activeTrack) return
    player.replace({ uri: activeTrack.url })
    player.play()
  }, [activeIndex, activeTrack, player])

  useEffect(() => {
    if (!activeTrack) return
    player.setActiveForLockScreen(true, {
      title: activeTrack.title,
      artist: activeTrack.artist,
      artworkUrl: activeTrack.artwork,
    })
  }, [activeTrack, player])

  return (
    <PlayerContext.Provider value={{ player, activeTrack, activeIndex, setActiveIndex }}>
      {children}
    </PlayerContext.Provider>
  )
}

export const usePlayer = () => {
  const ctx = useContext(PlayerContext)
  if (!ctx) throw new Error('usePlayer must be used within PlayerProvider')
  return ctx
}