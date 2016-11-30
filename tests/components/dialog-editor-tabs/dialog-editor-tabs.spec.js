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

      element = $compile('<dialog-editor-tabs></dialog-editor-tabs>')(scope);
      scope.$apply();
      controller = element.controller('dialogEditorTabs');
    }));

    it('should have active tab defined', function() {
      expect(DialogEditor.activeTab).to.not.be.undefined;
      expect(DialogEditor.activeTab).to.equal(0);
    });

    it('add new tab at the end of array', function() {
      expect(DialogEditor.getDialogTabs().length).to.equal(2);
      controller.addTab();
      expect(DialogEditor.getDialogTabs().length).to.equal(3);
    });

    it('new active tab is set on new tab', function() {
      DialogEditor.activeTab = 0;
      expect(DialogEditor.activeTab).to.equal(0);
      controller.addTab();
      expect(DialogEditor.activeTab).to.equal(2);
    });

    it('correct tab is removed', function() {
      DialogEditor.activeTab = 0;
      expect(DialogEditor.getDialogTabs()[0].label).to.equal("Tab 1");
      controller.deleteTab(0);
      expect(DialogEditor.getDialogTabs()[0].label).to.equal("Tab 2");
    });

    it('activity is switched after removing active tab', function() {
      DialogEditor.activeTab = 0;
      // new tab is added -> activity is passed on new tab (id: 2)
      controller.addTab();
      // remove last tab  -> activity is passed on previous tab (id: 1)
      controller.deleteTab(2);
      expect(DialogEditor.activeTab).to.equal(1);
    });

    it('correct tab id is stored after selecting tab', function() {
      DialogEditor.activeTab = 0;
      controller.selectTab(1);
      expect(DialogEditor.activeTab).to.equal(1);
    });
  });
});
