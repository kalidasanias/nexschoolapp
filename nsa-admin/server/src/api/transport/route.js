/**
 * Created by bharatkumarr on 20/03/17.
 */

var express = require('express')
    , router = express.Router()
    , route = require('../../services/transport/route.service')

router.get('/', route.getAllRoutes);
router.get('/:id', route.getRoute);
router.post('/', route.saveRoute);
router.put('/:id', route.updateRoute);
router.delete('/:id', route.deleteRoute);

module.exports = router;