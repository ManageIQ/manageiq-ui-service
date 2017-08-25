/* eslint camelcase: "off" */

/** @ngInject */
export function ListConfigurationFactory () {
  var configuration = {}

  configuration.setupListFunctions = function (list, currentField) {
    list.sort = {
      isAscending: true,
      currentField: currentField
    }

    list.filters = []

    list.setSort = function (currentField, isAscending) {
      list.sort.isAscending = isAscending
      list.sort.currentField = currentField
    }

    list.getSort = function () {
      return list.sort
    }

    list.setFilters = function (filterArray) {
      list.filters = filterArray
    }

    list.getFilters = function () {
      return list.filters
    }
  }

  return configuration
}
