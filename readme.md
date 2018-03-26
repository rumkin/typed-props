# TypedProps

![Build](https://img.shields.io/travis/rumkin/typed-props.svg)

TypedProps is an implementation of Facebook's PropTypes interface but extensible,
reusable and customizable. It produce error reports as array of objects
instead of throwing or printing into console. And it works *without* React.

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

## Example

Define effects:
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

const report = Type.check({}, shape); // => [{path:['anything'], rule: 'isRequired', details: {is: false}}]
```

Result of `check` call is array of issues. If there is no issue array will be
empty. Each issue is has interface of [validation-report](https://npmjs.com/package/validation-report).

### Custom checkers

TypedProps could be inherited or extended with new rules.

```javascript
// Extend TypedProps with custom checker.
TypedProps.addProperty('infinity', function(value) {
    if (value === undefined) { // Skip empty values
        return;
    }

    return value === Infinity;
});

// Inherit TypedProps in new class
class MyTypedProps extends TypedProps {}

MyTypedProps.addMethod('equals', function(value, needle) {
    if (value === undefined) {
        return;
    }

    return value === needle;
});

// Any TypedProps' ancestor should be validated by TypedProps
TypedProps.check(5, MyTypedProps.equals(5)); // -> []
MyTypedProps.check(5, MyTypedProps.equals(5)); // -> []

// MyTypedProps uses TypedProps' checker`infinity`
TypedProps.check(Infinity, MyTypedProps.infinity); // -> []
```

## API

### TypedProps.getCheck

```
(type:TypedProps, name:string) -> null|*[]
```

* `type`. Target type.
* `name`. Checker name.
* `=`. Returns array of checker arguments or null if checker is not found.

### License

MIT.
