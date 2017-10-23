/* global readJSON, inject */
/* eslint-disable no-unused-expressions */
describe('RBAC service', () => {
  let service
  const permissions = readJSON('tests/mock/rbac/allPermissions.json')
  beforeEach(module('app.core'))

  beforeEach(inject((RBAC) => {
    service = RBAC
  }))

  describe('#hasRole', () => {
    it('returns true if given role is _ALL_', () => {
      const result = service.hasRole('_ALL_')

      expect(result).to.be.true
    })

    it('returns true if current role matches the given role', () => {
      service.setRole('admin')

      const result = service.hasRole('admin')

      expect(result).to.be.true
    })

    it('returns true if current role matches any given role', () => {
      service.setRole('super_admin')

      const result = service.hasRole('admin', 'super_admin')

      expect(result).to.be.true
    })

    it('returns false if current role does not match any given roles', () => {
      const result = service.hasRole('admin')

      expect(result).to.be.false
    })

    it('returns all feature permissions', () => {
      const results = service.all()
      expect(results).to.be.empty
    })

    it('allows permissions to be set and retrieved', () => {
      service.set(permissions)
      const usersPermissions = service.all()
      expect(usersPermissions).to.not.be.empty
    })
  })
})
