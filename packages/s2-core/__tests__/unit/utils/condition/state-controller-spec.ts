import { Store } from '@/common/store';
import { SpreadSheet } from '@/sheet-type';
import {
  clearValueRangeState,
  getValueRangeState,
  setValueRangeState,
} from '@/utils/condition/state-controller';

jest.mock('@/sheet-type');

const MockSpreadSheet = SpreadSheet as unknown as jest.Mock<SpreadSheet>;

describe('Condition State Controller Test', () => {
  let mockInstance: SpreadSheet;
  beforeEach(() => {
    mockInstance = new MockSpreadSheet();
    mockInstance.store = new Store();
  });

  test('should return undefined when there is not field value range', () => {
    expect(getValueRangeState(mockInstance, 'price')).toBeUndefined();
  });

  test('should update value ranges', () => {
    setValueRangeState(mockInstance, {
      price: {
        maxValue: 100,
        minValue: 0,
      },
    });
    expect(getValueRangeState(mockInstance, 'price')).toEqual({
      maxValue: 100,
      minValue: 0,
    });

    // update other field range
    setValueRangeState(mockInstance, {
      count: {
        maxValue: 10,
        minValue: 0,
      },
    });
    // should remain other state
    expect(getValueRangeState(mockInstance, 'count')).toEqual({
      maxValue: 10,
      minValue: 0,
    });
    // correctly set new state
    expect(getValueRangeState(mockInstance, 'price')).toEqual({
      maxValue: 100,
      minValue: 0,
    });
  });

  test('should clear value ranges', () => {
    setValueRangeState(mockInstance, {
      price: {
        maxValue: 100,
        minValue: 0,
      },
    });
    setValueRangeState(mockInstance, {
      count: {
        maxValue: 10,
        minValue: 0,
      },
    });
    expect(getValueRangeState(mockInstance, 'price')).toEqual({
      maxValue: 100,
      minValue: 0,
    });
    expect(getValueRangeState(mockInstance, 'count')).toEqual({
      maxValue: 10,
      minValue: 0,
    });

    clearValueRangeState(mockInstance);

    expect(getValueRangeState(mockInstance, 'price')).toBeUndefined();
    expect(getValueRangeState(mockInstance, 'count')).toBeUndefined();
  });
});
