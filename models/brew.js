'use strict';

const mongoose = require('mongoose');

const brewSchema = new mongoose.Schema({
  name: { type: String },
  recipe: { type: String },
  notes: { type: String},
  created: { type: Date, default: Date.now },
  // folderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Folder' },
  // tags: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tag' }],
  // userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
});

brewSchema.set('toObject', {
  transform: function (doc, ret) {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
  }
});

module.exports = mongoose.model('Brew', brewSchema);