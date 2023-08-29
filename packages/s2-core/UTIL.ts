import { cloneDeep } from 'lodash';
export const JUZELOG = (a, e?: any) => {
  // eslint-disable-next-line no-console
  console.log('**************\n', e || '', cloneDeep(a));
};
