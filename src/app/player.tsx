import { MovingText } from '@/components/MovingText'
import { PlayerControls } from '@/components/PlayerControls'
import { PlayerProgressBar } from '@/components/PlayerProgressbar'
import { PlayerRepeatToggle } from '@/components/PlayerRepeatToggle'
import { PlayerVolumeBar } from '@/components/PlayerVolumeBar'
import { unknownTrackImageUri } from '@/constants/images'
import { colors, fontSize, screenPadding } from '@/constants/tokens'
import { useTrackPlayerFavorite } from '@/hooks/useTrackPlayerFavorite'
import { useLibraryStore } from '@/store/library'
import { defaultStyles, utilsStyles } from '@/styles'
import { FontAwesome } from '@expo/vector-icons'
import { setAudioModeAsync, useAudioPlayer, useAudioPlayerStatus } from 'expo-audio'
import { LinearGradient } from 'expo-linear-gradient'
import { useCallback, useEffect, useState } from 'react'
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native'
import FastImage from 'react-native-fast-image'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

const PlayerScreen = () => {
    const tracks = useLibraryStore((state) => state.tracks)
    const [activeIndex, setActiveIndex] = useState(0)
    const activeTrack = tracks[activeIndex] ?? null

    const player = useAudioPlayer(
        activeTrack ? { uri: activeTrack.url } : undefined
    )
    const status = useAudioPlayerStatus(player)

    // const { imageColors } = usePlayerBackground(
    //     activeTrack?.artwork ?? unknownTrackImageUri
    // )

    const { top, bottom } = useSafeAreaInsets()

    const { isFavorite, toggleFavorite } = useTrackPlayerFavorite(player, activeTrack)

    // Configure background playback once on mount.
    useEffect(() => {
        setAudioModeAsync({
            playsInSilentMode: true,
            shouldPlayInBackground: true,
            interruptionMode: 'doNotMix',
        })
    }, [])

    // Keep lock screen metadata in sync when the active track changes.
    // On Android this MUST be called, otherwise playback stops after ~3 minutes
    // in the background.
    useEffect(() => {
        if (!activeTrack) return

        player.setActiveForLockScreen(true, {
            title: activeTrack.title,
            artist: activeTrack.artist,
            artworkUrl: activeTrack.artwork,
        })
    }, [activeTrack, player])

    // Swap the source whenever the active index changes.
    useEffect(() => {
        if (!activeTrack) return

        player.replace({ uri: activeTrack.url })
        player.play()
    }, [activeIndex, activeTrack, player])

    const skipToNext = useCallback(() => {
        if (tracks.length === 0) return
        setActiveIndex((prev) => (prev + 1) % tracks.length)
    }, [tracks.length])

    const skipToPrevious = useCallback(() => {
        if (tracks.length === 0) return
        setActiveIndex((prev) => (prev - 1 + tracks.length) % tracks.length)
    }, [tracks.length])

    if (!activeTrack) {
        return (
            <View style={[defaultStyles.container, { justifyContent: 'center' }]}>
                <ActivityIndicator color={colors.icon} />
            </View>
        )
    }

    return (
        <LinearGradient
            style={{ flex: 1 }}
            // colors={
            //     imageColors
            //         ? [imageColors.background, imageColors.primary]
            //         : [colors.background, colors.background]
            // }
            colors={[colors.background, colors.background]}
        >
            <View style={styles.overlayContainer}>
                <DismissPlayerSymbol />

                <View style={{ flex: 1, marginTop: top + 70, marginBottom: bottom }}>
                    <View style={styles.artworkImageContainer}>
                        <FastImage
                            source={{
                                uri: activeTrack.artwork ?? unknownTrackImageUri,
                                priority: FastImage.priority.high,
                            }}
                            resizeMode="cover"
                            style={styles.artworkImage}
                        />
                    </View>

                    <View style={{ flex: 1 }}>
                        <View style={{ marginTop: 'auto' }}>
                            <View style={{ height: 60 }}>
                                <View
                                    style={{
                                        flexDirection: 'row',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                    }}
                                >
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
                                        style={{ marginHorizontal: 14 }}
                                        onPress={toggleFavorite}
                                    />
                                </View>

                                {/* Track artist */}
                                {activeTrack.artist && (
                                    <Text
                                        numberOfLines={1}
                                        style={[styles.trackArtistText, { marginTop: 6 }]}
                                    >
                                        {activeTrack.artist}
                                    </Text>
                                )}
                            </View>

                            <PlayerProgressBar style={{ marginTop: 32 }} player={player} />

                            <PlayerControls
                                style={{ marginTop: 40 }}
                                player={player}
                                onSkipToNext={skipToNext}
                                onSkipToPrevious={skipToPrevious}
                            />
                        </View>

                        <PlayerVolumeBar
                            style={{ marginTop: 'auto', marginBottom: 30 }}
                            player={player}
                        />

                        <View style={utilsStyles.centeredRow}>
                            <PlayerRepeatToggle
                                size={30}
                                style={{ marginBottom: 6 }}
                                player={player}
                                isLooping={status.isBuffering === false && player.loop}
                                onToggle={() => {
                                    player.loop = !player.loop
                                }}
                            />
                        </View>
                    </View>
                </View>
            </View>
        </LinearGradient>
    )
}

const DismissPlayerSymbol = () => {
    const { top } = useSafeAreaInsets()

    return (
        <View
            style={{
                position: 'absolute',
                top: top + 8,
                left: 0,
                right: 0,
                flexDirection: 'row',
                justifyContent: 'center',
            }}
        >
            <View
                accessible={false}
                style={{
                    width: 50,
                    height: 8,
                    borderRadius: 8,
                    backgroundColor: '#fff',
                    opacity: 0.7,
                }}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    overlayContainer: {
        ...defaultStyles.container,
        paddingHorizontal: screenPadding.horizontal,
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    artworkImageContainer: {
        shadowOffset: {
            width: 0,
            height: 8,
        },
        shadowOpacity: 0.44,
        shadowRadius: 11.0,
        flexDirection: 'row',
        justifyContent: 'center',
        height: '45%',
    },
    artworkImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
        borderRadius: 12,
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
    },
})

export default PlayerScreen