'use strict';

const express = require('express');
const router = express.Router();

const mongoose = require('mongoose');
const Brew = require('../models/brew');


//GET all brews
router.get('/brews', (req, res, next) => {
  //update for userId
  console.log(req.body);
  const userId = req.user.id;
  let filter = {userId};

  return Brew.find(filter)
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


router.post('/brews', (req, res, next) => {
  const {name, recipe, notes} = req.body;
  const userId = req.user.id;
  console.log(userId);

  //validate input
  if (!name) {
    const err = new Error('Missing `name` in request body');
    err.status = 400;
    return next(err);
  }

  if (!recipe) {
    const err = new Error('Missing `recipe` in request body');
    err.status = 400;
    return next(err);
  }

  const newBrew = {
    name, recipe, notes, userId
  };
  return Brew.create(newBrew)
    .then(result => {
      res.location(`${req.originalUrl}/${result.id}`).status(201).json(result);
      console.log(result);
    })
    .catch(err => {
      next(err);
    });
});

router.put('/brews/:id', (req, res, next) => {
  const { id } = req.params;
  const { name, recipe, notes } = req.body;
  const userId = req.user.id;

  const updateBrew = { name, recipe, notes, userId };
  const options = { new: true };

  /***** Never trust users or developers - validate input *****/
  if (!name) {
    const err = new Error('Missing `name` in request body');
    err.status = 400;
    return next(err);
  }

  if (!mongoose.Types.ObjectId.isValid(id)) {
    const err = new Error('The `id` is not valid');
    err.status = 400;
    return next(err);
  }

  return Brew.findByIdAndUpdate(id, updateBrew, options)
    .then(result => {
      if (result) {
        res.json(result);
      } else {
        next();
      }
    })
    .catch(err => {
      next(err);
    });
});

/* ========== DELETE/REMOVE A SINGLE ITEM ========== */
router.delete('/brews/:id', (req, res, next) => {
  const { id } = req.params;
  const userId = req.user.id;

  Brew.findOneAndRemove({_id: id, userId})
    .then(result => {
      if(result) {
        res.status(204).end();
      } else {
        next();
      }
    })
    .catch(err => {
      next(err);
    });
});

module.exports = router;
