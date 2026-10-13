import { QueueControls } from '@/components/QueueControls'
import { TracksList } from '@/components/TracksList'
import { colors, fontSize } from '@/constants/tokens'
import { trackTitleFilter } from '@/helpers/filter'
import { generateTracksListId } from '@/helpers/miscellaneous'
import { useNavigationSearch } from '@/hooks/useNavigationSearch'
import { usePlaylists } from '@/store/library'
import { defaultStyles } from '@/styles'
import { Image } from 'expo-image'
import { Redirect, useLocalSearchParams } from 'expo-router'
import { useMemo } from 'react'
import { StyleSheet, Text, View } from 'react-native'

// ─── Module-level constants (created once, stable forever) ───────────────────

const SEARCH_BAR_OPTIONS = {
  placeholder: 'Find in songs',
} as const

const QUEUE_CONTROLS_STYLE = { paddingTop: 24 } as const

// ─── Screen ──────────────────────────────────────────────────────────────────

const PlaylistDetailScreen = () => {
  const { name: playlistName } = useLocalSearchParams<{ name: string }>()
  const search = useNavigationSearch({
    searchBarOptions: SEARCH_BAR_OPTIONS,
  })

  const { playlists } = usePlaylists()

  const playlist = playlists.find(
    (currentPlaylist) => currentPlaylist.name === playlistName,
  )

  const filteredTracks = useMemo(() => {
    if (!playlist) return []

    return playlist.tracks.filter(trackTitleFilter(search))
  }, [playlist, search])

  if (!playlist) {
    console.warn(`Playlist ${playlistName} not found!`)

    return <Redirect href={'/(tabs)/(playlists)'} />
  }

  const trackCount = playlist.tracks.length

  const listHeader = (
    <View>
      <View style={styles.artworkImageContainer}>
        <Image
          source={playlist.artworkPreview}
          style={styles.playlistImage}
          contentFit="cover"
          transition={200}
          priority="high"
        />
      </View>

      <Text numberOfLines={1} style={styles.playlistNameText}>
        {playlist.name}
      </Text>

      <Text style={styles.trackCountText}>
        {trackCount} {trackCount === 1 ? 'song' : 'songs'}
      </Text>

      {search.length === 0 && (
        <QueueControls tracks={playlist.tracks} style={QUEUE_CONTROLS_STYLE} />
      )}
    </View>
  )

  return (
    <View style={defaultStyles.container}>
      <TracksList
        id={generateTracksListId(playlist.name, search)}
        hideQueueControls={true}
        ListHeaderComponentStyle={styles.playlistHeaderContainer}
        ListHeaderComponent={listHeader}
        tracks={filteredTracks}
      />
    </View>
  )
}

// ─── Styles ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  playlistHeaderContainer: {
    flex: 1,
    marginBottom: 32,
  },
  artworkImageContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    height: 200,
  },
  playlistImage: {
    width: '60%',
    height: '100%',
    borderRadius: 12,
  },
  playlistNameText: {
    ...defaultStyles.text,
    marginTop: 22,
    textAlign: 'center',
    fontSize: fontSize.lg,
    fontWeight: '800',
  },
  trackCountText: {
    ...defaultStyles.text,
    color: colors.textMuted,
    marginTop: 6,
    textAlign: 'center',
    fontSize: fontSize.sm,
  },
})

export default PlaylistDetailScreen
