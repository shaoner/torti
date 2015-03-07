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
        test.ok('oFields' in renderer);
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
    }
};
