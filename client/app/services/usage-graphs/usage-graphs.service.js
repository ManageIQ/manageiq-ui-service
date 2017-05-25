/** @ngInject */
export function UsageGraphsFactory() {
  var service = {
    cpuChartConfig: getCPUChartConfig,
    memoryChartConfig: getMemoryChartConfig,
    storageChartConfig: getStorageChartConfig,
    convertBytestoGb: convertBytestoGb,
  };

  function getCPUChartConfig(used, total) {
    let usedValue = 0;
    let totalValue = 0;

    if (angular.isDefined(used)) {
      usedValue = used;
      totalValue = total;
    }

    return {
      config: {
        units: __('MHz'),
      },
      data: {
        'used': usedValue,
        'total': totalValue,
      },
      label: __('used'),
    };
  }

  function getMemoryChartConfig(used, total) {
    let usedValue = 0;
    let totalValue = 0;

    if (angular.isDefined(used)) {
      usedValue = used;
      totalValue = total;
    }

    return {
      config: {
        units: __('GB'),
        chartId: 'memoryChart',
      },
      data: {
        'used': usedValue,
        'total': totalValue,
      },
      label: __('used'),
    };
  }

  function getStorageChartConfig(used, total) {
    let usedValue = 0;
    let totalValue = 0;

    if (angular.isDefined(used)) {
      usedValue = used;
      totalValue = total;
    }

    return {
      config: {
        units: __('GB'),
        chartId: 'storageChart',
      },
      data: {
        'used': usedValue,
        'total': totalValue,
      },
      label: __('used'),
    };
  }
  function convertBytestoGb(bytes) {
    return (bytes / 1073741824).toFixed(2);
  }

  return service;
}
