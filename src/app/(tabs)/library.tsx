import type { MusicDetail } from '@/api/divacast-api';
import { useApiStore, useMusic } from '@/store/api';
import { Feather } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import {
    FlatList,
    Image,
    RefreshControl,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function LibraryScreen() {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const music = useMusic();
  console.log(music);
  const fetchMusic = useApiStore((state) => state.fetchMusic);
  console.log(fetchMusic);

  useEffect(() => {
    void fetchMusic({ limit: 50, sort: 'title', order: 'asc' });
  }, [fetchMusic]);

  const filteredMusic = music.items.filter((track) =>
    `${track.title} ${track.singer.username}`.toLowerCase().includes(search.trim().toLowerCase()),
  );

  const renderItem = ({ item }: { item: MusicDetail }) => {
    const isActive = item.id === activeId;

    return (
      <TouchableOpacity
        style={[styles.songItem, isActive && styles.songItemActive]}
        onPress={() => setActiveId(isActive ? null : item.id)}
        activeOpacity={0.7}
      >
        {item.albumArtUrl ? (
          <Image source={{ uri: item.albumArtUrl }} style={styles.albumArt} />
        ) : (
          <View style={[styles.albumArt, styles.albumArtPlaceholder]}>
            <Feather name="music" size={22} color="#888" />
          </View>
        )}

        <View style={styles.songInfo}>
          <Text style={styles.songTitle}>{item.title}</Text>
          <Text style={styles.songArtist}>{item.singer.username}</Text>
        </View>

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
              placeholder="Search music"
              placeholderTextColor="#555"
              style={styles.searchInput}
              value={search}
              onChangeText={setSearch}
            />
          </View>

          <TouchableOpacity style={styles.headerBtn}>
            <Feather name="mic" size={20} color="#FFF" />
          </TouchableOpacity>
        </View>

        {/* Section Title */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Music</Text>
          <TouchableOpacity>
            <Text style={styles.sortByText}>sort by</Text>
          </TouchableOpacity>
        </View>

        {/* Song List */}
        <FlatList
          data={filteredMusic}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={music.status === 'loading'}
              onRefresh={() => void fetchMusic({ limit: 50, sort: 'title', order: 'asc' })}
              tintColor="#FFF"
            />
          }
          ListHeaderComponent={music.error ? (
            <Text style={styles.errorText}>{music.error}</Text>
          ) : null}
          ListEmptyComponent={
            music.status === 'loading' ? (
              <Text style={styles.messageText}>Loading music...</Text>
            ) : music.status === 'error' ? (
              <TouchableOpacity onPress={() => void fetchMusic()}>
                <Text style={styles.messageText}>Could not load music. Tap to retry.</Text>
              </TouchableOpacity>
            ) : (
              <Text style={styles.messageText}>
                {search ? 'No music matches your search.' : 'No music available yet.'}
              </Text>
            )
          }
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
  albumArtPlaceholder: {
    backgroundColor: '#1A1A24',
    justifyContent: 'center',
    alignItems: 'center',
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
  errorText: {
    color: '#FF8A8A',
    fontSize: 13,
    paddingHorizontal: 10,
    paddingBottom: 12,
  },
  messageText: {
    color: '#888',
    fontSize: 14,
    textAlign: 'center',
    paddingVertical: 24,
  },
});