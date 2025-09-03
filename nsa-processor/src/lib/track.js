/**
 * Created by bharatkumarr on 12/07/17.
 */

global.config = JSON.parse(process.argv[2]);
global.transportTemplate = JSON.parse(process.argv[3]);
global.transportNotify = JSON.parse(process.argv[4]);
var vehicleNotified = JSON.parse(process.argv[5]);
var vehicles = JSON.parse(process.argv[6]);

if (global) {
    var track = require('./livetrack');
    track.livetrack(vehicleNotified, vehicles);
}