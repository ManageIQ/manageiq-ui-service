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

      bard.inject('DialogEditor');
      DialogEditor.setData(lodash.cloneDeep(window.__fixtures__['client/fixtures/dialogData']));

      element = $compile('<dialog-editor-boxes></dialog-editor-boxes>')(scope);
      scope.$apply();
      controller = element.controller('vm');
    }));

    it('should add new box to first tab', function() {
      DialogEditor.activeTab = 0;
      controller.addBox();
      expect(DialogEditor.getDialogTabs()[0].dialog_groups.length).to.equal(2);
    });

    it('removes the first box', function() {
      DialogEditor.activeTab = 1;
      controller.removeBox(0);
      expect(DialogEditor.getDialogTabs()[1].dialog_groups.length).to.equal(0);
    });
  });
});
