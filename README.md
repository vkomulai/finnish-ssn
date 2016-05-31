Finnish SSN validation and creation
===================================

[![Build Status](https://travis-ci.org/vkomulai/finnish-ssn.svg?branch=master)](https://travis-ci.org/vkomulai/finnish-ssn) ![0 deps](https://david-dm.org/vkomulai/finnish-ssn.svg) ![Downloads](https://img.shields.io/npm/dt/finnish-ssn.svg) ![License](https://img.shields.io/npm/l/finnish-ssn.svg)





- A micro Javascript library for validating and creating Finnish social security numbers
- Lightweight, 1.5kB
- No dependencies
- Vanilla JS (ES5)

Installation
------------

NPM

```sh
npm install finnish-ssn
```

Bower

```sh
bower install finnish-ssn
```

From npmcdn.com

```html
<script src="https://npmcdn.com/finnish-ssn/finnish-ssn.min.js"></script>
```


Usage
-----

Node.js

``` js
var FinnishSSN = require('finnish-ssn');
var isValid = FinnishSSN.validate('010101-100X');
console.log(isValid);
//  Yields true

```

Web: Writes FinnishSSN into global namespace.

``` html
<script src="finnish-ssn.min.js"></script>
<script>
  // This is valid SSN
  var isValid = FinnishSSN.validate('290296-7808');
  console.log(isValid);
  //  Yields true
</script>

```

Examples
--------

Validate an SSN

``` js
//  This is valid SSN
console.log('valid ssn returns ' + FinnishSSN.validate('290296-7808'));
//  This is invalid SSN
console.log('invalid ssn returns ' + FinnishSSN.validate('010198-1000'));
```

yields

```
valid ssn returns true
invalid ssn returns false
```

Parse SSN

``` js
//  This is valid SSN
var parsedSsn =  FinnishSSN.parse('290296-7808'));
//  This is invalid SSN
console.log(parsedSsn);
```

yields

```js
{
  valid: true,
  sex: 'female',
  ageInYears: 19,
  dateOfBirth: Thu Feb 29 1996 00:00:00 GMT+0200 (EET)
}
```

Create an SSN for person that is 20 years old.

``` js
console.log('SSN for person that is 20 years old ' + FinnishSSN.createWithAge(20));
```

yields

```
# Valid SSN, where XXXX is a random string with valid checksum.
SSN for person that is 20 years old 010195-XXXX
```

Functions
---------

### #validate(ssn)

- Validates parameter given SSN. Returns true if SSN is valid, otherwise false

### #parse(ssn)

- Parses parameter given SSN. Returns object ``{valid: boolean, sex: "male|female", ageInYears: Number, dateOfBirth: Date }``

```js
{
  valid: false,
  sex: null,
  ageInYears: null,
  dateOfBirth: null
}
{
  valid: true,
  sex: 'male',
  ageInYears: 15,
  dateOfBirth: Tue Feb 29 2000 00:00:00 GMT+0200 (EET)
}
{
  valid: true,
  sex: 'female',
  ageInYears: 15,
  dateOfBirth: Mon Feb 28 2000 00:00:00 GMT+0200 (EET)
}
```

### #createWithAge(age)

- Creates a valid SSN using the given age (Integer). Generates randomly male and female SSN'n.

Building
--------
- Project uses Gulp. Install it globally as follows in case you don't have it `npm install gulp -g`
- Build project (jshint, tests, minify)

```sh
gulp
```

Future development
------------------
- ES6 conversion
- Use a better js doc tool

License
-------

[MIT License](LICENSE)
