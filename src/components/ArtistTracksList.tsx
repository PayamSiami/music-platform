import { unknownArtistImageUri } from '@/constants/images'
import { fontSize } from '@/constants/tokens'
import { trackTitleFilter } from '@/helpers/filter'
import { generateTracksListId } from '@/helpers/miscellaneous'
import { Artist } from '@/helpers/types'
import { useNavigationSearch } from '@/hooks/useNavigationSearch'
import { defaultStyles } from '@/styles'
import { Image } from 'expo-image'
import { useMemo } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { QueueControls } from './QueueControls'
import { TracksList } from './TracksList'

// ─── Module-level constants (created once, stable forever) ───────────────────

const SEARCH_BAR_OPTIONS = {
  hideWhenScrolling: true,
  placeholder: 'Find in songs',
} as const

const ARTIST_IMAGE_SOURCE = unknownArtistImageUri

const QUEUE_CONTROLS_STYLE = { paddingTop: 24 } as const

// ─── Stable render helpers ───────────────────────────────────────────────────

const renderHeader = (artist: Artist, search: string, tracks: Artist['tracks']) => (
  <View>
    <View style={styles.artworkImageContainer}>
      <Image
        source={ARTIST_IMAGE_SOURCE}
        style={styles.artistImage}
        contentFit="cover"
        transition={200}
        priority="high"
      />
    </View>

    <Text numberOfLines={1} style={styles.artistNameText}>
      {artist.name}
    </Text>

    {search.length === 0 && (
      <QueueControls tracks={tracks} style={QUEUE_CONTROLS_STYLE} />
    )}
  </View>
)

// ─── Component ───────────────────────────────────────────────────────────────

export const ArtistTracksList = ({ artist }: { artist: Artist }) => {
  const search = useNavigationSearch({
    searchBarOptions: SEARCH_BAR_OPTIONS,
  })

  const filteredArtistTracks = useMemo(() => {
    return artist.tracks.filter(trackTitleFilter(search))
  }, [artist.tracks, search])

  const listId = useMemo(
    () => generateTracksListId(artist.name, search),
    [artist.name, search]
  )

  const listHeader = useMemo(
    () => renderHeader(artist, search, filteredArtistTracks),
    [artist, search, filteredArtistTracks]
  )

  return (
    <TracksList
      id={listId}
      hideQueueControls={true}
      ListHeaderComponentStyle={styles.artistHeaderContainer}
      ListHeaderComponent={listHeader}
      tracks={filteredArtistTracks}
    />
  )
}

// ─── Styles ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  artistHeaderContainer: {
    flex: 1,
    marginBottom: 32,
  },
  artworkImageContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    height: 200,
  },
  artistImage: {
    width: '60%',
    height: '100%',
    borderRadius: 128,
  },
  artistNameText: {
    ...defaultStyles.text,
    marginTop: 22,
    textAlign: 'center',
    fontSize: fontSize.lg,
    fontWeight: '800',
  },
})