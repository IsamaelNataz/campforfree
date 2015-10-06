'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var AddLocationSchema = new Schema({
  name: String,
  longitude: String,
  latitude: String,
  active: Boolean
});

module.exports = mongoose.model('AddLocation', AddLocationSchema);
