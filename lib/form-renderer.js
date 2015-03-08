var _ = require('lodash');

/**
 * @class
 * @constructor
 * @param {Object} [options] - Options
 */
var FormRenderer = function (options) {
    _.assign(this, options);
    this.fields = [ ];
    this.oFields = { };
    this.valid = true;
};

/**
 * @param {Field} field - A field instance
 */
FormRenderer.prototype.addField = function (field) {
    this.oFields[field._name] = field._options;
    this.fields.push(this.oFields[field._name]);
};

/**
 * @param {string} fieldName - A field name
 * @param {string} key       - The property name to set
 * @param {string} value     - The value to set
 */
FormRenderer.prototype.setField = function (fieldName, key, value) {
    if (fieldName in this.oFields) {
        this.oFields[fieldName][key] = value;
    }
};

/**
 * Retrieve a field value
 * @param {string} fieldName - A field name
 * @returns {?string}
 */
FormRenderer.prototype.value = function (fieldName) {
    if (fieldName in this.oFields) {
        return this.oFields[fieldName].value;
    }
    return null;
};

module.exports = FormRenderer;
