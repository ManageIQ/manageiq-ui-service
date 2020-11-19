export const IconStatusComponent = {
  controllerAs: 'vm',
  controller: ComponentController,
  bindings: {
    status: '<',
    success: '<?',
    error: '<?',
    queued: '<?',
    inprogress: '<?'
  },
  template: `
   <i
     class="pficon pficon-ok"
     ng-if="vm.isSuccess"
     tooltip-append-to-body="true"
     tooltip-placement="bottom"
     tooltip-popup-delay="1000"
     uib-tooltip="{{vm.status}}"
   ></i>
   <i
     class="pficon pficon-error-circle-o"
     ng-if="vm.isError"
     tooltip-append-to-body="true"
     tooltip-placement="bottom"
     tooltip-popup-delay="1000"
     uib-tooltip="{{vm.status}}"
   ></i>
   <span
     class="spinner spinner-xs spinner-inline"
     ng-if="vm.isInprogress"
   ></span>
   <i
     class="fa fa-hourglass-half"
     ng-if="vm.isQueued"
     tooltip-append-to-body="true"
     tooltip-placement="bottom"
     tooltip-popup-delay="1000"
     uib-tooltip="{{vm.status}}"
   ></i>
   <i
     class="pficon pficon-help"
     ng-if="vm.isUnknown"
     tooltip-append-to-body="true"
     tooltip-placement="bottom"
     tooltip-popup-delay="1000"
     uib-tooltip="{{vm.status}}"
   ></i>
  `,
}

/** @ngInject */
function ComponentController (lodash) {
  const vm = this
  vm.$onChanges = function () {
    vm.status = lodash.capitalize(vm.status)

    const lower = vm.status.toLowerCase();
    angular.extend(vm, {
      isSuccess: vm.success ? vm.success.some((status) => status.toLowerCase() === lower) : false,
      isError: vm.error ? vm.error.some((status) => status.toLowerCase() === lower) : false,
      isQueued: vm.queued ? vm.queued.some((status) => status.toLowerCase() === lower) : false,
      isInprogress: vm.inprogress ? vm.inprogress.some((status) => status.toLowerCase() === lower) : false
    })

    vm.isUnknown = !vm.isSuccess && !vm.isError && !vm.isQueued && !vm.isInprogress
  }
}
