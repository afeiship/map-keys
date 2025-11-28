# map-keys
> Recursively rename or copy object keys with full control.

[![version][version-image]][version-url]
[![license][license-image]][license-url]
[![size][size-image]][size-url]
[![download][download-image]][download-url]

## installation
```shell
yarn add @jswork/map-keys
```

## usage
```js
import mapKeys from '@jswork/map-keys';

// Basic key renaming
const data = { oldKey: 'value', keepKey: 'another' };
const result = mapKeys(data, { oldKey: 'newKey' });
// { newKey: 'value', keepKey: 'another' }

// Copy mode: keep both original and new keys
const result2 = mapKeys(data, { oldKey: 'newKey' }, { mode: 'copy' });
// { oldKey: 'value', keepKey: 'another', newKey: 'value' }

// Deep nested transformation
const nested = {
  users: [{ firstName: 'John', lastName: 'Doe' }]
};
const result3 = mapKeys(nested, {
  firstName: 'first_name',
  lastName: 'last_name'
});
// { users: [{ first_name: 'John', last_name: 'Doe' }] }
```

## license
Code released under [the MIT license](https://github.com/afeiship/map-keys/blob/master/LICENSE.txt).

[version-image]: https://img.shields.io/npm/v/@jswork/map-keys
[version-url]: https://npmjs.org/package/@jswork/map-keys

[license-image]: https://img.shields.io/npm/l/@jswork/map-keys
[license-url]: https://github.com/afeiship/map-keys/blob/master/LICENSE.txt

[size-image]: https://img.shields.io/bundlephobia/minzip/@jswork/map-keys
[size-url]: https://github.com/afeiship/map-keys/blob/master/dist/map-keys.min.js

[download-image]: https://img.shields.io/npm/dm/@jswork/map-keys
[download-url]: https://www.npmjs.com/package/@jswork/map-keys
