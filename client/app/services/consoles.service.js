(function() {
  'use strict';

  angular.module('app.services')
    .factory('Consoles', ConsolesFactory);

  /** @ngInject */
  function ConsolesFactory(CollectionsApi, $http, $timeout, logger, $location, Notifications) {
    var service = {
      open: openConsole,
    };

    return service;

    function openConsole(vmId) {
      CollectionsApi.post('vms', vmId, {}, {
        action: 'request_console',
        resource: { protocol: "html5" },
      })
      .then(consoleResponse)
      .catch(consoleError);
    }

    function consoleResponse(response) {
      if (!response.success) {
        // for some reason failure is 200 + success=false here, so throwing the message to use the same error handler
        throw response.message;
      }

      Notifications.info(__("Waiting for the console to become ready"));
      logger.info(__("Waiting for the console to become ready:"), response.message);

      consoleWatch(response.task_href + '?attributes=task_results');
    }

    function consoleError(error) {
      Notifications.error(__("There was an error opening the console"));
      logger.error(__("There was an error opening the console:"), error);
    }

    // try to get the task results every second, until Finished (or error)
    function consoleWatch(url) {
      $timeout(function() {
        $http.get(url)
        .then(function(response) {
          var task = response.data;

          if ((task.state === 'Finished') && (task.status === 'Ok')) {
            // success
            consoleOpen(task.task_results);
          } else if ((task.state === 'Queued') && (task.status === 'Ok')) {
            // waiting
            consoleWatch(url);
          } else {
            // failure
            throw task.message;
          }
        })
        .catch(consoleError);
      }, 1000);
    }

    function consoleOpen(results) {
      switch (results.proto) {
        case 'spice':
          openSpice(results);
          break;
        case 'vnc':
          openVnc(results);
          break;
        case 'remote':
          openRemote(results);
          break;
        default:
          Notifications.error(__("Unsupported console protocol returned"));
          logger.error(__("Unsupported console protocol returned:"), results.proto);
      }
    }

    function openSpice(results) {
      var url = '/bower_components/spice-html5-bower/spiceHTML5/spice_auto.html' +
        '?host=' + $location.host() +
        '&port=' + $location.port() +
        '&path=' + results.url +
        '&password=' + results.secret;

      // encrypt is divined automagically in spice_auto

      window.open(url);
    }

    function openVnc(results) {
      var url = '/bower_components/no-vnc/vnc_auto.html' +
        '?host=' + $location.host() +
        '&port=' + $location.port() +
        '&path=' + results.url +
        '&password=' + results.secret +
        '&true_color=1';

      if ($location.protocol() === 'https') {
        url += '&encrypt=1';
      }

      window.open(url);
    }

    function openRemote(results) {
      // openstack
      window.open(results.remote_url);
    }
  }
})();
