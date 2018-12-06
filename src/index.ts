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
const morgan = require('morgan');
dotenv.config();
import { schema } from './schema';

import { jwtStrategy } from './config/passport';
import User from './models/user';
import { connect } from 'mongodb';

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

app.use(
  '/graphql',
  graphqlHTTP({
    schema: schema,
    graphiql: true,
  }),
);

app.use(passport.initialize());
app.use(passport.session());
passport.use(jwtStrategy);

const scopes = [
  'user-read-private',
  'user-read-email',
  'user-read-playback-state',
  'user-read-currently-playing',
  'user-modify-playback-state',
  'user-read-recently-played',
];
const state = 'fix-this-later';
const redirect_uri =
  process.env.SPOTIFY_REDIRECT_URI || 'http://localhost:8888/callback';

app.get('/spotifyAuthorizeUrl', (req, res) => {
  res.json({
    spotify_authorize_url:
      'https://accounts.spotify.com/authorize?' +
      queryString.stringify({
        response_type: 'code',
        client_id: process.env.SPOTIFY_CLIENT_ID,
        scope: scopes.join(' '),
        redirect_uri,
        state,
        show_dialog: true,
      }),
  });
});

app.get('/callback', (req, res) => {
  const code = req.query.code || null;
  const authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    form: {
      code: code,
      redirect_uri,
      grant_type: 'authorization_code',
    },
    headers: {
      Authorization:
        'Basic ' +
        new Buffer(
          process.env.SPOTIFY_CLIENT_ID +
            ':' +
            process.env.SPOTIFY_CLIENT_SECRET,
        ).toString('base64'),
    },
    json: true,
  };
  request.post(authOptions, (error, response, body) => {
    const access_token: string = body.access_token;
    const refresh_token: string = body.refresh_token;
    const expires_in: number = body.expires_in;

    const userRequestOptions = {
      url: 'https://api.spotify.com/v1/me',
      headers: {
        Authorization: 'Bearer ' + body.access_token,
      },
      json: true,
    };

    request.get(userRequestOptions, async (error, response, body) => {
      const usersWithSameSpotifyId = await User.countDocuments({
        spotifyId: body.id,
      });
      if (usersWithSameSpotifyId === 0) {
        const user = new User({
          spotifyId: body.id,
          displayName: body.display_name,
          email: body.email,
          country: body.country,
        });
        await user.save();
      }

      const uri: string = process.env.FRONTEND_URI || 'http://localhost:3000';
      res.redirect(
        uri +
          '?' +
          queryString.stringify({
            access_token,
            refresh_token,
            expires_in,
          }),
      );
    });
  });
});

app.post('/auth', (req, res) => {
  const accessToken = req.body.accessToken;

  const userRequestOptions = {
    url: 'https://api.spotify.com/v1/me',
    headers: {
      Authorization: 'Bearer ' + accessToken,
    },
    json: true,
  };

  request.get(userRequestOptions, async (error, response, body) => {
    if (!error && response.statusCode === 200) {
      const token = jwt.sign({ spotifyId: body.id }, process.env.JWT_SECRET, {
        expiresIn: 604800, // 1 week in seconds
      });
      res.json({ token: token });
    } else {
      res.status(401).json({ message: 'Authentication error.' });
    }
  });
});

app.get(
  '/protected',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    console.log(req.user);
    res.json({});
  },
);

app.get('/refreshAccessToken', (req, res) => {
  const authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    form: {
      grant_type: 'refresh_token',
      refresh_token: req.query.refresh_token,
    },
    headers: {
      Authorization:
        'Basic ' +
        new Buffer(
          process.env.SPOTIFY_CLIENT_ID +
            ':' +
            process.env.SPOTIFY_CLIENT_SECRET,
        ).toString('base64'),
    },
    json: true,
  };

  request.post(authOptions, (error, response, body) => {
    res.json(body);
  });
});

const port = process.env.PORT || 8888;
console.log('Server running on port ' + port);
app.listen(port);
