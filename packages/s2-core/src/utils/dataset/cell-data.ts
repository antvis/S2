import { EXTRA_FIELD, VALUE_FIELD } from '../../../esm';
import type { RawData } from '../../common/interface/s2DataConfig';

export class CellData {
  constructor(private raw: RawData, private extraField: string) {}

  getOrigin() {
    return this.raw;
  }

  get [EXTRA_FIELD]() {
    return this.extraField;
  }

  get [VALUE_FIELD]() {
    return this.raw[this.extraField];
  }
}
