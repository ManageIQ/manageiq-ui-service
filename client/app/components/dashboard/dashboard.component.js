import template from './dashboard.html';

export const DashboardComponent = {
  template,
  controller: ComponentController,
  controllerAs: 'vm'
}

/** @ngInject */
function ComponentController ($state, DashboardService, EventNotifications, lodash, Chargeback, RBAC, Polling, LONG_POLLING_INTERVAL) {
  const vm = this

  const retiredTitle = __('Retire Status')

  vm.$onDestroy = function onDestroy () {
    Polling.stop('servicePolling')
    Polling.stop('requestPolling')
  }
  vm.$onInit = function () {
    vm.permissions = {
      'monthlyCharges': RBAC.has(RBAC.FEATURES.DASHBOARD.MONTHLY_CHARGES)
    }

    angular.extend(vm, {
      loadRequests: false,
      loadServices: false,
      loadRequestsFailure: false,
      loadServicesFailure: false,
      servicesCount: {
        total: 0,
        current: 0,
        retired: 0,
        soon: 0
      },
      requestsCount: {
        total: 0,
        pending: 0,
        approved: 0,
        denied: 0
      },
      chargeback: 0,
      navigateToRetiringSoonServicesList: navigateToRetiringSoonServicesList,
      navigateToRetiredServicesList: navigateToRetiredServicesList,
      navigateToCurrentServicesList: navigateToCurrentServicesList
    })

    resolveServiceCounts()
    resolveRequestCounts()
  }

  function navigateToRetiredServicesList () {
    $state.go('services', {
      'filter': [{
        'id': 'retired',
        'title': retiredTitle,
        'value': {id: true, title: __('Retired')}
      }]
    })
  }

  function navigateToRetiringSoonServicesList () {
    const currentDate = new Date()
    const filters = []

    filters.push({'id': 'retired', 'title': retiredTitle, 'value': {id: false, title: __('Retires between')}})
    filters.push({'id': 'retires_on', 'operator': '>', 'value': {id: currentDate.toISOString(), title: __('Now')}})
    const days30 = currentDate.setDate(currentDate.getDate() + 30)
    filters.push({
      'id': 'retires_on',
      'operator': '<',
      'value': {id: new Date(days30).toISOString(), title: __('30 Days')}
    })

    $state.go('services', {'filter': filters})
  }

  function navigateToCurrentServicesList () {
    $state.go('services', {
      'filter': [{
        'id': 'retired',
        'title': retiredTitle,
        'value': {id: false, title: __('Not Retired')}
      }]
    })
  }

  function resolveServiceCounts () {
    Polling.start('servicePolling', pollServices, LONG_POLLING_INTERVAL)

    Promise.all(DashboardService.allServices()).then((response) => {
      let services = response[0].resources
      vm.servicesCount.total = response[0].subcount
      vm.servicesCount.retired = response[1].subcount
      vm.servicesCount.soon = response[2].subcount
      vm.servicesCount.current = vm.servicesCount.total - vm.servicesCount.retired
      services.forEach(Chargeback.processReports)
      vm.chargeback = {
        'used_cost_sum': lodash(services).map('chargeback').map('used_cost_sum').values().sum()
      }
      vm.loadServices = true
    }).catch((response) => {
      vm.loadServicesFailure = true
    })
  }

  function resolveRequestCounts () {
    Polling.start('requestPolling', pollRequests, LONG_POLLING_INTERVAL)

    Promise.all(DashboardService.allRequests()).then((response) => {
      vm.requestsCount.pending = response[0].subcount + response[1].subcount
      vm.requestsCount.approved = response[2].subcount + response[3].subcount
      vm.requestsCount.denied = response[5].subcount + response[4].subcount
      vm.requestsCount.total = vm.requestsCount.pending + vm.requestsCount.approved + vm.requestsCount.denied
      vm.loadRequests = true
    }).catch((response) => {
      vm.loadRequestsFailure = true
    })
  }

  function pollServices () {
    resolveServiceCounts()
  }

  function pollRequests () {
    resolveRequestCounts()
  }
}
