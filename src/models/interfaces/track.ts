export interface ITrack {
  id: string;
  name: string;
  artists: Artist[];
  images: SpotifyImage[];
  voters: string[];
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
