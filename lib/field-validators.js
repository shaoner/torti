'use strict';

var _ = require('lodash');
var v = require('validator');

function asyncV (fn) {
    return function () {
        var args = Array.prototype.slice.call(arguments, 1);
        var cb = arguments[0];
        cb(fn.apply(null, args), args[0]);
    };
};

function asyncS (fn) {
    return function () {
        var args = Array.prototype.slice.call(arguments, 1);
        var cb = arguments[0];
        cb(true, fn.apply(null, args));
    };
};

/**
 * @name FieldValidators
 * @enum {validateCallback}
 */
module.exports = {
    equals:          asyncV(v.equals),
    contains:        asyncV(v.contains),
    matches:         asyncV(v.matches),
    isEmail:         asyncV(v.isEmail),
    isURL:           asyncV(v.isURL),
    isFQDN:          asyncV(v.isFQDN),
    isIP:            asyncV(v.isIP),
    isAlpha:         asyncV(v.isAlpha),
    isNumeric:       asyncV(v.isNumeric),
    isAlphanumeric:  asyncV(v.isAlphanumeric),
    isBase64:        asyncV(v.isBase64),
    isHexadecimal:   asyncV(v.isHexadecimal),
    isLowercase:     asyncV(v.isLowercase),
    isUppercase:     asyncV(v.isUppercase),
    isInt:           asyncV(v.isInt),
    isFloat:         asyncV(v.isFloat),
    isNull:          asyncV(v.isNull),
    isLength:        asyncV(v.isLength),
    isByteLength:    asyncV(v.isByteLength),
    isUUID:          asyncV(v.isUUID),
    isDate:          asyncV(v.isDate),
    isAfter:         asyncV(v.isAfter),
    isBefore:        asyncV(v.isBefore),
    isIn:            asyncV(v.isIn),
    isCreditCard:    asyncV(v.isCreditCard),
    isISBN:          asyncV(v.isISBN),
    isMobilePhone:   asyncV(v.isMobilePhone),
    isJSON:          asyncV(v.isJSON),
    isMultibyte:     asyncV(v.isMultibyte),
    isAscii:         asyncV(v.isAscii),
    isFullWidth:     asyncV(v.isFullWidth),
    isHalfWidth:     asyncV(v.isHalfWidth),
    isVariableWidth: asyncV(v.isVariableWidth),
    isSurrogatePair: asyncV(v.isSurrogatePair),
    isMongoId:       asyncV(v.isMongoId),
    isCurrency:      asyncV(v.isCurrency),
    toString:        asyncS(v.toString),
    toDate:          asyncS(v.toDate),
    toFloat:         asyncS(v.toFloat),
    toInt:           asyncS(v.toInt),
    toBoolean:       asyncS(v.toBoolean),
    trim:            asyncS(v.trim),
    ltrim:           asyncS(v.ltrim),
    rtrim:           asyncS(v.rtrim),
    escape:          asyncS(v.escape),
    stripLow:        asyncS(v.stripLow),
    whitelist:       asyncS(v.whitelist),
    blacklist:       asyncS(v.blacklist),
    normalizeEmail:  asyncS(v.normalizeEmail),
    capitalize:      asyncS(_.capitalize),
    trunc:           asyncS(_.trunc),
    lower:           function (done, val) { done(true, val.toLowerCase()); },
    upper:           function (done, val) { done(true, val.toUpperCase()); }
};

