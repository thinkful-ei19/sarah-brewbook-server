'use strict';

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const { PORT, CLIENT_ORIGIN } = require('./config');
const { dbConnect } = require('./db-mongoose');
// const {dbConnect} = require('./db-knex');

const app = express();
const brews = 
  [
    "Allagash Dubbel Reserve",
    "Amsterdam Framboise",
    "Bitter Woman From Hell Extra IPA",
    "Corsendonk Abbey Brown Ale",
    "Dogfish Head 90 Minute Imperial IPA",
    "Erdinger Weißbier Dunkel",
    "Kirin Autumn Lager",
    "Lagunitas India Pale Ale",
    "Russian River Blind Pig IPA",
    "Speakeasy Prohibition Ale",
    "Trappistes Rochefort",
    "Westmalle Trappist Tripel"
];

app.use(
  morgan(process.env.NODE_ENV === 'production' ? 'common' : 'dev', {
    skip: (req, res) => process.env.NODE_ENV === 'test'
  })
);

app.use(
  cors({
    origin: CLIENT_ORIGIN
  })
);

app.get('/api/brews', (req, res) => {
  res.json(brews);
});

function runServer(port = PORT) {
  const server = app
    .listen(port, () => {
      console.info(`App listening on port ${server.address().port}`);
    })
    .on('error', err => {
      console.error('Express failed to start');
      console.error(err);
    });
}

if (require.main === module) {
  dbConnect();
  runServer();
}

module.exports = { app };
