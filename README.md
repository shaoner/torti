# torti
Form generator &amp; validator for node using [validator](https://github.com/chriso/validator.js)

## Install

```
npm install torti
```

## API

Documentation is [here](lib/README.md)

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

Because of how internationalization works in [dust](https://github.com/linkedin/dustjs), I didn't want to put explicit error messages, but you're free to do it.

You can also add your own validator, here is a naive example:

```javascript

Form.addValidator('is42', function (done, value) {
    done(value == '42');
}, 'error42');

Form.addValidator('startsWith', function (done, value, comparison) {
    done(value[0] == comparison);
}, 'errorStartsWith');

var myFields = [
    Field({ name: 'foo' }).is42(),
    Field({ name: 'bar' }).startsWith('H')
];

```

As you may have noticed, validators are passed:
* A callback to send back true or false
* The value
* Optional arguments that are passed during the validator call (see *startsWith('H')*)

Sanitizers are almost the same, except that you can update the value:

```javascript
Form.addValidator('toLowerCase', function (done, value) {
    done(true, value.toLowerCase());
}, 'errorStartsWith');
```

You can also modify the value in your validator:

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
    }, function (form) {
        console.log('This form is not valid and contains some validation errors.');
    });
```

Take a look at [bluebird](https://github.com/petkaantonov/bluebird) if you're not familiar with promises.

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
                 { name: 'username' }, value: '$$$$$$', errors: [ 'format' ] ],
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
        {>"partials/form-fields/csrf"/}
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

## LICENSE

BSD
