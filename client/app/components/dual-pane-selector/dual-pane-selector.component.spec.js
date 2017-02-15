describe('Dual Pane Selector Component', function() {
  beforeEach(module('app.components'));

  describe('controller', function() {
    var controller;
    var $componentController;
    var sortCount;
    var changeCount;
    var bindings;

    beforeEach(inject(function(_$componentController_) {
      sortCount = 0;
      var sortFunction = function(items) {
        sortCount++;
      };

      changeCount = 0;
      var onChangeFunction = function() {
        changeCount++;
      };

      bindings = {
        availableItems: ['available1', 'available2', 'available3', 'available4'],
        selectedItems: ['selected1', 'selected2'],
        selectedTitle: 'Test Selected',
        availableTitle: 'Test Available',
        sortFn: sortFunction,
        onChangeFn: onChangeFunction,
      };

      $componentController = _$componentController_;
      controller = $componentController('dualPaneSelector', null, bindings);
    }));

    it('is defined and accepts bindings', function() {
      expect(controller).to.be.defined;
      expect(controller.selectedItems.length).to.equal(2);
      expect(controller.availableItems.length).to.equal(4);
    });

    it('sorts both lists on initialization', function() {
      controller.$onInit();
      expect(sortCount).to.equal(2);
    });

    it('selects items on click', function() {
      controller.$onInit();

      expect(controller.isAvailableItemSelected(bindings.availableItems[0])).to.eq(false);
      controller.availableItemClick(bindings.availableItems[0]);
      expect(controller.isAvailableItemSelected(bindings.availableItems[0])).to.eq(true);

      expect(controller.isSelectedItemSelected(bindings.selectedItems[0])).to.eq(false);
      controller.selectedItemClick(bindings.selectedItems[0]);
      expect(controller.isSelectedItemSelected(bindings.selectedItems[0])).to.eq(true);
    });

    it('sets the list count texts appropriately', function() {
      controller.$onInit();
      expect(controller.availableCountText).to.eq("0 of 4 items selected");
      expect(controller.selectedCountText).to.eq("0 of 2 items selected");

      controller.availableItemClick(bindings.availableItems[2]);
      expect(controller.availableCountText).to.eq("1 of 4 items selected");

      controller.selectedItemClick(bindings.selectedItems[1]);
      expect(controller.selectedCountText).to.eq("1 of 2 items selected");
    });

    it('moves items on double click', function() {
      controller.$onInit();

      expect(controller.selectedItems.length).to.equal(2);
      expect(controller.availableItems.length).to.equal(4);

      controller.availableItemDoubleClick(bindings.availableItems[0]);

      expect(controller.selectedItems.length).to.equal(3);
      expect(controller.availableItems.length).to.equal(3);
      expect(sortCount).to.equal(3);
      expect(changeCount).to.equal(1);

      controller.selectedItemDoubleClick(bindings.selectedItems[0]);

      expect(controller.selectedItems.length).to.equal(2);
      expect(controller.availableItems.length).to.equal(4);
      expect(sortCount).to.equal(4);
      expect(changeCount).to.equal(2);
    });

    it('moves items on move button clicks', function() {
      controller.$onInit();

      expect(controller.selectedItems.length).to.equal(2);
      expect(controller.availableItems.length).to.equal(4);

      controller.availableItemClick(bindings.availableItems[0]);
      controller.availableItemClick(bindings.availableItems[1]);
      controller.selectItems();

      expect(controller.selectedItems.length).to.equal(4);
      expect(controller.availableItems.length).to.equal(2);
      expect(sortCount).to.equal(4);
      expect(changeCount).to.equal(1);

      controller.selectedItemClick(bindings.selectedItems[0]);
      controller.selectedItemClick(bindings.selectedItems[1]);
      controller.selectedItemClick(bindings.selectedItems[2]);
      controller.unSelectItems();

      expect(controller.selectedItems.length).to.equal(1);
      expect(controller.availableItems.length).to.equal(5);
      expect(sortCount).to.equal(6);
      expect(changeCount).to.equal(2);
    });
  });
});
