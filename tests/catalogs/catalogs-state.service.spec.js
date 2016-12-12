describe('app.services.CatalogsState', function() {
  beforeEach(function () {
    module('app.services', 'app.config', 'app.states', 'gettext');
  });

  describe('service', function () {
    var collectionsApiSpy;
    var successResponse = {
      message: "Success"
    };

    beforeEach(function () {
      bard.inject('CatalogsState', 'CollectionsApi');
    });

    it('should query the API for catalogs', function(done) {
      collectionsApiSpy = sinon.stub(CollectionsApi, 'query').returns(Promise.resolve(successResponse));

      CatalogsState.getCatalogs().then(function(response) {
        expect(collectionsApiSpy).to.have.been.calledWith(
          'service_catalogs',
          {
            expand: 'resources',
          }
        );
        done();
      });
    });

    it('should query the API for service templates ', function(done) {
        collectionsApiSpy = sinon.stub(CollectionsApi, 'query').returns(Promise.resolve(successResponse));

        CatalogsState.getServiceTemplates().then(function(response) {
        expect(collectionsApiSpy).to.have.been.calledWith(
          'service_templates',
          {
            expand: 'resources',
            filter: ['service_template_catalog_id>0', 'display=true'],
            attributes: ['picture', 'picture.image_href', 'service_template_catalog.name'],
          }
        );
        done();
      });
    });

    it('should query the API for tenants', function(done) {
      collectionsApiSpy = sinon.stub(CollectionsApi, 'query').returns(Promise.resolve(successResponse));

      CatalogsState.getTenants().then(function(response) {
        expect(collectionsApiSpy).to.have.been.calledWith(
          'tenants',
          {
            expand: 'resources',
          }
        );
        done();
      });
    });

    it('should query the API for service template dialogs', function(done) {
      collectionsApiSpy = sinon.stub(CollectionsApi, 'query').returns(Promise.resolve(successResponse));

      CatalogsState.getServiceTemplateDialogs(1).then(function(response) {
        expect(collectionsApiSpy).to.have.been.calledWith(
          'service_templates/1/service_dialogs',
          {
            expand: 'resources',
            attributes: ['id', 'label'],
          }
        );
        done();
      });
    });
  });
});

