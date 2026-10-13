import { PlaylistsList } from '@/components/PlaylistsList'
import { screenPadding } from '@/constants/tokens'
import { Playlist } from '@/helpers/types'
import { usePlaylists } from '@/store/library'
import { defaultStyles } from '@/styles'
import { useRouter } from 'expo-router'
import { useCallback } from 'react'
import { StyleSheet, View } from 'react-native'

const PlaylistsScreen = () => {
  const router = useRouter()
  const { playlists } = usePlaylists()

  const handlePlaylistPress = useCallback(
    (playlist: Playlist) => {
      router.push({
        pathname: '/(tabs)/(playlists)/[name]',
        params: { name: playlist.name },
      })
    },
    [router],
  )

  return (
    <View style={[defaultStyles.container, styles.container]}>
      <PlaylistsList playlists={playlists} onPlaylistPress={handlePlaylistPress} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: screenPadding.horizontal,
  },
})

export default PlaylistsScreen
