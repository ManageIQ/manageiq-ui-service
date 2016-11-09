describe('app.services.RulesState', function() {
  beforeEach(function () {
    module('app.services', 'app.config', 'app.states', 'gettext');
  });

  describe('service', function () {
    var collectionsApiSpy;
    var notificationsErrorSpy;
    var notificationsSuccessSpy;
    var successResponse = {
      message: "Success"
    };
    var errorResponse = 'error';

    beforeEach(function () {
      bard.inject('RulesState', 'CollectionsApi', 'EventNotifications', '$rootScope');

      notificationsSuccessSpy = sinon.stub(EventNotifications, 'success').returns(null);
      notificationsErrorSpy = sinon.stub(EventNotifications, 'error').returns(null);
    });

    it('should return the rules fields', function () {
      var ruleFields = RulesState.getRuleFields().resources;

      expect(ruleFields.length).to.eq(9);
    });

    it('should query the arbitration rules API', function (done) {
      collectionsApiSpy = sinon.stub(CollectionsApi, 'query').returns(Promise.resolve(successResponse));

      RulesState.getRules().then(function(response) {
        expect(collectionsApiSpy).to.have.been.calledWith(
          'arbitration_rules',
          {
            expand: 'resources'
          }
        );
        done();
      });
    });

    it('should make a notification success call when successfully adding a rule', function (done) {
      collectionsApiSpy = sinon.stub(CollectionsApi, 'post').returns(Promise.resolve(successResponse));
      RulesState.addRule({name: 'newrule'}).then(function(response) {
        expect(collectionsApiSpy).to.have.been.calledWith(
          'arbitration_rules', null, {}, {name: 'newrule'}
        );
        expect(notificationsSuccessSpy).to.have.been.called;
        expect(notificationsErrorSpy).not.to.have.been.called;
        done();
      });

    });

    it('should make a notification error call when an error occurs adding a rule', function (done) {
      collectionsApiSpy = sinon.stub(CollectionsApi, 'post').returns(Promise.reject(errorResponse));

      RulesState.addRule({name: 'errorRule'}).then(function(response) {
        expect(collectionsApiSpy).to.have.been.calledWith(
          'arbitration_rules', null, {}, {name: 'errorRule'}
        );
        expect(notificationsSuccessSpy).not.to.have.been.called;
        expect(notificationsErrorSpy).to.have.been.called;
        done();
      });

    });

    it('should not make notification calls when successfully editing a rule', function (done) {
      collectionsApiSpy = sinon.stub(CollectionsApi, 'post').returns(Promise.resolve(successResponse));
      RulesState.editRules([{name: '1'}, {name: '2'}]).then(function(response) {
        expect(collectionsApiSpy).to.have.been.calledWith(
          'arbitration_rules', null, {}, {action: "edit", resources: [{name: '1'}, {name: '2'}]}
        );
        expect(notificationsSuccessSpy).not.to.have.been.called;
        expect(notificationsErrorSpy).not.to.have.been.called;
        done();
      });

    });

    it('should make a notification error call when an error occurs editing a rule', function (done) {
      collectionsApiSpy = sinon.stub(CollectionsApi, 'post').returns(Promise.reject(errorResponse));
      RulesState.editRules([{name: '1'}, {name: '2'}]).then(function(response) {
        expect(collectionsApiSpy).to.have.been.calledWith(
          'arbitration_rules', null, {}, {action: "edit", resources: [{name: '1'}, {name: '2'}]}
        );
        expect(notificationsSuccessSpy).not.to.have.been.called;
        expect(notificationsErrorSpy).to.have.been.called;
        done();
      });

    });

    it('should make a notification success call when successfully deleting a rule', function (done) {
      collectionsApiSpy = sinon.stub(CollectionsApi, 'post').returns(Promise.resolve(successResponse));
      RulesState.deleteRules(['1', '2']).then(function(response) {
        expect(collectionsApiSpy).to.have.been.calledWith(
          'arbitration_rules', null, {}, {action: "delete", resources: [{id: '1'}, {id: '2'}]}
        );
        expect(notificationsSuccessSpy).to.have.been.called;
        expect(notificationsErrorSpy).not.to.have.been.called;
        done();
      });

    });

    it('should a notification error call when an error occurs deleting a rule', function (done) {
      collectionsApiSpy = sinon.stub(CollectionsApi, 'post').returns(Promise.reject(errorResponse));
      RulesState.deleteRules(['1', '2']).then(function(response) {
        expect(collectionsApiSpy).to.have.been.calledWith(
          'arbitration_rules', null, {}, {action: "delete", resources: [{id: '1'}, {id: '2'}]}
        );
        expect(notificationsSuccessSpy).not.to.have.been.called;
        expect(notificationsErrorSpy).to.have.been.called;
        done();
      });

    });
  });
});

