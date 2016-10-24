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

  describe('service list contains power state in "timeout" and power status in "starting', function() {
    var controller;
    var services = {
      name: 'services',
      count: 1,
      subcount: 1,
      resources: [
        {options: {
        power_state: "timeout",
        power_status: "starting"
      }}
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
      expect(serviceItem.powerState).to.eq('timeout');
    });

    it('sets the powerStatus value on the Service', function() {
      expect(serviceItem.powerStatus).to.eq('starting');
    });

    it('does not hide the kebab menu when "Start" operation times out', function() {
      expect(controller.hideMenuForItemFn(serviceItem)).to.eq(false);
    });

    it('Shows the "Start" button when "Start" operation times out', function() {
      expect(controller.enableButtonForItemFn({}, serviceItem)).to.eq(true);
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
        {options: {
          power_state: "on",
          power_status: "start_complete"
        }}
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
      expect(serviceItem.powerState).to.eq('on');
    });

    it('sets the powerStatus value on the Service', function() {
      expect(serviceItem.powerStatus).to.eq('start_complete');
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
