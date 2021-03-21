import { isArray, isEqual, get } from 'lodash';
export const detectAttrsChangeAndAction = (
  pre: Record<string, unknown>,
  current: Record<string, unknown>,
  keyPath: string | string[],
  callback: (currentValue) => void,
) => {
  if (!isArray(keyPath)) {
    if (!isEqual(get(pre, keyPath), get(current, keyPath))) {
      callback(keyPath);
    }
  } else {
    for (let i = 0; i < keyPath.length; i++) {
      const path = keyPath[i];
      if (!isEqual(get(pre, path), get(current, path))) {
        callback(path);
        break;
      }
    }
  }
};
