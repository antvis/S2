import { S2_PREFIX_CLS } from '../../common/constant/classnames';
import { i18n } from '../../common/i18n';
import type {
  TooltipOperatorMenu,
  TooltipPosition,
} from '../../common/interface';

export const TOOLTIP_PREFIX_CLS = `${S2_PREFIX_CLS}-tooltip`;
export const MOBILE_TOOLTIP_PREFIX_CLS = `${TOOLTIP_PREFIX_CLS}-mobile`;

export const TOOLTIP_CONTAINER_CLS = `${TOOLTIP_PREFIX_CLS}-container`;
export const TOOLTIP_CONTAINER_SHOW_CLS = `${TOOLTIP_CONTAINER_CLS}-show`;
export const TOOLTIP_CONTAINER_HIDE_CLS = `${TOOLTIP_CONTAINER_CLS}-hide`;

export const TOOLTIP_OPERATION_PREFIX_CLS = `${TOOLTIP_PREFIX_CLS}-operation`;

export const TOOLTIP_POSITION_OFFSET: TooltipPosition = {
  x: 15,
  y: 10,
};

export const getTooltipOperatorHiddenColumnsMenu = (): TooltipOperatorMenu => ({
  key: 'hiddenColumns',
  text: i18n('隐藏'),
  icon: 'EyeOutlined',
});

export const getTooltipOperatorTrendMenu = (): TooltipOperatorMenu => ({
  key: 'trend',
  text: i18n('趋势'),
  icon: 'Trend',
});

export const getTooltipOperatorSortMenus = (): TooltipOperatorMenu[] => [
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

export const getTooltipOperatorTableSortMenus = (): TooltipOperatorMenu[] => [
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
