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

  getValueByKey(key: string) {
    return this.raw?.[key];
  }

  get [EXTRA_FIELD]() {
    return this.extraField;
  }

  get [VALUE_FIELD]() {
    return this.raw?.[this.extraField];
  }
}
