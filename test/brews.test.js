'use strict';
const {app} = require('../index');
const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const { TEST_MONGODB_URI, JWT_SECRET } = require('../config');

const { dbConnect, dbDisconnect } = require('../db-mongoose');

const Brew = require('../models/brew');
const User = require('../models/user');

const seedBrews = require('../db/seed/brews');
const seedUsers = require('../db/seed/users');

const expect = chai.expect;

chai.use(chaiHttp);

describe('Reality Check', () => {

  it('true should be true', () => {
    expect(true).to.be.true;
  });
  
  it('2 + 2 should equal 4 (except in 1984)', () => {
    expect(2 + 2).to.equal(4);
  });
  
});

describe('Brewbook API - Brews', function () {

  let user;
  let token;

  before(function () {
    return dbConnect(TEST_MONGODB_URI);
    // return mongoose.connect(TEST_MONGODB_URI)
    //   .then(() => mongoose.connection.db.dropDatabase());
  });

  beforeEach(function () {
    return Promise.all([
      User.insertMany(seedUsers),
      User.ensureIndexes(),
      Brew.insertMany(seedBrews),
      Brew.ensureIndexes()
      // Tag.insertMany(seedTags),
      // Tag.ensureIndexes()
    ]).then(([users]) => {
      user = users[0];
      console.log(user);
      token = jwt.sign({ user }, JWT_SECRET, { subject: user.username });
    });
  });

  afterEach(function () {
    return mongoose.connection.db.dropDatabase();
  });

  after(function () {
    return dbDisconnect();
  });

  describe('GET /api/brews', function () {

    it('should return the correct number of Brews', function () {
      const dbPromise = Brew.find({userId: user.id});
      const apiPromise = chai.request(app)
        .get('/api/brews')
        .set('Authorization', `Bearer ${token}`);

      return Promise.all([dbPromise, apiPromise])
        .then(([data, res]) => {
          expect(res).to.have.status(200);
          expect(res).to.be.json;
          expect(res.body).to.be.a('array');
          expect(res.body).to.have.length(data.length);
        });
    });

    it('should return a list with the correct fields', function () {
      const dbPromise = Brew.find({userId: user.id});
      const apiPromise = chai.request(app)
        .get('/api/brews')
        .set('Authorization', `Bearer ${token}`);

      return Promise.all([dbPromise, apiPromise])
        .then(([data, res]) => {
          console.log(res.body);
          expect(res).to.have.status(200);
          expect(res).to.be.json;
          expect(res.body).to.be.a('array');
          expect(res.body).to.have.length(data.length);
          res.body.forEach(function (item) {
            expect(item).to.be.a('object');
            expect(item).to.have.keys('id', 'name', 'recipe', 'notes', 'created', 'userId');
          });
        });
    });


  });
  

});