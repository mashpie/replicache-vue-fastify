# Example

read json file similar to how we do in cjs

```js
import { json } from '@ccp/common-esm'
const { name, version } = json(import.meta.url, '../../package.json')

```
---
