/* global describe */
/* global it */

const should = require('should')

const {Type, Rule, getChecks, listRules, getRuleParams, check, CHECKS} = require('../')

describe('Base', function() {
  describe('check()', function() {
    it('Should check values', function() {
      const value = void 0

      const type = Type.isRequired

      const report = check(value, type)

      should(report).has.lengthOf(1)
      should(report[0].path).be.deepEqual([])
      should(report[0].rule).be.equal('isRequired')
    })
  })

  describe('getChecks()', function() {
    it('should return array of checks', function() {
      const type = Type.string.isRequired
      const checks = getChecks(type)

      should(checks).be.an.Array()
      should(type[CHECKS]).not.equal(checks)
      should(type[CHECKS]).deepEqual(checks)
    })
  })

  describe('getRuleParams()', function() {
    it('Should return check by name if it exists', function() {
      const type = Type.string.isRequired
      const check = getRuleParams(type, 'isRequired')

      should(check).be.deepEqual({isRequired: true})
    })

    it('Should return null for check wich not exists', function() {
      const type = Type.string.isRequired
      const check = getRuleParams(type, 'X')

      should(check).be.equal(void 0)
    })
  })

  describe('listRules()', () => {
    it('should return list of strings', () => {
      const type = Type.string.isRequired
      const rules = listRules(type)

      should(rules).be.an.instanceOf(Array)
      should(rules).has.lengthOf(2)
      should(rules[0]).be.equal('type')
      should(rules[1]).be.equal('isRequired')
    })
  })

  describe('Checkable', function() {
    describe('constructor()', () => {
      new Type()
    })

    describe('.check()', () => {
      it('Should inherits all methods and props', function() {
        class MyTypedProps extends Type {}
  
        const type = MyTypedProps.string
  
        should(check(null, type)).be.an.instanceOf(Array)
        .and.has.lengthOf(1)
      })
    })

    describe('#getChecks()', () => {
      it('Should return list of checks', () => {
        const type = Type.string.isRequired
  
        const checks = type.getChecks()
  
        should(checks).be.an.instanceOf(Array)
        .and.has.lengthOf(2)
  
        should(checks[0]).has.ownProperty('rule')
        .which.equal('type')
  
        should(checks[1]).has.ownProperty('rule')
        .which.equal('isRequired')
      })
    })

    describe('Immutablitiy', function() {
      it('should be immutable with primitives', function() {
        const type1 = Type.number
        const type2 = type1.isRequired

        should(type1).not.equal(type2)
      })

      it('should be immutable with shapes', function() {
        const shape1 = Type.shape({
          name: Type.string.isRequired,
        })
        const shape2 = shape1.isRequired
        should(shape1).not.equal(shape2)
      })

      it('Should replace previously defined params', function() {
        const type = Type
        .instanceOf(Array)
        .instanceOf(Date)

        const dateReport = check(new Date(), type)

        should(dateReport).has.lengthOf(0)

        const arrayReport = check(new Array(), type)
        
        should(arrayReport).has.lengthOf(1)
        should(arrayReport[0].rule).be.equal('instanceOf')
      })
    })
  })

  describe('Rule', () => {
    it('Descendants should be valid rules', () => {
      class MyRule extends Rule {
        static get ruleName() { return 'myRule' }
      }

      const options = MyRule.create([], MyRule.config())
      should(options).has.lengthOf(1)
      should(options[0].rule).be.equal('myRule')

      const issues = MyRule.check(void 0, options[0].params)
      should(issues).has.lengthOf(0)
    })
  })
})