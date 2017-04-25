import templateUrl from './dashboard.html';

/** @ngInject */
export function DashboardState(routerHelper) {
  routerHelper.configureStates(getStates());
}

function getStates() {
  return {
    'dashboard': {
      parent: 'application',
      url: '/',
      templateUrl,
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
      },
    },
  };
}

/** @ngInject */
function resolveExpiringServices(CollectionsApi, RBAC) {
  var navFeatures = RBAC.getNavFeatures();
  if (!navFeatures.services.show) {
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
function resolveRetiredServices(CollectionsApi, RBAC) {
  var navFeatures = RBAC.getNavFeatures();
  if (!navFeatures.services.show) {
    return undefined;
  }
  var options = {hide: 'resources', filter: ['service_id=nil', 'retired=true']};

  return CollectionsApi.query('services', options);
}

/** @ngInject */
function resolveServicesWithDefinedServiceIds(CollectionsApi, RBAC) {
  var navFeatures = RBAC.getNavFeatures();
  if (!navFeatures.services.show) {
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
function StateController($state, definedServiceIdsServices, retiredServices, expiringServices, lodash, Chargeback) {
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
        'used_cost_sum': lodash(services).pluck(['chargeback', 'used_cost_sum']).sum(),
      };
    }

    vm.servicesFeature = true;
  }

  vm.navigateToServicesList = function(filterValue) {
    $state.go('services', {'filter': [{'id': 'retirement', 'title': __('Retirement Date'), 'value': filterValue}]});
  };

  vm.navigateToRetiredServicesList = function() {
    $state.go('services', {'filter': [{'id': 'retired', 'title': __('Retired'), 'value': true}]});
  };

  vm.navigateToRetiringSoonServicesList = function() {
    var currentDate = new Date();
    var filters = [];

    filters.push({'id': 'retires_on', 'operator': '>', 'value': currentDate.toISOString()});
    filters.push({'id': 'retired', 'title': __('Retired'), 'value': false});
    var days30 = currentDate.setDate(currentDate.getDate() + 30);
    filters.push({'id': 'retires_on', 'operator': '<', 'value': new Date(days30).toISOString()});

    $state.go('services', {'filter': filters});
  };

  vm.navigateToCurrentServicesList = function() {
    $state.go('services', {'filter': [{'id': 'retired', 'title': 'Retired', 'value': false}]});
  };
}
