/* eslint camelcase: "off" */

/* @ngInject */
export function RequestsStateFactory (ListConfiguration, RBAC, CollectionsApi) {
  const collection = 'requests'
  const service = {
    listActions: {},
    get: get,
    getMinimal: getMinimal,
    getPermissions: getPermissions
  }

  ListConfiguration.setupListFunctions(service.listActions, {id: 'created_on', title: __('Request Date'), sortType: 'numeric'})

  return service

  function get (limit, offset) {
    const attributes = [
      'approval_state',
      'created_on',
      'description',
      'message',
      'picture',
      'picture.image_href',
      'requester_name'
    ]
    const options = {
      expand: 'resources',
      limit: limit,
      offset: String(offset),
      attributes: attributes,
      filter: getQueryFilters(service.listActions.getFilters()),
      sort_by: service.listActions.getSort().currentField.id,
      sort_options: service.listActions.getSort().currentField.sortType === 'alpha' ? 'ignore_case' : '',
      sort_order: service.listActions.getSort().isAscending ? 'asc' : 'desc'
    }

    return CollectionsApi.query(collection, options)
  }

  function getMinimal () {
    const options = {
      filter: getQueryFilters(service.listActions.getFilters()),
      hide: 'resources'
    }

    return CollectionsApi.query(collection, options)
  }

  function getPermissions () {
    return {
      approval: RBAC.hasAny(['miq_request_approval']),
      edit: RBAC.hasAny(['miq_request_edit'])
    }
  }

  function getQueryFilters (filters) {
    const queryFilters = []

    filters.forEach((nextFilter) => {
      queryFilters.push(nextFilter.id + '=' + nextFilter.value)
    })

    return queryFilters
  }
}
