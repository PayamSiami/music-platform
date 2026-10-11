import { colors } from '@/constants/tokens'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { useAudioPlayer } from 'expo-audio'
import { ComponentProps, useCallback } from 'react'

type IconProps = Omit<ComponentProps<typeof MaterialCommunityIcons>, 'name'>

type PlayerRepeatToggleProps = IconProps & {
    player: ReturnType<typeof useAudioPlayer>
    isLooping: boolean
    onToggle: () => void
}

export const PlayerRepeatToggle = ({
    player,
    isLooping,
    onToggle,
    ...iconProps
}: PlayerRepeatToggleProps) => {
    const toggleRepeatMode = useCallback(() => {
        player.loop = !player.loop
        onToggle()
    }, [player, onToggle])

    return (
        <MaterialCommunityIcons
            name={isLooping ? 'repeat-once' : 'repeat-off'}
            onPress={toggleRepeatMode}
            color={colors.icon}
            {...iconProps}
        />
    )
}