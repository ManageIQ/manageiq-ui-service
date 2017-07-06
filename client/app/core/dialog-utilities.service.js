export function DialogUtilitiesFactory() {
  const service = {
    validateField: validateField,
    validateAllFields: validateAllFields,
  };

  return service;

  function validateField(field) {
    const fieldValue = field.default_value;
    if (field.required) {
      if (fieldValue === '') {
        field.fieldValidation = false;
        field.errorMessage = __('field is required');

        return false;
      }
      if (field.validator_type === 'regex') {
        const regex = new RegExp(`${field.validator_rule}`);
        const regexValidates = regex.test(fieldValue);
        field.fieldValidation = regexValidates;
        field.errorMessage = __("field doesn't match required format");

        return regexValidates;
      }
    }

    return true;
  }

  function validateAllFields(fields) {
    let fieldsValidate = false;
    fieldsValidate = fields.every(function(field) {
      return validateField(field);
    });

    return fieldsValidate;
  }
}
