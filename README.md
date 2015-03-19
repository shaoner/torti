# torti
Form generator &amp; validator for node using [validator](https://github.com/chriso/validator.js)

## Install

```
npm install torti
```

## API

Documentation is [here](lib/README.md)

## How it works?

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

signupForm.validate(body, function (vForm) {
    console.log(vForm.render());
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
    vForm.validate(body, function (vForm) {
        console.log(vForm.render());
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
    signupForm.validate(req.body, function (vForm) {
        if (!vForm.isValid()) {
            res.render('signup', { form: vForm.render() });
        } else {
            res.end('Welcome ' + vForm.value('username'));
        }
    });
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
    res.render('signup', { form: signupForm.render() });
});

router.post('/signup', function (req, res, next) {
    signupForm.validate(req.body, function (vForm) {
        if (vForm.isValid() !== true) {
            res.render('signup', { form: vForm.render() });
        } else {
            res.end('Welcome ' + vForm.value('username'));
        }
    });
});
```

##### form.dust
```html
{#form}
    <form method="{method}" action="{action}">
        {>"partials/form/csrf"/}
        {#fields}
            {>"partials/form/{partial}"/}
            {#errors}
            <div>{.}</div>
            {/errors}
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
myForm.validate(data, function (vForm) {
    console.log(vForm.isValid());
    /*
      true
    */
    console.log(vForm.render());
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
    console.log(vForm.value('email'));
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

## Unit tests

```
npm test
```

## Contributing

Contributions are most welcome, so feel free to fork and improve.

## LICENSE

BSD
