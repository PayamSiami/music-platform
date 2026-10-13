import { useAudioPlayer } from 'expo-audio'
import { useCallback, useEffect, useState } from 'react'

export const useAudioPlayerVolume = (player: ReturnType<typeof useAudioPlayer>) => {
  const [volume, setVolume] = useState<number>(player.volume)

  // expo-audio exposes `volume` as a settable property (there is no setter
  // method), so the state is mirrored onto the player here.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/immutability -- expo-audio exposes `volume` as a settable property and has no setter method
    player.volume = volume
  }, [player, volume])

  const updateVolume = useCallback((newVolume: number) => {
    if (newVolume < 0 || newVolume > 1) return

    setVolume(newVolume)
  }, [])

  return { volume, updateVolume }
}
