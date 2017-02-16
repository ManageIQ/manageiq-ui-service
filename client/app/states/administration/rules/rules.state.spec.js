describe('app.states.RulesState', function() {
  beforeEach(function () {
    module('app.states');
    bard.inject('$state');
  });

  describe('route', function() {
    it('should work with $state.go', function() {
      $state.go('administration.rules');
      expect($state.is('administration.rules'));
    });
  });

  describe('controller', function() {
    var controller;
    var getRulesSpy;
    var getFieldsSpy;
    var getProfilesSpy;

    var arbitrationRules = {
      resources: [
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
      ]
    };
    var fields = {resources: ['field1', 'field2', 'field3', 'field4']};
    var profiles = {
      resources: [
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
      ]
    };

    beforeEach(function() {
      bard.inject('$controller', 'RulesState', 'ProfilesState');
    });

    it('should be created successfully', function() {
      var controllerResolves = {
        arbitrationRules: arbitrationRules,
        fields: fields,
        profiles: profiles,
      };
      controller = $controller($state.get('administration.rules').controller, controllerResolves);

      expect(controller).to.be.defined;
    });

    it('should get data from the APIs', function (done) {
      getRulesSpy = sinon.stub(RulesState, 'getRules').returns(Promise.resolve(arbitrationRules));
      getFieldsSpy = sinon.stub(RulesState, 'getRuleFields').returns(Promise.resolve(fields));
      getProfilesSpy = sinon.stub(ProfilesState, 'getProfiles').returns(Promise.resolve(profiles));

      $state.go('administration.rules');
      done();

      expect(getRulesSpy).to.have.been.called;
      expect(getFieldsSpy).to.have.been.called;
      expect(getProfilesSpy).to.have.been.called;
    });
  });
});

