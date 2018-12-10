import * as express from 'express';
import * as mongoose from 'mongoose';
import * as request from 'request';
import * as queryString from 'query-string';
import * as graphqlHTTP from 'express-graphql';
import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import * as dotenv from 'dotenv';
import * as passport from 'passport';
import * as jwt from 'jsonwebtoken';
const SpotifyWebApi = require('spotify-web-api-node');

const morgan = require('morgan');
dotenv.config();
import { schema } from './schema';

import { jwtStrategy } from './config/passport';
import User from './models/user';

let spotifyApiObjects = {};

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
  redirectUri: process.env.SPOTIFY_REDIRECT_URI,
});

const scopes = [
  'user-read-private',
  'user-read-email',
  'user-read-playback-state',
  'user-read-currently-playing',
  'user-modify-playback-state',
  'user-read-recently-played',
];
const state = 'fix-this-later';

mongoose
  .connect(
    process.env.MONGODB_URL,
    {
      auth: {
        user: process.env.MONGODB_USERNAME,
        password: process.env.MONGODB_PASSWORD,
      },
    },
  )
  .then(() => console.log('Successfully connected to MongoDB'))
  .catch((err) =>
    console.error(
      'An error occured when connecting to the MongoDB database: ',
      err,
    ),
  );

const app = express();

app.use(morgan('dev'));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(cors());

app.use(passport.initialize());
app.use(passport.session());
passport.use(jwtStrategy);

app.use(
  '/graphql',
  graphqlHTTP(async (req) => {
    const authorization = req.headers.authorization;
    const token = authorization ? authorization.substring(7) : null;

    let decodedToken = null;

    try {
      decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    } catch {}

    return {
      schema: schema,
      context: {
        user:
          decodedToken !== null
            ? await User.findOne({ spotifyId: decodedToken.spotifyId })
            : null,
      },
      graphiql: true,
    };
  }),
);

app.get('/spotifyAuthorizeUrl', (req, res) => {
  res.json({
    spotify_authorize_url: spotifyApi.createAuthorizeURL(scopes, state),
  });
});

app.get('/callback', (req, res) => {
  const code = req.query.code || null;

  spotifyApi.authorizationCodeGrant(code).then(
    async (data) => {
      const access_token = data.body['access_token'];
      const refresh_token = data.body['refresh_token'];
      const expires_in = data.body['expires_in'];

      const expires = Date.now() + expires_in * 1000 - 1000 * 60 * 5;

      const tempSpotifyWebApi = {
        expires,
        api: new SpotifyWebApi({
          clientId: process.env.SPOTIFY_CLIENT_ID,
          clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
          redirectUri: process.env.SPOTIFY_REDIRECT_URI,
        }),
      };

      tempSpotifyWebApi.api.setAccessToken(access_token);
      tempSpotifyWebApi.api.setRefreshToken(refresh_token);

      tempSpotifyWebApi.api.getMe().then(
        async ({ body }) => {
          let user = await User.findOne({ spotifyId: body.id });
          console.log('user: ' + user);

          if (!user) {
            user = new User({
              spotifyId: body.id,
              accessToken: access_token,
              refreshToken: refresh_token,
              expires,
              displayName: body.display_name,
              email: body.email,
              country: body.country,
            });
            await user.save();
          }

          spotifyApiObjects[user._id] = tempSpotifyWebApi;

          const uri: string =
            process.env.FRONTEND_URI || 'http://localhost:3000';
          res.redirect(
            uri +
              '?' +
              queryString.stringify({
                access_token,
                refresh_token,
                expires_in,
              }),
          );
        },
        (error) => {
          console.error('Error: ', error);
        },
      );
    },
    (error) => {
      console.error('Error: ', error);
    },
  );
});

app.post('/auth', (req, res) => {
  const accessToken = req.body.accessToken;

  const tempSpotifyApi = new SpotifyWebApi({
    clientId: process.env.SPOTIFY_CLIENT_ID,
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
    redirectUri: process.env.SPOTIFY_REDIRECT_URI,
  });
  tempSpotifyApi.setAccessToken(accessToken);

  tempSpotifyApi.getMe().then(
    ({ body }) => {
      const token = jwt.sign({ spotifyId: body.id }, process.env.JWT_SECRET, {
        expiresIn: 604800, // 1 week in seconds
      });
      res.json({ token: token });
    },
    (error) => {
      res.status(401).json({ message: 'Authentication error.' });
    },
  );
});

const createSpotifyWebApi = (accessToken: string, refreshToken: string) => {
  const api = new SpotifyWebApi({
    clientId: process.env.SPOTIFY_CLIENT_ID,
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
    redirectUri: process.env.SPOTIFY_REDIRECT_URI,
  });
  api.setAccessToken(accessToken);
  api.setRefreshToken(refreshToken);

  return api;
};

const spotifyApiObjectsMiddleware = (req, res, next) => {
  if (!spotifyApiObjects[req.user]) {
    spotifyApiObjects[req.user._id] = {
      expires: req.user.expires,
      api: createSpotifyWebApi(req.user.accessToken, req.user.refreshToken),
    };
  }
  next();
};

app.get(
  '/refreshAccessToken',
  passport.authenticate('jwt', { session: false }),
  spotifyApiObjectsMiddleware,
  (req, res) => {
    spotifyApiObjects[req.user._id].api.refreshAccessToken().then(
      ({ body }) => {
        res.json(body);
      },
      (error) => {
        res.status(400).json({ message: 'Could not refresh access token.' });
      },
    );
  },
);

const port = process.env.PORT || 8888;
console.log('Server running on port ' + port);
app.listen(port);
