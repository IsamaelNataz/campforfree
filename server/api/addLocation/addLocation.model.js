'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var AddLocationSchema = new Schema({
  name: String,
  info: String,
  latitude: Number,
  longitude: Number,
  tags: [],
  userid: String,
  date: { type: Date, default: Date.now },
  active: Boolean
});

module.exports = mongoose.model('AddLocation', AddLocationSchema);
