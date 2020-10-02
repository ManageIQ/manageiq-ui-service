/* global readJSON, $componentController, ModalService, ServicesState */
/* eslint-disable no-unused-expressions */
describe('Component: ServiceDetailsAnsibleComponent', function () {
  let scope, ctrl
  let mockDir = 'tests/mock/services/'
  const service = readJSON(mockDir + 'serviceDetailsAnsibleComponent.json')
  const successResponse = {}

  beforeEach(function () {
    module('app.core', 'app.states', 'app.services')
    bard.inject('$componentController', '$state', 'ModalService', 'ServicesState', 'lodash')
    ctrl = $componentController('serviceDetailsAnsible', {$scope: scope}, {service: service})
  })

  it('is defined', function () {
    expect(ctrl).to.exist
  })
  it('should allow credList to be retrieved', () => {
    const expectedConfig = {showSelectBox: false, selectionMatchProp: 'id'}
    ctrl.$onInit()
    expect(ctrl.credListConfig).to.eql(expectedConfig)
  })
  it('should allow playlistconfig to be retrieved', () => {
    const expectedConfig = {showSelectBox: false, selectionMatchProp: 'id'}
    ctrl.$onInit()
    expect(ctrl.playsListConfig).to.eql(expectedConfig)
  })
  it('should allow watchLive', () => {
    const modalSpy = sinon.spy(ModalService, 'open')
    ctrl.$onInit()
    ctrl.watchLive('item')
    expect(modalSpy).to.have.been.called
  })
  it('should get a services credentials if they exist', (done) => {
    const getServiceCredentialSpy = sinon.stub(ServicesState, 'getServiceCredential').returns(Promise.resolve(successResponse))
    const getServiceRepositorySpy = sinon.stub(ServicesState, 'getServiceRepository').returns(Promise.resolve(successResponse))
    const getServiceJobsStdoutSpy = sinon.stub(ServicesState, 'getServiceJobsStdout').returns(Promise.resolve(successResponse))

    ctrl.$onInit()
    ctrl.fetchResources()
    done()

    expect(getServiceCredentialSpy).to.have.been.calledWith('testing')
    expect(getServiceRepositorySpy).to.have.been.calledWith('testrepo')
    expect(getServiceJobsStdoutSpy).to.have.been.calledWith(12345, 1)
  })
  it('should calculate elapsed time', () => {
    ctrl.$onInit()
    const elapsedTime = ctrl.elapsed(1497908279, 1497908159)
    expect(elapsedTime).to.eq(0.12)
  })
  it('should allow onchanges to be called', (done) => {
    const getServiceCredentialSpy = sinon.stub(ServicesState, 'getServiceCredential').returns(Promise.resolve(successResponse))
    ctrl.$onChanges()
    done()

    expect(getServiceCredentialSpy).to.have.been.called
  })
})
