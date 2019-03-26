const should = require('should');
const {Type, StrictType, getChecks, getRuleParams, check, CHECK, CHECKS} = require('../');

/* global describe */
/* global it */

describe('TypedProps', function() {
  describe('Interface', function() {
    describe('check()', function() {
      it('Should check values', function() {
        const value = void 0;

        const type = Type.isRequired;

        const report = check(value, type);

        should(report).has.lengthOf(1);
        should(report[0].path).be.deepEqual([]);
        should(report[0].rule).be.equal('isRequired');
      });
    });

    describe('getChecks()', function() {
      it('should return array of checks', function() {
        const type = Type.string.isRequired;
        const checks = getChecks(type);

        should(checks).be.an.Array();
        should(type[CHECKS]).not.equal(checks);
        should(type[CHECKS]).deepEqual(checks);
      });
    });

    describe('getRuleParams()', function() {
      it('Should return check by name if it exists', function() {
        const type = Type.string.isRequired;
        const check = getRuleParams(type, 'isRequired');

        should(check).be.deepEqual({isRequired: true});
      });

      it('Should return null for check wich not exists', function() {
        const type = Type.string.isRequired;
        const check = getRuleParams(type, 'X');

        should(check).be.equal(void 0);
      });
    });

    describe('Immutablitiy', function() {
      it('should be immutable with primitives', function() {
        const type1 = Type.number;
        const type2 = type1.isRequired;

        should(type1).not.equal(type2);
      });

      it('should be immutable with shapes', function() {
        const shape1 = Type.shape({
          name: Type.string.isRequired,
        });
        const shape2 = shape1.isRequired;
        should(shape1).not.equal(shape2);
      });

      it('Should replace previously defined params', function() {
        const type = Type
        .instanceOf(Array)
        .instanceOf(Date);

        const dateReport = check(new Date(), type);

        should(dateReport).has.lengthOf(0);

        const arrayReport = check(new Array(), type);
        
        should(arrayReport).has.lengthOf(1);
        should(arrayReport[0].rule).be.equal('instanceOf');
      });
    });
  });

  describe('Built-in checkers', function() {
    describe('isRequired()', function() {
      it('Should pass not undefined', function() {
        const value = 1;

        const type = Type.isRequired;

        const report = check(value, type);

        should(report).has.lengthOf(0);
      });

      it('Should not pass not undefined', function() {
        const value = void 0;

        const type = Type.isRequired;

        const report = check(value, type);

        should(report).has.lengthOf(1);
        should(report[0].rule).be.equal('isRequired');
      });
    });

    describe('number()', function() {
      it('Should pass number', function() {
        const value = 1;

        const type = Type.number;

        const report = check(value, type);

        should(report).has.lengthOf(0);
      });

      it('Should pass undefined', function() {
        const value = void 0;

        const type = Type.number;

        const report = check(value, type);

        should(report).has.lengthOf(0);
      });

      it('Should not pass not a number', function() {
        const value = null;

        const type = Type.number;

        const report = check(value, type);

        should(report).has.lengthOf(1);
        should(report[0].rule).be.equal('number');
      });
    });

    describe('string()', function() {
      it('Should pass string', function() {
        const value = 'hello';

        const type = Type.string;

        const report = check(value, type);

        should(report).has.lengthOf(0);
      });

      it('Should pass undefined', function() {
        const value = void 0;

        const type = Type.string;

        const report = check(value, type);

        should(report).has.lengthOf(0);
      });

      it('Should not pass not string', function() {
        const value = null;

        const type = Type.string;

        const report = check(value, type);

        should(report).has.lengthOf(1);
        should(report[0].rule).be.equal('string');
      });
    });

    describe('bool()', function() {
      it('Should pass boolean', function() {
        const value = true;

        const type = Type.bool;

        const report = check(value, type);

        should(report).has.lengthOf(0);
      });

      it('Should pass undefined', function() {
        const value = void 0;

        const type = Type.bool;

        const report = check(value, type);

        should(report).has.lengthOf(0);
      });

      it('Should not pass not boolean', function() {
        const value = null;

        const type = Type.bool;

        const report = check(value, type);

        should(report).has.lengthOf(1);
        should(report[0].rule).be.equal('bool');
      });
    });

    describe('object()', function() {
      it('Should pass object', function() {
        const value = {};

        const type = Type.object;

        const report = check(value, type);

        should(report).has.lengthOf(0);
      });

      it('Should pass undefined', function() {
        const value = void 0;

        const type = Type.object;

        const report = check(value, type);

        should(report).has.lengthOf(0);
      });

      it('Should not pass not an object', function() {
        const value = null;

        const type = Type.object;

        const report = check(value, type);

        should(report).has.lengthOf(1);
        should(report[0].rule).be.equal('object');
      });
    });

    describe('array()', function() {
      it('Should pass array', function() {
        const value = [];

        const type = Type.array;

        const report = check(value, type);

        should(report).has.lengthOf(0);
      });

      it('Should pass undefined', function() {
        const value = void 0;

        const type = Type.array;

        const report = check(value, type);

        should(report).has.lengthOf(0);
      });

      it('Should not pass not array', function() {
        const value = null;

        const type = Type.array;

        const report = check(value, type);

        should(report).has.lengthOf(1);
        should(report[0].rule).be.equal('array');
      });
    });

    describe('func()', function() {
      it('Should pass function', function() {
        const value = function(){};

        const type = Type.func;

        const report = check(value, type);

        should(report).has.lengthOf(0);
      });

      it('Should pass undefined', function() {
        const value = void 0;

        const type = Type.func;

        const report = check(value, type);

        should(report).has.lengthOf(0);
      });

      it('Should not pass not function', function() {
        const value = null;

        const type = Type.func;

        const report = check(value, type);

        should(report).has.lengthOf(1);
        should(report[0].rule).be.equal('func');
      });
    });

    describe('symbol()', function() {
      it('Should pass symbol', function() {
        const value = Symbol('Symbol');

        const type = Type.symbol;

        const report = check(value, type);

        should(report).has.lengthOf(0);
      });

      it('Should pass undefined', function() {
        const value = void 0;

        const type = Type.symbol;

        const report = check(value, type);

        should(report).has.lengthOf(0);
      });

      it('Should not pass not symbol', function() {
        const value = null;

        const type = Type.symbol;

        const report = check(value, type);

        should(report).has.lengthOf(1);
        should(report[0].rule).be.equal('symbol');
      });
    });

    describe('instanceOf()', function() {
      it('Should pass [] as instance of Array', function() {
        const value = [];

        const type = Type.instanceOf(Array);

        const report = check(value, type);

        should(report).has.lengthOf(0);
      });

      it('Should pass undefined', function() {
        const value = void 0;

        const type = Type.instanceOf(Object);

        const report = check(value, type);

        should(report).has.lengthOf(0);
      });

      it('Should not {} as instance of Array', function() {
        const value = {};

        const type = Type.instanceOf(Array);

        const report = check(value, type);

        should(report).has.lengthOf(1);
        should(report[0].rule).be.equal('instanceOf');
      });
    });

    describe('oneOf()', function() {
      it('Should pass correct', function() {
        const value = 7;

        const type = Type.oneOf([1, 2, 3, 5, 7]);

        const report = check(value, type);

        should(report).has.lengthOf(0);
      });

      it('Should pass undefined', function() {
        const value = void 0;

        const type = Type.oneOf([]);

        const report = check(value, type);

        should(report).has.lengthOf(0);
      });

      it('Should not pass not object', function() {
        const value = 7;

        const type = Type.oneOf([1, 2, 3, 5]);

        const report = check(value, type);

        should(report).has.lengthOf(1);
        should(report[0].rule).be.equal('oneOf');
      });
    });

    describe('arrayOf()', function() {
      it('Should pass array of numbers', function() {
        const value = [1];

        const type = Type.arrayOf(
          Type.number
        );

        const report = check(value, type);

        should(report).has.lengthOf(0);
      });

      it('Should pass undefined', function() {
        const value = void 0;

        const type = Type.arrayOf(Type.isRequired);

        const report = check(value, type);

        should(report).has.lengthOf(0);
      });

      it('Should not pass not array', function() {
        const value = null;

        const type = Type.arrayOf(
          Type.number
        );

        const report = check(value, type);

        should(report).has.lengthOf(1);
        should(report[0].path).be.deepEqual([]);
        should(report[0].rule).be.equal('arrayOf');
      });

      it('Should not pass array of not numbers', function() {
        const value = [null];

        const type = Type.arrayOf(
          Type.number
        );

        const report = check(value, type);

        should(report).has.lengthOf(1);
        should(report[0].path).be.deepEqual([0]);
        should(report[0].rule).be.equal('number');
      });
    });

    describe('oneOfType()', function() {
      it('Should pass correct', function() {
        const value = 'hello';

        const type = Type.oneOfType([
          Type.number,
          Type.string,
        ]);

        const report = check(value, type);

        should(report).has.lengthOf(0);
      });

      it('Should pass undefined', function() {
        const value = void 0;

        const type = Type.oneOfType([]);

        const report = check(value, type);

        should(report).has.lengthOf(0);
      });

      it('Should not pass incorrect', function() {
        const value = null;

        const type = Type.oneOfType([
          Type.number,
          Type.string,
        ]);

        const report = check(value, type);

        should(report).has.lengthOf(1);
        should(report[0].path).be.deepEqual([]);
        should(report[0].rule).be.equal('oneOfType');
      });
    });

    describe('objectOf()', function() {
      it('Should pass correct', function() {
        const value = {
          one: 1,
          two: 0,
        };

        const type = Type.objectOf(Type.number);

        const report = check(value, type);

        should(report).has.lengthOf(0);
      });

      it('Should pass undefined', function() {
        const value = void 0;

        const type = Type.objectOf(Type.number);

        const report = check(value, type);

        should(report).has.lengthOf(0);
      });

      it('Should not pass not an Object', function() {
        const value = null;

        const type = Type.objectOf(Type.number);

        const report = check(value, type);

        should(report[0].path).be.deepEqual([]);
        should(report[0].rule).be.equal('objectOf');
      });

      it('Should not pass incorrect', function() {
        const value = {
          one: 1,
          two: null,
        };

        const type = Type.objectOf(Type.number);

        const report = check(value, type);

        should(report).has.lengthOf(1);

        should(report[0].path).be.deepEqual(['two']);
        should(report[0].rule).be.equal('number');
      });
    });

    describe('select()', function() {
      it('Should select type', function() {
        const selectType = Type.select(
          [({type}) => type === 'user', Type.object.isRequired]
        );

        const report = check({type: 'user'}, selectType);
        should(report).has.lengthOf(0);
      });

      it('Should verify type', function() {
        const userShape = Type.shape({
          name: Type.string.isRequired,
        })
        .isRequired;

        const selectType = Type.select(
          [({type}) => type === 'user', userShape]
        );

        const report = check({type: 'user'}, selectType);

        should(report).has.lengthOf(1);
        should(report[0].path).be.deepEqual(['name']);
        should(report[0].rule).be.equal('isRequired');
      });

      it('Should return `select` issue if type not selected', function() {
        const selectType = Type.select(
          [({type}) => type === 'user', Type.object.isRequired]
        );

        const report = check({type: 'file'}, selectType);

        should(report).has.lengthOf(1);
        should(report[0].path).be.deepEqual([]);
        should(report[0].rule).be.equal('select');
      });
    });

    describe('shape()', function() {
      it('Should pass correct', function() {
        const value = {
          one: 1,
          two: 0,
        };

        const type = Type.shape({
          one: Type.number,
          two: Type.number,
        });

        const report = check(value, type);

        should(report).has.lengthOf(0);
      });

      it('Should pass undefined', function() {
        const value = void 0;

        const type = Type.shape({});

        const report = check(value, type);

        should(report).has.lengthOf(0);
      });

      it('Should not pass not an object', function() {
        const value = null;

        const type = Type.shape({});

        const report = check(value, type);

        should(report).has.lengthOf(1);
        should(report[0].rule).be.equal('shape');
      });

      it('Should not pass incorrect', function() {
        const value = {
          one: 1,
          two: false,
        };

        const type = Type.shape({
          one: Type.number,
          two: Type.number,
          three: Type.isRequired,
        });

        const report = check(value, type);

        should(report).has.lengthOf(2);

        should(report[0].path).be.deepEqual(['two']);
        should(report[0].rule).be.equal('number');

        should(report[1].path).be.deepEqual(['three']);
        should(report[1].rule).be.equal('isRequired');
      });
    });

  });
  
  describe('StrictTypedProps', () => {
    describe('.bool', () => {
      it('Should add isRequired by default', () => {
        const type = StrictType.bool;
        const report = check(void 0, type);
  
        should(report).has.lengthOf(1);
        should(report[0].rule).be.equal('isRequired');
      });
    });

    describe('.number', () => {
      it('Should add isRequired by default', () => {
        const type = StrictType.number;
        const report = check(void 0, type);
  
        should(report).has.lengthOf(1);
        should(report[0].rule).be.equal('isRequired');
      });
    });

    describe('.string', () => {
      it('Should add isRequired by default', () => {
        const type = StrictType.string;
        const report = check(void 0, type);
  
        should(report).has.lengthOf(1);
        should(report[0].rule).be.equal('isRequired');
      });
    });

    describe('.object', () => {
      it('Should add isRequired by default', () => {
        const type = StrictType.object;
        const report = check(void 0, type);
  
        should(report).has.lengthOf(1);
        should(report[0].rule).be.equal('isRequired');
      });
    });

    describe('.func', () => {
      it('Should add isRequired by default', () => {
        const type = StrictType.func;
        const report = check(void 0, type);
  
        should(report).has.lengthOf(1);
        should(report[0].rule).be.equal('isRequired');
      });
    });

    describe('.array', () => {
      it('Should add isRequired by default', () => {
        const type = StrictType.array;
        const report = check(void 0, type);
  
        should(report).has.lengthOf(1);
        should(report[0].rule).be.equal('isRequired');
      });
    });

    describe('.symbol', () => {
      it('Should add isRequired by default', () => {
        const type = StrictType.symbol;
        const report = check(void 0, type);
  
        should(report).has.lengthOf(1);
        should(report[0].rule).be.equal('isRequired');
      });
    });

    describe('.instanceOf()', () => {
      it('Should add isRequired by default', () => {
        const type = StrictType.instanceOf();
        const report = check(void 0, type);
  
        should(report).has.lengthOf(1);
        should(report[0].rule).be.equal('isRequired');
      });
    });

    describe('.oneOf()', () => {
      it('Should add isRequired by default', () => {
        const type = StrictType.oneOf();
        const report = check(void 0, type);
  
        should(report).has.lengthOf(1);
        should(report[0].rule).be.equal('isRequired');
      });
    });

    describe('.objectOf()', () => {
      it('Should add isRequired by default', () => {
        const type = StrictType.objectOf();
        const report = check(void 0, type);
  
        should(report).has.lengthOf(1);
        should(report[0].rule).be.equal('isRequired');
      });
    });

    describe('.arrayOf()', () => {
      it('Should add isRequired by default', () => {
        const type = StrictType.arrayOf();
        const report = check(void 0, type);
  
        should(report).has.lengthOf(1);
        should(report[0].rule).be.equal('isRequired');
      });
    });

    describe('.oneOfType()', () => {
      it('Should add isRequired by default', () => {
        const type = StrictType.oneOfType();
        const report = check(void 0, type);
  
        should(report).has.lengthOf(1);
        should(report[0].rule).be.equal('isRequired');
      });
    });

    describe('.select()', () => {
      it('Should add isRequired by default', () => {
        const type = StrictType.select(true);
        const report = check(void 0, type);
  
        should(report).has.lengthOf(1);
        should(report[0].rule).be.equal('isRequired');
      });
    });
  });

  describe('Inheritance', function() {
    it('Should inherits all methods and props', function() {
      class MyTypedProps extends Type {}

      should(MyTypedProps[CHECK]).be.a.Function();
    });
  });
});
