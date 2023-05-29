import { find, groupBy, isEmpty, isEqual, merge } from 'lodash';
import type {
  FullyIconName,
  IconPosition,
  IconTheme,
  InternalFullyHeaderActionIcon,
} from '../../common/interface';
import { CellTypes, EXTRA_FIELD } from '../../common/constant';
import type {
  ActionIconName,
  FormatResult,
  HeaderActionIcon,
} from '../../common/interface/basic';
import type { Node } from '../../facet/layout/node';

const normalizeIcons = (
  icons: ActionIconName[],
  position: IconPosition = 'right',
) =>
  icons.map((icon) => {
    if (typeof icon === 'string') {
      return { name: icon, position };
    }

    return icon;
  });

const normalizeActionIconCfg = (actionIconList: HeaderActionIcon[] = []) =>
  actionIconList.map(
    (actionIcon) =>
      ({
        ...actionIcon,
        icons: normalizeIcons(actionIcon.icons),
      } as InternalFullyHeaderActionIcon),
  );

const shouldShowActionIcons = (
  actionIconCfg: InternalFullyHeaderActionIcon,
  meta: Node,
  cellType: CellTypes,
) => {
  if (!actionIconCfg) {
    return false;
  }

  const { icons, displayCondition, belongsCell } = actionIconCfg;

  if (isEmpty(icons)) {
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
  return icons.some((icon) => displayCondition(meta, icon.name));
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
): InternalFullyHeaderActionIcon | undefined => {
  const normalizedList = normalizeActionIconCfg(actionIconCfgList);

  const iconConfig = find(normalizedList, (cfg) =>
    shouldShowActionIcons(cfg, meta, cellType),
  );

  if (!iconConfig) {
    return;
  }

  // 使用配置的 displayCondition 进一步筛选需要展示的 icon
  let nextIcons = iconConfig.icons;

  if (iconConfig.displayCondition) {
    nextIcons = nextIcons.filter((iconName) =>
      iconConfig.displayCondition?.(meta, iconName.name),
    );
  }

  return {
    ...iconConfig,
    icons: nextIcons,
  };
};

export const getIconTotalWidth = (
  icons: FullyIconName[] = [],
  iconTheme: IconTheme,
): number => {
  if (isEmpty(icons)) {
    return 0;
  }

  const { margin, size } = iconTheme;

  return icons.reduce(
    (acc, { position }) =>
      acc + size! + (position === 'left' ? margin!.right! : margin!.left!),
    0,
  );
};

export type GroupedIcons = {
  [key in IconPosition]: FullyIconName[];
};

export const groupIconsByPosition = (
  icons: FullyIconName[] = [],
  conditionIcon?: FullyIconName,
) => {
  const groupedIcons = merge(
    {
      left: [],
      right: [],
    },
    groupBy(icons, 'position'),
  ) as GroupedIcons;

  // 基于 condition icon 和 value 是强关联的，所以最好将 condition icon 放在 value 的左右侧
  if (conditionIcon) {
    if (conditionIcon.position === 'left') {
      groupedIcons.left.push(conditionIcon);
    } else {
      groupedIcons.right.unshift(conditionIcon);
    }
  }

  return groupedIcons;
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
