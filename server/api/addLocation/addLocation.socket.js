/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var AddLocation = require('./addLocation.model');

exports.register = function(socket) {
  AddLocation.schema.post('save', function (doc) {
    onSave(socket, doc);
  });
  AddLocation.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });
}

function onSave(socket, doc, cb) {
  socket.emit('addLocation:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('addLocation:remove', doc);
}