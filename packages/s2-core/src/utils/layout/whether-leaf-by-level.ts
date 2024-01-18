import { includes } from 'lodash';
import type { WhetherLeafParams } from '../../facet/layout/interface';
import { EXTRA_FIELD } from '../../common';

export const whetherLeafByLevel = (params: WhetherLeafParams) => {
  const { spreadsheet, level, fields } = params;
  const { options, dataSet } = spreadsheet;
  const moreThanOneValue = dataSet.moreThanOneValue();
  const isValueInCols = spreadsheet.dataCfg.fields?.valueInCols ?? true;
  const isHideMeasure =
    options?.style?.colCell?.hideValue &&
    isValueInCols &&
    !moreThanOneValue &&
    includes(fields, EXTRA_FIELD);
  const extraSize = isHideMeasure ? 2 : 1;

  return level === fields.length - extraSize;
};
