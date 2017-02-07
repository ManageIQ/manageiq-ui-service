/** @ngInject */
export function DashboardState(routerHelper) {
  routerHelper.configureStates(getStates());
}

function getStates() {
  return {
    'dashboard': {
      parent: 'application',
      url: '/',
      templateUrl: 'app/states/dashboard/dashboard.html',
      controller: StateController,
      controllerAs: 'vm',
      title: N_('Dashboard'),
      data: {
        requireUser: true,
      },
      resolve: {
        definedServiceIdsServices: resolveServicesWithDefinedServiceIds,
        retiredServices: resolveRetiredServices,
        expiringServices: resolveExpiringServices,
        allRequests: resolveAllRequests,
      },
    },
  };
}

/** @ngInject */
// TODO API in question: /api/requests
// TODO with filterValues = ['type=ServiceReconfigureRequest', 'or type=ServiceTemplateProvisionRequest', 'approval_state=pending_approval'];
// TODO API OR-ing bug/"design limitation" has forced an implementation change in how we gather count data for Requests
// TODO One API call would now be split into two - one for ServiceTemplateProvisionRequest and other for ServiceReconfigureRequest

function resolveAllRequests(CollectionsApi, $state) {
  if (angular.isDefined($state.navFeatures) && !$state.navFeatures.requests.show) {
    return undefined;
  }

  return [
    [
      pendingRequestsForServiceTemplateProvisionRequest(CollectionsApi),
      pendingRequestsForServiceReconfigureRequest(CollectionsApi),
    ],
    [
      approvedRequestsForServiceTemplateProvisionRequest(CollectionsApi),
      approvedRequestsForServiceReconfigureRequest(CollectionsApi),
    ],
    [
      deniedRequestsForServiceTemplateProvisionRequest(CollectionsApi),
      deniedRequestsForServiceReconfigureRequest(CollectionsApi),
    ],
  ];
}

function pendingRequestsForServiceTemplateProvisionRequest(CollectionsApi) {
  var filterValues = ['type=ServiceTemplateProvisionRequest', 'approval_state=pending_approval'];
  var options = {hide: 'resources', filter: filterValues};

  return CollectionsApi.query('requests', options);
}

function pendingRequestsForServiceReconfigureRequest(CollectionsApi) {
  var filterValues = ['type=ServiceReconfigureRequest', 'approval_state=pending_approval'];
  var options = {hide: 'resources', filter: filterValues};

  return CollectionsApi.query('requests', options);
}

function approvedRequestsForServiceTemplateProvisionRequest(CollectionsApi) {
  var filterValues = ['type=ServiceTemplateProvisionRequest', 'approval_state=approved'];
  var options = {hide: 'resources', filter: filterValues};

  return CollectionsApi.query('requests', options);
}

function approvedRequestsForServiceReconfigureRequest(CollectionsApi) {
  var filterValues = ['type=ServiceReconfigureRequest', 'approval_state=approved'];
  var options = {hide: 'resources', filter: filterValues};

  return CollectionsApi.query('requests', options);
}

function deniedRequestsForServiceTemplateProvisionRequest(CollectionsApi) {
  var filterValues = ['type=ServiceTemplateProvisionRequest', 'approval_state=denied'];
  var options = {hide: 'resources', filter: filterValues};

  return CollectionsApi.query('requests', options);
}

function deniedRequestsForServiceReconfigureRequest(CollectionsApi) {
  var filterValues = ['type=ServiceReconfigureRequest', 'approval_state=denied'];
  var options = {hide: 'resources', filter: filterValues};

  return CollectionsApi.query('requests', options);
}

/** @ngInject */
function resolveExpiringServices(CollectionsApi, $state) {
  if (angular.isDefined($state.navFeatures) && !$state.navFeatures.services.show) {
    return undefined;
  }
  var currentDate = new Date();
  var date1 = 'retires_on>' + currentDate.toISOString();
  var days30 = currentDate.setDate(currentDate.getDate() + 30);
  var date2 = 'retires_on<' + new Date(days30).toISOString();
  var options = {hide: 'resources', filter: ['retired=false', date1, date2]};

  return CollectionsApi.query('services', options);
}

/** @ngInject */
function resolveRetiredServices(CollectionsApi, $state) {
  if (angular.isDefined($state.navFeatures) && !$state.navFeatures.services.show) {
    return undefined;
  }
  var options = {hide: 'resources', filter: ['service_id=nil', 'retired=true']};

  return CollectionsApi.query('services', options);
}

/** @ngInject */
function resolveServicesWithDefinedServiceIds(CollectionsApi, $state) {
  if (angular.isDefined($state.navFeatures) && !$state.navFeatures.services.show) {
    return undefined;
  }

  var options = {
    expand: 'resources',
    filter: ['service_id=nil'],
    attributes: ['chargeback_report'],
  };

  return CollectionsApi.query('services', options);
}

/** @ngInject */
function StateController($state, RequestsState, ServicesState, definedServiceIdsServices, retiredServices, expiringServices, allRequests, lodash, $q, Chargeback) {
  var vm = this;

  if (angular.isDefined(definedServiceIdsServices)) {
    vm.servicesCount = {};
    vm.servicesFeature = false;
    vm.servicesCount.total = 0;
    vm.servicesCount.current = 0;
    vm.servicesCount.retired = 0;
    vm.servicesCount.soon = 0;

    if (definedServiceIdsServices.subcount > 0) {
      vm.servicesCount.total = definedServiceIdsServices.subcount;
      vm.servicesCount.retired = retiredServices.subcount;
      vm.servicesCount.soon = expiringServices.subcount;
      vm.servicesCount.current = vm.servicesCount.total - vm.servicesCount.retired - vm.servicesCount.soon;

      var services = definedServiceIdsServices.resources;
      services.forEach(Chargeback.processReports);

      vm.chargeback = {
        'used_cost_sum': lodash(services).map('chargeback').map('used_cost_sum').values().sum(),
      };
    }

    vm.servicesFeature = true;
  }

  vm.requestsFeature = false;

  if (angular.isDefined(allRequests)) {
    vm.requestsCount = {};
    vm.requestsCount.total = 0;

    var allRequestTypes = ['pending', 'approved', 'denied'];
    allRequests.forEach(function(promise, n) {
      resolveRequestPromises(promise, allRequestTypes[n], lodash, $q);
    });

    vm.requestsFeature = true;
  }

  vm.navigateToRequestsList = function(filterValue) {
    RequestsState.setFilters([{'id': 'approval_state', 'title': __('Request Status'), 'value': filterValue}]);
    RequestsState.filterApplied = true;
    $state.go('requests');
  };

  vm.navigateToServicesList = function(filterValue) {
    ServicesState.setFilters([{'id': 'retirement', 'title': __('Retirement Date'), 'value': filterValue}]);
    ServicesState.filterApplied = true;
    $state.go('services');
  };

  vm.navigateToRetiredServicesList = function() {
    ServicesState.setFilters([{'id': 'retired', 'title': __('Retired'), 'value': true}]);
    ServicesState.filterApplied = true;
    $state.go('services');
  };

  vm.navigateToRetiringSoonServicesList = function () {
    var currentDate = new Date();
    var filters = [];

    filters.push({ 'id': 'retires_on', 'operator': '>', 'value': currentDate.toISOString() });
    filters.push({ 'id': 'retired', 'title': __('Retired'), 'value': false });
    var days30 = currentDate.setDate(currentDate.getDate() + 30);
    filters.push({ 'id': 'retires_on', 'operator': '<', 'value': new Date(days30).toISOString() });
    ServicesState.setFilters(filters);
    ServicesState.filterApplied = true;
    $state.go('services');
  };

  vm.navigateToCurrentServicesList = function() {
    ServicesState.setFilters([{'id': 'retired', 'title': 'Retired', 'value': false}]);
    ServicesState.filterApplied = true;
    $state.go('services');
  };

  function resolveRequestPromises(promiseArray, type, lodash, $q) {
    $q.all(promiseArray).then(function(data) {
      var count = lodash.sum(data, 'subcount');
      vm.requestsCount[type] = count;
      vm.requestsCount.total += count;
    });
  }
}
