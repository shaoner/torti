var _ = require('lodash');
var FieldValidators = require('./field-validators');
var Errors = require('./errors');
var Field = require('./field');
var Promise = require('bluebird');
var util = require('util');

/**
 * @callback notifyResult
 * @param {Boolean} result  - The result of the validation
 * @param {*}       [value] - The new value of the field
 */

/**
 * @callback validateCallback
 * @param   {notifyResult} done   - Callback to send back the result
 * @param   {string}       value  - Field's value
 * @param   {*}            [args] - Validator arguments
 * @returns {Boolean | ?string}
 */

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
        if (props && field._name in props) {
            _.merge(fieldObject, props[field._name]);
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
 * Form validation returning the populated form in the done callback
 * @param {Form}             vForm - The cloned form
 * @param {Object.<string,*> body  - Body maching the form
 * @param {Function}         done  - The callback sending back the form after validation
 * @private
 */
Form.prototype._validateCallback = function (vForm, body, done) {
    var isFormValid = true;
    // Check each field validation
    var validateEachField = function (idx, end) {
        var field = vForm._fields[idx];
        field.setValue(body[field._name] || '');
        var fn = function (valid) {
            isFormValid = isFormValid && valid;
            if ((idx + 1) < vForm._fields.length) {
                return validateEachField(idx + 1, end);
            }
            end(isFormValid);
        };
        field.validate(body, fn);
    };

    validateEachField(0, function (isFormValid) {
        vForm._valid = isFormValid && vForm._valid;
        vForm.refresh();
        done(vForm);
    });
};

/**
 * Validate a complete form and returns a new populated form
 * If no callback is given, it returns a Promise
 * @param   {...Object.<string,*>} [body={}] - Body matching the form
 * @param   {Function}             [done]    - Callback sending the new form
 * @returns {Promise|undefined}              - A new promise or undefined
 */
Form.prototype.validate = function () {
    var body = { }, done;
    var argslen = arguments.length;
    var self = this;

    // Fill default arguments
    if (argslen > 0) {
        for (var i = 0; i < argslen; ++i) {
            if (_.isPlainObject(arguments[i])) {
                body = _.assign(body, arguments[i]);
            }
        }
        if (_.isFunction(arguments[argslen - 1])) {
            done = arguments[argslen - 1];
            done = done.bind(vForm);
        }
    }
    // Check there are no additional fields in body
    var vForm = this.clone();
    for (var fieldName in body) {
        if (!(fieldName in this._oFields)) {
            vForm.addGlobalError(Errors._unknownField);
            break;
        }
    }
    if (_.isUndefined(done)) {
        return new Promise(function (resolve, reject) {
            self._validateCallback(vForm, body, function (vForm) {
                if (vForm.isValid()) {
                    resolve(vForm);
                } else {
                    throw new Form.ValidationError(vForm);
                }
            });
        });
    }
    this._validateCallback(vForm, body, done);
};

/**
 * Get the associated form object
 * @param   {Boolean|Object.<string, *>} [refresh=false] -
 * If true, the form object is rebuilt.
 * It can also be an object in the form:
 * {
 *   fieldName1: { prop1: value1, prop2: value2 },
 *   fieldName2: { prop3: value3, prop2: value2 }
 * }
 * @returns {Object.<string, *>}
 */
Form.prototype.render = function (refresh) {
    if (arguments.length > 0) {
        if (refresh === true) {
            this.refresh();
        } else if (refresh !== false) {
            return this._getFormObject(refresh);
        }
    }
    return this._bareFormObject;
};

/**
 * Get the associated form object populated with values
 * @param   {Object.<string, *>} values - Values in the form of { fieldName: fieldValue }
 * @returns {Object.<string, *>}
 */
Form.prototype.renderWith = function (values) {
    var props = { };
    for (fieldName in values) {
        props[fieldName] = { value: values[fieldName] }
    }
    return this._getFormObject(props);
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

/**
 * Validation Exception
 * @constructor
 * @param {Form} form - the invalid form
 * @extends {Error}
 */
Form.ValidationError = function (form) {
    Error.call(this);
    Error.captureStackTrace(this, this.constructor);
    this.name = 'ValidationError';
    this.form = form;
};
util.inherits(Form.ValidationError, Error);

module.exports = Form;
