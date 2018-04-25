'use strict';

const express = require('express');
const router = express.Router();

const mongoose = require('mongoose');
const Brew = require('../models/brew');


//GET all brews
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

//GET single brew by ID
router.get('/brews/:id', (req, res, next) => {
  const { id } = req.params;
  console.log(id);

  if (!mongoose.Types.ObjectId.isValid(id)) {
    const err = new Error('Not a valid `id`');
    err.status = 400;
    return next(err);
  }
  Brew.findById(id)
    .then(brew => {
      if (brew) {
        res.json(brew);
        console.log(brew);
      } else {
        next();
      }
    })
    .catch(err => {
      next(err);
    });
});


router.post('/brews', (req, res) => {
  const {name, recipe, notes} = req.body;
  const newBrew = {
    name, recipe, notes
  };
  return Brew.create(newBrew)
    .then(result => {
      res.location(`${req.originalUrl}/${result.id}`).status(201).json(result);
      console.log(result);
    });
    // .next();
});

module.exports = router;
