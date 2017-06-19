describe('Dialog Utilities - ', () => {
    let requiredField = {};
    let regexField = {};
  beforeEach(() => {
      requiredField = {
          default_value: 'blah',
          required: true
      };
      regexField = {
          default_value: '1',
          required: true,
          validator_type: 'regex',
          validator_rule: '[0-9]'
      };
    module('app.core');
    bard.inject('DialogUtilities');
  });

  it('should validate a single field successfully', () => {
      const validatedField = DialogUtilities.validateField(requiredField);
      expect(validatedField).to.be.true;
  });

  it('should validate that a field failed to validate successfully', () => {
      requiredField.default_value = '';
      const validatedField = DialogUtilities.validateField(requiredField);
      expect(validatedField).to.be.false;
  });

  it('should validate a single field regex successfully', () => {
      const validatedField = DialogUtilities.validateField(regexField);
      expect(validatedField).to.be.true;
  });
  it('should validate a group of dialogs successfully', () => {
      const dialogs = [requiredField, regexField];
      const validatedFields = DialogUtilities.validateAllFields(dialogs);
      expect(validatedFields).to.be.true;
  });

});
