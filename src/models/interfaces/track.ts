export interface ITrack {
  isPlaying: boolean;
  uri: string;
  name: string;
  artists: string[];
  images: SpotifyImage[];
}

interface SpotifyImage {
  url: string;
  width: number;
  height: number;
}
