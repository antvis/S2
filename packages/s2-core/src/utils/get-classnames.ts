import { S2_PREFIX_CLS } from '@/common/constant/classnames';

export const getClassNameWithPrefix = (...classNames: string[]) =>
  `${S2_PREFIX_CLS}-${classNames.join('-')}`;
