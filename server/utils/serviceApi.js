/* eslint-disable no-undef, no-console, angular/log */

const express = require('express')
const httpProxy = require('http-proxy')
const url = require('url')
const proxyService = require('./proxy')()

const router = express.Router()

const proxyHost = proxyService.proxyHost()
const proxyTarget = 'http://' + proxyHost + '/api'
const proxyErrorHandler = proxyService.proxyErrorHandler

const proxy = httpProxy.createProxyServer({
  target: proxyTarget
})

router.use(function (req, res) {
  const path = url.parse(req.url).path
  console.log('PROXY: ' + proxyTarget + path)
  if (req.url === '/?attributes=authorization') {
    req.url = '?attributes=authorization'
  }
  proxy.web(req, res, proxyErrorHandler(req, res))
})

module.exports = router
