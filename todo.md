# TODOLIST

### Future

- [ ] Report stringification with intl.
- [ ] TypedProp serialization/deserialization.
- [ ] Modern export interface.
- [x] Type names.

### v1.4

 - [ ] Select should accept plain object as shapes.
 - [ ] Add context to prevent circular structures failures.
 - [ ] Inspect details.reason wider implementation:
    - reason is a rule branches.
    - reason is a code, not a message.
 - [ ] Add rule referrences to remove dependant rules on replace:
    ```javascript
    // Should throw or replace arrayOf
    Type.arrayOf().number
    ```

### v0.8

- [x] Clone rules.

### v0.4

- [x] Custom checker.
- [x] Pure checker with no initial checkers.
    - [x] Create PureProps instance.
