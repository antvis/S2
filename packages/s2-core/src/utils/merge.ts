import { isArray, mergeWith } from 'lodash';

export const customMerge = (...objects: any[]) => {
  const customizer = (origin, updated) => {
    if (isArray(origin) && isArray(updated)) {
      return updated;
    }
  };
  const args = [...objects, customizer] as [any, any];

  return mergeWith(...args);
};
