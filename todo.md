# TODOLIST

### Future

- [ ] Report stringification with intl.
- [ ] TypedProp serialization/deserialization.
- [ ] Modern export interface.
- [ ] Type names.

### v1.0

- [ ] Use classes for method and properties.
- [ ] Rewrite to typescript.
- [ ] Make rules inspectable. Rewrite `select` rule:
    ```javascript
    Type.select(
        [({type}) => type === 'user', UserShape],
        [({type}) => type === 'post', PostShape],
    )
    ```

### v0.9

- [x] Code refactored.
- [x] Decorators:
    - [x] Function arguments decorator.
    - [x] Function return value decorator.
- [x] Add `select` checker which can determine what rules to use:
    ```javascript
    // Select type by value's `type` property.
    Type.select(
        ({type}) => type === 'user' && userShape,
        ({type}) => type === 'file' && fileShape,
        () => linkShape, // otherwise
    );
    ```

### v0.8

- [x] Clone rules.

### v0.4

- [x] Custom checker.
- [x] Pure checker with no initial checkers.
    - [x] Create PureProps instance.
