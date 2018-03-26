'use strict';

class PureProps {
    constructor() {
        this._checks = [];
    }

    // Get all `type` checks
    static getChecks(type) {
        return type._checks.slice();
    }

    // Get check from `type` by `name`
    static getCheck(type, name) {
      const result = type._checks.find((item) => item.name === name);

      if (result) {
        return result.args;
      }
      else {
        return null;
      }
    }

    static addMethod(name, ...args) {
        if (this.hasOwnProperty(name)) {
            throw new Error(`Checker "${name}" exists`);
        }

        addCheckerMethod(this, name, ...args);
    }

    static addProperty(name, checker) {
        if (this.hasOwnProperty(name)) {
            throw new Error(`Checker "${name}" exists`);
        }

        addCheckerProperty(this, name, checker);
    }

    static check(value, typedProps) {
        for (const {name, check, args} of typedProps._checks) {
            const reports = check.call(typedProps, value, ...args);

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

function addCheckerMethod(cls, name, ...args) {
    let check;
    let transform;
    if (args.length > 1) {
        transform = args[0];
        check = args[1];
    }
    else {
        transform = null;
        check = args[0];
    }

    if (typeof check !== 'function') {
        throw new Error('Argument `check` should be a function');
    }

    const staticMethod = function(...args) {
        return (new this())[name](...args);
    };

    const instanceMethod = function(...args) {
        const clone = new this.constructor();

        if (transform) {
            args = [transform(...args)];
        }

        let isReplaced = false;
        const checks = [];

        for (const item of this._checks) {
            if (item.check === check) {
                checks.push({name, check, args});
                isReplaced = true;
            }
            else {
                checks.push(item);
            }
        }

        if (! isReplaced) {
            checks.push({name, check, args});
        }

        clone._checks = checks;
        return clone;
    };

    cls[name] = staticMethod;
    cls.prototype[name] = instanceMethod;
}

function addCheckerProperty(cls, name, check) {
    if (typeof check !== 'function') {
        throw new Error('check should be a function');
    }

    Object.defineProperty(cls, name, {
        get() {
            return (new this())[name];
        }
    });

    Object.defineProperty(cls.prototype, name, {
        get() {
            const clone = new this.constructor();
            clone._checks = [
                ...this._checks,
                {name, check, args:[]}
            ];
            return clone;
        }
    });
}

// TypedProps implementation

class TypedProps extends PureProps {}

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

function returnArgs(...args) {
    return args;
}

module.exports = TypedProps;
