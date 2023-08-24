import { cloneDeep } from 'lodash';
// JUZEMARK
export const JUZELOG = (a, e?: any) => {
  // eslint-disable-next-line no-console
  console.log('**************\n', e || '', cloneDeep(a));
};
