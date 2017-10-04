'use strict';

class PureProps {
    constructor() {
        this._checks = [];
    }

    static addChecker(name, checkerFunc) {
        if (typeof checkerFunc !== 'function') {
            throw new Error('Argument #2 should be a function');
        }

        if (this.hasOwnProperty(name)) {
            throw new Error(`Checker "${name}" already exists`);
        }

        if (checkerFunc.length > 1) {
            addCheckerMethod(this, name, checkerFunc);
        }
        else {
            addCheckerProperty(this, name, checkerFunc);
        }
    }

    static check(value, typedProps) {
        for (const {name, checkerFunc, args} of typedProps._checks) {
            const reports = checkerFunc.call(typedProps, value, ...args);

            if (reports === true || reports === undefined) {
                continue;
            }

            if (reports === false) {
                return [
                    {
                        path: [],
                        rule: name,
                        details: {is: false},
                    },
                ];
            }
            else if (! Array.isArray(reports)) {
                return [reports];
            }
            else {
                return [...reports];
            }
        }

        return [];
    }
}

class TypedProps extends PureProps {}

function addCheckerMethod(cls, name, checkerFunc) {
    const staticMethod = function(...args) {
        return (new this())[name](...args);
    };

    const instanceMethod = function(...args) {
        const clone = new this.constructor();
        clone._checks = [...this._checks, {name, checkerFunc, args}];
        return clone;
    };

    cls[name] = staticMethod;
    cls.prototype[name] = instanceMethod;
}

function addCheckerProperty(cls, name, checkerFunc) {
    Object.defineProperty(cls, name, {
        get() {
            return (new this())[name];
        }
    });

    Object.defineProperty(cls.prototype, name, {
        get() {
            const clone = new this.constructor();
            clone._checks = [...this._checks, {name, checkerFunc, args:[]}];
            return clone;
        }
    });
}

TypedProps.addChecker('isRequired', function(value) {
    return typeof value !== 'undefined';
});

TypedProps.addChecker('number', function(value) {
    if (typeof value === 'undefined') {
        return;
    }

    return typeof value === 'number';
});

TypedProps.addChecker('string', function(value) {
    if (typeof value === 'undefined') {
        return;
    }

    return typeof value === 'string';
});

TypedProps.addChecker('bool', function(value) {
    if (typeof value === 'undefined') {
        return;
    }

    return typeof value === 'boolean';
});

TypedProps.addChecker('object', function(value) {
    if (typeof value === 'undefined') {
        return;
    }

    return value !== null && typeof value === 'object';
});

TypedProps.addChecker('array', function(value) {
    if (typeof value === 'undefined') {
        return;
    }

    return Array.isArray(value);
});

TypedProps.addChecker('func', function(value) {
    if (typeof value === 'undefined') {
        return;
    }

    return typeof value === 'function';
});

TypedProps.addChecker('symbol', function(value) {
    if (typeof value === 'undefined') {
        return;
    }

    return typeof value === 'symbol';
});

TypedProps.addChecker('instanceOf', function(value, cls) {
    if (typeof value === 'undefined') {
        return;
    }

    return value !== null && typeof value === 'object' && value instanceof cls;
});

TypedProps.addChecker('oneOf', function(value, values) {
    if (typeof value === 'undefined') {
        return true;
    }

    if (! values.includes(value)) {
        return {
            path: [],
            rule: 'oneOf',
            detials: {
                is: value,
                expect: values,
            },
        };
    }

    return true;
});

TypedProps.addChecker('oneOfType', function(value, types) {
    if (typeof value === 'undefined') {
        return true;
    }

    for (const type of types) {
        const result = this.constructor.check(value, type);
        if (! result.length) {
            return true;
        }
    }

    return false;
});

TypedProps.addChecker('arrayOf', function(value, type) {
    if (typeof value === 'undefined') {
        return true;
    }

    if (! Array.isArray(value)) {
        return false;
    }

    const report = value.reduce((report, value, i) => {
        return [
            ...report,
            ...this.constructor.check(value, type)
            .map((issue) => {
                return {
                    path: [i, ...issue.path],
                    rule: issue.rule,
                    details: issue.details,
                };
            }),
        ];
    }, []);

    if (report.length) {
        return report;
    }

    return true;
});

TypedProps.addChecker('objectOf', function(value, type) {
    if (typeof value === 'undefined') {
        return true;
    }

    if (value === null || typeof value !== 'object') {
        return false;
    }

    const report = entries(value)
    .reduce((report, [prop, propValue]) => {
        return [
            ...report,
            ...this.constructor.check(propValue, type)
            .map((issue) => {
                return {
                    path: [prop, ...issue.path],
                    rule: issue.rule,
                    details: issue.details,
                };
            }),
        ];
    }, []);

    if (report.length) {
        return report;
    }

    return true;
});

TypedProps.addChecker('shape', function(value, shape) {
    if (typeof value === 'undefined') {
        return true;
    }

    if (value === null || typeof value !== 'object') {
        return false;
    }

    const report = entries(shape)
    .reduce((report, [prop, type]) => {
        return [
            ...report,
            ...this.constructor.check(value[prop], type)
            .map((issue) => ({
                path: [prop, ...issue.path],
                rule: issue.rule,
                details: issue.details,
            })),
        ];
    }, []);

    if (report.length) {
        return report;
    }

    return true;
});

function entries(object) {
    return Object.keys(object)
    .reduce((result, key) => [
        ...result,
        [key, object[key]]
    ], []);
}

module.exports = TypedProps;
