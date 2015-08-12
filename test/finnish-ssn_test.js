"use strict";
var finnishSSN = require("../finnish-ssn"),
    expect = require("chai").expect;

describe("finnishSSN", function () {

  describe("#validate", function () {
    it("Should fail when given empty String", function () {
      expect(finnishSSN.validate('')).to.equal(false);
    });
    it("Should fail when given undefined", function () {
      expect(finnishSSN.validate(undefined)).to.equal(false);
    });
    it("Should fail when given null", function () {
      expect(finnishSSN.validate(null)).to.equal(false);
    });
    it("Should fail when given birthdate with month out of bounds", function () {
      expect(finnishSSN.validate('301398-1233')).to.equal(false);
    });

    it("Should fail when given birthdate with date out of bounds in January", function () {
      expect(finnishSSN.validate('320198-123P')).to.equal(false);
    });

    it("Should fail when given birthdate with date out of bounds in February, non leap year", function () {
      expect(finnishSSN.validate('290299-123U')).to.equal(false);
    });

    it("Should fail when given birth date with date out of bounds in February, a leap year", function () {
      expect(finnishSSN.validate('300204-123Y')).to.equal(false);
    });

    it("Should fail when given birth date with alphabets", function () {
      expect(finnishSSN.validate('0101AA-123A')).to.equal(false);
    });

    it("Should fail when given invalid separator chars", function () {
      var invalidSeparatorChars = "bcdefghijlmnopqrtsuv1234567890".split("");
      for (var i = 0; i < invalidSeparatorChars.length; i++) {
        expect(finnishSSN.validate("010195" + invalidSeparatorChars[i] + "433X")).to.equal(false);
        expect(finnishSSN.validate("010195" + invalidSeparatorChars[i].toUpperCase() + "433X")).to.equal(false);
      }
    });

    it("Should fail when given too long date", function () {
      expect(finnishSSN.validate('01011995+433X')).to.equal(false);
    });

    it("Should fail when given too short date", function () {
      expect(finnishSSN.validate('01015+433X')).to.equal(false);
    });

    it("Should fail when given too long checksum part", function () {
      expect(finnishSSN.validate('010195+4433X')).to.equal(false);
    });

    it("Should fail when given too long checksum part", function () {
      expect(finnishSSN.validate('010195+33X')).to.equal(false);
    });

    it("Should pass when given valid finnishSSN from 19th century", function () {
      expect(finnishSSN.validate('010195+433X')).to.equal(true);
    });

    it("Should pass when given valid finnishSSN from 20th century", function () {
      expect(finnishSSN.validate('010197+100P')).to.equal(true);
    });

    it("Should pass when given valid finnishSSN from 21st century", function () {
      expect(finnishSSN.validate('010114A173M')).to.equal(true);
    });

    it("Should pass when given valid finnishSSN with leap year, divisible only by 4", function () {
      expect(finnishSSN.validate('290296-7808')).to.equal(true);
    });

    it("Should fail when given valid finnishSSN with leap year, divisible by 100 and not by 400", function () {
      expect(finnishSSN.validate('290200-101P')).to.equal(false);
    });

    it("Should pass when given valid finnishSSN with leap year, divisible by 100 and by 400", function () {
      expect(finnishSSN.validate('290200A248A')).to.equal(true);
    });
  });

  describe("#createWithAge", function () {
    it("Should not accept zero age", function () {
      expect(function () {
        finnishSSN.createWithAge(0);
      }).to.throw(/not between sensible age range/);
    });

    it("Should not accept age >= 200", function () {
      expect(function () {
        finnishSSN.createWithAge(201);
      }).to.throw(/not between sensible age range/);
    });

    it("Should createWithAge valid finnishSSN for 21st century", function () {
      var age = 3,
          birthYear = new Date().getFullYear() % 100 - age;
      expect(finnishSSN.createWithAge(age)).to.match(new RegExp("0101" + birthYear + "A[\\d]{3}[A-Z0-9]"));
    });

    it("Should createWithAge valid finnishSSN for 20th century", function () {
      var age = 25,
        birthYear = (new Date().getFullYear() - age) % 100;
      expect(finnishSSN.createWithAge(age)).to.match(new RegExp("0101" + birthYear + "-[\\d]{3}[A-Z0-9]"));
    });

    it("Should createWithAge valid finnishSSN for 19th century", function () {
      var age = 125,
        birthYear = (new Date().getFullYear() - age) % 100;
      expect(finnishSSN.createWithAge(age)).to.match(new RegExp("0101" + birthYear + "\\+[\\d]{3}[A-Z0-9]"));
    });

    it("Should createWithAge valid finnishSSN for year 2000", function () {
      var age = new Date().getFullYear() - 2000;
      expect(finnishSSN.createWithAge(age)).to.match(new RegExp("010100A[\\d]{3}[A-Z0-9]"));
    });

    it("Should createWithAge valid finnishSSN for year 1999", function () {
      var age = new Date().getFullYear() - 1999;
      expect(finnishSSN.createWithAge(age)).to.match(new RegExp("010199-[\\d]{3}[A-Z0-9]"));
    });

    it("Should createWithAge valid finnishSSN for year 1990", function () {
      var age = new Date().getFullYear() - 1990;
      expect(finnishSSN.createWithAge(age)).to.match(new RegExp("010190-[\\d]{3}[A-Z0-9]"));
    });
  });

});
