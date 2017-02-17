/* eslint camelcase: "off" */
import templateUrl from './service-details-ansible.html';

export const ServiceDetailsAnsibleComponent = {
  controller: ComponentController,
  controllerAs: 'vm',
  bindings: {
    results: '<',
  },
  templateUrl,
};

/** @ngInject */
function ComponentController(ModalService) {
  const vm = this;
  vm.$onInit = activate();

  function activate() {
    angular.extend(vm, {
      // Data
      plays: {
        open: true,
        resources: [],
      },
      creds: {
        open: true,
        resources: [],
      },
      results: {
        resources: [],
      },
      output: "",

      // Functions
      sampleAction: angular.noop(),
      viewPlay: angular.noop(),
      watchLive: watchLive,

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
}


