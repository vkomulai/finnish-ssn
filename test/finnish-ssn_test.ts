'use strict'
import { FinnishSSN } from '../src/finnish-ssn'
import { expect } from 'chai'
import MockDate from 'mockdate'

describe('FinnishSSN', () => {
  describe('#validate', () => {
    it('Should fail when given empty String', () => {
      expect(FinnishSSN.validate('')).to.equal(false)
    })
    it('Should fail when given birthdate with month out of bounds', () => {
      expect(FinnishSSN.validate('301398-1233')).to.equal(false)
    })

    it('Should fail when given birthdate with date out of bounds in January', () => {
      expect(FinnishSSN.validate('320198-123P')).to.equal(false)
    })

    it('Should fail when given birthdate with date out of bounds in February, non leap year', () => {
      expect(FinnishSSN.validate('290299-123U')).to.equal(false)
    })

    it('Should fail when given birth date with date out of bounds in February, a leap year', () => {
      expect(FinnishSSN.validate('300204-123Y')).to.equal(false)
    })

    it('Should fail when given birth date with alphabets', () => {
      expect(FinnishSSN.validate('0101AA-123A')).to.equal(false)
    })

    it('Should fail when given invalid separator char for year 1900', () => {
      const invalidSeparatorChars = 'ABCDEFGHIJKLMNOPQRST1234567890'.split('')
      invalidSeparatorChars.forEach((invalidChar) => {
        expect(FinnishSSN.validate('010195' + invalidChar + '433X')).to.equal(false)
        expect(FinnishSSN.validate('010195' + invalidChar.toLowerCase() + '433X')).to.equal(false)
      })
    })

    it('Should fail when given invalid separator char for year 2000', () => {
      const invalidSeparatorChars = 'GHIJKLMNOPQRSTUVWXYZ1234567890'.split('')
      invalidSeparatorChars.forEach((invalidChar) => {
        expect(FinnishSSN.validate('010103' + invalidChar + '433X')).to.equal(false)
        expect(FinnishSSN.validate('010103' + invalidChar.toLowerCase() + '433X')).to.equal(false)
      })
    })

    it('Should fail when given too long date', () => {
      expect(FinnishSSN.validate('01011995+433X')).to.equal(false)
    })

    it('Should fail when given too short date', () => {
      expect(FinnishSSN.validate('01015+433X')).to.equal(false)
    })

    it('Should fail when given too long checksum part', () => {
      expect(FinnishSSN.validate('010195+4433X')).to.equal(false)
    })

    it('Should fail when given too long checksum part', () => {
      expect(FinnishSSN.validate('010195+33X')).to.equal(false)
    })

    it('Should pass when given valid FinnishSSN from 19th century', () => {
      expect(FinnishSSN.validate('010195+433X')).to.equal(true)
    })

    it('Should pass when given valid FinnishSSN from 20th century', () => {
      expect(FinnishSSN.validate('010197-100P')).to.equal(true)
    })

    it('Should pass when given valid FinnishSSN from 21st century', () => {
      expect(FinnishSSN.validate('010114A173M')).to.equal(true)
    })

    it('Should pass when given valid FinnishSSN with leap year, divisible only by 4', () => {
      expect(FinnishSSN.validate('290296-7808')).to.equal(true)
    })

    it('Should fail when given valid FinnishSSN with leap year, divisible by 100 and not by 400', () => {
      expect(FinnishSSN.validate('290200-101P')).to.equal(false)
    })

    it('Should fail when given SSN longer than 11 chars, bogus in the end', () => {
      expect(FinnishSSN.validate('010114A173M ')).to.equal(false)
    })

    it('Should fail when given SSN longer than 11 chars, bogus in the beginning', () => {
      expect(FinnishSSN.validate(' 010114A173M')).to.equal(false)
    })

    it('Should pass when given valid FinnishSSN with leap year, divisible by 100 and by 400', () => {
      expect(FinnishSSN.validate('290200A248A')).to.equal(true)
    })

    it('Should pass when given new intermediate characters', () => {
      // List taken from https://dvv.fi/en/reform-of-personal-identity-code
      const newHypotheticalIndividuals = [
        '010594Y9021',
        '020594X903P',
        '020594X902N',
        '030594W903B',
        '030694W9024',
        '040594V9030',
        '040594V902Y',
        '050594U903M',
        '050594U902L',
        '010516B903X',
        '010516B902W',
        '020516C903K',
        '020516C902J',
        '030516D9037',
        '030516D9026',
        '010501E9032',
        '020502E902X',
        '020503F9037',
        '020504A902E',
        '020504B904H',
        '010594Y9032',
      ]
      newHypotheticalIndividuals.forEach((individual) => {
        expect(FinnishSSN.validate(individual)).to.equal(true)
      })
    })
  })

  describe('#parse', () => {
    beforeEach(() => {
      MockDate.reset()
    })
    it('Should parse valid, male, born on leap year day 29.2.2000', () => {
      MockDate.set('2/2/2015')
      const parsed = FinnishSSN.parse('290200A717E')
      expect(parsed.valid).to.equal(true)
      expect(parsed.sex).to.equal(FinnishSSN.MALE)
      expect(parsed.dateOfBirth!.getFullYear()).to.equal(2000)
      expect(parsed.dateOfBirth!.getMonth() + 1).to.equal(2)
      expect(parsed.dateOfBirth!.getDate()).to.equal(29)
      expect(parsed.ageInYears).to.equal(14)
    })

    it('Should parse valid, female, born on 01.01.1999', () => {
      MockDate.set('2/2/2015')
      const parsed = FinnishSSN.parse('010199-8148')
      expect(parsed.valid).to.equal(true)
      expect(parsed.sex).to.equal(FinnishSSN.FEMALE)
      expect(parsed.dateOfBirth!.getFullYear()).to.equal(1999)
      expect(parsed.dateOfBirth!.getMonth() + 1).to.equal(1)
      expect(parsed.dateOfBirth!.getDate()).to.equal(1)
      expect(parsed.ageInYears).to.equal(16)
    })

    it('Should parse valid, female, born on 31.12.2010', () => {
      MockDate.set('2/2/2015')
      const parsed = FinnishSSN.parse('311210A540N')
      expect(parsed.valid).to.equal(true)
      expect(parsed.sex).to.equal(FinnishSSN.FEMALE)
      expect(parsed.dateOfBirth!.getFullYear()).to.equal(2010)
      expect(parsed.dateOfBirth!.getMonth() + 1).to.equal(12)
      expect(parsed.dateOfBirth!.getDate()).to.equal(31)
      expect(parsed.ageInYears).to.equal(4)
    })

    it('Should parse valid, male, born on 2.2.1888, having a birthday today', () => {
      MockDate.set('2/2/2015')
      const parsed = FinnishSSN.parse('020288+9818')
      expect(parsed.valid).to.equal(true)
      expect(parsed.sex).to.equal(FinnishSSN.MALE)
      expect(parsed.dateOfBirth!.getFullYear()).to.equal(1888)
      expect(parsed.dateOfBirth!.getMonth() + 1).to.equal(2)
      expect(parsed.dateOfBirth!.getDate()).to.equal(2)
      expect(parsed.ageInYears).to.equal(127)
    })

    it('Should parse valid, female 0 years, born on 31.12.2015', () => {
      MockDate.set('1/1/2016')
      const parsed = FinnishSSN.parse('311215A000J')
      expect(parsed.valid).to.equal(true)
      expect(parsed.sex).to.equal(FinnishSSN.FEMALE)
      expect(parsed.dateOfBirth!.getFullYear()).to.equal(2015)
      expect(parsed.dateOfBirth!.getMonth() + 1).to.equal(12)
      expect(parsed.dateOfBirth!.getDate()).to.equal(31)
      expect(parsed.ageInYears).to.equal(0)
    })

    it('Should parse age properly when birthdate is before current date', () => {
      MockDate.set('01/13/2017')
      const parsed = FinnishSSN.parse('130195-1212')
      expect(parsed.ageInYears).to.equal(22)
    })

    it('Should parse age properly when birthdate is on current date', () => {
      MockDate.set('01/13/2017')
      const parsed = FinnishSSN.parse('130195-1212')
      expect(parsed.ageInYears).to.equal(22)
    })

    it('Should parse age properly when birthdate is after current date', () => {
      MockDate.set('01/13/2017')
      const parsed = FinnishSSN.parse('150295-1212')
      expect(parsed.ageInYears).to.equal(21)
    })

    it('Should detect invalid SSN, lowercase checksum char', () => {
      MockDate.set('2/2/2015')
      expect(() => {
        FinnishSSN.parse('311210A540n')
      }).to.throw(/Not valid SSN format/)
    })

    it('Should detect invalid SSN with invalid checksum born 17.8.1995', () => {
      MockDate.set('12/12/2015')
      const parsed = FinnishSSN.parse('150295-1212')
      expect(parsed.valid).to.equal(false)
    })

    it('Should detect invalid SSN with month out of bounds', () => {
      expect(() => {
        FinnishSSN.parse('301398-1233')
      }).to.throw(/Not valid SSN/)
    })

    it('Should detect invalid SSN with day of month out of bounds', () => {
      expect(() => {
        FinnishSSN.parse('330198-123X')
      }).to.throw(/Not valid SSN/)
    })
  })

  describe('#parse new identity codes', () => {
    beforeEach(() => {
      MockDate.reset()
    })
    it('Should parse valid, male, born on leap year day 29.2.2000', () => {
      MockDate.set('2/2/2015')
      const parsed = FinnishSSN.parse('290200E717E')
      expect(parsed.valid).to.equal(true)
      expect(parsed.sex).to.equal(FinnishSSN.MALE)
      expect(parsed.dateOfBirth!.getFullYear()).to.equal(2000)
      expect(parsed.dateOfBirth!.getMonth() + 1).to.equal(2)
      expect(parsed.dateOfBirth!.getDate()).to.equal(29)
      expect(parsed.ageInYears).to.equal(14)
    })

    it('Should parse valid, female, born on 01.01.1999', () => {
      MockDate.set('2/2/2015')
      const parsed = FinnishSSN.parse('010199Y8148')
      expect(parsed.valid).to.equal(true)
      expect(parsed.sex).to.equal(FinnishSSN.FEMALE)
      expect(parsed.dateOfBirth!.getFullYear()).to.equal(1999)
      expect(parsed.dateOfBirth!.getMonth() + 1).to.equal(1)
      expect(parsed.dateOfBirth!.getDate()).to.equal(1)
      expect(parsed.ageInYears).to.equal(16)
    })

    it('Should parse valid, female, born on 31.12.2010', () => {
      MockDate.set('2/2/2015')
      const parsed = FinnishSSN.parse('311210F540N')
      expect(parsed.valid).to.equal(true)
      expect(parsed.sex).to.equal(FinnishSSN.FEMALE)
      expect(parsed.dateOfBirth!.getFullYear()).to.equal(2010)
      expect(parsed.dateOfBirth!.getMonth() + 1).to.equal(12)
      expect(parsed.dateOfBirth!.getDate()).to.equal(31)
      expect(parsed.ageInYears).to.equal(4)
    })

    it('Should parse valid, female 0 years, born on 31.12.2015', () => {
      MockDate.set('1/1/2016')
      const parsed = FinnishSSN.parse('311215F000J')
      expect(parsed.valid).to.equal(true)
      expect(parsed.sex).to.equal(FinnishSSN.FEMALE)
      expect(parsed.dateOfBirth!.getFullYear()).to.equal(2015)
      expect(parsed.dateOfBirth!.getMonth() + 1).to.equal(12)
      expect(parsed.dateOfBirth!.getDate()).to.equal(31)
      expect(parsed.ageInYears).to.equal(0)
    })

    it('Should parse age properly when birthdate is before current date', () => {
      MockDate.set('01/13/2017')
      const parsed = FinnishSSN.parse('130195Y1212')
      expect(parsed.ageInYears).to.equal(22)
    })

    it('Should parse age properly when birthdate is on current date', () => {
      MockDate.set('01/13/2017')
      const parsed = FinnishSSN.parse('130195W1212')
      expect(parsed.ageInYears).to.equal(22)
    })

    it('Should parse age properly when birthdate is after current date', () => {
      MockDate.set('01/13/2017')
      const parsed = FinnishSSN.parse('150295V1212')
      expect(parsed.ageInYears).to.equal(21)
    })

    it('Should detect invalid SSN, lowercase checksum char', () => {
      MockDate.set('2/2/2015')
      expect(() => {
        FinnishSSN.parse('311210E540n')
      }).to.throw(/Not valid SSN format/)
    })

    it('Should detect invalid SSN with invalid checksum born 17.8.1995', () => {
      MockDate.set('12/12/2015')
      const parsed = FinnishSSN.parse('150295U1212')
      expect(parsed.valid).to.equal(false)
    })

    it('Should detect invalid SSN with month out of bounds', () => {
      expect(() => {
        FinnishSSN.parse('301398W1233')
      }).to.throw(/Not valid SSN/)
    })

    it('Should detect invalid SSN with day of month out of bounds', () => {
      expect(() => {
        FinnishSSN.parse('330198X123X')
      }).to.throw(/Not valid SSN/)
    })
  })

  describe('#createWithAge', () => {
    beforeEach(() => {
      MockDate.reset()
    })
    it('Should not accept zero age', () => {
      expect(() => {
        FinnishSSN.createWithAge(0)
      }).to.throw(/not between sensible age range/)
    })

    it('Should not accept age >= 200', () => {
      expect(() => {
        FinnishSSN.createWithAge(201)
      }).to.throw(/not between sensible age range/)
    })

    it('Should create valid FinnishSSN for 21st century', () => {
      MockDate.set('2/2/2015')
      const age = 3
      expect(FinnishSSN.createWithAge(age)).to.match(new RegExp('\\d{4}1[12][A-F][\\d]{3}[A-Z0-9]'))
    })

    it('Should create valid FinnishSSN for 20th century', () => {
      MockDate.set('2/2/2015')
      const age = 20
      expect(FinnishSSN.createWithAge(age)).to.match(new RegExp('\\d{4}9[45][-|U-Y][\\d]{3}[A-Z0-9]'))
    })

    it('Should create valid FinnishSSN for 19th century', () => {
      MockDate.set('2/2/2015')
      const age = 125
      expect(FinnishSSN.createWithAge(age)).to.match(new RegExp('\\d{4}[(89)|(90)]\\+[\\d]{3}[A-Z0-9]'))
    })

    it('Should createWithAge valid FinnishSSN for year 2000', () => {
      MockDate.set('12/31/2015')
      const age = new Date().getFullYear() - 2000
      expect(FinnishSSN.createWithAge(age)).to.match(new RegExp('\\d{4}00[A-F][\\d]{3}[A-Z0-9]'))
    })

    it('Should create valid FinnishSSN for year 1999', () => {
      MockDate.set('12/31/2015')
      const age = new Date().getFullYear() - 1999
      expect(FinnishSSN.createWithAge(age)).to.match(new RegExp('\\d{4}99[-|U-Y][\\d]{3}[A-Z0-9]'))
    })

    it('Should create valid FinnishSSN for year 1990', () => {
      MockDate.set('12/31/2015')
      const age = 25
      expect(FinnishSSN.createWithAge(age)).to.match(new RegExp('\\d{4}90[-|U-Y][\\d]{3}[A-Z0-9]'))
    })

    it('Should create random birth dates', () => {
      const getDayAndMonth = (ssn: string) => ssn.substr(0, 4)

      const ssnsToCompare = 10,
        age = 50

      const referenceBirthDate = getDayAndMonth(FinnishSSN.createWithAge(age))
      let i = 0,
        differenceFound = false

      do {
        const birthDate = getDayAndMonth(FinnishSSN.createWithAge(age))
        differenceFound = referenceBirthDate !== birthDate
        i++
      } while (!differenceFound && i < ssnsToCompare)

      expect(differenceFound).to.be.true
    })

    it('Should create valid birth dates', () => {
      const centuryMap: Map<string, number> = new Map()
      centuryMap.set('F', 2000)
      centuryMap.set('E', 2000)
      centuryMap.set('D', 2000)
      centuryMap.set('C', 2000)
      centuryMap.set('B', 2000)
      centuryMap.set('A', 2000)
      centuryMap.set('U', 1900)
      centuryMap.set('V', 1900)
      centuryMap.set('W', 1900)
      centuryMap.set('X', 1900)
      centuryMap.set('Y', 1900)
      centuryMap.set('-', 1900)
      centuryMap.set('+', 1800)
      const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
        ssnsToGenerate = 1000

      for (let i = 0; i < ssnsToGenerate; i++) {
        const ssn = FinnishSSN.createWithAge(Math.floor(Math.random() * 199) + 1)

        const month = parseInt(ssn.substr(2, 2), 10)
        expect(month).to.satisfy((m: number) => m >= 1 && m <= 12, 'Month not between 1 and 12')

        const day = parseInt(ssn.substr(0, 2), 10)

        let daysInMonthMax = daysInMonth[month - 1]
        if (month === 2) {
          const centuryChar = ssn.substr(6, 1)
          const year = centuryMap.get(centuryChar)! + parseInt(ssn.substr(4, 2), 10)
          if (FinnishSSN.isLeapYear(year)) {
            daysInMonthMax++
          }
        }
        expect(day).to.satisfy((d: number) => d >= 1 && d <= daysInMonthMax, "Day not between 1 and month's maximum")
      }
    })

    it('Should create random birth dates with correct (i.e. given) age', () => {
      const age = 25,
        ssnsToGenerate = 100

      for (let i = 0; i < ssnsToGenerate; i++) {
        const ssn = FinnishSSN.createWithAge(age)
        const generatedAge = FinnishSSN.parse(ssn).ageInYears
        expect(generatedAge).to.equal(age)
      }
    })

    it('Should set correct centurySign and age when person is (now.year - 2000) birthday has not passed, that is born in 1999', () => {
      const currentYear = new Date().getFullYear()
      MockDate.set(`01/01/${currentYear}`)
      const age = currentYear - 2000

      const ssn = FinnishSSN.createWithAge(age)
      expect(ssn).to.match(new RegExp('\\d{4}99[-|U-Y][\\d]{3}[A-Z0-9]'))
      const person = FinnishSSN.parse(ssn)
      expect(person.ageInYears).to.equal(age)
    })

    it('Should set correct centurySign and age when person is (now.year - 2000) birthday has passed, that is born in 2000', () => {
      const currentYear = new Date().getFullYear()
      MockDate.set(`12/31/${currentYear}`)
      const age = currentYear - 2000

      const ssn = FinnishSSN.createWithAge(age)
      expect(ssn).to.match(new RegExp('\\d{4}00[A-F][\\d]{3}[A-Z0-9]'))
      const person = FinnishSSN.parse(ssn)
      expect(person.ageInYears).to.equal(age)
    })
  })
})
