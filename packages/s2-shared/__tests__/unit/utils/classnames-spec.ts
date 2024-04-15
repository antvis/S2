import { getStrategySheetTooltipClsName } from '../../../src/utils/classnames';

describe('classnames test', () => {
  test('#getStrategySheetTooltipClsName()', () => {
    expect(getStrategySheetTooltipClsName()).toEqual(
      's2-strategy-sheet-tooltip',
    );
    expect(getStrategySheetTooltipClsName('test')).toEqual(
      's2-strategy-sheet-tooltip-test',
    );
  });
});
