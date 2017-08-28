/* eslint-disable no-undef, angular/log */

'use strict'

var express = require('express')

var router = express.Router()

router.use(express.static('./client'))
router.use(express.static('./images'))
router.use(express.static('./.tmp'))
router.use(express.static('./node_modules'))

module.exports = router
