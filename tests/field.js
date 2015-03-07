var Form = require('../index');
var Field = Form.Field;

module.exports = {
    Field_empty: function (test) {
        var field = Field();
        test.done();
    },
    Field_empty_in_Form: function (test) {
        var field = Form({
            fields: [ Field() ]
        });
        test.done();
    },
    Field_required: function (test) {
        var field = Field();
        test.equals(field._required, true);
        test.done();
    },
    Field_optional: function (test) {
        var field = Field().optional();
        test.equals(field._required, false);
        test.done();
    }
};
