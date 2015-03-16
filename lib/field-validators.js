'use strict';

var _ = require('lodash');
var validator = require('validator');

/**
 * @name FieldValidators
 * @enum {validateCallback}
 */
module.exports = {
    equals:             validator.equals,
    contains:           validator.contains,
    matches:            validator.matches,
    isEmail:            validator.isEmail,
    isURL:              validator.isURL,
    isFQDN:             validator.isFQDN,
    isIP:               validator.isIP,
    isAlpha:            validator.isAlpha,
    isNumeric:          validator.isNumeric,
    isAlphanumeric:     validator.isAlphanumeric,
    isBase64:           validator.isBase64,
    isHexadecimal:      validator.isHexadecimal,
    isLowercase:        validator.isLowercase,
    isUppercase:        validator.isUppercase,
    isInt:              validator.isInt,
    isFloat:            validator.isFloat,
    isNull:             validator.isNull,
    isLength:           validator.isLength,
    isByteLength:       validator.isByteLength,
    isUUID:             validator.isUUID,
    isDate:             validator.isDate,
    isAfter:            validator.isAfter,
    isBefore:           validator.isBefore,
    isIn:               validator.isIn,
    isCreditCard:       validator.isCreditCard,
    isISBN:             validator.isISBN,
    isMobilePhone:      validator.isMobilePhone,
    isJSON:             validator.isJSON,
    isMultibyte:        validator.isMultibyte,
    isAscii:            validator.isAscii,
    isFullWidth:        validator.isFullWidth,
    isHalfWidth:        validator.isHalfWidth,
    isVariableWidth:    validator.isVariableWidth,
    isSurrogatePair:    validator.isSurrogatePair,
    isMongoId:          validator.isMongoId,
    isCurrency:         validator.isCurrency,
    toString:           validator.toString,
    toDate:             validator.toDate,
    toFloat:            validator.toFloat,
    toInt:              validator.toInt,
    toBoolean:          validator.toBoolean,
    trim:               validator.trim,
    ltrim:              validator.ltrim,
    rtrim:              validator.rtrim,
    escape:             validator.escape,
    stripLow:           validator.stripLow,
    whitelist:          validator.whitelist,
    blacklist:          validator.blacklist,
    normalizeEmail:     validator.normalizeEmail,
    capitalize:         _.capitalize,
    trunc:              _.trunc
};

