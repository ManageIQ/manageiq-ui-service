/* eslint camelcase: "off" */
import templateUrl from './service-details-ansible.html'

export const ServiceDetailsAnsibleComponent = {
  controller: ComponentController,
  controllerAs: 'vm',
  bindings: {
    service: '<'
  },
  templateUrl
}

/** @ngInject */
function ComponentController (ModalService, ServicesState, lodash, $sce) {
  const vm = this
  vm.$onInit = activate
  vm.$onChanges = changes

  function activate () {
    angular.extend(vm, {
      // Functions
      fetchResources: fetchResources,
      sampleAction: angular.noop(),
      viewPlay: angular.noop(),
      watchLive: watchLive,
      elapsed: elapsed,

      // Config
      credListConfig: credListConfig(),
      playsListConfig: playsListConfig()
    })
  }

  function changes () {
    fetchResources()
  }

  function fetchResources () {
    vm.loading = true

    if (angular.isDefined(vm.service.options.config_info)) {
      vm.orcStacks = {}
      vm.service.service_resources.forEach((resource) => {
        if (resource.name) {
          const resourceName = resource.name.toLowerCase()
          vm.orcStacks[resourceName] = {}
          vm.orcStacks[resourceName].stack = lodash.find(vm.service.orchestration_stacks, {'id': resource.resource_id})
          vm.orcStacks[resourceName].resource = resource
          vm.orcStacks[resourceName].credentials = []

          if (vm.service.options.dialog && resourceName === 'provision') {
            Object.assign(
              vm.service.options.config_info[resourceName],
              ...Object.keys(vm.service.options.dialog)
              .map(key => ({[normalizeDialogKeys(key)]: vm.service.options.dialog[key]}))
            )
          }

          for (const configItem in vm.service.options.config_info[resourceName]) {
            if (configItem.includes('credential')) {
              ServicesState.getServiceCredential(vm.service.options.config_info[resourceName][configItem]).then((response) => {
                vm.orcStacks[resourceName].credentials.push(processCredential(response))
              })
            }
          }

          ServicesState.getServiceRepository(vm.service.options.config_info[resourceName].repository_id).then((response) => {
            vm.orcStacks[resourceName].repository = response
          })

          vm.orcStacks[resourceName].jobs = []
          vm.orcStacks[resourceName].output = {}
          ServicesState.getServiceJobsStdout(vm.service.id, vm.orcStacks[resourceName].stack.id).then((response) => {
            vm.orcStacks[resourceName].stdout = $sce.trustAsHtml(response.stdout) || 'No standard out avaliable.'
            vm.orcStacks[resourceName].jobs = response.job_plays
            vm.orcStacks[resourceName].jobs.forEach((item) => {
              item.elapsed = vm.elapsed(item.finish_time, item.start_time)
            })
          })
        }
      })
    }
    vm.loading = false
  }

  function credListConfig () {
    return {
      showSelectBox: false,
      selectionMatchProp: 'id'
    }
  }

  function playsListConfig () {
    return {
      showSelectBox: false,
      selectionMatchProp: 'id'
    }
  }

  function watchLive (item) {
    const modalOptions = {
      component: 'serviceDetailsAnsibleModal',
      resolve: {
        item: function () {
          return item
        }
      }
    }
    ModalService.open(modalOptions)
  }

  function elapsed (finish, start) {
    return Math.abs(new Date(finish) - new Date(start)) / 1000
  }

  function processCredential (item) {
    item.type = item.type.substring(item.type.lastIndexOf('::') + 2, item.type.lastIndexOf('Credential'))
    return item
  }

  function normalizeDialogKeys (key) {
    const normalizedKey = key.replace(/dialog_/i, '')

    return normalizedKey === 'credential' ? 'credential_id' : normalizedKey
  }
}
