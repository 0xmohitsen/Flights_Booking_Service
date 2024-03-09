const express = require('express');
const { InfoController } = require('../../controllers');

const router = express.Router();

router
    .get('/info', InfoController);

module.exports = router;