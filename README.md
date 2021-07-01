# Finnish SSN validation and creation

- This is a fork from https://github.com/vkomulai/finnish-ssn which is not maintained anymore. This project will be maintained in the future.
- A micro Javascript library for validating and creating Finnish social security numbers
- Zero dependencies

## Installation

```sh
npm install finnish-ssn-validator --save
```

## Usage

ES6 / TypeScript

```js
import { FinnishSSN } from 'finnish-ssn-validator'
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
### 1.0.1
- Updated documentation

### 1.0.0
- Initial release with latest dependencies and updated code

## License

[MIT License](LICENSE)
