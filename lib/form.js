/**
 * @callback validateCallback
 * @param   {string}  value  - Field's value
 * @param   {*}       [args] - Validator arguments
 * @returns {Boolean | ?string}
 */
var FieldValidators = require('./field-validators');
var Errors = require('./errors');
var validator = require('validator');
var Field = require('./field');
var _ = require('lodash');

/**
 * Form
 * @constructor
 * @param {Object}       options    - Options
 */
var Form = function (options) {
    if (!(this instanceof Form)){
        return new Form(options);
    }
    this._options = options || { };
    this._fields = this._options.fields || [ ];
    delete this._options.fields;
    this._oFields = { };
    this._valid = true;
    this._errors = [ ];
    // Fills a map of fields
    for (var i = 0, len = this._fields.length; i < len; ++i) {
        this._oFields[this._fields[i]._name] = this._fields[i];
    }
    this.refresh();
};

/**
 * Clone the current form
 * @returns {Form} - the new form
 */
Form.prototype.clone = function () {
    var options = _.cloneDeep(this._options);
    var fields = [ ];
    for (var i = 0, len = this._fields.length; i < len; ++i) {
        fields.push(this._fields[i].clone());
    }
    options.fields = fields;
    var form = new Form(options);
    form._valid = this._valid;
    form._errors = _.clone(this._errors);
    form.refresh();
    return form;
};

/**
 * Add a new field
 * @param {Field} field - A field instance
 */
Form.prototype.addField = function (field) {
    this._oFields[field._name] = field;
    this._fields.push(field);
    this.refresh();
};

/**
 * Set a field property
 * @param {string} fieldName - A field name
 * @param {string} key       - The property name to set
 * @param {string} value     - The value to set
 */
Form.prototype.setField = function (fieldName, key, value) {
    if (fieldName in this._oFields) {
        this._oFields[fieldName][key] = value;
        this.refresh();
    }
};

/**
 * Set a field value
 * @param {string} fieldName - A field name
 * @param {string} value     - A value
 */
Form.prototype.setValue = function (fieldName, value) {
    if (fieldName in this._oFields) {
        this._oFields[fieldName].setValue(value);
        this.refresh();
    }
};

/**
 * Retrieve a field value or each value as a map if fieldName is not provided
 * @param   {string} [fieldName] - A field name
 * @returns {?string}
 */
Form.prototype.value = function (fieldName) {
    if (fieldName in this._oFields) {
        return this._oFields[fieldName].value();
    }
    return _.mapValues(this._oFields, '_value');
};

/**
 * Add a field error
 * @param {string} fieldName   - A field name
 * @param {string} error       - The error
 */
Form.prototype.addError = function (fieldName, error) {
    this._valid = false;
    error = error || '';
    if (fieldName in this._oFields) {
        var field = this._oFields[fieldName];
        field.addError(error);
        this.refresh();
    }
};

/**
 * Retrieve a field error or all errors as a map if fieldName is not provided
 * @param   {string} [fieldName] - A field name
 * @returns {Array.<string>|Object.<string, Array.<string>>}
 */
Form.prototype.errors = function (fieldName) {
    if (fieldName in this._oFields) {
        return this._oFields[fieldName].errors();
    }
    return _.mapValues(this._oFields, '_errors');
};

/**
 * Add a non field specific error
 * @param {string} error - The global error
 */
Form.prototype.addGlobalError = function (error) {
    this._valid = false;
    this._errors.push(error);
    this.refresh();
};

/**
 * Get non field specific errors
 * @returns {Array.<string>} - The global errors
 */
Form.prototype.globalErrors = function () {
    return this._errors;
};

/**
 * Create a new form object
 * @returns {Object.<string, *>} - The new form object
 * @private
 */
Form.prototype._getFormObject = function (props) {
    var formObject = _.cloneDeep(this._options);
    var fieldObject, field;
    formObject.fields = [ ];
    formObject.valid = this._valid;
    formObject.errors = this._errors;
    for (var i = 0, len = this._fields.length; i < len; ++i) {
        field = this._fields[i];
        fieldObject = _.cloneDeep(field._options);
        fieldObject.value = field.value();
        fieldObject.errors = field.errors();
        for (var propName in props) {
            if (this._fields[i]._name in props[propName]) {
                fieldObject[propName] = props[propName][this._fields[i]._name];
            }
        }
        formObject.fields.push(fieldObject);
    }
    return formObject;
};

/**
 * Reset the render object
 */
Form.prototype.refresh = function () {
    this._bareFormObject = this._getFormObject();
};

/**
 * Get a field from its name
 * @param  {string} fieldName - The name of the field
 * @returns {?Field}
 */
Form.prototype.get = function (fieldName) {
    if (fieldName in this._oFields) {
        return this._oFields[fieldName];
    }
    return null;
};

/**
 * Check if the form is valid
 * @returns {Boolean}
 */
Form.prototype.isValid = function () {
    return this._valid;
};

/**
 * Validate a complete form and returns a new populated form
 * @param  {...Object.<string,*>}   [body={}]    - Body matching the form
 * @param  {Boolean}                [stop=false] - Stop at first error
 * @returns {Form}
 */
Form.prototype.validate = function () {
    var body = { }, stop, i, len = arguments.length;
    for (i = 0; i < len; ++i) {
        if (_.isObject(arguments[i])) {
            body = _.assign(body, arguments[i]);
        }
    }
    stop = _.isBoolean(arguments[i]) ? arguments[i] : false;
    // Check there are no additional fields in body
    var vForm = this.clone();
    for (var fieldName in body) {
        //field = this.get(fieldName);
        if (!(fieldName in this._oFields)) {
            vForm.addGlobalError(Errors._unknownField);
            break;
        }
    }
    // populate and validate each field
    var field;
    for (var i = 0, len = vForm._fields.length; i < len; ++i) {
        field = vForm._fields[i];
        field.setValue(body[field._name]);
        if (stop && !vForm._valid) {
            continue;
        }
        vForm._valid = field.validate(body, stop) && vForm._valid;
    }
    vForm.refresh();
    return vForm;
};

/**
 * Get the associated form object
 * @param   {Boolean} [refresh=false] - If true, the form object is rebuilt
 * @returns {Object.<string, *>}
 */
Form.prototype.render = function (refresh) {
    if (refresh === true) {
        this.refresh();
    }
    return this._bareFormObject;
};

/**
 * Add a new validator
 * @param {string}            name  - Name of the validator
 * @param {validateCallback}  fn    - The validator callback
 * @param {?string}           error - The error message
 * @static
 */
Form.addValidator = function (name, fn, error) {
    Form.validators[name] = fn;
    Errors[name] = error || null;
};

/**
 * List of validators / error messages
 * @type {Object.<string, ?string>}
 * @static
 */
Form.validators = FieldValidators;

module.exports = Form;
