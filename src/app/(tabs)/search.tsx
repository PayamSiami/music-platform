import { Feather } from '@expo/vector-icons';
import { useMemo, useRef, useState } from 'react';
import {
  Image,
  Keyboard,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// --- Types ---
type Filter = 'Release' | 'Room' | 'Playlist' | 'Artists';

// --- Constants ---
const FILTERS: Filter[] = ['Release', 'Room', 'Playlist', 'Artists'];

const ALL_ARTISTS = [
  'Billie Eilish',
  'Billy Joel',
  'Billie Marten',
  'The Weeknd',
  'Taylor Swift',
  'Drake',
  'Ariana Grande',
];

const RECENT_SEARCHES = [
  'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=200',
  'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200',
  'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=200',
];

const MOST_SEARCHED = [
  'https://images.unsplash.com/photo-1493225457124-a1a2a5f5646f?w=200',
  'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=200',
  'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=200',
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200',
];

const STREAM_SEARCHES = [
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200',
  'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=200',
];

export default function SearchScreen() {
  const [searchQuery, setSearchQuery] = useState('Billie');
  const [activeFilter, setActiveFilter] = useState<Filter>('Release');
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<TextInput>(null);

  // ✅ Functional suggestions — filter artists based on query
  const suggestions = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return [];
    return ALL_ARTISTS.filter((artist) =>
      artist.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  const clearSearch = () => {
    setSearchQuery('');
    inputRef.current?.focus();
  };

  const selectSuggestion = (name: string) => {
    setSearchQuery(name);
    Keyboard.dismiss();
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1E1E24" />

      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled" // ✅ Tapping suggestions works while keyboard is open
        >
          {/* Header */}
          <Text style={styles.headerTitle}>Search</Text>

          {/* Search Bar */}
          <View style={[styles.searchBar, isFocused && styles.searchBarFocused]}>
            <Feather name="search" size={18} color="#666" />
            <TextInput
              ref={inputRef}
              style={styles.searchInput}
              value={searchQuery}
              onChangeText={setSearchQuery}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder="Search"
              placeholderTextColor="#666"
              returnKeyType="search"
              autoCorrect={false}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={clearSearch} hitSlop={10}>
                <Feather name="x-circle" size={18} color="#666" />
              </TouchableOpacity>
            )}
            <TouchableOpacity hitSlop={10}>
              <Feather name="mic" size={20} color="#FFF" />
            </TouchableOpacity>
          </View>

          {/* Suggestions Dropdown */}
          {suggestions.length > 0 && (
            <View style={styles.suggestionsContainer}>
              {suggestions.map((artist, index) => (
                <TouchableOpacity
                  key={artist}
                  style={[
                    styles.suggestionItem,
                    index < suggestions.length - 1 && styles.suggestionItemBorder,
                  ]}
                  onPress={() => selectSuggestion(artist)}
                >
                  <Feather name="search" size={14} color="#666" />
                  <Text style={styles.suggestionText}>{artist}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {/* Filter Section */}
          <View style={styles.filterHeader}>
            <Text style={styles.sectionTitle}>Filter</Text>
            <TouchableOpacity hitSlop={10}>
              <Feather name="filter" size={18} color="#FFF" />
            </TouchableOpacity>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.filtersRow}
            contentContainerStyle={styles.filtersRowContent}
          >
            {FILTERS.map((filter) => {
              const isActive = filter === activeFilter;
              return (
                <TouchableOpacity
                  key={filter}
                  style={[styles.filterChip, isActive && styles.filterChipActive]}
                  onPress={() => setActiveFilter(filter)}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.filterChipText,
                      isActive && styles.filterChipTextActive,
                    ]}
                  >
                    {filter}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {/* Recent Search */}
          <SectionHeader title="recent search" />
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.horizontalScroll}
            contentContainerStyle={styles.horizontalScrollContent}
          >
            {RECENT_SEARCHES.map((image, index) => (
              <TouchableOpacity key={`recent-${index}`} activeOpacity={0.8}>
                <Image source={{ uri: image }} style={styles.roundImage} />
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Most Search */}
          <SectionHeader title="most search" />
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.horizontalScroll}
            contentContainerStyle={styles.horizontalScrollContent}
          >
            {MOST_SEARCHED.map((image, index) => (
              <TouchableOpacity key={`most-${index}`} activeOpacity={0.8}>
                <Image source={{ uri: image }} style={styles.squareImage} />
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Stream Search */}
          <SectionHeader title="stream search" />
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.horizontalScroll}
            contentContainerStyle={styles.horizontalScrollContent}
          >
            {STREAM_SEARCHES.map((image, index) => (
              <TouchableOpacity key={`stream-${index}`} activeOpacity={0.8}>
                <Image source={{ uri: image }} style={styles.squareImage} />
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Bottom spacer for tab bar */}
          <View style={{ height: 120 }} />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

// ✅ Reusable section header (DRY principle)
function SectionHeader({ title }: { title: string }) {
  return (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <TouchableOpacity hitSlop={10}>
        <Text style={styles.seeMore}>see more</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E1E24',
  },
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 10,
  },

  // Header
  headerTitle: {
    color: '#FFF',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    letterSpacing: 0.3,
  },

  // Search Bar
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2A2A35',
    borderRadius: 15,
    paddingHorizontal: 15,
    height: 50,
    marginBottom: 8,
    gap: 10,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  searchBarFocused: {
    borderColor: '#6B38D4', // Purple border on focus
  },
  searchInput: {
    flex: 1,
    color: '#FFF',
    fontSize: 15,
    paddingVertical: 0,
  },

  // Suggestions
  suggestionsContainer: {
    backgroundColor: '#2A2A35',
    borderRadius: 15,
    marginBottom: 25,
    overflow: 'hidden',
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 15,
    paddingVertical: 14,
  },
  suggestionItemBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#3A3A45',
  },
  suggestionText: {
    color: '#FFF',
    fontSize: 14,
  },

  // Filter
  filterHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  filtersRow: {
    marginBottom: 25,
    marginHorizontal: -20, // ✅ Full-bleed horizontal scroll
  },
  filtersRowContent: {
    paddingHorizontal: 20,
  },
  filterChip: {
    backgroundColor: '#2A2A35',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 10,
  },
  filterChipActive: {
    backgroundColor: '#6B38D4',
  },
  filterChipText: {
    color: '#888',
    fontSize: 13,
    fontWeight: '600',
  },
  filterChipTextActive: {
    color: '#FFF',
  },

  // Sections
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  seeMore: {
    color: '#8C7AFF',
    fontSize: 12,
    fontWeight: '600',
  },

  // Horizontal scrolls
  horizontalScroll: {
    marginBottom: 25,
    marginHorizontal: -20, // ✅ Full-bleed
  },
  horizontalScrollContent: {
    paddingHorizontal: 20,
  },
  roundImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 12,
    backgroundColor: '#2A2A35',
  },
  squareImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
    marginRight: 12,
    backgroundColor: '#2A2A35',
  },
});