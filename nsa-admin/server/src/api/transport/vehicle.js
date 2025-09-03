/**
 * Created by bharatkumarr on 20/03/17.
 */

var express = require('express')
    , router = express.Router()
    , vehicle = require('../../services/transport/vehicle.service')

router.get('/', vehicle.getAllVehicles);
router.get('/active', vehicle.getActiveVehicles);
router.get('/:id', vehicle.getVehicle);
router.post('/', vehicle.saveVehicle);
router.put('/:id', vehicle.updateVehicle);
router.patch('/:id', vehicle.statusChange);
router.delete('/:id', vehicle.deleteVehicle);

router.get('/route/:id', vehicle.getRoutesByVehicle);


module.exports = router;
