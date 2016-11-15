(function() {
  'use strict';

  angular.module('app.components')
    .factory('RetireServiceModal', RetireServiceFactory);

  /** @ngInject */
  function RetireServiceFactory($modal) {
    var modalService = {
      showModal: showModal,
      FactoryController: RetireServiceModalController,
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
  function RetireServiceModalController($scope, serviceDetails, $state, $modalInstance, CollectionsApi, EventNotifications, moment) {
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
    vm.visibleOptions = [];

    activate();

    function activate() {
      $scope.$watch('vm.modalData.resource.date', function(date) {
        var daysBetween = moment(date).diff(moment(), 'days');

        vm.visibleOptions = vm.warningOptions.filter(function(option) {
          return option.value <= daysBetween;
        });
      });
    }

    function retireService() {
      CollectionsApi.post('services', vm.service.id, {}, vm.modalData).then(retireSuccess, retireFailure);

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
