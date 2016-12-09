/* jshint -W117, -W030 */
describe('Dashboard', function() {
  beforeEach(function() {
    module('app.states', 'app.config', 'gettext', bard.fakeToastr);
    bard.inject('$location', '$rootScope', '$state', '$templateCache', 'Session');
  });

  describe('route', function() {
    var views = {
      list: 'app/states/services/list/list.html'
    };

    beforeEach(function() {
      bard.inject('$location', '$rootScope', '$state', '$templateCache');
    });

    it('should work with $state.go', function() {
      $state.go('services.list');
      $rootScope.$apply();
      expect($state.is('services.list'));
    });
  });

  describe('controller', function() {
    var controller;
    var services = {
      name: 'services',
      count: 1,
      subcount: 1,
      resources: []
    };

    beforeEach(function() {
      bard.inject('$controller', '$log', '$state', '$rootScope');

      controller = $controller($state.get('services.list').controller, {services: services});
      $rootScope.$apply();
    });

    it('should be created successfully', function() {
      expect(controller).to.be.defined;
    });
  });

  describe('service list contains power state in "" and power status in "starting', function() {
    var controller;
    var services = {
      name: 'services',
      count: 1,
      subcount: 1,
      resources: [
        {
          power_state: "",
          options: {
            power_state: "",
            power_status: "starting"
          }
        }
      ]
    };

    var serviceItem = services.resources[0];

    var Chargeback = {
      processReports: function(){},
      adjustRelativeCost: function(){}
    };

    beforeEach(function() {
      bard.inject('$controller', '$log', '$state', '$rootScope');

      controller = $controller($state.get('services.list').controller, {services: services, Chargeback: Chargeback});
      $rootScope.$apply();
    });

    it('sets the powerState value on the Service', function() {
      expect(serviceItem.power_state).to.eq('');
    });

    it('sets the powerStatus value on the Service', function() {
      expect(serviceItem.options.power_status).to.eq('starting');
    });

    it('does hide the kebab menu when "Start" operation is unknown', function() {
      expect(controller.hideMenuForItemFn(serviceItem)).to.eq(true);
    });

    it('Disables the "Start" button when "Start" operation is "starting"', function() {
      expect(controller.enableButtonForItemFn("undefined", serviceItem)).to.eq(false);
    });

    it('displays "Stop" button when action is "stop"', function() {
      var action = {actionName: 'stop'};
      controller.updateMenuActionForItemFn(action, serviceItem);
      expect(action.isDisabled).to.eq(false);
    });

    it('displays "Suspend" button when action is "suspend"', function() {
      var action = {actionName: 'suspend'};
      controller.updateMenuActionForItemFn(action, serviceItem);
      expect(action.isDisabled).to.eq(false);
    });
  });

  describe('service list contains power state in "on" and power status in "start_complete', function() {
    var controller;
    var services = {
      name: 'services',
      count: 1,
      subcount: 1,
      resources: [
        {
          power_state: "on",
          options: {
            power_status: "start_complete"
          }
        }
      ]
    };

    var serviceItem = services.resources[0];

    var Chargeback = {
      processReports: function(){},
      adjustRelativeCost: function(){}
    };

    var PowerOperations = {
      powerOperationOnState: function(item) {
        return item.power_state === "on" && item.options.power_status === "start_complete";
      },
      powerOperationUnknownState: function(item) {
        return item.power_state === "" && item.options.power_status === "";
      },
      powerOperationInProgressState: function(item) {
        return (item.power_state !== "timeout" && item.options.power_status === "starting")
          || (item.power_state !== "timeout" && item.options.power_status === "stopping")
          || (item.power_state !== "timeout" && item.options.power_status === "suspending");
      },
      powerOperationOffState: function(item) {
        return item.power_state === "off" && item.options.power_status === "stop_complete";
      },
      powerOperationSuspendState: function(item) {
        return item.power_state === "off" && item.options.power_status === "suspend_complete";
      },
      powerOperationTimeoutState: function(item) {
        return item.power_state === "timeout";
      },
    };

    beforeEach(function() {
      bard.inject('$controller', '$log', '$state', '$rootScope');

      controller = $controller($state.get('services.list').controller,
        {services: services,
         Chargeback: Chargeback,
         PowerOperations: PowerOperations});
    });

    it('sets the powerState value on the Service', function() {
      expect(controller.powerOperationOnState(serviceItem)).to.eq(true);
    });

    it('does not hide the kebab menu when "Start" operation leads to an "ON" power state', function() {
      expect(controller.hideMenuForItemFn(serviceItem)).to.eq(false);
    });

    it('hides the "Start" button when power state is "ON"', function() {
      expect(controller.enableButtonForItemFn(undefined, serviceItem)).to.eq(false);
    });

    it('displays "Stop" button when action is "stop"', function() {
      var action = {actionName: 'stop'};
      controller.updateMenuActionForItemFn(action, serviceItem);
      expect(action.isDisabled).to.eq(false);
    });

    it('displays "Suspend" button when action is "suspend"', function() {
      var action = {actionName: 'suspend'};
      controller.updateMenuActionForItemFn(action, serviceItem);
      expect(action.isDisabled).to.eq(false);
    });
  });
});
