describe('Component: rulesList', function() {

  beforeEach(function() {
    module('app.components', 'app.config', 'gettext');
    bard.inject('RulesState', 'Session', '$httpBackend');
  });

  describe('with $compile', function() {
    let scope;
    let document;
    let element;
    let successResponse = {
      message: 'Success!'
    };
    let editRulesSpy;

    beforeEach(inject(function($compile, $rootScope, $document) {
      scope = $rootScope.$new();
      document = $document;

      element = angular.element('<rules-list arbitration-rules="arbitrationRules" fields="fields" profiles="profiles"/>');
      $compile(element)(scope);

      Session.create({
        auth_token: 'b10ee568ac7b5d4efbc09a6b62cb99b8',
      });
      $httpBackend.whenGET('').respond(200);

      scope.arbitrationRules = [
        {
          id: '1',
          priority: '1',
          operation: 'inject',
          expression: {
            EQUAL: {
              field: 'field',
              value: 'value'
            }
          },
          arbitration_profile_id: '1'
        },
        {
          id: '1',
          priority: '1',
          operation: 'inject',
          expression: {
            EQUAL: {
              field: 'field',
              value: 'value'
            }
          },
          arbitration_profile_id: '1'
        },
        {
          id: '1',
          priority: '1',
          operation: 'inject',
          expression: {
            EQUAL: {
              field: 'field',
              value: 'value'
            }
          },
          arbitration_profile_id: '1'
        }
      ];
      scope.fields = ['field1', 'field2', 'field3', 'field4'];
      scope.profiles = [
        {
          name: 'profile1',
          id: '1'
        },
        {
          name: 'profile2',
          id: '2'
        },
        {
          name: 'profile3',
          id: '3'
        },
        {
          name: 'profile4',
          id: '4'
        }
      ];

      editRulesSpy = sinon.stub(RulesState, 'editRules').returns(Promise.resolve(successResponse));

      scope.$apply();
    }));

    function verifyViewMode(rowElement) {
      var disabledCreateButton = element.find('actions .btn.btn-primary[disabled]');
      expect(disabledCreateButton.length).to.eq(0);

      var downButton = rowElement.find('.fa.fa-arrow-down');
      expect(downButton.length).to.eq(1);

      var upButton = rowElement.find('.fa.fa-arrow-up');
      expect(upButton.length).to.eq(1);

      var editButton = rowElement.find('.pficon.pficon-edit');
      expect(editButton.length).to.eq(1);

      var removeButton = rowElement.find('.pficon.pficon-delete');
      expect(removeButton.length).to.eq(1);

      var saveButton = rowElement.find('.arbitration-buttons .btn-primary');
      expect(saveButton.length).to.eq(0);

      var cancelButton = rowElement.find('.arbitration-buttons .btn-default');
      expect(cancelButton.length).to.eq(0);
    }

    function verifyEditMode(rowElement) {
      var disabledCreateButton = element.find('actions .btn.btn-primary[disabled]');
      expect(disabledCreateButton.length).to.eq(1);

      var downButton = rowElement.find('.fa.fa-arrow-down');
      expect(downButton.length).to.eq(0);

      var upButton = rowElement.find('.fa.fa-arrow-up');
      expect(upButton.length).to.eq(0);

      var editButton = rowElement.find('.pficon.pficon-edit');
      expect(editButton.length).to.eq(0);

      var removeButton = rowElement.find('.pficon.pficon-delete');
      expect(removeButton.length).to.eq(0);

      var saveButton = rowElement.find('.arbitration-buttons .btn-primary');
      expect(saveButton.length).to.eq(1);

      var cancelButton = rowElement.find('.arbitration-buttons .btn-default');
      expect(cancelButton.length).to.eq(1);
    }

    it('should have correct number of rows', function() {
      var rows = element.find('.arbitration-rules-list > .list-group-item');
      expect(rows.length).to.eq(scope.arbitrationRules.length);
    });

    it('should show edit controls when not editing an item', function() {
      var rows = element.find('.arbitration-rules-list > .list-group-item');
      expect(rows.length).to.eq(scope.arbitrationRules.length);

      verifyViewMode(angular.element(rows[0]));
    });

    it('should add a row and go into edit mode when the create button is clicked', function() {
      var initLength = scope.arbitrationRules.length;
      var rows = element.find('.arbitration-rules-list > .list-group-item');
      expect(rows.length).to.eq(initLength);

      verifyViewMode(angular.element(rows[0]));

      var createButton = element.find('actions .btn.btn-primary');
      expect(createButton.length).to.eq(1);

      eventFire(createButton[0], 'click');
      scope.$apply();

      rows = element.find('.arbitration-rules-list > .list-group-item');
      expect(rows.length).to.eq(initLength + 1);

      verifyEditMode(angular.element(rows[0]));
    });

    it('should enter edit mode when an edit button is clicked', function() {
      var rows = element.find('.arbitration-rules-list > .list-group-item');
      expect(rows.length).to.eq(scope.arbitrationRules.length);

      var rowElement = angular.element(rows[1]);

      verifyViewMode(rowElement);

      var editButton = rowElement.find('.pficon.pficon-edit');
      expect(editButton.length).to.eq(1);

      eventFire(angular.element(editButton[0]).parent(), 'click');
      scope.$apply();

      rows = element.find('.arbitration-rules-list > .list-group-item');
      expect(rows.length).to.eq(scope.arbitrationRules.length);

      rowElement = angular.element(rows[1]);
      verifyEditMode(rowElement);
    });

    it('should leave edit mode when cancel is selected', function() {
      var rows = element.find('.arbitration-rules-list > .list-group-item');
      expect(rows.length).to.eq(scope.arbitrationRules.length);

      var rowElement = angular.element(rows[1]);

      verifyViewMode(rowElement);

      var editButton = rowElement.find('.pficon.pficon-edit');
      expect(editButton.length).to.eq(1);

      eventFire(angular.element(editButton[0]).parent(), 'click');
      scope.$apply();

      rows = element.find('.arbitration-rules-list > .list-group-item');
      expect(rows.length).to.eq(scope.arbitrationRules.length);

      rowElement = angular.element(rows[1]);
      verifyEditMode(rowElement);

      var cancelButton = rowElement.find('.arbitration-buttons .btn-default');
      expect(cancelButton.length).to.eq(1);

      eventFire(cancelButton[0], 'click');
      scope.$apply();

      verifyViewMode(rowElement);
    });

    it('should save edits when Save is selected', function() {
      var rows = element.find('.arbitration-rules-list > .list-group-item');
      expect(rows.length).to.eq(scope.arbitrationRules.length);

      var rowElement = angular.element(rows[1]);

      verifyViewMode(rowElement);

      var editButton = rowElement.find('.pficon.pficon-edit');
      expect(editButton.length).to.eq(1);

      eventFire(angular.element(editButton[0]).parent(), 'click');
      scope.$apply();

      rows = element.find('.arbitration-rules-list > .list-group-item');
      expect(rows.length).to.eq(scope.arbitrationRules.length);

      rowElement = angular.element(rows[1]);
      verifyEditMode(rowElement);

      var saveButton = rowElement.find('.arbitration-buttons .btn-primary');
      expect(saveButton.length).to.eq(1);

      eventFire(saveButton[0], 'click');
      scope.$apply();

      expect(editRulesSpy).to.have.been.called;
    });

    it('should require confirmation before deleting a rule', function() {
      var rows = element.find('.arbitration-rules-list > .list-group-item');
      expect(rows.length).to.eq(scope.arbitrationRules.length);

      var rowElement = angular.element(rows[1]);

      verifyViewMode(rowElement);

      var removeButton = rowElement.find('.pficon.pficon-delete');
      expect(removeButton.length).to.eq(1);

      eventFire(angular.element(removeButton[0]).parent(), 'click');
      scope.$apply();

      var modalMessage = document.find('#confirmDeleteRule .modal-body .confirmation__message');
      expect(modalMessage.length).to.eq(1);
    });
  });
});
