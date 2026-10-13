import { PlaylistListItem } from '@/components/PlaylistListItem'
import { unknownTrackImageUri } from '@/constants/images'
import { playlistNameFilter } from '@/helpers/filter'
import { Playlist } from '@/helpers/types'
import { useNavigationSearch } from '@/hooks/useNavigationSearch'
import { utilsStyles } from '@/styles'
import { Image } from 'expo-image'
import { useCallback, useMemo } from 'react'
import { FlatList, FlatListProps, Text, View } from 'react-native'

type PlaylistsListProps = {
	playlists: Playlist[]
	onPlaylistPress: (playlist: Playlist) => void
} & Partial<FlatListProps<Playlist>>

// ─── Module-level constants (created once, stable forever) ───────────────────

const SEARCH_BAR_OPTIONS = {
	placeholder: 'Find in playlist',
} as const

const LIST_CONTENT_STYLE = {
	paddingTop: 10,
	paddingBottom: 128,
} as const

const DIVIDER_STYLE = {
	...utilsStyles.itemSeparator,
	marginLeft: 80,
	marginVertical: 12,
} as const

const EMPTY_IMAGE_SOURCE = unknownTrackImageUri

const ItemDivider = () => <View style={DIVIDER_STYLE} />

const EmptyListComponent = () => (
	<View>
		<Text style={utilsStyles.emptyContentText}>No playlist found</Text>
		<Image
			source={EMPTY_IMAGE_SOURCE}
			style={utilsStyles.emptyContentImage}
			contentFit="cover"
			transition={200}
		/>
	</View>
)

// ─── Component ───────────────────────────────────────────────────────────────

export const PlaylistsList = ({
	playlists,
	onPlaylistPress: handlePlaylistPress,
	...flatListProps
}: PlaylistsListProps) => {
	const search = useNavigationSearch({
		searchBarOptions: SEARCH_BAR_OPTIONS,
	})

	const filteredPlaylist = useMemo(() => {
		return playlists.filter(playlistNameFilter(search))
	}, [playlists, search])

	const renderItem = useCallback(
		({ item: playlist }: { item: Playlist }) => (
			<PlaylistListItem playlist={playlist} onPress={() => handlePlaylistPress(playlist)} />
		),
		[handlePlaylistPress],
	)

	const keyExtractor = useCallback((playlist: Playlist) => playlist.name, [])

	return (
		<FlatList
			contentContainerStyle={LIST_CONTENT_STYLE}
			ItemSeparatorComponent={ItemDivider}
			ListFooterComponent={ItemDivider}
			ListEmptyComponent={EmptyListComponent}
			data={filteredPlaylist}
			renderItem={renderItem}
			keyExtractor={keyExtractor}
			{...flatListProps}
		/>
	)
}