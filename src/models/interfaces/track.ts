export interface ITrack {
  id: string;
  name: string;
  artists: string[];
  images: SpotifyImage[];
}

interface SpotifyImage {
  url: string;
  width: number;
  height: number;
}
