var Form = require('./lib/form');
var Field = require('./lib/field');
var Errors = require('./lib/errors');

module.exports = Form;
module.exports.Field = Field;
module.exports.EmailField = Field.Email;
module.exports.Errors = Errors;
