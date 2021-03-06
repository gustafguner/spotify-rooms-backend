import * as express from 'express';
import * as mongoose from 'mongoose';
import * as queryString from 'query-string';
import * as graphqlHTTP from 'express-graphql';
import { ApolloServer, gql } from 'apollo-server-express';
import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import * as dotenv from 'dotenv';
import * as passport from 'passport';
import * as jwt from 'jsonwebtoken';
const SpotifyWebApi = require('spotify-web-api-node');
const morgan = require('morgan');
dotenv.config();
const PORT = process.env.PORT || 8888;
import { execute, subscribe } from 'graphql';
import { SubscriptionServer } from 'subscriptions-transport-ws';
import { schema } from './schema';

import { jwtStrategy } from './config/passport';
import User from './models/user';

import {
  spotifyInstances,
  spotifyApi,
  setSpotifyInstance,
  getSpotifyInstance,
} from './spotify';
import { createServer } from 'http';
import to from 'await-to-js';

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
  .connect(process.env.MONGODB_URL, {
    auth: {
      user: process.env.MONGODB_USERNAME,
      password: process.env.MONGODB_PASSWORD,
    },
  })
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

const spotifyInstancesMiddleware = (req, res, next) => {
  if (req.user) {
    if (!getSpotifyInstance(req.user._id)) {
      setSpotifyInstance(
        req.user._id,
        req.user.expires,
        req.user.accessToken,
        req.user.refreshToken,
      );
    }
  }
  next();
};

const server = new ApolloServer({
  schema,
  context: async ({ req }) => {
    const authorization = req.headers.authorization;
    const token = authorization ? authorization.substring(7) : null;

    let decodedToken = null;

    try {
      decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    } catch {}

    const user =
      decodedToken !== null
        ? await User.findOne({ spotifyId: decodedToken.spotifyId })
        : null;

    if (user !== null) {
      if (!getSpotifyInstance(user._id)) {
        setSpotifyInstance(
          user._id,
          user.expires,
          user.accessToken,
          user.refreshToken,
        );
      }
    }

    return {
      user,
    };
  },
  playground: {
    subscriptionEndpoint: '/subscriptions',
  },
});

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

          console.log(body);

          if (!user) {
            user = new User({
              spotifyId: body.id,
              refreshToken: refresh_token,
            });
          }

          user.displayName = body.display_name;
          user.country = body.country;
          user.image = body.images.length > 0 ? body.images[0].url : null;
          user.email = body.email;

          user.accessToken = access_token;
          user.expires = expires;

          await user.save();

          setSpotifyInstance(user._id, expires, access_token, refresh_token);

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
    async ({ body }) => {
      const token = jwt.sign({ spotifyId: body.id }, process.env.JWT_SECRET, {
        expiresIn: 604800, // 1 week in seconds
      });

      const [err, user] = await to(User.findOne({ spotifyId: body.id }).exec());

      if (err) {
        return res.status(500).json({ message: 'Unexpected server error.' });
      }

      res.json({
        token: token,
        user: {
          id: user._id,
          spotifyId: user.spotifyId,
          displayName: user.displayName,
        },
      });
    },
    (error) => {
      return res.status(401).json({ message: 'Authentication error.' });
    },
  );
});

app.get('/spotifyInstances', (req, res) => {
  console.log(req.user);
  console.log(spotifyInstances);
  res.json({ result: true });
});

app.get(
  '/refreshAccessToken',
  passport.authenticate('jwt', { session: false }),
  spotifyInstancesMiddleware,
  (req, res) => {
    getSpotifyInstance(req.user._id)
      .api.refreshAccessToken()
      .then(
        async ({ body }) => {
          const user = await User.findById(req.user._id);

          if (!user) {
            return res
              .status(400)
              .json({ message: 'Unexpected Server Error.' });
          }

          const access_token = body['access_token'];
          const expires_in = body['expires_in'];

          const expires = Date.now() + expires_in * 1000 - 1000 * 60 * 5;

          user.accessToken = access_token;
          user.expires = expires;

          await user.save();

          setSpotifyInstance(
            user._id,
            expires,
            access_token,
            user.refreshToken,
          );

          res.json(body);
        },
        (error) => {
          res.status(400).json({ message: 'Could not refresh access token.' });
        },
      );
  },
);

server.applyMiddleware({ app });

const ws = createServer(app);

ws.listen(PORT, () => {
  console.log(`Server listenting on http://localhost:${PORT}`);
  new SubscriptionServer(
    {
      keepAlive: 10_000,
      execute,
      subscribe,
      schema,
    },
    {
      server: ws,
      path: '/subscriptions',
    },
  );
});
