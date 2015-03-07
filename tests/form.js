var Form = require('../index');
var Field = Form.Field;

module.exports = {
    Form_empty: function (test) {
        var form = Form();
        test.done();
    },
    Form_with_1_field: function (test) {
        var form = Form({
            fields: [
                Field({ name: 'foo' })
            ]
        });
        test.equals(form._fields.length, 1);
        test.done();
    },
    Form_with_2_fields: function (test) {
        var form = Form({
            fields: [
                Field({ name: 'foo' }),
                Field({ name: 'bar' })
            ]
        });
        test.equals(form._fields.length, 2);
        test.done();
    },
    Form_get_existing_field: function (test) {
        var form = Form({
            fields: [
                Field({ name: 'foo' }),
                Field({ name: 'bar' })
            ]
        });
        var field = form.get('bar');
        test.ok(field !== null);
        test.done();
    },
    Form_get_unknown_field: function (test) {
        var form = Form({
            fields: [
                Field({ name: 'foo' }),
                Field({ name: 'bar' })
            ]
        });
        var field = form.get('boo');
        test.ok(field === null);
        test.done();
    },
    Form_validate_empty_body: function (test) {
        var form = Form({
            fields: [
                Field({ name: 'foo' }),
                Field({ name: 'bar' })
            ]
        });
        var r = form.validate();
        test.equals(r.valid, false);
        test.equals(r.oFields.foo.error, Form.validators._required);
        test.equals(r.oFields.bar.error, Form.validators._required);
        test.done();
    },
    Form_validate_body_1: function (test) {
        var form = Form({
            fields: [
                Field({ name: 'foo' }),
                Field({ name: 'bar' })
            ]
        });
        var r = form.validate({ foo: 'hello', 'bar': 'world' });
        test.equals(r.valid, true);
        test.equals(typeof r.oFields.foo.error, 'undefined');
        test.equals(typeof r.oFields.foo.error, 'undefined');
        test.equals(r.oFields.foo.value, 'hello');
        test.equals(r.oFields.bar.value, 'world');
        test.done();
    },
    Form_validate_body_2: function (test) {
        var form = Form({
            fields: [
                Field({ name: 'foo' }).isEmail(),
                Field({ name: 'bar' }).isLength(3, 6).contains('orl')
            ]
        });
        var r = form.validate({ foo: 'hello@world.com', 'bar': 'world' });
        test.equals(r.valid, true);
        test.equals(typeof r.oFields.foo.error, 'undefined');
        test.equals(typeof r.oFields.bar.error, 'undefined');
        test.equals(r.oFields.foo.value, 'hello@world.com');
        test.equals(r.oFields.bar.value, 'world');
        test.done();
    },
    Form_validate_body_3: function (test) {
        var form = Form({
            fields: [
                Field({ name: 'foo' }).equals(Field('bar')),
                Field({ name: 'bar' }).isLength(3, 6).contains('orl')
            ]
        });
        var r = form.validate({ foo: 'worldx', 'bar': 'world' });
        test.equals(r.valid, false);
        test.equals(r.oFields.foo.error, Form.validators.equals);
        test.equals(typeof r.oFields.bar.error, 'undefined');
        test.equals(r.oFields.foo.value, 'worldx');
        test.equals(r.oFields.bar.value, 'world');
        test.done();
    },
    Form_validate_body_4: function (test) {
        var form = Form({
            fields: [
                Field({ name: 'foo' }).equals(Field('bar')),
                Field({ name: 'bar' }).isLength(3, 6).contains('orl')
            ]
        });
        var r = form.validate({ foo: 'world', 'bar': 'world' });
        test.equals(r.valid, true);
        test.equals(typeof r.oFields.foo.error, 'undefined');
        test.equals(typeof r.oFields.bar.error, 'undefined');
        test.equals(r.oFields.foo.value, 'world');
        test.equals(r.oFields.bar.value, 'world');
        test.done();
    },
    Form_validate_body_5: function (test) {
        var form = Form({
            fields: [
                Field({ name: 'foo' }).trim().equals(Field('bar')),
                Field({ name: 'bar' }).isLength(3, 6).contains('orl')
            ]
        });
        var r = form.validate({ foo: ' world      ', 'bar': 'world' });
        test.equals(r.valid, true);
        test.equals(typeof r.oFields.foo.error, 'undefined');
        test.equals(typeof r.oFields.bar.error, 'undefined');
        test.equals(r.oFields.foo.value, 'world');
        test.equals(r.oFields.bar.value, 'world');
        test.done();
    },
    Form_validate_body_with_optional_fields_1: function (test) {
        var form = Form({
            fields: [
                Field({ name: 'foo' }).equals(Field('bar')),
                Field({ name: 'bar' }),
                Field({ name: 'boo' }).optional().isEmail()
            ]
        });
        var r = form.validate({ foo: 'hello', 'bar': 'hello' });
        test.equals(r.valid, true);
        test.equals(typeof r.oFields.foo.error, 'undefined');
        test.equals(typeof r.oFields.bar.error, 'undefined');
        test.equals(r.oFields.foo.value, 'hello');
        test.equals(r.oFields.bar.value, 'hello');
        test.done();
    },
    Form_validate_body_with_optional_fields_2: function (test) {
        var form = Form({
            fields: [
                Field({ name: 'foo' }).equals(Field('bar')),
                Field({ name: 'bar' }),
                Field({ name: 'boo' }).optional().isEmail()
            ]
        });
        var r = form.validate({ foo: 'hello', bar: 'hello', boo: 'hello@world.com' });
        test.equals(r.valid, true);
        test.equals(typeof r.oFields.foo.error, 'undefined');
        test.equals(typeof r.oFields.bar.error, 'undefined');
        test.equals(r.oFields.foo.value, 'hello');
        test.equals(r.oFields.bar.value, 'hello');
        test.done();
    },
    Form_validate_body_with_optional_fields_3: function (test) {
        var form = Form({
            fields: [
                Field({ name: 'foo' }).equals(Field('bar')),
                Field({ name: 'bar' }).equals(Field('boo')),
                Field({ name: 'boo' }).optional().isEmail()
            ]
        });
        var r = form.validate({ foo: 'hello', bar: 'hello', boo: 'hello' });
        test.equals(r.valid, false);
        test.equals(typeof r.oFields.foo.error, 'undefined');
        test.equals(typeof r.oFields.bar.error, 'undefined');
        test.equals(r.oFields.boo.error, Form.validators.isEmail);
        test.equals(r.oFields.foo.value, 'hello');
        test.equals(r.oFields.bar.value, 'hello');
        test.equals(r.oFields.boo.value, 'hello');
        test.done();
    },
    Form_validate_body_with_unknown_field: function (test) {
        var form = Form({
            fields: [
                Field({ name: 'foo' }).equals(Field('bar')),
                Field({ name: 'bar' }).equals(Field('boo')),
            ]
        });
        var r = form.validate({ foo: 'hello', bar: 'hello', boo: 'hello' });
        test.equals(r.valid, false);
        test.equals(r.globalError, Form.validators._unknownField);
        test.equals(typeof r.oFields.foo.error, 'undefined');
        test.equals(typeof r.oFields.bar.error, 'undefined');
        test.equals(r.oFields.foo.value, 'hello');
        test.equals(r.oFields.bar.value, 'hello');
        test.done();
    },
    Form_add_simple_validator: function (test) {
        Form.addValidator('is42', function (v) {
            return v == 42;
        }, 'error42');

        var form = Form({
            fields: [
                Field({ name: 'foo' }).trim().equals(Field('bar')),
                Field({ name: 'bar' }).is42()
            ]
        });
        var r = form.validate({ foo: ' 42      ', 'bar': '42' });
        test.equals(r.valid, true);
        test.equals(typeof r.oFields.foo.error, 'undefined');
        test.equals(typeof r.oFields.bar.error, 'undefined');
        test.equals(r.oFields.foo.value, '42');
        test.equals(r.oFields.bar.value, '42');
        test.done();
    },
    Form_add_simple_validator_2: function (test) {
        Form.addValidator('is42', function (v) {
            return v == 42;
        }, 'error42');

        var form = Form({
            fields: [
                Field({ name: 'foo' }).trim().equals(Field('bar')),
                Field({ name: 'bar' }).is42()
            ]
        });
        var r = form.validate({ foo: ' 43      ', 'bar': '43' });
        test.equals(r.valid, false);
        test.equals(typeof r.oFields.foo.error, 'undefined');
        test.equals(r.oFields.bar.error, Form.validators.is42);
        test.equals(r.oFields.foo.value, '43');
        test.equals(r.oFields.bar.value, '43');
        test.done();
    },
    Form_add_validator_with_params: function (test) {
        Form.addValidator('startsWith', function (v, s) {
            return v[0] == s;
        }, 'errorStartsWith');

        var form = Form({
            fields: [
                Field({ name: 'foo' }).trim().equals(Field('bar')),
                Field({ name: 'bar' }).startsWith('4')
            ]
        });
        var r = form.validate({ foo: ' 42      ', 'bar': '42' });
        test.equals(r.valid, true);
        test.equals(typeof r.oFields.foo.error, 'undefined');
        test.equals(typeof r.oFields.bar.error, 'undefined');
        test.equals(r.oFields.foo.value, '42');
        test.equals(r.oFields.bar.value, '42');
        test.done();
    },
    Form_add_validator_with_params_2: function (test) {
        Form.addValidator('startsWith', function (v, s) {
            return v[0] == s;
        }, 'errorStartsWith');

        var form = Form({
            fields: [
                Field({ name: 'foo' }).trim().equals(Field('bar')),
                Field({ name: 'bar' }).startsWith('4')
            ]
        });
        var r = form.validate({ foo: ' 69      ', 'bar': '69' });
        test.equals(r.valid, false);
        test.equals(typeof r.oFields.foo.error, 'undefined');
        test.equals(r.oFields.bar.error, Form.validators.startsWith);
        test.equals(r.oFields.foo.value, '69');
        test.equals(r.oFields.bar.value, '69');
        test.done();
    },
};
