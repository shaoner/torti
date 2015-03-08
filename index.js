var Form = require('./lib/form');
var Field = require('./lib/field');
var FormRenderer = require('./lib/form-renderer');

module.exports = Form;
module.exports.Field = Field;
module.exports.EmailField = Field.Email;
module.exports.FormRenderer = FormRenderer;
