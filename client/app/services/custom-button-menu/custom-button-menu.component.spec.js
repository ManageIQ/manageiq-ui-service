/* global $state, $componentController, EventNotifications, RBAC, CollectionsApi */
/* eslint-disable no-unused-expressions */
describe('Component: Custom Button Menu', () => {
  beforeEach(() => {
    module('app.core', 'app.services')
    bard.inject('RBAC', '$componentController', 'EventNotifications', 'CollectionsApi', '$state')
  })

  let ctrl
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
    beforeEach(() => {
      ctrl = $componentController('customButtonMenu', null, { vmId: '1', customActions: customActions })
    })
    it('should allow a custom button action to be executed', () => {
      const stateSpy = sinon.spy($state, 'go')
      ctrl.invokeCustomAction(customActions.buttons[0])
      expect(stateSpy).to.have.been.calledWith(
        'services.custom_button_details')
    })
    it('should hide from someone who doesnt have the right role', () => {
      RBAC.setRole('_TEST2_')
      expect(ctrl.hasRequiredRole(customActions.buttons[0])).to.be.false
    })
  })
  describe('Testing a basic button with VM', () => {
    it('should allow a action on a VM', () => {
      ctrl = $componentController('customButtonMenu', null, { vmId: '1', customActions: customActions })
      const apiPostStub = sinon.stub(CollectionsApi, 'post').returns(Promise.resolve())
      const vmAction = customActions
      delete vmAction.buttons[0]['resource_action']
      ctrl.invokeCustomAction(vmAction.buttons[0])
      expect(apiPostStub).to.have.been.calledWith('vms', '1', {}, {action: 'Foo'})
    })
  })
  describe('Testing a basic button with a Service', () => {
    it('should allow a action on a VM', () => {
      ctrl = $componentController('customButtonMenu', null, { serviceId: '1', customActions: customActions })
      const apiPostStub = sinon.stub(CollectionsApi, 'post').returns(Promise.resolve())
      const vmAction = customActions
      delete vmAction.buttons[0]['resource_action']
      ctrl.invokeCustomAction(vmAction.buttons[0])
      expect(apiPostStub).to.have.been.calledWith('services', '1', {}, {action: 'Foo'})
    })
  })
})
