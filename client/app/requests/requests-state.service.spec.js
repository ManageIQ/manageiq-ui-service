describe('Requests-State', function() {
  beforeEach(function() {
    module('app.states', 'app.requests');
  });

  describe('service', function() {
    var notificationsErrorSpy;
    var notificationsSuccessSpy;
    var successResponse = {
      message: "Success"
    };
    var errorResponse = 'error';
    var collectionsApiSpy;

    beforeEach(function() {
      bard.inject('RequestsState','ListConfiguration', 'RBAC', 'CollectionsApi');
    });

    it('should query the API for requests', function() {
      collectionsApiSpy = sinon.stub(CollectionsApi, 'query').returns(Promise.resolve(successResponse));
      RequestsState.get(5,0);
        expect(collectionsApiSpy).to.have.been.calledWith(
          'requests',
          {
            attributes: ["approval_state", "created_on", "description", "message", "picture", "picture.image_href", "requester_name"],
            expand: "resources",
            filter: [],
            limit: 5,
            offset: "0",
            sort_by: "created_on",
            sort_options: '',
            sort_order: "asc"
          }
        );
    });

    it('should be able to get permissions', () =>{
      const permissions=RequestsState.getPermissions();
      const expectedPermissions = { approval: false, edit: false };
      expect(permissions).to.eql(expectedPermissions);
    });

    it('should be able to get record Counts ', () => {
      collectionsApiSpy = sinon.stub(CollectionsApi, 'query').returns(Promise.resolve(successResponse));
      RequestsState.getMinimal();
        expect(collectionsApiSpy).to.have.been.calledWith(
          'requests',
          { filter: [], hide: "resources" }
        );
    });
  });  
});

