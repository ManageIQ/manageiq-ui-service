/** @ngInject */
export function UsageGraphsFactory() {
  var service = {
    convertBytestoGb: convertBytestoGb,
    getChartConfig: getChartConfig,
  };

  function getChartConfig(config, used, total) {
    let usedValue = 0;
    let totalValue = 0;

    if (angular.isDefined(used)) {
      usedValue = used;
      totalValue = total;
    }

    return {
      config: {
        units: config.units,
        chartId: config.chartId,
      },
      data: {
        'used': usedValue,
        'total': totalValue,
      },
      label: config.label,
    };
  }

  function convertBytestoGb(bytes) {
    return (bytes / 1073741824).toFixed(2);
  }

  return service;
}
