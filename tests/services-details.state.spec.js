describe('Dashboard', function() {
  beforeEach(function() {
    module('app.states', 'app.config', 'gettext', bard.fakeToastr);
    bard.inject('$state', '$templateCache', 'Session');

    state = {
      actionFeatures: {
        serviceDelete: {show: true},
        serviceRetireNow: {show: true},
        serviceRetire: {show: true},
        serviceEdit: {show: true},
        serviceReconfigure: {show: true},
        serviceOwnership: {show: true},
      }
    };

    Chargeback = {
      processReports: function(){},
      adjustRelativeCost: function(){}
    };

    PowerOperations = {
      powerOperationOnState: function (item) {
        return item.powerState === "on" && item.powerStatus === "start_complete";
      },
      powerOperationUnknownState: function (item) {
        return item.powerState === "" && item.powerStatus === "";
      },
      powerOperationInProgressState: function (item) {
        return (item.powerState !== "timeout" && item.powerStatus === "starting")
          || (item.powerState !== "timeout" && item.powerStatus === "stopping")
          || (item.powerState !== "timeout" && item.powerStatus === "suspending");
      },
      powerOperationOffState: function (item) {
        return item.powerState === "off" && item.powerStatus === "stop_complete";
      },
      powerOperationSuspendState: function (item) {
        return item.powerState === "off" && item.powerStatus === "suspend_complete";
      },
      powerOperationTimeoutState: function (item) {
        return item.powerState === "timeout";
      },
    };
  });

  describe('route', function() {
    var views = {
      list: 'app/states/services/details/details.html'
    };

    beforeEach(function() {
      bard.inject('$state', '$templateCache');
    });

    it('should work with $state.go', function() {
      $state.go('services.details');
      expect($state.is('services.details'));
    });
  });

  describe('controller', function() {
    var controller;

    var service = {
      options: {
        power_state: "timeout",
        power_status: "starting"
      },
      chargeback_report: {
        results: []
      }
    };

    beforeEach(function() {
      bard.inject('$controller', '$state');

      controller = $controller($state.get('services.details').controller, {service: service, $state: state});
    });

    it('should be created successfully', function() {
      expect(controller).to.be.defined;
    });
  });

  describe('service detail contains power state in "timeout" and power status in "starting', function() {
    var controller;

    var service = {
        options: {
          power_state: "timeout",
          power_status: "starting"
        },
      chargeback_report: {
        results: []
      }
    };

    beforeEach(function() {
      bard.inject('$controller', '$state');

      controller = $controller($state.get('services.details').controller, {service: service, $state: state, Chargeback: Chargeback});
    });

    it('enables the "Start" button when power state is "timeout" and power status is "starting', function() {
      expect(controller.enableStartButton(controller.service)).to.eq(true);
    });

    it('disables the "Stop" button when power state is "timeout" and power status is "starting', function() {
      expect(controller.checkDisabled('stop', controller.service)).to.eq(false);
    });

    it('disables the "Suspend" button when power state is "timeout" and power status is "starting', function() {
      expect(controller.checkDisabled('suspend', controller.service)).to.eq(false);
    });
  });

  describe('service detail contains power state in "on" and power status in "start_complete', function() {
    var controller;
    var service = {
      options: {
        power_state: "on",
        power_status: "start_complete"
      },
      chargeback_report: {
        results: []
      },
    };

    beforeEach(function() {
      bard.inject('$controller', '$state');

      controller = $controller($state.get('services.details').controller,
        {service: service,
         $state: state,
         Chargeback: Chargeback,
         PowerOperations: PowerOperations});
    });

    it('disables the "Start" button when power state is "ON"', function() {
      expect(controller.enableStartButton(controller.service)).to.eq(false);
    });

    it('enables the "Stop" button when power state is "ON"', function() {
      expect(controller.checkDisabled('stop', controller.service)).to.eq(false);
    });

    it('enables the "Suspend" button when power state is "ON"', function() {
      expect(controller.checkDisabled('suspend', controller.service)).to.eq(false);
    });
  });
});
