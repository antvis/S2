// eslint-disable-next-line no-restricted-imports
import fp from 'lodash/fp';

export const pickMap = (values: string[]) => fp.map(fp.pick(values));
