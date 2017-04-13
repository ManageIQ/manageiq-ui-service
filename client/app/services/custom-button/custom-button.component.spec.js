describe('CustomButton component', () => {
  let parentScope, element, stateGoStub, apiPostStub;

  beforeEach(module('app.services'));

  beforeEach(inject(($compile, $rootScope, $state, CollectionsApi) => {
    parentScope = $rootScope.$new();
    parentScope.customActions = {
      buttons: [
        {
          name: 'Foo',
          visibility: {
            roles: ['_ALL_'],
          },
          resource_action: {
            dialog_id: '_a dialog id_'
          },
        },
        {
          name: 'Bar',
          visibility: {
            roles: ['_ALL_'],
          },
        },
      ],
    };
    parentScope.serviceId = '_a service id_';

    element = angular.element(`
      <custom-button custom-actions="customActions" service-id="serviceId">
      </custom-button>
    `);
    $compile(element)(parentScope);
    parentScope.$digest();

    stateGoStub = sinon.stub($state, 'go');
    apiPostStub = sinon.stub(CollectionsApi, 'post').returns(Promise.resolve());
  }));

  it('displays a button for each custom action', () => {
    const numActions = parentScope.customActions.buttons.length;
    const actions = element[0].querySelectorAll('.custom-button-action');

    expect(actions.length).to.eq(numActions);
  });

  describe('for actions visible to specified roles', () => {
    let RBAC;

    beforeEach(inject((_RBAC_) => {
      RBAC = _RBAC_;
      parentScope.customActions = {
        buttons: [
          {
            name: 'Secret Button',
            visibility: {
              roles: ['Secret-Agent'],
            },
          },
        ],
      };
    }));

    it('displays a button if the role allows', () => {
      RBAC.setRole('Secret-Agent');
      parentScope.$digest();

      const actions = element[0].querySelectorAll('.custom-button-action');

      expect(actions.length).to.eq(1);
    });

    it('does not display a button if the role disallows', () => {
      RBAC.setRole('Innocent-Bystander');
      parentScope.$digest();

      const actions = element[0].querySelectorAll('.custom-button-action');

      expect(actions.length).to.eq(0);
    });
  });

  describe('#invokeCustomAction', () => {
    describe('when the action has a dialog', () => {
      it('navigates to the "services.custom_button_details" state', () => {
        const action = findIn(element, 'button.custom-button-action');
        const nextState = 'services.custom_button_details';

        action.triggerHandler('click');

        expect(stateGoStub).to.have.been.calledWith(nextState, {
          button: parentScope.customActions.buttons[0],
          serviceId: '_a service id_',
        });
      });
    });

    describe('when the action does not have a dialog', () => {
      it('makes a POST request for the selected action', () => {
        const button = element[0].querySelectorAll('.custom-button-action')[1];
        const action = angular.element(button);

        action.triggerHandler('click');

        expect(apiPostStub).to.have.been.calledWith(
          'services',
          '_a service id_',
          {},
          { action: 'Bar' },
        );
      });
    });
  });
});
