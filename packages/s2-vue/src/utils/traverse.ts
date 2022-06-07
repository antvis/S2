import { isArray, isMap, isObject, isPlainObject, isSet } from 'lodash';
import { isProxy, isRef } from 'vue';

// 属性遍历工具函数
export const traverse = <T>(value: T, seen?: Set<T>) => {
  // eslint-disable-next-line dot-notation
  if (!isObject(value) || (value as any)['__v_skip']) {
    return value;
  }

  if (!isProxy(value) && !isRef(value)) {
    return value;
  }

  seen = seen || new Set();
  if (seen.has(value)) {
    return value;
  }
  seen.add(value);
  if (isRef(value)) {
    traverse(value.value, seen);
  } else if (isArray(value)) {
    for (let i = 0; i < value.length; i++) {
      traverse(value[i], seen);
    }
  } else if (isSet(value) || isMap(value)) {
    value.forEach((v: any) => {
      traverse(v, seen);
    });
  } else if (isPlainObject(value)) {
    for (const key in value as any) {
      traverse((value as any)[key], seen);
    }
  }
  return value;
};
