/* global describe */
/* global it */
const should = require('should')

const {Type, TypeStore: Store, Ref, check} = require('..')

describe('TypeStore.', function(){
  describe('TypeStore()', function() {
    describe('TypeStore#add(), Store#get()', function() {
      it('Should add new rule', function() {
        const type = Type.string

        const store = new Store()
        store.add('name', type)

        should(store.get('name')).be.equal(type)
      })
    })

    describe('TypeStore#ref()', function() {
      it('Should return a reference', function () {
        const store = new Store()

        store.add('num', Type.number)
        const ref = store.ref('num')

        should(ref).be.instanceOf(Ref)
      })

      it('Should return a reference to value from store', function () {
        const store = new Store()

        store.add('num', Type.number)
        const ref = store.ref('num')

        should(ref.unref()).be.equal(store.get('num'))
      })
    })
  })

  describe('Unref types.', function() {
    it('Should resolve cycle deps', function() {
      const store = new Store()

      store.add('user', Type.shape({
        id: Type.number.isRequired,
        posts: Type.arrayOf(store.ref('post')),
      }))

      store.add('post', Type.shape({
        id: Type.number.isRequired,
        authors: Type.arrayOf(store.ref('user')),
      }))

      const issues = [
        ...check({id: 1, posts: [{
          id: 2,
          authors: [null],
        }]}, store.get('user')),
      ]

      should(issues).has.lengthOf(1)
      should(issues[0].path).be.deepEqual(['posts', 0, 'authors', 0])
      should(issues[0].rule).be.equal('type')
    })

    describe('oneOfType()', function() {
      it('Should unref', function() {
        const store = new Store()

        store.add('num', Type.number)
        const issues = check(null, Type.oneOf([
          store.ref('num')]
        ))

        should(issues).has.lengthOf(1)
        should(issues[0].rule).be.equal('oneOf')
      })
    })

    describe('objectOf()', function() {
      it('Should unref', function() {
        const store = new Store()
        const type = Type.objectOf(store.ref('num'))

        store.add('num', Type.number)
        const issues = check({x:null, y:null}, type)

        should(issues).has.lengthOf(2)
        should(issues[0].path).be.deepEqual(['x'])
        should(issues[0].rule).be.equal('type')
        should(issues[1].path).be.deepEqual(['y'])
        should(issues[1].rule).be.equal('type')
      })
    })

    describe('arrayOf()', function() {
      it('Should unref', function() {
        const store = new Store()
        const type = Type.arrayOf(store.ref('num'))

        store.add('num', Type.number)
        const issues = check([null], type)

        should(issues).has.lengthOf(1)
        should(issues[0].path).be.deepEqual([0])
        should(issues[0].rule).be.equal('type')
      })
    })

    describe('shape()', function() {
      it('Should unref', function() {
        const store = new Store()

        store.add('num', Type.number)
        const issues = check({x:null}, Type.shape({x: store.ref('num')}))

        should(issues).has.lengthOf(1)
        should(issues[0].path).be.deepEqual(['x'])
        should(issues[0].rule).be.equal('type')
      })
    })

    describe('exact()', function() {
      it('Should unref', function() {
        const store = new Store()

        store.add('num', Type.number)
        const issues = check({x:null}, Type.exact({x: store.ref('num')}))

        should(issues).has.lengthOf(1)
        should(issues[0].path).be.deepEqual(['x'])
        should(issues[0].rule).be.equal('type')
      })
    })

    describe('exactFuzzy()', function() {
      it('Should unref', function() {
        const store = new Store()
        const type = Type.exactFuzzy({x: store.ref('num')}, [/^a\d$/, store.ref('bool')])

        store.add('num', Type.number)
        store.add('bool', Type.bool)
        const issues = check({x:null, a0:null}, type)

        should(issues).has.lengthOf(2)
        should(issues[0].path).be.deepEqual(['x'])
        should(issues[0].rule).be.equal('type')
        should(issues[1].path).be.deepEqual(['a0'])
        should(issues[1].rule).be.equal('type')
      })
    })

    describe('select()', function() {
      it('Should unref', function() {
        const store = new Store()
        const type = Type.select(
          [() => true, store.ref('num')]
        )

        store.add('num', Type.number)
        const issues = check(null, type)

        should(issues).has.lengthOf(1)
        should(issues[0].path).be.deepEqual([])
        should(issues[0].rule).be.equal('type')
      })
    })
  })
})
