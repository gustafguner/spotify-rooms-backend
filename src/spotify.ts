const SpotifyWebApi = require('spotify-web-api-node');

const spotifyInstances: any = {};

const createSpotifyWebApi = (accessToken?: string, refreshToken?: string) => {
  const api = new SpotifyWebApi({
    clientId: process.env.SPOTIFY_CLIENT_ID,
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
    redirectUri: process.env.SPOTIFY_REDIRECT_URI,
  });

  if (accessToken) {
    api.setAccessToken(accessToken);
  }

  if (refreshToken) {
    api.setRefreshToken(refreshToken);
  }

  return api;
};

const setSpotifyInstance = (
  key: string,
  expires: number,
  accessToken: string,
  refreshToken: string,
) => {
  spotifyInstances[key] = {
    expires,
    api: createSpotifyWebApi(accessToken, refreshToken),
  };
  return spotifyInstances[key];
};

const removeSpotifyInstance = (key: string) => {
  delete spotifyInstances[key];
};

const getSpotifyInstance = (key: string) => spotifyInstances[key];

const spotifyApi = createSpotifyWebApi();

export {
  spotifyApi,
  spotifyInstances,
  setSpotifyInstance,
  removeSpotifyInstance,
  getSpotifyInstance,
};
