'use strict';

var _ = require('lodash');
var AddLocation = require('./addLocation.model');

// Get list of addLocations
exports.index = function(req, res) {
  AddLocation.find({userid : req.user._id}, function (err, addLocations) {
    if(err) { return handleError(res, err); }
    return res.status(200).json(addLocations);
  });
};

//AddLocation.find({userid : req.user._id})
//AddLocation.find({name : "Tjenare"})

// Get a single addLocation
exports.show = function(req, res) {
  AddLocation.findById(req.params.id, function (err, addLocation) {
    if(err) { return handleError(res, err); }
    if(!addLocation) { return res.status(404).send('Not Found'); }
    return res.json(addLocation);
    console.log(req.params.id);
  });
};

// Creates a new addLocation in the DB.
exports.create = function(req, res) {
  AddLocation.create(req.body, function(err, addLocation) {
    if(err) { return handleError(res, err); }
    return res.status(201).json(addLocation);
  });
};

// Updates an existing addLocation in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  AddLocation.findById(req.params.id, function (err, addLocation) {
    if (err) { return handleError(res, err); }
    if(!addLocation) { return res.status(404).send('Not Found'); }
    addLocation.update(req.body, function (err) {
      if (err) { return handleError(res, err); }
      return res.status(200).json(addLocation);
    });
  });
};

// Deletes a addLocation from the DB.
exports.destroy = function(req, res) {
  AddLocation.findById(req.params.id, function (err, addLocation) {
    if(err) { return handleError(res, err); }
    if(!addLocation) { return res.status(404).send('Not Found'); }
    addLocation.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.status(204).send('No Content');
    });
  });
};

function handleError(res, err) {
  return res.status(500).send(err);
}