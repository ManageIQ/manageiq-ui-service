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
        return item.power_state === "on" && item.power_status === "start_complete";
      },
      powerOperationUnknownState: function (item) {
        return item.power_state === "" && item.power_status === "";
      },
      powerOperationInProgressState: function (item) {
        return (item.power_state !== "timeout" && item.power_status === "starting")
          || (item.power_state !== "timeout" && item.power_status === "stopping")
          || (item.power_state !== "timeout" && item.power_status === "suspending");
      },
      powerOperationOffState: function (item) {
        return item.power_state === "off" && item.power_status === "stop_complete";
      },
      powerOperationSuspendState: function (item) {
        return item.power_state === "off" && item.power_status === "suspend_complete";
      },
      powerOperationTimeoutState: function (item) {
        return item.power_state === "timeout";
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
      power_state: "",
      power_status: "starting",
      options: {
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

  describe('service detail contains power state in "off" and power status in "stop_complete"', function() {
    var controller;

    var service = {
        power_state: "off",
        power_status: "stop_complete",
        options: {
        },
      chargeback_report: {
        results: []
      }
    };

    beforeEach(function() {
      bard.inject('$controller', '$state');

      controller = $controller($state.get('services.details').controller, {service: service, $state: state, Chargeback: Chargeback});
    });

    it('disables the "Stop" button when power state is "OFF"', function() {
      expect(controller.checkDisabled('stop', controller.service)).to.eq(true);
    });

    it('enables the "Start" button when power state is "OFF"', function() {
      expect(controller.enableStartButton(controller.service)).to.eq(true);
    });

    it('enables the "Suspend" button when power state is "OFF"', function() {
      expect(controller.checkDisabled('suspend', controller.service)).to.eq(false);
    });

  });

  describe('service detail contains power state in "on" and power status in "start_complete', function() {
    var controller;
    var service = {
      power_state: "on",
      power_status: "start_complete",
      options: {
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
