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
import * as request from 'request';

import index from './routes/index';
import status from './routes/v1/status';

import { Config } from '../shared/config';

const app: express.Express = express();
const config: Config = new Config();

// Set up bearer authentication strategy
passport.use(new passportHttpBearer.Strategy(
  function (token, done) {
    let jwt = jwtDecode(token);

    // Verify the token
    var options = {
        url: config.okta_server_url + '/oauth2/v1/introspect',
        method: 'POST',
        headers: {
          'Content-Type' : 'application/x-www-form-urlencoded',
          'charset' : 'UTF-8'
        },
        form: {
          token: token,
          token_type_hint: 'id_token',
          client_id : config.client_id,
          client_secret : config.client_secret
        }
    };

    // Start the request
    request(options, function (error, response, body) {
        if (error || response.statusCode != 200) {
          return done(error);
        }

        if (!error && response.statusCode == 200) {
          var userInfo = JSON.parse(body);

          if (!userInfo.active) {
            return done("User is not active");
          }

          let user = {
            sub : userInfo.sub,
            uid : userInfo.uid,
            email : userInfo.email,
            name : userInfo.name,
            preferred_username : userInfo.preferred_username
          };

          return done(error, user);
        }
    });
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

app.use('/', express.static(path.join(__dirname,'../../dist/client')));
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
