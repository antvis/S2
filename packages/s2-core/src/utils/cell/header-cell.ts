import { Node } from 'src/facet/layout/node';
import { FormatResult, HeaderActionIcon } from 'src/common/interface/basic';
import { CellTypes, EXTRA_FIELD } from 'src/common/constant';
import { isEmpty, isEqual } from 'lodash';

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
  return displayCondition(meta);
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
