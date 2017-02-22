/** @ngInject */
export function TaggingService(CollectionsApi, lodash, exception) {
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
    const tagObjectsToAssign = tagsToAssign.map(toTagObject);
    const tagsToUnassign = lodash.difference(originalTags.map(tagName), tagsToAssign.map(tagName));
    const tagObjectsToUnassign = tagsToUnassign.map(toTagObject);

    return Promise.all([
      postTagPayload('assign_tags', tagObjectsToAssign),
      postTagPayload('unassign_tags', tagObjectsToUnassign),
    ]);

    function tagName(tag) {
      return tag.name;
    }

    function toTagObject(tag) {
      return { name: tag.name || tag };
    }

    function postTagPayload(action, tags) {
      if (tags.length > 0) {
        const payload = {
          action,
          resources: selectedResources.map(({ href }) => ({ href, tags })),
        };

        return CollectionsApi.post(collection, null, {}, payload);
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
      .then(filterValidTags)
      .catch(exception.log('Request failed for #queryAvailableTags'));

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
