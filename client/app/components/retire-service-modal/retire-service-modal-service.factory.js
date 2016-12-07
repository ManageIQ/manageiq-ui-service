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

    function showModal(services) {
      var modalOptions = {
        templateUrl: 'app/components/retire-service-modal/retire-service-modal.html',
        controller: RetireServiceModalController,
        controllerAs: 'vm',
        size: 'lg',
        resolve: {
          services: resolveServices,
        },
      };
      var modal = $modal.open(modalOptions);

      return modal.result;

      function resolveServices() {
        return services;
      }
    }
  }

  /** @ngInject */
  function RetireServiceModalController($scope, $state, $modalInstance, CollectionsApi, EventNotifications, moment, services, lodash) {
    var vm = this;

    angular.extend(vm, {
      visibleOptions: [],
      modalData: {
        date: new Date(),
        warn: 0,
      },
      isService: services.length === 1,
      resetModal: false,
      services: services,
      save: save,
      reset: reset,
      cancel: cancel,
    });


    vm.dateOptions = {
      autoclose: true,
      todayBtn: 'linked',
      todayHighlight: true,
      startDate: new Date(),
    };

    vm.warningOptions = [
      {value: 0, label: __('No Warning')},
      {value: 7, label: __('1 Week')},
      {value: 14, label: __('2 Weeks')},
      {value: 21, label: __('3 Weeks')},
      {value: 28, label: __('4 Weeks')},
    ];

    activate();

    function activate() {
      if (vm.isService) {
        vm.modalData.id = vm.services[0].id;
        vm.resetModal = true;
        var existingDate = new Date(vm.services[0].retires_on);
        var existingUTCDate = new Date(existingDate.getTime() + existingDate.getTimezoneOffset() * 60000);
        vm.modalData.date = vm.services[0].retires_on ? existingUTCDate : new Date();
        vm.modalData.warn = vm.services[0].retirement_warn || 0;
      }

      $scope.$watch('vm.modalData.date', function(date) {
        var daysBetween = moment(date).diff(moment(), 'days');

        vm.visibleOptions = vm.warningOptions.filter(function(option) {
          return option.value <= daysBetween;
        });
      });
    }

    function save() {
      var data = {
        action: 'retire',
        resources: null,
      };

      if (vm.isService) {
        data.resources = [vm.modalData];
      } else {
        var resources = [];
        angular.copy(vm.services, resources);
        lodash.forEach(resources, setRetire);
        data.resources = resources;
      }

      CollectionsApi.post('services', '', {}, data).then(saveSuccess, saveFailure);

      function saveSuccess() {
        $modalInstance.close();
        EventNotifications.success(__('Scheduling retirement.'));
        $state.go($state.current, {}, {reload: true});
      }

      function saveFailure() {
        EventNotifications.error(__('There was an error retiring this service.'));
      }

      function setRetire(service) {
        service.date = vm.modalData.date;
        service.warn = vm.modalData.warn;
      }
    }

    function cancel() {
      $modalInstance.dismiss();
    }

    function reset(event) {
      angular.copy(event.original, this.modalData); // eslint-disable-line angular/controller-as-vm
    }
  }
})();
