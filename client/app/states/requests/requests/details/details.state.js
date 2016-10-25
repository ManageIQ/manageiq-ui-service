(function() {
  'use strict';

  angular.module('app.states')
    .run(appRun);

  /** @ngInject */
  function appRun(routerHelper) {
    routerHelper.configureStates(getStates());
  }

  function getStates() {
    return {
      'requests.requests.details': {
        url: '/:requestId',
        templateUrl: 'app/states/requests/requests/details/details.html',
        controller: RequestDetailsController,
        controllerAs: 'vm',
        title: N_('Request Details'),
        resolve: {
          request: resolveRequest,
        },
      },
    };
  }

  /** @ngInject */
  function resolveRequest($stateParams, CollectionsApi) {
    var options = {attributes: ['provision_dialog', 'picture', 'picture.image_href']};

    return CollectionsApi.get('requests', $stateParams.requestId, options);
  }

  /** @ngInject */
  function RequestDetailsController(request) {
    var vm = this;

    vm.request = request;
  }
})();
