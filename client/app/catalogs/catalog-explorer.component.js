/* eslint camelcase: "off" */
import '../../assets/sass/_explorer.sass';
import templateUrl from './catalog-explorer.html';

export const CatalogExplorerComponent = {
  templateUrl,
  controller: ComponentController,
  controllerAs: 'vm',
};

/** @ngInject */
function ComponentController($state, CatalogsState, ListView, EventNotifications, lodash) {
  const vm = this;
  vm.permissions = CatalogsState.getPermissions();

  vm.$onInit = function() {
    angular.extend(vm, {
      title: __('Catalogs'),
      loading: false,
      limit: 20,
      filterCount: 0,
      catalogsList: [],
      serviceTemplateList: [],
      limitOptions: [5, 10, 20, 50, 100, 200, 500, 1000],

      // Functions
      resolveCatalogs: resolveCatalogs,
      updatePagination: updatePagination,

      // Config
      cardConfig: getCardConfig(),
    });
    resolveCatalogs(vm.limit, 0);
  };

  // Config

  function getCardConfig() {
    return {
      showSelectBox: false,
      selectionMatchProp: 'id',
      onClick: viewDetails,
    };
  }

  function getToolbarConfig() {
    return {
      filterConfig: getFilterConfig(),
      sortConfig: getSortConfig(),
      actionsConfig: {
        actionsInclude: true,
      },
    };
  }

  function getFilterConfig() {
    const catalogNames = vm.catalogsList.map((catalog) => catalog.name);

    return {
      fields: [
        ListView.createFilterField('name', __('Name'), __('Filter by Name'), 'text'),
        ListView.createFilterField('description', __('Description'), __('Filter by Description'), 'text'),
        ListView.createFilterField('name', __('Catalog Name'), __('Filter by Catalog Name'), 'select', catalogNames),
      ],
      resultsCount: 0,
      appliedFilters: CatalogsState.getFilters(),
      onFilterChange: filterChange,
    };
  }

  function filterChange(filters) {
    CatalogsState.setFilters(filters);
    resolveCatalogs(vm.limit, 0);
  }

  function getSortConfig() {
    return {
      fields: [
        ListView.createSortField('name', __('Name'), 'alpha'),
        ListView.createSortField('tenant_id', __('Tenant'), 'numeric'),
        // ListView.createSortField('service_templates.count', __('Catalog Items'), 'numeric'),
      ],
      onSortChange: sortChange,
      isAscending: CatalogsState.getSort().isAscending,
      currentField: CatalogsState.getSort().currentField,
    };
  }

  // Private

  function resolveCatalogs(limit, offset) {
    vm.loading = true;
    vm.offset = offset;

    CatalogsState.getCatalogs(limit, offset).then(success, failure);

    function success(response) {
      vm.loading = false;
      vm.catalogsList = [];
      vm.serviceTemplateList = [];

      response.resources.forEach((item) => {
        if (angular.isDefined(item.service_templates)) {
          item.service_templates.resources = item.service_templates.resources.filter((template) => template.display);

          item.disableRowExpansion = item.service_templates.resources.length === 0;
        }
        item.service_templates.resources.forEach((service) => {
          service.catalog_name = item.name;
        });
        vm.serviceTemplateList.push(item.service_templates.resources);
        vm.catalogsList.push(item);
      });

      vm.serviceTemplateList = lodash.flattenDeep(vm.serviceTemplateList);
      vm.toolbarConfig = getToolbarConfig();
      getFilterCount();

      function getFilterCount() {
        CatalogsState.getMinimal(limit, offset).then(success, failure);

        function success(result) {
          vm.filterCount = result.subcount;
          vm.toolbarConfig.filterConfig.resultsCount = result.subcount;
        }
      }
    }

    function failure(_error) {
      vm.loading = false;
      EventNotifications.error(__('There was an error loading catalogs.'));
    }
  }

  function sortChange(sortId, isAscending) {
    CatalogsState.setSort(sortId, isAscending);
    resolveCatalogs(vm.limit, 0);
  }

  function viewDetails(template) {
    $state.go('catalogs.details', {serviceTemplateId: template.id});
  }

  function updatePagination(limit, offset) {
    vm.limit = limit;
    vm.offset = offset;
    vm.resolveCatalogs(limit, offset);
  }
}
