import { TracksList } from '@/components/TracksList'
import { trackTitleFilter } from '@/helpers/filter'
import { generateTracksListId } from '@/helpers/miscellaneous'
import { useNavigationSearch } from '@/hooks/useNavigationSearch'
import { useTracks } from '@/store/library'
import { defaultStyles } from '@/styles'
import { useMemo } from 'react'
import { View } from 'react-native'

// ─── Module-level constants (created once, stable forever) ───────────────────

const SEARCH_BAR_OPTIONS = {
    placeholder: 'Find in songs',
} as const

const SongsScreen = () => {
    const search = useNavigationSearch({
        searchBarOptions: SEARCH_BAR_OPTIONS,
    })

    const tracks = useTracks()

    const filteredTracks = useMemo(() => {
        if (!search) return tracks

        return tracks.filter(trackTitleFilter(search))
    }, [search, tracks])

    return (
        <View style={defaultStyles.container}>
            <TracksList id={generateTracksListId('songs', search)} tracks={filteredTracks} />
        </View>
    )
}

export default SongsScreen
