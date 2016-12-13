/* eslint camelcase: ["error", {properties: "never"}] */

(function() {
  'use strict';

  class DialogField {
    constructor(type, icon, label, options = {}) {
      this.icon = icon;
      this.label = label;
      this.placeholders = Object.assign({
        name: "",
        description: "",
        type: type,
        display: "edit",
        display_method_options: {},
        read_only: false,
        required: false,
        required_method_options: {},
        default_value: "",
        values_method_options: {},
        label: "",
        position: 0,
        dynamic: false,
        show_refresh_button: false,
        load_values_on_init: false,
        auto_refresh: false,
        trigger_auto_refresh: false,
        reconfigurable: false,
        visible: true,
        options: {
          protected: false,
        },
        resource_action: {resource_type: "DialogField", ae_attributes: {}},
      }, options);
    }
  }

  // works as placeholders for drag&drop dialog components
  angular.module('app.components')
    .component('dialogEditorFieldStatic', {
      controller: ComponentController,
      controllerAs: 'vm',
      templateUrl: 'app/components/dialog-editor-field-static/dialog-editor-field-static.html',
    });

  function ComponentController() {
    var vm = this;

    vm.fields = {
      dialogFieldTextBox:
        new DialogField(
          "DialogFieldTextBox",
          "fa fa-font",
          __("Text Box")
        ),
      dialogFieldTextAreaBox:
        new DialogField(
          "DialogFieldTextAreaBox",
          "fa fa-file-text-o",
          __("Text Area")
        ),
      dialogFieldCheckBox:
        new DialogField(
          "DialogFieldCheckBox",
          "fa fa-check-square-o",
          __("Check Box")
        ),
      dialogFieldDropDownList:
        new DialogField(
          "DialogFieldDropDownList",
          "fa fa-caret-square-o-down",
          __("Dropdown List"),
          {
            data_type: "string",
            values: [],
            options: {sort_by: "description", sort_order: "ascending"},
          }
        ),
      dialogFieldRadioButton:
        new DialogField(
          "DialogFieldRadioButton",
          "fa fa-circle-o",
          __("Radio Button"),
          {
            data_type: "string",
            values: [],
            options: {sort_by: "description", sort_order: "ascending"},
          }
        ),
      dialogFieldDateControl:
        new DialogField(
          "DialogFieldDateControl",
          "fa fa-calendar",
          __("Date Control")
        ),
      dialogFieldDateTimeControl:
        new DialogField(
          "DialogFieldDateTimeControl",
          "fa fa-clock-o",
          __("Date Time Control")
        ),
      dialogFieldTagControl:
        new DialogField(
          "DialogFieldTagControl",
          "fa fa-tags",
          __("Tag Control"),
          {
            data_type: "string",
            values: [],
            options: {
              force_single_value: false,
              sort_by: "description",
              sort_order: "ascending",
            },
          }
        ),
    };
  }
})();
