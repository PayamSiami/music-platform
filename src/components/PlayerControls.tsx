import { colors } from '@/constants/tokens'
import { FontAwesome6 } from '@expo/vector-icons'
import { useAudioPlayer, useAudioPlayerStatus } from 'expo-audio'
import { StyleSheet, TouchableOpacity, View, ViewStyle } from 'react-native'

type PlayerControlsProps = {
	style?: ViewStyle
	player: ReturnType<typeof useAudioPlayer>
	onSkipToNext?: () => void
	onSkipToPrevious?: () => void
}

type PlayerButtonProps = {
	style?: ViewStyle
	iconSize?: number
	player: ReturnType<typeof useAudioPlayer>
	onSkipToNext?: () => void
	onSkipToPrevious?: () => void
}

export const PlayerControls = ({ style, player, onSkipToNext, onSkipToPrevious }: PlayerControlsProps) => {
	return (
		<View style={[styles.container, style]}>
			<View style={styles.row}>
				<SkipToPreviousButton player={player} onSkipToPrevious={onSkipToPrevious} />

				<PlayPauseButton player={player} />

				<SkipToNextButton player={player} onSkipToNext={onSkipToNext} />
			</View>
		</View>
	)
}

export const PlayPauseButton = ({ style, iconSize = 48, player }: PlayerButtonProps) => {
	const status = useAudioPlayerStatus(player)

	return (
		<View style={[{ height: iconSize }, style]}>
			<TouchableOpacity
				activeOpacity={0.85}
				onPress={status.playing ? player.pause : player.play}
			>
				<FontAwesome6 name={status.playing ? 'pause' : 'play'} size={iconSize} color={colors.text} />
			</TouchableOpacity>
		</View>
	)
}

export const SkipToNextButton = ({ iconSize = 30, onSkipToNext }: PlayerButtonProps) => {
	return (
		<TouchableOpacity activeOpacity={0.7} onPress={onSkipToNext}>
			<FontAwesome6 name="forward" size={iconSize} color={colors.text} />
		</TouchableOpacity>
	)
}

export const SkipToPreviousButton = ({ iconSize = 30, onSkipToPrevious }: PlayerButtonProps) => {
	return (
		<TouchableOpacity activeOpacity={0.7} onPress={onSkipToPrevious}>
			<FontAwesome6 name={'backward'} size={iconSize} color={colors.text} />
		</TouchableOpacity>
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
})