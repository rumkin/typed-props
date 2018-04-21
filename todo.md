# TODOLIST

### Future

- [ ] Report stringification with intl.
- [ ] TypedProp serialization/deserialization.
- [ ] Modern export interface.
- [ ] Type names.

### v0.9

- [x] Code refactored.
- [x] Decorators:
    - [x] Function arguments decorator.
    - [ ] Function return value decorator.
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
