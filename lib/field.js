'use strict';

var _ = require('lodash');
var FieldValidators = require('./field-validators');
var Errors = require('./errors');
var Promise = require('bluebird');

/**
 * Form field
 * @constructor
 * @param {Object|string} options - Options or fieldname
 */
var Field = function (options) {
    if (typeof options === 'string') {
        // options is a fieldname
        // so it will be evaluated later
        var getFieldValue = function (body) {
            return body[options];
        };
        getFieldValue.toString = function () { return options; };
        return getFieldValue;
    }
    // No need to instantiate a field using new
    if (!(this instanceof Field)) {
        return new Field(options);
    }
    options = _.defaults({ }, options, {
        name: _.uniqueId('name_'),
        value: '',
        errors: [ ]
    });
    this._options = options;
    this._name = options.name;
    this._stack = [ ];
    this._required = true;
    this._value = options.value;
    this._errors = options.errors;
    var self = this;
    // Add all validators as methods to the Field class
    for (var prop in FieldValidators) {
        if (!(prop in this)) {
            self[prop] = this._mergeValidator(prop);
        }
    }
};

/**
 * Create a validator method
 * @param {string} prop - The name of the method
 * @returns {Function}  - The method
 * @private
 */
Field.prototype._mergeValidator = function (prop) {
    var self = this;
    return function () {
        var error = Errors[prop];
        if (_.isFunction(error)) {
            error = error.apply(this, arguments);
        }
        return self._add(FieldValidators[prop], error, arguments);
    };
};

/**
 * Clone the current field
 * @returns {Field} - The new field
 */
Field.prototype.clone = function () {
    var field = new Field(_.cloneDeep(this._options));
    field._stack = _.clone(this._stack);
    field._required = this._required;
    field._value = this._value;
    field._errors = _.clone(this._errors);
    return field;
};

/**
 * Retrieve the field value
 * @param {*} - The field value
 */
Field.prototype.value = function () {
    return this._value;
};

/**
 * Set the field value
 * @param {*} - The value
 */
Field.prototype.setValue = function (value) {
    this._value = value || '';
    this._errors.length = 0;
};

/**
 * Get the field errors
 * @returns {string} - The field error
 */
Field.prototype.errors = function () {
    return this._errors;
};

/**
 * Add a field error
 * @param {string} - The error
 */
Field.prototype.addError = function (error) {
    if (error) {
        this._errors.push(error);
    }
};

/**
 * Add a callback to the stack
 * @param   {validateCallback}       fn   - The callback
 * @param   {string}                 msg  - The error message
 * @param   {Array.<*>}              args - The callback's arguments
 * @returns {Field}
 * @private
 */
Field.prototype._add = function (fn, msg, args) {
    this._stack.push({ cb: fn, args: args, error: msg });
    return this;
};

/**
 * Set the field as optional
 * @returns {Field}
 */
Field.prototype.optional = function () {
    this._required = false;
    return this;
};

/**
 * Field validation returning the validation result in the done callback
 * @param {Object.<string,string>} [body={}] - All form values
 * @param {Function}               [done]    - Callback giving the validation result
 * @private
 */
Field.prototype._validateCallback = function (body, done) {
    var stack = this._stack, o;
    var empty = _.isEmpty(this._value);
    var valid = true;
    if (empty && this._required) {
        this.addError(Errors._required);
        return done(false);
    }
    var applyCallback = function (idx, val, end) {
        var fn = function (res, newVal) {
            if (!_.isUndefined(newVal)) {
                val = newVal;
            }
            if (res === true && (idx + 1) < stack.length) {
                return applyCallback(idx + 1, val, end);
            }
            end(stack[idx].error, res, val);
        };
        var args = [ fn, val ];
        var o = stack[idx];
        // Fill arguments
        for (var j = 0, jlen = o.args.length; j < jlen; ++j) {
            if (_.isFunction(o.args[j])) {
                args.push(o.args[j](body));
            } else {
                args.push(o.args[j]);
            }
        }
        o.cb.apply(this, args);
    };
    var self = this;
    if (this._stack.length > 0) {
        applyCallback(0, this._value, function (err, res, val) {
            if (res === false) {
                if (!empty) {
                    self.addError(err);
                    return done(false);
                }
            }
            self.setValue(val);
            done(true);
        });
    } else {
        done(true);
    }

};

/**
 * Validate a field
 * If no callback is given, it returns a Promise
 * @param   {Object.<string,string>} [body={}] - All form values
 * @param   {Function}               [done]    - Callback giving the validation result
 * @returns {Promise|undefined}                - A new promise or undefined
 */
Field.prototype.validate = function (body, done) {
    var argslen = arguments.length;
    var self = this;
    if (argslen === 0) {
        body = { };
    } else if (argslen === 1 && _.isFunction(body)) {
        done = body;
        body = { };
    }
    if (_.isUndefined(done)) {
        return new Promise(function (resolve, reject) {
            self._validateCallback(body, function (res) {
                if (res === true) {
                    resolve(self);
                } else {
                    reject(self);
                }
            });
        });
    } else {
        done = done.bind(this);
        this._validateCallback(body, done);
    }
};

/**
 * Check if the field value equals the comparison
 * @method  Field.prototype.equals
 * @param   {string|function} comparison - The value compared
 * @returns {Field}
 */

/**
 * Check if the field value contains the seed
 * @method  Field.prototype.contains
 * @param   {string} seed  - The seed
 * @returns {Field}
 */

/**
 * Check if the field value matches the pattern
 * @method  Field.prototype.matches
 * @param   {string|RegExp} pattern    - The pattern to match
 * @param   {string}        [modifier] - The pattern modifier ('i', etc)
 * @returns {Field}
 */

/**
 * Check if the field value is an email address
 * @method  Field.prototype.isEmail
 * @param   {Object} [options={ allow_display_name: false }] - If allow_display_name is set to true, the validator will also match 'Name <email>'
 * @returns {Field}
 */

/**
 * Check if the field value is an URL
 * @method  Field.prototype.isURL
 * @param   {Object} [options={ protocols: ['http','https','ftp'], require_tld: true, require_protocol: false, allow_underscores: false, host_whitelist: false, host_blacklist: false, allow_trailing_dot: false, allow_protocol_relative_urls: false }] - Options
 * @returns {Field}
 */

/**
 * Check if the field value is a fully qualified domain name
 * @method  Field.prototype.isFQDN
 * @param   {Object} [options={ require_tld: true, allow_underscores: false, allow_trailing_dot: false }] - Options
 * @returns {Field}
 */

/**
 * Check if the field value is an IP address
 * @method  Field.prototype.isIP
 * @param   {Number} [version=4] - Version of the ip protocol (4 or 6)
 * @returns {Field}
 */

/**
 * Check if the field value contains only letters (a-zA-Z)
 * @method  Field.prototype.isAlpha
 * @returns {Field}
 */

/**
 * Check if the field value contains only numbers (0-9)
 * @method  Field.prototype.isNumeric
 * @returns {Field}
 */

/**
 * Check if the field value contains only letters and numbers (a-zA-Z0-9)
 * @method  Field.prototype.isAlphanumeric
 * @returns {Field}
 */

/**
 * Check if the field value is base64 encoded
 * @method  Field.prototype.isBase64
 * @returns {Field}
 */

/**
 * Check if the field value is a hexadecimal number
 * @method  Field.prototype.isHexadecimal
 * @returns {Field}
 */

/**
 * Check if the field value is a hexadecimal color
 * @method  Field.prototype.isHexColor
 * @returns {Field}
 */

/**
 * Check if the field value is lowercase
 * @method  Field.prototype.isLowercase
 * @returns {Field}
 */

/**
 * Check if the field value is a uppercase
 * @method  Field.prototype.isUppercase
 * @returns {Field}
 */

/**
 * Check if the field value is an integer
 * @method  Field.prototype.isInt
 * @returns {Field}
 */

/**
 * Check if the field value is a float
 * @method  Field.prototype.isFloat
 * @returns {Field}
 */

/**
 * Check if the field value's length falls in a range. Note: this function takes into account surrogate pairs.
 * @method  Field.prototype.isLength
 * @param   {Number} min   - The minimal value or the max if not provided
 * @param   {Number} [max] - The maximal value
 * @returns {Field}
 */

/**
 * Check if the field value's length (in bytes) falls in a range.
 * @method  Field.prototype.isByteLength
 * @param   {Number} min   - The minimal value or the max if not provided
 * @param   {Number} [max] - The maximal value
 * @returns {Field}
 */

/**
 * Check if the field value is a UUID
 * @method  Field.prototype.isUUID
 * @param   {Number} [version=3] - The UUID version (3, 4 or 5)
 * @returns {Field}
 */

/**
 * Check if the field value is a date
 * @method  Field.prototype.isDate
 * @returns {Field}
 */

/**
 * Check if the field value is a date that's after the specified date (defaults to now)
 * @method  Field.prototype.isAfter
 * @param   {Date} [date=now] - The date supposely after
 * @returns {Field}
 */

/**
 * Check if the field value is a date that's after the specified date (defaults to now)
 * @method  Field.prototype.isBefore
 * @param   {Date} [date=now] - The date supposely before
 * @returns {Field}
 */

/**
 * Check if the field value is in a array of allowed values
 * @method  Field.prototype.isIn
 * @param   {Array.<*>} values - The list of values
 * @returns {Field}
 */

/**
 * Check if the field value is a credit card
 * @method  Field.prototype.isCreditCard
 * @returns {Field}
 */

/**
 * Check if the field value is an ISBN
 * @method  Field.prototype.isISBN
 * @param   {Number} [version=10] - ISBN version (10 or 13)
 * @returns {Field}
 */

/**
 * Check if the field value is a mobile phone number
 * @method  Field.prototype.isMobilePhone
 * @param   {string} local - 'zh-CN', 'en-ZA', 'en-AU', 'en-HK', 'pt-PT', 'fr-FR', 'el-GR'
 * @returns {Field}
 */

/**
 * Check if the field value is valid JSON
 * @method  Field.prototype.isJSON
 * @returns {Field}
 */

/**
 * Check if the field value contains only ASCII chars
 * @method  Field.prototype.isAscii
 * @returns {Field}
 */

/**
 * Check if the field value a valid hex-encoded representation of a MongoDB ObjectId
 * @method  Field.prototype.isMongoId
 * @returns {Field}
 */

/**
 * Check if the field value is a valid currency amount
 * @method  Field.prototype.isCurrency
 * @param   {Object} [options={symbol: '$', require_symbol: false, allow_space_after_symbol: false, symbol_after_digits: false, allow_negatives: true, parens_for_negatives: false, negative_sign_before_digits: false, negative_sign_after_digits: false, allow_negative_sign_placeholder: false, thousands_separator: ',', decimal_separator: '.', allow_space_after_digits: false }] - Options
 * @returns {Field}
 */

/**
 * Convert the field value to a string
 * @method  Field.prototype.toString
 * @returns {Field}
 */

/**
 * Convert the field value to a date
 * @method  Field.prototype.toDate
 * @returns {Field}
 */

/**
 * Convert the field value to a float
 * @method  Field.prototype.toFloat
 * @returns {Field}
 */

/**
 * Convert the field value to an integer
 * @method  Field.prototype.toInt
 * @returns {Field}
 */

/**
 * Convert the field value to a boolean
 * @method  Field.prototype.toBoolean
 * @param   {Boolean} [strict=false] - If set to true, only '1' and 'true' return true
 * @returns {Field}
 */

/**
 * Trim characters from both sides of the field value
 * @param   {string} [chars=' '] - characters to trim
 * @method  Field.prototype.trim
 * @returns {Field}
 */

/**
 * Trim characters from left-side of the field value
 * @param   {string} [chars=' '] - characters to trim
 * @method  Field.prototype.ltrim
 * @returns {Field}
 */

/**
 * Trim characters from right-side of the field value
 * @param   {string} [chars=' '] - characters to trim
 * @method  Field.prototype.rtrim
 * @returns {Field}
 */

/**
 * Replace <, >, &, ', " and / with HTML entities
 * @method  Field.prototype.escape
 * @returns {Field}
 */

/**
 * Remove characters with a numerical value < 32 and > 127, mostly control characters.
 * @method  Field.prototype.stripLow
 * @param   {Boolean} [keep_new_lines=false] - If true, newline chars are preserved
 * @returns {Field}
 */

/**
 * Remove characters that do not appear in the whitelist
 * @method  Field.prototype.whitelist
 * @param   {string} chars - whitelist characters
 * @returns {Field}
 */


/**
 * Remove characters that appear in the blacklist
 * @method  Field.prototype.blacklist
 * @param   {string} chars - blacklist characters
 * @returns {Field}
 */

/**
 * Canonicalize an email address
 * With lowercase set to true, the local part of the email address is lowercased for all domains; the hostname is always lowercased and the local part of the email address is always lowercased for hosts that are known to be case-insensitive (currently only GMail). Normalization follows special rules for known providers: currently, GMail addresses have dots removed in the local part and are stripped of tags (e.g. some.one+tag@gmail.com becomes someone@gmail.com) and all @googlemail.com addresses are normalized to @gmail.com.
 * @method  Field.prototype.normalizeEmail
 * @param   {Object} [options={ lowercase: true }] - Options
 * @returns {Field}
 */

/**
 * Capitalize the field value
 * @method Field.prototype.capitalize
 * @returns {Field}
 */

/**
 * Truncate the field value
 * @method Field.prototype.trunc
 * @param   {Object|Number} [options]                - Options or the maximum value length
 * @param   {Number}        [options.length=30]      - The maximum value length
 * @param   {string}        [options.omission='...'] - The string to indicate text is omitted
 * @param   {RegExp|string} [options.separator]      - The separator pattern to truncate to
 * @returns {Field}
 */

/**
 * Convert the field value to lowercase
 * @method Field.prototype.lower
 * @returns {Field}
 */

/**
 * Convert the field value to uppercase
 * @method Field.prototype.upper
 * @returns {Field}
 */

/**
 * Form email field
 * @constructor EmailField
 * @extends Field
 * @param {Object} options - Options
 */
Field.Email = function (options) {
    return new Field(options).trim().isEmail().normalizeEmail();
};

module.exports = Field;
