import {Type, UniqRule} from 'typed-props'

class UniqItems extends UniqRule {
  static ruleName = 'uniqueItems'

  static format(key = 'id') {
    return {key}
  }

  static check(items, {key}) {
    const keys = new Set()
    const issues = []
    
    items.forEach((item, i) => {
      const id = item[key]
      
      if (! keys.has(id)) {
        const issue = {
          rule: this.ruleName,
          path: [i],
          details: {
            reason: 'duplicate',
            keyProp: key,
            key: id,
          },
        }

        issues.push(issue)
      }

      keys.set(id)
    })
    
    return issues
  }
}

class MyType extends Type {
  static uniqueItems(...args) {
    const checks = UniqItems.create([], UniqItems.format(...args))
    
    return new this(checks)
  }

  uniqueItems(...args) {
    const checks = UniqItems.create(this.getChecks(), UniqItems.format(...args))
    
    return new this.constructor(checks)
  }
}

const type = MyType.object
.instanceOf(Array)
.uniqueItems('id')

const value = [
  {id: 1},
  {id: 2},
  {id: 2}, // Duplicate
]

const issues = Type.check(value, type)
// issues array contain single issue for last element:
// {path: [2], rule: 'uniqueItems', details: {reason: 'duplicate', keyProp: 'id', key: 2}}

console.log(issues)
