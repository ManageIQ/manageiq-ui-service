(function() {
  'use strict';

  angular.module('app.components').component('explorerPagination', {
    controller: ComponentController,
    controllerAs: 'vm',
    bindings: {
      limit: '<',
      limitOptions: '<?',
      count: '<',
      onUpdate: '&',
    },
    templateUrl: 'app/components/pagination/pagination.html',
  });

  /** @ngInject */
  function ComponentController() {
    var vm = this;

    vm.$onInit = function() {
      angular.extend(vm, {
        leftBoundary: 0,
        rightBoundary: 0,
        offset: 0,
        lastOffset: lastOffset(),
        disabled: disabled,
        updateLimit: updateLimit,
        previous: previous,
        next: next,
        limitOptions: vm.limitOptions || [5, 10, 20, 50, 100, 200, 500, 1000],
      });

      establishBoundaries();
    };

    vm.$onChanges = function(changes) {
      if (angular.isDefined(changes.limit) ||
        angular.isDefined(changes.count)) {
        vm.offset = 0;
      }

      vm.lastOffset = lastOffset();
      establishBoundaries();
    };

    // Public
    function disabled(side) {
      if (vm.limit > vm.count) {
        return true;
      }
      if (side === 'left') {
        return vm.offset === 0;
      }
      if (side === 'right') {
        return vm.offset === vm.lastOffset;
      }
    }

    function updateLimit(newLimit) {
      vm.offset = 0;
      vm.limit = newLimit;
      vm.lastOffset = Math.floor(vm.count / vm.limit) * vm.limit;
      establishBoundaries();
      vm.onUpdate({$limit: vm.limit, $offset: vm.offset});
    }

    function previous(first) {
      if (vm.offset > 0) {
        if (angular.isDefined(first)) {
          vm.offset = 0;
        } else {
          vm.offset = vm.offset - vm.limit;
        }
        establishBoundaries();
        vm.onUpdate({$limit: vm.limit, $offset: vm.offset});
      }
    }

    function next(last) {
      if (vm.offset < vm.lastOffset) {
        if (angular.isDefined(last)) {
          vm.offset = vm.lastOffset;
        } else {
          vm.offset = vm.offset + vm.limit;
        }
        establishBoundaries();
        vm.onUpdate({$limit: vm.limit, $offset: vm.offset});
      }
    }

    // Private
    function establishBoundaries() {
      leftBoundary();
      rightBoundary();
    }

    function leftBoundary() {
      vm.leftBoundary = vm.count === 0 ? 0 : vm.offset + 1;
    }

    function rightBoundary() {
      vm.rightBoundary = vm.offset + vm.limit;
      if (vm.rightBoundary > vm.count) {
        vm.rightBoundary = vm.count;
      }
    }

    function lastOffset() {
      return (vm.count % vm.limit) === 0
        ? vm.count - vm.limit
        : Math.floor(vm.count / vm.limit) * vm.limit;
    }
  }
})();
