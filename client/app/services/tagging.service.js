(function() {
  'use strict';

  angular.module('app.services')
    .factory('taggingService', taggingService);

  /** @ngInject */
  function taggingService(CollectionsApi, lodash) {
    var service = {
      assignTags: assignTags,
      findSharedTags: findSharedTags,
      parseTag: parseTag,
      queryAvailableTags: queryAvailableTags,
    };

    return service;

    // High-level method to declaratively assign tags to resource(s). Current
    // tagging APIs require separate requests for assignment of new tags and
    // unassignment of existing tags.
    function assignTags(collection, selectedResources, originalTags, tagsToAssign) {
      var assignPayload = {
        action: 'assign',
        resources: tagsToAssign.map(toTagObject),
      };

      var tagsToUnassign = lodash.difference(originalTags.map(tagName), tagsToAssign.map(tagName));

      var unassignPayload = {
        action: 'unassign',
        resources: tagsToUnassign.map(toTagObject),
      };

      // Resolve when all assignment and unassignment requests resolve or reject
      // if/when the first request rejects. This ensures that from the UI only a
      // single notification is given for success/failure and keeps the
      // assignment as an implementation detail.
      //
      // TODO: Swap out with more efficient implementation after API update
      return Promise.all(selectedResources.reduce(function(allPromises, resource) {
        allPromises.push(postTagPayload(resource, assignPayload));
        allPromises.push(postTagPayload(resource, unassignPayload));

        return allPromises;
      }, []));

      function tagName(tag) {
        return tag.name;
      }

      function toTagObject(tag) {
        return { name: tag.name || tag };
      }

      function postTagPayload(resource, payload) {
        if (payload.resources.length > 0) {
          return CollectionsApi.post(collection, resource.id + '/tags', {}, payload);
        }
      }
    }

    // Returns the common list of tags between all selected resources.
    function findSharedTags(selectedResources, availableTags) {
      return availableTags.filter(function(tag) {
        return selectedResources.every(function(resource) {
          return resource.tags.some(function(resourceTag) {
            return tag.name === resourceTag.name;
          });
        });
      });
    }

    // Ensures that tags have the correct shape to be processed.
    function parseTag(tagResponse) {
      return {
        id: tagResponse.id,
        name: tagResponse.name,
        category: {
          id: tagResponse.category.id,
        },
        categorization: {
          displayName: tagResponse.categorization.display_name,
        },
      };
    }

    // With no arguments query all available tags, with a single resource url
    // queries all available tags for that resource. The result is filtered of
    // invalid tags (missing required properties).
    function queryAvailableTags(resourceUrl) {
      var queryOptions = {
        expand: 'resources',
        attributes: ['categorization', 'category'],
      };

      return CollectionsApi.query(resourceUrl || 'tags', queryOptions)
        .then(filterValidTags);

      function filterValidTags(response) {
        return response.resources
          .filter(isValidTag)
          .map(service.parseTag);
      }

      function isValidTag(tagResponse) {
        return tagResponse.categorization
          && tagResponse.categorization.display_name
          && tagResponse.category
          && tagResponse.category.id
          && tagResponse.category.description;
      }
    }
  }
})();
