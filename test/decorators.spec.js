const should = require('should');
const {Type, ...T} = require('..');

describe('decorators', function(){
    describe('TypedProps.args()', function() {
        it('Should return function', function() {
            const f = T.args();

            should(f).be.a.Function();
        });

        it('Returned function should replace descriptor.value', function() {
            const f = T.args();

            const value = function() {};
            const descriptor = {value};
            
            f(null, 'test', descriptor);

            should(descriptor).be.an.Object();
            should(descriptor).hasOwnProperty('value')
            .which.is.a.Function()
            .and.not.equal(value); 
        });

        it('Descriptor should provide wrapper function', function() {
            const f = T.args();

            const descriptor = {value() {}};
            f(null, 'test', descriptor);

            should(descriptor).be.an.Object();
            should(descriptor).hasOwnProperty('value')
            .which.is.a.Function();
        });

        it('Wrapper function should pass arguments', function() {
            const f = T.args();

            const value = function(v) {
                return v;
            };
            const descriptor = {value};
            
            f(null, 'test', descriptor);

            should(descriptor.value).be.a.Function();
            should(descriptor.value(1)).be.equal(1);
        });

        it('Should check arguments', function() {
            const decorate = T.args(
                Type.number
            );

            const descriptor = {value(){}};
            
            decorate(null, 'test', descriptor);
            descriptor.value(1)
            should.throws(() => descriptor.value(null), TypeError, /argument types/);
            should.doesNotThrow(() => descriptor.value(1), TypeError, /argument types/);
        });

        it('Wrapper function check variadic arguments', function() {
            const decorate = T.args(Type.string, [Type.number]);

            const descriptor = {value(){}};
            
            decorate(null, 'test', descriptor);

            should.doesNotThrow(
                () => descriptor.value('hello', 1), TypeError, /argument types/
            );
            should.throws(
                () => descriptor.value('hello', 1, null), TypeError, /argument types/
            );
        });

        it('Should not affect default values', function() {
            const decorate = T.args(Type.number, [Type.number]);

            const value = (a = 1, ...numbers) => {
                return numbers.reduce((sum, b) => sum + b, a);
            };
            const descriptor = {value};
            decorate(null, 'test', descriptor);

            should.doesNotThrow(
                () => descriptor.value(), TypeError, /argument types/
            );
            should(descriptor.value()).is.equal(1);
            should(descriptor.value(undefined, 1)).is.equal(2);
        });
    });

    describe('TypedProps.result()', function() {
        it('Should check function returned value', function() {
            const decorate = T.result(Type.number);

            const descriptor = {value(v) { return v; }};
            decorate(null, 'test', descriptor);

            should.doesNotThrow(
                () => descriptor.value(), TypeError, /result type/
            );
            should.doesNotThrow(
                () => descriptor.value(1), TypeError, /result type/
            );
            should.throws(
                () => descriptor.value('string'), TypeError, /result type/
            );

            should(descriptor.value(1)).is.equal(1);
            should(descriptor.value()).is.equal(undefined);
        });
    });
});
