Finnish SSN validator
=====================

[![Build Status](https://travis-ci.org/vkomulai/finnish-ssn.svg?branch=master)](https://travis-ci.org/vkomulai/finnish-ssn)

- Small library for validating and creating Finnish social security numbers.

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

Usage
-----

Node.js

``` js
var FinnishSSN = require('finnish-ssn');
var isValid = FinnishSSN.validate('010101-100X');
```

Web: Writes FinnishSSN into global namespace.

``` html
<script src="finnish-ssn.min.js"></script>
<script>
  // This is valid SSN
  var isValid = FinnishSSN.validate('290296-7808');
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

Create an SSN for person that is 20 years old.

``` js
console.log('SSN for person that is 20 years old ' + FinnishSSN.createWithAge(20));
```

yields

```
# Valid SSN, where XXXX is a random string with valid checksum.
010195-XXXX
```

Functions
---------

### #validate(ssn)

- Validates parameter given SSN. Returns true if SSN is valid, otherwise false

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
- Add function describe(ssn) returning parsed SSN {valid:bool, age:int, sex:string, dateOfBirth:Date}
  - refactor FinnishSSN.validate(ssn) as a shortcut for return describe(ssn).valid
- add to https://cdnjs.com/
- add to https://github.com/madrobby/microjs.com

License
-------

MIT License
