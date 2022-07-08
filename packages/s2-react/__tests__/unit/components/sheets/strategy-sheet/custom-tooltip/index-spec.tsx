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
  const mockCell = {
    ...mockCellInfo.mockCell,
    getMeta: () => {
      return {
        spreadsheet: {
          options: {
            style: {},
          },
          getRowNodes: jest.fn(),
          getColumnNodes: jest.fn(),
          dataSet: {
            getFieldDescription: jest.fn(),
            getFieldName: jest.fn(),
          },
        },
      };
    },
  };

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
    render(<Comp cell={mockCell} label={label} />);
    expect(screen.getByText(label)).toBeDefined();
  });
});
