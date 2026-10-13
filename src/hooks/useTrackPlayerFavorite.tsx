import { Track } from '@/helpers/types'
import { useFavorites } from '@/store/library'
import { useCallback } from 'react'

export const useTrackPlayerFavorite = (activeTrack: Track | null) => {
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
