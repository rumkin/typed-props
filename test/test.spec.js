const should = require('should');
const Type = require('..');

describe('TypedProps', function() {
    describe('Interface', function() {
        it('should add args transformer', function() {
            class CustomTypes extends Type {};

            CustomTypes.addMethod('equal', function(val) {
                return {val};
            }, function(value, {val}) {
                return value === val;
            });

            const type = CustomTypes.equal(1);
            const checks = CustomTypes.getChecks(type);

            should(checks[0].args[0]).be.deepEqual({val: 1});
            should.doesNotThrow(() => CustomTypes.check(1, type));

            should(CustomTypes.check(2, type)).has.lengthOf(1);
        });

        describe('Type.check()', function() {
            it('Should check values', function() {
                const value = undefined;

                const type = Type.isRequired;

                const report = Type.check(value, type);

                should(report).has.lengthOf(1);
                should(report[0].path).be.deepEqual([]);
                should(report[0].rule).be.equal('isRequired');
            });

            it('Should convert plain object to shape', function() {
                const value = {count: '1'};

                const type = {
                    count: Type.number,
                };

                const report = Type.check(value, type);

                should(report).has.lengthOf(1);
                should(report[0].path).be.deepEqual(['count']);
                should(report[0].rule).be.equal('number');
            });
        });

        describe('Type.getChecks()', function() {
            it('should return array checks', function() {
                const type = Type.string.isRequired;
                const checks = Type.getChecks(type);

                should(checks).be.an.Array();
                should(type._checks).not.equal(checks);
                should(type._checks).deepEqual(checks);
            });
        });

        describe('Type.getCheck()', function() {
            it('Should return check by name if it exists', function() {
                const type = Type.string.isRequired;
                const check = Type.getCheck(type, 'isRequired');

                should(check).be.instanceOf(Array);
            });

            it('Should return null for check wich not exists', function() {
                const type = Type.string.isRequired;
                const check = Type.getCheck(type, 'X');

                should(check).be.equal(null);
            });
        });

        describe('Type.addMethod()', function() {
            it('Should add new checker', function() {
                class Test extends Type {}

                Test.addMethod('test', function() {});

                should(Test).hasOwnProperty('test').which.is.a.Function();
            });

            it('Should add throw if checker exists', function() {
                class Test extends Type {}

                should.throws(() => {
                    Test.addMethod('test', function() {});
                    Test.addMethod('test', function() {});
                }, Error, /Checker 'test' exists/);
            });

            it('Should add throw if checker is not a function', function() {
                class Test extends Type {}

                should.throws(() => {
                    Test.addMethod('test');
                }, Error, /should be a function/);
            });
        });

        describe('Type.addProperty()', function() {
            it('Should add new checker', function() {
                class Test extends Type {}

                Test.addProperty('test', function() {});

                should(Test).hasOwnProperty('test').which.is.an.instanceOf(Test);
            });

            it('Should add throw if checker exists', function() {
                class Test extends Type {}

                should.throws(() => {
                    Test.addProperty('test', function() {});
                    Test.addProperty('test', function() {});
                }, Error, /Checker 'test' exists/);
            });

            it('Should add throw if checker is not a function', function() {
                class Test extends Type {}

                should.throws(() => {
                    Test.addProperty('test');
                }, Error, /should be a function/);
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

                const dateReport = Type.check(new Date(), type);

                should(dateReport).has.lengthOf(0);

                const arrayReport = Type.check(new Array(), type);

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

                const report = Type.check(value, type);

                should(report).has.lengthOf(0);
            });

            it('Should not pass not undefined', function() {
                const value = undefined;

                const type = Type.isRequired;

                const report = Type.check(value, type);

                should(report).has.lengthOf(1);
                should(report[0].rule).be.equal('isRequired');
            });
        });

        describe('number()', function() {
            it('Should pass number', function() {
                const value = 1;

                const type = Type.number;

                const report = Type.check(value, type);

                should(report).has.lengthOf(0);
            });

            it('Should pass undefined', function() {
                const value = undefined;

                const type = Type.number;

                const report = Type.check(value, type);

                should(report).has.lengthOf(0);
            });

            it('Should not pass not a number', function() {
                const value = null;

                const type = Type.number;

                const report = Type.check(value, type);

                should(report).has.lengthOf(1);
                should(report[0].rule).be.equal('number');
            });
        });

        describe('string()', function() {
            it('Should pass string', function() {
                const value = 'hello';

                const type = Type.string;

                const report = Type.check(value, type);

                should(report).has.lengthOf(0);
            });

            it('Should pass undefined', function() {
                const value = undefined;

                const type = Type.string;

                const report = Type.check(value, type);

                should(report).has.lengthOf(0);
            });

            it('Should not pass not string', function() {
                const value = null;

                const type = Type.string;

                const report = Type.check(value, type);

                should(report).has.lengthOf(1);
                should(report[0].rule).be.equal('string');
            });
        });

        describe('bool()', function() {
            it('Should pass boolean', function() {
                const value = true;

                const type = Type.bool;

                const report = Type.check(value, type);

                should(report).has.lengthOf(0);
            });

            it('Should pass undefined', function() {
                const value = undefined;

                const type = Type.bool;

                const report = Type.check(value, type);

                should(report).has.lengthOf(0);
            });

            it('Should not pass not boolean', function() {
                const value = null;

                const type = Type.bool;

                const report = Type.check(value, type);

                should(report).has.lengthOf(1);
                should(report[0].rule).be.equal('bool');
            });
        });

        describe('object()', function() {
            it('Should pass object', function() {
                const value = {};

                const type = Type.object;

                const report = Type.check(value, type);

                should(report).has.lengthOf(0);
            });

            it('Should pass undefined', function() {
                const value = undefined;

                const type = Type.object;

                const report = Type.check(value, type);

                should(report).has.lengthOf(0);
            });

            it('Should not pass not an object', function() {
                const value = null;

                const type = Type.object;

                const report = Type.check(value, type);

                should(report).has.lengthOf(1);
                should(report[0].rule).be.equal('object');
            });
        });

        describe('array()', function() {
            it('Should pass array', function() {
                const value = [];

                const type = Type.array;

                const report = Type.check(value, type);

                should(report).has.lengthOf(0);
            });

            it('Should pass undefined', function() {
                const value = undefined;

                const type = Type.array;

                const report = Type.check(value, type);

                should(report).has.lengthOf(0);
            });

            it('Should not pass not array', function() {
                const value = null;

                const type = Type.array;

                const report = Type.check(value, type);

                should(report).has.lengthOf(1);
                should(report[0].rule).be.equal('array');
            });
        });

        describe('func()', function() {
            it('Should pass function', function() {
                const value = function(){};

                const type = Type.func;

                const report = Type.check(value, type);

                should(report).has.lengthOf(0);
            });

            it('Should pass undefined', function() {
                const value = undefined;

                const type = Type.func;

                const report = Type.check(value, type);

                should(report).has.lengthOf(0);
            });

            it('Should not pass not function', function() {
                const value = null;

                const type = Type.func;

                const report = Type.check(value, type);

                should(report).has.lengthOf(1);
                should(report[0].rule).be.equal('func');
            });
        });

        describe('symbol()', function() {
            it('Should pass symbol', function() {
                const value = Symbol('Symbol');

                const type = Type.symbol;

                const report = Type.check(value, type);

                should(report).has.lengthOf(0);
            });

            it('Should pass undefined', function() {
                const value = undefined;

                const type = Type.symbol;

                const report = Type.check(value, type);

                should(report).has.lengthOf(0);
            });

            it('Should not pass not symbol', function() {
                const value = null;

                const type = Type.symbol;

                const report = Type.check(value, type);

                should(report).has.lengthOf(1);
                should(report[0].rule).be.equal('symbol');
            });
        });

        describe('instanceOf()', function() {
            it('Should pass [] as instance of Array', function() {
                const value = [];

                const type = Type.instanceOf(Array);

                const report = Type.check(value, type);

                should(report).has.lengthOf(0);
            });

            it('Should pass undefined', function() {
                const value = undefined;

                const type = Type.instanceOf(Object);

                const report = Type.check(value, type);

                should(report).has.lengthOf(0);
            });

            it('Should not {} as instance of Array', function() {
                const value = {};

                const type = Type.instanceOf(Array);

                const report = Type.check(value, type);

                should(report).has.lengthOf(1);
                should(report[0].rule).be.equal('instanceOf');
            });
        });

        describe('oneOf()', function() {
            it('Should pass correct', function() {
                const value = 7;

                const type = Type.oneOf([1, 2, 3, 5, 7]);

                const report = Type.check(value, type);

                should(report).has.lengthOf(0);
            });

            it('Should pass undefined', function() {
                const value = undefined;

                const type = Type.oneOf([]);

                const report = Type.check(value, type);

                should(report).has.lengthOf(0);
            });

            it('Should not pass not object', function() {
                const value = 7;

                const type = Type.oneOf([1, 2, 3, 5]);

                const report = Type.check(value, type);

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

                const report = Type.check(value, type);

                should(report).has.lengthOf(0);
            });

            it('Should pass undefined', function() {
                const value = undefined;

                const type = Type.arrayOf(Type.isRequired);

                const report = Type.check(value, type);

                should(report).has.lengthOf(0);
            });

            it('Should not pass not array', function() {
                const value = null;

                const type = Type.arrayOf(
                    Type.number
                );

                const report = Type.check(value, type);

                should(report).has.lengthOf(1);
                should(report[0].path).be.deepEqual([]);
                should(report[0].rule).be.equal('arrayOf');
            });

            it('Should not pass array of not numbers', function() {
                const value = [null];

                const type = Type.arrayOf(
                    Type.number
                );

                const report = Type.check(value, type);

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

                const report = Type.check(value, type);

                should(report).has.lengthOf(0);
            });

            it('Should pass undefined', function() {
                const value = undefined;

                const type = Type.oneOfType([]);

                const report = Type.check(value, type);

                should(report).has.lengthOf(0);
            });

            it('Should not pass incorrect', function() {
                const value = null;

                const type = Type.oneOfType([
                    Type.number,
                    Type.string,
                ]);

                const report = Type.check(value, type);

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

                const report = Type.check(value, type);

                should(report).has.lengthOf(0);
            });

            it('Should pass undefined', function() {
                const value = undefined;

                const type = Type.objectOf(Type.number);

                const report = Type.check(value, type);

                should(report).has.lengthOf(0);
            });

            it('Should not pass not an Object', function() {
                const value = null;

                const type = Type.objectOf(Type.number);

                const report = Type.check(value, type);

                should(report[0].path).be.deepEqual([]);
                should(report[0].rule).be.equal('objectOf');
            });

            it('Should not pass incorrect', function() {
                const value = {
                    one: 1,
                    two: null,
                };

                const type = Type.objectOf(Type.number);

                const report = Type.check(value, type);

                should(report).has.lengthOf(1);

                should(report[0].path).be.deepEqual(['two']);
                should(report[0].rule).be.equal('number');
            });
        });

        describe('select()', function() {
            it('Should select type', function() {
                const selectType = Type.select(
                    ({type}) => type === 'user' && Type.object.isRequired
                );

                const report = Type.check({type: 'user'}, selectType);
                should(report).has.lengthOf(0);
            });

            it('Should verify type', function() {
                const userShape = Type.shape({
                    name: Type.string.isRequired,
                })
                .isRequired;

                const selectType = Type.select(
                    ({type}) => type === 'user' && userShape
                );

                const report = Type.check({type: 'user'}, selectType);

                should(report).has.lengthOf(1);
                should(report[0].path).be.deepEqual(['name']);
                should(report[0].rule).be.equal('isRequired');
            });

            it('Should return `select` issue if type not selected', function() {
                const selectType = Type.select(
                    ({type}) => type === 'user' && Type.object.isRequired
                );

                const report = Type.check({type: 'file'}, selectType);

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

                const report = Type.check(value, type);

                should(report).has.lengthOf(0);
            });

            it('Should pass undefined', function() {
                const value = undefined;

                const type = Type.shape({});

                const report = Type.check(value, type);

                should(report).has.lengthOf(0);
            });

            it('Should not pass not an object', function() {
                const value = null;

                const type = Type.shape({});

                const report = Type.check(value, type);

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

                const report = Type.check(value, type);

                should(report).has.lengthOf(2);

                should(report[0].path).be.deepEqual(['two']);
                should(report[0].rule).be.equal('number');

                should(report[1].path).be.deepEqual(['three']);
                should(report[1].rule).be.equal('isRequired');
            });
        });
    });

    describe('Inheritance', function() {
        it('Should inherits all methods and props', function() {
            class MyTypedProps extends Type {}

            MyTypedProps.addMethod('equals', function(value, needle) {
                if (value === undefined) {
                    return;
                }

                return value === needle;
            });

            const result = MyTypedProps.check(5, MyTypedProps.number.equals(5));

            should(result).has.lengthOf(0);
        });
    });
});
