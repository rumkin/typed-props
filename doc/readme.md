# Usage instruction

## NPM

Install latest `1.x` version:

```bash
npm i typed-props@1
```

Install latest version:
```bash
npm i typed-props
# or
npm i typed-props@latest
```

Then require it and start define types:
```javascript
const {Type, check} = require('typed-props');

const type = Type.number;
const issues = check(1, type);
```

## Web Usage

Include scripts with integrity control:

```html
<script
    src="https://unpkg.com/typed-props@0.10.1/dist/typed-props.js"
    integrity="sha384-t0/pKhzZxdtYm1Dka3n9LfKah4XtkJYM2QOP/w6wZBAuZeagqLXqbXzGpEB3i4k5"
    crossorigin="anonymous"
></script>
<script
    src="https://unpkg.com/typed-props@0.10.1/dist/typed-props.min.js"
    integrity="sha384-z4/Onp+kPEYwi+c/JCZIDr+JIvSivhZVC8u143tAfGcuo0APqQglTkx41aujA578"
    crossorigin="anonymous"
></script>
<script language="javascript">
    const {Type} = TypedProps; // or window.TypedProps

    const type = Type.number;
    const issues = TypedProps.check(1, type);
</script>
```
