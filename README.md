# Angular 2 with Express Api

Seed project for an Angular 2 (CLI) application with an Express Api deployed to Heroku, secured using Okta OIDC.

# Okta

This application uses Okta as an OIDC compliant IDP.

The Okta application should be setup as follows:

* Authorization Code
* Refresh Token
* Implicit (Hybrid)
    * Allow ID Token with implicit grant type
    * Allow Access Token with implicit grant type

The Okta API should have the endpoint of the web application set on it's API to allow CORS requests for the discovery document. If you don't do this, you will get a CORS error when you load the application (when it tries to get the disco document).

# Client

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 1.0.0-beta.32.3.

## Deployment

* `heroku create`
* `git push heroku master`

## Running
### Development

`ng build && tsc -p server/ && node --inspect --debug-brk dist/app/bin/www.js`

### Production

`ng build --aot -prod && tsc -p server/ && npm start`

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive/pipe/service/class/module`.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).
Before running the tests make sure you are serving the app via `ng serve`.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
