/** @ngInject */
export function PowerOperationsFactory(lodash) {
  return {
    allowStartService: allowStart,
    allowStopService: allowStop,
    allowSuspendService: allowSuspend,

    allowStartVm: allowStart,
    allowStopVm: allowStop,
    allowSuspendVm: allowSuspend,

    getPowerState: getPowerState,
  };

  function allowStart (item) {
    return ['unknown', 'off', 'suspended', 'timeout'].includes(getPowerState(item));
  }

  function allowStop (item) {
    return !['unknown', 'off'].includes(getPowerState(item));
  }

  function allowSuspend (item) {
    return !['unknown', 'suspended'].includes(getPowerState(item));
  }

  function getPowerState (item) {
    const powerStates = item.power_states && item.power_states.length ? item.power_states : ["unknown"];
    const everyPowerState = (match) => lodash.every(powerStates, (state) => state === match) ? match : null;

    return item.power_state ||
      everyPowerState('on') ||
      everyPowerState('off') ||
      everyPowerState('timeout') ||
      everyPowerState('suspended') ||
      'unknown';
  }
}
