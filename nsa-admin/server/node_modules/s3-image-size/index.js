'use strict';

var url = require('url');
var sizeOf = require('image-size');

module.exports = function(s3, bucket, key, callback) {
  var params = {
    Bucket: bucket,
    Key: key,
  };

  var req = s3.getObject(params);
  var buffer = new Buffer([]);
  var dimensions;
  var imageTypeDetectionError;
  var abortedRequest = false;

  // A NoSuchKey error is thrown on both the request and the response. This
  // ensures we call the callback with the error only once.
  var _callback = callback;
  callback = function(err, dimensions, bytesRead) {
    if (!_callback) {return;}
    _callback(err, dimensions, bytesRead);
    _callback = undefined;
  };

  req.on('error', function(err) {
    if (abortedRequest) {return;}
    callback(err);
  });

  req.createReadStream().on('data', function(chunk) {
    buffer = Buffer.concat([buffer, chunk]);
    try {
      dimensions = sizeOf(buffer);
    } catch (err) {
      imageTypeDetectionError = err;
      return;
    }

    abortedRequest = true;
    req.abort();
  }).
  on('error', function(err) {
    if (dimensions) {return;}
    imageTypeDetectionError = err;
  }).
  on('end', function() {
    if (!dimensions) {
      return callback(imageTypeDetectionError);
    }
    return callback(null, dimensions, buffer.length);
  });
};
