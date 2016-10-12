/*jshint -W030 */
/**
 * A tiny utility collection, mainly for assertion and formatting purposes.
 *
 * https://github.com/justlep/neoutil
 *
 * @license MIT
 */
;(function (root, factory) {
    'use strict';

    if (typeof define === 'function' && define.amd) {
        define([], factory);
    } else if (typeof module === 'object' && typeof (module||{}).exports === 'object') {
        module.exports = factory();
    } else {
        root.util = factory();
    }
})(this, function() {

    'use strict';

    var DEFAULT_NUMBER_GROUP_DELIMITER = ',',
        DEFAULT_NUMBER_DECIMALS_DELIMITER = '.',
        NOP = function(){},
        util,
        idsCounter = 0,
        startTimesById = {},
        console = (typeof console === 'object') ? console : {
            log: NOP,
            error: NOP
        },
        /**
         * Throws an error;
         * To be called from within one of the static assert* methods.
         * @param assertionArgs (Arguments) the original arguments from the assert*-call
         * @param [optionalMessageOffset] (Number) optional offset of the actual error message
         *                                         within the assertionArgs (default: 1)
         */
        throwError = function(assertionArgs, optionalMessageOffset) {
            var messageOffset = optionalMessageOffset || 1,
                messageAndArgumentsArray = Array.prototype.slice.call(assertionArgs, messageOffset),
                emptySafeMessageAndArgsArray = (messageAndArgumentsArray.length) ?
                                                    messageAndArgumentsArray : ['Assertion failed'],
                errorMessage = util.formatString.apply(null, emptySafeMessageAndArgsArray);

            console.error(errorMessage);
            throw errorMessage;
        },
        /**
         * Origin: https://developer.mozilla.org/de/docs/Web/JavaScript/Reference/Global_Objects/Math/round
         * Decimal adjustment of a number.
         *
         * @param (String)  type  The type of adjustment.
         * @param (Number)  value The number.
         * @param (Integer) exp   The exponent (the 10 logarithm of the adjustment base), e.g. -2 for 2 digits precision
         * @returns (Number) The adjusted value.
         */
         decimalAdjust = function(type, value, exp) {
            // If the exp is undefined or zero...
            if (typeof exp === 'undefined' || +exp === 0) {
                return Math[type](value);
            }
            value = +value;
            exp = +exp;
            // If the value is not a number or the exp is not an integer...
            if (isNaN(value) || !(typeof exp === 'number' && exp % 1 === 0)) {
                return NaN;
            }
            // Shift
            value = value.toString().split('e');
            value = Math[type](+(value[0] + 'e' + (value[1] ? (+value[1] - exp) : -exp)));
            // Shift back
            value = value.toString().split('e');
            return +(value[0] + 'e' + (value[1] ? (+value[1] + exp) : exp));
        };

    util = {
        NOP: NOP,
        nextId: function() {
            return ++idsCounter;
        },

        /**
         * Returns a given String with placeholders replaced.
         * Contained placeholders '{}' will be replaced with additional parameters in the respective order.
         * @param s (mixed) what to print
         * @params (mixed*) (optional) any number of values replacing the placeholders in s
         */
        formatString: function(s) {
            var out = '' + s;
            for (var i = 1, len = arguments.length; i < len; ++i) {
                out = out.replace('{}', arguments[i]);
            }
            return out;
        },

        /**
         * Formats a given number.
         * Inspired by: http://stackoverflow.com/questions/149055/how-can-i-format-numbers-as-money-in-javascript
         *
         * @param numberToFormat (number) the number to format
         * @param [decimals] (number) length of decimal part (default: 2)
         * @param [groupDelimiter] (String) sections delimiter (default: {@link DEFAULT_NUMBER_GROUP_DELIMITER})
         * @param [commaOrPoint] (String) decimal delimiter (default: {@link DEFAULT_NUMBER_DECIMALS_DELIMITER})
         */
        formatNumber: function(numberToFormat, decimals, groupDelimiter, commaOrPoint) {
            var groupSize = 3,
                _decimals = (typeof decimals === 'number') ? decimals : 2,
                re = '\\d(?=(\\d{' + (groupSize || 3) + '})+' + (_decimals > 0 ? '\\D' : '$') + ')',
                decimalsDelimiter = commaOrPoint || DEFAULT_NUMBER_DECIMALS_DELIMITER,
                effectiveGroupDelimiter = groupDelimiter || DEFAULT_NUMBER_GROUP_DELIMITER,
                num = this.round10(numberToFormat, _decimals).toFixed(_decimals);

            return num.replace('.', decimalsDelimiter).replace(new RegExp(re, 'g'), '$&' + (effectiveGroupDelimiter));
        },

        /**
         * @param num (Number)
         * @param [groupDelimiter] (String) default is {@link DEFAULT_NUMBER_GROUP_DELIMITER}
         * @param [commaOrPoint] (String) default is {@link DEFAULT_NUMBER_DECIMALS_DELIMITER}
         * @returns String
         */
        formatMoney: function(num, groupDelimiter, commaOrPoint) {
            return this.formatNumber(num, 2, groupDelimiter, commaOrPoint);
        },

        assert: function(expr) {
            expr || throwError(arguments);
        },
        assertDefined: function(expr) {
            (typeof expr !== 'undefined') || throwError(arguments);
        },
        assertBoolean: function(expr) {
            (typeof expr === 'boolean') || throwError(arguments);
        },
        assertBooleanOrUndefined: function(expr) {
            (typeof expr === 'boolean' || typeof expr === 'undefined') || throwError(arguments);
        },
        assertString: function(expr) {
            (typeof expr === 'string') || throwError(arguments);
        },
        assertNonEmptyString: function(expr) {
            (typeof (!!expr && expr) === 'string') || throwError(arguments);
        },
        assertStringOrEmpty: function(expr) {
            (!expr || typeof expr === 'string') || throwError(arguments);
        },
        assertNumber: function(expr) {
            (typeof expr === 'number') || throwError(arguments);
        },
        assertNumberInRange: function(expr, min, max) {
            (typeof expr === 'number' && expr >= min && expr <= max) || throwError(arguments, 3);
        },
        assertNumberInRangeOrEmpty: function(expr, min, max) {
            (!expr || (typeof expr === 'number' && expr >= min && expr <= max)) || throwError(arguments, 3);
        },
        assertFunction: function(expr) {
            (typeof expr === 'function') || throwError(arguments);
        },
        assertFunctionOrEmpty: function(expr) {
            (!expr || (typeof expr === 'function')) || throwError(arguments);
        },
        assertObject: function(expr) {
            (expr && typeof expr === 'object') || throwError(arguments);
        },
        assertObjectOrEmpty: function(expr) {
            (!expr || (typeof expr === 'object')) || throwError(arguments);
        },
        assertArray: function(expr) {
            (expr && expr instanceof Array) || throwError(arguments);
        },
        assertArrayOrEmpty: function(expr) {
            (!expr || expr instanceof Array) || throwError(arguments);
        },
        assertElement: function(expr) {
            (!!(expr && expr.nodeType === 1)) || throwError(arguments);
        },
        assertObjectHasProperties: function(obj, propertyNames) {
            this.assertObject(obj, arguments[2] || 'Given obj parameter is not an object');
            (propertyNames||[]).forEach(function(propName) {
                if (typeof obj[propName] === 'undefined') {
                    console.error(arguments[2] || 'Given object is invalid');
                    throwError([obj, 'Missing property: "{}"']);
                }
            });
        },

        /**
         * @param num (Number)
         * @param min (Number)
         * @param max (Number)
         * @returns {boolean} true if num is a number and within min and max
         */
        isNumberInRange: function(num, min, max) {
            return typeof num === 'number' && num >= min && num <= max;
        },

        /**
         * Memorizes the current time under a given id.
         * A subsequent call of {@link #stopTimer} will then return the time difference in millis.
         * @param id (Number) some id
         */
        startTimer: function(id) {
            this.assert(!!id, 'invalid id for util.startTime: ', id);
            startTimesById[''+id] = +new Date();
        },
        /**
         * Returns the time in milliseconds that passed between now
         * and the last call of {@link #startTimer} for a given id.
         * @param id (Number) some id
         * @return (Number) time in millis; -1 if timerStart wasn't called for that id before
         */
        stopTimer: function(id) {
            var now = +new Date();
            return now - (startTimesById[''+id] || (now + 1));
        },

        /**
         * Binds a method to a given context.
         * @param fn (function)
         * @param context (Object) this-context to preserve for invocations
         */
        bind: function(fn, context) {
            return function() {
                return fn.apply(context, arguments);
            };
        },

        /**
         * Rounds the given number to a given number of decimals (mathematically correct, unlike Math.round)
         * See https://developer.mozilla.org/de/docs/Web/JavaScript/Reference/Global_Objects/Math/round)
         * @param value (Number)
         * @param [digits] (Number)
         * @returns (Number)
         */
        round10: function(value, decimals) {
            return decimalAdjust('round', value, -(decimals||0));
        },
        floor10: function(value, decimals) {
            return decimalAdjust('floor', value, -(decimals||0));
        },
        ceil10: function(value, decimals) {
            return decimalAdjust('ceil', value, -(decimals||0));
        }
    };

    return util;
});