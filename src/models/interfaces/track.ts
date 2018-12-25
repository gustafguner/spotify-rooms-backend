export interface ITrack {
  id: string;
  uri: string;
  name: string;
  artists: Artist[];
  images: SpotifyImage[];
  voters: string[];
  duration_ms: number;
  timestamp: Date;
}

interface Artist {
  id: string;
  name: string;
}

interface SpotifyImage {
  url: string;
  width: number;
  height: number;
}
