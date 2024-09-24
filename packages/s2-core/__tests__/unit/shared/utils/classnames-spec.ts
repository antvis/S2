import { getStrategySheetTooltipClsName } from '../../../../src/shared';

describe('classnames test', () => {
  test('#getStrategySheetTooltipClsName()', () => {
    expect(getStrategySheetTooltipClsName()).toEqual(
      'antv-s2-strategy-sheet-tooltip',
    );
    expect(getStrategySheetTooltipClsName('test')).toEqual(
      'antv-s2-strategy-sheet-tooltip-test',
    );
  });
});
