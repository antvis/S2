import { without, get } from 'lodash';
import { EXTRA_FIELD } from '@/common/constant';
import { SpreadsheetFacetCfg } from '@/common/interface';

export default function checkHideMeasureColumn(
  cfg: SpreadsheetFacetCfg,
  fields: string[],
): [number] {
  const hideMeasureColumn = get(cfg, 'colCfg.hideMeasureColumn', false);
  let totalLevels;
  if (hideMeasureColumn) {
    // 把指标列去掉
    totalLevels = without(fields, EXTRA_FIELD).length;
  } else {
    totalLevels = fields.length;
  }

  return [totalLevels];
}
