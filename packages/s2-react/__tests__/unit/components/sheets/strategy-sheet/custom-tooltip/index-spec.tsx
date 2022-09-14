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

  test('should hidden original value', () => {
    const originalValues = [1.1, 2.2, 3.3];

    jest.spyOn(mockCellInfo.mockCell, 'getMeta').mockImplementation(() => ({
      fieldValue: {
        values: ['1', '2', '3'],
        originalValues,
      },
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
    }));
    render(
      <StrategySheetDataTooltip
        cell={mockCellInfo.mockCell}
        showOriginalValue={false}
      />,
    );

    originalValues.forEach((value) => {
      expect(screen.getByText(value)).not.toBeDefined();
    });
  });
});
