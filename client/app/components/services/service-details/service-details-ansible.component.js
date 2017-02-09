/* eslint camelcase: "off" */
export const ServiceDetailsAnsibleComponent = {
  controller: ComponentController,
  controllerAs: 'vm',
  bindings: {
    results: '<',
  },
  templateUrl: 'app/components/services/service-details/service-details-ansible.html',
};

/** @ngInject */
function ComponentController() {
  const vm = this;
  vm.$onInit = activate();

  function activate() {
    angular.extend(vm, {
      // Data
      plays: {
        open: true,
        resources: [{
          status: "successful",
          name: "Sample Play",
          description: "Sample play description",
          started: new Date(),
          run_time: 6000,
        }],
      },
      creds: {
        open: true,
        resources: [{provider: "cloud", credential: "this is a sample credential"}],
      },
      output: "",

      // Functions
      sampleAction: angular.noop(),
      viewPlay: angular.noop(),

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
}


