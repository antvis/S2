import { TooltipOperatorMenu, TooltipPosition } from '@/common/interface';
import { S2_PREFIX_CLS } from '@/common/constant/classnames';
import { i18n } from '@/common/i18n';

export const TOOLTIP_PREFIX_CLS = `${S2_PREFIX_CLS}-tooltip`;

export const TOOLTIP_CONTAINER_CLS = `${TOOLTIP_PREFIX_CLS}-container`;

export const TOOLTIP_OPERATION_PREFIX_CLS = `${TOOLTIP_PREFIX_CLS}-operation`;

export const TOOLTIP_POSITION_OFFSET: TooltipPosition = {
  x: 15,
  y: 10,
};

export const TOOLTIP_OPERATOR_HIDDEN_COLUMNS_MENU: TooltipOperatorMenu = {
  key: 'hiddenColumns',
  text: i18n('隐藏'),
  icon: 'EyeOutlined',
};

export const TOOLTIP_OPERATOR_TREND_MENU: TooltipOperatorMenu = {
  key: 'trend',
  text: i18n('趋势'),
  icon: 'Trend',
};

export const TOOLTIP_OPERATOR_SORT_MENUS: TooltipOperatorMenu[] = [
  {
    key: 'asc',
    icon: 'groupAsc',
    text: i18n('组内升序'),
  },
  {
    key: 'desc',
    icon: 'groupDesc',
    text: i18n('组内降序'),
  },
  {
    key: 'none',
    text: i18n('不排序'),
  },
];

export const TOOLTIP_OPERATOR_TABLE_SORT_MENUS: TooltipOperatorMenu[] = [
  {
    key: 'asc',
    icon: 'groupAsc',
    text: i18n('升序'),
  },
  {
    key: 'desc',
    icon: 'groupDesc',
    text: i18n('降序'),
  },
  {
    key: 'none',
    text: i18n('不排序'),
  },
];
