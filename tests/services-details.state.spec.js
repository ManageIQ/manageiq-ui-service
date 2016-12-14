describe('Dashboard', function() {
  beforeEach(function() {
    module('app.states', 'app.config', 'gettext', bard.fakeToastr);
    bard.inject('$state', '$templateCache', 'Session');

    state = {
      actionFeatures: {
        serviceDelete: {show: true},
        serviceRetireNow: {show: true},
        serviceRetire: {show: true},
        serviceTag: {show: true},
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
        return item.power_state === "on" && item.options.power_status === "start_complete";
      },
      powerOperationUnknownState: function (item) {
        return item.power_state === "" && item.options.power_status === "";
      },
      powerOperationInProgressState: function (item) {
        return (item.power_state !== "timeout" && item.options.power_status === "starting")
          || (item.power_state !== "timeout" && item.options.power_status === "stopping")
          || (item.power_state !== "timeout" && item.options.power_status === "suspending");
      },
      powerOperationOffState: function (item) {
        return item.power_state === "off" && item.options.power_status === "stop_complete";
      },
      powerOperationSuspendState: function (item) {
        return item.power_state === "off" && item.options.power_status === "suspend_complete";
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
      id: 123,
      name: 'foo',
      power_state: "",
      options: {
        power_status: "starting"
      },
      chargeback_report: {
        results: []
      }
    };

    var tags ={
      resources: [
        {
          category:{
            description: "sample tag description"
          },
          classification: {
            description: "Tag"
          }
        }
      ]
    };

    beforeEach(function() {
      bard.inject('$controller', '$state', 'CollectionsApi', 'EventNotifications');

      controller = $controller($state.get('services.details').controller, {service: service, $state: state, tags: tags});
    });

    it('should be created successfully', function() {
      expect(controller).to.be.defined;
    });

    it('Tags should be part of controller object', function (done) {
        expect(controller.tags).to.eq(tags);
        done();
    });

    describe('removeService', function() {
      it('DELETEs to the services API', function() {
        collectionsApiSpy = sinon.stub(CollectionsApi, 'delete').returns(Promise.resolve());

        controller.removeService();

        expect(collectionsApiSpy).to.have.been.calledWith('services', 123);
      });

      it('sends a success message to the notification center', function(done) {
        notificationSpy = sinon.stub(EventNotifications, 'success');

        controller.removeService();
        done();

        expect(notificationSpy).to.have.been.calledWith('foo was removed.');
      });

      it('goes to the service list state', function(done) {
        controller.removeService();
        done();

        expect($state.is('services.explorer')).to.be.true;
      });
    });
  });

  describe('service detail contains power state in "off" and power status in "stop_complete"', function() {
    var controller;

    var service = {
        power_state: "off",
        options: {
          power_status: "stop_complete"
        },
      chargeback_report: {
        results: []
      }
    };

    var tags = {
      resources: [
        {
          category: {
            description: "sample tag description"
          },
          classification: {
            description: "Tag"
          }
        }
      ]
    };

    beforeEach(function() {
      bard.inject('$controller', '$state');

      controller = $controller($state.get('services.details').controller,
          {service: service,
           $state: state,
           Chargeback: Chargeback,
           PowerOperations: PowerOperations, tags: tags});
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
      options: {
        power_status: "start_complete"
      },
      chargeback_report: {
        results: []
      },
    };
    var tags ={
      resources: [
        {
          category:{
            description: "sample tag description"
          },
          classification: {
            description: "Tag"
          }
        }
      ]
    };

    beforeEach(function() {
      bard.inject('$controller', '$state');

      controller = $controller($state.get('services.details').controller,
        {service: service,
         $state: state,
         Chargeback: Chargeback,
         PowerOperations: PowerOperations,
         tags: tags});
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
