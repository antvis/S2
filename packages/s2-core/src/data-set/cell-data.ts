/* eslint-disable no-empty-function */
import { EXTRA_FIELD, ORIGIN_FIELD, VALUE_FIELD } from '../common/constant';
import type { ViewMetaData } from '../common/interface/basic';
import type { RawData } from '../common/interface/s2DataConfig';

export class CellData {
  constructor(
    public readonly raw: RawData,
    public readonly extraField: string,
  ) {}

  static getCellData(raw: RawData, extraField: string) {
    return new CellData(raw, extraField);
  }

  static getCellDataList(raw: RawData, extraFields: string[]) {
    return extraFields.map((field) => CellData.getCellData(raw, field));
  }

  static getFieldValue(data: ViewMetaData, field: string = '') {
    if (data instanceof CellData) {
      return field ? data.getValueByField(field) : data[ORIGIN_FIELD];
    }

    return data?.[field];
  }

  get [ORIGIN_FIELD]() {
    return this.raw;
  }

  get [EXTRA_FIELD]() {
    return this.extraField;
  }

  get [VALUE_FIELD]() {
    return this.raw[this.extraField];
  }

  getValueByField(field: string) {
    if (field === VALUE_FIELD || field === EXTRA_FIELD) {
      return this[field];
    }

    return this.raw[field];
  }
}
