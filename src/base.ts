export const CHECKS = Symbol('checks');
export const CHECK = Symbol('check');

export type Check = {
  rule: string
  params: Object
  check: (value:any, params: Object, self: CheckableType) => Issue[]
}

export type Issue = {
  rule: string
  path: Array<string|number>
  details: Object
}

export type RuleType = {
  ruleName: string
  create: (checks: Check[], params: Object) => Check[]
  format: (...args: any[]) => Object
  check: (value: any, params: Object, checker: CheckableType) => Issue[]
}

export type CheckableType = {
  [CHECK]: (it:any, type: Checkable|Object) => Issue[]
}

export class Rule {
  static ruleName = ''

  static create(checks: Check[], params: Object): Check[] {
      return [
      ...checks,
      {
        rule: this.ruleName,
        params,
        check: this.check.bind(this),
      },
    ]
  }

  static format(..._args: any[]): Object {
    return {}
  }

  static check(_value: any, _params: object, _check: CheckableType): Issue[] {
    return [];
  }
}

export class CheckError extends TypeError {
  issues: Issue[]

  constructor(message: string, issues: Issue[]) {
    super(message)
    this.issues = issues
  }
}

export function check(it:any, checker:Checkable): Issue[] {
  return checker[CHECK](it);
}

export class Checkable {
  private [CHECKS]: Check[];

  constructor(checks: Check[] = []) {
    this[CHECKS] = checks
  }

  static [CHECK](it: any, type: Checkable): Issue[] {
    if (type instanceof Checkable === false) {
      throw new Error('Type should be instance of Checkable');
    }
    
    const checks = type[CHECKS];

    for (const {params, check} of checks) {
      const result = check(it, params, this);
      if (result.length) {
        return result;
      }
    }

    return [];
  }

  [CHECK](it: any): Issue[] {
    const checks = this[CHECKS];

    for (const {params, check} of checks) {
      const result = check(it, params, this);
      if (result.length) {
        return result;
      }
    }

    return [];
  }

  getChecks(): Check[] {
    return this[CHECKS];
  }
}

export function args(...types: Checkable[]) {
  return function(_proto:Function, _name:string, descriptor: PropertyDescriptor) {
    if (typeof descriptor.value !== 'function') {
      return;
    }

    const origin = descriptor.value;

    descriptor.value = function(...args) {
      const report = checkFunctionArgs(args, types);

      if (report.length) {
        throw new CheckError('Bad arguments', report);
      }

      return origin.call(this, ...args);
    }
  };
}

export function result(type: Checkable) {
  return function(_proto:Function, _name:string, descriptor: PropertyDescriptor) {
    if (typeof descriptor.value !== 'function') {
      return;
    }

    const origin = descriptor.value;

    descriptor.value = function(...args) {
      const result = origin.call(this, ...args);

      const report = type[CHECK](result);
      if (report.length) {
        throw new CheckError('Bad result type', report);
      }

      return result;
    }
  }
}

export function getRuleParams(type: Checkable, rule: string): Object|void {
  const check = type[CHECKS].find(
    (option: Check) => option.rule === rule
  );

  if (check) {
    return check.params;
  }
}

export function getChecks(type: Checkable): Check[] {
  return [...type[CHECKS]];
}

export function listRules(type: Checkable): string[] {
  return type[CHECKS].map(({rule}) => rule);
}

function checkFunctionArgs(args:any[], types: Checkable[]) {
  let report = [];

  for (let i = 0; i < types.length; i++) {
    const type = types[i];

    if (i === types.length - 1 && Array.isArray(type)) {
      const issues = checkEach(args.slice(i), type[0]);

      if (issues.length) {
        report = issues.map((item) => {
          item.path[0] = item.path[0] + i;
        });
        break;
      }
    }
    else {
      const issues = check(args[i], type);

      if (issues.length) {
        report = issues;
        break;
      }
    }
  }

  return report;
}

function checkEach(args: any[], type: Checkable[]) {
  for (const arg of args) {
    const issues = type[CHECK](arg);

    if (issues.length) {
      return issues;
    }
  }

  return [];
}


export function toStatic(checkable: RuleType, {defaultChecks = []} = {}) {
  return function(_target: any, _name: any, descriptor: PropertyDescriptor) {
    if (typeof descriptor.get === 'function') {
      descriptor.get = function() {
        const checks = checkable.create(defaultChecks,
          checkable.format()
        );
  
        return new this(checks);
      };
    }
    else {
      descriptor.value = function(...args: any[]) {
        const checks = checkable.create(defaultChecks,
          checkable.format(...args)
        );
  
        return new this(checks);
      };
    }
  }
}
  
export function toInstance(checkable: RuleType) {
  return function(_target: any, _name: any, descriptor: PropertyDescriptor) {
    if (typeof descriptor.get === 'function') {
      descriptor.get = function() {

        const checks = checkable.create(this[CHECKS],
          checkable.format()
        );
  
        return new this.constructor(checks);
      };
    } else {
      descriptor.value = function(...args: any[]) {
        const checks = checkable.create(this[CHECKS],
          checkable.format(...args)
        );
  
        return new this.constructor(checks);
      };
    }
  }
}
