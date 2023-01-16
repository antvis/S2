import { act, render, screen } from '@testing-library/react';
import React from 'react';
import ReactDOM from 'react-dom';
import { createMockCellInfo, getContainer } from '../../../../../util/helpers';
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

  test('should show original value', () => {
    // [数值, 衍生指标1, 衍生指标2]
    const originalValues = [1.1, 0.02, 0.03];

    jest.spyOn(mockCellInfo.mockCell, 'getMeta').mockImplementation(() => ({
      ...mockCellInfo.mockCellMeta,
      fieldValue: {
        values: ['1222', '2%', '3%'],
        originalValues,
      },
    }));

    const container = getContainer();

    act(() => {
      ReactDOM.render(
        <StrategySheetDataTooltip
          cell={mockCellInfo.mockCell}
          showOriginalValue
        />,
        container,
      );
    });

    expect(
      container.querySelector('.s2-strategy-sheet-tooltip-original-value'),
    ).toBeDefined();
  });

  test('should render custom derived value', () => {
    render(
      <StrategySheetDataTooltip
        cell={mockCellInfo.mockCell}
        renderDerivedValue={() => 'customDerivedValue'}
      />,
    );
    expect(screen.getAllByText('customDerivedValue')).toHaveLength(3);
    expect(screen.getAllByText('customDerivedValue')).toMatchSnapshot();
  });
});
