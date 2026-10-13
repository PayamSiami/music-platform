import { TracksListItem } from '@/components/TracksListItem'
import { unknownTrackImageUri } from '@/constants/images'
import { screenPadding } from '@/constants/tokens'
import { usePlayer } from '@/context/PlayerContext'
import { Track } from '@/helpers/types'
import { useQueue } from '@/store/queue'
import { utilsStyles } from '@/styles'
import { Image } from 'expo-image'
import { useAudioPlayerStatus } from 'expo-audio'
import { useCallback, useMemo } from 'react'
import { FlatList, FlatListProps, Text, View } from 'react-native'
import { QueueControls } from './QueueControls'

export type TracksListProps = Partial<FlatListProps<Track>> & {
  id: string
  tracks: Track[]
  hideQueueControls?: boolean
}

// ─── Module-level constants ──────────────────────────────────────────────────

const LIST_CONTENT_STYLE = {
  paddingTop: 10,
  paddingBottom: 128,
  paddingHorizontal: screenPadding.horizontal,
} as const

const SEPARATOR_STYLE = {
  ...utilsStyles.itemSeparator,
  marginVertical: 9,
  marginLeft: 60,
}

const QUEUE_CONTROLS_STYLE = { paddingBottom: 20 } as const

const EMPTY_IMAGE_SOURCE = unknownTrackImageUri

// ─── Stable sub-components ───────────────────────────────────────────────────

const ItemDivider = () => <View style={SEPARATOR_STYLE} />

const EmptyListComponent = () => (
  <View>
    <Text style={utilsStyles.emptyContentText}>No songs found</Text>
    <Image
      source={EMPTY_IMAGE_SOURCE}
      style={utilsStyles.emptyContentImage}
      contentFit="cover"
      transition={200}
    />
  </View>
)

// ─── Component ───────────────────────────────────────────────────────────────

export const TracksList = ({
  id,
  tracks,
  hideQueueControls = false,
  ...flatlistProps
}: TracksListProps) => {
  const { player, activeTrack, playQueue } = usePlayer()
  const { setActiveQueueId } = useQueue()
  const status = useAudioPlayerStatus(player)

  const handleTrackSelect = useCallback(
    (selectedTrack: Track) => {
      const trackIndex = tracks.findIndex((track) => track.url === selectedTrack.url)

      if (trackIndex === -1) return

      // Tapping the active track toggles play/pause instead of restarting it.
      if (activeTrack?.url === selectedTrack.url) {
        if (status.playing) {
          player.pause()
        } else {
          player.play()
        }

        return
      }

      // The selected list becomes the active queue, starting at the tapped track.
      setActiveQueueId(id)
      playQueue(tracks, trackIndex)
    },
    [activeTrack?.url, id, playQueue, player, setActiveQueueId, status.playing, tracks],
  )

  const renderItem = useCallback(
    ({ item: track }: { item: Track }) => (
      <TracksListItem
        track={track}
        onTrackSelect={handleTrackSelect}
        isActiveTrack={activeTrack?.url === track.url}
        isPlaying={status.playing}
      />
    ),
    [handleTrackSelect, activeTrack?.url, status.playing],
  )

  const keyExtractor = useCallback((track: Track) => track.url, [])

  const listHeader = useMemo(
    () =>
      !hideQueueControls ? (
        <QueueControls tracks={tracks} style={QUEUE_CONTROLS_STYLE} />
      ) : undefined,
    [hideQueueControls, tracks],
  )

  return (
    <FlatList
      data={tracks}
      contentContainerStyle={LIST_CONTENT_STYLE}
      ListHeaderComponent={listHeader}
      ListFooterComponent={ItemDivider}
      ItemSeparatorComponent={ItemDivider}
      ListEmptyComponent={EmptyListComponent}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      {...flatlistProps}
    />
  )
}
