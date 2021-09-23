import { isMultiDataItem } from '@/utils/data-item-type-checker';
describe('data-item-type-checker test', () => {
  test(`should return true when it's multi data item`, () => {
    expect(isMultiDataItem({ values: [[1], [2]] })).toBeTrue();
  });

  test(`should return false when it's single data item`, () => {
    expect(isMultiDataItem(123)).toBeFalse();
  });
});
