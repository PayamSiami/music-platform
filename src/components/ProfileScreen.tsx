import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { useApiStore } from '@/store/api';
import {
    Image,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// --- Mock Data ---
const MOCK_AVATAR_URI = 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400';
const PLAYLISTS = [
    { id: 1, image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200' },
    { id: 2, image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=200' },
    { id: 3, image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200' },
    { id: 4, image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200' },
];

const ROOMS = [
    { id: 1, image: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=200' },
    { id: 2, image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=200' },
    { id: 3, image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200' },
    { id: 4, image: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200' },
];

export default function ProfileScreen() {
    // Live profile from the API once it is loaded; the mock values below are
    // the fallback until a Firebase ID token is configured.
    const user = useApiStore((state) => state.user.data)
    const resetApi = useApiStore((state) => state.reset)

    const avatarUri = user?.profilePictureUrl ?? MOCK_AVATAR_URI;
    const userName = user?.username ?? 'Jan Walters';
    const userHandle = user ? `@${user.username.toLowerCase()}` : '@j.walters';
    const userBio = user?.bio ?? 'In a world of worriers, be the warrior';

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

            {/* 
        Background Image Header 
        Note: For the true "blur" effect seen in the screenshot, 
        you would wrap this Image in a <BlurView> from 'expo-blur'.
      */}
            <View style={styles.backgroundContainer}>
                <Image
                    source={{ uri: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800' }}
                    style={styles.backgroundImage}
                />
                <View style={styles.backgroundOverlay} />
            </View>

            <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

                    {/* Avatar Section */}
                    <View style={styles.avatarSection}>
                        <View style={styles.avatarWrapper}>
                            <Image
                                source={{ uri: avatarUri }}
                                style={styles.avatarImage}
                            />
                            {/* Edit Icon Badge */}
                            <TouchableOpacity style={styles.editBadge}>
                                <Feather name="edit-2" size={12} color="#FFF" />
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Stats Section */}
                    <View style={styles.statsContainer}>
                        <View style={styles.statBox}>
                            <Text style={styles.statLabel}>playlist</Text>
                            <Text style={styles.statValue}>86</Text>
                        </View>
                        <View style={styles.statBox}>
                            <Text style={styles.statLabel}>room</Text>
                            <Text style={styles.statValue}>17</Text>
                        </View>
                        <View style={styles.statBox}>
                            <Text style={styles.statLabel}>followers</Text>
                            <Text style={styles.statValue}>20K</Text>
                        </View>
                    </View>

                    {/* User Info */}
                    <View style={styles.userInfo}>
                        <Text style={styles.userName}>{userName}</Text>
                        <Text style={styles.userHandle}>{userHandle}</Text>
                        <Text style={styles.userBio}>{userBio}</Text>
                    </View>

                    {/* Actions */}
                    <TouchableOpacity style={styles.closeFriendsBtn}>
                        <Text style={styles.closeFriendsText}>close friends</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.logoutBtn}
                        onPress={() => resetApi()}
                    >
                        <Text style={styles.logoutText}>log out</Text>
                    </TouchableOpacity>

                    {/* Action Buttons Grid */}
                    <View style={styles.actionButtonsRow}>
                        <TouchableOpacity style={styles.outlineButton}>
                            <Feather name="edit-3" size={16} color="#8C7AFF" />
                            <Text style={styles.outlineButtonText}>create room</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.outlineButton}>
                            <Feather name="plus-square" size={16} color="#8C7AFF" />
                            <Text style={styles.outlineButtonText}>new playlist</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Playlists Section */}
                    <View style={styles.listSection}>
                        <View style={styles.listHeader}>
                            <Text style={styles.listTitle}>playlist</Text>
                            <TouchableOpacity><Text style={styles.seeAllText}>see all</Text></TouchableOpacity>
                        </View>

                        <View style={styles.carouselContainer}>
                            <Feather name="chevron-left" size={24} color="#666" style={styles.arrowIcon} />
                            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalList}>
                                {PLAYLISTS.map(item => (
                                    <Image key={item.id} source={{ uri: item.image }} style={styles.listItem} />
                                ))}
                            </ScrollView>
                            <Feather name="chevron-right" size={24} color="#666" style={styles.arrowIcon} />
                        </View>
                    </View>

                    {/* Rooms Section */}
                    <View style={styles.listSection}>
                        <View style={styles.listHeader}>
                            <Text style={styles.listTitle}>room</Text>
                            <TouchableOpacity><Text style={styles.seeAllText}>see all</Text></TouchableOpacity>
                        </View>

                        <View style={styles.carouselContainer}>
                            <Feather name="chevron-left" size={24} color="#666" style={styles.arrowIcon} />
                            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalList}>
                                {ROOMS.map(item => (
                                    <Image key={item.id} source={{ uri: item.image }} style={styles.listItem} />
                                ))}
                            </ScrollView>
                            <Feather name="chevron-right" size={24} color="#666" style={styles.arrowIcon} />
                        </View>
                    </View>

                    <View style={{ height: 40 }} />
                </ScrollView>

                {/* Bottom Navigation */}
                <View style={styles.bottomNav}>
                    <TouchableOpacity><MaterialCommunityIcons name="disc" size={28} color="#FFF" /></TouchableOpacity>
                    <TouchableOpacity><Feather name="clock" size={24} color="#666" /></TouchableOpacity>
                    <TouchableOpacity><Feather name="grid" size={24} color="#666" /></TouchableOpacity>
                </View>
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
    scrollContent: {
        paddingHorizontal: 20,
        paddingTop: 40, // Space for the avatar to overlap
    },

    // Background Image Header
    backgroundContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 220,
    },
    backgroundImage: {
        width: '100%',
        height: '100%',
        opacity: 0.6,
    },
    backgroundOverlay: {
        ...StyleSheet.absoluteFill,
        backgroundColor: 'rgba(10, 10, 15, 0.7)', // Darken image
    },

    // Avatar
    avatarSection: {
        alignItems: 'center',
        marginBottom: 20,
    },
    avatarWrapper: {
        position: 'relative',
    },
    avatarImage: {
        width: 110,
        height: 110,
        borderRadius: 55,
        borderWidth: 3,
        borderColor: '#1E1E24',
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
    statBox: {
        alignItems: 'center',
        flex: 1,
    },
    statLabel: {
        color: '#888',
        fontSize: 12,
        marginBottom: 4,
    },
    statValue: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: 'bold',
    },

    // User Info
    userInfo: {
        alignItems: 'center',
        marginBottom: 25,
    },
    userName: {
        color: '#FFF',
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    userHandle: {
        color: '#666',
        fontSize: 14,
        marginBottom: 12,
    },
    userBio: {
        color: '#888',
        fontSize: 13,
        textAlign: 'center',
        fontStyle: 'italic',
    },

    // Buttons
    closeFriendsBtn: {
        backgroundColor: '#6B38D4',
        paddingVertical: 14,
        borderRadius: 10,
        alignItems: 'center',
        marginBottom: 15,
    },
    closeFriendsText: {
        color: '#FFF',
        fontSize: 14,
        fontWeight: '600',
    },
    logoutBtn: {
        alignItems: 'center',
        marginBottom: 25,
    },
    logoutText: {
        color: '#6B38D4',
        fontSize: 14,
        fontWeight: '600',
    },

    actionButtonsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 30,
    },
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
    outlineButtonText: {
        color: '#FFF',
        fontSize: 13,
        fontWeight: '600',
        marginLeft: 8,
    },

    // Lists (Playlist & Room)
    listSection: {
        marginBottom: 25,
    },
    listHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
    },
    listTitle: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '600',
    },
    seeAllText: {
        color: '#6B38D4',
        fontSize: 12,
        fontWeight: '600',
    },
    carouselContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    arrowIcon: {
        paddingHorizontal: 5,
    },
    horizontalList: {
        flex: 1,
    },
    listItem: {
        width: 70,
        height: 70,
        borderRadius: 12,
        marginRight: 15,
    },

    // Bottom Nav
    bottomNav: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        paddingVertical: 15,
        backgroundColor: '#0A0A0F',
        borderTopWidth: 1,
        borderTopColor: '#1E1E24',
    },
});