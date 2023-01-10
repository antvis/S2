import type { ViewMetaData } from '../common/interface/basic';
import { EXTRA_FIELD, VALUE_FIELD } from '../common/constant/basic';
import type { RawData } from '../common/interface/s2DataConfig';

export class CellData {
  constructor(private raw: RawData, private extraField: string) {}

  static getCellDataList(raw: RawData, extraFields: string[]) {
    return extraFields.map((field) => new CellData(raw, field));
  }

  getOrigin() {
    return this.raw;
  }

  getValueByField(field: string) {
    if (field === VALUE_FIELD || field === EXTRA_FIELD) {
      return this[field];
    }

    return this.raw?.[field];
  }

  get [EXTRA_FIELD]() {
    return this.extraField;
  }

  get [VALUE_FIELD]() {
    return this.raw?.[this.extraField];
  }
}

export const getFieldValueOfViewMetaData = (data: ViewMetaData, field = '') => {
  if (data instanceof CellData) {
    return field ? data.getValueByField(field) : data.getOrigin();
  }

  return data?.[field];
};
