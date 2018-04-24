'use strict';

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const { PORT, CLIENT_ORIGIN } = require('./config');
const { dbConnect } = require('./db-mongoose');
// const {dbConnect} = require('./db-knex');
const bodyParser = require('body-parser');

// const brewRouter = require('./routes/brews';)

const app = express();
const brews = 
  [
    {name:'Allagash Dubbel Reserve',
      recipe: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
      notes: 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
    } 
    // "Amsterdam Framboise",
    // "Bitter Woman From Hell Extra IPA",
    // "Corsendonk Abbey Brown Ale",
    // "Dogfish Head 90 Minute Imperial IPA",
    // "Erdinger Weißbier Dunkel",
    // "Kirin Autumn Lager",
    // "Lagunitas India Pale Ale",
    // "Russian River Blind Pig IPA",
    // "Speakeasy Prohibition Ale",
    // "Trappistes Rochefort",
    // "Westmalle Trappist Tripel"
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

app.use(bodyParser.json());

app.get('/api/brews', (req, res) => {
  res.json(brews);
});

app.post('/api/brews', (req, res)=>{
  const {name, recipe, notes}=req.body;
  console.log(name, recipe, notes);
  res.json("name, recipe, notes");
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
