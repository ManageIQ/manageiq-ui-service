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
        .pluck(['chargeback', 'used_cost_sum'])
        .sort()
        .filter(angular.identity) // nonzero
        .value();

      var len = sums.length;
      var bounds = [ len * 0.25, len * 0.5, len * 0.75 ];

      items.forEach(function(item) {
        if (!item.chargeback.used_cost_sum) {
          item.chargeback_relative_cost = '';

          return;
        }

        var idx = sums.findIndex(function(v) {
          return v === item.chargeback.used_cost_sum;
        });
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
      var latestDate = lodash(item.chargeback_report.results || [])
        .pluck('start_date')
        .sort()
        .reverse()
        .first();

      var latestReports = lodash(item.chargeback_report.results || [])
        .filter({ start_date: latestDate })
        .value();

      latestReports.forEach(function(report) {
        report.used_cost_sum = reportUsedCost(report);
      });

      return {
        start_date: latestDate,
        used_cost_sum: lodash.sum(latestReports, 'used_cost_sum'), // sumBy in lodash4
        vms: latestReports,
      };
    }

    function processReports(item) {
      item.chargeback = service.currentReport(item);
    }

    // sum all *_used_cost fields in the report
    function reportUsedCost(report) {
      var sum = 0;

      lodash.each(report, function(v, k) {
        if (!k.match(/_used_cost$/)) {
          return;
        }

        sum += v;
      });

      return sum;
    }

    return service;
  }
})();
