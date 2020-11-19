/* global inject */
/* eslint-disable no-unused-expressions */
describe('Component: requests-list', () => {
  beforeEach(function () {
    module('app.core', 'app.orders')
  })

  let $compile, scope

  beforeEach(inject(($rootScope, _$compile_) => {
    scope = $rootScope.$new()
    $compile = _$compile_
  }))

  it('should be defined', () => {
    scope['items'] = []
    scope['config'] = []

    let element = angular.element(`<requests-list items="items" config="config"/>`)
    element = $compile(element)(scope)
    scope.$digest()
    expect(element).to.exist
  })
})
