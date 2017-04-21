/* eslint camelcase: "off" */
import templateUrl from "./service-details-ansible.html";

export const ServiceDetailsAnsibleComponent = {
  controller: ComponentController,
  controllerAs: 'vm',
  bindings: {
    service: '<',
  },
  templateUrl,
};

/** @ngInject */
function ComponentController(ModalService, ServicesState, lodash) {
  const vm = this;
  vm.$onInit = activate;
  vm.$onChanges = changes;

  function activate() {
    angular.extend(vm, {
      // Functions
      fetchResources: fetchResources,
      sampleAction: angular.noop(),
      viewPlay: angular.noop(),
      watchLive: watchLive,
      elapsed: elapsed,

      // Config
      credListConfig: credListConfig(),
      playsListConfig: playsListConfig(),
    });
  }

  function changes() {
    fetchResources();
  }

  function fetchResources() {
    vm.loading = true;
    const credentialTypes = ['credential_id', 'network_credential_id', 'machine_credential_id'];

    if (angular.isDefined(vm.service.options.config_info)) {
      vm.orcStacks = {};
      vm.service.service_resources.forEach((resource) => {
        const resourceName = resource.name.toLowerCase();
        vm.orcStacks[resourceName] = {};
        vm.orcStacks[resourceName].stack = lodash.find(vm.service.orchestration_stacks, {'id': resource.resource_id});
        vm.orcStacks[resourceName].resource = resource;

        vm.orcStacks[resourceName].credentials = [];
        credentialTypes.forEach((credential) => {
          if (angular.isDefined(vm.service.options.config_info[resourceName][credential])) {
            ServicesState.getServiceCredential(vm.service.options.config_info[resourceName][credential]).then((response) => {
              response.type = response.type.substring(response.type.lastIndexOf('::') + 2, response.type.lastIndexOf('Credential'));
              vm.orcStacks[resourceName].credentials.push(response);
            });
          }
        });

        ServicesState.getServiceRepository(vm.service.options.config_info[resourceName].repository_id).then((response) => {
          vm.orcStacks[resourceName].repository = response;
        });

        vm.orcStacks[resourceName].jobs = [];
        vm.orcStacks[resourceName].output = {};
        ServicesState.getServiceJobsStdout(vm.service.id, vm.orcStacks[resourceName].stack.id).then((response) => {
          vm.orcStacks[resourceName].stdout = response.stdout || 'No standard out avaliable.';
          vm.orcStacks[resourceName].jobs = response.job_plays;
          vm.orcStacks[resourceName].jobs.forEach((item) => {
            item.elapsed = vm.elapsed(item.finish_time, item.start_time);
          });
        });
      });
    }
    vm.loading = false;
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


