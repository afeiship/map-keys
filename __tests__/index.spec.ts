import mapKeys from '../src';

describe('mapKeys', () => {
  describe('Basic functionality', () => {
    test('should rename keys in simple objects', () => {
      const data = { oldKey: 'value', anotherKey: 'another' };
      const keyMap = { oldKey: 'newKey' };
      const result = mapKeys(data, keyMap);

      expect(result).toEqual({ newKey: 'value', anotherKey: 'another' });
    });

    test('should handle multiple key mappings', () => {
      const data = { a: 1, b: 2, c: 3 };
      const keyMap = { a: 'alpha', b: 'beta' };
      const result = mapKeys(data, keyMap);

      expect(result).toEqual({ alpha: 1, beta: 2, c: 3 });
    });

    test('should return original object when no keys match', () => {
      const data = { a: 1, b: 2 };
      const keyMap = { x: 'y' };
      const result = mapKeys(data, keyMap);

      expect(result).toEqual({ a: 1, b: 2 });
    });

    test('should handle empty keyMap', () => {
      const data = { a: 1, b: 2 };
      const keyMap = {};
      const result = mapKeys(data, keyMap);

      expect(result).toEqual({ a: 1, b: 2 });
    });
  });

  describe('Mode options', () => {
    test('should work in replace mode (default)', () => {
      const data = { oldKey: 'value' };
      const keyMap = { oldKey: 'newKey' };
      const result = mapKeys(data, keyMap, { mode: 'replace' });

      expect(result).toEqual({ newKey: 'value' });
      expect('oldKey' in result).toBe(false);
    });

    test('should work in copy mode', () => {
      const data = { oldKey: 'value' };
      const keyMap = { oldKey: 'newKey' };
      const result = mapKeys(data, keyMap, { mode: 'copy' });

      expect(result).toEqual({ oldKey: 'value', newKey: 'value' });
    });

    test('should handle copy mode with multiple mappings', () => {
      const data = { a: 1, b: 2, c: 3 };
      const keyMap = { a: 'alpha', b: 'beta' };
      const result = mapKeys(data, keyMap, { mode: 'copy' });

      expect(result).toEqual({ a: 1, alpha: 1, b: 2, beta: 2, c: 3 });
    });
  });

  describe('Deep recursion', () => {
    test('should recursively process nested objects by default', () => {
      const data = {
        level1: {
          oldKey: {
            level2: {
              oldKey: 'deep value'
            }
          }
        }
      };
      const keyMap = { oldKey: 'newKey' };
      const result = mapKeys(data, keyMap);

      expect(result).toEqual({
        level1: {
          newKey: {
            level2: {
              newKey: 'deep value'
            }
          }
        }
      });
    });

    test('should not process nested objects when deep=false', () => {
      const data = {
        outer: {
          oldKey: 'inner value'
        }
      };
      const keyMap = { oldKey: 'newKey' };
      const result = mapKeys(data, keyMap, { deep: false });

      expect(result).toEqual({
        outer: {
          oldKey: 'inner value'
        }
      });
    });

    test('should process arrays when deep=true', () => {
      const data = [
        { oldKey: 'item1' },
        { oldKey: 'item2' }
      ];
      const keyMap = { oldKey: 'newKey' };
      const result = mapKeys(data, keyMap, { deep: true });

      expect(result).toEqual([
        { newKey: 'item1' },
        { newKey: 'item2' }
      ]);
    });

    test('should not process arrays when deep=false', () => {
      const data = [
        { oldKey: 'item1' },
        { oldKey: 'item2' }
      ];
      const keyMap = { oldKey: 'newKey' };
      const result = mapKeys(data, keyMap, { deep: false });

      expect(result).toEqual([
        { oldKey: 'item1' },
        { oldKey: 'item2' }
      ]);
    });
  });

  describe('Ignore keys', () => {
    test('should skip processing for ignored keys', () => {
      const data = {
        keepKey: 'keep me',
        renameKey: 'rename me'
      };
      const keyMap = { keepKey: 'newKey', renameKey: 'renamed' };
      const result = mapKeys(data, keyMap, { ignoreKeys: ['keepKey'] });

      expect(result).toEqual({
        keepKey: 'keep me',
        renamed: 'rename me'
      });
    });

    test('should recursively respect ignored keys', () => {
      const data = {
        level1: {
          ignoreMe: {
            oldKey: 'should change'
          },
          processMe: {
            oldKey: 'should change'
          }
        }
      };
      const keyMap = { oldKey: 'newKey' };
      const result = mapKeys(data, keyMap, {
        ignoreKeys: ['ignoreMe'],
        deep: true
      });

      expect(result).toEqual({
        level1: {
          ignoreMe: {
            newKey: 'should change'
          },
          processMe: {
            newKey: 'should change'
          }
        }
      });
    });
  });

  describe('Skip nullish', () => {
    test('should return null unchanged when skipNullish=true', () => {
      const result = mapKeys(null, { a: 'b' }, { skipNullish: true });
      expect(result).toBeNull();
    });

    test('should return undefined unchanged when skipNullish=true', () => {
      const result = mapKeys(undefined, { a: 'b' }, { skipNullish: true });
      expect(result).toBeUndefined();
    });

    test('should process null when skipNullish=false (default)', () => {
      const result = mapKeys(null, { a: 'b' }, { skipNullish: false });
      expect(result).toBeNull();
    });

    test('should process undefined when skipNullish=false (default)', () => {
      const result = mapKeys(undefined, { a: 'b' }, { skipNullish: false });
      expect(result).toBeUndefined();
    });
  });

  describe('Edge cases', () => {
    test('should handle empty objects', () => {
      const result = mapKeys({}, { a: 'b' });
      expect(result).toEqual({});
    });

    test('should handle primitive values', () => {
      expect(mapKeys('string', { a: 'b' })).toBe('string');
      expect(mapKeys(123, { a: 'b' })).toBe(123);
      expect(mapKeys(true, { a: 'b' })).toBe(true);
    });

    test('should handle arrays at root level', () => {
      const data = [{ oldKey: 'value1' }, { oldKey: 'value2' }];
      const result = mapKeys(data, { oldKey: 'newKey' });

      expect(result).toEqual([{ newKey: 'value1' }, { newKey: 'value2' }]);
    });

    test('should handle Date objects', () => {
      const date = new Date();
      const data = { date, oldKey: 'value' };
      const result = mapKeys(data, { oldKey: 'newKey' });

      expect(result.date).toBe(date);
      expect(result).toEqual({ date, newKey: 'value' });
    });

    test('should handle RegExp objects', () => {
      const regex = /test/g;
      const data = { regex, oldKey: 'value' };
      const result = mapKeys(data, { oldKey: 'newKey' });

      expect(result.regex).toBe(regex);
      expect(result).toEqual({ regex, newKey: 'value' });
    });

    test('should handle functions', () => {
      const fn = () => 'test';
      const data = { fn, oldKey: 'value' };
      const result = mapKeys(data, { oldKey: 'newKey' });

      expect(result.fn).toBe(fn);
      expect(result).toEqual({ fn, newKey: 'value' });
    });

    test('should handle objects with null prototype', () => {
      const data = Object.create(null);
      data.oldKey = 'value';
      const result = mapKeys(data, { oldKey: 'newKey' });

      expect(result).toEqual({ newKey: 'value' });
    });
  });

  describe('Complex scenarios', () => {
    test('should handle deeply nested structures with arrays', () => {
      const data = {
        users: [
          {
            id: 1,
            profile: {
              firstName: 'John',
              lastName: 'Doe'
            }
          }
        ]
      };
      const keyMap = { firstName: 'first_name', lastName: 'last_name' };
      const result = mapKeys(data, keyMap);

      expect(result).toEqual({
        users: [
          {
            id: 1,
            profile: {
              first_name: 'John',
              last_name: 'Doe'
            }
          }
        ]
      });
    });

    test('should handle mixed scenarios with all options', () => {
      const data = {
        keepThis: 'preserved',
        renameMe: 'changed',
        nested: {
          keepNested: 'preserved',
          renameNested: 'changed',
          array: [
            { oldKey: 'should change' },
            { oldKey: 'should also change' }
          ]
        }
      };
      const keyMap = { renameMe: 'renamed', renameNested: 'renamed_nested', oldKey: 'new_key' };
      const result = mapKeys(data, keyMap, {
        mode: 'copy',
        ignoreKeys: ['keepThis', 'keepNested'],
        deep: true
      });

      expect(result).toEqual({
        keepThis: 'preserved',
        renameMe: 'changed',
        renamed: 'changed',
        nested: {
          keepNested: 'preserved',
          renameNested: 'changed',
          renamed_nested: 'changed',
          array: [
            { oldKey: 'should change', new_key: 'should change' },
            { oldKey: 'should also change', new_key: 'should also change' }
          ]
        }
      });
    });
  });
});
