(function() {
  'use strict';

  angular.module('app.services')
    .factory('Chargeback', ChargebackFactory);

  /** @ngInject */
  function ChargebackFactory(lodash) {
    var service = {
      adjustRelativeCost: adjustRelativeCost,
      currentReport: currentReport,
      processReports: processReports,
      reportUsedCost: reportUsedCost,
    };

    // recomputes items[*].chargeback_relative_cost
    function adjustRelativeCost(items) {
      var sums = lodash(items)
        .pluck(['chargeback', 'sum'])
        .sort()
        .filter(angular.identity) // nonzero
        .value();

      var len = sums.length;
      var bounds = [ len * 0.25, len * 0.5, len * 0.75 ];

      items.forEach(function(item) {
        if (!item.chargeback.sum) {
          item.chargeback_relative_cost = '';
          return;
        }

        var idx = lodash.findIndex(sums, item.chargeback.sum);
        if (idx < bounds[0]) {
          item.chargeback_relative_cost = '$';
        } else if (idx < bounds[1]) {
          item.chargeback_relative_cost = '$$';
        } else if (idx < bounds[2]) {
          item.chargeback_relative_cost = '$$$';
        } else {
          item.chargeback_relative_cost = '$$$$';
        }
      });
    }

    function currentReport(item) {
      var latest = lodash(item.chargeback_report.results || [])
        .sortBy('start_date')
        .reverse()
        .value();

      return latest[0];
    }

    function processReports(item) {
      var data = currentReport(item);
      var sum = reportUsedCost(data);

      item.chargeback = {
        data: data,
        sum: sum,
      };
    }

    // sum all *_used_cost fields in the report
    function reportUsedCost(report) {
      return lodash.reduce(report, function(sum, v, k) {
        return sum + k.match(/_used_cost$/) ? v : 0;
      }, 0);
    }

    return service;
  }
})();
