export const IconStatusComponent = {
  controllerAs: 'vm',
  controller: ComponentController,
  bindings: {
    status: '<',
    success: '<?',
    error: '<?',
    queued: '<?',
    inprogress: '<?',
  },
  template: `
   <i class="pficon pficon-ok" ng-if="vm.isSuccess"
     uib-tooltip="{{vm.status}}"
     tooltip-append-to-body="true"
     tooltip-popup-delay="1000"
     tooltip-placement="bottom" />
   <i class="pficon pficon-error-circle-o" ng-if="vm.isError"
     uib-tooltip="{{vm.status}}"
     tooltip-append-to-body="true"
     tooltip-popup-delay="1000"
     tooltip-placement="bottom" />
   <span ng-if="vm.isInprogress" class="spinner spinner-xs spinner-inline"/>  
   <i class="fa fa-clock-o" ng-if="vm.isQueued"
     uib-tooltip="{{vm.status}}"
     tooltip-append-to-body="true"
     tooltip-popup-delay="1000"
     tooltip-placement="bottom" />   
   <i class="pficon pficon-help" ng-if="vm.isUnknown"
     uib-tooltip="{{vm.status}}"
     tooltip-append-to-body="true"
     tooltip-popup-delay="1000"
     tooltip-placement="bottom" />
  `,
};

/** @ngInject */
function ComponentController(lodash) {
  const vm = this;
  vm.$onChanges = function() {
    vm.status = lodash.capitalize(vm.status);

    angular.extend(vm, {
      isSuccess: vm.success ? vm.success.some((status) => status.toLowerCase() === vm.status.toLowerCase()) : false,
      isError: vm.error ? vm.error.some((status) => status.toLowerCase() === vm.status.toLowerCase()) : false,
      isQueued: vm.queued ? vm.queued.some((status) => status.toLowerCase() === vm.status.toLowerCase()) : false,
      isInprogress: vm.inprogress ? vm.inprogress.some((status) => status.toLowerCase() === vm.status.toLowerCase()) : false,
    });
    vm.isUnknown = !vm.isSuccess && !vm.isError && !vm.isQueued && !vm.isInprogress;
  };
}
