/* global readJSON, $componentController, CollectionsApi, inject */
/* eslint-disable no-unused-expressions */
describe('Component: ServiceDetails', () => {
  beforeEach(() => {
    module('app.core', 'app.states', 'app.services')
  })

  describe('with $compile', () => {
    let scope, isoScope, element
    let mockDir = 'tests/mock/services/'

    beforeEach(inject(($stateParams, $compile, $rootScope, $httpBackend) => {
      scope = $rootScope.$new()
      $httpBackend.whenGET('').respond(200)

      scope.service = readJSON(mockDir + 'service1.json')
      scope.tags = readJSON(mockDir + 'service1_tags.json')

      element = angular.element('<service-details />')
      let el = $compile(element)(scope)
      scope.$digest()

      isoScope = el.isolateScope()
      isoScope.vm.service = scope.service
      isoScope.vm.loading = false
      isoScope.$digest()
    }))

    it('should show the correct properties', () => {
      isoScope.vm.availableTags = scope.tags
      isoScope.$digest()

      const readonlyInputs = element.find('.form-control')
      expect(readonlyInputs[1].value).to.eq('RHEL7 on VMware')
      expect(readonlyInputs[2].value).to.eq('8e892' +
        '478-addd-11e6-9f30-005056b15629')
      expect(readonlyInputs[3].value).to.eq('10000000000542')
      expect(readonlyInputs[4].value).to.eq('Administrator')
      expect(readonlyInputs[5].value).to.eq('$')
      expect(readonlyInputs[6].value).to.eq('Nov 18, 2016 12:00:00 AM')
      expect(readonlyInputs[7].value).to.eq('Unknown')
      expect(readonlyInputs[8].value).to.eq('Oct 21, 2017')

      const tagsControl = element.find('.ss-form-readonly .service-details-tag-control')
      expect(tagsControl.length).to.eq(1)

      const tags = angular.element(tagsControl[0]).find('.label-info')
      expect(tags.length).to.eq(2)
      expect(tags[0].innerHTML.indexOf('Environment: Development')).to.not.eq(-1)
      expect(tags[1].innerHTML.indexOf('Workload: app')).to.not.eq(-1)
    })

    it('should have show the correct resources', () => {
      isoScope.vm.computeGroup = isoScope.vm.createResourceGroups(isoScope.vm.service)
      isoScope.$digest()

      const resourceTitles = element.find('.service-details-resource-group-title')
      expect(resourceTitles.length).to.eq(1)
      expect(resourceTitles[0].innerHTML).to.eq(' Compute (1) ')

      const resourceItems = element.find('.service-details-resource-list-container .list-group-item')
      expect(resourceItems.length).to.eq(1)

      const powerIcon = angular.element(resourceItems[0]).find('.pficon.pficon-ok')
      expect(powerIcon.length).to.eq(1)

      const typeIcon = angular.element(resourceItems[0]).find('.pficon.pficon-screen')
      expect(typeIcon.length).to.eq(1)

      const name = angular.element(resourceItems[0]).find('.name-column > span > a > span')
      expect(name.length).to.eq(1)
      expect(name[0].innerHTML).to.eq(' demo-iot-2 ')
    })

    it('should have show the correct relationships', () => {
      const relationshipsPanel = element.find('.relationships-panel')
      expect(relationshipsPanel.length).to.eq(1)

      const rows = angular.element(relationshipsPanel[0]).find('.row')
      expect(rows.length).to.eq(1)

      const columns = angular.element(rows[0]).find('.col-sm-4')
      expect(columns.length).to.eq(3)

      const relationShipName = angular.element(columns[0]).find('a')
      expect(relationShipName[0].innerHTML).to.eq('RHEL7 on VMware')

      expect(columns[1].innerHTML).to.eq('Parent Catalog Item')

      const description = angular.element(columns[2]).find('span')
      expect(description[0].innerHTML).to.eq('RHEL7 on VMware')
    })

    xit('should allow approprate actions', () => {
      isoScope.vm.hasCustomButtons(isoScope.vm.service)
      isoScope.$digest()

      const actionsPanel = element.find('.ss-details-header__actions')
      expect(actionsPanel.length).to.eq(1)

      const actionButtons = angular.element(actionsPanel[0]).find('.custom-dropdown')
      expect(actionButtons.length).to.eq(4)

      const powerButtons = angular.element(actionButtons[0]).find('.dropdown-menu > li')
      expect(powerButtons.length).to.eq(3)

      const startButton = angular.element(powerButtons[0])
      const stopButton = angular.element(powerButtons[1])
      const suspendButton = angular.element(powerButtons[2])

      expect(startButton.hasClass('disabled')).to.eq(false)
      expect(stopButton.hasClass('disabled')).to.eq(true)
      expect(suspendButton.hasClass('disabled')).to.eq(true)
    })
  })
  describe('with $componentController', () => {
    let ctrl
    let mockDir = 'tests/mock/services/'
    beforeEach(() => {
      bard.inject('$componentController', '$state', '$window', 'CollectionsApi', 'EventNotifications', 'Chargeback', 'Consoles',
        'TagEditorModal', 'ModalService', 'PowerOperations', 'ServicesState', 'TaggingService', 'lodash',
        'Polling', 'LONG_POLLING_INTERVAL')
      const stateParams = {
        serviceId: 1234
      }
      ctrl = $componentController('serviceDetails', {$stateParams: stateParams})
    })
    it('should be defined', () => {
      ctrl.$onInit()
      expect(ctrl).to.exist
    })
    it('should get a service successfully', (done) => {
      const service = readJSON(mockDir + 'service1.json')
      const collectionsApiSpy = sinon.stub(CollectionsApi, 'get').returns(Promise.resolve(service))
      ctrl.$onInit()
      done()

      expect(collectionsApiSpy).to.have.been.calledWith('services', 1234)
    })
    it('should build up generic objects', (done) => {
      const service = readJSON(mockDir + 'service1.json')
      sinon.stub(CollectionsApi, 'get').returns(Promise.resolve(service))
      ctrl.$onInit()
      const genericObjects = service.generic_objects
      const expectedGenericObjects = readJSON(`${mockDir}genericObjects.json`)
      const testExpectedGenericObjects = ctrl.getGenericObjects(genericObjects)
      done()

      expect(testExpectedGenericObjects).to.eql(expectedGenericObjects)
    })
  })
})
