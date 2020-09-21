/* global inject */
/* eslint-disable no-unused-expressions */
describe('detail-reveal component', () => {
  let ctrl

  beforeEach(() => {
    module('app.services')
  })

  describe('controller', () => {
    let $componentController
    const bindings = {
      title: 'Test',
      detail: 'test detail',
      icon: 'testIconClass',
      translateTitle: false,
      rowClass: 'test'
    }

    beforeEach(
      inject(function (_$componentController_, $injector) {
        $componentController = _$componentController_
        let transclude = () => {
          const returnObj = {}
          returnObj.length = 0
          return returnObj
        }
        ctrl = $componentController('detailReveal', {$transclude: transclude}, bindings)
      })
    )

    it('is defined, accepts bindings', () => {
      expect(ctrl).to.exist
      expect(ctrl.title).to.equal('Test')
      expect(ctrl.detail).to.equal('test detail')
      expect(ctrl.icon).to.equal('testIconClass')
      expect(ctrl.translateTitle).to.equal(false)
      expect(ctrl.rowClass).to.equal('test')
    })
  })

  describe('transcluded content', () => {
    let $componentController
    const bindings = {
      title: 'Test',
      detail: 'test detail',
      icon: 'testIconClass',
      translateTitle: false,
      rowClass: 'test'
    }

    beforeEach(
      inject(function (_$componentController_, $injector) {
        $componentController = _$componentController_
        let transclude = () => {
          const returnObj = {}
          returnObj.length = 10// This just is attempting to dummy some html content length > 0
          return returnObj
        }
        ctrl = $componentController('detailReveal', {$transclude: transclude}, bindings)
        ctrl.$onInit()
      })
    )

    it('Component sees transcluded content', () => {
      expect(ctrl).to.exist
      expect(ctrl.hasMoreDetails).to.equal(true)
    })
  })
})
