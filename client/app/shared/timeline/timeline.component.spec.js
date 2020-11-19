/* global inject */
/* eslint-disable no-unused-expressions */
describe('Component: timeline', function () {
  beforeEach(module('app.services'))
  describe('controller', function () {
    let element = angular.element('<timeline></timeline>')
    let ctrl
    const bindings = {
      data: [{name: 'test', 'data': [{'date': new Date(0), 'details': {'event': 'test', 'object': 'test'}}]}],
      options: {width: 900}
    }

    beforeEach(inject(function ($componentController) {
      ctrl = $componentController('timeline', {$element: element}, bindings)
    }))

    it('is defined, accepts bindings data/options', function () {
      expect(ctrl).to.exist
      expect(ctrl.data).to.exist
      expect(ctrl.options.width).to.exist
    })
  })

  describe('template', () => {
    let parentScope, $compile

    beforeEach(inject(function (_$compile_, _$rootScope_) {
      $compile = _$compile_
      parentScope = _$rootScope_.$new()
    }))

    const compileHtml = function (markup, scope) {
      let element = angular.element(markup)
      $compile(element)(scope)
      scope.$digest()
      return element
    }

    it('should compile timeline when invoked', () => {
      const renderedElement = compileHtml(`<timeline data="" options="" />`, parentScope)
      expect(renderedElement[0].querySelectorAll('.timeline').length).to.eq(1)
    })
  })
})
