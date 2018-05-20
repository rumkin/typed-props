# Usage instruction

## NPM

Install latest `0.x` version:

```bash
npm i typed-props@0
```

Install latest version:
```bash
npm i typed-props
# or
npm i typed-props@latest
```

Then require it and start define types:
```javascript
const T = require('typed-props');

const type = T.number;
const issues = T.check(1, type);
```

## Web Usage

Include scripts with integrity control:

```html
<script
    src="https://unpkg.com/typed-props@0.10.1/dist/typed-props.js"
    integrity="sha384-D/+xE16PBr9hlzxEC0RPfUL7d+JFQsU7vQ29JzrixCMWuPEwCZ3M0EPO8NEBlb8D"
    crossorigin="anonymous"
></script>
<script
    src="https://unpkg.com/typed-props@0.10.1/dist/typed-props.min.js"
    integrity="sha384-zN1E3gIXzQZtOteUe1I6Mot0punN2Gs/i7pV4hUnVmz2YTXv3/I+JmXTi3O+DHtL"
    crossorigin="anonymous"
></script>
<script language="javascript">
    const type = TypedProps.number;
    const issues = TypedProps.check(1, type);
</script>
```
