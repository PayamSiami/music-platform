// expo-audio does not export a Track type, so we define our own
// application-level track shape that carries both the playback source
// and the display metadata.
export type Track = {
  id?: string;
  url: string;
  title: string;
  artist?: string;
  artwork?: string;
  duration?: number;
  rating?: number;
  // add any other fields your app relies on
};

export type Playlist = {
  name: string;
  tracks: Track[];
  artworkPreview: string;
};

export type Artist = {
  name: string;
  tracks: Track[];
};

export type TrackWithPlaylist = Track & { playlist?: string[] };
