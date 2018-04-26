'use strict';

require('dotenv').config();

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const mongoose = require('mongoose');
const passport = require('passport');
//is above redundant bc of db-mongoose.js?

const { PORT, CLIENT_ORIGIN } = require('./config');
const { dbConnect } = require('./db-mongoose');
// const {dbConnect} = require('./db-knex');
const bodyParser = require('body-parser');
const localStrategy = require('./passport/local');
const jwtStrategy = require('./passport/jwt');

//import routers
const brewsRouter = require('./routes/brews');
const usersRouter = require('./routes/users');
const authRouter = require('./routes/auth');

const app = express();
// const brews = 
//   [
//     {name:'Allagash Dubbel Reserve',
//       recipe: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
//       notes: 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
//       //will delete when router functional
//     } 
// ];

//Log all requests but skip logging during test
app.use(
  morgan(process.env.NODE_ENV === 'production' ? 'common' : 'dev', {
    skip: (req, res) => process.env.NODE_ENV === 'test'
  })
);

// Utilize the Express static webserver, passing in the directory name.** Do I need this?**
// app.use(express.static('public'));

app.use(
  cors({
    origin: CLIENT_ORIGIN
  })
);

app.use(bodyParser.json());
// Utilize the Express `.json()` body parser
app.use(express.json());

// call on passport when user authentication is functional
passport.use(localStrategy);
passport.use(jwtStrategy);

//Mount routers
app.use('/api', usersRouter);
app.use('/api', authRouter);

//Endpoint below witll require valid JWT when implemented
app.use(passport.authenticate('jwt', { session: false, failWithError: true }));

//mount routers requiring authentication when implemented
app.use('/api', brewsRouter);


// app.get('/api/brews', (req, res) => {
//   res.json(brews);
// });

// app.post('/api/brews', (req, res)=>{
//   const {name, recipe, notes}=req.body;
//   console.log(name, recipe, notes);
//   res.json("name, recipe, notes");
// });



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
