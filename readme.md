![TypedProps](doc/cover.png)

---

[![npm](https://img.shields.io/npm/v/typed-props.svg?style=flat-square)](https://npmjs.com/package/typed-props)
[![Travis](https://img.shields.io/travis/rumkin/typed-props.svg?style=flat-square)](https://travis-ci.org/rumkin/typed-props)
![](https://img.shields.io/badge/coverage-100%25-green.svg?style=flat-square)
![](https://img.shields.io/badge/size-8.25%20KiB-blue.svg?style=flat-square)
![](https://img.shields.io/badge/deps-0-blue.svg?style=flat-square)
[![npm](https://img.shields.io/npm/dm/typed-props.svg?style=flat-square)](https://npmjs.com/packages/typed-props)

Facebook's PropTypes interface implementation for client and server, reusable
and extensible. It produce error reports as array of objects instead of throwing
or printing into console. And it works *without* React.

## Installation

Via npm:
```shell
npm i typed-props
```

Or via unpkg.com:

```html
<script src="https://unpkg.com/typed-props@0/dist/typed-props.js"></script>
<script src="https://unpkg.com/typed-props@0/dist/typed-props.min.js"></script>
```

## Usage

Custom types check:

```javascript

import Type, {check} from 'typed-props';

check(1, Type.number);
check({count: 1}, Type.shape({count: Type.number}));
```

__Experimental Features__. Decorators to check function arguments and return value:
```javascript
import Type, {args, result} from 'typed-props';

class Arith {
    // Fixed arguments length example
    @args(Type.number, Type.number)
    @result(Type.number)
    add(a, b) {
        return a + b;
    }

    // Variadic argument's length example
    @args(Type.number, [Type.number])
    @result(Type.number)
    addAll(a = 0, ...numbers) {
        return numbers.reduce((sum, b) => sum + b, a);
    }
}
```

> _NOTE_! If invalid arguments passed Error with type TypeError and property `issues`
  will be thrown.

## Standard checkers

Standard checkers are those which are provided
by Facebook's PropTypes:

```javascript
import Type from 'typed-props';

// Object which properties should pass all checks.
const shape = Type.shape({
    // Object type rules

    // Any value except of undefined
    anything: Type.isRequired,
    // Number property
    number: Type.number,
    // String property
    string: Type.string,
    // Boolean property
    bool: Type.bool,
    // Object property
    object: Type.object,
    // Array property
    array: Type.array,
    // Array property
    func: Type.func,
    // Symbol property
    symbol: Type.symbol,
    // Property which value is instance of Date
    instanceOf: Type.instanceOf(Date),

    // Complex rules

    // One of check if value is in list of passed primitives
    // It works like an enum
    oneOf: ['one', 'two'],
    // Check if all array values match the passed TypedProps
    arrayOf: Type.number,
    // Check if value is matched any of passed TypedProps.
    oneOfType: Type.oneOfType([
        Type.number,
        Type.string,
    ]),
    // Check if all object properties passes the TypedProps.
    objectOf: Type.objectOf(Type.number),
});

const issues = Type.check({}, shape); // => [{path:['anything'], rule: 'isRequired', details: {is: false}}]
```

Result of `check` call is array of [issues](#issue-type). If there is no issues, this array will be
empty.

## Non-standard checkers

TypedProps have it's own custom checkers which help in difficult cases like
value-dependent type check:

#### TypedProps.select()
```
(...Function|TypedProps) -> TypedProps
```

This checker allow to switch between types depending on input value. It selects
the first arguments that is not a function or if it's function and it returns
something truly. Then use it as type to check. It useful when

```javascript
Type.select(
    ({type}) => type === 'addUser' && {payload: userShape},
    otherShape
);
```

## Custom checkers

TypedProps could be inherited or extended with new rules.

```javascript
// Extend Type with custom checker.
Type.addProperty('infinity', (value) => {
    if (value === undefined) { // Skip empty values
        return;
    }

    return value === Infinity;
});

// Inherit Type in new class
class MyType extends Type {}

MyType.addMethod('equals', (value, needle) => {
    if (value === undefined) {
        return;
    }

    return value === needle;
});

// Any Type' ancestor should be validated by Type
Type.check(5, MyType.equals(5)); // -> []
MyType.check(5, MyType.equals(5)); // -> []

// MyType uses Type's checker `infinity`
Type.check(Infinity, MyType.infinity); // -> []
```

## API

### static TypedProps.check()
```text
(value:*, type:TypedProps) -> Array.<Issue>
```

Validate `value` to satisfy `type` requirements. Always produce an Array.

### static TypedProps.addMethod()
```text
(name:String, [transform:TransformFunc,] checker:CheckerFunc) -> void
```

* `name` - New TypedProps property name.
* `transform` - Function that transform params before they got into checker. It works once when type is configuring.
* `checker` - Checker function.

Add new checker which receive params. This method can receive `transform` function
which will convert checker call arguments into internal representation.

##### Example
```javascript
// Define checker
Type.addMethod('isFinite', (value, expect) => {
    return isFinite(value) === expect;
});
// ... or with transform param
Type.addMethod('isFinite', (expect = true) => ({expect}), (value, {expect}) => {
    return isFinite(value) === expect;
});

// Use it
const type = TypedProps.isRequired.number.isFinite(true);
```

### static TypedProps.addProperty()
```text
(name:String, checker:CheckerFunc) -> void
```
* `name` - New TypedProps property name.
* `checker` - Checker function.

Define checker which has no parameters.

##### Example
```javascript
// Define checker
Type.addProperty('isFinite', (value) => {
    return isFinite(value) === true;
});

// Use it
const type = Type.isRequired.number.isFinite;
```

### static TypedProps.getCheck()

```text
(type:TypedProps, name:string) -> null|*[]
```

* `type` - Target type.
* `name` - Checker name.
* `=` Returns array of checker arguments or null if checker is not found.


### CheckerFunc Type
```text
(value:*, ...params:*) -> Boolean|Issue|Array.<Issue>|void
```

Checker function is calling from TypedProps to verify value. This function should
return boolean value, Issue or array of Issue objects.

> Usually checker function should not check undefined value.

### TransformFunc Type
```text
(params:...*) -> Object
```

Transform function receive arguments passed to checker method call and convert it into object.

### Issue Type
```text
{
    path: Array.<String|Number>
    rule: String,
    details: Object,
}
```

Object representing validation failure.

### License

Copyright &copy; 2018, Rumkin. Released under [MIT License](LICENSE).
