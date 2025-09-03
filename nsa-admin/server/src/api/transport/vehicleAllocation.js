/**
 * Created by bharatkumarr on 20/03/17.
 */

var express = require('express')
    , router = express.Router()
    , vehicleAllocation = require('../../services/transport/vehicleAllocation.service');

router.get('/', vehicleAllocation.getAllVehicleAllocations);
router.get('/create/json', vehicleAllocation.generateVehicleJson);
router.get('/student/:id', vehicleAllocation.getVehicleAllocationByUser);
router.get('/route/:routeId', vehicleAllocation.getVehicleAllocationByRoute);
router.get('/users/:classId/:sectionId',vehicleAllocation.getStudentsByClassSection);
router.get('/:id', vehicleAllocation.getVehicleAllocation);
router.post('/', vehicleAllocation.saveVehicleAllocation);
router.put('/:id', vehicleAllocation.updateVehicleAllocation);
router.delete('/:id', vehicleAllocation.deleteVehicleAllocation);

module.exports = router;