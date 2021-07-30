import {
  isPositive,
  updateConditionsByDerivedValues,
} from './../../../src/utils/condition';
import { getIconPosition } from '../../../src/utils/condition';

describe('Condition Test', () => {
  describe('getIconPositions Test', () => {
    test('should return right by default', () => {
      expect(
        getIconPosition({
          fieldValue: 'value',
          mapping: () => ({ fill: 'red' }),
        }),
      ).toEqual('right');
    });

    test(`should return left when it's left`, () => {
      expect(
        getIconPosition({
          fieldValue: 'value',
          iconPosition: 'left',
          mapping: () => ({ fill: 'red' }),
        }),
      ).toEqual('left');
    });
  });

  describe('isPositive Test', () => {
    test('should expected result when value is number', () => {
      expect(isPositive(20)).toBeTruthy();
      expect(isPositive(-20)).toBeFalsy();
    });

    test('should return expected result when value is string', () => {
      expect(isPositive('20')).toBeTruthy();
      expect(isPositive('-20')).toBeFalsy();
    });
  });

  describe('updateConditionsByDerivedValues Test', () => {
    test(`should return origin conditions when there is not derived values`, () => {
      expect(updateConditionsByDerivedValues({}, [])).toEqual({});
    });

    test(`should return expected conditions when there is derived value without conflict`, () => {
      expect(updateConditionsByDerivedValues({}, ['value'])).toEqual({
        background: undefined,
        interval: undefined,
        icon: [
          {
            field: 'value',
            iconPosition: 'left',
            mapping: expect.any(Function),
          },
        ],
        text: [
          {
            field: 'value',
            mapping: expect.any(Function),
          },
        ],
      });
    });

    test(`should return expected conditions when there is derived value with conflict`, () => {
      expect(
        updateConditionsByDerivedValues(
          {
            icon: [
              {
                field: 'value',
                iconPosition: 'right',
                mapping: () => {},
              },
            ],
          },
          ['value'],
        ),
      ).toEqual({
        background: undefined,
        interval: undefined,
        icon: [
          {
            field: 'value',
            iconPosition: 'left',
            mapping: expect.any(Function),
          },
        ],
        text: [
          {
            field: 'value',
            mapping: expect.any(Function),
          },
        ],
      });
    });
  });
});
