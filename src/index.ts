import * as express from 'express';
import * as mongoose from 'mongoose';
import * as request from 'request';
import * as queryString from 'query-string';
import * as graphqlHTTP from 'express-graphql';
import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import * as dotenv from 'dotenv';
dotenv.config();
import { schema } from './schema';

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
app.use(bodyParser.json());
app.use(cors());
app.use(
  '/graphql',
  graphqlHTTP({
    schema: schema,
    graphiql: true,
  }),
);

const scopes = [
  'user-read-private',
  'user-read-email',
  'user-read-playback-state',
];
const state = 'fix-this-later';
const redirect_uri =
  process.env.SPOTIFY_REDIRECT_URI || 'http://localhost:8888/callback';

app.get('/spotifyAuthorizeUrl', (req, res: any) => {
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
  request.post(authOptions, (body) => {
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

    request.get(userRequestOptions, (body) => {
      const uri: string = process.env.FRONTEND_URI || 'http://localhost:3000';
      console.log(body);
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
