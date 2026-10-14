// app/_layout.js
import { useAuthSession } from '@/hooks/useAuthSession';
import { Stack } from 'expo-router';

export default function RootLayout() {
  useAuthSession();

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="player" />
      <Stack.Screen name="login" options={{ animation: 'fade' }} />
    </Stack>
  );
}