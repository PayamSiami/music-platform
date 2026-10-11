import { TracksListItem } from '@/components/TracksListItem'
import { unknownTrackImageUri } from '@/constants/images'
import { usePlayer } from '@/context/PlayerContext'
import { Track } from '@/helpers/types'
import { useQueue } from '@/store/queue'
import { utilsStyles } from '@/styles'
import { useAudioPlayerStatus } from 'expo-audio'
import { useRef } from 'react'
import { FlatList, FlatListProps, Text, View } from 'react-native'
import FastImage from 'react-native-fast-image'
import { QueueControls } from './QueueControls'

export type TracksListProps = Partial<FlatListProps<Track>> & {
  id: string
  tracks: Track[]
  hideQueueControls?: boolean
}

const ItemDivider = () => (
  <View style={{ ...utilsStyles.itemSeparator, marginVertical: 9, marginLeft: 60 }} />
)

export const TracksList = ({
  id,
  tracks,
  hideQueueControls = false,
  ...flatlistProps
}: TracksListProps) => {
  const queueOffset = useRef(0)
  const { activeQueueId, setActiveQueueId } = useQueue()
  const { player, activeTrack, setActiveIndex } = usePlayer()
  const status = useAudioPlayerStatus(player)

  const handleTrackSelect = async (selectedTrack: Track) => {
    const trackIndex = tracks.findIndex((track) => track.url === selectedTrack.url)

    if (trackIndex === -1) return

    const isChangingQueue = id !== activeQueueId

    if (isChangingQueue) {
      const beforeTracks = tracks.slice(0, trackIndex)
      const afterTracks = tracks.slice(trackIndex + 1)

      // expo-audio has no native queue. We build the queue in our own store
      // and set the active index to the selected track. The PlayerProvider
      // listens to activeIndex changes and calls player.replace() + play().
      setActiveIndex(trackIndex)

      // If your queue store keeps an ordered list of tracks per queue id,
      // rebuild it here so skip-to-next/previous follows the same order
      // the original RNTP code used (selected, after, before).
      // Example:
      // useQueue.getState().setQueue([selectedTrack, ...afterTracks, ...beforeTracks])

      queueOffset.current = trackIndex
      setActiveQueueId(id)
    } else {
      const nextTrackIndex =
        trackIndex - queueOffset.current < 0
          ? tracks.length + trackIndex - queueOffset.current
          : trackIndex - queueOffset.current

      setActiveIndex(nextTrackIndex)
      player.play()
    }
  }

  return (
    <FlatList
      data={tracks}
      contentContainerStyle={{ paddingTop: 10, paddingBottom: 128 }}
      ListHeaderComponent={
        !hideQueueControls ? (
          <QueueControls tracks={tracks} style={{ paddingBottom: 20 }} />
        ) : undefined
      }
      ListFooterComponent={ItemDivider}
      ItemSeparatorComponent={ItemDivider}
      ListEmptyComponent={
        <View>
          <Text style={utilsStyles.emptyContentText}>No songs found</Text>

          <FastImage
            source={{ uri: unknownTrackImageUri, priority: FastImage.priority.normal }}
            style={utilsStyles.emptyContentImage}
          />
        </View>
      }
      renderItem={({ item: track }) => (
        <TracksListItem
          track={track}
          onTrackSelect={handleTrackSelect}
          isActiveTrack={activeTrack?.url === track.url}
          isPlaying={status.playing}
        />
      )}
      {...flatlistProps}
    />
  )
}