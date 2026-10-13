import { PlayPauseButton, SkipToNextButton } from '@/components/PlayerControls'
import { unknownTrackImageUri } from '@/constants/images'
import { colors } from '@/constants/tokens'
import { usePlayer } from '@/context/PlayerContext'
import { useLastActiveTrack } from '@/hooks/useLastActiveTrack'
import { defaultStyles } from '@/styles'
import { Image } from 'expo-image'
import { useAudioPlayerStatus } from 'expo-audio'
import { useRouter } from 'expo-router'
import { useCallback } from 'react'
import { StyleSheet, TouchableOpacity, View, ViewProps } from 'react-native'
import { MovingText } from './MovingText'

// ─── Module-level constants (created once, stable forever) ───────────────────

const PLAYER_ROUTE = '/player' as const

const FALLBACK_ARTWORK = unknownTrackImageUri

const PlayPauseIcon = { size: 24 } as const
const SkipIcon = { size: 22 } as const

export const FloatingPlayer = ({ style }: ViewProps) => {
  const router = useRouter()

  const { player, activeTrack, skipToNext } = usePlayer()
  const status = useAudioPlayerStatus(player)
  const lastActiveTrack = useLastActiveTrack(activeTrack)

  const displayedTrack = activeTrack ?? lastActiveTrack

  const playbackProgress =
    status.duration > 0 ? Math.min(1, status.currentTime / status.duration) : 0

  const handlePress = useCallback(() => {
    router.navigate(PLAYER_ROUTE)
  }, [router])

  if (!displayedTrack) return null

  const artworkSource = displayedTrack.artwork ?? FALLBACK_ARTWORK

  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.9}
      style={[styles.container, style]}
    >
      <Image
        source={artworkSource}
        style={styles.trackArtworkImage}
        contentFit="cover"
        transition={200}
      />

      <View style={styles.trackTitleContainer}>
        <MovingText
          style={styles.trackTitle}
          text={displayedTrack.title ?? ''}
          animationThreshold={25}
        />
      </View>

      <View style={styles.trackControlsContainer}>
        <PlayPauseButton iconSize={PlayPauseIcon.size} player={player} />
        <SkipToNextButton iconSize={SkipIcon.size} onSkipToNext={skipToNext} />
      </View>

      {/* Playback progress */}
      <View style={styles.progressTrack}>
        <View style={[styles.progressBar, { width: `${playbackProgress * 100}%` }]} />
      </View>
    </TouchableOpacity>
  )
}

// ─── Styles ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#252525',
    padding: 8,
    borderRadius: 12,
    paddingVertical: 10,
  },
  trackArtworkImage: {
    width: 40,
    height: 40,
    borderRadius: 8,
  },
  trackTitleContainer: {
    flex: 1,
    overflow: 'hidden',
    marginLeft: 10,
  },
  trackTitle: {
    ...defaultStyles.text,
    fontSize: 18,
    fontWeight: '600',
    paddingLeft: 10,
  },
  trackControlsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 20,
    marginRight: 16,
    paddingLeft: 16,
  },
  progressTrack: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 3,
    overflow: 'hidden',
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  progressBar: {
    height: '100%',
    borderRadius: 2,
    backgroundColor: colors.primary,
  },
})