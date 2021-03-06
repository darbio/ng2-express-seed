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

//import * as Provider from 'oidc-provider';
// This causes a tsc compilation error when run in npm so we use require instead
let Provider = require('oidc-provider');
import { RedisAdapter } from './provider/redis_adapter';
import { Account } from './provider/account';

import index from './routes/index';
import status from './routes/v1/status';
import client_config from './routes/v1/config/client';

import { Config } from '../shared/config';

const app: express.Express = express();
const config: Config = new Config();

const provider = new Provider(config.oidc_server_url, {
  adapter : RedisAdapter,
  findById : Account.findById,
  claims : {
    openid: ['sub'],
    email: ['email', 'email_verified'],
  },
  interactionUrl() {
    return `/interaction/${this.oidc.uuid}`;
  },
  logoutSource(form) {
    this.body = `<!DOCTYPE html>
      <head>
        <title>Logout</title>
      </head>
      <body onload="document.getElementsByName('logout')[0].click()">
        ${form}
        Logging you out... please wait
        <button type="submit" form="op.logoutForm" name="logout" value="yes" style="display: none;">Yes</button>
      </body>
      </html>`;
  },
  features: {
    alwaysIssueRefresh : false,
    backchannelLogout : false,
    claimsParameter : true,
    clientCredentials : true,
    devInteractions : false,
    discovery : true,
    encryption : true,
    introspection : true,
    oauthNativeApps : false,
    registration : false,
    registrationManagement : false,
    request : true,
    requestUri : true,
    revocation : true,
    sessionManagement : true
  }
});

let keystore = require('./keys/keystore.json');
let integrity = require('./keys/integrity.json');

provider.initialize({
  keystore,
  integrity,
  clients: [
    {
      client_id: config.client_id,
      client_secret: config.client_secret,
      grant_types: [
        'implicit'
      ],
      response_types: [
        'id_token token'
      ],
      post_logout_redirect_uris: [
        'https://lvh.me:886',
        'https://floating-temple-70367.herokuapp.com',
      ],
      redirect_uris: [
        'https://lvh.me:886',
        'https://floating-temple-70367.herokuapp.com',
      ]
    }
  ]
})
.then(() => {
  // Set up OIDC provider
  provider.app.proxy = true;
  provider.app.keys = process.env.SECURE_KEY.split(',');

  // Set up bearer authentication strategy
  passport.use(new passportHttpBearer.Strategy(
    function (token, done) {
      if (!token) {
        done({
          status: 401,
          message: "No token present"
        });
      }

      request({
        url: config.oidc_server_url + "/.well-known/openid-configuration",
        method: 'GET'
      }, function (error, response, body) {
        if (error) {
          throw error;
        }
        let discoveryDocument = JSON.parse(body);

        // Verify the token
        var options = {
          url: discoveryDocument.introspection_endpoint,
          method: 'POST',
          headers: {
            'Content-Type' : 'application/x-www-form-urlencoded',
            'charset' : 'UTF-8',
            'Authorization' : 'Basic ' + new Buffer(config.client_id + ':' + config.client_secret).toString('base64')
          },
          form: {
            token: token,
            token_type_hint: 'id_token'
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
                return done({
                  status: 401,
                  message: "Token is not active"
                });
              }

              return done(error, userInfo);
            }
        });
      });
    }
  ));

  // Set up server side pages
  app.set('view engine', 'ejs');
  app.set('views', path.resolve(__dirname, 'views'));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({
    extended: true
  }));


  // Redirect all http requests to https
  const forceSSL = function() {
    return function (req, res, next) {
      if (req.headers['x-forwarded-proto'] !== 'https' && req.hostname !== 'localhost' && req.hostname !== 'lvh.me') {
        return res.redirect(
         ['https://', req.get('Host'), req.url].join('')
        );
      }
      next();
    }
  }
  app.use(forceSSL());

  app.use(logger('combined'));

  // App routes
  app.use('/', express.static(path.join(__dirname,'../client')));
  app.use('/api/v1/status', passport.authenticate('bearer', { session: false }), status);
  app.use('/api/v1/config', client_config);

  // Authentication provider
  app.use('/op', provider.callback);
  app.get('/interaction/:grant', (req, res) => {
    const details = provider.interactionDetails(req);

    const view = (() => {
      switch (details.interaction.reason) {
        case 'consent_prompt':
        case 'client_not_authorized':
          return 'interaction';
        default:
          return 'login';
      }
    })();

    res.render(view, { details });
  });
  app.post('/interaction/:grant/confirm', (req, res) => {
    provider.interactionFinished(req, res, {
      consent: {},
    });
  });
  app.post('/interaction/:grant/login', (req, res, next) => {
    Account.authenticate(req.body.email, req.body.password).then((account) => {
      provider.interactionFinished(req, res, {
        login: {
          account: account.accountId,
          acr: '1',
          remember: !!req.body.remember,
          ts: Math.floor(Date.now() / 1000),
        },
        consent: {
          // TODO: remove offline_access from scopes is remember is not checked
        },
      });
    }).catch(next);
  });
  //app.use(provider.callback);

  // For all GET requests, send back index.html so that PathLocationStrategy can be used
  app.all('*', (req: any, res: any) => {
    res.status(200).sendFile(path.join(__dirname, '../client/index.html'));
  });

  // Catch 404 and forward to error handler
  app.use((req,res,next) => {
    var err = new Error('Not Found');
    err['status'] = 404;
    next(err);
  });

  // Error handlers
  // Development error handler - will print stacktrace
  if(config.is_development) {
    // allow us to call self-signed https
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

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
});

export default app;
