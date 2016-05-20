(function() {
  'use strict';

  // works as placeholders for drag&drop dialog components

  angular.module('app.components')
    .component('dialogEditorFieldStatic', {
      controller: function() {
        this.fields = {
          dialogFieldTextBox: {
            icon: "fa-font",
            label: __("Text Box"),
            placeholders: {
              name: "name",
              description: __("Description"),
              type: "DialogFieldTextBox",
              display: "edit",
              display_method_options: {},
              required: true,
              required_method_options: {},
              default_value: "",
              values_method_options: {},
              options: {
                protected: false
              },
              label: __("Label"),
              position: 0,
              resource_action: {
                resource_type: "DialogField",
                ae_attributes: {}
              }
            }
          },
          dialogFieldTextAreaBox: {
            icon: "fa-file-text-o",
            label: __("Text Area"),
            placeholders: {
              name: "name",
              description: __("Description"),
              type: "DialogFieldTextAreaBox",
              display: "edit",
              display_method_options: {},
              required: false,
              required_method_options: {},
              default_value: "",
              values_method_options: {},
              options: {},
              label: __("Label"),
              position: 0,
              resource_action: {
                resource_type: "DialogField",
                ae_attributes: {}
              }
            }
          },
          dialogFieldCheckBox: {
            icon: "fa-check-square-o",
            label: __("Check Box"),
            placeholders: {
              name: "name",
              description: __("Description"),
              type: "DialogFieldCheckBox",
              display: "edit",
              display_method_options: {},
              required: true,
              required_method_options: {},
              default_value: "f",
              values_method_options: {},
              options: {},
              label: __("Label"),
              position: 0,
              resource_action: {
                resource_type: "DialogField",
                ae_attributes: {}
              }
            }
          },
          dialogFieldDropDownList: {
            icon: "fa-caret-square-o-down",
            label: __("Dropdown List"),
            placeholders: {
              name: "name",
              description: __("Description"),
              label: __("Label"),
              type: "DialogFieldDropDownList",
              data_type: "string",
              display: "edit",
              display_method_options: {},
              required: true,
              required_method_options: {},
              default_value: "",
              values: [
              ],
              values_method_options: {},
              options: {
                sort_by: "description",
                sort_order: "ascending"
              },
            }
          },
          dialogFieldRadioButton: {
            icon: "fa-circle-o",
            label: __("Radio Button"),
            placeholders: {
              name: "name",
              description: __("Description"),
              type: "DialogFieldRadioButton",
              data_type: "string",
              display: "edit",
              display_method_options: {},
              required: false,
              required_method_options: {},
              values: [
              ],
              values_method_options: {},
              options: {
                sort_by: "description",
                sort_order: "ascending"
              },
              label: __("Label"),
              position: 3,
              resource_action: {
                resource_type: "DialogField",
                ae_attributes: {}
              }
            }
          },
          dialogFieldDateControl: {
            icon: "fa-calendar",
            label: __("Date Control"),
            placeholders: {
              name: "name",
              description: __("Description"),
              type: "DialogFieldDateControl",
              display: "edit",
              display_method_options: {},
              required: false,
              required_method_options: {},
              values_method_options: {},
              options: {
                show_past_dates: false
              },
              label: __("Label"),
              position: 0,
              resource_action: {
                resource_type: "DialogField",
                ae_attributes: {}
              }
            }
          },
          dialogFieldDateTimeControl: {
            icon: "fa-clock-o",
            label: __("Date Time Control"),
            placeholders: {
              name: "name",
              description: __("Description"),
              type: "DialogFieldDateTimeControl",
              display: "edit",
              display_method_options: {},
              required: false,
              required_method_options: {},
              values_method_options: {},
              options: {
                show_past_dates: false
              },
              label: __("Label"),
              position: 0,
              resource_action: {
                resource_type: "DialogField",
                ae_attributes: {}
              }
            }
          },
        };
      },
      controllerAs: 'dialogEditorFieldStatic',
      templateUrl: 'app/components/dialog-editor-field-static/dialog-editor-field-static.html'
    });
})();
