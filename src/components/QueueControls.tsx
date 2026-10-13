import { colors } from '@/constants/tokens'
import { usePlayer } from '@/context/PlayerContext'
import { Track } from '@/helpers/types'
import { defaultStyles } from '@/styles'
import { Ionicons } from '@expo/vector-icons'
import { StyleSheet, Text, View, ViewProps } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'

type QueueControlsProps = {
    tracks: Track[]
} & ViewProps

export const QueueControls = ({ tracks, style, ...viewProps }: QueueControlsProps) => {
    const { playQueue } = usePlayer()

    const handlePlay = () => {
        playQueue(tracks)
    }

    const handleShufflePlay = () => {
        const shuffledTracks = [...tracks].sort(() => Math.random() - 0.5)
        playQueue(shuffledTracks)
    }

    return (
        <View style={[{ flexDirection: 'row', columnGap: 16 }, style]} {...viewProps}>
            {/* Play button */}
            <View style={{ flex: 1 }}>
                <TouchableOpacity onPress={handlePlay} activeOpacity={0.8} style={styles.button}>
                    <Ionicons name="play" size={22} color={colors.primary} />

                    <Text style={styles.buttonText}>Play</Text>
                </TouchableOpacity>
            </View>

            {/* Shuffle button */}
            <View style={{ flex: 1 }}>
                <TouchableOpacity onPress={handleShufflePlay} activeOpacity={0.8} style={styles.button}>
                    <Ionicons name={'shuffle-sharp'} size={24} color={colors.primary} />

                    <Text style={styles.buttonText}>Shuffle</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    button: {
        padding: 12,
        backgroundColor: 'rgba(47, 47, 47, 0.5)',
        borderRadius: 8,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        columnGap: 8,
    },
    buttonText: {
        ...defaultStyles.text,
        color: colors.primary,
        fontWeight: '600',
        fontSize: 18,
        textAlign: 'center',
    },
})