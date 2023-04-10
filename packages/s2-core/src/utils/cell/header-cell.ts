import { find, isEmpty, isEqual } from 'lodash';
import type { IconPosition, IconTheme } from '../../common/interface';
import { CellTypes, EXTRA_FIELD } from '../../common/constant';
import type {
  ActionIconName,
  FormatResult,
  HeaderActionIcon,
} from '../../common/interface/basic';
import type { Node } from '../../facet/layout/node';

const normalizeIconNames = (
  iconNames: ActionIconName[],
  position: IconPosition = 'right',
) =>
  iconNames.map((iconName) => {
    if (typeof iconName === 'string') {
      return { name: iconName, position };
    }

    return iconName;
  });

const normalizeActionIconCfg = (actionIconList: HeaderActionIcon[] = []) =>
  actionIconList.map((actionIcon) => {
    return {
      ...actionIcon,
      iconNames: normalizeIconNames(actionIcon.iconNames),
    };
  });

export type HeaderActionIconWithFullyActionIconName = ReturnType<
  typeof normalizeActionIconCfg
>[number];

const shouldShowActionIcons = (
  actionIconCfg: HeaderActionIconWithFullyActionIconName,
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
  return iconNames.some((iconName) => displayCondition(meta, iconName.name));
};

/**
 * 返回可用的 icon 配置
 * @param actionIconCfgList icon 配置列表
 * @param meta 单元格 meta
 * @param cellType 单元格类型
 * @returns icon 配置
 */
export const getActionIconConfig = (
  actionIconCfgList: HeaderActionIcon[] = [],
  meta: Node,
  cellType: CellTypes,
): HeaderActionIconWithFullyActionIconName | undefined => {
  const normalizedList = normalizeActionIconCfg(actionIconCfgList);

  const iconConfig = find(normalizedList, (cfg) =>
    shouldShowActionIcons(cfg, meta, cellType),
  );

  if (!iconConfig) {
    return;
  }

  // 使用配置的 displayCondition 进一步筛选需要展示的 icon
  let nextIconNames = iconConfig.iconNames;

  if (iconConfig.displayCondition) {
    nextIconNames = nextIconNames.filter((iconName) =>
      iconConfig.displayCondition?.(meta, iconName.name),
    );
  }

  return {
    ...iconConfig,
    iconNames: nextIconNames,
  };
};

export const getActionIconTotalWidth = (
  iconCfg: HeaderActionIconWithFullyActionIconName | undefined,
  iconTheme: IconTheme,
): number => {
  if (!iconCfg) {
    return 0;
  }

  const { iconNames = [] } = iconCfg;
  const { margin, size } = iconTheme;

  return iconNames.reduce(
    (acc, { position }) =>
      acc + size! + (position === 'left' ? margin!.right! : margin!.left!),
    0,
  );
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
  const { value, field } = meta;

  if (!isEqual(field, EXTRA_FIELD)) {
    return {
      formattedValue: value,
      value,
    };
  }

  return {
    formattedValue: fieldName || value,
    value,
  };
};
