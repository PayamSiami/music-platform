import { unknownArtistImageUri } from '@/constants/images'
import { screenPadding } from '@/constants/tokens'
import { artistNameFilter } from '@/helpers/filter'
import { Artist } from '@/helpers/types'
import { useNavigationSearch } from '@/hooks/useNavigationSearch'
import { useArtists } from '@/store/library'
import { defaultStyles, utilsStyles } from '@/styles'
import { Image } from 'expo-image'
import { Link } from 'expo-router'
import { useMemo } from 'react'
import { FlatList, StyleSheet, Text, TouchableHighlight, View } from 'react-native'

const SEARCH_BAR_OPTIONS = {
  placeholder: 'Find in artists',
} as const

const LIST_CONTENT_STYLE = {
  paddingTop: 10,
  paddingBottom: 120,
  paddingHorizontal: screenPadding.horizontal,
} as const

const SEPARATOR_STYLE = [
  utilsStyles.itemSeparator,
  { marginLeft: 50, marginVertical: 12 },
]

const NAME_CONTAINER_STYLE = { width: '100%' } as const

const ARTIST_IMAGE_SOURCE = unknownArtistImageUri

// ─── Stable sub-components ───────────────────────────────────────────────────

const ItemSeparatorComponent = () => <View style={SEPARATOR_STYLE} />

const EmptyListComponent = () => (
  <View>
    <Text style={utilsStyles.emptyContentText}>No artist found</Text>
    <Image
      source={ARTIST_IMAGE_SOURCE}
      style={utilsStyles.emptyContentImage}
      contentFit="cover"
      transition={200}
    />
  </View>
)

// ─── Stable renderItem (defined outside so identity never changes) ───────────

const renderArtistItem = ({ item: artist }: { item: Artist }) => (
  <Link
    href={{
      pathname: '/(tabs)/(artists)/[name]',
      params: { name: artist.name },
    }}
    asChild
  >
    <TouchableHighlight activeOpacity={0.8}>
      <View style={styles.artistItemContainer}>
        <View>
          <Image
            source={artist.tracks[0]?.artwork ?? ARTIST_IMAGE_SOURCE}
            style={styles.artistImage}
            contentFit="cover"
            transition={200}
          />
        </View>

        <View style={NAME_CONTAINER_STYLE}>
          <Text numberOfLines={1} style={styles.artistNameText}>
            {artist.name}
          </Text>
        </View>
      </View>
    </TouchableHighlight>
  </Link>
)

const keyExtractor = (artist: Artist) => artist.name

// ─── Screen ──────────────────────────────────────────────────────────────────

const ArtistsScreen = () => {
  const search = useNavigationSearch({
    searchBarOptions: SEARCH_BAR_OPTIONS,
  })

  const artists = useArtists()

  const filteredArtists = useMemo(() => {
    if (!search) return artists
    return artists.filter(artistNameFilter(search))
  }, [artists, search])

  return (
    <View style={defaultStyles.container}>
      <FlatList
        contentContainerStyle={LIST_CONTENT_STYLE}
        ItemSeparatorComponent={ItemSeparatorComponent}
        ListFooterComponent={ItemSeparatorComponent}
        ListEmptyComponent={EmptyListComponent}
        data={filteredArtists}
        renderItem={renderArtistItem}
        keyExtractor={keyExtractor}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  artistItemContainer: {
    flexDirection: 'row',
    columnGap: 14,
    alignItems: 'center',
  },
  artistImage: {
    borderRadius: 32,
    width: 40,
    height: 40,
  },
  artistNameText: {
    ...defaultStyles.text,
    fontSize: 17,
    maxWidth: '80%',
  },
})

export default ArtistsScreen