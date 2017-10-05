'use strict';

const should = require('should');
const TypedProps = require('..');

describe('TypedProps', function() {
    describe('Interface', function() {
        it('should be immutable with primitives', function() {
            const type1 = TypedProps.number;
            const type2 = type1.isRequired;

            should(type1).not.equal(type2);
        });

        it('should be immutable with shapes', function() {
            const shape1 = TypedProps.shape({
                name: TypedProps.string.isRequired,
            });
            const shape2 = shape1.isRequired;
            should(shape1).not.equal(shape2);
        });
    });
    describe('Built-in checkers', function() {
        describe('isRequired', function() {
            it('Should pass not undefined', function() {
                const value = 1;

                const type = TypedProps.isRequired;

                const report = TypedProps.check(value, type);

                should(report).has.lengthOf(0);
            });

            it('Should not pass not undefined', function() {
                const value = undefined;

                const type = TypedProps.isRequired;

                const report = TypedProps.check(value, type);

                should(report).has.lengthOf(1);
                should(report[0].rule).be.equal('isRequired');
            });
        });

        describe('number', function() {
            it('Should pass number', function() {
                const value = 1;

                const type = TypedProps.number;

                const report = TypedProps.check(value, type);

                should(report).has.lengthOf(0);
            });

            it('Should not pass not a number', function() {
                const value = null;

                const type = TypedProps.number;

                const report = TypedProps.check(value, type);

                should(report).has.lengthOf(1);
                should(report[0].rule).be.equal('number');
            });
        });

        describe('string', function() {
            it('Should pass string', function() {
                const value = 'hello';

                const type = TypedProps.string;

                const report = TypedProps.check(value, type);

                should(report).has.lengthOf(0);
            });

            it('Should not pass not string', function() {
                const value = null;

                const type = TypedProps.string;

                const report = TypedProps.check(value, type);

                should(report).has.lengthOf(1);
                should(report[0].rule).be.equal('string');
            });
        });

        describe('bool', function() {
            it('Should pass boolean', function() {
                const value = true;

                const type = TypedProps.bool;

                const report = TypedProps.check(value, type);

                should(report).has.lengthOf(0);
            });

            it('Should not pass not boolean', function() {
                const value = null;

                const type = TypedProps.bool;

                const report = TypedProps.check(value, type);

                should(report).has.lengthOf(1);
                should(report[0].rule).be.equal('bool');
            });
        });

        describe('object', function() {
            it('Should pass array', function() {
                const value = {};

                const type = TypedProps.object;

                const report = TypedProps.check(value, type);

                should(report).has.lengthOf(0);
            });

            it('Should not pass not object', function() {
                const value = null;

                const type = TypedProps.object;

                const report = TypedProps.check(value, type);

                should(report).has.lengthOf(1);
                should(report[0].rule).be.equal('object');
            });
        });

        describe('array', function() {
            it('Should pass array', function() {
                const value = [];

                const type = TypedProps.array;

                const report = TypedProps.check(value, type);

                should(report).has.lengthOf(0);
            });

            it('Should not pass not array', function() {
                const value = null;

                const type = TypedProps.array;

                const report = TypedProps.check(value, type);

                should(report).has.lengthOf(1);
                should(report[0].rule).be.equal('array');
            });
        });

        describe('func', function() {
            it('Should pass function', function() {
                const value = function(){};

                const type = TypedProps.func;

                const report = TypedProps.check(value, type);

                should(report).has.lengthOf(0);
            });

            it('Should not pass not function', function() {
                const value = null;

                const type = TypedProps.func;

                const report = TypedProps.check(value, type);

                should(report).has.lengthOf(1);
                should(report[0].rule).be.equal('func');
            });
        });

        describe('symbol', function() {
            it('Should pass symbol', function() {
                const value = Symbol('Symbol');

                const type = TypedProps.symbol;

                const report = TypedProps.check(value, type);

                should(report).has.lengthOf(0);
            });

            it('Should not pass not symbol', function() {
                const value = null;

                const type = TypedProps.symbol;

                const report = TypedProps.check(value, type);

                should(report).has.lengthOf(1);
                should(report[0].rule).be.equal('symbol');
            });
        });

        describe('instanceOf', function() {
            it('Should pass [] as instance of Array', function() {
                const value = [];

                const type = TypedProps.instanceOf(Array);

                const report = TypedProps.check(value, type);

                should(report).has.lengthOf(0);
            });

            it('Should not {} as instance of Array', function() {
                const value = {};

                const type = TypedProps.instanceOf(Array);

                const report = TypedProps.check(value, type);

                should(report).has.lengthOf(1);
                should(report[0].rule).be.equal('instanceOf');
            });
        });

        describe('oneOf', function() {
            it('Should pass correct', function() {
                const value = 7;

                const type = TypedProps.oneOf([1, 2, 3, 5, 7]);

                const report = TypedProps.check(value, type);

                should(report).has.lengthOf(0);
            });

            it('Should not pass not object', function() {
                const value = 7;

                const type = TypedProps.oneOf([1, 2, 3, 5]);

                const report = TypedProps.check(value, type);

                should(report).has.lengthOf(1);
                should(report[0].rule).be.equal('oneOf');
            });
        });

        describe('arrayOf', function() {
            it('Should pass array of numbers', function() {
                const value = [1];

                const type = TypedProps.arrayOf(
                    TypedProps.number
                );

                const report = TypedProps.check(value, type);

                should(report).has.lengthOf(0);
            });

            it('Should not pass not array of numbers', function() {
                const value = [null];

                const type = TypedProps.arrayOf(
                    TypedProps.number
                );

                const report = TypedProps.check(value, type);

                should(report).has.lengthOf(1);
                should(report[0].path).be.deepEqual([0]);
                should(report[0].rule).be.equal('number');
            });
        });

        describe('oneOfType', function() {
            it('Should pass correct', function() {
                const value = 'hello';

                const type = TypedProps.oneOfType([
                    TypedProps.number,
                    TypedProps.string,
                ]);

                const report = TypedProps.check(value, type);

                should(report).has.lengthOf(0);
            });

            it('Should not pass incorrect', function() {
                const value = null;

                const type = TypedProps.oneOfType([
                    TypedProps.number,
                    TypedProps.string,
                ]);

                const report = TypedProps.check(value, type);

                should(report).has.lengthOf(1);
                should(report[0].path).be.deepEqual([]);
                should(report[0].rule).be.equal('oneOfType');
            });
        });

        describe('objectOf', function() {
            it('Should pass correct', function() {
                const value = {
                    one: 1,
                    two: 0,
                };

                const type = TypedProps.objectOf(TypedProps.number);

                const report = TypedProps.check(value, type);

                should(report).has.lengthOf(0);
            });

            it('Should not pass incorrect', function() {
                const value = {
                    one: 1,
                    two: null,
                };

                const type = TypedProps.objectOf(TypedProps.number);

                const report = TypedProps.check(value, type);

                should(report).has.lengthOf(1);

                should(report[0].path).be.deepEqual(['two']);
                should(report[0].rule).be.equal('number');
            });
        });

        describe('shape', function() {
            it('Should pass correct', function() {
                const value = {
                    one: 1,
                    two: 0,
                };

                const type = TypedProps.shape({
                    one: TypedProps.number,
                    two: TypedProps.number,
                });

                const report = TypedProps.check(value, type);

                should(report).has.lengthOf(0);
            });

            it('Should not pass incorrect', function() {
                const value = {
                    one: 1,
                    two: false,
                };

                const type = TypedProps.shape({
                    one: TypedProps.number,
                    two: TypedProps.number,
                    three: TypedProps.isRequired,
                });

                const report = TypedProps.check(value, type);

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
            class MyTypedProps extends TypedProps {}

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
