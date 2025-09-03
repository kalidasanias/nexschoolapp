/**
 * Created by senthil on 03/02/17.
 */
const fs = require('fs')
const request = require('request')

const expect = require('chai').expect

const eventEmitter = require('./producer')

describe('The eventemitter module', function () {
    it('fires the event', function * () {
        expect(eventEmitter.fireEvent);
    })
})