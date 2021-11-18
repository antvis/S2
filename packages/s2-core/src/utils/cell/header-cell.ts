import { Node } from 'src/facet/layout/node';
import { HeaderActionIcon } from 'src/common/interface/basic';
import { CellTypes } from 'src/common/constant';
import { isEmpty } from 'lodash';

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
