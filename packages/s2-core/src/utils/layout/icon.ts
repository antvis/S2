import { merge } from 'lodash';
import { findFieldCondition, getIconPositionCfg } from '../condition/condition';
import type {
  Conditions,
  IconCfg,
  IconCondition,
  IconTheme,
} from '../../common';

export const normalizeIconCfg = (iconCfg?: IconCfg): IconCfg => {
  return merge(
    {
      size: 0,
      position: 'right',
      margin: {
        left: 0,
        right: 0,
      },
    },
    iconCfg,
  );
};

export const getDataCellIconStyle = (
  conditions: Conditions,
  IconTheme: IconTheme,
  valueField: string,
) => {
  const { size, margin } = IconTheme;
  const iconCondition: IconCondition = findFieldCondition(
    conditions?.icon,
    valueField,
  );

  const iconCfg: IconCfg = iconCondition &&
    iconCondition.mapping && {
      size,
      margin,
      position: getIconPositionCfg(iconCondition),
    };

  return normalizeIconCfg(iconCfg);
};
