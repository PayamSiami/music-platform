// app/index.js
import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Link, useRouter } from 'expo-router'; // <-- Import Link for navigation
import { Dimensions, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

const FRIENDS_DATA = [
    { id: 1, image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200' },
    { id: 2, image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200' },
    { id: 3, image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200' },
    { id: 4, image: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200' },
];

const CATEGORIES_DATA = [
    { id: 1, title: 'Trends', color: '#C2A370' },
    { id: 2, title: 'Favorite', color: '#D18E6A' },
    { id: 3, title: 'Mix', color: '#C76A61' },
    { id: 4, title: 'Recent', color: '#5B7DB1' },
    { id: 5, title: 'Artists', color: '#8E68D6' },
    { id: 6, title: 'Playlists', color: '#BC5B98' },
];

const ROOMS_DATA = [
    { id: 1, title: 'Childish', subtitle: 'Gambino', image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400' },
    { id: 2, title: 'Violin', subtitle: 'Classical', image: 'https://images.unsplash.com/photo-1612225330812-01a9c6b355ec?w=400' },
    { id: 3, title: 'Classic', subtitle: 'Rock', image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400' },
];

export default function HomeScreen() {

    const router = useRouter(); // 2. Initialize the router

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

                {/* Header */}
                <View style={styles.header}>
                    {/* Wrap the profile button in a Link to navigate to /profile */}
                    <Link href="/profile" asChild>
                        <TouchableOpacity style={styles.profileBtn}

                        >
                            <Feather name="user" size={20} color="#FFF" />
                        </TouchableOpacity>
                    </Link>

                    <View style={styles.searchBar}>
                        <Ionicons name="search" size={18} color="#666" />
                        <Text style={styles.searchText}>What do you want to listen to?</Text>
                    </View>

                    <TouchableOpacity>
                        <Ionicons name="options-outline" size={24} color="#FFF" />
                    </TouchableOpacity>
                </View>

                {/* Mood Mode Banner */}
                <View style={styles.bannerContainer}>
                    <View style={styles.bannerContent}>
                        <View>
                            <Text style={styles.bannerTitle}>Mood mode</Text>
                            <Text style={styles.bannerSubtitle}>Play music as you like</Text>
                        </View>
                        <Image
                            source={{ uri: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=200' }}
                            style={styles.bannerImage}
                        />
                    </View>
                </View>

                {/* Friends Stream Section */}
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Your friends stream to</Text>
                    <Text style={styles.seeMore}>See more</Text>
                </View>

                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
                    {FRIENDS_DATA.map((item) => (
                        <View key={item.id} style={styles.friendCard}>
                            <Image source={{ uri: item.image }} style={styles.friendImage} />
                            <View style={styles.smallAvatarOverlay}>
                                <Image source={{ uri: item.image }} style={styles.smallAvatar} />
                            </View>
                        </View>
                    ))}
                </ScrollView>

                {/* Categories Section */}
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Category</Text>
                    <Text style={styles.seeMore}>Show all</Text>
                </View>

                <View style={styles.categoryGrid}>
                    {CATEGORIES_DATA.map((cat) => (
                        <TouchableOpacity key={cat.id} style={[styles.categoryCard, { backgroundColor: cat.color }]}>
                            <Text style={styles.categoryText}>{cat.title}</Text>
                            <MaterialCommunityIcons name="headphones" size={40} color="rgba(255,255,255,0.3)" style={styles.categoryIcon} />
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Room Section */}
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Room</Text>
                    <Text style={styles.seeMore}>See more</Text>
                </View>

                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
                    {ROOMS_DATA.map((room) => (
                        <View key={room.id} style={styles.roomCard}>
                            <View style={styles.roomImageContainer}>
                                <Image source={{ uri: room.image }} style={styles.roomImage} />
                                <View style={styles.liveBadge}>
                                    <Ionicons name="people" size={12} color="#FFF" />
                                    <Text style={styles.liveText}>12</Text>
                                </View>
                            </View>
                            <View style={styles.roomFooter}>
                                <View>
                                    <Text style={styles.roomTitle}>{room.title}</Text>
                                    <Text style={styles.roomSubtitle}>{room.subtitle}</Text>
                                </View>
                                <TouchableOpacity style={styles.discoverBtn}
                                    onPress={() => router.push('/player')}
                                >
                                    <Text style={styles.discoverText}>Discover</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    ))}
                </ScrollView>

                <View style={{ height: 100 }} />
            </ScrollView>
        </SafeAreaView>
    );
}

// ... Styles from the previous example (Same exact styles)
const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#1E1E24' },
    scrollContent: { paddingHorizontal: 20, paddingTop: 10 },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 },
    profileBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#2E2E38', alignItems: 'center', justifyContent: 'center' },
    searchBar: { flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: '#2E2E38', marginHorizontal: 15, paddingHorizontal: 15, height: 40, borderRadius: 20 },
    searchText: { color: '#666', marginLeft: 10, fontSize: 12 },
    bannerContainer: { backgroundColor: '#D2F181', borderRadius: 20, padding: 20, marginBottom: 25, overflow: 'hidden' },
    bannerContent: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    bannerTitle: { fontSize: 24, fontWeight: 'bold', color: '#1E1E24' },
    bannerSubtitle: { fontSize: 14, color: '#4A5D23', marginTop: 4 },
    bannerImage: { width: 80, height: 80, borderRadius: 40, borderWidth: 2, borderColor: '#FFF' },
    sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
    sectionTitle: { color: '#FFF', fontSize: 18, fontWeight: '600' },
    seeMore: { color: '#888', fontSize: 12 },
    horizontalScroll: { marginBottom: 25, overflow: 'visible' },
    friendCard: { marginRight: 15, alignItems: 'center' },
    friendImage: { width: 80, height: 110, borderRadius: 15, marginBottom: 5 },
    smallAvatarOverlay: { position: 'absolute', bottom: -5, backgroundColor: '#1E1E24', padding: 2, borderRadius: 20 },
    smallAvatar: { width: 25, height: 25, borderRadius: 12.5 },
    categoryGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginBottom: 25 },
    categoryCard: { width: (width - 55) / 2, height: 70, borderRadius: 15, padding: 15, marginBottom: 15, justifyContent: 'center', position: 'relative', overflow: 'hidden' },
    categoryText: { color: '#FFF', fontWeight: 'bold', fontSize: 16, zIndex: 2 },
    categoryIcon: { position: 'absolute', right: -10, bottom: -10, transform: [{ rotate: '-30deg' }] },
    roomCard: { width: 200, backgroundColor: '#2E2E38', borderRadius: 15, marginRight: 15, overflow: 'hidden' },
    roomImageContainer: { height: 120, width: '100%' },
    roomImage: { width: '100%', height: '100%' },
    liveBadge: { position: 'absolute', top: 10, right: 10, backgroundColor: 'rgba(0,0,0,0.6)', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 10 },
    liveText: { color: '#FFF', fontSize: 10, marginLeft: 4 },
    roomFooter: { padding: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    roomTitle: { color: '#FFF', fontWeight: 'bold', fontSize: 14 },
    roomSubtitle: { color: '#888', fontSize: 12 },
    discoverBtn: { backgroundColor: '#6B38D4', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8 },
    discoverText: { color: '#FFF', fontSize: 10, fontWeight: 'bold' },
});