# Finnish SSN validation and creation

[![Build Status](https://travis-ci.org/vkomulai/finnish-ssn.svg?branch=master)](https://travis-ci.org/vkomulai/finnish-ssn) ![0 deps](https://david-dm.org/vkomulai/finnish-ssn.svg) ![Downloads](https://img.shields.io/npm/dt/finnish-ssn.svg) ![License](https://img.shields.io/npm/l/finnish-ssn.svg)

- A micro Javascript library for validating and creating Finnish social security numbers
- Zero dependencies

## Installation

```sh
npm install finnish-ssn --save
```

## Usage

ES6 / TypeScript

```js
import { FinnishSSN } from 'finnish-ssn'
const isValid = FinnishSSN.validate('010101-100X')
console.log(isValid) //  Yields true
```

## Examples

Validate an SSN

```js
//  This is valid SSN
console.log('valid ssn returns ' + FinnishSSN.validate('290296-7808'))
//  'valid ssn returns true'

//  This is invalid SSN
console.log('invalid ssn returns ' + FinnishSSN.validate('010198-1000'))
//  'invalid ssn returns false'
```

Parse SSN

```js
//  This is valid SSN
var parsedSsn =  FinnishSSN.parse('290296-7808')
//  This is invalid SSN
console.log(parsedSsn)
{
  valid: true,
  sex: 'female',
  ageInYears: 19,
  dateOfBirth: Thu Feb 29 1996 00:00:00 GMT+0200 (EET)
}
```

Create an SSN for person that is 20 years old.

```js
console.log('SSN for person that is 20 years old ' + FinnishSSN.createWithAge(20))
//  SSN for person that is 20 years old 010195-XXXX
```

## Functions

### #validate(ssn)

- Validates parameter given SSN. Returns true if SSN is valid, otherwise false

### #parse(ssn)

- Parses parameter given SSN. Returns object `{valid: boolean, sex: "male|female", ageInYears: Number, dateOfBirth: Date }`

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

## Building

```sh
npm run dist

# Run tests
npm run test

# Run tests in watch-mode
npm run test:watch
```

## Changelog

### 2.1.2

- FIXED: [Fix SSN_REGEX not to include pipe character in allowed characters](https://github.com/vkomulai/finnish-ssn/pull/28)

### 2.1.1

- FIXED: [Issue 25: NodeJS engine locked to a specific version](https://github.com/vkomulai/finnish-ssn/issues/25)
- FIXED: [Issue 14: createWithAge can create an invalid SSN](https://github.com/vkomulai/finnish-ssn/issues/14)

### 2.1.0

- [Reform of personal identity codes](https://dvv.fi/en/reform-of-personal-identity-code)
- Dev dependency updates from [finnish-ssn-validator](https://github.com/orangitfi/finnish-ssn-validator)
- Updated Typescript declaration file to return more specific types

### 2.0.3

- FIXED: [Issue 6: Wrong SSN validation](https://github.com/vkomulai/finnish-ssn/issues/9)

### 2.0.2

- Using TypeScript
- Minor version in x.y.2 thanks to hazzle with npm publish and artifacts

### 1.2.0

- Generate SSNs with random month and day for given age. Also takes into account whether the randomized birth date has already passed and adjusts birth year accordingly, so that the returned SSN really has the given age on the day of generation.

### 1.1.1

- FIXED: [Issue 6: Bug in calculating age](https://github.com/vkomulai/finnish-ssn/issues/6)

### 1.1.0

- Sources ported from ES5 --> ES6
- Distributed js is transpiled to ES5 for backwards compatibility
- API should still be backwards compatible with `1.0.3`. Bumping minor-version to be on the safe side.

### 1.0.3

- FIXED: [Issue 2: Replace npmcdn.com with unpkg.com](https://github.com/vkomulai/finnish-ssn/issues/2)

### 1.0.2

- FIXED: [Issue 1: Length is not verified](https://github.com/vkomulai/finnish-ssn/issues/1)

### 1.0.1

- Clean semicolons, removed lodash

### 1.0.0

- Initial release

## License

[MIT License](LICENSE)
