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
  // Miscelaneous
  CHECK,
  CHECKS,
} from './base';

export {
  toInstance,
  toStatic,
  result,
  check,
  args,
  getChecks,
  getRuleParams,
  CHECK,
  CHECKS,
  CheckableType,
  RuleType,
};

function skipUndefined(_target: Function, _prop: string, descriptor: PropertyDescriptor) {
  const {value} = descriptor
  descriptor.value = function(it: any, ...args) {
    if (typeof it === 'undefined') {
      return [];
    }
    else {
      return value.call(this, it, ...args);
    }
  }
}

export class UniqRule extends Rule {
  static create(checks: Check[], params:Object): Check[] {
    return [
      ...checks.filter(({rule}) => rule !== this.ruleName),
      {
        rule: this.ruleName,
        params,
        check: this.check.bind(this),
      },
    ]
  }
}

export class SimpleRule extends UniqRule {
  static format(expect = true):object {
    return {expect};
  }

  static check(it: any, {expect, ...rest}:{expect:boolean}, checker:CheckableType): Issue[] {
    if (this.checkIt(it, rest, checker) === expect) {
      return [];
    }

    return [{
      rule: this.ruleName,
      path: [],
      details: {
        expect,
        is: !expect,
      },
    }];
  }

  static checkIt(_it:any, _params: object, _checker:CheckableType):boolean {
    return true;
  }
}

class IsRequired extends UniqRule {
  static ruleName = 'isRequired';

  static format(isRequired = true) {
    return {isRequired};
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
          accept: true,
          is: false,
        },
      }];
    }
    else {
      return [];
    }
  }
}

class IsOptional extends UniqRule {
  static ruleName = 'isRequired';

  static create(checks: Check[]): Check[] {
    return checks.filter(
      ({rule}) => rule !== this.ruleName
    )
  }
}

class TypeOf extends UniqRule {
  static propName = '';
  static type = '';

  static format(isType = true) {
    return {[this.propName]: isType};
  }

  @skipUndefined
  static check(it:any, params): Issue[] {
    const result = [];
    const shouldMatch = params[this.propName];

    if (! this.extraCheck(it) || (typeof it === this.type) !== shouldMatch) {
      result.push({
        rule: this.ruleName,
        path: [],
        details: {
          accept: shouldMatch,
          is: !shouldMatch,
        },
      });
    }
    return result;
  }

  static extraCheck(_it: any): boolean {
    return true;
  }
}

class IsArray extends UniqRule {
  static ruleName = 'array'

  static format(isArray = true) {
    return {isArray};
  }
  
  @skipUndefined
  static check(it:any, {isArray}): Issue[] {
    const result = [];

    if (Array.isArray(it) !== isArray) {
      result.push({
        rule: this.ruleName,
        path: [],
        details: {
          accept: isArray,
          is: !isArray,
        },
      });
    }
    return result;
  }
}

class IsString extends TypeOf {
  static ruleName = 'string'
  static propName = 'isString'
  static type = 'string'
}

class IsNumber extends TypeOf {
  static ruleName = 'number'
  static propName = 'isNumber'
  static type = 'number'
}

class IsBoolean extends TypeOf {
  static ruleName = 'bool'
  static propName = 'isBoolean'
  static type = 'boolean'
}

class IsFunc extends TypeOf {
  static ruleName = 'func'
  static propName = 'isFunction'
  static type = 'function'
}

class IsSymbol extends TypeOf {
  static ruleName = 'symbol'
  static propName = 'isSymbol'
  static type = 'symbol'
}

class IsObject extends TypeOf {
  static ruleName = 'object'
  static propName = 'isObject'
  static type = 'object'
  static extraCheck(value: any): boolean {
    return value !== null;
  }
}


class InstanceOf extends UniqRule {
  static ruleName = 'instanceOf'

  static format(constructor: Function = Function) {
    return {constructor};
  }

  @skipUndefined
  static check(it:any, {constructor}): Issue[] {
    const result = [];
    if (! isObject(it) || (it instanceof constructor === false)) {
      result.push({
        rule: this.ruleName,
        path: [],
        details: {
          accept: constructor,
          is: it.constructor,
        },
      });
    }
    return result;
  }
}

class OneOf extends UniqRule {
  static ruleName = 'oneOf'

  static format(values: Rule[]) {
    return {values};
  }

  @skipUndefined
  static check(it:any, {values}): Issue[] {
    const hasSome = values.some((value: any) => value === it);

    const result = [];
    if (! hasSome) {
      result.push({
        rule: this.ruleName,
        path: [],
        details: {
          accept: {values},
          is: false,
        },
      });
    }
    return result;
  }
}

class OneOfType extends UniqRule {
  static ruleName = 'oneOfType'

  static format(types: Rule[]) {
    return {types};
  }

  @skipUndefined
  static check(it:any, {types}): Issue[] {
    const hasSome = types.some((type: any) => {
      const issues = check(it, type);
      return issues.length === 0;
    });

    const result = [];
    if (! hasSome) {
      result.push({
        rule: this.ruleName,
        path: [],
        details: {
          accept: {types},
          is: false,
        },
      });
    }
    return result;
  }
}

class ArrayOf extends UniqRule {
  static ruleName = 'arrayOf'

  static format(type: Rule[]) {
    return {type};
  }

  @skipUndefined
  static check(it:any, {type}): Issue[] {
    if (! Array.isArray(it)) {
      return [{
        rule: this.ruleName,
        path: [],
        details: {
          accept: [type],
          isArray: false,
        },
      }];
    }

    return it.map((item, i) => {
      const issues = check(item, type);

      return issues.map(({path, ...rest}) => ({
        path: [i, ...path],
        ...rest,
      }));
    })
    .filter((item) => item !== null)
    .reduce((result, item) => result.concat(item), []);
  }
}

class ObjectOf extends UniqRule {
  static ruleName = 'objectOf'

  static format(type: Rule[]) {
    return {type};
  }

  @skipUndefined
  static check(it:any, {type}): Issue[] {
    if (! isObject(it) || ! isPlainObject(it)) {
      return [{
        rule: this.ruleName,
        path: [],
        details: {
          reason: 'not_an_object'
        },
      }];
    }

    return Object.entries(it).map(([i, item]) => {
      const issues = check(item, type);

      return issues.map(({path, ...rest}) => ({
        path: [i, ...path],
        ...rest,
      }));
    })
    .filter((item) => item !== null)
    .reduce((result, item) => result.concat(item), []);
  }
}

type ShapeType = {[key:string]: Checkable};

class Shape extends UniqRule {
  static ruleName = 'shape';

  static format(shape: ShapeType): Object {
    return {shape};
  }

  @skipUndefined
  static check(it:any, {shape}: {shape: ShapeType}): Issue[] {
    if (! isObject(it) || ! isPlainObject(it)) {
      return [{
        rule: this.ruleName,
        path: [],
        details: {
          reason: 'not_an_object'
        },
      }];
    }

    return Object.entries(shape).map(([i, type]) => {
      const issues = check(it[i], type);

      return issues.map(({path, ...rest}) => ({
        path: [i, ...path],
        ...rest,
      }));
    })
    .filter((item) => item !== null)
    .reduce((result, item) => result.concat(item), []);
  }
}

class Select extends UniqRule {
  static ruleName = 'select';

  static format(...args:any[]): Object {
    const select = [];
    let otherwise = false;

    for (let i = 0; i < args.length; i++) {
      const item = args[i];
      if (Array.isArray(item)) {
        if (typeof item[0] !== 'function') {
          throw new Error(`Argument #${i + 1} first item isn't a function`);
        }
        else if (item[1] instanceof Checkable === false) {
          throw new Error(`Argument #${i + 1} second item isn't a Rule`);
        }
        select.push(item);
      }
      else if (i !== args.length - 1) {
        throw new Error(`Invalid argument type #${i + 1}`);
      }
      else {
        otherwise = item;
      }
    }
    return {select, otherwise};
  }

  @skipUndefined
  static check(it:any, {select, otherwise}): Issue[] {
    for (let i = 0; i < select.length; i++) {
      const item = select[i];
      if (Array.isArray(item)) {
        const [match, type] = item;

        if (match(it) === true) {
          return check(it, type);
        }
      }
    }
    
    if (otherwise) {
      return [];
    }

    return [{
      rule: this.ruleName,
      path: [],
      details: {
        reason: 'otherwise'
      },
    }];
  }
}



class TypedProps extends Checkable {
  // Existence types

  // Required

  @toStatic(IsRequired)
  static get isRequired(): TypedProps {
    return new this();
  }

  @toInstance(IsRequired)
  get isRequired(): TypedProps {
    return this;
  }

  // IsOptional

  @toStatic(IsOptional)
  static get optional(): TypedProps {
    return new this();
  }

  @toInstance(IsOptional)
  get optional(): TypedProps {
    return this;
  }

  // Basic types

  // String

  @toStatic(IsString)
  static get string(): TypedProps {
    return new this();
  }

  @toInstance(IsString)
  get string(): TypedProps {
    return this;
  }

  // Number

  @toStatic(IsNumber)
  static get number(): TypedProps {
    return new this();
  }

  @toInstance(IsNumber)
  get number(): TypedProps {
    return this;
  }

  // Boolean

  @toStatic(IsBoolean)
  static get bool(): TypedProps {
    return new this();
  }

  @toInstance(IsBoolean)
  get bool(): TypedProps {
    return this;
  }

  // Symbol

  @toStatic(IsSymbol)
  static get symbol(): TypedProps {
    return new this();
  }

  @toInstance(IsSymbol)
  get symbol(): TypedProps {
    return this;
  }

  // Function

  @toStatic(IsFunc)
  static get func(): TypedProps {
    return new this();
  }

  @toInstance(IsFunc)
  get func(): TypedProps {
    return this;
  }

  // Object

  @toStatic(IsObject)
  static get object(): TypedProps {
    return new this();
  }

  @toInstance(IsObject)
  get object(): TypedProps {
    return this;
  }

  // Array

  @toStatic(IsArray)
  static get array(): TypedProps {
    return new this();
  }

  @toInstance(IsArray)
  get array(): TypedProps {
    return this;
  }

  // InstanceOf
  
  @toStatic(InstanceOf)
  static instanceOf(_constructor: object): TypedProps {
    return new this();
  }

  @toInstance(InstanceOf)
  instanceOf(_constructor: object): TypedProps {
    return this;
  }

  // OneOf

  @toStatic(OneOf)
  static oneOf(_types: object): TypedProps {
    return new this();
  }

  @toInstance(OneOf)
  oneOf(_types: object): TypedProps {
    return this;
  }

  // ArrayOf

  @toStatic(ArrayOf)
  static arrayOf(_types: object): TypedProps {
    return new this();
  }

  @toInstance(ArrayOf)
  arrayOf(_types: object): TypedProps {
    return this;
  }

  // ObjectOf

  @toStatic(ObjectOf)
  static objectOf(_types: object): TypedProps {
    return new this();
  }

  @toInstance(ObjectOf)
  objectOf(_types: object): TypedProps {
    return this;
  }

  // OneOfType

  @toStatic(OneOfType)
  static oneOfType(_types: object): TypedProps {
    return new this();
  }

  @toInstance(OneOfType)
  oneOfType(_types: object): TypedProps {
    return this;
  }

  // Shape

  @toStatic(Shape)
  static shape(_shape: ShapeType): TypedProps {
    return new this();
  }

  @toInstance(Shape)
  shape(_shape: ShapeType): TypedProps {
    return this;
  }

  @toStatic(Select)
  static select(..._select: any[]): TypedProps {
    return new this();
  }

  @toInstance(Select)
  select(..._select: any[]): TypedProps {
    return this;
  }
}

const strictOptions = {
  defaultChecks: IsRequired.create([], IsRequired.format()),
};

class StrictTypedProps extends TypedProps {
  constructor(checks: Check[] = IsRequired.create([], IsRequired.format())) {
    super(checks);
  }

  // Basic types

  // String

  @toStatic(IsString, strictOptions)
  static get string(): TypedProps {
    return new this();
  }

  @toInstance(IsString)
  get string(): TypedProps {
    return this;
  }

  // Number

  @toStatic(IsNumber, strictOptions)
  static get number(): TypedProps {
    return new this();
  }

  @toInstance(IsNumber)
  get number(): TypedProps {
    return this;
  }

  // Boolean

  @toStatic(IsBoolean, strictOptions)
  static get bool(): TypedProps {
    return new this();
  }

  @toInstance(IsBoolean)
  get bool(): TypedProps {
    return this;
  }

  // Symbol

  @toStatic(IsSymbol, strictOptions)
  static get symbol(): TypedProps {
    return new this();
  }

  @toInstance(IsSymbol)
  get symbol(): TypedProps {
    return this;
  }
  // Function

  @toStatic(IsFunc, strictOptions)
  static get func(): TypedProps {
    return new this();
  }

  @toInstance(IsFunc)
  get func(): TypedProps {
    return this;
  }

  // Object

  @toStatic(IsObject, strictOptions)
  static get object(): TypedProps {
    return new this();
  }

  @toInstance(IsObject)
  get object(): TypedProps {
    return this;
  }

  // Array

  @toStatic(IsArray, strictOptions)
  static get array(): TypedProps {
    return new this();
  }

  @toInstance(IsArray)
  get array(): TypedProps {
    return this;
  }

  // InstanceOf
  @toStatic(InstanceOf, strictOptions)
  static instanceOf(_constructor: object): TypedProps {
    return new this();
  }

  @toInstance(InstanceOf)
  instanceOf(_constructor: object): TypedProps {
    return this;
  }

  // OneOf

  @toStatic(OneOf, strictOptions)
  static oneOf(_types: object): TypedProps {
    return new this();
  }

  @toInstance(OneOf)
  oneOf(_types: object): TypedProps {
    return this;
  }

  // ArrayOf

  @toStatic(ArrayOf, strictOptions)
  static arrayOf(_types: object): TypedProps {
    return new this();
  }

  @toInstance(ArrayOf)
  arrayOf(_types: object): TypedProps {
    return this;
  }

  // ObjectOf

  @toStatic(ObjectOf, strictOptions)
  static objectOf(_types: object): TypedProps {
    return new this();
  }

  @toInstance(ObjectOf)
  objectOf(_types: object): TypedProps {
    return this;
  }

  // OneOfType

  @toStatic(OneOfType, strictOptions)
  static oneOfType(_types: object): TypedProps {
    return new this();
  }

  @toInstance(OneOfType)
  oneOfType(_types: object): TypedProps {
    return this;
  }

  // Shape

  @toStatic(Shape, strictOptions)
  static shape(_shape: ShapeType): TypedProps {
    return new this();
  }

  @toInstance(Shape)
  shape(_shape: ShapeType): TypedProps {
    return this;
  }

  @toStatic(Select, strictOptions)
  static select(..._select: any[]): TypedProps {
    return new this();
  }

  @toInstance(Select)
  select(..._select: any[]): TypedProps {
    return this;
  }
}

export {TypedProps as Type, StrictTypedProps as StrictType}

function isObject(value: any): value is {} {
  return value !== null && typeof value === 'object';
}

function isPlainObject(value: any): value is Object {
  return value.constructor.toString() === Object.toString();
}