var Form = require('../index');
var Field = Form.Field;

module.exports = {
    setUp: function (next) {
        this.testForm = Form({
            fields: [ ]
        });
        next();
    },
    FormRenderer_empty: function (test) {
        var renderer = this.testForm.render();
        test.ok('fields' in renderer);
        test.equals(renderer.fields.length, 0);
        test.done();
    },
    FormRenderer_addField: function (test) {
        var renderer = this.testForm.render();
        renderer.addField(Field( { name: 'foo' }));
        test.equals(renderer.fields.length, 1);
        test.done();
    },
    FormRenderer_setField: function (test) {
        var renderer = this.testForm.render();
        renderer.addField(Field( { name: 'foo' }));
        renderer.setField('foo', 'hello', 'world');
        test.equals(renderer.oFields.foo.hello, 'world');
        test.equals(renderer.fields[0].hello, 'world');
        test.done();
    },
    FormRenderer_value_exists: function (test) {
        var renderer = this.testForm.render();
        renderer.addField(Field( { name: 'foo' }));
        renderer.setValue('foo', 'world');
        test.equals(renderer.value('foo'), 'world');
        test.done();
    },
    FormRenderer_value_does_not_exist: function (test) {
        var renderer = this.testForm.render();
        renderer.addField(Field( { name: 'foo' }));
        test.equals(renderer.value('foo'), null);
        test.done();
    },
    FormRenderer_set_value: function (test) {
        var renderer = this.testForm.render();
        renderer.addField(Field( { name: 'foo' }));
        renderer.setValue('foo', 'bar');
        test.equals(renderer.value('foo'), 'bar');
        test.done();
    },
    FormRenderer_add_global_error: function (test) {
        var renderer = this.testForm.render();
        renderer.addField(Field( { name: 'foo' }));
        renderer.addError(Form.validators._unknownField);
        test.equals(renderer.errors()[0], Form.validators._unknownField);
        test.done();
    },
    FormRenderer_add_multiple_global_errors: function (test) {
        var renderer = this.testForm.render();
        renderer.addField(Field( { name: 'foo' }));
        renderer.addError(Form.validators._unknownField);
        renderer.addError('myerror');
        test.equals(renderer.errors()[0], Form.validators._unknownField);
        test.equals(renderer.errors()[1], 'myerror');
        test.done();
    },

    FormRenderer_add_field_error: function (test) {
        var renderer = this.testForm.render();
        renderer.addField(Field( { name: 'foo' }));
        renderer.addError('foo', Form.validators.isEmail);
        test.equals(renderer.errors('foo')[0], Form.validators.isEmail);
        test.done();
    },
    FormRenderer_add_multiple_field_errors: function (test) {
        var renderer = this.testForm.render();
        renderer.addField(Field( { name: 'foo' }));
        renderer.addError('foo', Form.validators.isEmail);
        renderer.addError('foo', Form.validators.equals);
        renderer.addError('foo', Form.validators.contains);
        test.equals(renderer.errors('foo')[0], Form.validators.isEmail);
        test.equals(renderer.errors('foo')[1], Form.validators.equals);
        test.equals(renderer.errors('foo')[2], Form.validators.contains);
        test.done();
    }
};
