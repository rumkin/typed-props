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
  src="https://unpkg.com/typed-props@1.1.0/dist/typed-props.js"
  integrity="sha384-+d1JMFQ37qVx0tUTim1AXXpJzjmqxQ42sPyLjP62/gwNA4r7gpn0sgyXioBpc6oB "
  crossorigin="anonymous"
></script>
<script
  src="https://unpkg.com/typed-props@1.1.0/dist/typed-props.min.js"
  integrity="sha384-kpCTRL1d5lWgQ+FLUjPhs7B2OL70TA8dyp0MAPQXoGvEj/ADXZqk0l0Y+V/vIUhe"
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