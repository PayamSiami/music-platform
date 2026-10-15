import { Feather } from '@expo/vector-icons';
import AntDesign from '@expo/vector-icons/AntDesign';
import EvilIcons from '@expo/vector-icons/EvilIcons';
import { Tabs } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function RootLayout() {
  // ✅ Get the device's safe area insets (bottom nav bar height on Android, home indicator on iOS)
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#18181F',
          borderTopWidth: 0,

          // ✅ Height = base height + bottom safe area
          height: 60 + insets.bottom,

          // ✅ Padding bottom = space for icons + safe area
          paddingBottom: 10 + insets.bottom,
          paddingTop: 10,

          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          position: 'absolute',

          // ✅ Push the tab bar above the phone's nav buttons
          bottom: 0, // Keep at bottom of screen
        },
        tabBarActiveTintColor: '#FFF',
        tabBarInactiveTintColor: '#666',
        tabBarShowLabel: false,
        tabBarItemStyle: {
          justifyContent: 'center',
        },
      }}
    >
      {/* Home */}
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ color }) => (
            <AntDesign name="home" size={24} color={color} />
          ),
        }}
      />

      {/* Profile */}
      <Tabs.Screen
        name="search"
        options={{
          tabBarIcon: ({ color }) => (
            <EvilIcons name="search" size={24} color={color} />
          ),
        }}
      />

      {/* Library */}
      <Tabs.Screen
        name="library"
        options={{
          tabBarIcon: ({ color }) => (
            <Feather name="list" size={24} color={color} />
          ),
        }}
      />

      {/* ✅ Hide the auto-generated player tab */}
      <Tabs.Screen
        name="player"
        options={{ href: null }}
      />
    </Tabs>
  );
}