import { set, keys } from 'lodash';
import {
  flattenDeep as customFlattenDeep,
  flatten as customFlatten,
} from '@/utils/data-set-operate';

describe('Data Set Operate Test', () => {
  const data = [];
  describe('Dataset Operate Test That Data Has No undefined', () => {
    beforeEach(() => {
      const paths = [
        [0, 0],
        [0, 1],
        [1, 0],
        [1, 1],
      ];
      paths.forEach((item, index) => {
        set(data, [...item], [index, index + 1]);
      });
    });

    it('test custom flattenDeep', () => {
      expect(keys(customFlattenDeep(data))).toBeArrayOfSize(8);
    });

    it('test custom flatten', () => {
      expect(keys(customFlatten(data))).toBeArrayOfSize(4);
    });
  });

  describe('Dataset Operate Test That Data Has undefined', () => {
    beforeEach(() => {
      const paths = [
        [0, 0],
        [0, 1],
        [1, 0],
        [1, 1],
        [undefined, undefined],
        [0, undefined],
      ];
      paths.forEach((item, index) => {
        set(data, [...item], [index, index + 1]);
      });
    });

    it('test custom flattenDeep', () => {
      expect(keys(customFlattenDeep(data))).toBeArrayOfSize(12);
    });

    it('test custom flatten', () => {
      expect(keys(customFlatten(data))).toBeArrayOfSize(6);
    });
  });
});
