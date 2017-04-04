describe('RBAC service', () => {
  let service;

  beforeEach(module('app.core'));

  beforeEach(inject((RBAC) => {
    service = RBAC;
  }));

  describe('#hasRole', () => {
    it('returns true if current role matches the given role', () => {
      service.setRole('admin');

      const result = service.hasRole('admin');

      expect(result).to.be.true;
    });

    it('returns true if current role matches any given role', () => {
      service.setRole('super_admin');

      const result = service.hasRole('admin', 'super_admin');

      expect(result).to.be.true;
    })

    it('returns false if current role does not match any given roles', () => {
      const result = service.hasRole('admin');

      expect(result).to.be.false;
    });
  });
});
