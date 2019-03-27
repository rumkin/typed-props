# Changelog

### v1.0

- Use classes for method and properties.
- Rewrite to typescript.
- Make rules inspectable. Rewrite `select` rule:
    ```javascript
    Type.select(
        [({type}) => type === 'user', UserShape],
        [({type}) => type === 'post', PostShape],
    )
    ```
- Make type rules switch each other.

### v0.9

- Code refactored.
- Decorators:
    - Function arguments decorator.
    - Function return value decorator.
- Add `select` checker which can determine what rules to use:
    ```javascript
    // Select type by value's `type` property.
    Type.select(
        ({type}) => type === 'user' && userShape,
        ({type}) => type === 'file' && fileShape,
        () => linkShape, // otherwise
    );
    ```

### v0.8.0

- Allow properties replace previous value:
    ```javascript
    Typed.instanceOf(Date).instanceOf(Object)
    ```
    now works correct.

### v0.5.0

- replace `addChecker()` with `addProperty()` and `addMethod()`.


### v0.4.0

- make TypedProps instance immutable.
