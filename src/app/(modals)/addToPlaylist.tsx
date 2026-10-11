import { PlaylistsList } from '@/components/PlaylistsList'
import { screenPadding } from '@/constants/tokens'
import { Playlist, Track } from '@/helpers/types'
import { usePlaylists, useTracks } from '@/store/library'
import { useQueue } from '@/store/queue'
import { defaultStyles } from '@/styles'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { Platform, StyleSheet } from 'react-native'
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'

const AddToPlaylistModal = () => {
  const router = useRouter()
  const { top } = useSafeAreaInsets()

  // Standard native stack header height + safe area top
  const headerHeight = Platform.select({
    ios: 44,
    android: 56,
    default: 56,
  }) + top

  const { activeQueueId } = useQueue()
  const { trackUrl } = useLocalSearchParams<{ trackUrl: Track['url'] }>()
  const tracks = useTracks()
  const { playlists, addToPlaylist } = usePlaylists()

  const track = tracks.find((currentTrack) => trackUrl === currentTrack.url)

  if (!track) {
    return null
  }

  const availablePlaylists = playlists.filter(
    (playlist) => !playlist.tracks.some((playlistTrack) => playlistTrack.url === track.url),
  )

  const handlePlaylistPress = async (playlist: Playlist) => {
    addToPlaylist(track, playlist.name)
    router.dismiss()

    if (activeQueueId?.startsWith(playlist.name)) {
      // TODO: append to queue via your store
    }
  }

  return (
    <SafeAreaView style={[styles.modalContainer, { paddingTop: headerHeight }]}>
      <PlaylistsList playlists={availablePlaylists} onPlaylistPress={handlePlaylistPress} />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  modalContainer: {
    ...defaultStyles.container,
    paddingHorizontal: screenPadding.horizontal,
  },
})

export default AddToPlaylistModal