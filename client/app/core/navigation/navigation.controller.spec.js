describe('Navigation controller', function() {
  beforeEach(module('app.components'));

    describe('controller', function() {
      var controller;
      var ctrl;

      beforeEach(inject(function($controller) {
        bard.inject('Text',
          'Navigation',
          'Session',
          'ShoppingCart',
          'API_BASE',
          '$rootScope',
          '$uibModal',
          '$state',
          '$document',
          'EventNotifications',
          'ApplianceInfo');

      ctrl = $controller('NavigationController', {
        Text: Text,
        Navigation: Navigation,
        Session: Session,
        API_BASE: API_BASE,
        ShoppingCart: ShoppingCart,
        $scope: $rootScope,
        $uibModal: $uibModal,
        $state: $state,
        $document: $document,
        EventNotifications: EventNotifications,
        ApplianceInfo: ApplianceInfo,
      });
    }));

    it('is defined', function() {
      expect(ctrl).to.be.defined;
    });

    it('controller sites are defined and injected URL to be correct', function() {
      expect(ctrl.sites).to.be.defined;
      expect(ctrl.sites.length).to.equal(1);
      expect(ctrl.sites[0].url).to.equal('http://localhost:9876');
    });
  });
});
