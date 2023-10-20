import { EXTRA_FIELD, VALUE_FIELD } from '../../common/constant/basic';
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

  get(target: Data, p: string) {
    if (p === EXTRA_FIELD) {
      return this.extraField;
    }
    if (p === VALUE_FIELD) {
      return target[this.extraField];
    }
    return target[p];
  }

  ownKeys(target: Data): string[] {
    return Object.keys(target).concat(EXTRA_FIELD, VALUE_FIELD);
  }

  getOwnPropertyDescriptor(): PropertyDescriptor {
    return {
      configurable: true,
      enumerable: true,
    };
  }
}
