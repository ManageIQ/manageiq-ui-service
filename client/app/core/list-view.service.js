/* eslint camelcase: "off" */
/* eslint no-cond-assign: "off" */

/** @ngInject */
export function ListViewFactory() {
  var listView = {};

  listView.applyFilters = function(filters, retList, origList, stateFactory, matchesFilter) {
    retList = [];
    if (filters && filters.length > 0) {
      angular.forEach(origList, filterChecker);
    } else {
      retList = origList;
    }

    /* Keep track of the current filtering state */
    stateFactory.setFilters(filters);

    return retList;

    function filterChecker(item) {
      if (matchesFilters(item, filters)) {
        retList.push(item);
      }
    }

    function matchesFilters(item, filters) {
      var matches = true;
      angular.forEach(filters, filterMatcher);

      function filterMatcher(filter) {
        if (!matchesFilter(item, filter)) {
          matches = false;

          return false;
        }
      }

      return matches;
    }
  };

  listView.createFilterField = function(id, title, placeholder, type, values) {
    return {
      id: id,
      title: title,
      placeholder: placeholder,
      filterType: type,
      filterValues: values,
    };
  };

  listView.createSortField = function (id, title, sortType) {
    return {
      id: id,
      title: title,
      sortType: sortType,
    };
  };


  return listView;
}
