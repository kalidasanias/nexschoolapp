'use strict';

var assert = require('assert');
var size = require('require-main')();
var AWS = require('aws-sdk');

// Fill in values for test files in your own buckets for testing
var region = 'FILL_ME_IN';
var validBucket = 'FILL_ME_IN';
var validKey = 'FILL_ME_IN';
var nonImageBucket = 'FILL_ME_IN';
var nonImageKey = 'FILL_ME_IN';

var s3 = new AWS.S3({region: region});

function isSizeDetected(dimensions, length) {
  assert.strictEqual(typeof dimensions, 'object');
  assert.strictEqual(typeof dimensions.width, 'number');
  assert(dimensions.width > 0);
  assert.strictEqual(typeof dimensions.height, 'number');
  assert(dimensions.height > 0);

  assert.strictEqual(typeof length, 'number');
}

describe('http-image-size', function() {
  it('should detect the size of an image on s3', function(done) {
    this.timeout(2500);
    size(s3, validBucket, validKey, function(err, dimensions, length) {
      if (err) {
        done(err);
        return;
      }
      isSizeDetected(dimensions, length);
      done();
    });
  });
  it('should pass an error when the bucket is missing', function(done) {
    size(s3, null, validKey, function(err) {
      assert.ok(err instanceof Error);
      assert.equal(err.name, 'MissingRequiredParameter');
      done();
    });
  });
  it('should pass an error when the key is missing', function(done) {
    size(s3, validBucket, null, function(err) {
      assert.ok(err instanceof Error);
      assert.equal(err.name, 'MissingRequiredParameter');
      done();
    });
  });
  it('should pass an error when the image is not found', function(done) {
    this.timeout(1000);
    size(s3, validBucket, 'noImageHere', function(err) {
      assert.ok(err instanceof Error);
      assert.equal(err.name, 'NoSuchKey');
      done();
    });
  });
  it('should pass an error when the object is not an image', function(done) {
    this.timeout(1000);
    size(s3, nonImageBucket, nonImageKey, function(err) {
      assert.ok(err instanceof Error);
      assert.equal(err.name, 'TypeError');
      done();
    });
  });
});
