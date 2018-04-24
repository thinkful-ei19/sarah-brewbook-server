'use strict';

const express = require('express');
const router = express.Router();

const mongoose = require('mongoose');
const Brew = require('../models/brew');

router.get('/brews', (req, res, next) => {
  return Brew.find()
    .then(result => {
      res.json(result);
      console.log(result);
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

module.export = router;
