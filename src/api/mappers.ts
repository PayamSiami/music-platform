import type { MusicDetail } from '@/api/divacast-api'
import type { Track } from '@/helpers/types'

/** Maps an API music row onto the app's playback/display track shape. */
export function musicToTrack(music: MusicDetail): Track {
  return {
    id: music.id,
    url: music.audioUrl,
    title: music.title,
    artist: music.singer?.username,
    artwork: music.albumArtUrl ?? undefined,
    duration: music.duration ?? undefined,
  }
}
