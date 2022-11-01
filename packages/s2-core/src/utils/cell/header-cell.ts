import { find, isEmpty, isEqual } from 'lodash';
import { CellTypes, EXTRA_FIELD } from '../../common/constant';
import type {
  FormatResult,
  HeaderActionIcon,
} from '../../common/interface/basic';
import type { Node } from '../../facet/layout/node';

export const shouldShowActionIcons = (
  actionIconCfg: HeaderActionIcon,
  meta: Node,
  cellType: CellTypes,
) => {
  if (!actionIconCfg) {
    return false;
  }
  const { iconNames, displayCondition, belongsCell } = actionIconCfg;

  if (isEmpty(iconNames)) {
    return false;
  }
  if (belongsCell !== cellType) {
    return false;
  }
  if (!displayCondition) {
    // 没有展示条件参数默认全展示
    return true;
  }

  // 有任意 iconName 命中展示，则使用当前 headerActionIcon config
  return iconNames.some((iconName) => displayCondition(meta, iconName));
};

/**
 * 返回可用的 icon 配置
 * @param actionIconCfgList icon 配置列表
 * @param meta 单元格 meta
 * @param cellType 单元格类型
 * @returns icon 配置
 */
export const getActionIconConfig = (
  actionIconCfgList: HeaderActionIcon[],
  meta: Node,
  cellType: CellTypes,
): HeaderActionIcon | undefined => {
  const iconConfig = find(actionIconCfgList, (cfg) =>
    shouldShowActionIcons(cfg, meta, cellType),
  );

  if (!iconConfig) {
    return;
  }

  // 使用配置的 displayCondition 进一步筛选需要展示的 icon
  let nextIconNames = iconConfig.iconNames;
  if (iconConfig.displayCondition) {
    nextIconNames = nextIconNames.filter((iconName) =>
      iconConfig.displayCondition?.(meta, iconName),
    );
  }

  return {
    ...iconConfig,
    iconNames: nextIconNames,
  };
};

/**
 * 格式化行列头维度名称
 * @param meta
 * @param fieldName
 */
export const formattedFieldValue = (
  meta: Node,
  fieldName: string,
): FormatResult => {
  const { label, field } = meta;

  if (!isEqual(field, EXTRA_FIELD)) {
    return {
      formattedValue: label,
      value: label,
    };
  }

  return {
    formattedValue: fieldName || label,
    value: label,
  };
};
