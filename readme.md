# TypedProps

![Build](https://img.shields.io/travis/rumkin/typed-props.svg)

TypedProps is implementation of Facebook's PropTypes interface but extensible,
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
import TypedProps from 'typed-props';

// Object which properties should pass all checks.
const shape = TypedProps.shape({
    // Object type rules

    // Any value except of undefined
    anything: TypedProps.isRequired,
    // Number property
    number: TypedProps.number,
    // String property
    string: TypedProps.string,
    // Boolean property
    bool: TypedProps.bool,
    // Object property
    object: TypedProps.object,
    // Array property
    array: TypedProps.array,
    // Array property
    func: TypedProps.func,
    // Symbol property
    symbol: TypedProps.symbol,
    // Property which value is instance of Date
    instanceOf: TypedProps.instanceOf(Date),

    // Complex rules

    // One of check if value is in list of passed primitives
    // It works like an enum
    oneOf: ['one', 'two'],
    // Check if all array values match the passed TypedProps
    arrayOf: TypedProps.number,
    // Check if value is matched any of passed TypedProps.
    oneOfType: TypedProps.oneOfType([
        TypedProps.number,
        TypedProps.string,
    ]),
    // Check if all object properties passes the TypedProps.
    objectOf: TypedProps.objectOf(TypedProps.number),
});

const report = TypedProps.check({}, shape); // => [{path:['anything'], rule: 'isRequired', details: {is: false}}]
```

### Own checkers

TypedProps could be extended or inherited.

```javascript
// Extend TypedProps with custom checker.
TypedProps.addChecker('infinity', function(value) {
    if (value === undefined) { // Skip empty values
        return;
    }

    return value === Infinity;
});

// Inherit TypedProps in new class
class MyTypedProps extends TypedProps {}

MyTypedProps.addChecker('equals', function(value, needle) {
    if (value === undefined) {
        return;
    }

    return value === needle;
});

MyTypedProps.check(5, MyTypedProps.equals(5)); // -> []
// or
TypedProps.check(5, MyTypedProps.equals(5)); // -> []
```

# License

MIT.
