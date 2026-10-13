import { TracksList } from '@/components/TracksList'
import { trackTitleFilter } from '@/helpers/filter'
import { generateTracksListId } from '@/helpers/miscellaneous'
import { useNavigationSearch } from '@/hooks/useNavigationSearch'
import { useFavorites } from '@/store/library'
import { defaultStyles } from '@/styles'
import { useMemo } from 'react'
import { View } from 'react-native'

// ─── Module-level constants (created once, stable forever) ───────────────────

const SEARCH_BAR_OPTIONS = {
	placeholder: 'Find in songs',
} as const

const FavoritesScreen = () => {
	const search = useNavigationSearch({
		searchBarOptions: SEARCH_BAR_OPTIONS,
	})

	const favoritesTracks = useFavorites().favorites

	const filteredFavoritesTracks = useMemo(() => {
		if (!search) return favoritesTracks

		return favoritesTracks.filter(trackTitleFilter(search))
	}, [search, favoritesTracks])

	return (
		<View style={defaultStyles.container}>
			<TracksList id={generateTracksListId('favorites', search)} tracks={filteredFavoritesTracks} />
		</View>
	)
}

export default FavoritesScreen
