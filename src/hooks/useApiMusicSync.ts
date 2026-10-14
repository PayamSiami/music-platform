import { musicToTrack } from '@/api/mappers'
import { useApiStore } from '@/store/api'
import { useLibraryStore } from '@/store/library'
import { useCallback, useEffect } from 'react'

/** Page size for the initial catalog fetch. */
const MUSIC_PAGE_SIZE = 100

/**
 * Loads the music catalog from the API once and mirrors it into the library
 * store, which powers the songs, artists, favorites and playlists screens.
 * Falls back to the bundled catalog whenever the API yields nothing (e.g. no
 * Firebase ID token configured yet).
 */
export function useApiMusicSync() {
    const music = useApiStore((state) => state.music)
    const fetchMusic = useApiStore((state) => state.fetchMusic)
    const setApiTracks = useLibraryStore((state) => state.setApiTracks)

    useEffect(() => {
        if (music.status === 'idle') {
            fetchMusic({ limit: MUSIC_PAGE_SIZE })
        }
    }, [music.status, fetchMusic])

    useEffect(() => {
        if (music.status === 'success' && music.items.length > 0) {
            setApiTracks(music.items.map(musicToTrack))
        }
    }, [music.status, music.items, setApiTracks])

    const refetch = useCallback(
        () => fetchMusic({ limit: MUSIC_PAGE_SIZE }),
        [fetchMusic]
    )

    return { music, refetch }
}
