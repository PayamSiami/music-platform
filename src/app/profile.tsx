// app/profile.tsx
import { useApiStore } from '@/store/api';
import { useAuthStore } from '@/store/auth';
import { useLibraryStore } from '@/store/library';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useRef } from 'react';
import {
    Alert,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    type ScrollView as ScrollViewType,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// --- Constants ---
const MOCK_AVATAR_URI = 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400';
const HEADER_BG = 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800';

const MOCK_USER = {
    name: 'Jan Walters',
    handle: '@j.walters',
    bio: 'In a world of worriers, be the warrior',
    stats: { playlists: 86, rooms: 17, followers: '20K' },
};

const PLAYLISTS = [
    { id: 1, image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200' },
    { id: 2, image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=200' },
    { id: 3, image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200' },
    { id: 4, image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200' },
    { id: 5, image: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=200' },
];

const ROOMS = [
    { id: 1, image: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=200' },
    { id: 2, image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=200' },
    { id: 3, image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200' },
    { id: 4, image: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200' },
];

export default function ProfileScreen() {
    const router = useRouter();
    const playlistsRef = useRef<ScrollViewType>(null);
    const roomsRef = useRef<ScrollViewType>(null);

    // --- User Data (with graceful fallbacks) ---
    const user = useApiStore((state) => state.user?.data);
    const resetApi = useApiStore((state) => state.reset);
    const signOut = useAuthStore((state) => state.signOut);
    const resetLibrary = useLibraryStore((state) => state.resetLibrary);

    const avatarUri = user?.profilePictureUrl ?? MOCK_AVATAR_URI;
    const userName = user?.username ?? MOCK_USER.name;
    const userHandle = user?.username ? `@${user.username.toLowerCase()}` : MOCK_USER.handle;
    const userBio = user?.bio ?? MOCK_USER.bio;
    const stats = MOCK_USER.stats;

    // --- Handlers ---
    const handleLogout = () => {
        Alert.alert(
            'Log out',
            'Are you sure you want to log out?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Log out',
                    style: 'destructive',
                    onPress: () => {
                        signOut();
                        resetApi();
                        resetLibrary();
                        router.replace('/login');
                    },
                },
            ]
        );
    };

    // ✅ Functional carousel arrows
    const scrollCarousel = (ref: React.RefObject<ScrollViewType | null>, direction: 'left' | 'right') => {
        const offset = direction === 'left' ? -200 : 200;
        ref.current?.scrollTo({ x: offset, animated: true });
    };

    return (
        <View style={styles.container}>
            {/* Background Header */}
            <View style={styles.backgroundContainer}>
                <Image source={{ uri: HEADER_BG }} style={styles.backgroundImage} />
                <View style={styles.backgroundOverlay} />
            </View>

            <SafeAreaView style={styles.safeArea} edges={['top']}>
                {/* Custom Header */}
                <View style={styles.customHeader}>
                    <TouchableOpacity
                        onPress={() => router.back()}
                        style={styles.backButton}
                        hitSlop={10}
                    >
                        <Feather name="chevron-left" size={28} color="#FFF" />
                    </TouchableOpacity>

                    {/* ✅ Settings gear for quick access */}
                    <TouchableOpacity
                        style={styles.backButton}
                        hitSlop={10}
                    >
                        <Feather name="settings" size={22} color="#FFF" />
                    </TouchableOpacity>
                </View>

                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.scrollContent}
                >
                    {/* Avatar */}
                    <View style={styles.avatarSection}>
                        <View style={styles.avatarWrapper}>
                            <Image source={{ uri: avatarUri }} style={styles.avatarImage} />
                            <TouchableOpacity
                                style={styles.editBadge}
                                onPress={() => router.push('/settings')}
                                hitSlop={5}
                            >
                                <Feather name="edit-2" size={12} color="#FFF" />
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Stats */}
                    <View style={styles.statsContainer}>
                        <StatBox label="playlist" value={stats.playlists} />
                        <StatBox label="room" value={stats.rooms} />
                        <StatBox label="followers" value={stats.followers} />
                    </View>

                    {/* User Info */}
                    <View style={styles.userInfo}>
                        <Text style={styles.userName}>{userName}</Text>
                        <Text style={styles.userHandle}>{userHandle}</Text>
                        <Text style={styles.userBio}>{userBio}</Text>
                    </View>

                    {/* Action Buttons */}
                    <TouchableOpacity
                        style={styles.closeFriendsBtn}
                        activeOpacity={0.8}
                        onPress={() => router.push('/close-friends')}
                    >
                        <Text style={styles.closeFriendsText}>close friends</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
                        <Text style={styles.logoutText}>log out</Text>
                    </TouchableOpacity>

                    <View style={styles.actionButtonsRow}>
                        <TouchableOpacity
                            style={styles.outlineButton}
                            onPress={() => router.push('/create-room')}
                        >
                            <Feather name="edit-3" size={16} color="#8C7AFF" />
                            <Text style={styles.outlineButtonText}>create room</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.outlineButton}
                            onPress={() => router.push('/new-playlist')}
                        >
                            <Feather name="plus-square" size={16} color="#8C7AFF" />
                            <Text style={styles.outlineButtonText}>new playlist</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Playlists Carousel */}
                    <Carousel
                        title="playlist"
                        data={PLAYLISTS}
                        scrollRef={playlistsRef}
                        onArrowPress={(dir) => scrollCarousel(playlistsRef, dir)}
                        onSeeAll={() => router.push('/playlists')}
                    />

                    {/* Rooms Carousel */}
                    <Carousel
                        title="room"
                        data={ROOMS}
                        scrollRef={roomsRef}
                        onArrowPress={(dir) => scrollCarousel(roomsRef, dir)}
                        onSeeAll={() => router.push('/rooms')}
                    />

                    {/* Bottom spacer for floating tab bar */}
                    <View style={{ height: 120 }} />
                </ScrollView>
            </SafeAreaView>
        </View>
    );
}

// ✅ Small reusable components (DRY)
function StatBox({ label, value }: { label: string; value: string | number }) {
    return (
        <View style={styles.statBox}>
            <Text style={styles.statLabel}>{label}</Text>
            <Text style={styles.statValue}>{value}</Text>
        </View>
    );
}

function Carousel({
    title,
    data,
    scrollRef,
    onArrowPress,
    onSeeAll,
}: {
    title: string;
    data: { id: number; image: string }[];
    scrollRef: React.RefObject<ScrollViewType | null>;
    onArrowPress: (dir: 'left' | 'right') => void;
    onSeeAll: () => void;
}) {
    return (
        <View style={styles.listSection}>
            <View style={styles.listHeader}>
                <Text style={styles.listTitle}>{title}</Text>
                <TouchableOpacity onPress={onSeeAll} hitSlop={10}>
                    <Text style={styles.seeAllText}>see all</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.carouselContainer}>
                <TouchableOpacity onPress={() => onArrowPress('left')} hitSlop={8}>
                    <Feather name="chevron-left" size={24} color="#666" style={styles.arrowIcon} />
                </TouchableOpacity>

                <ScrollView
                    ref={scrollRef}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    style={styles.horizontalList}
                    contentContainerStyle={styles.horizontalListContent}
                >
                    {data.map((item) => (
                        <TouchableOpacity key={item.id} activeOpacity={0.8}>
                            <Image source={{ uri: item.image }} style={styles.listItem} />
                        </TouchableOpacity>
                    ))}
                </ScrollView>

                <TouchableOpacity onPress={() => onArrowPress('right')} hitSlop={8}>
                    <Feather name="chevron-right" size={24} color="#666" style={styles.arrowIcon} />
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1, backgroundColor: '#0A0A0F',

    },
    safeArea: { flex: 1 },

    // Header
    customHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 10,
        zIndex: 10,
    },
    backButton: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },

    // Background
    scrollContent: { paddingHorizontal: 20 },
    backgroundContainer: { position: 'absolute', top: 0, left: 0, right: 0, height: 220 },
    backgroundImage: { width: '100%', height: '100%', opacity: 0.6 },
    backgroundOverlay: {
        ...StyleSheet.absoluteFill,
        backgroundColor: 'rgba(10, 10, 15, 0.7)',
    },

    // Avatar
    avatarSection: { alignItems: 'center', marginBottom: 20, marginTop: -40 },
    avatarWrapper: { position: 'relative' },
    avatarImage: {
        width: 110,
        height: 110,
        borderRadius: 55,
        borderWidth: 3,
        borderColor: '#1E1E24',
        backgroundColor: '#2A2A35',
    },
    editBadge: {
        position: 'absolute',
        bottom: 5,
        right: 5,
        backgroundColor: '#6B38D4',
        width: 28,
        height: 28,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: '#1E1E24',
    },

    // Stats
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: '#161620',
        borderRadius: 16,
        paddingVertical: 15,
        paddingHorizontal: 20,
        marginBottom: 25,
    },
    statBox: { alignItems: 'center', flex: 1 },
    statLabel: { color: '#888', fontSize: 12, marginBottom: 4 },
    statValue: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },

    // User info
    userInfo: { alignItems: 'center', marginBottom: 25 },
    userName: { color: '#FFF', fontSize: 22, fontWeight: 'bold', marginBottom: 4 },
    userHandle: { color: '#666', fontSize: 14, marginBottom: 12 },
    userBio: { color: '#888', fontSize: 13, textAlign: 'center', fontStyle: 'italic' },

    // Buttons
    closeFriendsBtn: {
        backgroundColor: '#6B38D4',
        paddingVertical: 14,
        borderRadius: 10,
        alignItems: 'center',
        marginBottom: 15,
    },
    closeFriendsText: { color: '#FFF', fontSize: 14, fontWeight: '600' },
    logoutBtn: { alignItems: 'center', marginBottom: 25 },
    logoutText: { color: '#6B38D4', fontSize: 14, fontWeight: '600' },
    actionButtonsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 30 },
    outlineButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderColor: '#6B38D4',
        borderWidth: 1,
        paddingVertical: 12,
        borderRadius: 10,
        marginHorizontal: 5,
    },
    outlineButtonText: { color: '#FFF', fontSize: 13, fontWeight: '600', marginLeft: 8 },

    // Carousels
    listSection: { marginBottom: 25 },
    listHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
    },
    listTitle: { color: '#FFF', fontSize: 16, fontWeight: '600' },
    seeAllText: { color: '#6B38D4', fontSize: 12, fontWeight: '600' },
    carouselContainer: { flexDirection: 'row', alignItems: 'center' },
    arrowIcon: { paddingHorizontal: 5 },
    horizontalList: { flex: 1 },
    horizontalListContent: { paddingRight: 10 },
    listItem: {
        width: 70,
        height: 70,
        borderRadius: 12,
        marginRight: 15,
        backgroundColor: '#2A2A35',
    },
});