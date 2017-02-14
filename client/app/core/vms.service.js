/* eslint camelcase: "off" */

/** @ngInject */
export function VmsService(CollectionsApi, EventNotifications, sprintf, lodash) {
  const collection = 'vms';


  return {
    getSnapshots: getSnapshots,
  };

  function getSnapshots(vmId) {
    const options = {
      attributes: ['service'],
      expand: ['snapshots'],
    };

    return CollectionsApi.query(collection + '/' + vmId, options);
  }
}
