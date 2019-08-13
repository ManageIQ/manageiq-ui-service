/* global inject */
/* eslint comma-dangle: 0 */

const CustomButton = (name, rest = {}) => Object.assign({
  name,
  enabled: true,
  options: {
    display_for: 'both',
  },
  visibility: {
    roles: ['_ALL_'],
  },
}, rest)

describe('CustomButton component', () => {
  let parentScope, element, stateGoStub, apiPostStub

  beforeEach(module('app.services'))

  beforeEach(inject(($compile, $rootScope, $state, CollectionsApi) => {
    parentScope = $rootScope.$new()
    parentScope.customActions = {
      buttons: [
        CustomButton('Foo', {
          resource_action: {
            dialog_id: '_a dialog id_',
          }
        }),
        CustomButton('Bar'),
      ]
    }
    parentScope.serviceId = '_a service id_'

    element = angular.element(`
      <custom-button custom-actions="customActions" service-id="serviceId">
      </custom-button>
    `)
    $compile(element)(parentScope)
    parentScope.$digest()

    stateGoStub = sinon.stub($state, 'go')
    apiPostStub = sinon.stub(CollectionsApi, 'post').returns(Promise.resolve())
  }))

  it('displays a button for each custom action', () => {
    const numActions = parentScope.customActions.buttons.length
    const actions = element[0].querySelectorAll('.custom-button-action')

    expect(actions.length).to.eq(numActions)
  })

  describe('for actions visible to specified roles', () => {
    let RBAC

    beforeEach(inject((_RBAC_) => {
      RBAC = _RBAC_
      parentScope.customActions = {
        buttons: [
          CustomButton('Secret Button', {
            enabled: undefined,
            visibility: {
              roles: ['Secret-Agent']
            }
          }),
        ]
      }
    }))

    it('displays a button if the role allows', () => {
      RBAC.setRole('Secret-Agent')
      parentScope.$digest()

      const actions = element[0].querySelectorAll('.custom-button-action')

      expect(actions.length).to.eq(1)
    })

    it('does not display a button if the role disallows', () => {
      RBAC.setRole('Innocent-Bystander')
      parentScope.$digest()

      const actions = element[0].querySelectorAll('.custom-button-action')

      expect(actions.length).to.eq(0)
    })
  })

  describe('#invokeCustomAction', () => {
    describe('when the action has a dialog', () => {
      it('navigates to the "services.custom_button_details" state', () => {
        const action = element.find('button.custom-button-action')
        action.triggerHandler('click')

        expect(stateGoStub).to.have.been.calledWith('services.custom_button_details', {
          button: parentScope.customActions.buttons[0],
          serviceId: '_a service id_'
        })
      })
    })

    describe('when the action does not have a dialog', () => {
      it('makes a POST request for the selected action', () => {
        const action = element.find('button.custom-button-action').eq(1)
        action.triggerHandler('click')

        expect(apiPostStub).to.have.been.calledWith(
          'services',
          '_a service id_',
          {},
          {action: 'Bar'}
        )
      })
    })
  })
})

describe('Custom buttons for a VM', () => {
  let parentScope, element, apiPostStub

  beforeEach(module('app.services'))

  beforeEach(inject(($compile, $rootScope, $state, CollectionsApi) => {
    parentScope = $rootScope.$new()
    parentScope.customActions = {
      buttons: [
        CustomButton('Bar'),
      ]
    }
    parentScope.serviceId = '_a service id_'
    parentScope.vmId = '_a vm id_'

    element = angular.element(`
      <custom-button custom-actions="customActions" service-id="serviceId" vm-id="vmId">
      </custom-button>
    `)
    $compile(element)(parentScope)
    parentScope.$digest()

    apiPostStub = sinon.stub(CollectionsApi, 'post').returns(Promise.resolve())
  }))

  it('should make a post to the vms endpoint', () => {
    const action = element.find('button.custom-button-action')
    action.triggerHandler('click')

    expect(apiPostStub).to.have.been.calledWith(
      'vms',
      '_a vm id_',
      {},
      {action: 'Bar'}
    )
  })
})
