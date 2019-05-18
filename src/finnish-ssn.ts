'use strict'
/**
 * Project: finnish-ssn
 * Purpose: Validate and generate Finnish SSN's according to https://fi.wikipedia.org/wiki/Henkil%C3%B6tunnus
 * Author:  Ville Komulainen
 */

interface SSN {
  valid: boolean
  sex: string
  ageInYears: number
  dateOfBirth: Date
}

//! https://github.com/vkomulai/finnish-ssn | Version: 1.1.0
export default class FinnishSSN {
  static FEMALE = 'female'
  static MALE = 'male'

  /**
   * Parse parameter given SSN string into Object representation.
   * @param ssn - {String} SSN to parse
   * @returns {Object} {valid: true|false, sex: String, ageInYears: Number, dateOfBirth: Date}
   */
  static parse(ssn: string): SSN {
    //  Sanity and format check, which allows to make safe assumptions on the format.
    if (!SSN_REGEX.test(ssn)) {
      throw 'Not valid SSN format'
    }

    const dayOfMonth = parseInt(ssn.substring(0, 2), 10),
      month = ssn.substring(2, 4),
      centuryId = ssn.charAt(6),
      year = parseInt(ssn.substring(4, 6), 10) + centuryMap.get(centuryId)!,
      rollingId = ssn.substring(7, 10),
      checksum = ssn.substring(10, 11),
      sex = parseInt(rollingId, 10) % 2 ? this.MALE : this.FEMALE
    const daysInMonth = daysInGivenMonth(year, month)

    if (!daysInMonthMap.get(month) || dayOfMonth > daysInMonth) {
      throw 'Not valid SSN'
    }

    const checksumBase = parseInt(ssn.substring(0, 6) + rollingId, 10),
      dateOfBirth = new Date(year, parseInt(month, 10) - 1, dayOfMonth, 0, 0, 0, 0),
      today = new Date()

    return {
      valid: checksum === checksumTable[checksumBase % 31],
      sex: sex,
      dateOfBirth: dateOfBirth,
      ageInYears: ageInYears(dateOfBirth, today)
    }
  }

  /**
   * Validates parameter given SSN. Returns true if SSN is valid, otherwise false.
   * @param ssn - {String} For example '010190-123A'
   * @returns {boolean}
   */
  static validate(ssn: string): boolean {
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
   * @returns {String} - valid ssn.
   */
  static createWithAge(age: number): string {
    if (age < MIN_AGE || age > MAX_AGE) {
      throw 'Given age (' + age + ') is not between sensible age range of ' + MIN_AGE + ' and ' + MAX_AGE
    }
    let today = new Date(),
      year = today.getFullYear() - age,
      month = randomMonth(),
      dayOfMonth = randomDay(year, month),
      centurySign,
      checksumBase,
      checksum,
      rollingId = 99 + randomNumber(800) //  No need for padding when rollingId >= 100

    centuryMap.forEach((value: number, key: string) => {
      if (value === Math.floor(year / 100) * 100) {
        centurySign = key
      }
    })

    if (!birthDayPassed(new Date(year, Number(month) - 1, Number(dayOfMonth)), today)) {
      year--
    }
    year = year % 100
    const yearString = yearToPaddedString(year)
    checksumBase = parseInt(dayOfMonth + month + yearString + rollingId, 10)
    checksum = checksumTable[checksumBase % 31]

    return dayOfMonth + month + yearString + centurySign + rollingId + checksum
  }

  static isLeapYear(year: number): boolean {
    return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0
  }
}

const centuryMap: Map<string, number> = new Map()
centuryMap.set('A', 2000)
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

const MIN_AGE = 1,
  MAX_AGE = 200,
  SSN_REGEX = /^[0-3][\d][0-1][0-9][0-9]{2}[+\-A][\d]{3}[\dA-Z]$/

function randomMonth(): string {
  return ('00' + randomNumber(12)).substr(-2, 2)
}

function yearToPaddedString(year: number): string {
  return year % 100 < 10 ? '0' + year : year.toString()
}

function randomDay(year: number, month: string): string {
  const maxDaysInMonth = daysInGivenMonth(year, month)
  return ('00' + randomNumber(maxDaysInMonth)).substr(-2, 2)
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
