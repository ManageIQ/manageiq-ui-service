/* eslint camelcase: "off" */
import '../../assets/sass/_explorer.sass'
import templateUrl from './catalog-explorer.html'

export const CatalogExplorerComponent = {
  templateUrl,
  controller: ComponentController,
  controllerAs: 'vm'
}

/** @ngInject */
function ComponentController ($state, CatalogsState, ListView, EventNotifications) {
  const vm = this
  vm.permissions = CatalogsState.getPermissions()

  vm.$onInit = function () {
    angular.extend(vm, {
      title: __('Catalogs'),
      loading: false,
      limit: 20,
      filterCount: 0,
      catalogsList: [],
      serviceTemplateList: [],
      limitOptions: [5, 10, 20, 50, 100, 200, 500, 1000],

      // Functions
      resolveServiceTemplates: resolveServiceTemplates,
      updatePagination: updatePagination,

      // Config
      cardConfig: getCardConfig(),
      toolbarConfig: {
        sortConfig: getSortConfig(),
        filterConfig: {},
        isTableView: false
      }
    })
    resolveServiceTemplates(vm.limit, 0)
  }

  // Config

  function getCardConfig () {
    return {
      showSelectBox: false,
      selectionMatchProp: 'id',
      onClick: viewDetails
    }
  }

  function getFilterConfig () {
    const catalogNames = vm.catalogsList.map((catalog) => catalog.name)

    return {
      fields: [
        ListView.createFilterField('name', __('Name'), __('Filter by Name'), 'text'),
        ListView.createFilterField('description', __('Description'), __('Filter by Description'), 'text'),
        ListView.createFilterField('service_template_catalog.name', __('Catalog Name'), __('Filter by Catalog Name'), 'select', catalogNames)
      ],
      resultsCount: 0,
      totalCount: 0,
      appliedFilters: CatalogsState.getFilters(),
      onFilterChange: filterChange,
      itemsLabel: __('Result'),
      itemsLabelPlural: __('Results')
    }
  }

  function filterChange (filters) {
    CatalogsState.setFilters(filters)
    resolveServiceTemplates(vm.limit, 0)
  }

  function getSortConfig () {
    return {
      fields: [
        ListView.createSortField('name', __('Name'), 'alpha'),
        ListView.createSortField('tenant_id', __('Tenant'), 'numeric')
        // ListView.createSortField('service_templates.count', __('Catalog Items'), 'numeric'),
      ],
      onSortChange: sortChange,
      isAscending: CatalogsState.getSort().isAscending,
      currentField: CatalogsState.getSort().currentField
    }
  }

  // Private
  function resolveServiceTemplates (limit, offset) {
    vm.loading = true
    vm.offset = offset

    return CatalogsState.getServiceTemplates(limit, offset).then(success, failure)

    function success (response) {
      const serviceTemplateResultsCount = response.subquery_count
      CatalogsState.getCatalogs(limit, offset).then((response) => {
        vm.catalogsList = response.resources
        vm.toolbarConfig.filterConfig = getFilterConfig()
        vm.toolbarConfig.filterConfig.resultsCount = serviceTemplateResultsCount
        vm.loading = false
      })
      vm.serviceTemplateList = response.resources
    }

    function failure (_error) {
      vm.loading = false
      EventNotifications.error(__('There was an error loading catalogs.'))
    }
  }

  function sortChange (sortId, isAscending) {
    CatalogsState.setSort(sortId, isAscending)
    resolveServiceTemplates(vm.limit, 0)
  }

  function viewDetails (template) {
    $state.go('catalogs.details', {serviceTemplateId: template.id})
  }

  function updatePagination (limit, offset) {
    vm.limit = limit
    vm.offset = offset
    vm.resolveServiceTemplates(limit, offset)
  }
}
