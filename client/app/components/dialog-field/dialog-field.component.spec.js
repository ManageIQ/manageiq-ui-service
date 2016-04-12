/* jshint -W117, -W030 */
describe('component: dynamicTabs', function() {
  beforeEach(function() {
    module('app.components', 'gettext');
  });

  describe('controller', function() {
    var $compile;
    var $rootScope;
    var scope;
    var element;
    var controller;
    var lodash;

    beforeEach(inject(function($injector) {
      $compile = $injector.get('$compile');
      $rootScope = $injector.get('$rootScope');
      scope = $rootScope.$new();
      lodash = $injector.get('lodash');

      bard.inject('DialogEdit', 'EditDialogModal');
      DialogEdit.setData(lodash.cloneDeep(window.__fixtures__['client/fixtures/dialogData']));

      element = $compile('<dialog-field></dialog-field>')(scope);
      scope.$apply();
      controller = element.controller('dialogField');
    }));

    it('should call function to show modal', function() {
      sinon.spy(EditDialogModal, 'showModal');
      controller.editDialogModal(1, 1);
      expect(EditDialogModal.showModal).to.have.been.calledOnce;
    });
  });
});
