// @/context/PlayerContext.tsx
import { Track } from '@/helpers/types'
import { useLibraryStore } from '@/store/library'
import { useAudioPlayer } from 'expo-audio'
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'

type PlayerContextValue = {
  player: ReturnType<typeof useAudioPlayer>
  queue: Track[]
  activeTrack: Track | null
  activeIndex: number
  isLooping: boolean
  playQueue: (tracks: Track[], index?: number) => void
  skipToNext: () => void
  skipToPrevious: () => void
  toggleLoop: () => void
}

const PlayerContext = createContext<PlayerContextValue | null>(null)

export const PlayerProvider = ({ children }: { children: React.ReactNode }) => {
  const tracks = useLibraryStore((state) => state.tracks)
  const [queue, setQueue] = useState<Track[]>(tracks)
  const [activeIndex, setActiveIndex] = useState(0)
  const [isLooping, setIsLooping] = useState(false)

  const activeTrack = queue[activeIndex] ?? null

  // The player is created once, without a source. Passing a source here would
  // recreate (and release) the player whenever it changes, so every track
  // change goes through `player.replace()` in the sync effect below.
  const player = useAudioPlayer()

  const skipToNext = useCallback(() => {
    if (queue.length === 0) return

    setActiveIndex((prev) => (prev + 1) % queue.length)
  }, [queue.length])

  const skipToPrevious = useCallback(() => {
    if (queue.length === 0) return

    setActiveIndex((prev) => (prev - 1 + queue.length) % queue.length)
  }, [queue.length])

  const toggleLoop = useCallback(() => {
    setIsLooping((value) => !value)
  }, [])

  const playQueue = useCallback((nextTracks: Track[], index = 0) => {
    if (nextTracks.length === 0) return

    setQueue(nextTracks)
    setActiveIndex(index)
  }, [])

  // Load and play the active track whenever it changes.
  useEffect(() => {
    if (!activeTrack) return

    player.replace({ uri: activeTrack.url })
    player.setActiveForLockScreen(true, {
      title: activeTrack.title,
      artist: activeTrack.artist,
      artworkUrl: activeTrack.artwork,
    })
    player.play()
  }, [activeTrack, player])

  // expo-audio exposes `loop` as a settable property (there is no setter
  // method), so the looping state is mirrored onto the player here.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/immutability -- expo-audio exposes `loop` as a settable property and has no setter method
    player.loop = isLooping
  }, [isLooping, player])

  // Auto-advance to the next track when the current one finishes.
  // Refs keep the subscription stable across renders.
  const isLoopingRef = useRef(isLooping)
  const skipToNextRef = useRef(skipToNext)

  useEffect(() => {
    isLoopingRef.current = isLooping
  }, [isLooping])

  useEffect(() => {
    skipToNextRef.current = skipToNext
  }, [skipToNext])

  useEffect(() => {
    const subscription = player.addListener('playbackStatusUpdate', (status) => {
      if (status.didJustFinish && !isLoopingRef.current) {
        skipToNextRef.current()
      }
    })

    return () => {
      subscription.remove()
    }
  }, [player])

  const value = useMemo(
    () => ({
      player,
      queue,
      activeTrack,
      activeIndex,
      isLooping,
      playQueue,
      skipToNext,
      skipToPrevious,
      toggleLoop,
    }),
    [
      activeIndex,
      activeTrack,
      isLooping,
      playQueue,
      player,
      queue,
      skipToNext,
      skipToPrevious,
      toggleLoop,
    ],
  )

  return <PlayerContext.Provider value={value}>{children}</PlayerContext.Provider>
}

export const usePlayer = () => {
  const ctx = useContext(PlayerContext)
  if (!ctx) throw new Error('usePlayer must be used within PlayerProvider')
  return ctx
}
