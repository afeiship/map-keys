// AI: https://chat.qwen.ai/c/c27a99a0-727e-48de-81a2-9c2a18f9bc6a
// skipNullish 不是必需的，但它在响应式系统集成、性能微调或未来扩展时提供了一个安全出口。它体现了“显式优于隐式”的设计哲学，但日常使用中很少需要开启。

type KeyMap = Record<string, string>;

interface MapKeysOptions {
  /**
   * Whether to replace the original key or copy it.
   * - 'replace': only the new key is present (default)
   * - 'copy': both original and new keys are present
   */
  mode?: 'replace' | 'copy';

  /**
   * Whether to recursively process nested objects and arrays.
   * @default true
   */
  deep?: boolean;

  /**
   * List of keys that should never be transformed, even if present in `keyMap`.
   * @default []
   */
  ignoreKeys?: string[];

  /**
   * If true, skips processing when `data` is `null` or `undefined`.
   * @default false
   */
  skipNullish?: boolean;
}

/**
 * Recursively rename or copy object keys based on a mapping.
 *
 * @param data - Input data (object or array)
 * @param keyMap - Key mapping, e.g. { items: 'children' }
 * @param options - Transformation options
 * @returns Transformed data with updated keys
 */
function mapKeys<T = unknown>(data: T, keyMap: KeyMap, options?: MapKeysOptions): T {
  const { mode = 'replace', deep = true, ignoreKeys = [], skipNullish = false } = options ?? {};

  // Handle null/undefined if skipping
  if (skipNullish && (data === null || data === undefined)) {
    return data;
  }

  // Handle arrays
  if (Array.isArray(data)) {
    return (deep ? data.map((item) => mapKeys(item, keyMap, options)) : data) as T;
  }

  // Handle non-objects (primitives, null, functions, etc.)
  if (data === null || typeof data !== 'object') {
    return data;
  }

  // Handle Date, RegExp, etc. – preserve non-plain objects
  if (!isPlainObject(data)) {
    return data;
  }

  const result: Record<string, unknown> = {};

  for (const key in data) {
    if (!hasProperty(data, key)) continue;

    const originalValue = (data as Record<string, unknown>)[key];

    // Skip ignored keys
    if (ignoreKeys.includes(key)) {
      result[key] = deep ? mapKeys(originalValue, keyMap, options) : originalValue;
      continue;
    }

    const shouldMap = hasProperty(keyMap, key);
    const newKey = shouldMap ? keyMap[key] : key;

    const processedValue = deep ? mapKeys(originalValue, keyMap, options) : originalValue;

    if (mode === 'copy' && shouldMap) {
      // Keep both original and new key
      result[key] = processedValue;
      result[newKey] = processedValue;
    } else {
      // Only use the (possibly renamed) key
      result[newKey] = processedValue;
    }
  }

  return result as T;
}

/**
 * Helper to check if a value is a plain object (not Array, Date, RegExp, etc.)
 */
function isPlainObject(value: unknown): value is Record<string, unknown> {
  if (typeof value !== 'object' || value === null) return false;
  const proto = Object.getPrototypeOf(value);
  return proto === null || proto === Object.prototype;
}

/**
 * Check if an object has a specific property (more compatible than Object.hasOwn)
 */
function hasProperty(obj: object, prop: string): boolean {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

export default mapKeys;
