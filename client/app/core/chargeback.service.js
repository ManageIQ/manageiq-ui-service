/* eslint-disable camelcase */

/** @ngInject */
export function ChargebackFactory (lodash) {
  const service = {
    adjustRelativeCost: adjustRelativeCost,
    currentReport: currentReport,
    processReports: processReports,
    reportUsedCost: reportUsedCost
  }

  // recomputes items[*].chargeback_relative_cost
  function adjustRelativeCost (items) {
    const sums = lodash(items)
      .map('chargeback')
      .map('used_cost_sum')
      .values().sort()
      .filter(angular.identity) // nonzero
      .value()

    const len = sums.length
    const bounds = [len * 0.25, len * 0.5, len * 0.75]

    items.forEach(function (item) {
      if (!item.chargeback.used_cost_sum) {
        item.chargeback_relative_cost = ''

        return
      }

      const idx = sums.findIndex(function (v) {
        return v === item.chargeback.used_cost_sum
      })
      if (idx < bounds[0]) {
        item.chargeback_relative_cost = '$'
      } else if (idx < bounds[1]) {
        item.chargeback_relative_cost = '$$'
      } else if (idx < bounds[2]) {
        item.chargeback_relative_cost = '$$$'
      } else {
        item.chargeback_relative_cost = '$$$$'
      }
    })
  }

  function currentReport (item) {
    const latestDate = lodash(item.chargeback_report.results || [])
      .map('start_date')
      .values()
      .sort()
      .reverse()
      .first()

    const latestReports = lodash(item.chargeback_report.results || [])
      .filter({start_date: latestDate})
      .value()

    latestReports.forEach(function (report) {
      report.used_cost_sum = reportUsedCost(report)
    })

    return {
      start_date: latestDate,
      used_cost_sum: lodash.sumBy(latestReports, 'used_cost_sum'),
      vms: latestReports
    }
  }

  function processReports (item) {
    item.chargeback = service.currentReport(item)
  }

  // sum all *_used_cost fields in the report
  function reportUsedCost (report) {
    return lodash.reduce(report, function (total, v, k) {
      total += k.match(/_used_cost$/) ? Number(v) : 0

      return total
    }, 0)
  }

  return service
}
