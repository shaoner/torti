'use strict';

var format = require('util').format;

/**
 * @name Errors
 * @enum {?string|Function}
 */
module.exports = {
    _required:          'required',
    _unknownField:      'unknown',
    matches:            'Invalid format',
    isEmail:            'Invalid email address',
    isURL:              'Invalid URL',
    isFQDN:             'Invalid domain name',
    isIP:               'Invalid IP address',
    isAlpha:            'This should only contain alphabetical characters',
    isNumeric:          'This should only contain numerical characters',
    isAlphanumeric:     'This should only contain alphanumerical characters',
    isBase64:           'Invalid base64 value',
    isHexadecimal:      'Invalid hexadecimal value',
    isLowercase:        'This should be lowercase',
    isUppercase:        'This should be uppercase',
    isInt:              'This should be an integer',
    isFloat:            'This should be a float',
    isUUID:             'Invalid uid',
    isDate:             'Invalid date format',
    isIn:               'Invalid choice',
    isCreditCard:       'This is not a valid credit card number',
    isISBN:             'Invalid ISBN',
    isMobilePhone:      'Invalid phone number',
    isJSON:             'JSON is expected',
    isAscii:            'This must contain only ascii characters',
    isMongoId:          'Invalid mongo ObjectId',
    isCurrency:         'Invalid currency',
    equals: function (comparison) {
        return format('It should equal %s', comparison);
    },
    contains: function (seed) {
        return format('It should contain %s', seed);
    },
    isLength: function (min, max) {
        if (arguments.length > 1) {
            return format('This should be between %d and %d characters',
                          min, max);
        }
        return format('This should be at least %d characters', min);
    },
    isByteLength: function (min, max) {
        if (arguments.length > 1) {
            return format('This should be between %d and %d bytes',
                          min, max);
        }
        return format('This should be at least %d bytes', min);
    },
    isAfter: function (date) {
        return format('This should be after %s', date);
    },
    isBefore: function (date) {
        return format('This should be after %s', date);
    },
    toString:           null,
    toDate:             null,
    toFloat:            null,
    toInt:              null,
    toBoolean:          null,
    trim:               null,
    ltrim:              null,
    rtrim:              null,
    escape:             null,
    stripLow:           null,
    whitelist:          null,
    blacklist:          null,
    normalizeEmail:     null,
    capitalize:         null,
    trunc:              null,
    lower:              null,
    upper:              null
};

