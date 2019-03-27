import {
  Checkable,
  CheckableType,
  Rule,
  RuleType,
  Issue,
  Check,
  // Decorators
  toInstance,
  toStatic,
  args,
  result,
  // Helper methods
  check,
  getChecks,
  getRuleParams,
  listRules,
  // Miscelaneous
  CHECK,
  CHECKS,
} from './base'

export {
  Checkable,
  Rule,
  toInstance,
  toStatic,
  result,
  check,
  args,
  getChecks,
  getRuleParams,
  listRules,
  CHECK,
  CHECKS,
  CheckableType,
  RuleType,
}

function skip(test: (it: any) => boolean) {
  return function (_target: Function, _prop: string, descriptor: PropertyDescriptor) {
    const {value} = descriptor
    descriptor.value = function(it: any, ...args) {
      if (test(it) === true) {
        return []
      }
      else {
        return value.call(this, it, ...args)
      }
    }
  }
}

function filterByRuleName(checks: Check[], rule: string): Check[] {
  return checks.filter((item) => item.rule !== rule)
}

export class UniqRule extends Rule {
  static create(checks: Check[], params:Object): Check[] {
    return [
      ...filterByRuleName(checks, this.ruleName),
      {
        rule: this.ruleName,
        params,
        check: this.check.bind(this),
      },
    ]
  }
}

export class SimpleRule extends UniqRule {
  static config(expect = true):object {
    return {expect}
  }

  static check(it: any, {expect, ...rest}:{expect:boolean}): Issue[] {
    if (this.checkIt(it, rest) === expect) {
      return []
    }

    return [{
      rule: this.ruleName,
      path: [],
      details: {
        reason: 'mismatch',
        expect,
        is: !expect,
      },
    }]
  }

  /* istanbul ignore next */
  static checkIt(_it:any, _params: object):boolean {
    return true
  }
}

class IsRequired extends UniqRule {
  static ruleName = 'isRequired'

  static config(isRequired = true) {
    return {isRequired}
  }

  static create(checks: Check[], params: object): Check[] {
    return [
      ...checks.filter(({rule}) => rule !== this.ruleName),
      {
        rule: this.ruleName,
        params,
        check: this.check.bind(this),
      }
    ]
  }
 
  static check(value:any, {isRequired}: {isRequired: boolean}): Issue[] {
    if (typeof value === 'undefined' && isRequired) {
      return [{
        rule: this.ruleName,
        path: [],
        details: {
          reason: 'mismatch',
          expect: true,
          is: false,
        },
      }]
    }
    else {
      return []
    }
  }
}

class IsOptional extends UniqRule {
  static ruleName = 'isRequired'

  static create(checks: Check[]): Check[] {
    return filterByRuleName(checks, this.ruleName)
  }
}

class OfType extends UniqRule {
  static ruleName = 'type'
  static typeName = ''

  static config(expect = true) {
    return {type: this.typeName, expect}
  }

  @skip(isUndefined)
  static check(it:any, {type, expect}): Issue[] {
    const result = []

    if (this.checkIt(it) !== expect) {
      result.push({
        rule: this.ruleName,
        path: [],
        details: {
          reason: 'mismatch',
          type: type,
          expect,
          is: !expect,
        },
      })
    }
    return result
  }

  /* istanbul ignore next */
  static checkIt(_it: any): boolean {
    return true
  }
}

class IsString extends OfType {
  static typeName = 'string'

  static checkIt(it:any): boolean {
    return typeof it === 'string'
  }
}

class IsNumber extends OfType {
  static typeName = 'number'

  static checkIt(it:any): boolean {
    return typeof it === 'number'
  }
}

class IsBoolean extends OfType {
  static typeName = 'bool'

  static checkIt(it:any): boolean {
    return typeof it === 'boolean'
  }
}

class IsFunc extends OfType {
  static typeName = 'func'

  static checkIt(it:any): boolean {
    return typeof it === 'function'
  }
}

class IsSymbol extends OfType {
  static typeName = 'symbol'

  static checkIt(it:any): boolean {
    return typeof it === 'symbol'
  }
}

class IsObject extends OfType {
  static typeName = 'object'

  static checkIt(it:any): boolean {
    return typeof it === 'object' && it !== null
  }
}

class IsArray extends OfType {
  static typeName = 'array'

  static checkIt(it: any): boolean {
    return Array.isArray(it)
  }
}

class Any extends Rule {
  static ruleName = 'type'

  static create(checks: Check[]): Check[] {
    return filterByRuleName(checks, 'type')
  }
}

class InstanceOf extends UniqRule {
  static ruleName = 'instanceOf'

  static config(constructor: Function = Function) {
    return {constructor}
  }

  @skip(isUndefined)
  static check(it:any, {constructor}): Issue[] {
    const result = []
    if (! isObject(it) || (it instanceof constructor === false)) {
      result.push({
        rule: this.ruleName,
        path: [],
        details: {
          reason: 'mismatch',
          expect: constructor,
          is: it.constructor,
        },
      })
    }
    return result
  }
}

class OneOf extends UniqRule {
  static ruleName = 'oneOf'

  static config(values: Rule[]) {
    return {values}
  }

  @skip(isUndefined)
  static check(it:any, {values}): Issue[] {
    const hasSome = values.some((value: any) => value === it)

    const result = []
    if (! hasSome) {
      result.push({
        rule: this.ruleName,
        path: [],
        details: {
          reason: 'no_matches',
          expect: {values},
          is: false,
        },
      })
    }
    return result
  }
}

class OneOfType extends UniqRule {
  static ruleName = 'oneOfType'

  static config(types: Rule[]) {
    return {types}
  }

  @skip(isUndefined)
  static check(it:any, {types}): Issue[] {
    const hasSome = types.some((type: any) => {
      const issues = check(it, type)
      return issues.length === 0
    })

    const result = []
    if (! hasSome) {
      result.push({
        rule: this.ruleName,
        path: [],
        details: {
          reason: 'no_matches',
          expect: {types},
          is: false,
        },
      })
    }
    return result
  }
}

class ArrayOf extends UniqRule {
  static ruleName = 'arrayOf'

  static config(type: Rule[]) {
    return {type}
  }

  static create(checks:Check[], params:object): Check[] {
    return [
      ...IsArray.create(
        filterByRuleName(checks, this.ruleName),
        IsArray.config(true),
      ),
      {
        rule: this.ruleName,
        params,
        check: this.check.bind(this),
      },
    ]
  }

  @skip(isUndefined)
  static check(it:any, {type}): Issue[] {
    return it.map((item, i) => {
      const issues = check(item, type)

      return issues.map(({path, ...rest}) => ({
        path: [i, ...path],
        ...rest,
      }))
    })
    .filter((item) => item !== null)
    .reduce((result, item) => result.concat(item), [])
  }
}

class ObjectOf extends UniqRule {
  static ruleName = 'objectOf'

  static config(type: Rule[]) {
    return {type}
  }

  static create(checks:Check[], params:object): Check[] {
    return [
      ...IsObject.create(
        filterByRuleName(checks, this.ruleName),
        IsObject.config(true),
      ),
      {
        rule: this.ruleName,
        
        params,
        check: this.check.bind(this),
      },
    ]
  }

  @skip(isUndefined)
  static check(it:any, {type}): Issue[] {
    return Object.entries(it).map(([i, item]) => {
      const issues = check(item, type)

      return issues.map(({path, ...rest}) => ({
        path: [i, ...path],
        ...rest,
      }))
    })
    .filter((item) => item !== null)
    .reduce((result, item) => result.concat(item), [])
  }
}

type ShapeType = {[key:string]: Checkable}

class Shape extends UniqRule {
  static ruleName = 'shape'

  static config(shape: ShapeType): Object {
    return {shape}
  }

  static create(checks:Check[], params:object): Check[] {
    return [
      ...IsObject.create(
        filterByRuleName(checks, this.ruleName),
        IsObject.config(true),
      ),
      {
        rule: this.ruleName,
        params,
        check: this.check.bind(this),
      },
    ]
  }

  @skip(isUndefined)
  static check(it:any, {shape}: {shape: ShapeType}): Issue[] {
    return Object.entries(shape).map(([i, type]) => {
      const issues = check(it[i], type)

      return issues.map(({path, ...rest}) => ({
        path: [i, ...path],
        ...rest,
      }))
    })
    .filter((item) => item !== null)
    .reduce((result, item) => result.concat(item), [])
  }
}

class Exact extends UniqRule {
  static ruleName = 'shape'

  static config(shape: ShapeType): Object {
    return {shape}
  }

  static create(checks:Check[], params:object): Check[] {
    return [
      ...IsObject.create(
        filterByRuleName(checks, this.ruleName),
        IsObject.config(true),
      ),
      {
        rule: this.ruleName,
        params,
        check: this.check.bind(this),
      },
    ]
  }

  @skip(isUndefined)
  static check(it:any, {shape}: {shape: ShapeType}): Issue[] {
    const issues =  Object.entries(shape)
    .map(([i, type]) => {
      const issues = check(it[i], type)

      return issues.map(({path, ...rest}) => ({
        path: [i, ...path],
        ...rest,
      }))
    })
    .filter((item) => item !== null)
    .reduce((result, item) => result.concat(item), [])

    for (const prop of Object.getOwnPropertyNames(it)) {
      if (! shape.hasOwnProperty(prop)) {
        issues.push({
          rule: this.ruleName,
          path: [prop],
          details: {
            reason: 'redundant',
          },
        })
      }
    }

    return issues
  }
}

class Select extends UniqRule {
  static ruleName = 'select'

  static config(...args:any[]): Object {
    const select = []

    for (let i = 0; i < args.length; i++) {
      const item = args[i]
      if (! Array.isArray(item)) {
        throw new TypeError(`Argument #${i + 1} not an array`)
      }
      else if (item.length !== 2) {
        throw new TypeError(`Argument #${i + 1} bad length ${item.length}. Expect 2`)
      }
      else if (typeof item[0] !== 'function') {
        throw new TypeError(`Argument #${i + 1} first item isn't a function`)
      }
      else if (item[1] instanceof Checkable === false) {
        throw new TypeError(`Argument #${i + 1} second item isn't a Rule`)
      }
      select.push(item)
    }

    return {select}
  }

  @skip(isUndefined)
  static check(it:any, {select}): Issue[] {
    for (let i = 0; i < select.length; i++) {
      const item = select[i]
      if (Array.isArray(item)) {
        const [match, type] = item

        if (match(it) === true) {
          return check(it, type)
        }
      }
    }
    
    return [{
      rule: this.ruleName,
      path: [],
      details: {
        reason: 'no_matches'
      },
    }]
  }
}

class Custom extends UniqRule {
  static config(check: Function, ...args: any[]): object {
    if (typeof check !== 'function') {
      throw new TypeError('Argument #1 is not a function')
    }

    return {check, args}
  }

  static check(it: any, {check, args}): Issue[] {
    if (check(it, ...args) === true) {
      return []
    }

    return [{
      rule: this.ruleName,
      path: [],
      details: {
        reason: 'mismatch',
      },
    }]
  }
}

/* istanbul ignore next */
class TypedProps extends Checkable {
  // Existence types

  static get any() {
    return new this()
  }

  @toInstance(Any)
  get any(): TypedProps {
    return this
  }

  // Required

  @toStatic(IsRequired)
  static get isRequired(): TypedProps {
    return new this()
  }

  @toInstance(IsRequired)
  get isRequired(): TypedProps {
    return this
  }

  // IsOptional

  @toStatic(IsOptional)
  static get optional(): TypedProps {
    return new this()
  }

  @toInstance(IsOptional)
  get optional(): TypedProps {
    return this
  }

  // Basic types

  // String

  @toStatic(IsString)
  static get string(): TypedProps {
    return new this()
  }

  @toInstance(IsString)
  get string(): TypedProps {
    return this
  }

  // Number

  @toStatic(IsNumber)
  static get number(): TypedProps {
    return new this()
  }

  @toInstance(IsNumber)
  get number(): TypedProps {
    return this
  }

  // Boolean

  @toStatic(IsBoolean)
  static get bool(): TypedProps {
    return new this()
  }

  @toInstance(IsBoolean)
  get bool(): TypedProps {
    return this
  }

  // Symbol

  @toStatic(IsSymbol)
  static get symbol(): TypedProps {
    return new this()
  }

  @toInstance(IsSymbol)
  get symbol(): TypedProps {
    return this
  }

  // Function

  @toStatic(IsFunc)
  static get func(): TypedProps {
    return new this()
  }

  @toInstance(IsFunc)
  get func(): TypedProps {
    return this
  }

  // Object

  @toStatic(IsObject)
  static get object(): TypedProps {
    return new this()
  }

  @toInstance(IsObject)
  get object(): TypedProps {
    return this
  }

  // Array

  @toStatic(IsArray)
  static get array(): TypedProps {
    return new this()
  }

  @toInstance(IsArray)
  get array(): TypedProps {
    return this
  }

  // InstanceOf
  
  @toStatic(InstanceOf)
  static instanceOf(_constructor: object): TypedProps {
    return new this()
  }

  @toInstance(InstanceOf)
  instanceOf(_constructor: object): TypedProps {
    return this
  }

  // OneOf

  @toStatic(OneOf)
  static oneOf(_types: object): TypedProps {
    return new this()
  }

  @toInstance(OneOf)
  oneOf(_types: object): TypedProps {
    return this
  }

  // ArrayOf

  @toStatic(ArrayOf)
  static arrayOf(_types: object): TypedProps {
    return new this()
  }

  @toInstance(ArrayOf)
  arrayOf(_types: object): TypedProps {
    return this
  }

  // ObjectOf

  @toStatic(ObjectOf)
  static objectOf(_types: object): TypedProps {
    return new this()
  }

  @toInstance(ObjectOf)
  objectOf(_types: object): TypedProps {
    return this
  }

  // OneOfType

  @toStatic(OneOfType)
  static oneOfType(_types: object): TypedProps {
    return new this()
  }

  @toInstance(OneOfType)
  oneOfType(_types: object): TypedProps {
    return this
  }

  // Shape

  @toStatic(Shape)
  static shape(_shape: ShapeType): TypedProps {
    return new this()
  }

  @toInstance(Shape)
  shape(_shape: ShapeType): TypedProps {
    return this
  }

  // Exact

  @toStatic(Exact)
  static exact(_shape: ShapeType): TypedProps {
    return new this()
  }

  @toInstance(Exact)
  exact(_shape: ShapeType): TypedProps {
    return this
  }

  // Select

  @toStatic(Select)
  static select(..._select: any[]): TypedProps {
    return new this()
  }

  @toInstance(Select)
  select(..._select: any[]): TypedProps {
    return this
  }

  @toStatic(Custom)
  static custom(_check: Function, ..._args: any[]): TypedProps {
    return new this()
  }

  @toInstance(Custom)
  custom() {
    return this
  }
}

const strictOptions = {
  defaultChecks: IsRequired.create([], IsRequired.config()),
}

/* istanbul ignore next */
class StrictTypedProps extends TypedProps {
  constructor(checks: Check[] = IsRequired.create([], IsRequired.config())) {
    super(checks)
  }

  // Basic types

  // String

  @toStatic(IsString, strictOptions)
  static get string(): TypedProps {
    return new this()
  }

  @toInstance(IsString)
  get string(): TypedProps {
    return this
  }

  // Number

  @toStatic(IsNumber, strictOptions)
  static get number(): TypedProps {
    return new this()
  }

  @toInstance(IsNumber)
  get number(): TypedProps {
    return this
  }

  // Boolean

  @toStatic(IsBoolean, strictOptions)
  static get bool(): TypedProps {
    return new this()
  }

  @toInstance(IsBoolean)
  get bool(): TypedProps {
    return this
  }

  // Symbol

  @toStatic(IsSymbol, strictOptions)
  static get symbol(): TypedProps {
    return new this()
  }

  @toInstance(IsSymbol)
  get symbol(): TypedProps {
    return this
  }
  // Function

  @toStatic(IsFunc, strictOptions)
  static get func(): TypedProps {
    return new this()
  }

  @toInstance(IsFunc)
  get func(): TypedProps {
    return this
  }

  // Object

  @toStatic(IsObject, strictOptions)
  static get object(): TypedProps {
    return new this()
  }

  @toInstance(IsObject)
  get object(): TypedProps {
    return this
  }

  // Array

  @toStatic(IsArray, strictOptions)
  static get array(): TypedProps {
    return new this()
  }

  @toInstance(IsArray)
  get array(): TypedProps {
    return this
  }

  // InstanceOf
  @toStatic(InstanceOf, strictOptions)
  static instanceOf(_constructor: object): TypedProps {
    return new this()
  }

  @toInstance(InstanceOf)
  instanceOf(_constructor: object): TypedProps {
    return this
  }

  // OneOf

  @toStatic(OneOf, strictOptions)
  static oneOf(_types: object): TypedProps {
    return new this()
  }

  @toInstance(OneOf)
  oneOf(_types: object): TypedProps {
    return this
  }

  // ArrayOf

  @toStatic(ArrayOf, strictOptions)
  static arrayOf(_types: object): TypedProps {
    return new this()
  }

  @toInstance(ArrayOf)
  arrayOf(_types: object): TypedProps {
    return this
  }

  // ObjectOf

  @toStatic(ObjectOf, strictOptions)
  static objectOf(_types: object): TypedProps {
    return new this()
  }

  @toInstance(ObjectOf)
  objectOf(_types: object): TypedProps {
    return this
  }

  // OneOfType

  @toStatic(OneOfType, strictOptions)
  static oneOfType(_types: object): TypedProps {
    return new this()
  }

  @toInstance(OneOfType)
  oneOfType(_types: object): TypedProps {
    return this
  }

  // Shape

  @toStatic(Shape, strictOptions)
  static shape(_shape: ShapeType): TypedProps {
    return new this()
  }

  @toInstance(Shape)
  shape(_shape: ShapeType): TypedProps {
    return this
  }

  @toStatic(Select, strictOptions)
  static select(..._select: any[]): TypedProps {
    return new this()
  }

  @toInstance(Select)
  select(..._select: any[]): TypedProps {
    return this
  }

  @toStatic(Custom, strictOptions)
  static custom(_check: Function, ..._args: any[]): TypedProps {
    return new this()
  }

  @toInstance(Custom)
  custom() {
    return this
  }
}

export {TypedProps as Type, StrictTypedProps as StrictType}

function isObject(value: any): value is {} {
  return value !== null && typeof value === 'object'
}

function isUndefined(value: any): value is void {
  return typeof value === 'undefined'
}