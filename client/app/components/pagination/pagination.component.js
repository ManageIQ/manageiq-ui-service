(function() {
  'use strict';

  angular.module('app.components')
    .component('explorerPagination', {
      controller: ComponentController,
      controllerAs: 'vm',
      bindings: {
        limit: '<',
        count: '<',
        offset: '=',
        onUpdate: '&',
      },
      templateUrl: 'app/components/pagination/pagination.html',
    });

  /** @ngInject */
  function ComponentController() {
    var vm = this;

    angular.extend(vm, {
      leftBoundary: 0,
      rightBoundary: 0,
      lastOffset: Math.floor(vm.count / vm.limit) * vm.limit,
      disabled: disabled,
      previous: previous,
      next: next,
    });

    vm.$onInit = function() {
      establishBoundaries();
    };

    vm.$onChanges = function(changes) {
      vm.lastOffset = Math.floor(vm.count / vm.limit) * vm.limit;
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

    function previous(first) {
      if (vm.offset) {
        if (first) {
          vm.offset = 0;
        } else {
          vm.offset = vm.offset - vm.limit;
        }
        establishBoundaries();
        vm.onUpdate({offset: vm.offset});
      }
    }

    function next(last) {
      if (vm.offset < vm.lastOffset) {
        if (last) {
          vm.offset = vm.lastOffset;
        } else {
          vm.offset = vm.offset + vm.limit;
        }
        establishBoundaries();
        vm.onUpdate({offset: vm.offset});
      }
    }

    // Private
    function establishBoundaries() {
      leftBoundary();
      rightBoundary();
    }

    function leftBoundary() {
      if (vm.offset === 0) {
        vm.leftBoundary = 1;
      } else {
        vm.leftBoundary = vm.offset;
      }
    }

    function rightBoundary() {
      if (vm.offset === 0) {
        vm.rightBoundary = vm.limit;
      } else {
        vm.rightBoundary = vm.offset + vm.limit;
        if (vm.rightBoundary > vm.count) {
          vm.rightBoundary = vm.count;
        }
      }
    }
  }
})();
