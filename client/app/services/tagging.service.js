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

    function findSharedTags(selectedResources, availableTags) {
      return availableTags.filter(function(tag) {
        return selectedResources.every(function(resource) {
          return resource.tags.some(function(resourceTag) {
            return tag.name === resourceTag.name;
          });
        });
      });
    }

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
