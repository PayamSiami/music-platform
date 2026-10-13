import { Track } from '@/helpers/types'
import { useFavorites } from '@/store/library'
import { useQueue } from '@/store/queue'
import { MenuView } from '@expo/ui/community/menu'
import { useRouter } from 'expo-router'
import { PropsWithChildren } from 'react'
import { Platform } from 'react-native'
import { match } from 'ts-pattern'

type TrackShortcutsMenuProps = PropsWithChildren<{ track: Track }>

export const TrackShortcutsMenu = ({ track, children }: TrackShortcutsMenuProps) => {
    const router = useRouter()

    const isFavorite = track.rating === 1

    const { toggleTrackFavorite } = useFavorites()
    const { activeQueueId } = useQueue()

    const handlePressAction = (id: string) => {
        match(id)
            .with('add-to-favorites', async () => {
                toggleTrackFavorite(track)

                // expo-audio has no native queue. If your app maintains its own
                // queue in Zustand, append here instead of TrackPlayer.add(track).
                if (activeQueueId?.startsWith('favorites')) {
                    // TODO: useQueue.getState().appendToQueue(track)
                }
            })
            .with('remove-from-favorites', async () => {
                toggleTrackFavorite(track)

                // expo-audio has no native queue removal. Update your Zustand queue
                // store instead of calling TrackPlayer.remove().
                if (activeQueueId?.startsWith('favorites')) {
                    // TODO: useQueue.getState().removeFromQueue(track.url)
                }
            })
            .with('add-to-playlist', () => {
                // it opens the addToPlaylist modal
                router.push({ pathname: '/(modals)/addToPlaylist', params: { trackUrl: track.url } })
            })
            .otherwise(() => console.warn(`Unknown menu action ${id}`))
    }

    const favoriteAction = {
        id: isFavorite ? 'remove-from-favorites' : 'add-to-favorites',
        title: isFavorite ? 'Remove from favorites' : 'Add to favorites',
        // Note: `image` handling differs slightly between platforms.
        image: Platform.select({
            ios: 'star.fill', // SF Symbol name (works on iOS)
            android: require('@/assets/unknown_artist.png'), // local image for Android
        }),
    }

    const addToPlaylistAction = {
        id: 'add-to-playlist',
        title: 'Add to playlist',
        image: Platform.select({
            ios: 'plus', // SF Symbol name (works on iOS)
            android: require('@/assets/unknown_artist.png'), // local image for Android
        }),
    }

    return (
        <MenuView
            onPressAction={({ nativeEvent: { event } }) => handlePressAction(event)}
            actions={[favoriteAction, addToPlaylistAction]}
        >
            {children}
        </MenuView>
    )
}
