describe('blueprint.editor', function() {
  beforeEach(function() {
    module('app.states', 'app.config', 'gettext', bard.fakeToastr);
  });

  describe('controller with existing blueprint', function() {
    var collectionsApiSpy;
    var controller;

    var mockDir = 'tests/mock/blueprint-editor/';

    var controllerResolves = {
      blueprint: readJSON(mockDir + 'blueprint.json'),
      blueprintTags: readJSON(mockDir + 'blueprint-tags.json'),
      serviceTemplates: readJSON(mockDir + 'service-templates-orig.json')
    };

    beforeEach(function() {
      bard.inject('$controller', '$log', '$state', '$rootScope', 'CollectionsApi', 'Notifications');

      controller = $controller($state.get('designer.blueprints.editor').controller, controllerResolves);
      $rootScope.$apply();
    });

    it('is created successfully', function() {
      expect(controller).to.be.defined;
    });

    it('replaces display_name with displayName', function() {
      expect(controller.blueprint.tags[0].categorization.display_name).to.not.be.defined;
      expect(controller.blueprint.tags[0].categorization.displayName).to.be.defined;
    });

    it('updates node image and name', function() {
      expect(controller.blueprint.ui_properties.chart_data_model.nodes[0].name).to.equal('Deploy RHEL7 with PostgreSQL');
      expect(controller.blueprint.ui_properties.chart_data_model.nodes[0].image).to.equal('http://localhost:8001/pictures/10r4.jpg');
    });

    it('disables three items in toolbox because they are on canvas', function() {
      expect(controller.serviceTemplates[1].disableInToolbox).to.equal(true);
      expect(controller.serviceTemplates[2].disableInToolbox).to.equal(true);
      expect(controller.serviceTemplates[5].disableInToolbox).to.equal(true);
    });
  });

  describe('controller with new blueprint', function() {
    var collectionsApiSpy;
    var controller;

    var mockDir = 'tests/mock/blueprint-editor/';

    var controllerResolves = {
      blueprint: null,
      blueprintTags: null,
      serviceTemplates: readJSON(mockDir + 'service-templates.json')
    };

    beforeEach(function() {
      bard.inject('$controller', '$log', '$state', '$rootScope', 'CollectionsApi', 'Notifications');

      controller = $controller($state.get('designer.blueprints.editor').controller, controllerResolves);
      $rootScope.$apply();
    });

    it('is created successfully', function() {
      expect(controller).to.be.defined;
    });

    it('created a new blueprint', function() {
      expect(controller.blueprint.name).to.equal("");
      expect(controller.blueprint.tags.length).to.equal(0);
      expect(controller.blueprint.ui_properties.chart_data_model.nodes.length).to.equal(0);
    });
  });
});
