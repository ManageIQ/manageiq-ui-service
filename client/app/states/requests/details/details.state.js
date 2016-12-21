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
      'requests.details': {
        url: '/:requestId',
        templateUrl: 'app/states/requests/details/details.html',
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
  function RequestDetailsController(request, CollectionsApi, DialogFieldRefresh, EventNotifications) {
    var vm = this;
    vm.editingDisabled = true;

    vm.title = request.description;
    vm.request = request;
    vm.dialogs = [];
    vm.dialogs.push(request.provision_dialog);

    var autoRefreshableDialogFields = [];
    var allDialogFields = [];

    DialogFieldRefresh.setupDialogData(vm.dialogs, allDialogFields, autoRefreshableDialogFields);

    var dialogUrl = 'service_catalogs/' + vm.request.source_id + '/service_templates';

    angular.forEach(allDialogFields, function(dialogField) {
      dialogField.refreshSingleDialogField = function() {
        DialogFieldRefresh.refreshSingleDialogField(allDialogFields, dialogField, dialogUrl, vm.request.source_id);
      };
    });

    function saveRequest() {
      var dialogData = dataForSubmit();
  
      CollectionsApi.post(
        'service_requests',
        request.id,
        {},
        { action: 'edit', options: { "dialog": dialogData } }
      ).then(submitSuccess, submitFailure);
    }
    function dataForSubmit() {
      var dialogFieldData = {};
     
      angular.forEach(allDialogFields, function(dialogField) {
        if ((dialogField.type === "DialogFieldTagControl" || dialogField.type === "DialogFieldDropDownList")
            && dialogField.default_value instanceof Array) {
          dialogFieldData['dialog_' + dialogField.name] = dialogField.default_value.join();
        } else {
          dialogFieldData['dialog_' + dialogField.name] = dialogField.default_value;
        }
      });

      return dialogFieldData;
    }
    vm.saveRequest = saveRequest;

    function submitSuccess(result) {
      EventNotifications.success(result.message);
      // $state.go('services.details', {serviceId: $stateParams.serviceId});
    }

    function submitFailure(result) {
      EventNotifications.error(__('There was an error submitting this request: ') + result);
    }
  }
})();
