'use strict';

var Form = require('../index');
var Field = Form.Field;
var EmailField = Form.EmailField;
var Errors = Form.Errors;

module.exports = {
    Form_check_promise_reject_type: function (test) {
        var form = Form({
            fields: [
                Field({ name: 'foo' }),
                Field({ name: 'bar' })
            ]
        });
        form.validate({ foo: 'hello' })
            .then(function () {
                test.ok(false);
            }).catch(Form.ValidationError, function (err) {
                var vForm = err.form;
                test.equals(vForm.isValid(), false);
                test.equals(vForm.errors('foo').length, 0);
                test.equals(vForm.errors('bar').length, 1);
                test.equals(vForm.value('foo'), 'hello');
                test.equals(vForm.value('bar'), '');
            }).lastly(test.done);
    },
    Form_validate_empty_body_using_promise: function (test) {
        var form = Form({
            fields: [
                Field({ name: 'foo' }),
                Field({ name: 'bar' })
            ]
        });
        form.validate()
            .then(function () { test.ok(false); })
            .catch(Form.ValidationError, function (err) {
                var vForm = err.form;
                test.equals(vForm.isValid(), false);
                test.equals(vForm.errors('foo')[0], Errors._required);
                test.equals(vForm.errors('bar')[0], Errors._required);
            }).lastly(test.done);
    },
    Form_validate_body_1_using_promise: function (test) {
        var form = Form({
            fields: [
                Field({ name: 'foo' }),
                Field({ name: 'bar' })
            ]
        });
        form.validate({ foo: 'hello', 'bar': 'world' })
            .then(function (vForm) {
                test.equals(vForm.isValid(), true);
                test.equals(vForm.errors('foo').length, 0);
                test.equals(vForm.errors('bar').length, 0);
                test.equals(vForm.value('foo'), 'hello');
                test.equals(vForm.value('bar'), 'world');
            }).catch(Form.ValidationError, function () {
                test.ok(false);
            }).lastly(test.done);
    },
    Form_validate_body_2_using_promise: function (test) {
        var form = Form({
            fields: [
                Field({ name: 'foo' }).isEmail(),
                Field({ name: 'bar' }).isLength(3, 6).contains('orl')
            ]
        });
        form.validate({ foo: 'hello@world.com', 'bar': 'world' })
            .then(function (vForm) {
                test.equals(vForm.isValid(), true);
                test.equals(vForm.errors('foo').length, 0);
                test.equals(vForm.errors('bar').length, 0);
                test.equals(vForm.value('foo'), 'hello@world.com');
                test.equals(vForm.value('bar'), 'world');
            }).catch(Form.ValidationError, function () {
                test.ok(false);
            }).lastly(test.done);
    },
    Form_validate_body_3_using_promise: function (test) {
        var form = Form({
            fields: [
                Field({ name: 'foo' }).equals(Field('bar')),
                Field({ name: 'bar' }).isLength(3, 6).contains('orl')
            ]
        });
        form.validate({ foo: 'worldx', 'bar': 'world' })
            .then(function () {
                test.ok(false);
            }).catch(Form.ValidationError, function (err) {
                var vForm = err.form;
                test.equals(vForm.isValid(), false);
                test.equals(vForm.errors('foo')[0], Errors.equals('bar'));
                test.equals(vForm.errors('bar').length, 0);
                test.equals(vForm.value('foo'), 'worldx');
                test.equals(vForm.value('bar'), 'world');
            }).lastly(test.done);
    },
    Form_validate_body_4_using_promise: function (test) {
        var form = Form({
            fields: [
                Field({ name: 'foo' }).equals(Field('bar')),
                Field({ name: 'bar' }).isLength(3, 6).contains('orl')
            ]
        });
        form.validate({ foo: 'world', 'bar': 'world' })
            .then(function (vForm) {
                test.equals(vForm.isValid(), true);
                test.equals(vForm.errors('foo').length, 0);
                test.equals(vForm.errors('bar').length, 0);
                test.equals(vForm.value('foo'), 'world');
                test.equals(vForm.value('bar'), 'world');
            }).catch(Form.ValidationError, function () {
                test.ok(false);
            }).lastly(test.done);
    },
    Form_validate_body_5_using_promise: function (test) {
        var form = Form({
            fields: [
                Field({ name: 'foo' }).trim().equals(Field('bar')),
                Field({ name: 'bar' }).isLength(3, 6).contains('orl')
            ]
        });
        form.validate({ foo: ' world      ', 'bar': 'world' })
            .then(function (vForm) {
                test.equals(vForm.isValid(), true);
                test.equals(vForm.errors('foo').length, 0);
                test.equals(vForm.errors('bar').length, 0);
                test.equals(vForm.value('foo'), 'world');
                test.equals(vForm.value('bar'), 'world');
            }).catch(Form.ValidationError, function () {
                test.ok(false);
            }).lastly(test.done);
    },
    Form_validate_body_with_optional_fields_1_using_promise: function (test) {
        var form = Form({
            fields: [
                Field({ name: 'foo' }).equals(Field('bar')),
                Field({ name: 'bar' }),
                Field({ name: 'boo' }).optional().isEmail()
            ]
        });
        form.validate({ foo: 'hello', 'bar': 'hello' })
            .then(function (vForm) {
                test.equals(vForm.isValid(), true);
                test.equals(vForm.errors('foo').length, 0);
                test.equals(vForm.errors('bar').length, 0);
                test.equals(vForm.value('foo'), 'hello');
                test.equals(vForm.value('bar'), 'hello');
            }).catch(Form.ValidationError, function () {
                test.ok(false);
            }).lastly(test.done);
    },
    Form_validate_body_with_optional_fields_2_using_promise: function (test) {
        var form = Form({
            fields: [
                Field({ name: 'foo' }).equals(Field('bar')),
                Field({ name: 'bar' }),
                Field({ name: 'boo' }).optional().isEmail()
            ]
        });
        form.validate({ foo: 'hello', bar: 'hello', boo: 'hello@world.com' })
            .then(function (vForm) {
                test.equals(vForm.isValid(), true);
                test.equals(vForm.errors('foo').length, 0);
                test.equals(vForm.errors('bar').length, 0);
                test.equals(vForm.value('foo'), 'hello');
                test.equals(vForm.value('bar'), 'hello');
            }).catch(Form.ValidationError, function () {
                test.ok(false);
            }).lastly(test.done);
    },
    Form_validate_body_with_optional_fields_3_using_promise: function (test) {
        var form = Form({
            fields: [
                Field({ name: 'foo' }).equals(Field('bar')),
                Field({ name: 'bar' }).equals(Field('boo')),
                Field({ name: 'boo' }).optional().isEmail()
            ]
        });
        form.validate({ foo: 'hello', bar: 'hello', boo: 'hello' })
            .then(function () {
                test.ok(false);
            }).catch(Form.ValidationError, function (err) {
                var vForm = err.form;
                test.equals(vForm.isValid(), false);
                test.equals(vForm.errors('foo').length, 0);
                test.equals(vForm.errors('bar').length, 0);
                test.equals(vForm.errors('boo')[0], Errors.isEmail);
                test.equals(vForm.value('foo'), 'hello');
                test.equals(vForm.value('bar'), 'hello');
                test.equals(vForm.value('boo'), 'hello');
            }).lastly(test.done);
    },
    Form_validate_body_with_unknown_field_using_promise: function (test) {
        var form = Form({
            fields: [
                Field({ name: 'foo' }).equals(Field('bar')),
                Field({ name: 'bar' }).equals(Field('boo')),
            ]
        });
        form.validate({ foo: 'hello', bar: 'hello', boo: 'hello' })
            .then(function () {
                test.ok(false);
            }).catch(Form.ValidationError, function (err) {
                var vForm = err.form;
                test.equals(vForm.isValid(), false);
                test.equals(vForm.globalErrors()[0], Errors._unknownField);
                test.equals(vForm.errors('foo').length, 0);
                test.equals(vForm.errors('bar').length, 0);
                test.equals(vForm.value('foo'), 'hello');
                test.equals(vForm.value('bar'), 'hello');
            }).lastly(test.done);
    },
    Form_add_simple_validator_using_promise: function (test) {
        Form.addValidator('is42', function (done, v) {
            done(v === '42');
        }, 'error42');

        var form = Form({
            fields: [
                Field({ name: 'foo' }).trim().equals(Field('bar')),
                Field({ name: 'bar' }).is42()
            ]
        });
        form.validate({ foo: ' 42      ', 'bar': '42' })
            .then(function (vForm) {
                test.equals(vForm.isValid(), true);
                test.equals(vForm.errors('foo').length, 0);
                test.equals(vForm.errors('bar').length, 0);
                test.equals(vForm.value('foo'), '42');
                test.equals(vForm.value('bar'), '42');
            }).catch(Form.ValidationError, function () {
                test.ok(false);
            }).lastly(test.done);
    },
    Form_add_simple_validator_2_using_promise: function (test) {
        Form.addValidator('is42', function (done, v) {
            done(v === '42');
        }, 'error42');

        var form = Form({
            fields: [
                Field({ name: 'foo' }).trim().equals(Field('bar')),
                Field({ name: 'bar' }).is42()
            ]
        });
        form.validate({ foo: ' 43      ', 'bar': '43' })
            .then(function () {
                test.ok(false);
            }).catch(Form.ValidationError, function (err) {
                var vForm = err.form;
                test.equals(vForm.isValid(), false);
                test.equals(vForm.errors('foo').length, 0);
                test.equals(vForm.errors('bar'), Errors.is42);
                test.equals(vForm.value('foo'), '43');
                test.equals(vForm.value('bar'), '43');
            }).lastly(test.done);
    },
    Form_add_validator_with_params_using_promise: function (test) {
        Form.addValidator('startsWith', function (done, v, s) {
            done(v[0] === s);
        }, 'errorStartsWith');

        var form = Form({
            fields: [
                Field({ name: 'foo' }).trim().equals(Field('bar')),
                Field({ name: 'bar' }).startsWith('4')
            ]
        });
        form.validate({ foo: ' 42      ', 'bar': '42' })
            .then(function (vForm) {
                test.equals(vForm.isValid(), true);
                test.equals(vForm.errors('foo').length, 0);
                test.equals(vForm.errors('bar').length, 0);
                test.equals(vForm.value('foo'), '42');
                test.equals(vForm.value('bar'), '42');
            }).catch(Form.ValidationError, function () {
                test.ok(false);
            }).lastly(test.done);
    },
    Form_add_validator_with_params_2_using_promise: function (test) {
        Form.addValidator('startsWith', function (done, v, s) {
            done(v[0] === s);
        }, 'errorStartsWith');

        var form = Form({
            fields: [
                Field({ name: 'foo' }).trim().equals(Field('bar')),
                Field({ name: 'bar' }).startsWith('4')
            ]
        });
        form.validate({ foo: ' 69      ', 'bar': '69' })
            .then(function () {
                test.ok(false);
            }).catch(Form.ValidationError, function (err) {
                var vForm = err.form;
                test.equals(vForm.isValid(), false);
                test.equals(vForm.errors('foo').length, 0);
                test.equals(vForm.errors('bar'), Errors.startsWith);
                test.equals(vForm.value('foo'), '69');
                test.equals(vForm.value('bar'), '69');
            }).lastly(test.done);
    },
    Form_with_EmailField_using_promise: function (test) {
        var form = Form({
            fields: [
                EmailField({ name: 'foo' }),
                Field({ name: 'bar' }).isLength(3, 6).contains('orl')
            ]
        });
        form.validate({ foo: 'hello@world.com', 'bar': 'world' })
            .then(function (vForm) {
                test.equals(vForm.isValid(), true);
                test.equals(vForm.errors('foo').length, 0);
                test.equals(vForm.errors('bar').length, 0);
                test.equals(vForm.value('foo'), 'hello@world.com');
                test.equals(vForm.value('bar'), 'world');
            }).catch(Form.ValidationError, function () {
                test.ok(false);
            }).lastly(test.done);
    },
    Form_with_EmailField_2_using_promise: function (test) {
        var form = Form({
            fields: [
                EmailField({ name: 'foo' }),
                Field({ name: 'bar' }).isLength(3, 6).contains('orl')
            ]
        });
        form.validate({ foo: 'hello%world.com', 'bar': 'world' })
            .then(function () {
                test.ok(false);
            }).catch(Form.ValidationError, function (err) {
                var vForm = err.form;
                test.equals(vForm.isValid(), false);
                test.equals(vForm.errors('foo')[0], Errors.isEmail);
                test.equals(vForm.errors('bar').length, 0);
                test.equals(vForm.value('foo'), 'hello%world.com');
                test.equals(vForm.value('bar'), 'world');
            }).lastly(test.done);
    }
};
