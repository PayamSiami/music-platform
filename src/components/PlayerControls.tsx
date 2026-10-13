import { colors } from '@/constants/tokens'
import { FontAwesome6 } from '@expo/vector-icons'
import { useAudioPlayer, useAudioPlayerStatus } from 'expo-audio'
import { type ReactNode, useCallback, useState } from 'react'
import { StyleSheet, TouchableOpacity, View, ViewStyle, type StyleProp } from 'react-native'
import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated'

// ─── Module-level constants ──────────────────────────────────────────────────

const PRESS_SCALE = 0.88
const PRESS_IN_DURATION = 100
const PRESS_OUT_DURATION = 120
const HIT_SLOP = 12

type PlayerControlsProps = {
	style?: ViewStyle
	player: ReturnType<typeof useAudioPlayer>
	onSkipToNext?: () => void
	onSkipToPrevious?: () => void
}

type PlayPauseButtonProps = {
	style?: StyleProp<ViewStyle>
	iconSize?: number
	player: ReturnType<typeof useAudioPlayer>
}

type SkipButtonProps = {
	style?: StyleProp<ViewStyle>
	iconSize?: number
}

type SkipToNextButtonProps = SkipButtonProps & {
	onSkipToNext?: () => void
}

type SkipToPreviousButtonProps = SkipButtonProps & {
	onSkipToPrevious?: () => void
}

type ControlButtonProps = {
	onPress?: () => void
	style?: StyleProp<ViewStyle>
	children: ReactNode
}

// ─── Stable sub-components ───────────────────────────────────────────────────

const ControlButton = ({ onPress, style, children }: ControlButtonProps) => {
	const [isPressed, setIsPressed] = useState(false)

	const animatedStyle = useAnimatedStyle(() => ({
		transform: [
			{
				scale: withTiming(isPressed ? PRESS_SCALE : 1, {
					duration: isPressed ? PRESS_IN_DURATION : PRESS_OUT_DURATION,
				}),
			},
		],
	}))

	const handlePressIn = useCallback(() => setIsPressed(true), [])
	const handlePressOut = useCallback(() => setIsPressed(false), [])

	return (
		<TouchableOpacity
			activeOpacity={0.85}
			hitSlop={HIT_SLOP}
			onPress={onPress}
			onPressIn={handlePressIn}
			onPressOut={handlePressOut}
		>
			<Animated.View style={[styles.controlButton, style, animatedStyle]}>
				{children}
			</Animated.View>
		</TouchableOpacity>
	)
}

export const PlayerControls = ({ style, player, onSkipToNext, onSkipToPrevious }: PlayerControlsProps) => {
	return (
		<View style={[styles.container, style]}>
			<View style={styles.row}>
				<SkipToPreviousButton onSkipToPrevious={onSkipToPrevious} />

				<PlayPauseButton player={player} />

				<SkipToNextButton onSkipToNext={onSkipToNext} />
			</View>
		</View>
	)
}

export const PlayPauseButton = ({ style, iconSize = 48, player }: PlayPauseButtonProps) => {
	const status = useAudioPlayerStatus(player)

	const handlePress = useCallback(() => {
		if (status.playing) {
			player.pause()
		} else {
			player.play()
		}
	}, [player, status.playing])

	return (
		<ControlButton onPress={handlePress} style={[{ height: iconSize }, style]}>
			<FontAwesome6 name={status.playing ? 'pause' : 'play'} size={iconSize} color={colors.text} />
		</ControlButton>
	)
}

export const SkipToNextButton = ({ style, iconSize = 30, onSkipToNext }: SkipToNextButtonProps) => {
	return (
		<ControlButton onPress={onSkipToNext} style={style}>
			<FontAwesome6 name="forward" size={iconSize} color={colors.text} />
		</ControlButton>
	)
}

export const SkipToPreviousButton = ({ style, iconSize = 30, onSkipToPrevious }: SkipToPreviousButtonProps) => {
	return (
		<ControlButton onPress={onSkipToPrevious} style={style}>
			<FontAwesome6 name={'backward'} size={iconSize} color={colors.text} />
		</ControlButton>
	)
}

const styles = StyleSheet.create({
	container: {
		width: '100%',
	},
	row: {
		flexDirection: 'row',
		justifyContent: 'space-evenly',
		alignItems: 'center',
	},
	controlButton: {
		alignItems: 'center',
		justifyContent: 'center',
	},
})
