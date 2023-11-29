import {
  EXTRA_FIELD,
  ORIGIN_FIELD,
  VALUE_FIELD,
} from '../../common/constant/field';
import type { Data } from '../../common/interface/s2DataConfig';

export class DataHandler implements ProxyHandler<Data> {
  static createProxyData(data: Data, extraField: string) {
    return new Proxy(data, new DataHandler(extraField));
  }

  static createProxyDataList(data: Data, extraFields: string[]) {
    return extraFields.map((field) => DataHandler.createProxyData(data, field));
  }

  private extraField: string;

  constructor(extraField: string) {
    this.extraField = extraField;
  }

  get(target: Data, key: string) {
    if (key === ORIGIN_FIELD) {
      return target;
    }

    if (key === EXTRA_FIELD) {
      return this.extraField;
    }
    if (key === VALUE_FIELD) {
      return target[this.extraField];
    }
    return target[key];
  }

  has(target: Data, key: string) {
    if (key === EXTRA_FIELD || key === VALUE_FIELD) {
      return true;
    }
    return key in target;
  }

  ownKeys(target: Data): string[] {
    return Object.keys(target).concat(EXTRA_FIELD, VALUE_FIELD);
  }

  getOwnPropertyDescriptor(target: Data, key: string): PropertyDescriptor {
    if (key === EXTRA_FIELD || key === VALUE_FIELD) {
      return {
        configurable: true,
        enumerable: true,
      };
    }
    return Object.getOwnPropertyDescriptor(target, key);
  }
}
