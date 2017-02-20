'use strict';

import * as express from 'express';
import * as path from 'path';
import * as favicon from 'serve-favicon';
import * as logger from 'morgan';
import * as cookieParser from 'cookie-parser';
import * as bodyParser from 'body-parser';

import * as passport from 'passport';
import * as passportHttpBearer from 'passport-http-bearer';

import * as jwtDecode from 'jwt-decode';

import index from './routes/index';
import status from './routes/v1/status';

const app: express.Express = express();

// Set up bearer authentication strategy
passport.use(new passportHttpBearer.Strategy(
  function (token, done) {
    let err = null;

    // Get the user from the token
    // NB: This could call the userinfo endpoint instead
    let jwt = jwtDecode(token);

    let user = {
      sub : jwt.sub,
      uid : jwt.uid,
      email : jwt.email,
      name : jwt.name,
      preferred_username : jwt.preferred_username
    };

    return done(err, user);
  }
));

// Redirect all http requests to https
const forceSSL = function() {
  return function (req, res, next) {
    if (req.headers['x-forwarded-proto'] !== 'https' && req.hostname !== 'localhost') {
      return res.redirect(
       ['https://', req.get('Host'), req.url].join('')
      );
    }
    next();
  }
}
app.use(forceSSL());

app.use(logger('combined'));

app.use('/', express.static(path.join(__dirname,'../../dist')));
app.use('/api/v1/status', passport.authenticate('bearer', { session: false }), status);

// For all GET requests, send back index.html so that PathLocationStrategy can be used
app.get('/*', function(req, res) {
  res.sendFile(path.join(__dirname + '../../dist'));
});

// Catch 404 and forward to error handler
app.use((req,res,next) => {
  var err = new Error('Not Found');
  err['status'] = 404;
  next(err);
});

// Error handlers
// Development error handler - will print stacktrace
if(process.env.NODE_ENV === 'development') {
  app.use((err: Error,req,res,next) => {
    res.status(err['status'] || 500);
    res.json({
      title: 'error',
      message: err.message,
      error: err
    });
  });
}

// Production error handler - no stacktrace leaked to user
app.use((err: Error,req,res,next) => {
  res.status(err['status'] || 500);
  res.json({
    title: 'error',
    message: err.message,
    error: {}
  });
});

export default app;
