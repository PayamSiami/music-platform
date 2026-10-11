import { useAudioPlayer } from 'expo-audio'
import { useCallback, useState } from 'react'

export const useAudioPlayerVolume = (player: ReturnType<typeof useAudioPlayer>) => {
  const [volume, setVolume] = useState<number>(player.volume)

  const updateVolume = useCallback((newVolume: number) => {
    if (newVolume < 0 || newVolume > 1) return

    setVolume(newVolume)
    player.volume = newVolume
  }, [player])

  return { volume, updateVolume }
}