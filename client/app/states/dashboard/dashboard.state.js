import templateUrl from './dashboard.html'

/** @ngInject */
export function DashboardState (routerHelper) {
  routerHelper.configureStates(getStates())
}

function getStates () {
  return {
    'dashboard': {
      parent: 'application',
      url: '/',
      templateUrl,
      controller: StateController,
      controllerAs: 'vm',
      title: N_('Dashboard'),
      data: {
        requireUser: true
      },
      resolve: {
        definedServiceIdsServices: resolveServicesWithDefinedServiceIds,
        retiredServices: resolveRetiredServices,
        expiringServices: resolveExpiringServices,
        allRequests: resolveAllRequests
      }
    }
  }
}

/** @ngInject */

function resolveAllRequests (CollectionsApi, RBAC) {
  if (!RBAC.has('miq_request_view')) {
    return undefined
  }

  return [
    [
      pendingRequestsForServiceTemplateProvisionRequest(CollectionsApi),
      pendingRequestsForServiceReconfigureRequest(CollectionsApi)
    ],
    [
      approvedRequestsForServiceTemplateProvisionRequest(CollectionsApi),
      approvedRequestsForServiceReconfigureRequest(CollectionsApi)
    ],
    [
      deniedRequestsForServiceTemplateProvisionRequest(CollectionsApi),
      deniedRequestsForServiceReconfigureRequest(CollectionsApi)
    ]
  ]
}

function pendingRequestsForServiceTemplateProvisionRequest (CollectionsApi) {
  var filterValues = ['approval_state=pending_approval']
  var options = {hide: 'resources', filter: filterValues}

  return CollectionsApi.query('requests', options)
}

function pendingRequestsForServiceReconfigureRequest (CollectionsApi) {
  var filterValues = ['type=ServiceReconfigureRequest', 'approval_state=pending_approval']
  var options = {hide: 'resources', filter: filterValues}

  return CollectionsApi.query('requests', options)
}

function approvedRequestsForServiceTemplateProvisionRequest (CollectionsApi) {
  var filterValues = ['type=ServiceTemplateProvisionRequest', 'approval_state=approved']
  var options = {hide: 'resources', filter: filterValues}

  return CollectionsApi.query('requests', options)
}

function approvedRequestsForServiceReconfigureRequest (CollectionsApi) {
  var filterValues = ['type=ServiceReconfigureRequest', 'approval_state=approved']
  var options = {hide: 'resources', filter: filterValues}

  return CollectionsApi.query('requests', options)
}

function deniedRequestsForServiceTemplateProvisionRequest (CollectionsApi) {
  var filterValues = ['type=ServiceTemplateProvisionRequest', 'approval_state=denied']
  var options = {hide: 'resources', filter: filterValues}

  return CollectionsApi.query('requests', options)
}

function deniedRequestsForServiceReconfigureRequest (CollectionsApi) {
  var filterValues = ['type=ServiceReconfigureRequest', 'approval_state=denied']
  var options = {hide: 'resources', filter: filterValues}

  return CollectionsApi.query('requests', options)
}

/** @ngInject */
function resolveExpiringServices (CollectionsApi, RBAC) {
  var navFeatures = RBAC.getNavFeatures()
  if (!navFeatures.services.show) {
    return undefined
  }
  var currentDate = new Date()
  var date1 = 'retires_on>' + currentDate.toISOString()
  var days30 = currentDate.setDate(currentDate.getDate() + 30)
  var date2 = 'retires_on<' + new Date(days30).toISOString()
  var options = {hide: 'resources', filter: ['retired=false', date1, date2]}

  return CollectionsApi.query('services', options)
}

/** @ngInject */
function resolveRetiredServices (CollectionsApi, RBAC) {
  var navFeatures = RBAC.getNavFeatures()
  if (!navFeatures.services.show) {
    return undefined
  }
  var options = {hide: 'resources', filter: ['service_id=nil', 'retired=true']}

  return CollectionsApi.query('services', options)
}

/** @ngInject */
function resolveServicesWithDefinedServiceIds (CollectionsApi, RBAC) {
  var navFeatures = RBAC.getNavFeatures()
  if (!navFeatures.services.show) {
    return undefined
  }

  var options = {
    expand: 'resources',
    filter: ['service_id=nil'],
    attributes: ['chargeback_report']
  }

  return CollectionsApi.query('services', options)
}

/** @ngInject */
function StateController ($state, definedServiceIdsServices, retiredServices, expiringServices, allRequests, lodash, $q, Chargeback, $ngRedux) {
  const vm = this
  const retiredTitle = __('Retire Status')
  angular.extend(vm, {
    requestsFeature: false,
    navigateToRetiringSoonServicesList: navigateToRetiringSoonServicesList,
    navigateToRetiredServicesList: navigateToRetiredServicesList,
    navigateToCurrentServicesList: navigateToCurrentServicesList
  })

  if (angular.isDefined(definedServiceIdsServices)) {
    vm.servicesCount = {}
    vm.servicesFeature = false
    vm.servicesCount.total = 0
    vm.servicesCount.current = 0
    vm.servicesCount.retired = 0
    vm.servicesCount.soon = 0

    if (definedServiceIdsServices.subcount > 0) {
      vm.servicesCount.total = definedServiceIdsServices.subcount
      vm.servicesCount.retired = retiredServices.subcount
      vm.servicesCount.soon = expiringServices.subcount
      vm.servicesCount.current = vm.servicesCount.total - vm.servicesCount.retired - vm.servicesCount.soon

      var services = definedServiceIdsServices.resources
      services.forEach(Chargeback.processReports)

      vm.chargeback = {
        'used_cost_sum': lodash(services).map('chargeback').map('used_cost_sum').values().sum()
      }
    }

    vm.servicesFeature = true
  }

  if (angular.isDefined(allRequests)) {
    vm.requestsCount = {}
    vm.requestsCount.total = 0

    const allRequestTypes = ['pending', 'approved', 'denied']
    allRequests.forEach(function (promise, n) {
      resolveRequestPromises(promise, allRequestTypes[n], lodash, $q)
    })

    vm.requestsFeature = true
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

  function resolveRequestPromises (promiseArray, type, lodash, $q) {
    $q.all(promiseArray).then(function (data) {
      const count = lodash.sumBy(data, 'subcount')
      vm.requestsCount[type] = count
      vm.requestsCount.total += count
    })
  }
}
