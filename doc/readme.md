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
  src="https://unpkg.com/typed-props@1.0.0/dist/typed-props.js"
  integrity="sha384-hbm/q7XnX7qFfJd65ngEixycDU6giD3iKHxd+QZhQ7Rplhyb2EeIY2eeM9QdKapw"
  crossorigin="anonymous"
></script>
<script
  src="https://unpkg.com/typed-props@1.0.0/dist/typed-props.min.js"
  integrity="sha384-011ydjnXoDmOVVG6kOxwy9V/684/SZZYa7QBcd2giaoMu74ijN3XaNacyEbDH8dZ"
  crossorigin="anonymous"
></script>
<script language="javascript">
  const {Type} = TypedProps; // or window.TypedProps

  const type = Type.number;
  const issues = TypedProps.check(1, type);
</script>
```

Actual versions checksums could be found in
[unpkg.com/typed-props@latest/dist/checksum.txt](https://unpkg.com/typed-props@latest/dist/checksum.txt).