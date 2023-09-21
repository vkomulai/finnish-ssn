'use strict'

enum Sex {
  FEMALE = 'female',
  MALE = 'male',
}

interface SSN {
  valid: boolean
  sex: Sex
  ageInYears: number
  dateOfBirth: Date
}

export class FinnishSSN {
  public static FEMALE = Sex.FEMALE
  public static MALE = Sex.MALE

  /**
   * Parse parameter given SSN string into Object representation.
   * @param ssn - {String} SSN to parse
   */
  public static parse(ssn: string): SSN {
    //  Sanity and format check, which allows to make safe assumptions on the format.
    if (!SSN_REGEX.test(ssn)) {
      throw new Error('Not valid SSN format')
    }

    const dayOfMonth = parseInt(ssn.substring(0, 2), 10)
    const month = ssn.substring(2, 4)
    const centuryId = ssn.charAt(6)
    const year = parseInt(ssn.substring(4, 6), 10) + centuryMap.get(centuryId)!
    const rollingId = ssn.substring(7, 10)
    const checksum = ssn.substring(10, 11)
    const sex = parseInt(rollingId, 10) % 2 ? this.MALE : this.FEMALE
    const daysInMonth = daysInGivenMonth(year, month)

    if (!daysInMonthMap.get(month) || dayOfMonth > daysInMonth) {
      throw new Error('Not valid SSN')
    }

    const checksumBase = parseInt(ssn.substring(0, 6) + rollingId, 10)
    const dateOfBirth = new Date(year, parseInt(month, 10) - 1, dayOfMonth, 0, 0, 0, 0)
    const today = new Date()

    return {
      valid: checksum === checksumTable[checksumBase % 31],
      sex,
      dateOfBirth,
      ageInYears: ageInYears(dateOfBirth, today),
    }
  }

  /**
   * Validates parameter given SSN. Returns true if SSN is valid, otherwise false.
   * @param ssn - {String} For example '010190-123A'
   */
  public static validate(ssn: string): boolean {
    try {
      return this.parse(ssn).valid
    } catch (error) {
      return false
    }
  }

  /**
   * Creates a valid SSN using the given age (Integer). Creates randomly male and female SSN'n.
   * In case an invalid age is given, throws exception.
   *
   * @param age as Integer. Min valid age is 1, max valid age is 200
   */
  public static createWithAge(age: number): string {
    if (age < MIN_AGE || age > MAX_AGE) {
      throw new Error(`Given age (${age}) is not between sensible age range of ${MIN_AGE} and ${MAX_AGE}`)
    }
    const today = new Date()
    let year = today.getFullYear() - age
    const month = randomMonth()
    const dayOfMonth = randomDay(year, month)
    const rollingId = randomNumber(800) + 99 //  No need for padding when rollingId >= 100

    if (!birthDayPassed(new Date(year, Number(month) - 1, Number(dayOfMonth)), today)) {
      year--
    }

    const possibleCenturySigns: string[] = []
    centuryMap.forEach((value: number, key: string) => {
      if (value === Math.floor(year / 100) * 100) {
        possibleCenturySigns.push(key)
      }
    })
    const centurySign = possibleCenturySigns[Math.floor(Math.random() * possibleCenturySigns.length)]

    year = year % 100
    const yearString = yearToPaddedString(year)
    const checksumBase = parseInt(dayOfMonth + month + yearString + rollingId, 10)
    const checksum = checksumTable[checksumBase % 31]

    return dayOfMonth + month + yearString + centurySign + rollingId + checksum
  }

  public static isLeapYear(year: number): boolean {
    return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0
  }
}

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

const february = '02'
const daysInMonthMap: Map<string, number> = new Map()
daysInMonthMap.set('01', 31)
daysInMonthMap.set('02', 28)
daysInMonthMap.set('03', 31)
daysInMonthMap.set('04', 30)
daysInMonthMap.set('05', 31)
daysInMonthMap.set('06', 30)
daysInMonthMap.set('07', 31)
daysInMonthMap.set('08', 31)
daysInMonthMap.set('09', 30)
daysInMonthMap.set('10', 31)
daysInMonthMap.set('11', 30)
daysInMonthMap.set('12', 31)

const checksumTable: string[] = '0123456789ABCDEFHJKLMNPRSTUVWXY'.split('')

const MIN_AGE = 1
const MAX_AGE = 200
const SSN_REGEX = /^(0[1-9]|[12]\d|3[01])(0[1-9]|1[0-2])([5-9]\d\+|\d\d[-|U-Y]|[012]\d[A-F])\d{3}[\dA-Z]$/

function randomMonth(): string {
  return `00${randomNumber(12)}`.substr(-2, 2)
}

function yearToPaddedString(year: number): string {
  return year % 100 < 10 ? `0${year}` : year.toString()
}

function randomDay(year: number, month: string): string {
  const maxDaysInMonth = daysInGivenMonth(year, month)

  return `00${randomNumber(maxDaysInMonth)}`.substr(-2, 2)
}

function daysInGivenMonth(year: number, month: string) {
  const daysInMonth = daysInMonthMap.get(month)!

  return month === february && FinnishSSN.isLeapYear(year) ? daysInMonth + 1 : daysInMonth
}

function randomNumber(max: number): number {
  return Math.floor(Math.random() * max) + 1 // no zero
}

function ageInYears(dateOfBirth: Date, today: Date): number {
  return today.getFullYear() - dateOfBirth.getFullYear() - (birthDayPassed(dateOfBirth, today) ? 0 : 1)
}

function birthDayPassed(dateOfBirth: Date, today: Date): boolean {
  return (
    dateOfBirth.getMonth() < today.getMonth() ||
    (dateOfBirth.getMonth() === today.getMonth() && dateOfBirth.getDate() <= today.getDate())
  )
}
