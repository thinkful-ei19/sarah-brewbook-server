'use strict';

const mongoose = require('mongoose');

const { DATABASE_URL } = require('../config');
const User = require('../models/user');
const seedUsers = require('../db/seed/users');
const Brew = require('../models/brew');
const seedBrews = require('../db/seed/brews');

mongoose.connect(DATABASE_URL)
  .then(() => mongoose.connection.db.dropDatabase())
  .then(() => {
    return Promise.all([
      User.insertMany(seedUsers),
      User.createIndexes(),
      Brew.insertMany(seedBrews),
      Brew.createIndexes()
    ]);
  })
  .then(() => mongoose.disconnect())
  .catch(err => {
    console.error(`ERROR: ${err.message}`);
    console.error(err);
  });