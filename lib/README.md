# API

## Classes
<dl>
<dt><a href="#Field">Field</a></dt>
<dd></dd>
<dt><a href="#EmailField">EmailField</a> ⇐ <code><a href="#Field">Field</a></code></dt>
<dd></dd>
<dt><a href="#Form">Form</a></dt>
<dd></dd>
</dl>
## Members
<dl>
<dt><a href="#Errors">Errors</a> : <code>string</code></dt>
<dd></dd>
<dt><a href="#FieldValidators">FieldValidators</a> : <code><a href="#validateCallback">validateCallback</a></code></dt>
<dd></dd>
</dl>
## Typedefs
<dl>
<dt><a href="#notifyResult">notifyResult</a> : <code>function</code></dt>
<dd></dd>
<dt><a href="#validateCallback">validateCallback</a> ⇒ <code>Boolean</code> | <code>string</code></dt>
<dd></dd>
</dl>
<a name="Field"></a>
## Field
**Kind**: global class  

* [Field](#Field)
  * [new Field(options)](#new_Field_new)
  * [.clone()](#Field#clone) ⇒ <code>[Field](#Field)</code>
  * [.value()](#Field#value)
  * [.setValue(value)](#Field#setValue)
  * [.errors()](#Field#errors) ⇒ <code>string</code>
  * [.addError(error)](#Field#addError)
  * [.optional()](#Field#optional) ⇒ <code>[Field](#Field)</code>
  * [.validate([body], done)](#Field#validate)
  * [.equals(comparison)](#Field#equals) ⇒ <code>[Field](#Field)</code>
  * [.contains(seed)](#Field#contains) ⇒ <code>[Field](#Field)</code>
  * [.matches(pattern, [modifier])](#Field#matches) ⇒ <code>[Field](#Field)</code>
  * [.isEmail([options])](#Field#isEmail) ⇒ <code>[Field](#Field)</code>
  * [.isURL([options])](#Field#isURL) ⇒ <code>[Field](#Field)</code>
  * [.isFQDN([options])](#Field#isFQDN) ⇒ <code>[Field](#Field)</code>
  * [.isIP([version])](#Field#isIP) ⇒ <code>[Field](#Field)</code>
  * [.isAlpha()](#Field#isAlpha) ⇒ <code>[Field](#Field)</code>
  * [.isNumeric()](#Field#isNumeric) ⇒ <code>[Field](#Field)</code>
  * [.isAlphanumeric()](#Field#isAlphanumeric) ⇒ <code>[Field](#Field)</code>
  * [.isBase64()](#Field#isBase64) ⇒ <code>[Field](#Field)</code>
  * [.isHexadecimal()](#Field#isHexadecimal) ⇒ <code>[Field](#Field)</code>
  * [.isHexColor()](#Field#isHexColor) ⇒ <code>[Field](#Field)</code>
  * [.isLowercase()](#Field#isLowercase) ⇒ <code>[Field](#Field)</code>
  * [.isUppercase()](#Field#isUppercase) ⇒ <code>[Field](#Field)</code>
  * [.isInt()](#Field#isInt) ⇒ <code>[Field](#Field)</code>
  * [.isFloat()](#Field#isFloat) ⇒ <code>[Field](#Field)</code>
  * [.isDivisibleBy(num)](#Field#isDivisibleBy) ⇒ <code>[Field](#Field)</code>
  * [.isNull()](#Field#isNull) ⇒ <code>[Field](#Field)</code>
  * [.isLength(min, [max])](#Field#isLength) ⇒ <code>[Field](#Field)</code>
  * [.isByteLength(min, [max])](#Field#isByteLength) ⇒ <code>[Field](#Field)</code>
  * [.isUUID([version])](#Field#isUUID) ⇒ <code>[Field](#Field)</code>
  * [.isDate()](#Field#isDate) ⇒ <code>[Field](#Field)</code>
  * [.isAfter([date])](#Field#isAfter) ⇒ <code>[Field](#Field)</code>
  * [.isBefore([date])](#Field#isBefore) ⇒ <code>[Field](#Field)</code>
  * [.isIn(values)](#Field#isIn) ⇒ <code>[Field](#Field)</code>
  * [.isCreditCard()](#Field#isCreditCard) ⇒ <code>[Field](#Field)</code>
  * [.isISBN([version])](#Field#isISBN) ⇒ <code>[Field](#Field)</code>
  * [.isMobilePhone(local)](#Field#isMobilePhone) ⇒ <code>[Field](#Field)</code>
  * [.isJSON()](#Field#isJSON) ⇒ <code>[Field](#Field)</code>
  * [.isMultibyte()](#Field#isMultibyte) ⇒ <code>[Field](#Field)</code>
  * [.isAscii()](#Field#isAscii) ⇒ <code>[Field](#Field)</code>
  * [.isFullWidth()](#Field#isFullWidth) ⇒ <code>[Field](#Field)</code>
  * [.isHalfWidth()](#Field#isHalfWidth) ⇒ <code>[Field](#Field)</code>
  * [.isVariableWidth()](#Field#isVariableWidth) ⇒ <code>[Field](#Field)</code>
  * [.isSurrogatePair()](#Field#isSurrogatePair) ⇒ <code>[Field](#Field)</code>
  * [.isMongoId()](#Field#isMongoId) ⇒ <code>[Field](#Field)</code>
  * [.isCurrency([options])](#Field#isCurrency) ⇒ <code>[Field](#Field)</code>
  * [.toString()](#Field#toString) ⇒ <code>[Field](#Field)</code>
  * [.toDate()](#Field#toDate) ⇒ <code>[Field](#Field)</code>
  * [.toFloat()](#Field#toFloat) ⇒ <code>[Field](#Field)</code>
  * [.toInt()](#Field#toInt) ⇒ <code>[Field](#Field)</code>
  * [.toBoolean([strict])](#Field#toBoolean) ⇒ <code>[Field](#Field)</code>
  * [.trim([chars])](#Field#trim) ⇒ <code>[Field](#Field)</code>
  * [.ltrim([chars])](#Field#ltrim) ⇒ <code>[Field](#Field)</code>
  * [.rtrim([chars])](#Field#rtrim) ⇒ <code>[Field](#Field)</code>
  * [.escape()](#Field#escape) ⇒ <code>[Field](#Field)</code>
  * [.stripLow([keep_new_lines])](#Field#stripLow) ⇒ <code>[Field](#Field)</code>
  * [.whitelist(chars)](#Field#whitelist) ⇒ <code>[Field](#Field)</code>
  * [.blacklist(chars)](#Field#blacklist) ⇒ <code>[Field](#Field)</code>
  * [.normalizeEmail([options])](#Field#normalizeEmail) ⇒ <code>[Field](#Field)</code>
  * [.capitalize()](#Field#capitalize) ⇒ <code>[Field](#Field)</code>
  * [.trunc([options])](#Field#trunc) ⇒ <code>[Field](#Field)</code>
  * [.lower()](#Field#lower) ⇒ <code>[Field](#Field)</code>
  * [.upper()](#Field#upper) ⇒ <code>[Field](#Field)</code>

<a name="new_Field_new"></a>
### new Field(options)
Form field


| Param | Type | Description |
| --- | --- | --- |
| options | <code>Object</code> \| <code>string</code> | Options or fieldname |

<a name="Field#clone"></a>
### field.clone() ⇒ <code>[Field](#Field)</code>
Clone the current field

**Kind**: instance method of <code>[Field](#Field)</code>  
**Returns**: <code>[Field](#Field)</code> - - The new field  
<a name="Field#value"></a>
### field.value()
Retrieve the field value

**Kind**: instance method of <code>[Field](#Field)</code>  

| Param | Type | Description |
| --- | --- | --- |
|  | <code>\*</code> | The field value |

<a name="Field#setValue"></a>
### field.setValue(value)
Set the field value

**Kind**: instance method of <code>[Field](#Field)</code>  

| Param | Type | Description |
| --- | --- | --- |
| value | <code>\*</code> | The value |

<a name="Field#errors"></a>
### field.errors() ⇒ <code>string</code>
Get the field errors

**Kind**: instance method of <code>[Field](#Field)</code>  
**Returns**: <code>string</code> - - The field error  
<a name="Field#addError"></a>
### field.addError(error)
Add a field error

**Kind**: instance method of <code>[Field](#Field)</code>  

| Param | Type | Description |
| --- | --- | --- |
| error | <code>string</code> | The error |

<a name="Field#optional"></a>
### field.optional() ⇒ <code>[Field](#Field)</code>
Set the field as optional

**Kind**: instance method of <code>[Field](#Field)</code>  
<a name="Field#validate"></a>
### field.validate([body], done)
Validate a field

**Kind**: instance method of <code>[Field](#Field)</code>  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [body] | <code>Object.&lt;string, string&gt;</code> | <code>{}</code> | All form values |
| done | <code>function</code> |  | Callback giving the validation result |

<a name="Field#equals"></a>
### field.equals(comparison) ⇒ <code>[Field](#Field)</code>
Check if the field value equals the comparison

**Kind**: instance method of <code>[Field](#Field)</code>  

| Param | Type | Description |
| --- | --- | --- |
| comparison | <code>string</code> \| <code>function</code> | The value compared |

<a name="Field#contains"></a>
### field.contains(seed) ⇒ <code>[Field](#Field)</code>
Check if the field value contains the seed

**Kind**: instance method of <code>[Field](#Field)</code>  

| Param | Type | Description |
| --- | --- | --- |
| seed | <code>string</code> | The seed |

<a name="Field#matches"></a>
### field.matches(pattern, [modifier]) ⇒ <code>[Field](#Field)</code>
Check if the field value matches the pattern

**Kind**: instance method of <code>[Field](#Field)</code>  

| Param | Type | Description |
| --- | --- | --- |
| pattern | <code>string</code> \| <code>RegExp</code> | The pattern to match |
| [modifier] | <code>string</code> | The pattern modifier ('i', etc) |

<a name="Field#isEmail"></a>
### field.isEmail([options]) ⇒ <code>[Field](#Field)</code>
Check if the field value is an email address

**Kind**: instance method of <code>[Field](#Field)</code>  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [options] | <code>Object</code> | <code>{ allow_display_name: false }</code> | If allow_display_name is set to true, the validator will also match 'Name <email>' |

<a name="Field#isURL"></a>
### field.isURL([options]) ⇒ <code>[Field](#Field)</code>
Check if the field value is an URL

**Kind**: instance method of <code>[Field](#Field)</code>  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [options] | <code>Object</code> | <code>{ protocols: [&#x27;http&#x27;,&#x27;https&#x27;,&#x27;ftp&#x27;], require_tld: true, require_protocol: false, allow_underscores: false, host_whitelist: false, host_blacklist: false, allow_trailing_dot: false, allow_protocol_relative_urls: false }</code> | Options |

<a name="Field#isFQDN"></a>
### field.isFQDN([options]) ⇒ <code>[Field](#Field)</code>
Check if the field value is a fully qualified domain name

**Kind**: instance method of <code>[Field](#Field)</code>  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [options] | <code>Object</code> | <code>{ require_tld: true, allow_underscores: false, allow_trailing_dot: false }</code> | Options |

<a name="Field#isIP"></a>
### field.isIP([version]) ⇒ <code>[Field](#Field)</code>
Check if the field value is an IP address

**Kind**: instance method of <code>[Field](#Field)</code>  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [version] | <code>Number</code> | <code>4</code> | Version of the ip protocol (4 or 6) |

<a name="Field#isAlpha"></a>
### field.isAlpha() ⇒ <code>[Field](#Field)</code>
Check if the field value contains only letters (a-zA-Z)

**Kind**: instance method of <code>[Field](#Field)</code>  
<a name="Field#isNumeric"></a>
### field.isNumeric() ⇒ <code>[Field](#Field)</code>
Check if the field value contains only numbers (0-9)

**Kind**: instance method of <code>[Field](#Field)</code>  
<a name="Field#isAlphanumeric"></a>
### field.isAlphanumeric() ⇒ <code>[Field](#Field)</code>
Check if the field value contains only letters and numbers (a-zA-Z0-9)

**Kind**: instance method of <code>[Field](#Field)</code>  
<a name="Field#isBase64"></a>
### field.isBase64() ⇒ <code>[Field](#Field)</code>
Check if the field value is base64 encoded

**Kind**: instance method of <code>[Field](#Field)</code>  
<a name="Field#isHexadecimal"></a>
### field.isHexadecimal() ⇒ <code>[Field](#Field)</code>
Check if the field value is a hexadecimal number

**Kind**: instance method of <code>[Field](#Field)</code>  
<a name="Field#isHexColor"></a>
### field.isHexColor() ⇒ <code>[Field](#Field)</code>
Check if the field value is a hexadecimal color

**Kind**: instance method of <code>[Field](#Field)</code>  
<a name="Field#isLowercase"></a>
### field.isLowercase() ⇒ <code>[Field](#Field)</code>
Check if the field value is lowercase

**Kind**: instance method of <code>[Field](#Field)</code>  
<a name="Field#isUppercase"></a>
### field.isUppercase() ⇒ <code>[Field](#Field)</code>
Check if the field value is a uppercase

**Kind**: instance method of <code>[Field](#Field)</code>  
<a name="Field#isInt"></a>
### field.isInt() ⇒ <code>[Field](#Field)</code>
Check if the field value is an integer

**Kind**: instance method of <code>[Field](#Field)</code>  
<a name="Field#isFloat"></a>
### field.isFloat() ⇒ <code>[Field](#Field)</code>
Check if the field value is a float

**Kind**: instance method of <code>[Field](#Field)</code>  
<a name="Field#isDivisibleBy"></a>
### field.isDivisibleBy(num) ⇒ <code>[Field](#Field)</code>
Check if the field value is divisible by number

**Kind**: instance method of <code>[Field](#Field)</code>  

| Param | Type | Description |
| --- | --- | --- |
| num | <code>Number</code> | The denominator |

<a name="Field#isNull"></a>
### field.isNull() ⇒ <code>[Field](#Field)</code>
Check if the field value is a null string

**Kind**: instance method of <code>[Field](#Field)</code>  
<a name="Field#isLength"></a>
### field.isLength(min, [max]) ⇒ <code>[Field](#Field)</code>
Check if the field value's length falls in a range. Note: this function takes into account surrogate pairs.

**Kind**: instance method of <code>[Field](#Field)</code>  

| Param | Type | Description |
| --- | --- | --- |
| min | <code>Number</code> | The minimal value or the max if not provided |
| [max] | <code>Number</code> | The maximal value |

<a name="Field#isByteLength"></a>
### field.isByteLength(min, [max]) ⇒ <code>[Field](#Field)</code>
Check if the field value's length (in bytes) falls in a range.

**Kind**: instance method of <code>[Field](#Field)</code>  

| Param | Type | Description |
| --- | --- | --- |
| min | <code>Number</code> | The minimal value or the max if not provided |
| [max] | <code>Number</code> | The maximal value |

<a name="Field#isUUID"></a>
### field.isUUID([version]) ⇒ <code>[Field](#Field)</code>
Check if the field value is a UUID

**Kind**: instance method of <code>[Field](#Field)</code>  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [version] | <code>Number</code> | <code>3</code> | The UUID version (3, 4 or 5) |

<a name="Field#isDate"></a>
### field.isDate() ⇒ <code>[Field](#Field)</code>
Check if the field value is a date

**Kind**: instance method of <code>[Field](#Field)</code>  
<a name="Field#isAfter"></a>
### field.isAfter([date]) ⇒ <code>[Field](#Field)</code>
Check if the field value is a date that's after the specified date (defaults to now)

**Kind**: instance method of <code>[Field](#Field)</code>  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [date] | <code>Date</code> | <code>now</code> | The date supposely after |

<a name="Field#isBefore"></a>
### field.isBefore([date]) ⇒ <code>[Field](#Field)</code>
Check if the field value is a date that's after the specified date (defaults to now)

**Kind**: instance method of <code>[Field](#Field)</code>  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [date] | <code>Date</code> | <code>now</code> | The date supposely before |

<a name="Field#isIn"></a>
### field.isIn(values) ⇒ <code>[Field](#Field)</code>
Check if the field value is in a array of allowed values

**Kind**: instance method of <code>[Field](#Field)</code>  

| Param | Type | Description |
| --- | --- | --- |
| values | <code>Array.&lt;\*&gt;</code> | The list of values |

<a name="Field#isCreditCard"></a>
### field.isCreditCard() ⇒ <code>[Field](#Field)</code>
Check if the field value is a credit card

**Kind**: instance method of <code>[Field](#Field)</code>  
<a name="Field#isISBN"></a>
### field.isISBN([version]) ⇒ <code>[Field](#Field)</code>
Check if the field value is an ISBN

**Kind**: instance method of <code>[Field](#Field)</code>  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [version] | <code>Number</code> | <code>10</code> | ISBN version (10 or 13) |

<a name="Field#isMobilePhone"></a>
### field.isMobilePhone(local) ⇒ <code>[Field](#Field)</code>
Check if the field value is a mobile phone number

**Kind**: instance method of <code>[Field](#Field)</code>  

| Param | Type | Description |
| --- | --- | --- |
| local | <code>string</code> | 'zh-CN', 'en-ZA', 'en-AU', 'en-HK', 'pt-PT', 'fr-FR', 'el-GR' |

<a name="Field#isJSON"></a>
### field.isJSON() ⇒ <code>[Field](#Field)</code>
Check if the field value is valid JSON

**Kind**: instance method of <code>[Field](#Field)</code>  
<a name="Field#isMultibyte"></a>
### field.isMultibyte() ⇒ <code>[Field](#Field)</code>
Check if the field value contains one or more multibyte chars

**Kind**: instance method of <code>[Field](#Field)</code>  
<a name="Field#isAscii"></a>
### field.isAscii() ⇒ <code>[Field](#Field)</code>
Check if the field value contains only ASCII chars

**Kind**: instance method of <code>[Field](#Field)</code>  
<a name="Field#isFullWidth"></a>
### field.isFullWidth() ⇒ <code>[Field](#Field)</code>
Check if the field value contains any full-width chars

**Kind**: instance method of <code>[Field](#Field)</code>  
<a name="Field#isHalfWidth"></a>
### field.isHalfWidth() ⇒ <code>[Field](#Field)</code>
Check if the field value contains any half-width chars

**Kind**: instance method of <code>[Field](#Field)</code>  
<a name="Field#isVariableWidth"></a>
### field.isVariableWidth() ⇒ <code>[Field](#Field)</code>
Check if the field value contains a mixture of full and half-width chars

**Kind**: instance method of <code>[Field](#Field)</code>  
<a name="Field#isSurrogatePair"></a>
### field.isSurrogatePair() ⇒ <code>[Field](#Field)</code>
Check if the field value contains any surrogate pairs chars

**Kind**: instance method of <code>[Field](#Field)</code>  
<a name="Field#isMongoId"></a>
### field.isMongoId() ⇒ <code>[Field](#Field)</code>
Check if the field value a valid hex-encoded representation of a MongoDB ObjectId

**Kind**: instance method of <code>[Field](#Field)</code>  
<a name="Field#isCurrency"></a>
### field.isCurrency([options]) ⇒ <code>[Field](#Field)</code>
Check if the field value is a valid currency amount

**Kind**: instance method of <code>[Field](#Field)</code>  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [options] | <code>Object</code> | <code>{symbol: &#x27;$&#x27;, require_symbol: false, allow_space_after_symbol: false, symbol_after_digits: false, allow_negatives: true, parens_for_negatives: false, negative_sign_before_digits: false, negative_sign_after_digits: false, allow_negative_sign_placeholder: false, thousands_separator: &#x27;,&#x27;, decimal_separator: &#x27;.&#x27;, allow_space_after_digits: false }</code> | Options |

<a name="Field#toString"></a>
### field.toString() ⇒ <code>[Field](#Field)</code>
Convert the field value to a string

**Kind**: instance method of <code>[Field](#Field)</code>  
<a name="Field#toDate"></a>
### field.toDate() ⇒ <code>[Field](#Field)</code>
Convert the field value to a date

**Kind**: instance method of <code>[Field](#Field)</code>  
<a name="Field#toFloat"></a>
### field.toFloat() ⇒ <code>[Field](#Field)</code>
Convert the field value to a float

**Kind**: instance method of <code>[Field](#Field)</code>  
<a name="Field#toInt"></a>
### field.toInt() ⇒ <code>[Field](#Field)</code>
Convert the field value to an integer

**Kind**: instance method of <code>[Field](#Field)</code>  
<a name="Field#toBoolean"></a>
### field.toBoolean([strict]) ⇒ <code>[Field](#Field)</code>
Convert the field value to a boolean

**Kind**: instance method of <code>[Field](#Field)</code>  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [strict] | <code>Boolean</code> | <code>false</code> | If set to true, only '1' and 'true' return true |

<a name="Field#trim"></a>
### field.trim([chars]) ⇒ <code>[Field](#Field)</code>
Trim characters from both sides of the field value

**Kind**: instance method of <code>[Field](#Field)</code>  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [chars] | <code>string</code> | <code>&quot;&#x27; &#x27;&quot;</code> | characters to trim |

<a name="Field#ltrim"></a>
### field.ltrim([chars]) ⇒ <code>[Field](#Field)</code>
Trim characters from left-side of the field value

**Kind**: instance method of <code>[Field](#Field)</code>  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [chars] | <code>string</code> | <code>&quot;&#x27; &#x27;&quot;</code> | characters to trim |

<a name="Field#rtrim"></a>
### field.rtrim([chars]) ⇒ <code>[Field](#Field)</code>
Trim characters from right-side of the field value

**Kind**: instance method of <code>[Field](#Field)</code>  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [chars] | <code>string</code> | <code>&quot;&#x27; &#x27;&quot;</code> | characters to trim |

<a name="Field#escape"></a>
### field.escape() ⇒ <code>[Field](#Field)</code>
Replace <, >, &, ', " and / with HTML entities

**Kind**: instance method of <code>[Field](#Field)</code>  
<a name="Field#stripLow"></a>
### field.stripLow([keep_new_lines]) ⇒ <code>[Field](#Field)</code>
Remove characters with a numerical value < 32 and > 127, mostly control characters.

**Kind**: instance method of <code>[Field](#Field)</code>  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [keep_new_lines] | <code>Boolean</code> | <code>false</code> | If true, newline chars are preserved |

<a name="Field#whitelist"></a>
### field.whitelist(chars) ⇒ <code>[Field](#Field)</code>
Remove characters that do not appear in the whitelist

**Kind**: instance method of <code>[Field](#Field)</code>  

| Param | Type | Description |
| --- | --- | --- |
| chars | <code>string</code> | whitelist characters |

<a name="Field#blacklist"></a>
### field.blacklist(chars) ⇒ <code>[Field](#Field)</code>
Remove characters that appear in the blacklist

**Kind**: instance method of <code>[Field](#Field)</code>  

| Param | Type | Description |
| --- | --- | --- |
| chars | <code>string</code> | blacklist characters |

<a name="Field#normalizeEmail"></a>
### field.normalizeEmail([options]) ⇒ <code>[Field](#Field)</code>
Convert the field value to a string
With lowercase set to true, the local part of the email address is lowercased for all domains; the hostname is always lowercased and the local part of the email address is always lowercased for hosts that are known to be case-insensitive (currently only GMail). Normalization follows special rules for known providers: currently, GMail addresses have dots removed in the local part and are stripped of tags (e.g. some.one+tag@gmail.com becomes someone@gmail.com) and all @googlemail.com addresses are normalized to @gmail.com.

**Kind**: instance method of <code>[Field](#Field)</code>  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [options] | <code>Object</code> | <code>{ lowercase: true }</code> | Options |

<a name="Field#capitalize"></a>
### field.capitalize() ⇒ <code>[Field](#Field)</code>
Capitalize the field value

**Kind**: instance method of <code>[Field](#Field)</code>  
<a name="Field#trunc"></a>
### field.trunc([options]) ⇒ <code>[Field](#Field)</code>
Truncate the field value

**Kind**: instance method of <code>[Field](#Field)</code>  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [options] | <code>Object</code> \| <code>Number</code> |  | Options or the maximum value length |
| [options.length] | <code>Number</code> | <code>30</code> | The maximum value length |
| [options.omission] | <code>string</code> | <code>&quot;&#x27;...&#x27;&quot;</code> | The string to indicate text is omitted |
| [options.separator] | <code>RegExp</code> \| <code>string</code> |  | The separator pattern to truncate to |

<a name="Field#lower"></a>
### field.lower() ⇒ <code>[Field](#Field)</code>
Convert the field value to lowercase

**Kind**: instance method of <code>[Field](#Field)</code>  
<a name="Field#upper"></a>
### field.upper() ⇒ <code>[Field](#Field)</code>
Convert the field value to uppercase

**Kind**: instance method of <code>[Field](#Field)</code>  
<a name="EmailField"></a>
## EmailField ⇐ <code>[Field](#Field)</code>
**Extends:** <code>[Field](#Field)</code>  
**Kind**: global class  

* [EmailField](#EmailField) ⇐ <code>[Field](#Field)</code>
  * [new EmailField(options)](#new_EmailField_new)
  * [.clone()](#Field#clone) ⇒ <code>[Field](#Field)</code>
  * [.value()](#Field#value)
  * [.setValue(value)](#Field#setValue)
  * [.errors()](#Field#errors) ⇒ <code>string</code>
  * [.addError(error)](#Field#addError)
  * [.optional()](#Field#optional) ⇒ <code>[Field](#Field)</code>
  * [.validate([body], done)](#Field#validate)
  * [.equals(comparison)](#Field#equals) ⇒ <code>[Field](#Field)</code>
  * [.contains(seed)](#Field#contains) ⇒ <code>[Field](#Field)</code>
  * [.matches(pattern, [modifier])](#Field#matches) ⇒ <code>[Field](#Field)</code>
  * [.isEmail([options])](#Field#isEmail) ⇒ <code>[Field](#Field)</code>
  * [.isURL([options])](#Field#isURL) ⇒ <code>[Field](#Field)</code>
  * [.isFQDN([options])](#Field#isFQDN) ⇒ <code>[Field](#Field)</code>
  * [.isIP([version])](#Field#isIP) ⇒ <code>[Field](#Field)</code>
  * [.isAlpha()](#Field#isAlpha) ⇒ <code>[Field](#Field)</code>
  * [.isNumeric()](#Field#isNumeric) ⇒ <code>[Field](#Field)</code>
  * [.isAlphanumeric()](#Field#isAlphanumeric) ⇒ <code>[Field](#Field)</code>
  * [.isBase64()](#Field#isBase64) ⇒ <code>[Field](#Field)</code>
  * [.isHexadecimal()](#Field#isHexadecimal) ⇒ <code>[Field](#Field)</code>
  * [.isHexColor()](#Field#isHexColor) ⇒ <code>[Field](#Field)</code>
  * [.isLowercase()](#Field#isLowercase) ⇒ <code>[Field](#Field)</code>
  * [.isUppercase()](#Field#isUppercase) ⇒ <code>[Field](#Field)</code>
  * [.isInt()](#Field#isInt) ⇒ <code>[Field](#Field)</code>
  * [.isFloat()](#Field#isFloat) ⇒ <code>[Field](#Field)</code>
  * [.isDivisibleBy(num)](#Field#isDivisibleBy) ⇒ <code>[Field](#Field)</code>
  * [.isNull()](#Field#isNull) ⇒ <code>[Field](#Field)</code>
  * [.isLength(min, [max])](#Field#isLength) ⇒ <code>[Field](#Field)</code>
  * [.isByteLength(min, [max])](#Field#isByteLength) ⇒ <code>[Field](#Field)</code>
  * [.isUUID([version])](#Field#isUUID) ⇒ <code>[Field](#Field)</code>
  * [.isDate()](#Field#isDate) ⇒ <code>[Field](#Field)</code>
  * [.isAfter([date])](#Field#isAfter) ⇒ <code>[Field](#Field)</code>
  * [.isBefore([date])](#Field#isBefore) ⇒ <code>[Field](#Field)</code>
  * [.isIn(values)](#Field#isIn) ⇒ <code>[Field](#Field)</code>
  * [.isCreditCard()](#Field#isCreditCard) ⇒ <code>[Field](#Field)</code>
  * [.isISBN([version])](#Field#isISBN) ⇒ <code>[Field](#Field)</code>
  * [.isMobilePhone(local)](#Field#isMobilePhone) ⇒ <code>[Field](#Field)</code>
  * [.isJSON()](#Field#isJSON) ⇒ <code>[Field](#Field)</code>
  * [.isMultibyte()](#Field#isMultibyte) ⇒ <code>[Field](#Field)</code>
  * [.isAscii()](#Field#isAscii) ⇒ <code>[Field](#Field)</code>
  * [.isFullWidth()](#Field#isFullWidth) ⇒ <code>[Field](#Field)</code>
  * [.isHalfWidth()](#Field#isHalfWidth) ⇒ <code>[Field](#Field)</code>
  * [.isVariableWidth()](#Field#isVariableWidth) ⇒ <code>[Field](#Field)</code>
  * [.isSurrogatePair()](#Field#isSurrogatePair) ⇒ <code>[Field](#Field)</code>
  * [.isMongoId()](#Field#isMongoId) ⇒ <code>[Field](#Field)</code>
  * [.isCurrency([options])](#Field#isCurrency) ⇒ <code>[Field](#Field)</code>
  * [.toString()](#Field#toString) ⇒ <code>[Field](#Field)</code>
  * [.toDate()](#Field#toDate) ⇒ <code>[Field](#Field)</code>
  * [.toFloat()](#Field#toFloat) ⇒ <code>[Field](#Field)</code>
  * [.toInt()](#Field#toInt) ⇒ <code>[Field](#Field)</code>
  * [.toBoolean([strict])](#Field#toBoolean) ⇒ <code>[Field](#Field)</code>
  * [.trim([chars])](#Field#trim) ⇒ <code>[Field](#Field)</code>
  * [.ltrim([chars])](#Field#ltrim) ⇒ <code>[Field](#Field)</code>
  * [.rtrim([chars])](#Field#rtrim) ⇒ <code>[Field](#Field)</code>
  * [.escape()](#Field#escape) ⇒ <code>[Field](#Field)</code>
  * [.stripLow([keep_new_lines])](#Field#stripLow) ⇒ <code>[Field](#Field)</code>
  * [.whitelist(chars)](#Field#whitelist) ⇒ <code>[Field](#Field)</code>
  * [.blacklist(chars)](#Field#blacklist) ⇒ <code>[Field](#Field)</code>
  * [.normalizeEmail([options])](#Field#normalizeEmail) ⇒ <code>[Field](#Field)</code>
  * [.capitalize()](#Field#capitalize) ⇒ <code>[Field](#Field)</code>
  * [.trunc([options])](#Field#trunc) ⇒ <code>[Field](#Field)</code>
  * [.lower()](#Field#lower) ⇒ <code>[Field](#Field)</code>
  * [.upper()](#Field#upper) ⇒ <code>[Field](#Field)</code>

<a name="new_EmailField_new"></a>
### new EmailField(options)
Form email field


| Param | Type | Description |
| --- | --- | --- |
| options | <code>Object</code> | Options |

<a name="Form"></a>
## Form
**Kind**: global class  

* [Form](#Form)
  * [new Form(options)](#new_Form_new)
  * _instance_
    * [.clone()](#Form#clone) ⇒ <code>[Form](#Form)</code>
    * [.addField(field)](#Form#addField)
    * [.setField(fieldName, key, value)](#Form#setField)
    * [.setValue(fieldName, value)](#Form#setValue)
    * [.value([fieldName])](#Form#value) ⇒ <code>string</code>
    * [.addError(fieldName, error)](#Form#addError)
    * [.errors([fieldName])](#Form#errors) ⇒ <code>Array.&lt;string&gt;</code> \| <code>Object.&lt;string, Array.&lt;string&gt;&gt;</code>
    * [.addGlobalError(error)](#Form#addGlobalError)
    * [.globalErrors()](#Form#globalErrors) ⇒ <code>Array.&lt;string&gt;</code>
    * [.refresh()](#Form#refresh)
    * [.get(fieldName)](#Form#get) ⇒ <code>[Field](#Field)</code>
    * [.isValid()](#Form#isValid) ⇒ <code>Boolean</code>
    * [.validate([...body], done)](#Form#validate)
    * [.render([refresh])](#Form#render) ⇒ <code>Object.&lt;string, \*&gt;</code>
    * [.renderWith(values)](#Form#renderWith) ⇒ <code>Object.&lt;string, \*&gt;</code>
  * _static_
    * [.validators](#Form.validators) : <code>Object.&lt;string, ?string&gt;</code>
    * [.addValidator(name, fn, error)](#Form.addValidator)

<a name="new_Form_new"></a>
### new Form(options)
Form


| Param | Type | Description |
| --- | --- | --- |
| options | <code>Object</code> | Options |

<a name="Form#clone"></a>
### form.clone() ⇒ <code>[Form](#Form)</code>
Clone the current form

**Kind**: instance method of <code>[Form](#Form)</code>  
**Returns**: <code>[Form](#Form)</code> - - the new form  
<a name="Form#addField"></a>
### form.addField(field)
Add a new field

**Kind**: instance method of <code>[Form](#Form)</code>  

| Param | Type | Description |
| --- | --- | --- |
| field | <code>[Field](#Field)</code> | A field instance |

<a name="Form#setField"></a>
### form.setField(fieldName, key, value)
Set a field property

**Kind**: instance method of <code>[Form](#Form)</code>  

| Param | Type | Description |
| --- | --- | --- |
| fieldName | <code>string</code> | A field name |
| key | <code>string</code> | The property name to set |
| value | <code>string</code> | The value to set |

<a name="Form#setValue"></a>
### form.setValue(fieldName, value)
Set a field value

**Kind**: instance method of <code>[Form](#Form)</code>  

| Param | Type | Description |
| --- | --- | --- |
| fieldName | <code>string</code> | A field name |
| value | <code>string</code> | A value |

<a name="Form#value"></a>
### form.value([fieldName]) ⇒ <code>string</code>
Retrieve a field value or each value as a map if fieldName is not provided

**Kind**: instance method of <code>[Form](#Form)</code>  

| Param | Type | Description |
| --- | --- | --- |
| [fieldName] | <code>string</code> | A field name |

<a name="Form#addError"></a>
### form.addError(fieldName, error)
Add a field error

**Kind**: instance method of <code>[Form](#Form)</code>  

| Param | Type | Description |
| --- | --- | --- |
| fieldName | <code>string</code> | A field name |
| error | <code>string</code> | The error |

<a name="Form#errors"></a>
### form.errors([fieldName]) ⇒ <code>Array.&lt;string&gt;</code> \| <code>Object.&lt;string, Array.&lt;string&gt;&gt;</code>
Retrieve a field error or all errors as a map if fieldName is not provided

**Kind**: instance method of <code>[Form](#Form)</code>  

| Param | Type | Description |
| --- | --- | --- |
| [fieldName] | <code>string</code> | A field name |

<a name="Form#addGlobalError"></a>
### form.addGlobalError(error)
Add a non field specific error

**Kind**: instance method of <code>[Form](#Form)</code>  

| Param | Type | Description |
| --- | --- | --- |
| error | <code>string</code> | The global error |

<a name="Form#globalErrors"></a>
### form.globalErrors() ⇒ <code>Array.&lt;string&gt;</code>
Get non field specific errors

**Kind**: instance method of <code>[Form](#Form)</code>  
**Returns**: <code>Array.&lt;string&gt;</code> - - The global errors  
<a name="Form#refresh"></a>
### form.refresh()
Reset the render object

**Kind**: instance method of <code>[Form](#Form)</code>  
<a name="Form#get"></a>
### form.get(fieldName) ⇒ <code>[Field](#Field)</code>
Get a field from its name

**Kind**: instance method of <code>[Form](#Form)</code>  

| Param | Type | Description |
| --- | --- | --- |
| fieldName | <code>string</code> | The name of the field |

<a name="Form#isValid"></a>
### form.isValid() ⇒ <code>Boolean</code>
Check if the form is valid

**Kind**: instance method of <code>[Form](#Form)</code>  
<a name="Form#validate"></a>
### form.validate([...body], done)
Validate a complete form and returns a new populated form

**Kind**: instance method of <code>[Form](#Form)</code>  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [...body] | <code>Object.&lt;string, \*&gt;</code> | <code>{}</code> | Body matching the form |
| done | <code>function</code> |  | Callback sending the new form |

<a name="Form#render"></a>
### form.render([refresh]) ⇒ <code>Object.&lt;string, \*&gt;</code>
Get the associated form object

**Kind**: instance method of <code>[Form](#Form)</code>  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [refresh] | <code>Boolean</code> | <code>false</code> | If true, the form object is rebuilt |

<a name="Form#renderWith"></a>
### form.renderWith(values) ⇒ <code>Object.&lt;string, \*&gt;</code>
Get the associated form object populated with values

**Kind**: instance method of <code>[Form](#Form)</code>  

| Param | Type | Description |
| --- | --- | --- |
| values | <code>Object.&lt;string, \*&gt;</code> | Values in the form of { fieldName: fieldValue } |

<a name="Form.validators"></a>
### Form.validators : <code>Object.&lt;string, ?string&gt;</code>
List of validators / error messages

**Kind**: static property of <code>[Form](#Form)</code>  
<a name="Form.addValidator"></a>
### Form.addValidator(name, fn, error)
Add a new validator

**Kind**: static method of <code>[Form](#Form)</code>  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | Name of the validator |
| fn | <code>[validateCallback](#validateCallback)</code> | The validator callback |
| error | <code>string</code> | The error message |

<a name="Errors"></a>
## Errors : <code>string</code>
**Kind**: global enum  
<a name="FieldValidators"></a>
## FieldValidators : <code>[validateCallback](#validateCallback)</code>
**Kind**: global enum  
<a name="notifyResult"></a>
## notifyResult : <code>function</code>
**Kind**: global typedef  

| Param | Type | Description |
| --- | --- | --- |
| result | <code>Boolean</code> | The result of the validation |
| [value] | <code>\*</code> | The new value of the field |

<a name="validateCallback"></a>
## validateCallback ⇒ <code>Boolean</code> \| <code>string</code>
**Kind**: global typedef  

| Param | Type | Description |
| --- | --- | --- |
| done | <code>[notifyResult](#notifyResult)</code> | Callback to send back the result |
| value | <code>string</code> | Field's value |
| [args] | <code>\*</code> | Validator arguments |

