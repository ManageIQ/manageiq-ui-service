/* eslint-disable no-undef */

'use strict'

var httpProxy = require('http-proxy')
var proxyService = require('./proxy')()

var proxyHost = proxyService.proxyHost()
var proxyTarget = 'http://' + proxyHost

var wsProxy = httpProxy.createProxyServer({
  target: proxyTarget,
  ws: true
})

module.exports = wsProxy
