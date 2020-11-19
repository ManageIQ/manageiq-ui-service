/* global $componentController */
/* eslint-disable no-unused-expressions */
describe('Component: dashboardComponent', () => {
  let ctrl

  beforeEach(() => {
    module('app.core', 'app.components')
    bard.inject('$componentController', 'EventNotifications', '$state', 'DashboardService', 'lodash', 'Chargeback', 'RBAC', 'Polling')
    ctrl = $componentController('dashboardComponent', {}, {})
    ctrl.$onInit()
  })

  describe('with $componentController', () => {
    it('is defined', () => {
      expect(ctrl).to.exist
    })

    it('initializes servicesCounts', () => {
      let servicesCount = {
        total: 0,
        current: 0,
        retired: 0,
        soon: 0
      }

      expect(ctrl.servicesCount).to.eql(servicesCount)
    })

    it('initializes requestsCounts', () => {
      let requestsCount = {
        total: 0,
        pending: 0,
        approved: 0,
        denied: 0
      }

      expect(ctrl.requestsCount).to.eql(requestsCount)
    })
  })
})
