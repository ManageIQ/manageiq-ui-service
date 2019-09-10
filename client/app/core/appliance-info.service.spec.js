/* global ApplianceInfo */
describe('Appliance Info Service', () => {
  const applianceInfoData = {
    'product_info': {
      'copyright': 'Copyright (c) 2017 ManageIQ. Sponsored by Red Hat Inc.',
      'support_website': 'http://www.manageiq.org',
      'support_website_text': 'ManageIQ.org',
      'branding_info': {
        'brand': 'ManageIQ',
        'favicon': 'ManageIQ',
        'logo': 'ManageIQ',
      }
    },
    'identity': {
      'name': 'Administrator',
      'role': 'EvmRole-super_administrator'
    },
    'server_info': {
      'version': 'master',
      'build': '20170510164252_9e5df30',
      'appliance': 'EVM'
    },
    'settings': {
      'asynchronous_notifications': true
    }
  }
  beforeEach(() => {
    module('app.services')
    bard.inject('ApplianceInfo')
  })

  it('should allow you to set appliance info', (done) => {
    const applianceSpy = sinon.spy(ApplianceInfo, 'set')
    ApplianceInfo.set(applianceInfoData)
    done()

    expect(applianceSpy).to.have.been.calledWith(applianceInfoData)
  })
  it('Should allow you to retrieve the appliance info', (done) => {
    const expectedApplianceInfo = {
      'copyright': 'Copyright (c) 2017 ManageIQ. Sponsored by Red Hat Inc.',
      'supportWebsiteText': 'ManageIQ.org',
      'supportWebsite': 'http://www.manageiq.org',
      'user': 'Administrator',
      'role': 'EvmRole-super_administrator',
      'miqVersion': 'master.20170510164252_9e5df30',
      'suiVersion': '',
      'server': 'EVM',
      'asyncNotify': 'true',
      'brand': 'ManageIQ',
      'favicon': 'ManageIQ',
      'logo': 'ManageIQ',
    }
    ApplianceInfo.set(applianceInfoData)
    const currentApplianceInfo = ApplianceInfo.get()
    done()

    expect(currentApplianceInfo).to.eql(expectedApplianceInfo)
  })
})
