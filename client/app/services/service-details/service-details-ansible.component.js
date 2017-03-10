/* eslint camelcase: "off" */
import templateUrl from './service-details-ansible.html';

export const ServiceDetailsAnsibleComponent = {
  controller: ComponentController,
  controllerAs: 'vm',
  bindings: {
    service: '<',
  },
  templateUrl,
};

/** @ngInject */
function ComponentController(ModalService) {
  const vm = this;
  vm.$onInit = activate();

  function activate() {
    angular.extend(vm, {
      oStacks: vm.service.orchestration_stacks[0],
      output: "",
      plays: {
        open: true,
        resources: [],
      },

      // Functions
      sampleAction: angular.noop(),
      viewPlay: angular.noop(),
      watchLive: watchLive,
      elapsed: elapsed,

      // Config
      credListConfig: credListConfig(),
      playsListConfig: playsListConfig(),
    });
  }

  function credListConfig() {
    return {
      showSelectBox: false,
      selectionMatchProp: 'id',
    };
  }

  function playsListConfig() {
    return {
      showSelectBox: false,
      selectionMatchProp: 'id',
    };
  }

  function watchLive(item) {
    const modalOptions = {
      component: 'serviceDetailsAnsibleModal',
      resolve: {
        item: function() {
          return item;
        },
      },
    };
    ModalService.open(modalOptions);
  }

  function elapsed(finish, start) {
    return Math.abs(new Date(finish) - new Date(start)) / 100;
  }
}


