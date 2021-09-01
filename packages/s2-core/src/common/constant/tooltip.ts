import { OrderOption } from '@/common/interface';
import { S2_PREFIX_CLS } from '@/common/constant/classnames';

export const TOOLTIP_PREFIX_CLS = `${S2_PREFIX_CLS}-tooltip`;

export const TOOLTIP_OPERATION_PREFIX_CLS = `${TOOLTIP_PREFIX_CLS}-operation`;

export const DEFAULT_ICON_PROPS = {
  width: 14,
  height: 14,
  style: {
    verticalAlign: 'sub',
    marginRight: 4,
  },
};

export const POSITION_X_OFFSET = 10;
export const POSITION_Y_OFFSET = 10;

export const ORDER_OPTIONS: OrderOption[] = [
  { sortMethod: 'ASC', type: 'groupAsc', name: '组内升序' },
  { sortMethod: 'DESC', type: 'groupDesc', name: '组内降序' },
  { sortMethod: null, type: 'none', name: '不排序' },
];
