"use strict"
import finnishSSN from "../src/finnish-ssn"
import {expect} from "chai"
import MockDate from "mockdate"


describe("finnishSSN", () => {

  describe("#validate", () => {
    it("Should fail when given empty String", () => {
      expect(finnishSSN.validate("")).to.equal(false)
    })
    it("Should fail when given undefined", () => {
      expect(finnishSSN.validate(undefined)).to.equal(false)
    })
    it("Should fail when given null", () => {
      expect(finnishSSN.validate(null)).to.equal(false)
    })
    it("Should fail when given birthdate with month out of bounds", () => {
      expect(finnishSSN.validate("301398-1233")).to.equal(false)
    })

    it("Should fail when given birthdate with date out of bounds in January", () => {
      expect(finnishSSN.validate("320198-123P")).to.equal(false)
    })

    it("Should fail when given birthdate with date out of bounds in February, non leap year", () => {
      expect(finnishSSN.validate("290299-123U")).to.equal(false)
    })

    it("Should fail when given birth date with date out of bounds in February, a leap year", () => {
      expect(finnishSSN.validate("300204-123Y")).to.equal(false)
    })

    it("Should fail when given birth date with alphabets", () => {
      expect(finnishSSN.validate("0101AA-123A")).to.equal(false)
    })

    it("Should fail when given invalid separator chars", () => {
      const invalidSeparatorChars = "bcdefghijlmnopqrtsuv1234567890".split("")
      invalidSeparatorChars.forEach((invalidChar) => {
        expect(finnishSSN.validate("010195" + invalidChar + "433X")).to.equal(false)
        expect(finnishSSN.validate("010195" + invalidChar.toUpperCase() + "433X")).to.equal(false)
      })
    })

    it("Should fail when given too long date", () => {
      expect(finnishSSN.validate("01011995+433X")).to.equal(false)
    })

    it("Should fail when given too short date", () => {
      expect(finnishSSN.validate("01015+433X")).to.equal(false)
    })

    it("Should fail when given too long checksum part", () => {
      expect(finnishSSN.validate("010195+4433X")).to.equal(false)
    })

    it("Should fail when given too long checksum part", () => {
      expect(finnishSSN.validate("010195+33X")).to.equal(false)
    })

    it("Should pass when given valid finnishSSN from 19th century", () => {
      expect(finnishSSN.validate("010195+433X")).to.equal(true)
    })

    it("Should pass when given valid finnishSSN from 20th century", () => {
      expect(finnishSSN.validate("010197+100P")).to.equal(true)
    })

    it("Should pass when given valid finnishSSN from 21st century", () => {
      expect(finnishSSN.validate("010114A173M")).to.equal(true)
    })

    it("Should pass when given valid finnishSSN with leap year, divisible only by 4", () => {
      expect(finnishSSN.validate("290296-7808")).to.equal(true)
    })

    it("Should fail when given valid finnishSSN with leap year, divisible by 100 and not by 400", () => {
      expect(finnishSSN.validate("290200-101P")).to.equal(false)
    })

    it("Should fail when given SSN longer than 11 chars, bogus in the end", () => {
      expect(finnishSSN.validate("010114A173M ")).to.equal(false)
    })

    it("Should fail when given SSN longer than 11 chars, bogus in the beginning", () => {
      expect(finnishSSN.validate(" 010114A173M")).to.equal(false)
    })

    it("Should pass when given valid finnishSSN with leap year, divisible by 100 and by 400", () => {
      expect(finnishSSN.validate("290200A248A")).to.equal(true)
    })
  })

  describe("#parse", () => {

    it("Should parse valid, male, born on leap year day 29.2.2000", () => {
      MockDate.set("2/2/2015")
      const parsed = finnishSSN.parse("290200A717E")
      expect(parsed.valid).to.equal(true)
      expect(parsed.sex).to.equal(finnishSSN.MALE)
      expect(parsed.dateOfBirth.getFullYear()).to.equal(2000)
      expect(parsed.dateOfBirth.getMonth() + 1).to.equal(2)
      expect(parsed.dateOfBirth.getDate()).to.equal(29)
      expect(parsed.ageInYears).to.equal(14)
    })

    it("Should parse valid, female, born on 01.01.1999", () => {
      MockDate.set("2/2/2015")
      const parsed = finnishSSN.parse("010199-8148")
      expect(parsed.valid).to.equal(true)
      expect(parsed.sex).to.equal(finnishSSN.FEMALE)
      expect(parsed.dateOfBirth.getFullYear()).to.equal(1999)
      expect(parsed.dateOfBirth.getMonth() + 1).to.equal(1)
      expect(parsed.dateOfBirth.getDate()).to.equal(1)
      expect(parsed.ageInYears).to.equal(16)
    })

    it("Should parse valid, female, born on 31.12.2010", () => {
      MockDate.set("2/2/2015")
      const parsed = finnishSSN.parse("311210A540N")
      expect(parsed.valid).to.equal(true)
      expect(parsed.sex).to.equal(finnishSSN.FEMALE)
      expect(parsed.dateOfBirth.getFullYear()).to.equal(2010)
      expect(parsed.dateOfBirth.getMonth() + 1).to.equal(12)
      expect(parsed.dateOfBirth.getDate()).to.equal(31)
      expect(parsed.ageInYears).to.equal(4)
    })

    it("Should parse valid, male, born on 2.2.1888, having a birthday today", () => {
      MockDate.set("2/2/2015")
      const parsed = finnishSSN.parse("020288+9818")
      expect(parsed.valid).to.equal(true)
      expect(parsed.sex).to.equal(finnishSSN.MALE)
      expect(parsed.dateOfBirth.getFullYear()).to.equal(1888)
      expect(parsed.dateOfBirth.getMonth() + 1).to.equal(2)
      expect(parsed.dateOfBirth.getDate()).to.equal(2)
      expect(parsed.ageInYears).to.equal(127)
    })

    it("Should parse valid, female 0 years, born on 31.12.2015", () => {
      MockDate.set("1/1/2016")
      const parsed = finnishSSN.parse("311215A000J")
      expect(parsed.valid).to.equal(true)
      expect(parsed.sex).to.equal(finnishSSN.FEMALE)
      expect(parsed.dateOfBirth.getFullYear()).to.equal(2015)
      expect(parsed.dateOfBirth.getMonth() + 1).to.equal(12)
      expect(parsed.dateOfBirth.getDate()).to.equal(31)
      expect(parsed.ageInYears).to.equal(0)
    })

    it("Should parse age properly when birthdate is before current date", () => {
      MockDate.set("01/13/2017")
      const parsed = finnishSSN.parse("130195-1212")
      expect(parsed.ageInYears).to.equal(22)
    })

    it("Should parse age properly when birthdate is on current date", () => {
      MockDate.set("01/13/2017")
      const parsed = finnishSSN.parse("130195-1212")
      expect(parsed.ageInYears).to.equal(22)
    })

    it("Should parse age properly when birthdate is after current date", () => {
      MockDate.set("01/13/2017")
      const parsed = finnishSSN.parse("150295-1212")
      expect(parsed.ageInYears).to.equal(21)
    })

    it("Should detect invalid SSN, lowercase checksum char", () => {
      MockDate.set("2/2/2015")
      const parsed = finnishSSN.parse("311210A540n")
      expect(parsed.valid).to.equal(false)
      expect(parsed.sex).to.be.null
      expect(parsed.dateOfBirth).to.be.null
      expect(parsed.ageInYears).to.be.null
    })

    it("Should detect invalid SSN with invalid checksum born 17.8.1995", () => {
      MockDate.set("12/12/2015")
      const parsed = finnishSSN.parse("170895-951K")
      expect(parsed.valid).to.equal(false)
      expect(parsed.sex).to.equal(finnishSSN.MALE)
      expect(parsed.dateOfBirth.getFullYear()).to.equal(1995)
      expect(parsed.dateOfBirth.getMonth() + 1).to.equal(8)
      expect(parsed.dateOfBirth.getDate()).to.equal(17)
      expect(parsed.ageInYears).to.equal(20)
    })

    it("Should detect invalid SSN with month out of bounds", () => {
      const parsed = finnishSSN.parse("301398-1233")
      expect(parsed.valid).to.equal(false)
      expect(parsed.sex).to.be.null
      expect(parsed.dateOfBirth).to.be.null
      expect(parsed.ageInYears).to.be.null
    })

    it("Should detect invalid SSN with day of month out of bounds", () => {
      const parsed = finnishSSN.parse("330198-123X")
      expect(parsed.valid).to.equal(false)
      expect(parsed.sex).to.be.null
      expect(parsed.dateOfBirth).to.be.null
      expect(parsed.ageInYears).to.be.null
    })
  })

  describe("#createWithAge", () => {
    it("Should not accept zero age", () => {
      expect( () => {
        finnishSSN.createWithAge(0)
      }).to.throw(/not between sensible age range/)
    })

    it("Should not accept age >= 200", () => {
      expect( () => {
        finnishSSN.createWithAge(201)
      }).to.throw(/not between sensible age range/)
    })

    it("Should create valid finnishSSN for 21st century", () => {
      MockDate.set("2/2/2015")
      const age = 3,
          birthYear = "12"
      expect(finnishSSN.createWithAge(age)).to.match(new RegExp("0101" + birthYear + "A[\\d]{3}[A-Z0-9]"))
    })

    it("Should create valid finnishSSN for 20th century", () => {
      MockDate.set("2/2/2015")
      const age = 20,
          birthYear = "95"
      expect(finnishSSN.createWithAge(age)).to.match(new RegExp("0101" + birthYear + "-[\\d]{3}[A-Z0-9]"))
    })

    it("Should create valid finnishSSN for 19th century", () => {
      MockDate.set("2/2/2015")

      const age = 125,
          birthYear = (new Date().getFullYear() - age) % 100
      expect(finnishSSN.createWithAge(age)).to.match(new RegExp("0101" + birthYear + "\\+[\\d]{3}[A-Z0-9]"))
    })

    it("Should createWithAge valid finnishSSN for year 2000", () => {
      const age = new Date().getFullYear() - 2000
      expect(finnishSSN.createWithAge(age)).to.match(new RegExp("010100A[\\d]{3}[A-Z0-9]"))
    })

    it("Should create valid finnishSSN for year 1999", () => {
      const age = new Date().getFullYear() - 1999
      expect(finnishSSN.createWithAge(age)).to.match(new RegExp("010199-[\\d]{3}[A-Z0-9]"))
    })

    it("Should create valid finnishSSN for year 1990", () => {
      MockDate.set("2/2/2015")
      const age = 25
      expect(finnishSSN.createWithAge(age)).to.match(new RegExp("010190-[\\d]{3}[A-Z0-9]"))
    })
  })

})
