import { isArray, mergeWith } from 'lodash';

export const customMerge = (...objects: any[]) => {
  const customize = (origin, updated) => {
    if (isArray(origin) && isArray(updated)) {
      return updated;
    }
  };
  const args = [...objects, customize] as [any, any];

  return mergeWith(...args);
};
