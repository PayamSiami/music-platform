import { MovingText } from '@/components/MovingText'
import { PlayerControls } from '@/components/PlayerControls'
import { PlayerProgressBar } from '@/components/PlayerProgressbar'
import { PlayerRepeatToggle } from '@/components/PlayerRepeatToggle'
import { PlayerVolumeBar } from '@/components/PlayerVolumeBar'
import { unknownTrackImageUri } from '@/constants/images'
import { colors, fontSize, screenPadding } from '@/constants/tokens'
import { usePlayer } from '@/context/PlayerContext'
import { usePlayerBackground } from '@/hooks/usePlayerBackground'
import { useTrackPlayerFavorite } from '@/hooks/useTrackPlayerFavorite'
import { defaultStyles, utilsStyles } from '@/styles'
import { FontAwesome } from '@expo/vector-icons'
import { Image } from 'expo-image'
import { LinearGradient } from 'expo-linear-gradient'
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

// ─── Module-level constants ──────────────────────────────────────────────────

const FAVORITE_ICON_STYLE = { marginHorizontal: 14 } as const
const PROGRESS_BAR_STYLE = { marginTop: 32 } as const
const CONTROLS_STYLE = { marginTop: 40 } as const
const VOLUME_BAR_STYLE = { marginTop: 'auto', marginBottom: 30 } as const
const REPEAT_TOGGLE_STYLE = { marginBottom: 6 } as const

const PlayerScreen = () => {
  const { player, activeTrack, isLooping, skipToNext, skipToPrevious, toggleLoop } = usePlayer()

  const { top, bottom } = useSafeAreaInsets()
  const { isFavorite, toggleFavorite } = useTrackPlayerFavorite(activeTrack)

  const artworkUri = activeTrack?.artwork ?? unknownTrackImageUri
  const backgroundColors = usePlayerBackground(artworkUri)

  const containerStyle = {
    flex: 1,
    marginTop: top + 70,
    marginBottom: bottom,
  }

  if (!activeTrack) {
    return (
      <View style={[defaultStyles.container, styles.centered]}>
        <ActivityIndicator color={colors.icon} />
      </View>
    )
  }

  return (
    <LinearGradient style={styles.flex} colors={[...backgroundColors]}>
      <View style={styles.overlayContainer}>
        <DismissPlayerSymbol />

        <View style={containerStyle}>
          <View style={styles.artworkImageContainer}>
            <Image
              source={artworkUri}
              style={styles.artworkImage}
              contentFit="cover"
              transition={200}
              priority="high"
            />
          </View>

          <View style={styles.flex}>
            <View style={styles.bottomSection}>
              <View style={styles.titleBlock}>
                <View style={styles.titleRow}>
                  {/* Track title */}
                  <View style={styles.trackTitleContainer}>
                    <MovingText
                      text={activeTrack.title ?? ''}
                      animationThreshold={30}
                      style={styles.trackTitleText}
                    />
                  </View>

                  {/* Favorite button icon */}
                  <FontAwesome
                    name={isFavorite ? 'heart' : 'heart-o'}
                    size={20}
                    color={isFavorite ? colors.primary : colors.icon}
                    style={FAVORITE_ICON_STYLE}
                    onPress={toggleFavorite}
                  />
                </View>

                {/* Track artist */}
                {activeTrack.artist && (
                  <Text numberOfLines={1} style={styles.trackArtistText}>
                    {activeTrack.artist}
                  </Text>
                )}
              </View>

              <PlayerProgressBar style={PROGRESS_BAR_STYLE} player={player} />

              <PlayerControls
                style={CONTROLS_STYLE}
                player={player}
                onSkipToNext={skipToNext}
                onSkipToPrevious={skipToPrevious}
              />
            </View>

            <PlayerVolumeBar style={VOLUME_BAR_STYLE} player={player} />

            <View style={utilsStyles.centeredRow}>
              <PlayerRepeatToggle
                size={30}
                style={REPEAT_TOGGLE_STYLE}
                isLooping={isLooping}
                onToggle={toggleLoop}
              />
            </View>
          </View>
        </View>
      </View>
    </LinearGradient>
  )
}

// ─── Dismiss handle (stable component) ──────────────────────────────────────

const DismissPlayerSymbol = () => {
  const { top } = useSafeAreaInsets()

  return (
    <View style={[styles.dismissContainer, { top: top + 8 }]}>
      <View accessible={false} style={styles.dismissBar} />
    </View>
  )
}

// ─── Styles ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  flex: { flex: 1 },
  centered: { justifyContent: 'center' },
  overlayContainer: {
    ...defaultStyles.container,
    paddingHorizontal: screenPadding.horizontal,
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  artworkImageContainer: {
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.44,
    shadowRadius: 11.0,
    flexDirection: 'row',
    justifyContent: 'center',
    height: '45%',
  },
  artworkImage: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
  },
  bottomSection: {
    marginTop: 'auto',
  },
  titleBlock: {
    height: 60,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  trackTitleContainer: {
    flex: 1,
    overflow: 'hidden',
  },
  trackTitleText: {
    ...defaultStyles.text,
    fontSize: 22,
    fontWeight: '700',
  },
  trackArtistText: {
    ...defaultStyles.text,
    fontSize: fontSize.base,
    opacity: 0.8,
    maxWidth: '90%',
    marginTop: 6,
  },
  dismissContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  dismissBar: {
    width: 50,
    height: 8,
    borderRadius: 8,
    backgroundColor: '#fff',
    opacity: 0.7,
  },
})

export default PlayerScreen