(function() {
  'use strict';

  angular.module('app.components')
    .factory('RetireServiceModal', RetireServiceFactory);

  /** @ngInject */
  function RetireServiceFactory($modal) {
    var modalService = {
      showModal: showModal,
    };

    return modalService;

    function showModal(serviceDetails) {
      var modalOptions = {
        templateUrl: 'app/components/retire-service-modal/retire-service-modal.html',
        controller: RetireServiceModalController,
        controllerAs: 'vm',
        size: 'lg',
        resolve: {
          serviceDetails: resolveServiceDetails,
        },
      };
      var modal = $modal.open(modalOptions);

      return modal.result;

      function resolveServiceDetails() {
        return serviceDetails;
      }
    }
  }

  /** @ngInject */
  function RetireServiceModalController(serviceDetails, $state, $modalInstance, CollectionsApi, EventNotifications) {
    var vm = this;

    vm.service = serviceDetails;
    vm.retireService = retireService;
    var existingDate = new Date(vm.service.retires_on);
    var existingUTCDate = new Date(existingDate.getTime() + existingDate.getTimezoneOffset() * 60000);
    vm.modalData = {
      action: 'retire',
      resource: {
        date: vm.service.retires_on ? existingUTCDate : new Date(),
        warn: vm.service.retirement_warn || 0,
      },
    };

    vm.dateOptions = {
      autoclose: true,
      clearBtn: true,
      todayBtn: 'linked',
      todayHighlight: true,
      startDate: new Date(),
    };

    vm.warningOptions = [
      { value: 0, label: __('No Warning') },
      { value: 7, label: __('1 Week') },
      { value: 14, label: __('2 Weeks') },
      { value: 21, label: __('3 Weeks') },
      { value: 28, label: __('4 Weeks') },
    ];

    activate();

    function activate() {
    }

    function retireService() {
      var data = angular.copy(vm.modalData);
      data.resource.date = data.resource.date ? data.resource.date : '';

      CollectionsApi.post('services', vm.service.id, {}, data).then(retireSuccess, retireFailure);

      function retireSuccess() {
        $modalInstance.close();
        EventNotifications.success(__('Scheduling retirement for') + vm.service.name  + '.');
        $state.go($state.current, {}, {reload: true});
      }

      function retireFailure() {
        EventNotifications.error(__('There was an error retiring this service.'));
      }
    }
  }
})();
