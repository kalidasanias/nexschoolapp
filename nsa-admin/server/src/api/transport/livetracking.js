/**
 * Created by bharatkumarr on 27/05/17.
 */

var express = require('express')
    , router = express.Router()
    , track = require('../../services/transport/livetracking.service');

router.get('/:id', track.livetracking);
router.get('/', track.livetrackingall);

module.exports = router;
