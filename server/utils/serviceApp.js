'use strict';

var express = require('express');

var router = express.Router();

router.use(express.static('./client'));
router.use(express.static('./.tmp'));
router.use(express.static('./bower_components'));

module.exports = router;
