import { Store } from '@/common/store';
import { SpreadSheet } from '@/sheet-type';
import {
  clearState,
  getState,
  setState,
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
    expect(getState(mockInstance, 'price')).toBeUndefined();
  });

  test('should update value ranges', () => {
    setState(mockInstance, {
      price: {
        maxValue: 100,
        minValue: 0,
      },
    });
    expect(getState(mockInstance, 'price')).toEqual({
      maxValue: 100,
      minValue: 0,
    });

    // update other field range
    setState(mockInstance, {
      count: {
        maxValue: 10,
        minValue: 0,
      },
    });
    // should remain other state
    expect(getState(mockInstance, 'count')).toEqual({
      maxValue: 10,
      minValue: 0,
    });
    // correctly set new state
    expect(getState(mockInstance, 'price')).toEqual({
      maxValue: 100,
      minValue: 0,
    });
  });

  test('should clear value ranges', () => {
    setState(mockInstance, {
      price: {
        maxValue: 100,
        minValue: 0,
      },
    });
    setState(mockInstance, {
      count: {
        maxValue: 10,
        minValue: 0,
      },
    });
    expect(getState(mockInstance, 'price')).toEqual({
      maxValue: 100,
      minValue: 0,
    });
    expect(getState(mockInstance, 'count')).toEqual({
      maxValue: 10,
      minValue: 0,
    });

    clearState(mockInstance);

    expect(getState(mockInstance, 'price')).toBeUndefined();
    expect(getState(mockInstance, 'count')).toBeUndefined();
  });
});
