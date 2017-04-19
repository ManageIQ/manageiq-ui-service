describe('CatalogsState', function() {
  beforeEach(function() {
    module('app.states', 'app.catalogs');
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
      bard.inject('CatalogsState', 'CollectionsApi', 'EventNotifications');
      notificationsSuccessSpy = sinon.stub(EventNotifications, 'success').returns(null);
      notificationsErrorSpy = sinon.stub(EventNotifications, 'error').returns(null);
    });

    it('should query the API for catalogs', function() {
      collectionsApiSpy = sinon.stub(CollectionsApi, 'query').returns(Promise.resolve(successResponse));

      CatalogsState.getCatalogs(5, 0).then(function(response) {
        expect(collectionsApiSpy).to.have.been.calledWith(
          'service_catalogs',
          {
            expand: ['resources', 'service_templates'],
            attributes: ['tenant', 'picture', 'picture.image_href', 'service_template_catalog.name', 'dialogs'],
            limit: 5,
            offset: 0,
            filter: [],
            sort_by: 'name',
            sort_order: 'asc',
            sort_options: 'ignore_case'
          }
        );

      });
    });
  });
});

