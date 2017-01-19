const text = {
  app: {
    name: 'ManageIQ Self Service',
  },
  login: {
    brand: '<strong>ManageIQ</strong> Self Service',
  },
};

export default angular
  .module('app.skin', [])
  .constant('Text', text)
  .config(configure)
  .name;

/** @ngInject */
function configure(routerHelperProvider, exceptionHandlerProvider) {
  exceptionHandlerProvider.configure('[ManageIQ] ');
  routerHelperProvider.configure({docTitle: 'ManageIQ: '});
}
