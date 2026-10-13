import { StackScreenWithSearchBar } from '@/constants/layout'
import { defaultStyles } from '@/styles'
import { Stack } from 'expo-router'
import { View } from 'react-native'

const PlaylistsScreenLayout = () => {
    return (
        <View style={defaultStyles.container}>
            <Stack>
                <Stack.Screen
                    name="index"
                    options={{
                        ...StackScreenWithSearchBar,
                        headerTitle: 'Playlists',
                    }}
                />
                <Stack.Screen name="[name]" options={{ title: '', headerBackVisible: true }} />
            </Stack>
        </View>
    )
}

export default PlaylistsScreenLayout
