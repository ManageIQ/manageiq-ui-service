/* eslint camelcase: "off", no-undef: "off" */
import './_snapshots.sass'
import template from './snapshots.html';

export const VmSnapshotsComponent = {
  template,
  controller: ComponentController,
  controllerAs: 'vm',
  bindToController: true,
  bindings: {
    vmId: '<'
  }
}

/** @ngInject */
function ComponentController (VmsService, sprintf, EventNotifications, ListView, ModalService, lodash) {
  const vm = this

  vm.$onInit = function () {
    vm.permissions = VmsService.getPermissions()

    angular.extend(vm, {
      title: __('Snapshots'),
      vm: {},
      snapshots: [],
      loading: false,
      deleteModal: false,
      deleteMessage: '',

      // Functions
      resolveSnapshots: resolveSnapshots,
      deleteSnapshots: deleteSnapshots,
      deleteSnapshot: deleteSnapshot,
      revertSnapshot: revertSnapshot,
      cancelDelete: cancelDelete,
      resolveVm: resolveVm,
      // Config
      listConfig: getListConfig(),
      menuActions: [],
      listActions: getListActions(),
      toolbarConfig: getToolbarConfig()
    })
    resolveSnapshots()
    resolveVm().then(() => {
      vm.menuActions = getMenuActions()
    })
  }

  function getToolbarConfig () {
    return {
      filterConfig: getFilterConfig(),
      sortConfig: getSortConfig(),
      actionsConfig: {
        actionsInclude: true
      }
    }
  }

  function getListConfig () {
    return {
      showSelectBox: false,
      selectionMatchProp: 'id',
      onClick: angular.noop()
    }
  }

  function getMenuActions () {
    const revertUnsupported = (['openstack'].includes(vm.vm.vendor))
    const menuActions = [{
      name: __('Revert'),
      actionName: 'revert',
      title: __('Revert Snapshot'),
      actionFn: revertSnapshot,
      permissions: vm.permissions.revert && !revertUnsupported
    }, {
      name: __('Delete'),
      actionName: 'delete',
      title: __('Delete Snapshot'),
      actionFn: deleteSnapshot,
      permissions: vm.permissions.snapshotsDelete
    }]

    return menuActions.filter((item) => item.permissions)
  }

  function getFilterConfig () {
    return {
      fields: [
        ListView.createFilterField('name', __('Name'), __('Filter by Name'), 'text'),
        ListView.createFilterField('description', __('Description'), __('Filter by Description'), 'text')
      ],
      resultsCount: 0,
      appliedFilters: VmsService.getFilters(),
      onFilterChange: filterChange,
      itemsLabel: __('Result'),
      itemsLabelPlural: __('Results')
    }
  }

  function getSortConfig () {
    return {
      fields: [
        ListView.createSortField('name', __('Name'), 'alpha'),
        ListView.createSortField('create_time', __('Created'), 'numeric'),
        ListView.createSortField('updated_on', __('Updated'), 'numeric')
      ],
      onSortChange: sortChange,
      isAscending: VmsService.getSort().isAscending,
      currentField: VmsService.getSort().currentField
    }
  }

  function getListActions () {
    const listActions = [{
      name: __('Create Snapshot'),
      actionName: 'create',
      title: __('Create snapshot'),
      actionFn: processSnapshot,
      isDisabled: false,
      permissions: vm.permissions.snapshotsAdd
    }, {
      name: __('Delete All Snapshots'),
      actionName: 'delete',
      title: __('Delete all snapshots'),
      actionFn: deleteSnapshot,
      isDisabled: false,
      permissions: vm.permissions.deleteAll
    }]

    return {
      title: __('Configuration'),
      name: __('Configuration'),
      actionName: 'configuration',
      icon: 'fa fa-cog',
      isDisabled: false,
      actions: listActions.filter((item) => item.permissions)
    }
  }

  function deleteSnapshots () {
    cancelDelete()
    return VmsService.deleteSnapshots(vm.vm.id, vm.snapshotsToRemove).then(success, failure)

    function success (response) {
      EventNotifications.batch(response.results, __('Deleting snapshot.'), __('Error deleting snapshot.'))
      vm.snapshotsToRemove = undefined
      resolveSnapshots()
    }

    function failure (response) {
      EventNotifications.error(response.data.error.message)
    }
  }

  function cancelDelete () {
    vm.deleteModal = false
  }

  // Private
  function resolveSnapshots () {
    vm.loading = true

    VmsService.getSnapshots(vm.vmId).then(success, failure)

    function success (response) {
      vm.loading = false
      vm.toolbarConfig.filterConfig.resultsCount = response.subcount
      vm.snapshots = response.resources

      const hour = 60 * 60 * 1000
      const day = 24 * hour
      const week = 7 * day
      const month = 30 * day
      const start = new Date(lodash.minBy(vm.snapshots, 'create_time').create_time)
      const end = new Date(lodash.maxBy(vm.snapshots, 'create_time').create_time)
      const tlSnapshots = vm.snapshots.map((item) => ({
        'date': new Date(item.create_time),
        'details': {'event': item.name, 'object': item.name, item}
      }))

      vm.tlData = [{
        'data': tlSnapshots,
        'display': true
      }]

      vm.tlOptions = {
        start: new Date(start.setHours(start.getHours() - 2)),
        end: new Date(end.setHours(end.getHours() + 2)),
        eventShape: '\uf030',
        eventHover: showTooltip,
        eventGrouping: 60000,
        minScale: (week / month),
        maxScale: (day / 60000),
        context: true
      }
    }

    function failure (_error) {
      vm.loading = false
      EventNotifications.error(__('There was an error loading snapshots.'))
    }
  }

  function resolveVm () {
    return VmsService.getVm(vm.vmId).then(success, failure)

    function success (response) {
      vm.vm = response
    }

    function failure (_error) {
      EventNotifications.error(__('There was an error loading the vm.'))
    }
  }

  function sortChange (sortId, isAscending) {
    VmsService.setSort(sortId, isAscending)
    resolveSnapshots()
  }

  function filterChange (filters) {
    VmsService.setFilters(filters)
    resolveSnapshots()
  }

  function deleteSnapshot (_action, item) {
    if (angular.isDefined(item)) {
      vm.snapshotsToRemove = [{'href': item.href}]
      vm.deleteTitle = __('Delete Snapshot')
      vm.deleteMessage = sprintf(__('Please confirm, this action will delete snapshot %s'), item.name)
    } else {
      vm.snapshotsToRemove = vm.snapshots
      vm.deleteTitle = sprintf(__('Delete All Snapshots on VM %s'), vm.vm.name)
      vm.deleteMessage = sprintf(__('Please confirm, this action will delete all snapshots of vm %s'), vm.vm.name)
    }
    vm.deleteModal = true
  }

  function revertSnapshot (_action, item) {
    return VmsService.revertSnapshot(vm.vm.id, item.id).then(success, failure)

    function success (response) {
      EventNotifications.batch([response], __('Reverting snapshot.'), __('Error reverting snapshot.'))
      resolveSnapshots()
    }

    function failure (response) {
      EventNotifications.error(response.data.error.message)
    }
  }

  function processSnapshot (_action, _item) {
    const modalOptions = {
      component: 'processSnapshotsModal',
      resolve: {
        vm: function () {
          return vm.vm
        },
        modalType: function () {
          return 'create'
        }
      },
      size: 'lg'
    }
    ModalService.open(modalOptions)
  }

  const showTooltip = (item) => {
    d3.select('body').selectAll('.popover').remove()

    const fontSize = 12 // in pixels
    const tooltipWidth = 9 // in rem
    const tooltip = d3
    .select('body')
    .append('div')
    .attr('class', 'popover fade bottom in')
    .attr('role', 'tooltip')
    .on('mouseout', () => {
      d3.select('body').selectAll('.popover').remove()
    })
    const rightOrLeftLimit = fontSize * tooltipWidth
    const direction = d3.event.pageX > rightOrLeftLimit ? 'right' : 'left'
    const left = direction === 'right' ? d3.event.pageX - rightOrLeftLimit : d3.event.pageX
    const options = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric'
    }

    let eventDetails = lodash.escape(item.details.event)

    tooltip
    .html(`
      <div class="arrow"></div>
      <div class="popover-content">
        <div>Name: ${eventDetails}</div>
        <div>Date: ${item.date.toLocaleDateString('en-US', options)}</div>
      </div>
    `)

    tooltip
    .style('left', `${left}px`)
    .style('top', `${d3.event.pageY + 8}px`)
    .style('display', 'block')
  }
}
