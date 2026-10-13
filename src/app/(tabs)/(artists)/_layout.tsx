// src/app/(tabs)/(artists)/_layout.tsx
import { Stack } from 'expo-router'

export default function ArtistsScreenLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: 'Artists' }} />
      <Stack.Screen name="[name]" options={{ title: '', headerBackVisible: true }} />
    </Stack>
  )
}