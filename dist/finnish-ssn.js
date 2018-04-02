(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define("FinnishSSN", ["module", "exports"], factory);
  } else if (typeof exports !== "undefined") {
    factory(module, exports);
  } else {
    var mod = {
      exports: {}
    };
    factory(mod, mod.exports);
    global.FinnishSSN = mod.exports;
  }
})(this, function (module, exports) {
  "use strict";
  /**
   * Project: finnish-ssn
   * Purpose: Validate and generate Finnish SSN's according to https://fi.wikipedia.org/wiki/Henkil%C3%B6tunnus
   * Author:  Ville Komulainen
   */

  //! https://github.com/vkomulai/finnish-ssn | Version: 1.1.0

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _createClass = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  }();

  var FinnishSSN = function () {
    function FinnishSSN() {
      _classCallCheck(this, FinnishSSN);
    }

    _createClass(FinnishSSN, null, [{
      key: "parse",
      value: function parse(ssn) {
        var parseFailedObj = {
          valid: false,
          sex: null,
          ageInYears: null,
          dateOfBirth: null
          //  Sanity and format check, which allows to make safe assumptions on the format.
        };if (!SSN_REGEX.test(ssn)) {
          return parseFailedObj;
        }

        var dayOfMonth = parseInt(ssn.substring(0, 2), 10),
            month = ssn.substring(2, 4),
            centuryId = ssn.charAt(6),
            year = parseInt(ssn.substring(4, 6), 10) + centuryMap[centuryId],
            rollingId = ssn.substring(7, 10),
            checksum = ssn.substring(10, 11),
            sex = parseInt(rollingId, 10) % 2 ? this.MALE : this.FEMALE;
        var daysInMonth = daysInGivenMonth(year, month);

        if (!daysInMonthMap.hasOwnProperty(month) || dayOfMonth > daysInMonth) {
          return parseFailedObj;
        }

        var checksumBase = parseInt(ssn.substring(0, 6) + rollingId, 10),
            dateOfBirth = new Date(year, parseInt(month, 10) - 1, dayOfMonth, 0, 0, 0, 0),
            today = new Date();

        return {
          valid: checksum === checksumTable[checksumBase % 31],
          sex: sex,
          dateOfBirth: dateOfBirth,
          ageInYears: ageInYears(dateOfBirth, today)
        };
      }
    }, {
      key: "validate",
      value: function validate(ssn) {
        return this.parse(ssn).valid;
      }
    }, {
      key: "createWithAge",
      value: function createWithAge(age) {
        if (age < MIN_AGE || age > MAX_AGE) {
          throw "Given age (" + age + ") is not between sensible age range of " + MIN_AGE + " and " + MAX_AGE;
        }
        var today = new Date(),
            year = today.getFullYear() - age,
            month = randomMonth(),
            dayOfMonth = randomDay(year, month),
            centurySign = void 0,
            checksumBase = void 0,
            checksum = void 0,
            rollingId = 99 + randomNumber(800); //  No need for padding when rollingId >= 100


        for (var centuryChar in centuryMap) {
          if (centuryMap[centuryChar] === Math.floor(year / 100) * 100) {
            centurySign = centuryChar;
          }
        }

        if (!birthDayPassed(new Date(year, month - 1, dayOfMonth), today)) {
          year--;
        }
        year = year % 100;

        if (year % 100 < 10) {
          year = "0" + year;
        }
        checksumBase = parseInt(dayOfMonth + month + year + rollingId, 10);
        checksum = checksumTable[checksumBase % 31];

        return dayOfMonth + month + year + centurySign + rollingId + checksum;
      }
    }]);

    return FinnishSSN;
  }();

  FinnishSSN.FEMALE = "female";
  FinnishSSN.MALE = "male";
  exports.default = FinnishSSN;


  var february = "02",
      centuryMap = { "A": 2000, "-": 1900, "+": 1800 },
      daysInMonthMap = {
    "01": 31,
    "02": 28,
    "03": 31,
    "04": 30,
    "05": 31,
    "06": 30,
    "07": 31,
    "08": 31,
    "09": 30,
    "10": 31,
    "11": 30,
    "12": 31
  },
      checksumTable = "0123456789ABCDEFHJKLMNPRSTUVWXY".split("");

  var MIN_AGE = 1,
      MAX_AGE = 200,
      SSN_REGEX = /^[0-3][\d][0-1][0-9][0-9]{2}[+\-A][\d]{3}[\dA-Z]$/;

  function randomMonth() {
    return ("00" + randomNumber(12)).substr(-2, 2);
  }

  function randomDay(year, month) {
    var maxDaysInMonth = daysInGivenMonth(year, month);
    return ("00" + randomNumber(maxDaysInMonth)).substr(-2, 2);
  }

  function daysInGivenMonth(year, month) {
    var daysInMonth = daysInMonthMap[month];
    return month === february && isLeapYear(year) ? daysInMonth + 1 : daysInMonth;
  }

  function randomNumber(max) {
    return Math.floor(Math.random() * max) + 1; // no zero
  }

  function isLeapYear(year) {
    return year % 4 === 0 && year % 100 !== 0 || year % 400 === 0;
  }

  function ageInYears(dateOfBirth, today) {
    return today.getFullYear() - dateOfBirth.getFullYear() - (birthDayPassed(dateOfBirth, today) ? 0 : 1);
  }

  function birthDayPassed(dateOfBirth, today) {
    return dateOfBirth.getMonth() < today.getMonth() || dateOfBirth.getMonth() === today.getMonth() && dateOfBirth.getDate() <= today.getDate();
  }
  module.exports = exports["default"];
});

