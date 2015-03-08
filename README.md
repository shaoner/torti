# torti
Form generator &amp; validator for node using [validator](https://github.com/chriso/validator.js)

## Install

```
npm install torti
```

## How it works?

### Example 1: Simple

Here we define a simple form with some fields that contain validators and sanity functions.

```javascript

var Form = require('torti').Form;
var Field = Form.Field;

var signupForm = Form({
    method: 'POST',
    action: '/signup',
    foo: 'bar',
    fields: [
        Field({ name: 'email' }).trim().isEmail(),
        Field({ name: 'password' }).isLength(6, 25),
        Field({ name: 'password2' }).equals(Field('password')),
        Field({ name: 'username' }).matches('[a-zA-Z_]+')
    ]
});

console.log(signupForm.render());
/* {
     method: 'POST', action: '/signup',
     fields: [
       { name: 'email' },
       { name: 'password' },
       { name: 'password2' },
       { name: 'username' } ],
     oFields: {
       email: { name: 'email' },
       password: { name: 'password' },
       password2: { name: 'password2' },
       name: { name: 'username' }
    },
    valid: true
  }
*/

var body = {
    email: '       foo@bar.com     ',
    password: '123456',
    password2: '123456',
    username: 'Chuck_Norris'
};

console.log(signupForm.validate(body));
/*
 {
     method: 'POST', action: '/signup',
     fields: [
       { name: 'email', value: 'foo@bar.com' },
       { name: 'password', value: '123456' },
       { name: 'password2', value: '123456' },
       { name: 'username' }, value: 'Chuck_Norris' ],
     oFields: {
       email: { name: 'email', value: 'foo@bar.com' },
       password: { name: 'password', value: '123456' },
       password2: { name: 'password2', value: '123456' },
       name: { name: 'username', value: 'Chuck_Norris' }
    },
    valid: true
  }
*/

body.username = '$$$$$$';
console.log(signupForm.validate(body));
/*
 {
     method: 'POST', action: '/signup',
     fields: [
       { name: 'email', value: 'foo@bar.com' },
       { name: 'password', value: '123456' },
       { name: 'password2', value: '123456' },
       { name: 'username' }, value: '$$$$$$', error: 'format' ],
     oFields: {
       email: { name: 'email', value: 'foo@bar.com' },
       password: { name: 'password', value: '123456' },
       password2: { name: 'password2', value: '123456' },
       name: { name: 'username', value: '$$$$$$', error: 'format' }
    },
    valid: false
  }
*/
```

### Example 2: With express

```javascript

router.get('/signup', function (req, res, next) {
    res.render('signup', { form: signupForm.render() });
});

router.post('/signup', function (req, res, next) {
    var renderer = signupForm.validate(req.body);
    if (renderer.valid !== true) {
        res.render('signup', { form: renderer });
    } else {
        res.end('Welcome ' + renderer.oFields.username.value);
    }
});

```

### Example 3: Render a form with [dust](https://github.com/linkedin/dustjs) template engine

##### signup.js
```javascript

// 1. Define your form

var signupForm = Form({
    method: 'POST',
    action: '/signup',
    fields: [
        Field({ name: 'email', partial: 'email', 'autocomplete': 'off' }).trim().isEmail()
        Field({ name: 'password', partial: 'password' }).isLength(6, 25),
        Field({ name: 'password2', partial: 'password' }).equals(Field('password')),
        Field({ name: 'username', partial: 'text' }).matches('[a-zA-Z_]+')    
    ]
});

// [...]

// 2. Use it in your controller
router.get('/signup', function (req, res, next) {
    res.render('signup', { signupForm: signupForm.render() });
});

router.post('/signup', function (req, res, next) {
    var renderer = signupForm.validate(req.body);
    if (renderer.valid !== true) {
        res.render('signup', { signupForm: renderer });
    } else {
        res.end('Welcome ' + renderer.oFields.username.value);
    }
});
```

##### form.dust
```html
{#form}
    <form method="{method}" action="{action}">
        {>"partials/form/csrf"/}
        {#fields}
            {>"partials/form/{partial}"/}
        {/fields}
        <div>
            <input type="submit" value="{submit}">
        </div>
    </form>
{/form}
```

##### signup.dust
```html
<h1> Signup! </h1>
{>"partials/form" form=signupForm submit="Create your account!"/}
```
## Getting started

### 1. [Field](https://github.com/shaoner/torti/blob/master/lib/README.md#Field)

Define your fields, with your own rules

```javascript
var myFields = [
    Field({ name: 'email' }).isEmail(),
    Field({ name: 'password', 'foo': 'bar' }).isLength(6, 50),
    Field({ name: 'password2' }).equals(Field('password'))
];
```

* The *name* property is necessary to be able to retrieve your field
* You can add your own properties in the options as shown in the Field password
* By default, each field is required. If you want to make it optional, add the [optional](https://github.com/shaoner/torti/blob/master/lib/README.md#Field#optional) validator

It can also be used as Field('fieldname'), which returns a special function.
It is basically a way to delay the evaluation of the field value since it has none for now.

### 2. [Form](https://github.com/shaoner/torti/blob/master/lib/README.md#Field)

```javascript
var myForm = Form({ hello: 'world', fields: myFields });
```

* The *fields* property should be an array of Field
* You can also put whatever property you want in the form options

When you want to validate your data, pass it to the form:

```javascript
var data = {
   email: 'foo@bar.com',
   password: '123456',
   password2: '123456',   
};
var renderer = myForm.validate(data);
console.log(renderer.valid); // true
console.log(renderer);
/*
{
    hello: 'world',
    fields: [
        { name: 'email', value: 'foo@bar.com' },
        { name: 'password', foo: 'bar', value: '123456' },
        { name: 'password2', value: '123456' },
    oFields: {
        email: { name: 'email', value: 'foo@bar.com' },
        password: { name: 'password', value: '123456' },
        password2: { name: 'password2', value: '123456' },
    },
    valid: true
}
*/
```

### 3. [FormRenderer](https://github.com/shaoner/torti/blob/master/lib/README.md#FormRenderer)

The FormRenderer is a class which will contain errors and values since we don't want to contaminate the Field and the Form instances which may be reused.
This gives us a very simple object, which contains the fields options, the form options and a Boolean indicating whether the Form is valid or not.
It has nothing to do with HTML, it is up to the template engine to handle this.
However you can define your own FormRenderer with an additional method to display the form and the fields as HTML (but I don't recommand it).

If you want to define your own FormRenderer, take a look at the FormRenderer class, it should have:
* a [addField](https://github.com/shaoner/torti/blob/master/lib/README.md#FormRenderer#addField) method to add a field
* a [setField](https://github.com/shaoner/torti/blob/master/lib/README.md#FormRenderer#setField) method to receive additional field properties (error and value at least)

Notice that you cannot display a Field or a Form, you always display a FormRenderer.

### 4. [FieldValidators](https://github.com/shaoner/torti/blob/master/lib/README.md#module_FieldValidators)

FieldValidators is a simple object with a string key matching a [validator](https://github.com/chriso/validator.js) function and a string value which is an error.
For now, this object is global and cannot be defined for each Form.
However it can be overridden by setting Form.validators to your own object.
Because of how internationalization works in [dust](https://github.com/linkedin/dustjs), I didn't want to put explicit error messages, but you're free to do it.

You can also add your own validator, here is a naive example:

```javascript

Form.addValidator('is42', function (value) {
    return value == '42';
}, 'error42');

Form.addValidator('startsWith', function (value, comparison) {
    return value[0] == comparison;
}, 'errorStartsWith');

var myFields = [
    Field({ name: 'foo' }).is42(),
    Field({ name: 'bar' }).startsWith('H')
];

```

## API

Documentation is [here](https://github.com/shaoner/torti/blob/master/lib/README.md)

## Contributing

Contributions are most welcome, so feel free to fork and improve.

## LICENSE

BSD
