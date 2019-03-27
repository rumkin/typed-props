export const CHECKS = Symbol('checks')
export const CHECK = Symbol('check')

export type Check = {
  rule: string
  params: Object
  check: (value:any, params: Object) => Issue[]
}

export type Issue = {
  rule: string
  path: Array<string|number>
  details: {
    reason: string
    [key:string]: any
  }
}

export type RuleType = {
  ruleName: string
  create: (checks: Check[], params: Object) => Check[]
  config: (...args: any[]) => Object
  check: (value: any, params: Object) => Issue[]
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

  /* istanbul ignore next */
  static config(..._args: any[]): Object {
    return {}
  }
  
  /* istanbul ignore next */
  static check(_value: any, _params: object): Issue[] {
    return []
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
  return checker[CHECK](it)
}

export class Checkable {
  private [CHECKS]: Check[]

  constructor(checks: Check[] = []) {
    this[CHECKS] = checks
  }

  [CHECK](it: any): Issue[] {
    const checks = this[CHECKS]

    for (const {params, check} of checks) {
      const result = check(it, params)
      if (result.length) {
        return result
      }
    }

    return []
  }

  getChecks(): Check[] {
    return [...this[CHECKS]];
  }
}

export function args(...types: Checkable[]) {
  return function(_proto:Function, name:string, descriptor: PropertyDescriptor) {
    if (typeof descriptor.value !== 'function') {
      throw new TypeError(`Decorated property "${name}" is not a function`);
    }

    const origin = descriptor.value

    descriptor.value = function(...args:any[]) {
      const report = checkFunctionArgs(args, types)

      if (report.length) {
        throw new CheckError('Bad arguments', report)
      }

      return origin.call(this, ...args)
    }
  }
}

export function result(type: Checkable) {
  return function(_proto:Function, name:string, descriptor: PropertyDescriptor) {
    if (typeof descriptor.value !== 'function') {
      throw new TypeError(`Decorated property "${name}" is not a function`);
    }

    const origin = descriptor.value

    descriptor.value = function(...args) {
      const result = origin.call(this, ...args)

      const report = type[CHECK](result)
      if (report.length) {
        throw new CheckError('Bad result type', report)
      }

      return result
    }
  }
}

export function getRuleParams(type: Checkable, rule: string): Object|void {
  const check = type[CHECKS].find(
    (option: Check) => option.rule === rule
  )

  if (check) {
    return check.params
  }
}

export function getChecks(type: Checkable): Check[] {
  return [...type[CHECKS]]
}

export function listRules(type: Checkable): string[] {
  return type[CHECKS].map(({rule}) => rule)
}

function checkFunctionArgs(args:any[], types: Checkable[]) {
  let report = []

  for (let i = 0; i < types.length; i++) {
    const type = types[i]

    if (i === types.length - 1 && Array.isArray(type)) {
      const issues = checkEach(args.slice(i), type[0])

      if (issues.length) {
        report = issues.map((item) => {
          item.path[0] = <number>item.path[0] + i
        })
        break
      }
    }
    else {
      const issues = check(args[i], type)

      if (issues.length) {
        report = issues
        break
      }
    }
  }

  return report
}

function checkEach(args: any[], type: Checkable[]): Issue[] {
  for (const arg of args) {
    const issues = type[CHECK](arg)

    if (issues.length) {
      return issues
    }
  }

  return []
}


export function toStatic(checkable: RuleType, {defaultChecks = []} = {}) {
  return function(_target: any, _name: any, descriptor: PropertyDescriptor) {
    if (typeof descriptor.get === 'function') {
      descriptor.get = function() {
        const checks = checkable.create(defaultChecks,
          checkable.config()
        )
  
        return new this(checks)
      }
    }
    else {
      descriptor.value = function(...args: any[]) {
        const checks = checkable.create(defaultChecks,
          checkable.config(...args)
        )
  
        return new this(checks)
      }
    }
  }
}
  
export function toInstance(checkable: RuleType) {
  return function(_target: any, _name: any, descriptor: PropertyDescriptor) {
    if (typeof descriptor.get === 'function') {
      descriptor.get = function() {

        const checks = checkable.create(this[CHECKS],
          checkable.config()
        )
  
        return new this.constructor(checks)
      }
    } else {
      descriptor.value = function(...args: any[]) {
        const checks = checkable.create(this[CHECKS],
          checkable.config(...args)
        )
  
        return new this.constructor(checks)
      }
    }
  }
}
