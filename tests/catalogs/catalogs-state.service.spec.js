describe('CatalogsState', function() {
  beforeEach(function() {
    module('app.states');
  });

  describe('service', function() {
    var mockDir = 'tests/mock/catalogs/';
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

    it('should query the API for service templates ', function() {
      collectionsApiSpy = sinon.stub(CollectionsApi, 'query').returns(Promise.resolve(successResponse));

      CatalogsState.getServiceTemplates().then(function(response) {
        expect(collectionsApiSpy).to.have.been.calledWith(
          'service_templates',
          {
            expand: 'resources',
            filter: ['display=true'],
            attributes: ['picture', 'picture.image_href', 'service_template_catalog.name'],
          }
        );

      });
    });

    it('should post to the API to create a catalog and add a success notification when successful', function() {
      collectionsApiSpy = sinon.stub(CollectionsApi, 'post').returns(Promise.resolve(successResponse));

      CatalogsState.addCatalog({name: 'newCatalog'}, true).then(function() {
        expect(notificationsSuccessSpy).to.have.been.called;
        expect(notificationsErrorSpy).not.to.have.been.called;

      });
    });

    it('should post to the API to create a catalog and add an error notification when unsuccessful', function() {
      collectionsApiSpy = sinon.stub(CollectionsApi, 'post').returns(Promise.reject(errorResponse));

      CatalogsState.addCatalog({name: 'newCatalog'}, true).then(function() {
        expect(notificationsSuccessSpy).not.to.have.been.called;
        expect(notificationsErrorSpy).to.have.been.called;
      });
    });

    it('should post to the API to edit a catalog and add a success notification when successful', function() {
      collectionsApiSpy = sinon.stub(CollectionsApi, 'post').returns(Promise.resolve(successResponse));

      CatalogsState.editCatalog({id: 1, name: 'changedName'}, true).then(function(response) {
        expect(collectionsApiSpy).to.have.been.calledWith(
          'service_catalogs', 1, {}, {action: "edit", resource: {id: 1, name: 'changedName'}}
        );
        expect(notificationsSuccessSpy).to.have.been.called;
        expect(notificationsErrorSpy).not.to.have.been.called;

      });
    });

    it('should post to the API to edit a catalog and add an error notification when unsuccessful', function() {
      collectionsApiSpy = sinon.stub(CollectionsApi, 'post').returns(Promise.reject(errorResponse));

      CatalogsState.editCatalog({id: 1, name: 'changedName'}, true).then(function(response) {
        expect(collectionsApiSpy).to.have.been.calledWith(
          'service_catalogs', 1, {}, {action: "edit", resource: {id: 1, name: 'changedName'}}
        );
        expect(notificationsSuccessSpy).not.to.have.been.called;
        expect(notificationsErrorSpy).to.have.been.called;

      });
    });

    it('should post to the API to add service templates and add a success notification on success', function() {
      collectionsApiSpy = sinon.stub(CollectionsApi, 'post').returns(Promise.resolve(successResponse));
      var serviceTemplates = readJSON(mockDir + 'service-template-resources.json');


      CatalogsState.addServiceTemplates(1, serviceTemplates, true).then(function(response) {
        expect(collectionsApiSpy).to.have.been.calledWith(
          'service_catalogs/1/service_templates', null, {},
          {
            action: 'assign',
            resources: serviceTemplates,
          }
        );
        expect(notificationsSuccessSpy).to.have.been.called;
        expect(notificationsErrorSpy).not.to.have.been.called;

      });
    });

    it('should post to the API to add service templates and add an error notification on failure', function() {
      collectionsApiSpy = sinon.stub(CollectionsApi, 'post').returns(Promise.reject(errorResponse));
      var serviceTemplates = readJSON(mockDir + 'service-template-resources.json');


      CatalogsState.addServiceTemplates(1, serviceTemplates, true).then(function(response) {
        expect(collectionsApiSpy).to.have.been.calledWith(
          'service_catalogs/1/service_templates', null, {},
          {
            action: 'assign',
            resources: serviceTemplates,
          }
        );
        expect(notificationsSuccessSpy).not.to.have.been.called;
        expect(notificationsErrorSpy).to.have.been.called;

      });
    });

    it('should post to the API to remove service templates and add a success notification on success', function() {
      collectionsApiSpy = sinon.stub(CollectionsApi, 'post').returns(Promise.resolve(successResponse));
      var serviceTemplates = readJSON(mockDir + 'service-template-resources.json');

      CatalogsState.removeServiceTemplates(1, serviceTemplates, true).then(function(response) {
        expect(collectionsApiSpy).to.have.been.calledWith(
          'service_catalogs/1/service_templates', null, {},
          {
            action: 'unassign',
            resources: serviceTemplates,
          }
        );
        expect(notificationsSuccessSpy).to.have.been.called;
        expect(notificationsErrorSpy).not.to.have.been.called;

      });
    });

    it('should post to the API to remove service templates and add an error notification on failure', function() {
      collectionsApiSpy = sinon.stub(CollectionsApi, 'post').returns(Promise.reject(errorResponse));
      var serviceTemplates = readJSON(mockDir + 'service-template-resources.json');

      CatalogsState.removeServiceTemplates(1, serviceTemplates, true).then(function(response) {
        expect(collectionsApiSpy).to.have.been.calledWith(
          'service_catalogs/1/service_templates', null, {},
          {
            action: 'unassign',
            resources: serviceTemplates,
          }
        );
        expect(notificationsSuccessSpy).not.to.have.been.called;
        expect(notificationsErrorSpy).to.have.been.called;

      });
    });

    it('should post to the API to delete  catalogs and add a success notification on success', function() {
      collectionsApiSpy = sinon.stub(CollectionsApi, 'post').returns(Promise.resolve(successResponse));

      CatalogsState.deleteCatalogs([{id: 1}, {id: 2}]).then(function(response) {
        expect(collectionsApiSpy).to.have.been.calledWith(
          'service_catalogs', null, {},
          {
            action: 'delete',
            resources: [{id: 1}, {id: 2}],
          }
        );
        expect(notificationsSuccessSpy).to.have.been.called;
        expect(notificationsErrorSpy).not.to.have.been.called;

      });
    });

    it('should post to the API to delete catalogs and add an error notification on failure', function() {
      collectionsApiSpy = sinon.stub(CollectionsApi, 'post').returns(Promise.reject(errorResponse));

      CatalogsState.deleteCatalogs([{id: 1}, {id: 2}]).then(function(response) {
        expect(collectionsApiSpy).to.have.been.calledWith(
          'service_catalogs', null, {},
          {
            action: 'delete',
            resources: [{id: 1}, {id: 2}],
          }
        );
        expect(notificationsSuccessSpy).not.to.have.been.called;
        expect(notificationsErrorSpy).to.have.been.called;

      });
    });
  });
});

