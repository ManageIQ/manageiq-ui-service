const text = {
  app: {
    name: 'ManageIQ Service UI'
  },
  login: {
    brand: '<strong>ManageIQ</strong> Service UI'
  }
}

export const SkinModule = angular
  .module('app.skin', [])
  .constant('Text', text)
  .config(configure)
  .name

/** @ngInject */
function configure (routerHelperProvider, exceptionHandlerProvider) {
  exceptionHandlerProvider.configure('[ManageIQ] ')
  routerHelperProvider.configure({docTitle: 'ManageIQ: '})
}
