const should = require('should');
const T = require('..');

describe('decorators', function(){
    describe('TypedProps.args()', function() {
        it('Should return function', function() {
            const f = T.args();

            should(f).be.a.Function();
        });

        it('Returned function should return descriptor', function() {
            const f = T.args();

            const descriptor = f(null, 'test', {
                value: function() {},
            });

            should(descriptor).be.an.Object();
            should(descriptor).hasOwnProperty('value')
            .which.is.a.Function();
        });

        it('Descriptor should provider wrapper function', function() {
            const f = T.args();

            const descriptor = f(null, 'test', {
                value: function() {},
            });

            should(descriptor).be.an.Object();
            should(descriptor).hasOwnProperty('value')
            .which.is.a.Function();
        });

        it('Wrapper function should pass arguments', function() {
            const f = T.args();

            const {value} = f(null, 'test', {
                value: function(a) {
                    return a;
                },
            });

            should(value).be.a.Function();
            should(value(1)).be.equal(1);
        });

        it('Wrapper function check arguments', function() {
            const f = T.args(
                T.number
            );

            const {value} = f(null, 'test', {
                value: function(a) {
                    return a;
                },
            });

            should.throws(() => value(null), TypeError, /argument types/);
            should.doesNotThrow(() => value(1), TypeError, /argument types/);
        });

        it('Wrapper function check variadic arguments', function() {
            const f = T.args(T.string, [T.number]);

            const {value} = f(null, 'test', {
                value: function(a) {
                    return a;
                },
            });

            should.doesNotThrow(
                () => value('hello', 1), TypeError, /argument types/
            );
            should.throws(
                () => value('hello', 1, null), TypeError, /argument types/
            );
        });

        it('Should not affect default values', function() {
            const f = T.args(T.number, [T.number]);

            const {value} = f(null, 'test', {
                value: function(a = 1, ...numbers) {
                    return numbers.reduce((sum, b) => sum + b, a);
                },
            });

            should.doesNotThrow(
                () => value(), TypeError, /argument types/
            );
            should(value()).is.equal(1);
            should(value(undefined, 1)).is.equal(2);
        });
    });

    describe('TypedProps.result()', function() {
        it('Should check function returned value', function() {
            const f = T.result(T.number);

            const {value} = f(null, 'test', {
                value(a) {
                    return a;
                },
            });

            should.doesNotThrow(
                () => value(), TypeError, /result type/
            );
            should.doesNotThrow(
                () => value(1), TypeError, /result type/
            );
            should.throws(
                () => value('string'), TypeError, /result type/
            );

            should(value(1)).is.equal(1);
            should(value()).is.equal(undefined);
        });
    });
});
