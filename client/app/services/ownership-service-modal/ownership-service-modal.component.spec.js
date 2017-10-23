/* global inject, CollectionsApi, EventNotifications */
/* eslint-disable no-unused-expressions */
describe('Component: ownershipServiceModal', () => {
  beforeEach(module('app'))

  describe('with $componentController', () => {
    const service = {
      id: 1234,
      evm_owner: {
        userid: 1234
      },
      miq_group: {
        description: 'test'
      }
    }
    const bindings = {
      resolve: {
        services: [service],
        users: [],
        groups: []
      },
      close: function () { },
      dismiss: function () { }
    }
    let scope, ctrl

    beforeEach(inject(($componentController) => {
      bard.inject('CollectionsApi', 'EventNotifications', 'lodash', '$state')
      ctrl = $componentController('ownershipServiceModal', {$scope: scope}, bindings)
      ctrl.$onInit()
    }))

    it('Saves successfully', (done) => {
      const response = {
        results: [{'success': 'true', 'message': 'test'}]
      }
      const spy = sinon.stub(CollectionsApi, 'post').returns(Promise.resolve(response))
      const notificationSpy = sinon.stub(EventNotifications, 'batch').returns(true)
      ctrl.save().then((data) => {
        done()

        expect(spy).to.have.been.calledWith('services', '')
        expect(notificationSpy).to.have.been.calledWith([{
          message: 'test',
          success: 'true'
        }], 'Setting ownership.', 'Error setting ownership.')
      })
    })

    it('Save fails', (done) => {
      sinon.stub(CollectionsApi, 'post').returns(Promise.reject(new Error({'status': 'error'})))
      const notificationSpy = sinon.stub(EventNotifications, 'error').returns(true)
      ctrl.save().then((data) => {
        done()

        expect(notificationSpy).to.have.been.calledWith('There was an error saving ownership.')
      })
    })

    it('supports cancelling a modal', () => {
      const dismissSpy = sinon.spy(ctrl, 'dismiss')
      ctrl.cancel()
      expect(dismissSpy).to.have.been.calledWith({$value: 'cancel'})
    })
    it('can reset a modal', () => {
      const originalService = service
      originalService.id = 4567
      ctrl.reset({original: originalService})
      expect(ctrl.modalData.id).to.eq(4567)
    })
  })
  describe('with multiple services', () => {
    const services = [
      {
        id: 1234,
        evm_owner: {
          userid: 1234
        },
        miq_group: {
          description: 'test'
        }
      },
      {
        id: 4567,
        evm_owner: {
          userid: 4567
        },
        miq_group: {
          description: 'test'
        }
      }
    ]
    const bindings = {
      resolve: {
        services: services,
        users: [],
        groups: []
      },
      close: function () { },
      dismiss: function () { }
    }
    let scope, ctrl

    beforeEach(inject(($componentController) => {
      bard.inject('CollectionsApi', 'EventNotifications', 'lodash', '$state')
      ctrl = $componentController('ownershipServiceModal', {$scope: scope}, bindings)
      ctrl.$onInit()
    }))

    it('Saves successfully', (done) => {
      const response = {
        results: [{'success': 'true', 'message': 'test'}]
      }
      const spy = sinon.stub(CollectionsApi, 'post').returns(Promise.resolve(response))
      const notificationSpy = sinon.stub(EventNotifications, 'batch').returns(true)
      const expectedObject = {
        action: 'set_ownership',
        resources: [{
          evm_owner: {userid: 1234},
          group: {description: ''},
          id: 1234,
          miq_group: {description: 'test'},
          owner: {userid: ''}
        }, {
          evm_owner: {userid: 4567},
          group: {description: ''},
          id: 4567,
          miq_group: {description: 'test'},
          owner: {userid: ''}
        }]
      }
      ctrl.save().then((data) => {
        done()

        expect(spy).to.have.been.calledWith('services', '', {}, expectedObject)
        expect(notificationSpy).to.have.been.calledWith([{
          message: 'test',
          success: 'true'
        }], 'Setting ownership.', 'Error setting ownership.')
      })
    })
  })
  describe('No owner or description', () => {
    const service =
      {
        id: 1234
      }
    const bindings = {
      resolve: {
        services: [service],
        users: [],
        groups: []
      },
      close: function () { },
      dismiss: function () { }
    }
    let scope, ctrl

    beforeEach(inject(($componentController) => {
      bard.inject('CollectionsApi', 'EventNotifications', 'lodash', '$state')
      ctrl = $componentController('ownershipServiceModal', {$scope: scope}, bindings)
      ctrl.$onInit()
    }))

    it('should default userid and description if they dont exist', () => {
      expect(ctrl.modalData.owner.userid).to.eq('')
      expect(ctrl.modalData.group.description).to.eq('')
    })
  })
})
