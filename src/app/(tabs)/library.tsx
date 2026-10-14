import { Feather } from '@expo/vector-icons';
import { useState } from 'react';
import {
    FlatList,
    Image,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// --- Mock Data ---
const SONGS_DATA = [
  {
    id: '1',
    title: 'my future',
    artist: 'Billie Eilish',
    image: 'https://images.unsplash.com/photo-1493225457124-a1a2a5f5646f?w=200',
  },
  {
    id: '2',
    title: 'Your Power',
    artist: 'Billie Eilish',
    image: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=200',
  },
  {
    id: '3',
    title: 'bellyache',
    artist: 'Billie Eilish',
    image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=200', // Changed for variety
  },
  {
    id: '4',
    title: 'everything i wanted',
    artist: 'Billie Eilish',
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=200',
  },
  {
    id: '5',
    title: 'lovely (with Khalid)',
    artist: 'Billie Eilish, Khalid',
    image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200',
  },
  {
    id: '6',
    title: 'No Time To Die',
    artist: 'Billie Eilish',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200',
  },
];

export default function LibraryScreen() {
  // Track which song is currently "playing" (active)
  const [activeId, setActiveId] = useState('3'); // '3' is bellyache by default

  const renderItem = ({ item }: { item: typeof SONGS_DATA[0] }) => {
    const isActive = item.id === activeId;

    return (
      <TouchableOpacity
        style={[styles.songItem, isActive && styles.songItemActive]}
        onPress={() => setActiveId(item.id)}
        activeOpacity={0.7}
      >
        {/* Album Art */}
        <Image source={{ uri: item.image }} style={styles.albumArt} />

        {/* Song Info */}
        <View style={styles.songInfo}>
          <Text style={styles.songTitle}>{item.title}</Text>
          <Text style={styles.songArtist}>{item.artist}</Text>
        </View>

        {/* Actions (Play + Waveform) */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity style={styles.actionBtn}>
            <Feather
              name={isActive ? 'pause-circle' : 'play-circle'}
              size={26}
              color={isActive ? '#FFF' : '#888'}
            />
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionBtn}>
            <Feather
              name="bar-chart-2"
              size={22}
              color={isActive ? '#8C7AFF' : '#666'}
            />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0A0A0F" />

      <SafeAreaView style={styles.safeArea} edges={['top']}>

        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.headerBtn}>
            <Feather name="user" size={20} color="#FFF" />
          </TouchableOpacity>

          <View style={styles.searchBar}>
            <TextInput
              placeholder="Search"
              placeholderTextColor="#555"
              style={styles.searchInput}
            />
          </View>

          <TouchableOpacity style={styles.headerBtn}>
            <Feather name="mic" size={20} color="#FFF" />
          </TouchableOpacity>
        </View>

        {/* Section Title */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Great title</Text>
          <TouchableOpacity>
            <Text style={styles.sortByText}>sort by</Text>
          </TouchableOpacity>
        </View>

        {/* Song List */}
        <FlatList
          data={SONGS_DATA}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />

      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A0F', // Very dark background
  },
  safeArea: {
    flex: 1,
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    gap: 15,
  },
  headerBtn: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: '#1A1A24',
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchBar: {
    flex: 1,
    height: 45,
    backgroundColor: '#1A1A24',
    borderRadius: 22.5,
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
  searchInput: {
    color: '#FFF',
    fontSize: 14,
  },

  // Section Title
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 10,
    marginBottom: 20,
  },
  sectionTitle: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  sortByText: {
    color: '#8C7AFF',
    fontSize: 13,
    fontWeight: '600',
  },

  // List
  listContent: {
    paddingHorizontal: 15,
    paddingBottom: 120, // Space for the bottom tab bar
  },
  songItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 16,
    marginBottom: 8,
  },
  songItemActive: {
    backgroundColor: '#2A2A50', // Purple-tinted dark background for active item
  },
  albumArt: {
    width: 55,
    height: 55,
    borderRadius: 12,
    marginRight: 15,
  },
  songInfo: {
    flex: 1,
  },
  songTitle: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  songArtist: {
    color: '#777',
    fontSize: 13,
  },
  actionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  actionBtn: {
    padding: 5,
  },
});