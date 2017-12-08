/* global $state, $componentController, RBAC, CollectionsApi */
/* eslint-disable no-unused-expressions */
describe('Component: Custom Button Menu', () => {
  beforeEach(() => {
    module('app.core', 'app.services')
    bard.inject('RBAC', '$componentController', 'EventNotifications', 'CollectionsApi', '$state')
  })

  let customActions = {
    buttons: [
      {
        name: 'Foo',
        visibility: {
          roles: ['_TEST_']
        },
        enabled: true,
        resource_action: {
          dialog_id: '_a dialog id_'
        }
      },
      {
        name: 'Bar',
        visibility: {
          roles: ['_ALL_']
        },
        enabled: true
      }
    ]
  }

  describe('with $compile', () => {
    let ctrlVM
    let ctrlService
    let apiPostStub
    let vmAction
    vmAction = Object.assign({}, customActions)
    beforeEach(() => {
      apiPostStub = sinon.stub(CollectionsApi, 'post').returns(Promise.resolve())
      ctrlVM = $componentController('customButtonMenu', null, { vmId: '1', customActions: customActions })
    })
    it('should allow a custom button action to be executed', () => {
      const stateSpy = sinon.spy($state, 'go')
      ctrlVM.invokeCustomAction(customActions.buttons[0])
      expect(stateSpy).to.have.been.calledWith(
        'services.custom_button_details')
    })
    it('should hide from someone who doesnt have the right role', () => {
      RBAC.setRole('_TEST2_')
      expect(ctrlVM.hasRequiredRole(customActions.buttons[0])).to.be.false
    })
    it('should allow a action on a VM', () => {
      delete vmAction.buttons[0]['resource_action']
      ctrlVM.invokeCustomAction(vmAction.buttons[0])
      expect(apiPostStub).to.have.been.calledWith('vms', '1', {}, { action: 'Foo' })
    })
    it('should allow an action on a Service', () => {
      delete vmAction.buttons[0]['resource_action']
      ctrlService = $componentController('customButtonMenu', null, { serviceId: '1', customActions: customActions })
      ctrlService.invokeCustomAction(vmAction.buttons[1])
      expect(apiPostStub).to.have.been.calledWith('services', '1', {}, { action: 'Bar' })
    })
  })
})
