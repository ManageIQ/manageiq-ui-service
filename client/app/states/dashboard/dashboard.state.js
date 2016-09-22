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
    if (!$state.navFeatures.requests.show) {
      return undefined;
    }

    return [[pendingRequestsForServiceTemplateProvisionRequest(CollectionsApi),
             pendingRequestsForServiceReconfigureRequest(CollectionsApi)],
            [approvedRequestsForServiceTemplateProvisionRequest(CollectionsApi),
             approvedRequestsForServiceReconfigureRequest(CollectionsApi)],
            [deniedRequestsForServiceTemplateProvisionRequest(CollectionsApi),
             deniedRequestsForServiceReconfigureRequest(CollectionsApi)]];
  }

  function pendingRequestsForServiceTemplateProvisionRequest(CollectionsApi) {
    var filterValues = ['type=ServiceTemplateProvisionRequest', 'approval_state=pending_approval'];
    var options = {expand: false, filter: filterValues };

    return CollectionsApi.query('requests', options);
  }

  function pendingRequestsForServiceReconfigureRequest(CollectionsApi) {
    var filterValues = ['type=ServiceReconfigureRequest', 'approval_state=pending_approval'];
    var options = {expand: false, filter: filterValues };

    return CollectionsApi.query('requests', options);
  }

  function approvedRequestsForServiceTemplateProvisionRequest(CollectionsApi) {
    var filterValues = ['type=ServiceTemplateProvisionRequest', 'approval_state=approved'];
    var options = {expand: false, filter: filterValues };

    return CollectionsApi.query('requests', options);
  }

  function approvedRequestsForServiceReconfigureRequest(CollectionsApi) {
    var filterValues = ['type=ServiceReconfigureRequest', 'approval_state=approved'];
    var options = {expand: false, filter: filterValues };

    return CollectionsApi.query('requests', options);
  }

  function deniedRequestsForServiceTemplateProvisionRequest(CollectionsApi) {
    var filterValues = ['type=ServiceTemplateProvisionRequest', 'approval_state=denied'];
    var options = {expand: false, filter: filterValues };

    return CollectionsApi.query('requests', options);
  }

  function deniedRequestsForServiceReconfigureRequest(CollectionsApi) {
    var filterValues = ['type=ServiceReconfigureRequest', 'approval_state=denied'];
    var options = {expand: false, filter: filterValues };

    return CollectionsApi.query('requests', options);
  }

  /** @ngInject */
  function resolveExpiringServices(CollectionsApi, $filter, $state) {
    if (!$state.navFeatures.services.show) {
      return undefined;
    }
    var currentDate = new Date();
    var date1 = 'retires_on>=' + $filter('date')(currentDate, 'yyyy-MM-dd');

    var days30 = currentDate.setDate(currentDate.getDate() + 30);
    var date2 = 'retires_on<=' + $filter('date')(days30, 'yyyy-MM-dd');
    var options = {expand: false, filter: ['service_id=nil', date1, date2]};

    return CollectionsApi.query('services', options);
  }

  /** @ngInject */
  function resolveRetiredServices(CollectionsApi, $state) {
    if (!$state.navFeatures.services.show) {
      return undefined;
    }
    var options = {expand: false, filter: ['service_id=nil', 'retired=true'] };

    return CollectionsApi.query('services', options);
  }

  /** @ngInject */
  function resolveServicesWithDefinedServiceIds(CollectionsApi, $state) {
    if (!$state.navFeatures.services.show) {
      return undefined;
    }
    var options = {expand: false, filter: ['service_id=nil'] };

    return CollectionsApi.query('services', options);
  }

  /** @ngInject */
  function StateController($state, RequestsState, ServicesState, definedServiceIdsServices, retiredServices,
    expiringServices, allRequests, lodash, $q) {
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
      $state.go('requests.list');
    };

    vm.navigateToServicesList = function(filterValue) {
      ServicesState.setFilters([{'id': 'retirement', 'title': __('Retirement Date'), 'value': filterValue}]);
      ServicesState.filterApplied = true;
      $state.go('services.list');
    };

    function resolveRequestPromises(promiseArray, type, lodash, $q) {
      $q.all(promiseArray).then(function(data) {
        var count = lodash.sum(data, 'subcount');
        vm.requestsCount[type] = count;
        vm.requestsCount.total += count;
      });
    }
  }
})();
