'use strict';

class PureProps {
    constructor() {
        this._checks = [];
    }

    static addMethod(name, checker) {
        if (this.hasOwnProperty(name)) {
            throw new Error(`Checker "${name}" exists`);
        }

        addCheckerMethod(this, name, checker);
    }

    static addProperty(name, checker) {
        if (this.hasOwnProperty(name)) {
            throw new Error(`Checker "${name}" exists`);
        }

        addCheckerProperty(this, name, checker);
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
    if (typeof checkerFunc !== 'function') {
        throw new Error('checkerFunc should be a function');
    }

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
    if (typeof checkerFunc !== 'function') {
        throw new Error('checkerFunc should be a function');
    }

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

TypedProps.addProperty('number', skipUndef(typeOf('number')));

TypedProps.addProperty('string', skipUndef(typeOf('string')));

TypedProps.addProperty('bool', skipUndef(typeOf('boolean')));

TypedProps.addProperty('func', skipUndef(typeOf('function')));

TypedProps.addProperty('symbol', skipUndef(typeOf('symbol')));

TypedProps.addProperty('object', skipUndef(isObject));

TypedProps.addProperty('array', skipUndef(Array.isArray));

TypedProps.addProperty('isRequired', function(value) {
    return typeof value !== 'undefined';
});

TypedProps.addMethod('instanceOf', skipUndef(function(value, cls) {
    return isObject(value) && value instanceof cls;
}));

TypedProps.addMethod('oneOf', skipUndef(function(value, values) {
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
}));

TypedProps.addMethod('oneOfType', skipUndef(function(value, types) {
    for (const type of types) {
        const result = this.constructor.check(value, type);
        if (! result.length) {
            return true;
        }
    }

    return false;
}));

TypedProps.addMethod('arrayOf', skipUndef(function(value, type) {
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
}));

TypedProps.addMethod('objectOf', skipUndef(function(value, type) {
    if (! isObject(value)) {
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
}));

TypedProps.addMethod('shape', skipUndef(function(value, shape) {
    if (! isObject(value)) {
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
}));

function skipUndef(fn) {
    return function (value, ...args) {
        if (value === undefined) {
            return;
        }
        else {
            return fn.call(this, value, ...args);
        }
    };
}

function typeOf(type) {
    return function(value) {
        return typeof value === type;
    };
}

function entries(object) {
    return Object.keys(object)
    .reduce((result, key) => [
        ...result,
        [key, object[key]]
    ], []);
}

function isObject(value) {
    return value !== null && typeof value === 'object';
}

module.exports = TypedProps;
