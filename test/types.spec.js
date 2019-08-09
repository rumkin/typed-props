/* global describe */
/* global it */

const should = require('should')

const {Type, StrictType, SimpleRule, check} = require('../')

describe('TypedProps', function() {
  describe('Simple checks', function() {
    describe('.isRequired', function() {
      it('Should pass not undefined', function() {
        const value = 1

        const type = Type.isRequired

        const report = check(value, type)

        should(report).has.lengthOf(0)
      })

      it('Should not pass not undefined', function() {
        const value = void 0

        const type = Type.isRequired

        const report = check(value, type)

        should(report).has.lengthOf(1)
        should(report[0].rule).be.equal('isRequired')
      })
    })

    describe('.optional', () => {
      it('Should be replace with isRequired', () => {
        const type = Type.isRequired.optional

        should(type.getChecks()).has.lengthOf(0)
      })
    })

    describe('.any', () => {
      it('Should remove `type` checks', () => {
        const type = Type.object.any

        should(type.getChecks()).has.lengthOf(0)
      })
    })

    describe('.number', function() {
      it('Should pass number', function() {
        const value = 1

        const type = Type.number

        const report = check(value, type)

        should(report).has.lengthOf(0)
      })

      it('Should pass undefined', function() {
        const value = void 0

        const type = Type.number

        const report = check(value, type)

        should(report).has.lengthOf(0)
      })

      it('Should not pass not a number', function() {
        const value = null

        const type = Type.number

        const report = check(value, type)

        should(report).has.lengthOf(1)
        should(report[0].rule).be.equal('type')
        should(report[0].details.type).be.equal('number')
      })
    })

    describe('.string', function() {
      it('Should pass string', function() {
        const value = 'hello'

        const type = Type.string

        const report = check(value, type)

        should(report).has.lengthOf(0)
      })

      it('Should pass undefined', function() {
        const value = void 0

        const type = Type.string

        const report = check(value, type)

        should(report).has.lengthOf(0)
      })

      it('Should not pass not string', function() {
        const value = null

        const type = Type.string

        const report = check(value, type)

        should(report).has.lengthOf(1)
        should(report[0].rule).be.equal('type')
        should(report[0].details.type).be.equal('string')
      })
    })

    describe('.bool', function() {
      it('Should pass boolean', function() {
        const value = true

        const type = Type.bool

        const report = check(value, type)

        should(report).has.lengthOf(0)
      })

      it('Should pass undefined', function() {
        const value = void 0

        const type = Type.bool

        const report = check(value, type)

        should(report).has.lengthOf(0)
      })

      it('Should not pass not boolean', function() {
        const value = null

        const type = Type.bool

        const report = check(value, type)

        should(report).has.lengthOf(1)
        should(report[0].rule).be.equal('type')
        should(report[0].details.type).be.equal('bool')
      })
    })

    describe('.object', function() {
      it('Should pass object', function() {
        const value = {}

        const type = Type.object

        const report = check(value, type)

        should(report).has.lengthOf(0)
      })

      it('Should pass undefined', function() {
        const value = void 0

        const type = Type.object

        const report = check(value, type)

        should(report).has.lengthOf(0)
      })

      it('Should not pass not an object', function() {
        const value = null

        const type = Type.object

        const report = check(value, type)

        should(report).has.lengthOf(1)
        should(report[0].rule).be.equal('type')
        should(report[0].details.type).be.equal('object')
      })

      it('Should not pass not an array', function() {
        const value = []

        const type = Type.object

        const report = check(value, type)

        should(report).has.lengthOf(1)
        should(report[0].rule).be.equal('type')
        should(report[0].details.type).be.equal('object')
      })
    })

    describe('.array', function() {
      it('Should pass array', function() {
        const value = []

        const type = Type.array

        const report = check(value, type)

        should(report).has.lengthOf(0)
      })

      it('Should pass undefined', function() {
        const value = void 0

        const type = Type.array

        const report = check(value, type)

        should(report).has.lengthOf(0)
      })

      it('Should not pass not an array', function() {
        const value = null

        const type = Type.array

        const report = check(value, type)

        should(report).has.lengthOf(1)
        should(report[0].rule).be.equal('type')
        should(report[0].details.type).be.equal('array')
      })

      it('Should not pass an object', function() {
        const value = {}

        const type = Type.array

        const report = check(value, type)

        should(report).has.lengthOf(1)
        should(report[0].rule).be.equal('type')
        should(report[0].details.type).be.equal('array')
      })
    })

    describe('.func', function() {
      it('Should pass function', function() {
        const value = function(){}

        const type = Type.func

        const report = check(value, type)

        should(report).has.lengthOf(0)
      })

      it('Should pass undefined', function() {
        const value = void 0

        const type = Type.func

        const report = check(value, type)

        should(report).has.lengthOf(0)
      })

      it('Should not pass not function', function() {
        const value = null

        const type = Type.func

        const report = check(value, type)

        should(report).has.lengthOf(1)
        should(report[0].rule).be.equal('type')
        should(report[0].details.type).be.equal('func')
      })
    })

    describe('.symbol', function() {
      it('Should pass symbol', function() {
        const value = Symbol('Symbol')

        const type = Type.symbol

        const report = check(value, type)

        should(report).has.lengthOf(0)
      })

      it('Should pass undefined', function() {
        const value = void 0

        const type = Type.symbol

        const report = check(value, type)

        should(report).has.lengthOf(0)
      })

      it('Should not pass not symbol', function() {
        const value = null

        const type = Type.symbol

        const report = check(value, type)

        should(report).has.lengthOf(1)
        should(report[0].rule).be.equal('type')
        should(report[0].details.type).be.equal('symbol')
      })
    })

    describe('.instanceOf', function() {
      it('Should pass [] as instance of Array', function() {
        const value = []

        const type = Type.instanceOf(Array)

        const report = check(value, type)

        should(report).has.lengthOf(0)
      })

      it('Should pass undefined', function() {
        const value = void 0

        const type = Type.instanceOf(Object)

        const report = check(value, type)

        should(report).has.lengthOf(0)
      })

      it('Should not {} as instance of Array', function() {
        const value = {}

        const type = Type.instanceOf(Array)

        const report = check(value, type)

        should(report).has.lengthOf(1)
        should(report[0].rule).be.equal('instanceOf')
      })
    })
  })

  describe('Complex checks', function() {
    describe('.is()', function() {
      it('Should pass correct', function() {
        const value = 7

        const type = Type.is(7)

        const report = check(value, type)

        should(report).has.lengthOf(0)
      })

      it('Should pass undefined', function() {
        const value = void 0

        const type = Type.is(1)

        const report = check(value, type)

        should(report).has.lengthOf(0)
      })

      it('Should not pass not object', function() {
        const value = 7

        const type = Type.is(1)

        const report = check(value, type)

        should(report).has.lengthOf(1)
        should(report[0].rule).be.equal('is')
      })
    })

    describe('.oneOf()', function() {
      it('Should pass correct', function() {
        const value = 7

        const type = Type.oneOf([1, 2, 3, 5, 7])

        const report = check(value, type)

        should(report).has.lengthOf(0)
      })

      it('Should pass undefined', function() {
        const value = void 0

        const type = Type.oneOf([])

        const report = check(value, type)

        should(report).has.lengthOf(0)
      })

      it('Should not pass not object', function() {
        const value = 7

        const type = Type.oneOf([1, 2, 3, 5])

        const report = check(value, type)

        should(report).has.lengthOf(1)
        should(report[0].rule).be.equal('oneOf')
      })
    })

    describe('.oneOfType()', function() {
      it('Should pass correct', function() {
        const value = 'hello'

        const type = Type.oneOfType([
          Type.number,
          Type.string,
        ])

        const report = check(value, type)

        should(report).has.lengthOf(0)
      })

      it('Should pass undefined', function() {
        const value = void 0

        const type = Type.oneOfType([])

        const report = check(value, type)

        should(report).has.lengthOf(0)
      })

      it('Should not pass incorrect', function() {
        const value = null

        const type = Type.oneOfType([
          Type.number,
          Type.string,
        ])

        const report = check(value, type)

        should(report).has.lengthOf(1)
        should(report[0].path).be.deepEqual([])
        should(report[0].rule).be.equal('oneOfType')
      })
    })

    describe('.arrayOf()', function() {
      it('Should pass array of numbers', function() {
        const value = [1]

        const type = Type.arrayOf(
          Type.number
        )

        const report = check(value, type)

        should(report).has.lengthOf(0)
      })

      it('Should pass undefined', function() {
        const value = void 0

        const type = Type.arrayOf(Type.isRequired)

        const report = check(value, type)

        should(report).has.lengthOf(0)
      })

      it('Should not pass not an array', function() {
        const value = null

        const type = Type.arrayOf(
          Type.number
        )

        const report = check(value, type)

        should(report).has.lengthOf(1)
        should(report[0].path).be.deepEqual([])
        should(report[0].rule).be.equal('type')
        should(report[0].details.type).be.equal('array')
      })

      it('Should not pass array of not numbers', function() {
        const value = [null]

        const type = Type.arrayOf(
          Type.number
        )

        const report = check(value, type)

        should(report).has.lengthOf(1)
        should(report[0].path).be.deepEqual([0])
        should(report[0].rule).be.equal('type')
        should(report[0].details.type).be.equal('number')
      })
    })

    describe('.objectOf()', function() {
      it('Should pass correct', function() {
        const value = {
          one: 1,
          two: 0,
        }

        const type = Type.objectOf(Type.number)

        const report = check(value, type)

        should(report).has.lengthOf(0)
      })

      it('Should pass undefined', function() {
        const value = void 0

        const type = Type.objectOf(Type.number)

        const report = check(value, type)

        should(report).has.lengthOf(0)
      })

      it('Should not pass not an object', function() {
        const value = null

        const type = Type.objectOf(Type.number)

        const report = check(value, type)

        should(report[0].path).be.deepEqual([])
        should(report[0].rule).be.equal('type')
        should(report[0].details.type).be.equal('object')
      })

      it('Should not pass incorrect', function() {
        const value = {
          one: 1,
          two: null,
        }

        const type = Type.objectOf(Type.number)

        const report = check(value, type)

        should(report).has.lengthOf(1)

        should(report[0].path).be.deepEqual(['two'])
        should(report[0].rule).be.equal('type')
        should(report[0].details.type).be.equal('number')
      })
    })

    describe('.shape()', function() {
      it('Should pass correct', function() {
        const value = {
          one: 1,
          two: 0,
        }

        const type = Type.shape({
          one: Type.number,
          two: Type.number,
        })

        const report = check(value, type)

        should(report).has.lengthOf(0)
      })

      it('Should pass undefined', function() {
        const value = void 0

        const type = Type.shape({})

        const report = check(value, type)

        should(report).has.lengthOf(0)
      })

      it('Should not pass not an object', function() {
        const value = null

        const type = Type.shape({})

        const report = check(value, type)

        should(report).has.lengthOf(1)
        should(report[0].rule).be.equal('type')
        should(report[0].details.type).be.equal('object')
      })

      it('Should not treat an array as an object', function() {
        const value = [0, 1]

        const type = Type.shape({
          0: Type.number,
          1: Type.string,
        })

        const report = check(value, type)

        should(report).has.lengthOf(1)
        should(report[0].rule).be.equal('type')
        should(report[0].details.type).be.equal('object')
      })

      it('Should check an array', function() {
        const value = [null, null]

        const type = Type.shape([
          Type.number,
          Type.string,
        ])

        const report = check(value, type)

        should(report).has.lengthOf(2)
        should(report[0].rule).be.equal('type')
        should(report[0].details.type).be.equal('number')

        should(report[1].rule).be.equal('type')
        should(report[1].details.type).be.equal('string')
      })

      it('Should not treat an object as an array', function() {
        const value = {0: 0, 1: '1'}

        const type = Type.shape([
          Type.number,
          Type.string,
        ])

        const report = check(value, type)

        should(report).has.lengthOf(1)
        should(report[0].rule).be.equal('type')
        should(report[0].details.type).be.equal('array')
      })

      it('Should not pass incorrect', function() {
        const value = {
          one: 1,
          two: false,
        }

        const type = Type.shape({
          one: Type.number,
          two: Type.number,
          three: Type.isRequired,
        })

        const report = check(value, type)

        should(report).has.lengthOf(2)

        should(report[0].path).be.deepEqual(['two'])
        should(report[0].rule).be.equal('type')
        should(report[0].details.type).be.equal('number')

        should(report[1].path).be.deepEqual(['three'])
        should(report[1].rule).be.equal('isRequired')
      })

      it('Should pass nested shapes', function() {
        const value = {
          user: {
            name: 'Julio',
          },
        }

        const type = Type.shape({
          user: {
            name: Type.string.isRequired,
          },
        })

        const report = check(value, type)

        should(report).has.lengthOf(0)
      })

      it('Should check nested shapes', function() {
        const value = {
          user: {
            name: 'Julio',
          },
        }

        const type = Type.shape({
          user: {
            name: Type.string.isRequired,
            money: Type.number.isRequired,
          },
        })

        const report = check(value, type)

        should(report).has.lengthOf(1)
      })

      it('Should pass function rule', function() {
        const value = {
          amount: 1,
        }

        const type = Type.shape({
          amount: () => Type.number,
        })

        const report = check(value, type)

        should(report).has.lengthOf(0)
      })

      it('Should check function rule', function() {
        const value = {
          amount: null,
        }

        const type = Type.shape({
          amount: () => Type.number,
        })

        const report = check(value, type)

        should(report).has.lengthOf(1)
        should(report[0].rule).be.equal('type')
        should(report[0].details.type).be.equal('number')
      })
    })

    describe('.exact()', function() {
      it('Should pass correct', function() {
        const value = {
          one: 1,
          two: 0,
        }

        const type = Type.exact({
          one: Type.number,
          two: Type.number,
        })

        const report = check(value, type)

        should(report).has.lengthOf(0)
      })

      it('Should pass undefined', function() {
        const value = void 0

        const type = Type.exact({})

        const report = check(value, type)

        should(report).has.lengthOf(0)
      })

      it('Should not pass not an object', function() {
        const value = null

        const type = Type.shape({

        })

        const report = check(value, type)

        should(report).has.lengthOf(1)
        should(report[0].rule).be.equal('type')
        should(report[0].details.type).be.equal('object')
      })

      it('Should not pass incorrect', function() {
        const value = {
          one: 1,
          two: 2,
          three: true,
        }

        const type = Type.exact({
          one: Type.number,
          two: Type.bool,
        })

        const report = check(value, type)

        should(report).has.lengthOf(2)

        should(report[0].path).be.deepEqual(['two'])
        should(report[0].rule).be.equal('type')
        should(report[0].details.type).be.equal('bool')

        should(report[1].path).be.deepEqual(['three'])
        should(report[1].rule).be.equal('shape')
        should(report[1].details).be.deepEqual({reason: 'redundant'})
      })

      it('Should pass nested shapes', function() {
        const value = {
          user: {
            name: 'Julio',
          },
        }

        const type = Type.exact({
          user: {
            name: Type.string.isRequired,
          },
        })

        const report = check(value, type)

        should(report).has.lengthOf(0)
      })

      it('Should check nested shapes', function() {
        const value = {
          user: {
            name: 'Julio',
            extraProperty: true,
          },
        }

        const type = Type.exact({
          user: {
            name: Type.string.isRequired,
            money: Type.number.isRequired,
          },
        })

        const report = check(value, type)

        should(report).has.lengthOf(2)

        should(report[1].path).be.deepEqual(['user', 'extraProperty'])
        should(report[1].rule).be.equal('shape')
        should(report[1].details).be.deepEqual({reason: 'redundant'})
      })

      it('Should pass function rule', function() {
        const value = {
          amount: 1,
        }

        const type = Type.exact({
          amount: () => Type.number,
        })

        const report = check(value, type)

        should(report).has.lengthOf(0)
      })

      it('Should check function rule', function() {
        const value = {
          amount: null,
          extraProperty: true,
        }

        const type = Type.exact({
          amount: () => Type.number,
        })

        const report = check(value, type)

        should(report).has.lengthOf(2)
        should(report[0].rule).be.equal('type')
        should(report[0].details.type).be.equal('number')

        should(report[1].path).be.deepEqual(['extraProperty'])
        should(report[1].rule).be.equal('shape')
        should(report[1].details).be.deepEqual({reason: 'redundant'})
      })
    })

    describe('.exactFuzzy()', function() {
      it('Should pass correct', function() {
        const value = {
          one: 1,
          two: 0,
        }

        const type = Type.exact({
          one: Type.number,
          two: Type.number,
        })

        const report = check(value, type)

        should(report).has.lengthOf(0)
      })

      it('Should pass undefined', function() {
        const value = void 0

        const type = Type.exact({})

        const report = check(value, type)

        should(report).has.lengthOf(0)
      })

      it('Should not pass not an object', function() {
        const value = null

        const type = Type.shape({

        })

        const report = check(value, type)

        should(report).has.lengthOf(1)
        should(report[0].rule).be.equal('type')
        should(report[0].details.type).be.equal('object')
      })

      it('Should not pass incorrect', function() {
        const value = {
          one: 1,
          two: 2,
          three: true,
        }

        const type = Type.exact({
          one: Type.number,
          two: Type.bool,
        })

        const report = check(value, type)

        should(report).has.lengthOf(2)

        should(report[0].path).be.deepEqual(['two'])
        should(report[0].rule).be.equal('type')
        should(report[0].details.type).be.equal('bool')

        should(report[1].path).be.deepEqual(['three'])
        should(report[1].rule).be.equal('shape')
        should(report[1].details).be.deepEqual({reason: 'redundant'})
      })

      it('Should not pass incorrect custom', function() {
        const value = {
          one: 1,
          two: 2,
        }

        const type = Type.exactFuzzy({}, [/on./, Type.string])

        const report = check(value, type)

        should(report).has.lengthOf(2)

        should(report[0].path).be.deepEqual(['one'])
        should(report[0].rule).be.equal('type')
        should(report[0].details.type).be.equal('string')

        should(report[1].path).be.deepEqual(['two'])
        should(report[1].rule).be.equal('shape')
        should(report[1].details).be.deepEqual({reason: 'redundant'})
      })

      it('Should pass nested shapes', function() {
        const value = {
          user: {
            name: 'Julio',
          },
        }

        const type = Type.exact({
          user: {
            name: Type.string.isRequired,
          },
        })

        const report = check(value, type)

        should(report).has.lengthOf(0)
      })

      it('Should check nested shapes', function() {
        const value = {
          user: {
            name: 'Julio',
            extraProperty: true,
          },
        }

        const type = Type.exact({
          user: {
            name: Type.string.isRequired,
            money: Type.number.isRequired,
          },
        })

        const report = check(value, type)

        should(report).has.lengthOf(2)

        should(report[1].path).be.deepEqual(['user', 'extraProperty'])
        should(report[1].rule).be.equal('shape')
        should(report[1].details).be.deepEqual({reason: 'redundant'})
      })

      it('Should pass function rule', function() {
        const value = {
          amount: 1,
        }

        const type = Type.exact({
          amount: () => Type.number,
        })

        const report = check(value, type)

        should(report).has.lengthOf(0)
      })

      it('Should check function rule', function() {
        const value = {
          amount: null,
          extraProperty: true,
        }

        const type = Type.exact({
          amount: () => Type.number,
        })

        const report = check(value, type)

        should(report).has.lengthOf(2)
        should(report[0].rule).be.equal('type')
        should(report[0].details.type).be.equal('number')

        should(report[1].path).be.deepEqual(['extraProperty'])
        should(report[1].rule).be.equal('shape')
        should(report[1].details).be.deepEqual({reason: 'redundant'})
      })
    })

    describe('.select()', function() {
      it('Should select type', function() {
        const selectType = Type.select(
          [({type}) => type === 'user', Type.object.isRequired]
        )

        const report = check({type: 'user'}, selectType)
        should(report).has.lengthOf(0)
      })

      it('Should verify type', function() {
        const userShape = Type.shape({
          name: Type.string.isRequired,
        })
        .isRequired

        const selectType = Type.select(
          [({type}) => type === 'user', userShape]
        )

        const report = check({type: 'user'}, selectType)

        should(report).has.lengthOf(1)
        should(report[0].path).be.deepEqual(['name'])
        should(report[0].rule).be.equal('isRequired')
      })

      it('Should return `select` issue if type not selected', function() {
        const selectType = Type.select(
          [({type}) => type === 'user', Type.object.isRequired]
        )

        const report = check({type: 'file'}, selectType)

        should(report).has.lengthOf(1)
        should(report[0].path).be.deepEqual([])
        should(report[0].rule).be.equal('select')
      })

      it('Should throw on `null` argument', () => {
        should.throws(
          () => Type.select(null),
          TypeError,
          'Argument #1 not an array'
        )
      })

      it('Should throw on `[]` argument', () => {
        should.throws(
          () => Type.select([]),
          TypeError,
          'Argument #1 bad length 0'
        )
      })

      it('Should throw on `[null, null]` argument', () => {
        should.throws(
          () => Type.select([null, null]),
          TypeError,
          'Argument #1 first item isn\'t a function'
        )
      })

      it('Should throw on `[() => true, null]` argument', () => {
        should.throws(
          () => Type.select([() => true, null]),
          TypeError,
          'Argument #1 second item isn\'t a Rule'
        )
      })
    })

    describe('.custom', () => {
      it('Should execute check', () => {
        const type = Type.custom(() => false)
        const issues = check(void 0, type)

        should(issues).has.lengthOf(1)
      })

      it('Should pass valid value', () => {
        const type = Type.custom((value) => value === true)
        const issues = check(true, type)

        should(issues).has.lengthOf(0)
      })

      it('Should handle even undefined values', () => {
        const type = Type.custom((it) => it !== void 0)
        const issues = check(void 0, type)

        should(issues).has.lengthOf(1)
      })

      it('Should throw on `null` argument', () => {
        should.throws(
          () => Type.custom(null),
          TypeError,
          'Argument #1 is not a function'
        )
      })
    })
  })

  describe('StrictTypedProps', () => {
    describe('.bool', () => {
      it('Should add isRequired by default', () => {
        const type = StrictType.bool
        const report = check(void 0, type)

        should(report).has.lengthOf(1)
        should(report[0].rule).be.equal('isRequired')
      })
    })

    describe('.number', () => {
      it('Should add isRequired by default', () => {
        const type = StrictType.number
        const report = check(void 0, type)

        should(report).has.lengthOf(1)
        should(report[0].rule).be.equal('isRequired')
      })
    })

    describe('.string', () => {
      it('Should add isRequired by default', () => {
        const type = StrictType.string
        const report = check(void 0, type)

        should(report).has.lengthOf(1)
        should(report[0].rule).be.equal('isRequired')
      })
    })

    describe('.object', () => {
      it('Should add isRequired by default', () => {
        const type = StrictType.object
        const report = check(void 0, type)

        should(report).has.lengthOf(1)
        should(report[0].rule).be.equal('isRequired')
      })
    })

    describe('.func', () => {
      it('Should add isRequired by default', () => {
        const type = StrictType.func
        const report = check(void 0, type)

        should(report).has.lengthOf(1)
        should(report[0].rule).be.equal('isRequired')
      })
    })

    describe('.array', () => {
      it('Should add isRequired by default', () => {
        const type = StrictType.array
        const report = check(void 0, type)

        should(report).has.lengthOf(1)
        should(report[0].rule).be.equal('isRequired')
      })
    })

    describe('.symbol', () => {
      it('Should add isRequired by default', () => {
        const type = StrictType.symbol
        const report = check(void 0, type)

        should(report).has.lengthOf(1)
        should(report[0].rule).be.equal('isRequired')
      })
    })

    describe('.instanceOf()', () => {
      it('Should add isRequired by default', () => {
        const type = StrictType.instanceOf()
        const report = check(void 0, type)

        should(report).has.lengthOf(1)
        should(report[0].rule).be.equal('isRequired')
      })
    })

    describe('.is()', () => {
      it('Should add isRequired by default', () => {
        const type = StrictType.is()
        const report = check(void 0, type)

        should(report).has.lengthOf(1)
        should(report[0].rule).be.equal('isRequired')
      })
    })

    describe('.oneOf()', () => {
      it('Should add isRequired by default', () => {
        const type = StrictType.oneOf()
        const report = check(void 0, type)

        should(report).has.lengthOf(1)
        should(report[0].rule).be.equal('isRequired')
      })
    })

    describe('.oneOfType()', () => {
      it('Should add isRequired by default', () => {
        const type = StrictType.oneOfType()
        const report = check(void 0, type)

        should(report).has.lengthOf(1)
        should(report[0].rule).be.equal('isRequired')
      })
    })

    describe('.arrayOf()', () => {
      it('Should add isRequired by default', () => {
        const type = StrictType.arrayOf()
        const report = check(void 0, type)

        should(report).has.lengthOf(1)
        should(report[0].rule).be.equal('isRequired')
      })
    })

    describe('.objectOf()', () => {
      it('Should add isRequired by default', () => {
        const type = StrictType.objectOf()
        const report = check(void 0, type)

        should(report).has.lengthOf(1)
        should(report[0].rule).be.equal('isRequired')
      })
    })

    describe('.select()', () => {
      it('Should add isRequired by default', () => {
        const type = StrictType.select([() => true, StrictType.any])
        const report = check(void 0, type)

        should(report).has.lengthOf(1)
        should(report[0].rule).be.equal('isRequired')
      })
    })

    describe('.custom()', () => {
      it('Should add isRequired by default', () => {
        const type = StrictType.custom(() => false)
        const report = check(void 0, type)

        should(report).has.lengthOf(1)
        should(report[0].rule).be.equal('isRequired')
      })
    })
  })

  describe('SimpleRule', () => {
    it('Should create simple checker', () => {
      class IsFinite extends SimpleRule {
        static get ruleName() {
          return 'isFinite'
        }

        static checkIt(it) {
          return isFinite(it)
        }
      }

      const type = new Type(IsFinite.create([], IsFinite.config()))

      should(check(1, type)).has.lengthOf(0)
      should(check(Infinity, type)).has.lengthOf(1)
    })
  })

  describe('Contexts', function() {
    it('Should provide information about parents to child checks', function() {
      class GreaterThenRule extends SimpleRule {
        static get ruleName() {
          return 'GreaterThenOther'
        }

        static config(targetProp) {
          return {expect: true, targetProp}
        }

        static checkIt(it, {targetProp}, context) {
          const parent = context.parents.slice().pop()

          return it > parent[targetProp]
        }
      }

      const type = Type.shape({
        x: new Type(GreaterThenRule.create([], GreaterThenRule.config('y'))),
      })

      const issues = check({x: 0, y: 1}, type)

      should(issues).has.lengthOf(1)
      should(issues[0].path).be.deepEqual(['x'])
      should(issues[0].rule).be.equal('GreaterThenOther')

      should(check({x: 1, y: 0}, type)).has.lengthOf(0)
    })
  })
})
