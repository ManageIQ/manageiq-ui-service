/* eslint camelcase: "off" */

/** @ngInject */
export function VmsService(CollectionsApi, EventNotifications, sprintf, lodash) {
  const collection = 'vms';


  return {
    getSnapshots: getSnapshots
  };

  function getSnapshots(vmId, limit, offset) {
    const options = {
      expand: ['vms'],
      attributes: ['snapshots','service'],
      // limit: limit,
      // offset: offset,
    };

    return CollectionsApi.query(collection + '/' + vmId, options);
  }
}
