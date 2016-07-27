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
      'marketplace.details': {
        url: '/:serviceTemplateId',
        templateUrl: 'app/states/marketplace/details/details.html',
        controller: StateController,
        controllerAs: 'vm',
        title: N_('Service Template Details'),
        resolve: {
          dialogs: resolveDialogs,
          serviceTemplate: resolveServiceTemplate
        }
      }
    };
  }

  /** @ngInject */
  function resolveServiceTemplate($stateParams, CollectionsApi) {
    var options = {attributes: ['picture', 'picture.image_href']};

    return CollectionsApi.get('service_templates', $stateParams.serviceTemplateId, options);
  }

  /** @ngInject */
  function resolveDialogs($stateParams, CollectionsApi) {
    var options = {expand: 'resources', attributes: 'content'};

    return CollectionsApi.query('service_templates/' + $stateParams.serviceTemplateId + '/service_dialogs', options);
  }

  /** @ngInject */
  function StateController($state, CollectionsApi, dialogs, serviceTemplate, Notifications, DialogFieldRefresh, ShoppingCart) {
    var vm = this;

    vm.serviceTemplate = serviceTemplate;

    if (dialogs.subcount > 0) {
      vm.dialogs = dialogs.resources[0].content;
    }

    vm.addToCart = addToCart;
    vm.cartAllowed = ShoppingCart.allowed;

    var autoRefreshableDialogFields = [];
    var allDialogFields = [];

    DialogFieldRefresh.setupDialogData(vm.dialogs, allDialogFields, autoRefreshableDialogFields);

    var dialogUrl = 'service_catalogs/' + serviceTemplate.service_template_catalog_id + '/service_templates';

    angular.forEach(allDialogFields, function(dialogField) {
      dialogField.refreshSingleDialogField = function() {
        DialogFieldRefresh.refreshSingleDialogField(allDialogFields, dialogField, dialogUrl, vm.serviceTemplate.id);
      };
    });

    DialogFieldRefresh.listenForAutoRefreshMessages(
      allDialogFields,
      autoRefreshableDialogFields,
      dialogUrl,
      vm.serviceTemplate.id
    );

    function dataForSubmit(href) {
      var dialogFieldData = {};
      dialogFieldData[href] = '/api/service_templates/' + serviceTemplate.id;

      angular.forEach(allDialogFields, function(dialogField) {
        dialogFieldData[dialogField.name] = dialogField.default_value;
      });

      return dialogFieldData;
    }

    function addToCart() {
      if (!ShoppingCart.allowed()) {
        return;
      }

      var dialogFieldData = dataForSubmit('service_template_href');

      ShoppingCart.add({
        description: vm.serviceTemplate.name,
        data: dialogFieldData,
      })
      .then(addSuccess, addFailure);

      function addSuccess(result) {
        Notifications.success(__("Item added to shopping cart"));
      }

      function addFailure(result) {
        var errors = result.split(",");
        for (var i = 0; i<errors.length; ++i) {
          Notifications.error(__("There was an error adding to shopping cart: ") + errors[i]);
        }
      }
    }
  }
})();
