/**
 * Created by Kiranmai A on 1/19/2017.
 */

var express = require('express')
    , router = express.Router()
    , section = require('../../services/section/section.service.js')
    , validator = require('@nsa/nsa-commons').validator;

router.get('/allocation', section.getAllClassSections);

router.get('/', section.getAllSections);
router.get('/active',section.getActiveSections);
router.get('/:id', section.getSection);
router.post('/', validator.section.saveSection, section.saveSection);
router.put('/:id', validator.section.updateSection, section.updateSection);
router.delete('/:id', section.deleteSection);

router.get('/allocation/details/:id', section.getClassSecById);
router.get('/allocation/details', section.getAllClassSections);
router.post('/allocation/details', /*validator.section.saveClassSections,*/ section.saveClassSections);
router.put('/allocation/details/:id',/*validator.section.updateSecByClassAndSec,*/ section.updateSecByClassAndSec);
router.delete('/allocation/details/:classId', section.deleteSecByClass);

router.get('/class/:id', section.getSecByClass);

module.exports = router;