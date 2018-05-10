// const Types = require('typed-props');
const Type = require('../');

Type.addMethod('uniqueItems', function(value, select = null) {
    let getUnique;
    if (select) {
        getUnique = (item) => item[select];
    }
    else {
        getUnique = (item) => (item);
    }

    //Then check the "Of part"
    let uniqValues = [];
    let report = [];

    value.forEach((item, i) => {
        // Validate uniqueness
        const itemValue = getUnique(item);

        if (uniqValues.includes(itemValue)) {
            report = [
                ...report,
                {
                    path: [i],
                    rule: 'unique',
                    details: {
                        expect: true,
                        is: false,
                    },
                },
            ];
        }

        uniqValues = [...uniqValues, itemValue];
    }, []);

    if (report.length) {
        return report;
    }

    return true;
});

const type = Type.object
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
// {path: [2], rule: 'unique', details: {is: false, expect: true}}

console.log(issues);
