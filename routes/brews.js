'use strict';

const express = require('express');
const router = express.Router();

const mongoose = require('mongoose');
const Brew = require('../models/brew');

router.get('/brews', (req, res, next) => {
  return Brew.find()
    .then(brews => {
      res.json(brews);
      console.log(brews);
    })
    .catch(err => {
      next(err);
    });
});

router.post('/brews', (req, res, next) => {
  const {name, recipe, notes} = res.body.brews;
  const newBrew = {
    name, recipe, notes
  };
  return Brew.create(newBrew)
    .then(result => {
      res.location(`${req.originalUrl}/${result.id}`).status(201).json(result);
      console.log(result);
    })
    .next();
});

module.exports = router;
