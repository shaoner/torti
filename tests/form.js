var Form = require('../index');
var Field = Form.Field;
var EmailField = Form.EmailField;
var Errors = Form.Errors;

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
        form.validate(function (vForm) {
            test.equals(vForm.isValid(), false);
            test.equals(vForm.errors('foo')[0], Errors._required);
            test.equals(vForm.errors('bar')[0], Errors._required);
            test.done();
        });
    },
    Form_validate_body_1: function (test) {
        var form = Form({
            fields: [
                Field({ name: 'foo' }),
                Field({ name: 'bar' })
            ]
        });
        form.validate({ foo: 'hello', 'bar': 'world' }, function (vForm) {
            test.equals(vForm.isValid(), true);
            test.equals(vForm.errors('foo').length, 0);
            test.equals(vForm.errors('bar').length, 0);
            test.equals(vForm.value('foo'), 'hello');
            test.equals(vForm.value('bar'), 'world');
            test.done();
        });
    },
    Form_validate_body_2: function (test) {
        var form = Form({
            fields: [
                Field({ name: 'foo' }).isEmail(),
                Field({ name: 'bar' }).isLength(3, 6).contains('orl')
            ]
        });
        form.validate({ foo: 'hello@world.com', 'bar': 'world' }, function (vForm) {
            test.equals(vForm.isValid(), true);
            test.equals(vForm.errors('foo').length, 0);
            test.equals(vForm.errors('bar').length, 0);
            test.equals(vForm.value('foo'), 'hello@world.com');
            test.equals(vForm.value('bar'), 'world');
            test.done();
        });
    },
    Form_validate_body_3: function (test) {
        var form = Form({
            fields: [
                Field({ name: 'foo' }).equals(Field('bar')),
                Field({ name: 'bar' }).isLength(3, 6).contains('orl')
            ]
        });
        form.validate({ foo: 'worldx', 'bar': 'world' }, function (vForm) {
            test.equals(vForm.isValid(), false);
            test.equals(vForm.errors('foo')[0], Errors.equals);
            test.equals(vForm.errors('bar').length, 0);
            test.equals(vForm.value('foo'), 'worldx');
            test.equals(vForm.value('bar'), 'world');
            test.done();
        });
    },
    Form_validate_body_4: function (test) {
        var form = Form({
            fields: [
                Field({ name: 'foo' }).equals(Field('bar')),
                Field({ name: 'bar' }).isLength(3, 6).contains('orl')
            ]
        });
        form.validate({ foo: 'world', 'bar': 'world' }, function (vForm) {
            test.equals(vForm.isValid(), true);
            test.equals(vForm.errors('foo').length, 0);
            test.equals(vForm.errors('bar').length, 0);
            test.equals(vForm.value('foo'), 'world');
            test.equals(vForm.value('bar'), 'world');
            test.done();
        });
    },
    Form_validate_body_5: function (test) {
        var form = Form({
            fields: [
                Field({ name: 'foo' }).trim().equals(Field('bar')),
                Field({ name: 'bar' }).isLength(3, 6).contains('orl')
            ]
        });
        form.validate({ foo: ' world      ', 'bar': 'world' }, function (vForm) {
            test.equals(vForm.isValid(), true);
            test.equals(vForm.errors('foo').length, 0);
            test.equals(vForm.errors('bar').length, 0);
            test.equals(vForm.value('foo'), 'world');
            test.equals(vForm.value('bar'), 'world');
            test.done();
        });
    },
    Form_validate_body_with_optional_fields_1: function (test) {
        var form = Form({
            fields: [
                Field({ name: 'foo' }).equals(Field('bar')),
                Field({ name: 'bar' }),
                Field({ name: 'boo' }).optional().isEmail()
            ]
        });
        form.validate({ foo: 'hello', 'bar': 'hello' }, function (vForm) {
            test.equals(vForm.isValid(), true);
            test.equals(vForm.errors('foo').length, 0);
            test.equals(vForm.errors('bar').length, 0);
            test.equals(vForm.value('foo'), 'hello');
            test.equals(vForm.value('bar'), 'hello');
            test.done();
        });
    },
    Form_validate_body_with_optional_fields_2: function (test) {
        var form = Form({
            fields: [
                Field({ name: 'foo' }).equals(Field('bar')),
                Field({ name: 'bar' }),
                Field({ name: 'boo' }).optional().isEmail()
            ]
        });
        form.validate({ foo: 'hello', bar: 'hello', boo: 'hello@world.com' }, function (vForm) {
            test.equals(vForm.isValid(), true);
            test.equals(vForm.errors('foo').length, 0);
            test.equals(vForm.errors('bar').length, 0);
            test.equals(vForm.value('foo'), 'hello');
            test.equals(vForm.value('bar'), 'hello');
            test.done();
        });
    },
    Form_validate_body_with_optional_fields_3: function (test) {
        var form = Form({
            fields: [
                Field({ name: 'foo' }).equals(Field('bar')),
                Field({ name: 'bar' }).equals(Field('boo')),
                Field({ name: 'boo' }).optional().isEmail()
            ]
        });
        form.validate({ foo: 'hello', bar: 'hello', boo: 'hello' }, function (vForm) {
            test.equals(vForm.isValid(), false);
            test.equals(vForm.errors('foo').length, 0);
            test.equals(vForm.errors('bar').length, 0);
            test.equals(vForm.errors('boo')[0], Errors.isEmail);
            test.equals(vForm.value('foo'), 'hello');
            test.equals(vForm.value('bar'), 'hello');
            test.equals(vForm.value('boo'), 'hello');
            test.done();
        });
    },
    Form_validate_body_with_unknown_field: function (test) {
        var form = Form({
            fields: [
                Field({ name: 'foo' }).equals(Field('bar')),
                Field({ name: 'bar' }).equals(Field('boo')),
            ]
        });
        form.validate({ foo: 'hello', bar: 'hello', boo: 'hello' }, function (vForm) {
            test.equals(vForm.isValid(), false);
            test.equals(vForm.globalErrors()[0], Errors._unknownField);
            test.equals(vForm.errors('foo').length, 0);
            test.equals(vForm.errors('bar').length, 0);
            test.equals(vForm.value('foo'), 'hello');
            test.equals(vForm.value('bar'), 'hello');
            test.done();
        });
    },
    Form_add_simple_validator: function (test) {
        Form.addValidator('is42', function (done, v) {
            done(v == 42);
        }, 'error42');

        var form = Form({
            fields: [
                Field({ name: 'foo' }).trim().equals(Field('bar')),
                Field({ name: 'bar' }).is42()
            ]
        });
        form.validate({ foo: ' 42      ', 'bar': '42' }, function (vForm) {
            test.equals(vForm.isValid(), true);
            test.equals(vForm.errors('foo').length, 0);
            test.equals(vForm.errors('bar').length, 0);
            test.equals(vForm.value('foo'), '42');
            test.equals(vForm.value('bar'), '42');
            test.done();
        });
    },
    Form_add_simple_validator_2: function (test) {
        Form.addValidator('is42', function (done, v) {
            done(v == 42);
        }, 'error42');

        var form = Form({
            fields: [
                Field({ name: 'foo' }).trim().equals(Field('bar')),
                Field({ name: 'bar' }).is42()
            ]
        });
        form.validate({ foo: ' 43      ', 'bar': '43' }, function (vForm) {
            test.equals(vForm.isValid(), false);
            test.equals(vForm.errors('foo').length, 0);
            test.equals(vForm.errors('bar'), Errors.is42);
            test.equals(vForm.value('foo'), '43');
            test.equals(vForm.value('bar'), '43');
            test.done();
        });
    },
    Form_add_validator_with_params: function (test) {
        Form.addValidator('startsWith', function (done, v, s) {
            done(v[0] == s);
        }, 'errorStartsWith');

        var form = Form({
            fields: [
                Field({ name: 'foo' }).trim().equals(Field('bar')),
                Field({ name: 'bar' }).startsWith('4')
            ]
        });
        form.validate({ foo: ' 42      ', 'bar': '42' }, function (vForm) {
            test.equals(vForm.isValid(), true);
            test.equals(vForm.errors('foo').length, 0);
            test.equals(vForm.errors('bar').length, 0);
            test.equals(vForm.value('foo'), '42');
            test.equals(vForm.value('bar'), '42');
            test.done();
        });
    },
    Form_add_validator_with_params_2: function (test) {
        Form.addValidator('startsWith', function (done, v, s) {
            done(v[0] == s);
        }, 'errorStartsWith');

        var form = Form({
            fields: [
                Field({ name: 'foo' }).trim().equals(Field('bar')),
                Field({ name: 'bar' }).startsWith('4')
            ]
        });
        form.validate({ foo: ' 69      ', 'bar': '69' }, function (vForm) {
            test.equals(vForm.isValid(), false);
            test.equals(vForm.errors('foo').length, 0);
            test.equals(vForm.errors('bar'), Errors.startsWith);
            test.equals(vForm.value('foo'), '69');
            test.equals(vForm.value('bar'), '69');
            test.done();
        });
    },
    Form_with_EmailField: function (test) {
        var form = Form({
            fields: [
                EmailField({ name: 'foo' }),
                Field({ name: 'bar' }).isLength(3, 6).contains('orl')
            ]
        });
        form.validate({ foo: 'hello@world.com', 'bar': 'world' }, function (vForm) {
            test.equals(vForm.isValid(), true);
            test.equals(vForm.errors('foo').length, 0);
            test.equals(vForm.errors('bar').length, 0);
            test.equals(vForm.value('foo'), 'hello@world.com');
            test.equals(vForm.value('bar'), 'world');
            test.done();
        });
    },
    Form_with_EmailField_2: function (test) {
        var form = Form({
            fields: [
                EmailField({ name: 'foo' }),
                Field({ name: 'bar' }).isLength(3, 6).contains('orl')
            ]
        });
        form.validate({ foo: 'hello%world.com', 'bar': 'world' }, function (vForm) {
            test.equals(vForm.isValid(), false);
            test.equals(vForm.errors('foo')[0], Errors.isEmail);
            test.equals(vForm.errors('bar').length, 0);
            test.equals(vForm.value('foo'), 'hello%world.com');
            test.equals(vForm.value('bar'), 'world');
            test.done();
        });
    },
    Form_clone: function (test) {
        var form = Form({
            hello: 'world',
            fields: [
                EmailField({ name: 'foo' }),
                Field({ name: 'bar' }).isLength(3, 6).contains('orl')
            ]
        });
        var clone = form.clone();
        test.equals(form._fields.length, clone._fields.length);
        test.equals(clone._options.hello, 'world');
        test.done();
    },
    Form_clone_global_error: function (test) {
        var form = Form();
        var clone = form.clone();
        clone.addGlobalError('hello');
        test.equals(form._errors.length, 0);
        test.equals(clone._errors.length, 1);
        test.equals(clone._errors[0], 'hello');
        test.done();
    },
    Form_clone_with_values: function (test) {
        var form = Form({
            fields: [
                Field({ name: 'foo', value: 'foz' }),
                Field({ name: 'bar', value: 'baz' })
            ]
        });
        var clone = form.clone();
        form.setValue('foo', 'changed');
        test.equals(clone.value('foo'), 'foz');
        test.equals(form.value('foo'), 'changed');
        test.done();
    },
    Form_render_with_refresh: function (test) {
        var form = Form({
            hello: 'world',
            fields: [
                EmailField({ name: 'foo' }),
                Field({ name: 'bar' }).isLength(3, 6).contains('orl')
            ]
        });
        test.equals(form.render().fields.length, 2);
        form.addField(Field({ name: 'baz' }));
        test.equals(form.render().fields.length, 3);
        test.done();
    },
    Form_render_with_global_errors: function (test) {
        var form = Form({
            fields: [
                EmailField({ name: 'foo' }),
                Field({ name: 'bar' }).isLength(3, 6).contains('orl')
            ]
        });
        form.addGlobalError('Oh no!');
        form.refresh();
        test.equals(form.render().errors[0], 'Oh no!');
        test.done();
    },
    Form_render_with_values: function (test) {
        var form = Form({
            fields: [
                Field({ name: 'foo' }),
                Field({ name: 'bar' }).isLength(3, 6).contains('orl')
            ]
        });
        var r = form.renderWith({ foo: 'foo@bar.com' });
        test.equals(r.fields[0].value, 'foo@bar.com');
        var r2 = form.render();
        test.equals(r2.fields[0].value, '');
        test.done();
    }
};
