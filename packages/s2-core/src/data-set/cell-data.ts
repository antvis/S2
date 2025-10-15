/* eslint-disable no-empty-function */
import { EXTRA_FIELD, ORIGIN_FIELD, VALUE_FIELD } from '../common/constant';
import type { ViewMetaData } from '../common/interface/basic';
import type { RawData } from '../common/interface/s2DataConfig';
import { getByPath } from '../utils/accessor';

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

    return getByPath(data as unknown as Record<string, any>, field);
  }

  get [ORIGIN_FIELD]() {
    return this.raw;
  }

  get [EXTRA_FIELD]() {
    return this.extraField;
  }

  get [VALUE_FIELD]() {
    // 为保持向后兼容：当 extraField 为嵌套路径（如 a.b.c）时，不将其暴露为 $$value$$
    // 仅当 extraField 为顶层字段时，才通过 $$value$$ 快捷访问
    if (this.extraField && this.extraField.includes('.')) {
      return undefined;
    }

    return getByPath(this.raw, this.extraField);
  }

  getValueByField(field: string) {
    if (field === VALUE_FIELD || field === EXTRA_FIELD) {
      return this[field];
    }

    return getByPath(this.raw, field);
  }
}
