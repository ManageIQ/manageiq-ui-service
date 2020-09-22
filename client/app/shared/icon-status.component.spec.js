/* global inject */
describe('Component: Icon-status', () => {
  let parentScope, $compile

  beforeEach(module('app.services', 'app.shared'))

  beforeEach(inject((_$compile_, _$rootScope_) => {
    $compile = _$compile_
    parentScope = _$rootScope_.$new()
  }))

  const compileHtml = (markup, scope) => {
    let element = angular.element(markup)
    $compile(element)(scope)
    scope.$digest()
    return element
  }

  it('should display success when status matches success', () => {
    const renderedElement = compileHtml(`<icon-status status="'success'" success="['success']" />`, parentScope)

    expect(renderedElement[0].querySelectorAll('.pficon-ok').length).to.eq(1)
  })

  it('should display error when status matches error', () => {
    const renderedElement = compileHtml(`<icon-status status="'error'" error="['error']" />`, parentScope)

    expect(renderedElement[0].querySelectorAll('.pficon-error-circle-o').length).to.eq(1)
  })

  it('should display pending when status matches pending', () => {
    const renderedElement = compileHtml(`<icon-status status="'pending'" queued="['pending']" />`, parentScope)

    expect(renderedElement[0].querySelectorAll('.fa-hourglass-half').length).to.eq(1)
  })

  it('should display spinner when status is matches inprogress', () => {
    const renderedElement = compileHtml(`<icon-status status="'inprogress'" inprogress="['inprogress']" />`, parentScope)

    expect(renderedElement[0].querySelectorAll('.spinner').length).to.eq(1)
  })

  it('should display unknown when status unknown', () => {
    const renderedElement = compileHtml(`<icon-status status="'foo'" />`, parentScope)

    expect(renderedElement[0].querySelectorAll('.pficon-help').length).to.eq(1)
  })
})
