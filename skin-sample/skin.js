(function () {
  'use strict'

  var text = {
    app: {
      name: 'Magic UI' // app name
    },
    login: {
      brand: 'The <strong>Amazing</strong> Magic UI' // login screen
    }
  }

  angular.module('app.skin', [])
    .constant('Text', text)
    .config(configure)

  /** @ngInject */
  function configure (routerHelperProvider, exceptionHandlerProvider) {
    exceptionHandlerProvider.configure('[MAGIC] ') // error prefix
    routerHelperProvider.configure({docTitle: 'Magic UI: '}) // page title
  }
})()
