import { includes } from 'lodash';
import type { WhetherLeafParams } from '../../facet/layout/interface';
import { EXTRA_FIELD } from '../../common';

export const whetherLeafByLevel = (params: WhetherLeafParams) => {
  const { facetCfg, level, fields } = params;
  const { colCfg, spreadsheet, dataSet } = facetCfg;
  const moreThanOneValue = dataSet.moreThanOneValue();
  const isValueInCols = spreadsheet.dataCfg.fields?.valueInCols ?? true;
  const isHideMeasure =
    colCfg?.hideMeasureColumn &&
    isValueInCols &&
    !moreThanOneValue &&
    includes(fields, EXTRA_FIELD);
  const extraSize = isHideMeasure ? 2 : 1;
  return level === fields.length - extraSize;
};
