/* jshint -W117, -W030 */
describe('component: dialogEditorTabs', function() {
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

      bard.inject('DialogEditor', 'DialogEditorModal');
      DialogEditor.setData(lodash.cloneDeep(window.__fixtures__['client/fixtures/dialogData']));

      element = $compile('<dialog-editor-field></dialog-editor-field>')(scope);
      scope.$apply();
      controller = element.controller('dialogEditorField');
    }));

    it('should call function to show modal', function() {
      sinon.spy(DialogEditorModal, 'showModal');
      controller.editDialogModal(1, 1);
      expect(DialogEditorModal.showModal).to.have.been.calledOnce;
    });
  });
});
