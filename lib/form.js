/**
 * @callback validateCallback
 * @param   {string}  value  - Field's value
 * @param   {*}       [args] - Validator arguments
 * @returns {Boolean | ?string}
 */
var FormRenderer = require('./form-renderer');
var FieldValidators = require('./field-validators');
var validator = require('validator');
var utils = require('./utils');

/**
 * Form
 * @constructor
 * @param {Object}       options    - Options
 * @param {FormRenderer} [Renderer=FormRenderer] - Form renderer class to use
 */
var Form = function (options, Renderer) {
    if (!(this instanceof Form)){
        return new Form(options);
    }
    var field;
    if (!Renderer) {
        Renderer = FormRenderer;
    }
    options = options || { };
    this._options = options;
    this._fields = options.fields || [ ];
    this._oFields = { };
    this._Renderer = Renderer;
    this._render = new Renderer(options);

    for (var i = 0, len = this._fields.length; i < len; ++i) {
        field = this._fields[i];
        field._form = this;
        this._oFields[field._name] = field;
        this._render.addField(field);
    }
};

/**
 * Get a field from its name
 * @param  {string} fieldName - The name of the field
 * @returns {?Field}
 * @public
 */
Form.prototype.get = function (fieldName) {
    if (fieldName in this._oFields) {
        return this._oFields[fieldName];
    }
    return null;
};

/**
 * Validate a complete form and returns a form renderer
 * @param  {Object.<string,string>} body         - Body matching the form
 * @param  {Boolean}                [stop=false] - Stop at first error
 * @returns {FormRenderer}
 * @public
 */
Form.prototype.validate = function (oBody, stop) {
    oBody = oBody || { };
    stop = stop || false;
    var bval, f, newVal;
    var renderForm = new this._Renderer(this._render);
    var fields = this._fields;
    var body = utils.flattenBody(oBody);
    // Check there are no additional fields in body
    for (var fieldName in body) {
        field = this.get(fieldName);
        if (!field) {
            renderForm.addError(Form.validators._unknownField);
            if (stop === true) { return renderForm; }
        }
    }
    // populate and validate each field
    for (var i = 0, len = fields.length; i < len; ++i) {
        f = fields[i];
        bval = body[f._name];
        renderForm.addField(f);
        newVal = f.validate(bval, body);
        renderForm.setValue(f._name, newVal.value);
        if (newVal.error) {
            renderForm.addError(f._name, newVal.error);
            if (stop === true) { break; }
        }
    }
    return renderForm;
};

/**
 * Get the default renderer for the form
 * @returns {FormRenderer}
 * @public
 */
Form.prototype.render = function () {
    return this._render;
};

/**
 * Add a new validator
 * @param {string}            name  - Name of the validator
 * @param {validateCallback}  fn    - The validator callback
 * @param {?string}           error - The error message
 * @static
 * @public
 */
Form.addValidator = function (name, fn, error) {
    validator.extend(name, fn);
    Form.validators[name] = error;
};

/**
 * List of validators / error messages
 * @type {Object.<string, ?string>}
 * @static
 */
Form.validators = FieldValidators;

module.exports = Form;
