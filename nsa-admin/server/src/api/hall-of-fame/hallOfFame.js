/**
 * Created by intellishine on 9/12/2017.
 */
var express = require('express')
    , router = express.Router()
    , hallOfFame = require('../../services/hall-of-fame/hallOfFame.service');


router.get('/', hallOfFame.getAllHallOfFames);
router.get('/publish/', hallOfFame.getPublishHallOfFame);
router.get('/awards', hallOfFame.getAllAwards);
router.get('/details/:id', hallOfFame.getHallOfDetailsById);
router.get('/parent/:id', hallOfFame.getHallOfFameByUserName);
router.get('/:id', hallOfFame.getHallOfFameById);
router.post('/',  hallOfFame.saveHallOfFame);
router.put('/:id',  hallOfFame.saveHallOfFame);
router.delete('/:id', hallOfFame.deleteHallOfFame);


module.exports = router;