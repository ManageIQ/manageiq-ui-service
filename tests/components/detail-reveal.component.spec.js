describe('detail-reveal component', function() {
  beforeEach(function(){
      module('app.components', 'gettext');
  });

  describe('controller', function() {
    var controller;
    var $componentController;
    var bindings = {title: 'Test', detail: 'test detail', icon: 'testIconClass', translateTitle: false, rowClass: 'test'};

    beforeEach(
        inject(function(_$componentController_,$injector) {
      $componentController = _$componentController_;
      transclude= function(){
          var returnObj={};
          returnObj.length=0;
          return returnObj
      };
      ctrl = $componentController('detailReveal', {$transclude: transclude}, bindings);
        })
    );

    it('is defined, accepts bindings', function() {
      expect(ctrl).to.be.defined;
      expect(ctrl.title).to.equal('Test');
      expect(ctrl.detail).to.equal('test detail');
      expect(ctrl.icon).to.equal('testIconClass');
      expect(ctrl.translateTitle).to.equal(false);
      expect(ctrl.rowClass).to.equal('test');
    });
  });

  describe("transcluded content",function(){
    var controller;
    var $componentController;
    var bindings = {title: 'Test', detail: 'test detail', icon: 'testIconClass', translateTitle: false, rowClass: 'test'};

    beforeEach(
        inject(function(_$componentController_,$injector) {
      $componentController = _$componentController_;
      transclude= function(){
          var returnObj={};
          returnObj.length=10;//This just is attempting to dummy some html content length > 0
          return returnObj
      };
      ctrl = $componentController('detailReveal', {$transclude: transclude}, bindings);
        })
    );

     it('Component sees transcluded content', function() {
      expect(ctrl).to.be.defined;
      expect(ctrl.hasMoreDetails).to.equal(true);
    });

  })
});
