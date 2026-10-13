import { colors } from '@/constants/tokens'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { ComponentProps, useCallback } from 'react'

type IconProps = Omit<ComponentProps<typeof MaterialCommunityIcons>, 'name'>

type PlayerRepeatToggleProps = IconProps & {
    isLooping: boolean
    onToggle: () => void
}

export const PlayerRepeatToggle = ({
    isLooping,
    onToggle,
    ...iconProps
}: PlayerRepeatToggleProps) => {
    const toggleRepeatMode = useCallback(() => {
        onToggle()
    }, [onToggle])

    return (
        <MaterialCommunityIcons
            name={isLooping ? 'repeat-once' : 'repeat-off'}
            onPress={toggleRepeatMode}
            color={colors.icon}
            {...iconProps}
        />
    )
}
