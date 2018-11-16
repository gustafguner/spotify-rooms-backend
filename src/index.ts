import * as express from 'express';
import request from 'request';
const querystring = require('querystring');
const graphqlHTTP = require('express-graphql');
const { makeExecutableSchema } = require('graphql-tools');
const typeDefs = require('./schema');
const resolvers = require('./resolvers');
require('dotenv').config();

let app = express();

const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

app.use(
  '/graphql',
  graphqlHTTP({
    schema: schema,
    graphiql: true,
  }),
);

let redirect_uri =
  process.env.SPOTIFY_REDIRECT_URI || 'http://localhost:8888/callback';

app.get('/login', (req, res) => {
  res.redirect(
    'https://accounts.spotify.com/authorize?' +
      querystring.stringify({
        response_type: 'code',
        client_id: process.env.SPOTIFY_CLIENT_ID,
        scope: 'user-read-private user-read-email user-read-playback-state',
        redirect_uri,
      }),
  );
});

app.get('/callback', (req, res) => {
  let code = req.query.code || null;
  let authOptions = {
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
    var access_token = body.access_token;
    var refresh_token = body.refresh_token;
    console.log(body);
    let uri = process.env.FRONTEND_URI || 'http://localhost:3000';
    res.redirect(
      uri + '?access_token=' + access_token + '&refresh_token=' + refresh_token,
    );
  });
});

app.post('/refreshAccessToken', (req, res) => {});

let port = process.env.PORT || 8888;
console.log('Server running on port ' + port);
app.listen(port);
