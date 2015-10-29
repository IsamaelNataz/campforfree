'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var AddLocationSchema = new Schema({
  name: String,
  info: String,
  coords: String,
  tags: [],
  userid: String,
  active: Boolean
});

module.exports = mongoose.model('AddLocation', AddLocationSchema);
