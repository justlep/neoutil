var util = require('../src/util');


const DEC_COMMA = ',',
      GROUP_COMMA = ',',
      DEC_DOT = '.',
      GROUP_DOT = '.';

describe('util', function() {

    it('throws errors on assertion failures', function() {

        expect(function() {
            util.assert(false);
        }).toThrow();

        expect(function() {
            util.assert(0);
        }).toThrow();

        var dlkgkdsfghsdkfjg;

        expect(function() { util.assertDefined(dlkgkdsfghsdkfjg);
        }).toThrow();

        dlkgkdsfghsdkfjg = 1;

        expect(function() {
            util.assertDefined(dlkgkdsfghsdkfjg);
        }).not.toThrow();

        expect(function() {
            util.assertBoolean('true');
        }).toThrow();

        expect(function() {
            util.assertBoolean(true);
            util.assertString('true');
            util.assertStringOrEmpty(null);
            util.assertStringOrEmpty(0);
            util.assertStringOrEmpty('');
            util.assertStringOrEmpty('abc');
            util.assertNonEmptyString('abc');
            util.assertNumber(123);
            util.assertNumberInRange(5, 1, 5);
            util.assertFunction(function(){});
            util.assertFunctionOrEmpty(null);
            util.assertFunctionOrEmpty(function(){});
            util.assertObject({});
            util.assertObjectOrEmpty(null);
            util.assertObjectOrEmpty(false);
            util.assertArray([1,2,3]);

        }).not.toThrow();

        expect(function() {
            util.assertString(true);
        }).toThrow();
        expect(function() {
            util.assertStringOrEmpty(123);
        }).toThrow();
        expect(function() {
            util.assertNonEmptyString('');
        }).toThrow();
        expect(function() {
            util.assertNonEmptyString(123);
        }).toThrow();
        expect(function() {
            util.assertNonEmptyString(true);
        }).toThrow();
        expect(function() {
            util.assertNumber('123');
        }).toThrow();
        expect(function() {
            util.assertNumber(null);
        }).toThrow();
        expect(function() {
            util.assertNumberInRange(5, 1, 4);
        }).toThrow();
        expect(function() {
            util.assertNumberInRange('4', 1, 5);
        }).toThrow();
        expect(function() {
            util.assertNumberInRange(parseInt('abc'), 1, 5);
        }).toThrow();
        expect(function() {
            util.assertFunction(null);
        }).toThrow();
        expect(function() {
            util.assertFunction('abc');
        }).toThrow();
        expect(function() {
            util.assertObject(null);
        }).toThrow();
        expect(function() {
            util.assertObjectOrEmpty('null');
        }).toThrow();
        expect(function() {
            util.assertObjectOrEmpty(123);
        }).toThrow();
        expect(function() {
            util.assertArray(123);
        }).toThrow();
        expect(function() {
            util.assertArray({a:1,b:2});
        }).toThrow();
    });

    it('throws nicely formatted errors on assertion failures', function() {
        expect(function(){
            util.assert(false, '123{}456', 'xx')
        }).toThrow('123xx456');

        expect(function(){
            var min = 10, max = 20;
            util.assertNumberInRange(5, min, max, 'Number must be within {} and {}', min, max);
        }).toThrow('Number must be within 10 and 20');

        expect(function(){
            var min = 10, max = 20;
            util.assertNumberInRange(5, min, max, 'Number must be within {} and {}');
        }).toThrow('Number must be within {} and {}');
    });

    it('formats strings using formatString()', function() {
        expect(util.formatString('ABC{}DE{}F', '_', 'x')).toEqual('ABC_DExF');
        expect(util.formatString('ABC{}DE{}F', '_', '')).toEqual('ABC_DEF');
        expect(util.formatString('ABC{}DE{}F', '_')).toEqual('ABC_DE{}F');
        expect(util.formatString('ABC{}DE{}F', '_', null)).toEqual('ABC_DEnullF');
        expect(util.formatString('ABC', 'x', 'y', 'z')).toEqual('ABC');
        expect(util.formatString('ABC')).toEqual('ABC');
    });

    it('formats numbers using formatNumber()', function() {
        expect(util.formatNumber(1, 0, GROUP_COMMA, DEC_DOT)).toEqual('1');
        expect(util.formatNumber(1, 1, GROUP_COMMA, DEC_DOT)).toEqual('1.0');
        expect(util.formatNumber(1, 2, GROUP_COMMA, DEC_DOT)).toEqual('1.00');

        expect(util.formatNumber(1, 0, GROUP_COMMA, DEC_COMMA)).toEqual('1');
        expect(util.formatNumber(1, 1, GROUP_COMMA, DEC_COMMA)).toEqual('1,0'); // doesnt make sense though
        expect(util.formatNumber(1, 2, GROUP_COMMA, DEC_COMMA)).toEqual('1,00');

        expect(util.formatNumber(1000, 0, GROUP_COMMA, DEC_DOT)).toEqual('1,000');
        expect(util.formatNumber(1000.126, 1, GROUP_COMMA, DEC_DOT)).toEqual('1,000.1');
        expect(util.formatNumber(1000.126, 2, GROUP_COMMA, DEC_DOT)).toEqual('1,000.13');

        expect(util.formatNumber(1000, 0, GROUP_DOT, DEC_COMMA)).toEqual('1.000');
        expect(util.formatNumber(1000.126, 1, GROUP_DOT, DEC_COMMA)).toEqual('1.000,1');
        expect(util.formatNumber(1000.126, 2, GROUP_DOT, DEC_COMMA)).toEqual('1.000,13');

        expect(util.formatNumber(456789123, 0, GROUP_COMMA, DEC_DOT)).toEqual('456,789,123');
        expect(util.formatNumber(3456789123, 0, GROUP_COMMA, DEC_DOT)).toEqual('3,456,789,123');
        expect(util.formatNumber(23456789123, 0, GROUP_COMMA, DEC_DOT)).toEqual('23,456,789,123');
        expect(util.formatNumber(123456789123, 0, GROUP_COMMA, DEC_DOT)).toEqual('123,456,789,123');

        expect(util.formatNumber(456789123.98, 2, GROUP_COMMA, DEC_DOT)).toEqual('456,789,123.98');
        expect(util.formatNumber(3456789123.98, 2, GROUP_COMMA, DEC_DOT)).toEqual('3,456,789,123.98');
        expect(util.formatNumber(23456789123.98, 2, GROUP_COMMA, DEC_DOT)).toEqual('23,456,789,123.98');
        expect(util.formatNumber(123456789123.98, 2, GROUP_COMMA, DEC_DOT)).toEqual('123,456,789,123.98');

        expect(util.formatNumber(123456789123.94, 1, GROUP_COMMA, DEC_DOT)).toEqual('123,456,789,123.9');
        expect(util.formatNumber(123456789123.949, 1, GROUP_COMMA, DEC_DOT)).toEqual('123,456,789,123.9');
        expect(util.formatNumber(123456789123.95, 1, GROUP_COMMA, DEC_DOT)).toEqual('123,456,789,124.0');
        expect(util.formatNumber(123456789123.96, 1, GROUP_COMMA, DEC_DOT)).toEqual('123,456,789,124.0');
        expect(util.formatNumber(123456789123.0001, 1, GROUP_COMMA, DEC_DOT)).toEqual('123,456,789,123.0');
        expect(util.formatNumber(123456789123.05, 1, GROUP_COMMA, DEC_DOT)).toEqual('123,456,789,123.1');
        expect(util.formatNumber(123456789123.05, 2, GROUP_DOT, DEC_COMMA)).toEqual('123.456.789.123,05');

        expect(util.formatNumber(123456789123.005, 0, GROUP_COMMA, DEC_DOT)).toEqual('123,456,789,123');
        expect(util.formatNumber(123456789123.005, 1, GROUP_COMMA, DEC_DOT)).toEqual('123,456,789,123.0');
        expect(util.formatNumber(123456789123.005, 2, GROUP_COMMA, DEC_DOT)).toEqual('123,456,789,123.01');
        expect(util.formatNumber(123456789123.005, 3, GROUP_COMMA, DEC_DOT)).toEqual('123,456,789,123.005');
    });

    /**
     * Rounding decimal numbers in JavaScript needs some special treatment, see
     *  -> https://developer.mozilla.org/de/docs/Web/JavaScript/Reference/Global_Objects/Math/round
     *  ->
     */
    it('handles rounding "critical" numbers correctly', function() {
        expect(util.formatNumber(35.855, 3, GROUP_COMMA, DEC_DOT)).toEqual('35.855');
        expect(util.formatNumber(35.855, 2, GROUP_COMMA, DEC_DOT)).toEqual('35.86');
        expect(util.formatNumber(35.855, 1, GROUP_COMMA, DEC_DOT)).toEqual('35.9');
        expect(util.formatNumber(35.855, 0, GROUP_COMMA, DEC_DOT)).toEqual('36');

        expect(util.formatNumber(1.005, 3, GROUP_COMMA, DEC_DOT)).toEqual('1.005');
        expect(util.formatNumber(1.005, 2, GROUP_COMMA, DEC_DOT)).toEqual('1.01');
        expect(util.formatNumber(1.005, 1, GROUP_COMMA, DEC_DOT)).toEqual('1.0');
        expect(util.formatNumber(1.005, 0, GROUP_COMMA, DEC_DOT)).toEqual('1');
    });

    it('formats money using formatMoney()', function() {
        expect(util.formatMoney(1, GROUP_COMMA, DEC_DOT)).toEqual('1.00');
        expect(util.formatMoney(1.051, GROUP_COMMA, DEC_DOT)).toEqual('1.05');
        expect(util.formatMoney(1.055, GROUP_COMMA, DEC_DOT)).toEqual('1.06');
        expect(util.formatMoney(1.061, GROUP_COMMA, DEC_DOT)).toEqual('1.06');

        expect(util.formatMoney(1, GROUP_COMMA, DEC_COMMA)).toEqual('1,00'); // doesnt make sense though
        expect(util.formatMoney(1, GROUP_COMMA, DEC_COMMA)).toEqual('1,00');

        expect(util.formatMoney(100, GROUP_COMMA, DEC_DOT)).toEqual('100.00');
        expect(util.formatMoney(1000, GROUP_COMMA, DEC_DOT)).toEqual('1,000.00');
        expect(util.formatMoney(1000.126, GROUP_COMMA, DEC_DOT)).toEqual('1,000.13');
        expect(util.formatMoney(1000.126, GROUP_COMMA, DEC_DOT)).toEqual('1,000.13');

        expect(util.formatMoney(-1000.126, GROUP_COMMA, DEC_DOT)).toEqual('-1,000.13');

        expect(util.formatMoney(1000, GROUP_DOT, DEC_COMMA)).toEqual('1.000,00');
        expect(util.formatMoney(1000.124, GROUP_DOT, DEC_COMMA)).toEqual('1.000,12');
        expect(util.formatMoney(1000.125, GROUP_DOT, DEC_COMMA)).toEqual('1.000,13');
        expect(util.formatMoney(1000.126, GROUP_DOT, DEC_COMMA)).toEqual('1.000,13');
        expect(util.formatMoney(1000.999, GROUP_DOT, DEC_COMMA)).toEqual('1.001,00');

        expect(util.formatMoney(456789123, GROUP_COMMA, DEC_DOT)).toEqual('456,789,123.00');
        expect(util.formatMoney(3456789123, GROUP_COMMA, DEC_DOT)).toEqual('3,456,789,123.00');
        expect(util.formatMoney(23456789123, GROUP_COMMA, DEC_DOT)).toEqual('23,456,789,123.00');
        expect(util.formatMoney(123456789123, GROUP_COMMA, DEC_DOT)).toEqual('123,456,789,123.00');

        expect(util.formatMoney(456789123.98, GROUP_COMMA, DEC_DOT)).toEqual('456,789,123.98');
        expect(util.formatMoney(3456789123.98, GROUP_COMMA, DEC_DOT)).toEqual('3,456,789,123.98');
        expect(util.formatMoney(23456789123.98, GROUP_COMMA, DEC_DOT)).toEqual('23,456,789,123.98');
        expect(util.formatMoney(123456789123.98, GROUP_COMMA, DEC_DOT)).toEqual('123,456,789,123.98');
        expect(util.formatMoney(-123456789123.98, GROUP_COMMA, DEC_DOT)).toEqual('-123,456,789,123.98');

        expect(util.formatMoney(123456789123.94, GROUP_COMMA, DEC_DOT)).toEqual('123,456,789,123.94');
        expect(util.formatMoney(123456789123.949, GROUP_COMMA, DEC_DOT)).toEqual('123,456,789,123.95');
        expect(util.formatMoney(-123456789123.949, GROUP_COMMA, DEC_DOT)).toEqual('-123,456,789,123.95');
        expect(util.formatMoney(123456789123.95, GROUP_COMMA, DEC_DOT)).toEqual('123,456,789,123.95');
        expect(util.formatMoney(123456789123.96, GROUP_COMMA, DEC_DOT)).toEqual('123,456,789,123.96');
        expect(util.formatMoney(123456789123.98, GROUP_COMMA, DEC_DOT)).toEqual('123,456,789,123.98');
        expect(util.formatMoney(123456789123.0001, GROUP_COMMA, DEC_DOT)).toEqual('123,456,789,123.00');
        expect(util.formatMoney(123456789123.05, GROUP_COMMA, DEC_DOT)).toEqual('123,456,789,123.05');
        expect(util.formatMoney(123456789123.05, GROUP_DOT, DEC_COMMA)).toEqual('123.456.789.123,05');

        expect(util.formatMoney(123456789123.005, GROUP_COMMA, DEC_DOT)).toEqual('123,456,789,123.01');
        expect(util.formatMoney(123456789123.005, GROUP_DOT, DEC_COMMA)).toEqual('123.456.789.123,01');
    });

    it('does correct round/floor/ceil math with custom decimal precisions', function() {
        expect(util.round10(55.549, 1)).toBe(55.5);
        expect(util.round10(1.005)).toBe(1);
        expect(util.round10(1.005, 1)).toBe(1);
        expect(util.round10(1.005, 2)).toBe(1.01);            // <-- Math.round would be wrong here
        expect(Math.round(1.005 * 100) / 100).not.toBe(1.01); // <-- "same" as above w/ Math.round => diff. result
        expect(util.round10(-55.549, 1)).toBe(-55.5);
        expect(util.round10(-55.559, 1)).toBe(-55.6);
        expect(util.round10(-1.005)).toBe(-1);
        expect(util.round10(-1.005, 1)).toBe(-1);
        expect(util.round10(-1.005, 2)).toBe(-1);
        expect(Math.round(-1.005 * 10) / 10).toBe(-1); // same in native Math.round

        expect(util.floor10(55.549, 1)).toBe(55.5);
        expect(util.floor10(55.559, 1)).toBe(55.5);
        expect(util.floor10(1.005)).toBe(1);
        expect(util.floor10(1.005, 1)).toBe(1);
        expect(util.floor10(1.005, 2)).toBe(1);
        expect(util.floor10(1.123)).toBe(1);
        expect(util.floor10(1.123, 1)).toBe(1.1);
        expect(util.floor10(1.123, 2)).toBe(1.12);
        expect(util.floor10(-1.005, 2)).toBe(-1.01);
        expect(util.floor10(-1.123, 1)).toBe(-1.2);
        expect(util.floor10(-1.123, 2)).toBe(-1.13);

        expect(util.ceil10(55.549, 1)).toBe(55.6);
        expect(util.ceil10(55.559, 1)).toBe(55.6);
        expect(util.ceil10(1.005)).toBe(2);
        expect(util.ceil10(1.005, 1)).toBe(1.1);
        expect(util.ceil10(1.005, 2)).toBe(1.01);
        expect(util.ceil10(1.123)).toBe(2);
        expect(util.ceil10(1.123, 1)).toBe(1.2);
        expect(util.ceil10(1.123, 2)).toBe(1.13);
        expect(util.ceil10(-1.005, 2)).toBe(-1);
        expect(util.ceil10(-1.123, 1)).toBe(-1.1);
        expect(util.ceil10(-1.123, 2)).toBe(-1.12);
    });

    it('generates positive IDs using nextId()', function() {
        var firstId = util.nextId();
        expect(firstId).toEqual(jasmine.any(Number));
        expect(firstId).toBeGreaterThan(0);
        expect(util.nextId()).toBe(firstId + 1);
        expect(util.nextId()).toBe(firstId + 2);
    });

    it('measures time differences in millis', function(done) {
        var ID1 = 1,
            ID2 = 3,
            TIME_TO_MEASURE_IN_SECONDS = 0.4,
            TIME_TO_MEASURE_IN_MILLIS = TIME_TO_MEASURE_IN_SECONDS * 1000;

        util.startTimer(ID1);

        setTimeout(function() {
            expect(util.stopTimer(ID1) / 1000 ).toBeCloseTo(TIME_TO_MEASURE_IN_SECONDS, 1);
            expect(util.stopTimer(ID1) / 1000 ).toBeCloseTo(TIME_TO_MEASURE_IN_SECONDS, 1);
            expect(util.stopTimer(ID2)).toBe(-1);
            done();
        }, TIME_TO_MEASURE_IN_MILLIS);
    });

    it('can tell if a number is in a given range', function() {
        expect(util.isNumberInRange(null)).toBe(false);
        expect(util.isNumberInRange('123')).toBe(false);
        expect(util.isNumberInRange('123', 1, 200)).toBe(false);
        expect(util.isNumberInRange(123, 1, 200)).toBe(true);
        expect(util.isNumberInRange(1, 1, 200)).toBe(true);
        expect(util.isNumberInRange(200, 1, 200)).toBe(true);
        expect(util.isNumberInRange(201, 1, 200)).toBe(false);
        expect(util.isNumberInRange(-201, 1, 200)).toBe(false);
    });
});
