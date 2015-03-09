var Form = require('../index');
var Field = Form.Field;
var EmailField = Form.EmailField;

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
        test.equals(r.errors('foo')[0], Form.validators._required);
        test.equals(r.errors('bar')[0], Form.validators._required);
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
        test.equals(r.errors('foo').length, 0);
        test.equals(r.errors('bar').length, 0);
        test.equals(r.value('foo'), 'hello');
        test.equals(r.value('bar'), 'world');
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
        test.equals(r.errors('foo').length, 0);
        test.equals(r.errors('bar').length, 0);
        test.equals(r.value('foo'), 'hello@world.com');
        test.equals(r.value('bar'), 'world');
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
        test.equals(r.errors('foo')[0], Form.validators.equals);
        test.equals(r.errors('bar').length, 0);
        test.equals(r.value('foo'), 'worldx');
        test.equals(r.value('bar'), 'world');
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
        test.equals(r.errors('foo').length, 0);
        test.equals(r.errors('bar').length, 0);
        test.equals(r.value('foo'), 'world');
        test.equals(r.value('bar'), 'world');
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
        test.equals(r.errors('foo').length, 0);
        test.equals(r.errors('bar').length, 0);
        test.equals(r.value('foo'), 'world');
        test.equals(r.value('bar'), 'world');
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
        test.equals(r.errors('foo').length, 0);
        test.equals(r.errors('bar').length, 0);
        test.equals(r.value('foo'), 'hello');
        test.equals(r.value('bar'), 'hello');
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
        test.equals(r.errors('foo').length, 0);
        test.equals(r.errors('bar').length, 0);
        test.equals(r.value('foo'), 'hello');
        test.equals(r.value('bar'), 'hello');
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
        test.equals(r.errors('foo').length, 0);
        test.equals(r.errors('bar').length, 0);
        test.equals(r.errors('boo')[0], Form.validators.isEmail);
        test.equals(r.value('foo'), 'hello');
        test.equals(r.value('bar'), 'hello');
        test.equals(r.value('boo'), 'hello');
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
        test.equals(r.errors()[0], Form.validators._unknownField);
        test.equals(r.errors('foo').length, 0);
        test.equals(r.errors('bar').length, 0);
        test.equals(r.value('foo'), 'hello');
        test.equals(r.value('bar'), 'hello');
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
        test.equals(r.errors('foo').length, 0);
        test.equals(r.errors('bar').length, 0);
        test.equals(r.value('foo'), '42');
        test.equals(r.value('bar'), '42');
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
        test.equals(r.errors('foo').length, 0);
        test.equals(r.errors('bar'), Form.validators.is42);
        test.equals(r.value('foo'), '43');
        test.equals(r.value('bar'), '43');
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
        test.equals(r.errors('foo').length, 0);
        test.equals(r.errors('bar').length, 0);
        test.equals(r.value('foo'), '42');
        test.equals(r.value('bar'), '42');
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
        test.equals(r.errors('foo').length, 0);
        test.equals(r.errors('bar'), Form.validators.startsWith);
        test.equals(r.value('foo'), '69');
        test.equals(r.value('bar'), '69');
        test.done();
    },
    Form_with_EmailField: function (test) {
        var form = Form({
            fields: [
                EmailField({ name: 'foo' }),
                Field({ name: 'bar' }).isLength(3, 6).contains('orl')
            ]
        });
        var r = form.validate({ foo: 'hello@world.com', 'bar': 'world' });
        test.equals(r.valid, true);
        test.equals(r.errors('foo').length, 0);
        test.equals(r.errors('bar').length, 0);
        test.equals(r.value('foo'), 'hello@world.com');
        test.equals(r.value('bar'), 'world');
        test.done();
    },
    Form_with_EmailField_2: function (test) {
        var form = Form({
            fields: [
                EmailField({ name: 'foo' }),
                Field({ name: 'bar' }).isLength(3, 6).contains('orl')
            ]
        });
        var r = form.validate({ foo: 'hello%world.com', 'bar': 'world' });
        test.equals(r.valid, false);
        test.equals(r.errors('foo')[0], Form.validators.isEmail);
        test.equals(r.errors('bar').length, 0);
        test.equals(r.value('foo'), 'hello%world.com');
        test.equals(r.value('bar'), 'world');
        test.done();
    },
    Form_with_array_named_fields: function (test) {
        var form = Form({
            fields: [
                Field({ name: 'user[login][username]' }),
                Field({ name: 'user[login][email]' }),
                Field({ name: 'user[password]' }),
                Field({ name: 'user[info][name][firstname]' }),
                Field({ name: 'user[info][name][lastname]' }),
                Field({ name: 'user[info][sex]' }),
                Field({ name: 'lang' }),
            ]
        });

        var body = {
            user: {
                login: {
                    username: 'chucky',
                    email: 'chucky@nomail.com'
                },
                password: '123456',
                info: {
                    name: {
                        firstname: 'Chuck',
                        lastname: 'Norris'
                    },
                    sex: 'M'
                },
            },
            lang: 'en'
        };
        var r = form.validate(body);
        test.equals(r.value('user[login][username]'), 'chucky');
        test.equals(r.value('user[login][email]'), 'chucky@nomail.com');
        test.equals(r.value('user[password]'), '123456');
        test.equals(r.value('user[info][name][firstname]'), 'Chuck');
        test.equals(r.value('user[info][name][lastname]'), 'Norris');
        test.equals(r.value('user[info][sex]'), 'M');
        test.equals(r.value('lang'), 'en');
        test.done();
    },
    Form_with_array_named_fields_validators: function (test) {
        var form = Form({
            fields: [
                Field({ name: 'user[login][username]' }).isAlphanumeric(),
                Field({ name: 'user[login][email]' }).isEmail(),
                Field({ name: 'user[password]' }).isLength(5, 30),
                Field({ name: 'user[info][name][firstname]' }).trim().matches('[A-Z][a-zA-Z]+'),
                Field({ name: 'user[info][name][lastname]' }).trim().matches('[A-Z][a-zA-Z]+'),
                Field({ name: 'user[info][sex]' }).isIn(['M', 'F']),
                Field({ name: 'lang' }).isIn(['en', 'fr']),
            ]
        });

        var body = {
            user: {
                login: {
                    username: 'chucky',
                    email: 'chucky@nomail.com'
                },
                password: '123456',
                info: {
                    name: {
                        firstname: '   Chuck ',
                        lastname: 'Norris '
                    },
                    sex: 'M'
                },
            },
            lang: 'en'
        };
        var r = form.validate(body);
        test.equals(r.value('user[login][username]'), 'chucky');
        test.equals(r.value('user[login][email]'), 'chucky@nomail.com');
        test.equals(r.value('user[password]'), '123456');
        test.equals(r.value('user[info][name][firstname]'), 'Chuck');
        test.equals(r.value('user[info][name][lastname]'), 'Norris');
        test.equals(r.value('user[info][sex]'), 'M');
        test.equals(r.value('lang'), 'en');
        test.equals(r.valid, true);
        test.done();
    },
    Form_with_array_named_fields_validators: function (test) {
        var form = Form({
            fields: [
                Field({ name: 'user[login][username]' }).isAlphanumeric(),
                Field({ name: 'user[login][email]' }).isEmail(),
                Field({ name: 'user[password]' }).isLength(5, 30),
                Field({ name: 'user[info][name][firstname]' }).trim().matches('[A-Z][a-zA-Z]+'),
                Field({ name: 'user[info][name][lastname]' }).trim().matches('[A-Z][a-zA-Z]+'),
                Field({ name: 'user[info][sex]' }).isIn(['M', 'F']),
                Field({ name: 'lang' }).isIn(['en', 'fr']),
            ]
        });

        var body = {
            user: {
                login: {
                    username: 'chucky',
                    email: 'chucky%nomail.com'
                },
                password: '123456',
                info: {
                    name: {
                        firstname: 'Chuck',
                        lastname: 'Norris'
                    },
                    sex: 'M'
                },
            },
            lang: 'en'
        };
        var r = form.validate(body);
        test.equals(r.value('user[login][username]'), 'chucky');
        test.equals(r.errors('user[login][email]')[0], Form.validators.isEmail);
        test.equals(r.value('user[password]'), '123456');
        test.equals(r.value('user[info][name][firstname]'), 'Chuck');
        test.equals(r.value('user[info][name][lastname]'), 'Norris');
        test.equals(r.value('user[info][sex]'), 'M');
        test.equals(r.value('lang'), 'en');
        test.equals(r.valid, false);
        test.done();
    }
};
