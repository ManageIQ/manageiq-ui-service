describe('Appliance Info Service', () => {
    let mockDir = 'tests/mock/poweroperations/';
    const vm = readJSON(mockDir + 'vm.json');
    const applianceInfoData = {
        'product_info': {
            "copyright": "Copyright (c) 2017 ManageIQ. Sponsored by Red Hat Inc.",
            "support_website": "http://www.manageiq.org",
            "support_website_text": "ManageIQ.org",
        },
        'identity': {
            "name": "Administrator",
            "role": "EvmRole-super_administrator",
        },
        'server_info': {
            'version': 'master',
            'build': '20170510164252_9e5df30',
            'appliance': 'EVM'
        },
        'settings': {
            'asynchronous_notifications': true
        }
    };
    beforeEach(function () {
        module('app.services');
        bard.inject('ApplianceInfo');
    });

    it("should allow you to set appliance info", () => {
        const applianceSpy = sinon.spy(ApplianceInfo, 'set');

        ApplianceInfo.set(applianceInfoData);
        expect(applianceSpy).to.have.been.calledWith(applianceInfoData);
    });
    it('Should allow you to retrieve the appliance info', () => {
        const expectedApplianceInfo = {
            "copyright": "Copyright (c) 2017 ManageIQ. Sponsored by Red Hat Inc.",
            "supportWebsiteText": "ManageIQ.org",
            "supportWebsite": "http://www.manageiq.org",
            "user": "Administrator",
            "role": "EvmRole-super_administrator",
            "version": "master.20170510164252_9e5df30",
            "server": "EVM",
            "asyncNotify": true,
        };
        ApplianceInfo.set(applianceInfoData);
        const currentApplianceInfo = ApplianceInfo.get();
        expect(currentApplianceInfo).to.eql(expectedApplianceInfo);
    });
});
