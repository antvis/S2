import { render, screen } from '@testing-library/react';
import React from 'react';
import { createMockCellInfo } from '../../../../../util/helpers';
import {
  StrategySheetColTooltip,
  StrategySheetDataTooltip,
  StrategySheetRowTooltip,
} from '../../../../../../src/components/sheets/strategy-sheet/custom-tooltip';

describe('StrategySheet Tooltip Tests', () => {
  const mockCellInfo = createMockCellInfo('test');

  test.each([
    {
      label: 'test col label',
      component: StrategySheetColTooltip,
    },
    {
      label: 'test data label',
      component: StrategySheetDataTooltip,
    },
    {
      label: 'test row label',
      component: StrategySheetRowTooltip,
    },
  ])('should render tooltip with %o', ({ label, component: Comp }) => {
    render(<Comp cell={mockCellInfo.mockCell} label={label} />);
    expect(screen.getByText(label)).toBeDefined();
    expect(screen.getByText(label)).toMatchSnapshot();
  });
});
