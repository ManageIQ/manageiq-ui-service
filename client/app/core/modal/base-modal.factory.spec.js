describe('BaseModalFactory', () => {
    beforeEach(function () {
            module('app.core');
            bard.inject('ModalService');
    });

    it('shoud allow a modal to be opened', () => {
    const modalOptions = {
      component: 'editServiceModal',
      resolve: {
        service: function() {
          return true;
        },
      },
    };
    const modal = ModalService.open(modalOptions);
    expect(modal).to.be.a('object');
    });
});
