const passportJWT = require('passport-jwt');
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;

import User from '../models/user';

export const jwtStrategy = new JWTStrategy(
  {
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET,
  },
  (jwtPayload, callback) => {
    console.log(jwtPayload);
    User.findById(jwtPayload._id, (err, user) => {
      if (err) {
        return callback(err, false);
      }
      if (user) {
        return callback(null, user);
      }
      return callback(null, null);
    });
  },
);
