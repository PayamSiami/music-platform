import { colors } from '@/constants/tokens'
import { PlayerProvider } from '@/context/PlayerContext'
import { setAudioModeAsync } from 'expo-audio'
import { SplashScreen, Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { useCallback, useEffect } from 'react'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { SafeAreaProvider } from 'react-native-safe-area-context'

SplashScreen.preventAutoHideAsync()

const App = () => {
  const handleAudioLoaded = useCallback(() => {
    SplashScreen.hideAsync()
  }, [])

  useEffect(() => {
    // Configure audio session for background playback.
    // On Android, setActiveForLockScreen must be called on the player later
    // for sustained background playback; otherwise audio stops after ~3 minutes.
    setAudioModeAsync({
      playsInSilentMode: true,
      shouldPlayInBackground: true,
      interruptionMode: 'doNotMix', // Required for lock screen controls
    }).then(handleAudioLoaded)
  }, [handleAudioLoaded])

  return (
    <SafeAreaProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <PlayerProvider>
          <RootNavigation />
        </PlayerProvider>
        <StatusBar style="auto" />
      </GestureHandlerRootView>
    </SafeAreaProvider>
  )
}

const RootNavigation = () => {
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen
        name="player"
        options={{
          presentation: 'card',
          gestureEnabled: true,
          gestureDirection: 'vertical',
          animationDuration: 400,
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="(modals)/addToPlaylist"
        options={{
          presentation: 'modal',
          headerStyle: {
            backgroundColor: colors.background,
          },
          headerTitle: 'Add to playlist',
          headerTitleStyle: {
            color: colors.text,
          },
        }}
      />
    </Stack>
  )
}

export default App