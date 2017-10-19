describe('Navigation Service', () => {
const permissions = readJSON('tests/mock/rbac/allPermissions.json');
    beforeEach(function() {
        module('app.core');
        bard.inject('Navigation', 'RBAC');
        RBAC.set(permissions);
    });
        
        it('should allow navigation to be setup', () => { 
           const navigationItems = Navigation.init();
           expect(navigationItems.length).to.eq(4);
        });
    }); 
    