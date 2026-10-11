import { useFavorites } from '@/store/library'
import { useAudioPlayer } from 'expo-audio'
import { useCallback } from 'react'

type Track = {
  url: string
  // ... other fields like title, artist, rating
}

export const useTrackPlayerFavorite = (
  player: ReturnType<typeof useAudioPlayer>,
  activeTrack: Track | null
) => {
  const { favorites, toggleTrackFavorite } = useFavorites()

  const isFavorite = favorites.find((track) => track.url === activeTrack?.url)?.rating === 1

  const toggleFavorite = useCallback(async () => {
    if (!activeTrack) return

    // Update the app's internal state (this is now the source of truth)
    toggleTrackFavorite(activeTrack)

    // Keep the lock screen metadata in sync.
    // Note: expo-audio does not support arbitrary custom fields like `rating`.
    // `updateLockScreenMetadata` only accepts title, artist, album, artwork.
    // There is no way to reflect a "favorite" state on the lock screen
    // through expo-audio's public API.
  }, [activeTrack, toggleTrackFavorite])

  return { isFavorite, toggleFavorite }
}