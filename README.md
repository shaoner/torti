# torti
Form generator that can be validated, sanitized and extended for node.js

[![npm](https://img.shields.io/npm/v/torti.svg?style=flat-square)](https://www.npmjs.com/package/torti)
[![Travis branch](https://img.shields.io/travis/shaoner/torti/master.svg?style=flat-square)](https://travis-ci.org/shaoner/torti)
[![npm](https://img.shields.io/npm/l/torti.svg?style=flat-square)](https://www.npmjs.com/package/torti)
[![npm](https://img.shields.io/npm/dm/torti.svg?style=flat-square)](https://www.npmjs.com/package/torti)

## Install

```
npm install torti
```

## API

API documentation is [here](lib/README.md)

## Getting started

### 1. [Field](lib/README.md#Field)

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
* By default, each field is required. If you want to make it optional, add the [optional](lib/README.md#Field#optional) validator

It can also be used as Field('fieldname'), which returns a special function.
It is basically a way to delay the evaluation of the field value since it has none for now.

### 2. [Form](lib/README.md#Field)

```javascript
var myForm = Form({ hello: 'world', fields: myFields });
```

* The *fields* property should be an array of [Field](lib/README.md#Field)
* You can also put whatever property you want in the form options. For example, I choose to set a *method* and an *action* property, but these are completely independant from the API.

When you want to validate your data, pass it to the form:

```javascript
var data = {
   email: 'foo@bar.com',
   password: '123456',
   password2: '123456',
};
myForm.validate(data, function (form) {
    console.log(form.isValid());
    /*
      true
    */
    console.log(form.render());
    /*
      {
          hello: 'world',
          fields: [
              { name: 'email', value: 'foo@bar.com', errors: [] },
              { name: 'password', foo: 'bar', value: '123456', errors: [] },
              { name: 'password2', value: '123456', errors: [] },
          ],
          valid: true
      }
    */
    console.log(form.value('email'));
    /*
      foo@bar.com
    */
});
```

### 3. [FieldValidators](lib/README.md#module_FieldValidators)

FieldValidators is a simple object with a string key matching the validator name and its corresponding asynchroneous function.
For now, this object is global and cannot be defined for each Form, however you can add your own global validators using [addValidator](lib/README.md#Form.addValidator).

You can also add your own validator, here are some examples:

```javascript
Form.addValidator('is42', function (done, value) {
    done(value == '42');
}, 'This value should be 42');

Form.addValidator('startsWith', function (done, value, comparison) {
    done(value[0] == comparison);
}, function (comparison) {
    return 'This field should start with ' + comparison;
});

var myFields = [
    Field({ name: 'foo' }).is42(),
    Field({ name: 'bar' }).startsWith('H')
];

```

As you may have noticed, validators are passed:
* A callback to send back a boolean indicating the validation result as well as the modified value if necessary
* The value
* Optional arguments that are passed during the validator call (see *startsWith('H')*)

Sanitizers are almost the same, except that you can update the value:

```javascript
Form.addValidator('toLowerCase', function (done, value) {
    done(true, value.toLowerCase());
});
```

No error was passed for this sanitizer since it just modifies the value, it does not need to check the value consistency here.

But you can also create a validator that actually modifies the value:

```javascript
Form.addValidator('is42andIncrement', function (done, value) {
    done(value == '42', value + 1);
}, 'error42');
```

Since validators are asynchroneous, you can imagine doing database validation:

```javascript
Form.addValidator('isUsernameAvailable', function (done, value) {
    User.find({ username: value }, function (err, user) {
        done(typeof err == 'undefined' && user);
    });
}, 'unavailable');
```

### 4. Predefined fields

You can also use pre-defined fields:
* [EmailField](lib/README.md#EmailField): EmailField(options) ⇒ Field(options).trim().isEmail().normalizeEmail()

### 5. Promises

If you don't provide a callback to validate functions, it returns a promise:

```javascript
myForm.validate(data)
    .then(function (form) {
        console.log('This form is valid!');
    }).catch(Form.ValidationError, function (err) {
        var form = err.form;
        console.log('This form is not valid and contains some validation errors.');
        console.log(form.errors());
    });
```

Take a look at [bluebird](https://github.com/petkaantonov/bluebird) if you're not familiar with promises.

### 6. Rendering

The form is rendered as a javascript object using the [render](lib/README.md#Form#render) method of the Form class.

*Why not HTML?*

Because I think HTML has nothing to do with this part of the code, and displaying a form is up to you.
You may want to display your forms differently according to the page or use JSON.
This allows to customize the way you want to actually render it in your templates.

The form object contains:
* All the properties you passed in the [Form constructor](lib/README.md#new_Form_new).
* A property *errors*, which is an array of global errors.
* A property *valid*, which is a simple boolean saying if the form is valid or not.
* A property *fields* which is an array of field objects.

A field object contains:
* All the properties you passed in the [Field constructor](lib/README.md#new_Field_new).
* A property *name*, which is the name of the field
* A property *value*, which is the value of the field or an empty string
* A property *errors*, which is an array of validation errors

```javascript
var form = Form({
    hello: 'World',
    fields: [
        Field({ name: 'email', foo: 'bar' }).isEmail().lower().isLength(15, 50),
        Field({ name: 'username', bar: 'foo' }).isLength(15, 50)
    ]
});

console.log(form.render());
/*
{
    hello: 'World',
    fields: [
        { name: 'email', foo: 'bar', value: '', errors: [] },
        { name: 'username', bar: 'foo', value: '', errors: [] }
    ],
    valid: true,
    errors: []
}
*/

console.log(form.render({
    email: {
        value: 'shaoner@nomail.com',
        foo: 'notbar'
    }
}));
/*
{
    hello: 'World',
    fields: [
        { name: 'email', foo: 'notbar', value: 'shaoner@nomail.com', errors: [] },
        { name: 'username', bar: 'foo', value: '', errors: [] }
    ],
    valid: true,
    errors: []
}
*/

form.validate({
    email: 'shaoner@nomail.com',
    username: 'foo'
}, function (form) {
    console.log(util.inspect(form.render(), { depth: 3 }));
    /*
    {
        hello: 'World',
        fields: [
            { name: 'email', foo: 'bar', value: 'shaoner@nomail.com', errors: [] },
            { name: 'username', bar: 'foo', value: 'foo', errors: [ 'This should be between 15 and 50 characters' ] }
        ],
        valid: false,
        errors: []
    }
    */
});
```

### 7. Customizing errors

[Errors](lib/README.md#Errors) are mapped in a simple object which keys are the validator names and values are either a string or a function that returns a string.

You can customize errors that way:

```javascript
var Form = require('torti');

// Override some of the error messages
Form.Errors.isEmail = 'Wrong email address';
Form.Errors.isIP = function (version) {
    if (version === 6) {
        return 'Wrong IPv6 address';
    }
    return 'Wrong IP address';
};

// Override all using lodash
Form.Errors = _.merge(Form.Errors, {
    _required:          'This field is required',
    _unknownField:      'Unknown field',
    matches:            'Invalid format',
    isEmail:            'Invalid email address',
    isURL:              'Invalid URL',
    isFQDN:             'Invalid domain name',
    isIP:               'Invalid IP address',
    isAlpha:            'This should only contain alphabetical characters',
    isNumeric:          'This should only contain numerical characters',
    isAlphanumeric:     'This should only contain alphanumerical characters',
    isBase64:           'Invalid base64 value',
    isHexadecimal:      'Invalid hexadecimal value',
    isLowercase:        'This should be lowercase',
    isUppercase:        'This should be uppercase',
    isInt:              'This should be an integer',
    isFloat:            'This should be a float',
    isUUID:             'Invalid uid',
    isDate:             'Invalid date format',
    isIn:               'Invalid choice',
    isCreditCard:       'This is not a valid credit card number',
    isISBN:             'Invalid ISBN',
    isMobilePhone:      'Invalid phone number',
    isJSON:             'JSON is expected',
    isAscii:            'This must contain only ascii characters',
    isMongoId:          'Invalid mongo ObjectId',
    isCurrency:         'Invalid currency',
    equals: function (comparison) {
        return format('It should equal %s', comparison);
    },
    contains: function (seed) {
        return format('It should contain %s', seed);
    },
    isLength: function (min, max) {
        if (arguments.length > 1) {
            return format('This should be between %d and %d characters',
                          min, max);
        }
        return format('This should be at least %d characters', min);
    },
    isByteLength: function (min, max) {
        if (arguments.length > 1) {
            return format('This should be between %d and %d bytes',
                          min, max);
        }
        return format('This should be at least %d bytes', min);
    },
    isAfter: function (date) {
        return format('This should be after %s', date);
    },
    isBefore: function (date) {
        return format('This should be after %s', date);
    }
};

```

## Some examples

### Example 1: Simple

Here we define a simple form with some fields that contain validators and sanity functions.

```javascript
var Form = require('torti');
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
/*
  {
      method: 'POST', action: '/signup', foo: 'bar',
      fields: [
          { name: 'email', value: '', errors: [] },
          { name: 'password', value: '', errors: [] },
          { name: 'password2', value: '', errors: [] },
          { name: 'username', value: '', errors: [] } ],
      valid: true
  }
*/

var body = {
    email: '       foo@bar.com     ',
    password: '123456',
    password2: '123456',
    username: 'Chuck_Norris'
};

signupForm.validate(body, function (form) {
    console.log(form.render());
    /*
      {
          method: 'POST', action: '/signup',
          fields: [
              { name: 'email', value: 'foo@bar.com', errors: [] },
              { name: 'password', value: '123456', errors: [] },
              { name: 'password2', value: '123456', errors: [] },
              { name: 'username' }, value: 'Chuck_Norris', errors: [] ],
          valid: true
      }
    */
    body.username = '$$$$$$';
    form.validate(body, function (form) {
        console.log(form.render());
       /*
         {
             method: 'POST', action: '/signup',
             fields: [
                 { name: 'email', value: 'foo@bar.com', errors: [] },
                 { name: 'password', value: '123456', errors: [] },
                 { name: 'password2', value: '123456', errors: [] },
                 { name: 'username' }, value: '$$$$$$', errors: [ 'Invalid format' ] ],
             valid: false
         }
       */
    });
});

```

### Example 2: With express

```javascript

router.get('/signup', function (req, res, next) {
    res.render('signup', { form: signupForm.render() });
});

router.post('/signup', function (req, res, next) {
    signupForm.validate(req.body, function (form) {
        if (!form.isValid()) {
            res.render('signup', { form: form.render() });
        } else {
            res.end('Welcome ' + form.value('username'));
        }
    });
});

```

### Example 3: Signup/signin with [Express](http://expressjs.com) and [dust](https://github.com/linkedin/dustjs) template engine

#### The partials

First you define a form partial matching our render object.

##### partials/form.dust

```html
{#form}
    <form method="{method}" action="{action}">
        {#fields}
            {>"partials/form-fields/{partial}"/}
            {#errors}
            <div class="errors">{.}</div>
            {/errors}
        {/fields}
        <div>
            <input type="submit" value="{submit}">
        </div>
    </form>
{/form}
```

In partials/form there are html components for each field, here is an example:

##### partials/form-fields/email.dust

```html
Email: <input type="email" name="{name}" id="id_{name}" value="{value}"/>
```

Then, a template for each page:

##### signup.dust

```html
<h1> Signup! </h1>
{>"partials/form" submit="Create your account!"/}
```

##### signin.dust

```html
<h1> Signin! </h1>
{>"partials/form" submit="Log in"/}
```

#### Routes

Finally, you define the forms and the routes:

##### controllers/index.js

```javascript
var Form = require('torti');
var Field = Form.Field;

var signupForm = Form({
    method: 'POST',
    action: '/signup',
    fields: [
        Field({ name: '_csrf', partial: 'csrf' }),
        Field({ name: 'email', partial: 'email', 'autocomplete': 'off' }).trim().isEmail()
        Field({ name: 'password', partial: 'password' }).isLength(6, 25),
        Field({ name: 'password2', partial: 'password' }).equals(Field('password')),
        Field({ name: 'username', partial: 'text' }).matches('[a-zA-Z_]+')
    ]
});

var signinForm = Form({
    method: 'POST',
    action: '/signin',
    fields: [
        Field({ name: 'email', partial: 'email' }).trim().isEmail()
        Field({ name: 'password', partial: 'password' }).isLength(6, 25),
    ]
});

// Signup route
router.route('/signup')
    .get(function (req, res, next) {
        res.render('signup', { form: signupForm.render() });
    })
    .post('/signup', function (req, res, next) {
        signupForm.validate(req.body, function (form) {
            if (!form.isValid()) {
                res.render('signup', { form: form.render() });
            } else {
                // Everything is valid, we register the user
                User.register(form.value(), function (err, user) {
                   if (err) { return next(err); }
                   res.end('Welcome ' + user.username);
                });
            }
        });
    });

// Signin route
router.route('/signin')
    .get('/signin', function (req, res, next) {
        res.render('signup', { form: signinForm.render() });
    })
    .post('/signin', function (req, res, next) {
        signinForm.validate(req.body, function (form) {
            if (!form.isValid()) {
                res.render('signin', { form: form.render() });
            } else {
                // if email matches password
                User.login(form.value(), function (err, user) {
                    if (err) { return next(err); }
                    res.end('You are connected ' + user.username);
                });
            }
       });
    });
```

See how easy and clean?
Notice that with asynchroneous validators, you could check email / username is not already taken.

## Unit tests

```
npm test
```

## Contributing

Contributions are most welcome, so feel free to fork and improve.
