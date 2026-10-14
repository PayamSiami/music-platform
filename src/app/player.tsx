import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { useAudioPlayer, useAudioPlayerStatus } from 'expo-audio';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import {
    ActivityIndicator,
    Image,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const WAVEFORM_BARS = [15, 25, 40, 30, 50, 20, 35, 60, 45, 25, 40, 55, 30, 20, 45, 60, 35, 25, 15, 40, 55, 30, 20, 45, 35, 25, 15, 30, 45, 20, 10, 25, 35, 15, 5];

const AUDIO_URL = 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3';

export default function PlayerScreen() {
    const router = useRouter();

    // ✅ NEW: Use expo-audio hooks
    // The player instance (stable across renders)
    const player = useAudioPlayer({ uri: AUDIO_URL });
    
    // The live status (re-renders your component when time/playback changes)
    const status = useAudioPlayerStatus(player);

    // --- Control Functions ---
    const togglePlayPause = () => {
        if (status.playing) {
            player.pause();
        } else {
            player.play();
        }
    };

    const skipForward = () => {
        // currentTime and duration are in SECONDS in expo-audio
        const newTime = Math.min(status.currentTime + 10, status.duration);
        player.seekTo(newTime);
    };

    const skipBackward = () => {
        const newTime = Math.max(status.currentTime - 10, 0);
        player.seekTo(newTime);
    };

    const skipToNext = () => {
        player.seekTo(0);
        player.play();
    };

    const skipToPrevious = () => {
        player.seekTo(0);
        player.play();
    };

    // --- Format Time Helper (Now takes SECONDS, not milliseconds) ---
    const formatTime = (seconds: number) => {
        if (!seconds || isNaN(seconds)) return '00:00';
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    // Calculate progress percentage
    const progressPercent = status.duration > 0 
        ? (status.currentTime / status.duration) * 100 
        : 0;

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#18181F" />

            <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.headerBtn}>
                        <Feather name="chevron-left" size={24} color="#FFF" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Bellyache</Text>
                    <TouchableOpacity style={styles.headerBtn}>
                        <Feather name="more-horizontal" size={24} color="#FFF" />
                    </TouchableOpacity>
                </View>

                <View style={styles.contentContainer}>
                    <View style={styles.artworkCard}>
                        <Image
                            source={{ uri: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=600' }}
                            style={styles.artworkImage}
                        />
                        <View style={styles.artworkOverlay} />

                        {!status.isLoaded && (
                            <View style={styles.loadingContainer}>
                                <ActivityIndicator size="large" color="#FFF" />
                            </View>
                        )}

                        <View style={styles.waveformContainer}>
                            <LinearGradient
                                colors={['#FF6B9E', '#A76BFF', '#6B9EFF']}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                style={styles.gradientBackground}
                            />

                            <View style={styles.barsContainer}>
                                {WAVEFORM_BARS.map((barHeight, index) => (
                                    <View
                                        key={index}
                                        style={[
                                            styles.waveBar,
                                            { height: `${barHeight}%` }
                                        ]}
                                    />
                                ))}
                            </View>

                            <View style={styles.timelineContainer}>
                                <Text style={styles.timeText}>
                                    {formatTime(status.currentTime)}
                                </Text>
                                <View style={styles.timelineTrack}>
                                    <View style={[styles.timelineProgress, { width: `${progressPercent}%` }]} />
                                    <View style={[styles.timelineThumb, { left: `${progressPercent}%` }]} />
                                </View>
                                <Text style={styles.timeText}>
                                    {formatTime(status.duration)}
                                </Text>
                            </View>
                        </View>
                    </View>
                </View>

                <View style={styles.controlsContainer}>
                    <View style={styles.topControlsRow}>
                        <TouchableOpacity style={styles.secondaryBtn}>
                            <MaterialCommunityIcons name="repeat" size={24} color="#666" />
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.playButton} onPress={togglePlayPause}>
                            <Feather
                                name={status.playing ? "pause" : "play"}
                                size={32}
                                color="#FFF"
                                style={{ marginLeft: status.playing ? 0 : 4 }}
                            />
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.secondaryBtn}>
                            <MaterialCommunityIcons name="playlist-music" size={26} color="#FFF" />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.bottomControlsRow}>
                        <TouchableOpacity onPress={skipToPrevious}>
                            <MaterialCommunityIcons name="skip-previous" size={32} color="#FFF" />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={skipBackward}>
                            <MaterialCommunityIcons name="rewind-10" size={28} color="#FFF" />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={skipForward}>
                            <MaterialCommunityIcons name="fast-forward-10" size={28} color="#FFF" />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={skipToNext}>
                            <MaterialCommunityIcons name="skip-next" size={32} color="#FFF" />
                        </TouchableOpacity>
                    </View>
                </View>
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#18181F' },
    safeArea: { flex: 1 },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 15 },
    headerBtn: { padding: 8, backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 12 },
    headerTitle: { color: '#FFF', fontSize: 18, fontWeight: 'bold', letterSpacing: 0.5 },
    contentContainer: { flex: 1, paddingHorizontal: 20, paddingBottom: 20 },
    artworkCard: { flex: 1, borderRadius: 24, overflow: 'hidden', position: 'relative', backgroundColor: '#2A2A35' },
    artworkImage: { width: '100%', height: '100%', resizeMode: 'cover' },
    artworkOverlay: { ...StyleSheet.absoluteFill, backgroundColor: 'rgba(0,0,0,0.3)' },
    loadingContainer: { ...StyleSheet.absoluteFill, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 10 },
    waveformContainer: { position: 'absolute', bottom: 40, left: 20, right: 20, height: 100, justifyContent: 'flex-end' },
    gradientBackground: { position: 'absolute', bottom: 30, left: 0, right: 0, height: 60, borderRadius: 10, opacity: 0.9 },
    barsContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', height: 60, marginBottom: 30, paddingHorizontal: 10 },
    waveBar: { width: 3, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 2 },
    timelineContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 10 },
    timeText: { color: '#FFF', fontSize: 10, fontWeight: '600', width: 35 },
    timelineTrack: { flex: 1, height: 2, backgroundColor: 'rgba(255,255,255,0.3)', marginHorizontal: 15, borderRadius: 1, position: 'relative' },
    timelineProgress: { position: 'absolute', left: 0, top: 0, bottom: 0, backgroundColor: '#FFF', borderRadius: 1 },
    timelineThumb: { position: 'absolute', top: -3, width: 8, height: 8, borderRadius: 4, backgroundColor: '#FFF', marginLeft: -4 },
    controlsContainer: { paddingHorizontal: 20, paddingBottom: 20, paddingTop: 30, backgroundColor: '#121218', borderTopLeftRadius: 40, borderTopRightRadius: 40 },
    topControlsRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginBottom: 25, position: 'relative' },
    playButton: { width: 70, height: 70, borderRadius: 35, backgroundColor: '#2A2A35', justifyContent: 'center', alignItems: 'center', marginHorizontal: 40, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.5, shadowRadius: 10, elevation: 10 },
    secondaryBtn: { padding: 10 },
    bottomControlsRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, marginBottom: 10 },
});