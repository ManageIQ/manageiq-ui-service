(function() {
  'use strict';

  angular.module('app.states')
    .run(appRun);

  /** @ngInject */
  function appRun(routerHelper) {
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
          requireUser: true
        },
        resolve: {
          definedServiceIdsServices: resolveServicesWithDefinedServiceIds,
          retiredServices: resolveRetiredServices,
          nonRetiredServices: resolveNonRetiredServices,
          expiringServices: resolveExpiringServices,
          pendingRequests: resolvePendingRequests,
          approvedRequests: resolveApprovedRequests,
          deniedRequests: resolveDeniedRequests
        }
      }
    };
  }

  /** @ngInject */
  function resolvePendingRequests(CollectionsApi, Session) {
    if (!Session.current.navFeatures.requests.show) {
      return undefined;
    }

    var options = {expand: false, filter: ['approval_state=pending'] };

    return CollectionsApi.query('service_requests', options);
  }

  /** @ngInject */
  function resolveApprovedRequests(CollectionsApi, Session) {
    if (!Session.current.navFeatures.requests.show) {
      return undefined;
    }
    var options = {expand: false, filter: ['approval_state=approved'] };

    return CollectionsApi.query('service_requests', options);
  }

  /** @ngInject */
  function resolveDeniedRequests(CollectionsApi, Session) {
    if (!Session.current.navFeatures.requests.show) {
      return undefined;
    }
    var options = {expand: false, filter: ['approval_state=denied'] };

    return CollectionsApi.query('service_requests', options);
  }

  /** @ngInject */
  function resolveExpiringServices(CollectionsApi, $filter, Session) {
    if (!Session.current.navFeatures.services.show) {
      return undefined;
    }
    var currentDate = new Date();
    var date1 = 'retires_on>=' + $filter('date')(currentDate, 'yyyy-MM-dd');

    var days30 = currentDate.setDate(currentDate.getDate() + 30);
    var date2 = 'retires_on<=' + $filter('date')(days30, 'yyyy-MM-dd');
    var options = {expand: false, filter: [date1, date2]};

    return CollectionsApi.query('services', options);
  }

  /** @ngInject */
  function resolveRetiredServices(CollectionsApi, Session) {
    if (!Session.current.navFeatures.services.show) {
      return undefined;
    }
    var options = {expand: false, filter: ['retired=true'] };

    return CollectionsApi.query('services', options);
  }

  /** @ngInject */
  function resolveNonRetiredServices(CollectionsApi, Session) {
    if (!Session.current.navFeatures.services.show) {
      return undefined;
    }
    var options = {expand: false, filter: ['retired=false'] };

    return CollectionsApi.query('services', options);
  }

  /** @ngInject */
  function resolveServicesWithDefinedServiceIds(CollectionsApi, Session) {
    if (!Session.current.navFeatures.services.show) {
      return undefined;
    }
    var options = {expand: false, filter: ['service_id=nil'] };

    return CollectionsApi.query('services', options);
  }

  /** @ngInject */
  function StateController($state, RequestsState, ServicesState, definedServiceIdsServices, retiredServices,
    nonRetiredServices, expiringServices, pendingRequests, approvedRequests, deniedRequests) {
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
        vm.servicesCount.current = definedServiceIdsServices.subcount === 0 ? nonRetiredServices.count :
        retiredServices.subcount + nonRetiredServices.subcount;

        vm.servicesCount.retired = vm.servicesCount.total - vm.servicesCount.current;

        vm.servicesCount.soon = expiringServices.subcount;
      }

      vm.servicesFeature = true;
    }

    vm.requestsFeature = false;
    if (angular.isDefined(pendingRequests)) {
      vm.requestsCount = {};
      vm.requestsCount.total = pendingRequests.count;
      vm.requestsCount.pending = pendingRequests.subcount;
      vm.requestsCount.approved = approvedRequests.subcount;
      vm.requestsCount.denied = deniedRequests.subcount;

      vm.requestsFeature = true;
    }

    vm.title = __('Dashboard');

    vm.navigateToRequestsList = function(filterValue) {
      RequestsState.setFilters([{'id': 'approval_state', 'title': __('Request Status'), 'value': filterValue}]);
      $state.go('requests.list');
    };

    vm.navigateToServicesList = function(filterValue) {
      ServicesState.setFilters([{'id': 'retirement', 'title': __('Retirement Date'), 'value': filterValue}]);
      $state.go('services.list');
    };
  }
})();
