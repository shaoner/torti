var Form = require('../index');
var Field = Form.Field;
var EmailField = Form.EmailField;

module.exports = {
    Field_empty: function (test) {
        var field = Field();
        test.done();
    },
    Field_empty_in_Form: function (test) {
        Form({
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
    },
    EmailField_empty: function (test) {
        var field = EmailField();
        test.equals(field._required, true);
        test.equals(field._stack.length, 3);
        test.done();
    },
    EmailField_with_params: function (test) {
        var form = Form({
            fields: [ EmailField({ name: 'email', foo: 'bar' }) ]
        });
        var r = form.render();
        test.equals(r.fields[0].foo, 'bar');
        test.done();
    }
};
