# PochApp

This application is a score tracker for the game Pocha (https://www.nhfournier.es/en/como-jugar/pocha/)

# Requisites
- [Node.js](https://nodejs.org/en/) installed. Verified compatible versions:
  - v22.21.1

- [npm](https://www.npmjs.com/) installed. Verified compatible versions:
  - 10.9.4

## Development server

Run `npm run start` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

Run `npm run start:lan` for a dev server accesible by other devices on your LAN.

## Running tests

Run `npm run test` to:

1. execute e2e tests via [Cypress](https://www.cypress.io/).

## Deploy application

Run `npm run deploy` to build the project and deploy it to github pages

## Other

We use [ng-zorro](https://ng.ant.design/components/overview/en) as component library.

We use [npx-translate](https://github.com/ngx-translate/core) to internationalize the app.

Right now we don't have unit tests configured so we are temporarily using the anti pattern of running unit tests on Cypress 
