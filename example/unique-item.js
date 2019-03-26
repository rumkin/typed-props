// const Types = require('typed-props');
const {Type, UniqRule} = require('../');

class UniqueItems extends UniqRule {
    static ruleName = 'uniqueItems';

    static format(key = 'id') {
        return {key};
    }

    static check(items, {key}) {
        const keys = new Set();
        const issues = [];
        
        for (const i in items) {
            const item = items[i];
            const id = item[key];
            
            if (! keys.has(id)) {
                const issue = {
                    rule: this.ruleName,
                    path: [i],
                    details: {
                        keyProp: key,
                        key: id,
                    },
                };

                issues.push(issue);
            }
    
            keys.set(id);
        }
        
        return issues;
    }
}

class MyType extends Type {
    static uniqueItems(...args) {
        const checks = UniqueItems.create([], UniqueItems.format(...args))
        
        return new this(checks);
    }

    uniqueItems(...args) {
        const checks = UniqueItems.create(this.getChecks(), UniqueItems.format(...args))
        
        return new this.constructor(checks);
    }
}

const type = MyType.object
.instanceOf(Array)
.uniqueItems('id');

const value = [
    {
        id: 1,
    },
    {
        id: 2,
    },
    {
        id: 2, // Not unique value
    },
];

const issues = Type.check(value, type);
// issues array contain single issue for last element:
// {path: [2], rule: 'unique', details: {keyProp: 'id', key: 2}}

console.log(issues);
