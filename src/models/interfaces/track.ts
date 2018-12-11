export interface ITrack {
  trackId: string;
  name: string;
  artists: Artist[];
  images: SpotifyImage[];
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
