import { STRATEGY_SHEET_TOOLTIP_PRE_CLASS } from '../constant';

/** 获取 tooltip css class name */
export const getStrategySheetTooltipClsName = (name?: string) =>
  name
    ? `${STRATEGY_SHEET_TOOLTIP_PRE_CLASS}-${name}`
    : STRATEGY_SHEET_TOOLTIP_PRE_CLASS;
