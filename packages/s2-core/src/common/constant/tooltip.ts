import { TooltipOperatorMenu } from '@/common/interface';
import { S2_PREFIX_CLS } from '@/common/constant/classnames';
import { i18n } from '@/common/i18n';

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

export const ORDER_OPTIONS: TooltipOperatorMenu[] = [
  {
    id: 'asc',
    icon: 'groupAsc',
    text: i18n('组内升序'),
  },
  {
    id: 'desc',
    icon: 'groupDesc',
    text: i18n('组内降序'),
  },
  { id: 'none', text: i18n('不排序') },
];
