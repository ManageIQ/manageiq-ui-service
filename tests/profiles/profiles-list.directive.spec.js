describe('app.components.ProfilesListDirective', function() {
  let $scope;
  let $compile;
  let $document;
  let element;
  let getProfilesSpy;
  let removeProfilSpy;
  let successResponse = {
    message: 'Success!'
  };

  beforeEach(function () {
    module('app.services', 'app.config', 'app.states', 'app.components', 'gettext');
    bard.inject('ProfilesState', '$state', 'Session', '$httpBackend', '$timeout');

    removeProfilSpy = sinon.stub(ProfilesState, 'deleteProfiles').returns(Promise.resolve(successResponse));
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

    $scope.profiles = [
      {
        id: '1',
        name: 'Profile 3',
        description: '1',
        ext_management_system: {
          id: '1',
          name: 'provider 2',
          type: 'amazon'
        },
        created_at: 0,
        updated_at: 0,
        authentication: {
          name: '1',
        },
        cloud_network: {
          name: '1',
        },
        cloud_subnet: {
          name: '1',
        },
        flavor: {
          name: '1',
        },
        availability_zone: {
          name: '1',
        },
        security_group: {
          name: '1'
        },
      },
      {
        id: '2',
        name: 'Profile 1',
        description: '2',
        ext_management_system: {
          id: '2',
          name: 'provider 3',
          type: 'azure'
        },
        created_at: 0,
        updated_at: 0,
        authentication: {
          name: '2',
        },
        cloud_network: {
          name: '2',
        },
        cloud_subnet: {
          name: '2',
        },
        flavor: {
          name: '2',
        },
        availability_zone: {
          name: '2',
        },
        security_group: {
          name: '2'
        },
      },
      {
        id: '3',
        name: 'Profile 2',
        description: '3',
        ext_management_system: {
          id: '3',
          name: 'provider 1',
          type: 'google'
        },
        created_at: 0,
        updated_at: 0,
        authentication: {
          name: '3',
        },
        cloud_network: {
          name: '3',
        },
        cloud_subnet: {
          name: '3',
        },
        flavor: {
          name: '3',
        },
        availability_zone: {
          name: '3',
        },
        security_group: {
          name: '3'
        },
      },
    ];

    getProfilesSpy = sinon.stub(ProfilesState, 'getProfiles').returns(Promise.resolve({resources: $scope.arbitrationRules}));

    $scope.refreshCalled = false;
    $scope.refresh = function() {
      $scope.refreshCalled = true;
    };

    var htmlTmp = '<profiles-list arbitration-profiles="profiles" refresh-fn="refresh"></div>';

    compileHTML(htmlTmp, $scope);
  });

  describe('profilesList', function() {
    it('should have correct number of rows', function () {
      var rows = element.find('#arbitrationProfilesList .list-group-item');
      expect(rows.length).to.eq($scope.profiles.length);
    });

    it('should update to the correct number of rows when changed', function () {
      var initLength = $scope.profiles.length;
      var rows = element.find('#arbitrationProfilesList .list-group-item');
      expect(rows.length).to.eq(initLength);

      $scope.profiles.push(
        {
          id: '4',
          name: '4',
          description: '4',
          ext_management_system: {
            id: '4',
            name: 'provider 4',
            type: 'google'
          },
          created_at: 0,
          updated_at: 0,
          authentication: {
            name: '4',
          },
          cloud_network: {
            name: '4',
          },
          cloud_subnet: {
            name: '4',
          },
          flavor: {
            name: '4',
          },
          availability_zone: {
            name: '4',
          },
          security_group: {
            name: '4'
          },
        }
      );
      $scope.$digest();

      rows = element.find('#arbitrationProfilesList .list-group-item');
      expect(rows.length).to.eq(initLength + 1);
    });

    it('should view a profile when the profile is clicked', function () {
      var stateGoSpy = sinon.spy($state, 'go');
      var rows = element.find('#arbitrationProfilesList .list-group-item');

      var rowElement = angular.element(rows[1]);

      var rowInfo = rowElement.find('.list-view-pf-main-info');
      expect(rowInfo.length).to.eq(1);

      eventFire(angular.element(rowInfo[0]), 'click');
      $scope.$digest();

      expect(stateGoSpy).to.have.been.calledWith('administration.profiles.details', { profileId: "3" });
    });

    it('should view a profile when the profile view menu item is clicked', function () {
      var stateGoSpy = sinon.spy($state, 'go');
      var rows = element.find('#arbitrationProfilesList .list-group-item');

      var rowElement = angular.element(rows[1]);

      var menuItems = rowElement.find('.dropdown-kebab-pf li > a');
      expect(menuItems.length).to.eq(3);

      eventFire(angular.element(menuItems[0]), 'click');
      $scope.$digest();

      expect(stateGoSpy).to.have.been.calledWith('administration.profiles.details', { profileId: "3" });
    });

    it('should edit a profile when the profile edit menu item is clicked', function () {
      var stateGoSpy = sinon.spy($state, 'go');
      var rows = element.find('#arbitrationProfilesList .list-group-item');

      var rowElement = angular.element(rows[1]);

      var menuItems = rowElement.find('.dropdown-kebab-pf li > a');
      expect(menuItems.length).to.eq(3);

      eventFire(angular.element(menuItems[1]), 'click');
      $scope.$digest();

      expect(stateGoSpy).to.have.been.calledWith('administration.profiles.editor', { profileId: "3" });
    });

    it('should require confirmation before deleting a profile', function () {
      var rows = element.find('#arbitrationProfilesList .list-group-item');

      var rowElement = angular.element(rows[1]);

      var menuItems = rowElement.find('.dropdown-kebab-pf li > a');
      expect(menuItems.length).to.eq(3);

      eventFire(angular.element(menuItems[2]), 'click');
      $scope.$digest();

      var confirmDialog = $document.find('#confirmDeleteProfile');
      expect(confirmDialog.length).to.eq(1);
    });

    it('should sort the profiles appropriately', function () {
      // Default sort is by name
      var nameSpans = element.find('.list-view-pf-main-info > .row > .col-md-2 > span');
      expect(nameSpans.length).to.eq(3);
      expect(nameSpans[0].innerHTML.trim()).to.eq('Profile 1');

      var sortItems = element.find('.sort-pf .sort-field');
      expect(sortItems.length).to.eq(4);

      // Sort by provider name
      eventFire(angular.element(sortItems[2]), 'click');
      $scope.$digest();

      nameSpans = element.find('.list-view-pf-main-info > .row > .col-md-2 > span');
      expect(nameSpans.length).to.eq(3);
      expect(nameSpans[0].innerHTML.trim()).to.eq('Profile 2');

      // Sort by provider type
      eventFire(angular.element(sortItems[3]), 'click');
      $scope.$digest();

      nameSpans = element.find('.list-view-pf-main-info > .row > .col-md-2 > span');
      expect(nameSpans.length).to.eq(3);
      expect(nameSpans[0].innerHTML.trim()).to.eq('Profile 3');

      // Sort by last modified
      eventFire(angular.element(sortItems[1]), 'click');
      $scope.$digest();

      nameSpans = element.find('.list-view-pf-main-info > .row > .col-md-2 > span');
      expect(nameSpans.length).to.eq(3);
      expect(nameSpans[0].innerHTML.trim()).to.eq('Profile 1');
    });
  });
});
