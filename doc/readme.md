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
  integrity="sha384-HJ1xePGzEGMbK5T23s6BURtTDxAQO1aCz8hy5nfKZdp2pbCRkfS2R6PnJ/x2FjK0"
  crossorigin="anonymous"
></script>
<script
  src="https://unpkg.com/typed-props@1.0.0/dist/typed-props.min.js"
  integrity="sha384-FdEeyPF4FQcR+L8Fmt1AizWCb0wAdCUxpXoayeFsrTuCCvygKNTszGN8PLPzWGxu"
  crossorigin="anonymous"
></script>
<script language="javascript">
  const {Type, check} = TypedProps // or window.TypedProps

  const type = Type.number
  const data = 1

  const issues = check(data, type)
</script>
```

Actual versions checksums could be found in
[unpkg.com/typed-props@latest/dist/checksum.txt](https://unpkg.com/typed-props@latest/dist/checksum.txt).