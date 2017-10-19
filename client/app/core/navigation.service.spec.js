describe('Navigation Service', () => {
const permissions = readJSON('tests/mock/rbac/allPermissions.json');
    beforeEach(function() {
        module('app.core');
        bard.inject('Navigation', 'RBAC', 'CollectionsApi');
        RBAC.set(permissions);
    });
        
        it('should allow navigation to be setup', () => { 
           const navigationItems = Navigation.init();
           expect(navigationItems.length).to.eq(4);
        });
        it('should refresh badge counts', () => {
           const navigationItems = Navigation.init();
           const collectionsApiSpy = sinon.stub(CollectionsApi, 'query').returns(Promise.resolve({subcounts: 2}));
           Navigation.updateBadgeCounts();
           expect(collectionsApiSpy).to.have.been.calledThrice;
        });

    }); 
    