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
    },
    Field_random_name: function (test) {
        var f = Field();
        test.ok(f._name.match('name_') != null);
        test.done();
    },
    Field_clone: function (test) {
        var f = Field({ name: 'foo', hello: 'world' });
        var clone = f.clone();
        clone.setValue('bar');
        test.equals(f.value(), '');
        test.equals(clone.value(), 'bar');
        test.equals(clone._name, 'foo');
        test.equals(clone._options.hello, 'world');
        test.done();
    },
    Field_clone_with_validators: function (test) {
        var f = Field({ name: 'foo', hello: 'world' }).isLength(5, 20).isEmail();
        var clone = f.clone();

        clone.setValue('bar');
        test.equals(clone.validate(), false);
        test.equals(clone.errors()[0], 'length');

        clone.setValue('barjo');
        test.equals(clone.validate(), false);
        test.equals(clone.errors()[0], 'format');

        clone.setValue('barjo@nomail.com');
        test.equals(clone.validate(), true);
        test.equals(clone.errors().length, 0);
        test.done();
    },
    Field_clone_with_errors: function (test) {
        var f = Field({ name: 'foo', hello: 'world' }).isLength(5, 20).isEmail();
        var clone = f.clone();
        f.setValue('bar');
        f.validate();
        test.equals(f.errors().length, 1);
        test.equals(clone.errors().length, 0);
        test.done();
    },
    Field_capitalize: function (test) {
        var f = Field({ name: 'foo' }).trim().capitalize();
        f.setValue('  bar ');
        f.validate();
        test.equals(f.value(), 'Bar');
        test.done();
    },
    Field_truncate: function (test) {
        var f = Field({ name: 'foo' }).trunc(10);
        f.setValue('Hello the world !');
        f.validate();
        test.equals(f.value().length, 10);
        test.equals(f.value(), 'Hello t...');
        test.done();
    },
    Field_lower: function (test) {
        var f = Field({ name: 'foo' }).lower();
        f.setValue('BaR');
        f.validate();
        test.equals(f.value(), 'bar');
        test.done();
    },
    Field_upper: function (test) {
        var f = Field({ name: 'foo' }).upper();
        f.setValue('bAr');
        f.validate();
        test.equals(f.value(), 'BAR');
        test.done();
    }
};
