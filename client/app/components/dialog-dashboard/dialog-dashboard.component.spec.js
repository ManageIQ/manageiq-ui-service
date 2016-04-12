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

      bard.inject('DialogEdit');
      DialogEdit.setData(lodash.cloneDeep(window.__fixtures__['client/fixtures/dialogData']));

      element = $compile('<dialog-dashboard></dialog-dashboard>')(scope);
      scope.$apply();
      controller = element.controller('dialogDashboard');
    }));

    it('should add new box to first tab', function() {
      DialogEdit.activeTab = 0;
      controller.addBox();
      expect(DialogEdit.getData().content[0].dialog_tabs[0].dialog_groups.length).to.equal(2);
    });

    it('removes the first box', function() {
      DialogEdit.activeTab = 1;
      controller.removeBox(0);
      expect(DialogEdit.getData().content[0].dialog_tabs[1].dialog_groups.length).to.equal(0);
    });
  });
});
