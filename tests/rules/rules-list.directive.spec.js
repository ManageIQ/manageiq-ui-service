/* jshint -W117, -W030 */
describe('app.states.RulesListDirective', function() {
  var $scope;
  var $compile;
  var element;
  var successResponse = {
    message: 'Success!'
  };

  beforeEach(function () {
    module('app.services', 'app.config', 'app.states', 'gettext');
    bard.inject('RulesState', '$state', 'Session', '$httpBackend');
  });

  beforeEach(inject(function (_$compile_, _$rootScope_, _$document_) {
    $compile = _$compile_;
    $scope = _$rootScope_;
    $document = _$document_
  }));

  var compileHTML = function (markup, scope) {
    element = angular.element(markup);
    $compile(element)(scope);

    scope.$digest();
  };

  beforeEach(function () {
    Session.create({
      auth_token: 'b10ee568ac7b5d4efbc09a6b62cb99b8',
    });
    $httpBackend.whenGET('').respond(200);

    $scope.arbitrationRules = [
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
    $scope.fields = ['field1', 'field2', 'field3', 'field4'];
    $scope. profiles = [
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

    var htmlTmp = '<rules-list arbitration-rules="arbitrationRules" fields="fields" profiles="profiles"></div>';

    compileHTML(htmlTmp, $scope);

    getRulesSpy = sinon.stub(RulesState, 'getRules').returns(Promise.resolve({resources: $scope.arbitrationRules}));
    editRulesSpy = sinon.stub(RulesState, 'editRules').returns(Promise.resolve(successResponse));
    removeRuleSpy = sinon.stub(RulesState, 'deleteRules').returns(Promise.resolve(successResponse));

  });

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

  describe('rulesList', function() {
    it('should have correct number of rows', function () {
      var rows = element.find('.arbitration-rules-list > .list-group-item');
      expect(rows.length).to.eq($scope.arbitrationRules.length);
    });

    it('should show edit controls when not editing an item', function () {
      var rows = element.find('.arbitration-rules-list > .list-group-item');
      expect(rows.length).to.eq($scope.arbitrationRules.length);

      verifyViewMode(angular.element(rows[0]));
    });

    it('should add a row and go into edit mode when the create button is clicked', function () {
      var initLength = $scope.arbitrationRules.length;
      var rows = element.find('.arbitration-rules-list > .list-group-item');
      expect(rows.length).to.eq(initLength);

      verifyViewMode(angular.element(rows[0]));

      var createButton = element.find('actions .btn.btn-primary');
      expect(createButton.length).to.eq(1);

      eventFire(createButton[0], 'click');
      $scope.$digest();

      rows = element.find('.arbitration-rules-list > .list-group-item');
      expect(rows.length).to.eq(initLength + 1);

      verifyEditMode(angular.element(rows[0]));
    });

    it('should enter edit mode when an edit button is clicked', function () {
      var rows = element.find('.arbitration-rules-list > .list-group-item');
      expect(rows.length).to.eq($scope.arbitrationRules.length);

      var rowElement = angular.element(rows[1]);

      verifyViewMode(rowElement);

      var editButton = rowElement.find('.pficon.pficon-edit');
      expect(editButton.length).to.eq(1);

      eventFire(angular.element(editButton[0]).parent(), 'click');
      $scope.$digest();

      rows = element.find('.arbitration-rules-list > .list-group-item');
      expect(rows.length).to.eq($scope.arbitrationRules.length);

      rowElement = angular.element(rows[1]);
      verifyEditMode(rowElement);
    });

    it('should leave edit mode when cancel is selected', function () {
      var rows = element.find('.arbitration-rules-list > .list-group-item');
      expect(rows.length).to.eq($scope.arbitrationRules.length);

      var rowElement = angular.element(rows[1]);

      verifyViewMode(rowElement);

      var editButton = rowElement.find('.pficon.pficon-edit');
      expect(editButton.length).to.eq(1);

      eventFire(angular.element(editButton[0]).parent(), 'click');
      $scope.$digest();

      rows = element.find('.arbitration-rules-list > .list-group-item');
      expect(rows.length).to.eq($scope.arbitrationRules.length);

      rowElement = angular.element(rows[1]);
      verifyEditMode(rowElement);

      var cancelButton = rowElement.find('.arbitration-buttons .btn-default');
      expect(cancelButton.length).to.eq(1);

      eventFire(cancelButton[0], 'click');
      $scope.$digest();

      verifyViewMode(rowElement);
    });

    it('should save edits when Save is selected', function () {
      var rows = element.find('.arbitration-rules-list > .list-group-item');
      expect(rows.length).to.eq($scope.arbitrationRules.length);

      var rowElement = angular.element(rows[1]);

      verifyViewMode(rowElement);

      var editButton = rowElement.find('.pficon.pficon-edit');
      expect(editButton.length).to.eq(1);

      eventFire(angular.element(editButton[0]).parent(), 'click');
      $scope.$digest();

      rows = element.find('.arbitration-rules-list > .list-group-item');
      expect(rows.length).to.eq($scope.arbitrationRules.length);

      rowElement = angular.element(rows[1]);
      verifyEditMode(rowElement);

      var saveButton = rowElement.find('.arbitration-buttons .btn-primary');
      expect(saveButton.length).to.eq(1);

      eventFire(saveButton[0], 'click');
      $scope.$digest();

      expect(editRulesSpy).to.have.been.called;
    });

    it('should require confirmation before deleting a rule', function () {
      var rows = element.find('.arbitration-rules-list > .list-group-item');
      expect(rows.length).to.eq($scope.arbitrationRules.length);

      var rowElement = angular.element(rows[1]);

      verifyViewMode(rowElement);

      var removeButton = rowElement.find('.pficon.pficon-delete');
      expect(removeButton.length).to.eq(1);

      eventFire(angular.element(removeButton[0]).parent(), 'click');
      $scope.$digest();

      var modalMessage = $document.find('.modal-body .confirmation__message');
      expect(modalMessage.length).to.eq(1);
    });
  });
});
