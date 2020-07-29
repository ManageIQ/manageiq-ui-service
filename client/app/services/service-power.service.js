/** @ngInject */
export function ServicePowerFactory(CollectionsApi, EventNotifications, sprintf) {
  return {
    // FIXME: original is more complex, but mixes service and vm, make sure this is right

    // FIXME haven't updated the code calling the deleted old poweroperations fuctions yet

    // service has attributes power_state, power_states, power_status
    // + retired, retires_on, retirement_state, retirement_warn

    can: {
      start(service) {
        return service.power_state !== 'on';
      },

      stop(service) {
        return service.power_state === 'on';
      },

      suspend(service) {
        return service.power_state === 'on';
      },

      // FIXME: unused
      retire(service) {
        return !service.retired;
      },
    },

    state: { // TODO use, etc.
      text(service) {
        return service.power_state;
      },

      icon(service) {
        //TODO return one of on,off,suspend*?,unknown..
      },
    },

    do: {
      start(service) {
        service.power_state = '';
        service.power_status = 'starting';

        return CollectionsApi.post('services', service.id, {}, { action: 'start' })
          .then(actionSuccess(sprintf(__('%s was started.'), service.name)))
          .catch(actionFailure(__('There was an error starting this service.')));
      },

      stop(service) {
        service.power_state = '';
        service.power_status = 'stopping';

        return CollectionsApi.post('services', service.id, {}, { action: 'stop' })
          .then(actionSuccess(sprintf(__('%s was stopped.'), service.name)))
          .catch(actionFailure(__('There was an error stopping this service.')));
      },

      suspend(service) {
        service.power_state = '';
        service.power_status = 'suspending';

        return CollectionsApi.post('services', service.id, {}, { action: 'suspend' })
          .then(actionSuccess(sprintf(__('%s was suspended.'), service.name)))
          .catch(actionFailure(__('There was an error suspending this service.')));
      },

      retire(service) {
        service.power_state = '';
        service.power_status = 'retiring';

        return CollectionsApi.post('services', service.id, {}, { action: 'retire' })
          .then(actionSuccess(sprintf(__('%s was retired.'), service.name)))
          .catch(actionFailure(__('There was an error retiring this service.')));
      },
    },
  };

  function actionSuccess(message) {
    return (response) => EventNotifications.success(message + ' ' + response.message);
  }

  function actionFailure(message) {
    return (response) => EventNotifications.error(message + ' ' + response.message);
  }
}
