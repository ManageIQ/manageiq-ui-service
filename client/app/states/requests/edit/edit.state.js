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
      'requests.edit': {
        url: '/edit/:requestId',
        templateUrl: 'app/states/requests/edit/edit.html',
        controller: EditRequestController,
        controllerAs: 'vm',
        title: N_('Edit Request'),
        resolve: {
          request: resolveRequest,
          dialogs: resolveDialogs,
        },
      },
    };
  }

 /** @ngInject */
  function resolveRequest($stateParams, CollectionsApi) {
    var options = {attributes: ['provision_dialog', 'picture','service_order', 'picture.image_href']};
    return CollectionsApi.get('requests', $stateParams.requestId, options);
  }

  /** @ngInject */
  function resolveDialogs(request, CollectionsApi) {
    var options = {expand: 'resources', attributes: 'content'};

    return CollectionsApi.query('service_templates/' + request.source_id + '/service_dialogs', options);
  }

  /** @ngInject */
  function EditRequestController($state, CollectionsApi, request, EventNotifications) {
    var vm = this;
    console.log(request);//source id is the the service template id
    vm.title = request.description;
    vm.request = request;
    function saveRequest(){
      console.log(vm.request);
        CollectionsApi.post(
        'service_requests',
        request.id,
        {},
        angular.toJson({action: 'edit', options: vm.request.options})
      ).then(submitSuccess, submitFailure);
    

    }
    vm.saveRequest=saveRequest;

      function submitSuccess(result) {
        EventNotifications.success(result.message);
      // $state.go('services.details', {serviceId: $stateParams.serviceId});
      }

      function submitFailure(result) {
        EventNotifications.error(__('There was an error submitting this request: ') + result);
      }




    }
})();
