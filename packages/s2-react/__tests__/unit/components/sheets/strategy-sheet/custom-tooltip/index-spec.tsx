import { render, screen } from '@testing-library/react';
import React from 'react';
import {
  StrategySheetColCellTooltip,
  StrategySheetDataCellTooltip,
  StrategySheetRowCellTooltip,
} from '../../../../../../src/components/sheets/strategy-sheet/custom-tooltip';
import {
  createMockCellInfo,
  getContainer,
  renderComponent,
} from '../../../../../util/helpers';

describe('StrategySheet Tooltip Tests', () => {
  const mockCellInfo = createMockCellInfo('test');

  test.each([
    {
      label: 'test col label',
      component: StrategySheetColCellTooltip,
    },
    {
      label: 'test data label',
      component: StrategySheetDataCellTooltip,
    },
    {
      label: 'test row label',
      component: StrategySheetRowCellTooltip,
    },
  ])('should render tooltip with %o', ({ label, component: Comp }) => {
    render(<Comp cell={mockCellInfo.mockCell} label={label} />);
    expect(screen.getByText(label)).toBeDefined();
    expect(screen.getByText(label)).toMatchSnapshot();
  });

  test('should show original value', () => {
    // [数值, 衍生指标1, 衍生指标2]
    const originalValues = [1.1, 0.02, 0.03];

    jest.spyOn(mockCellInfo.mockCell, 'getMeta').mockImplementation(() => {
      return {
        ...mockCellInfo.mockCellMeta,
        fieldValue: {
          values: ['1222', '2%', '3%'],
          originalValues,
        },
      };
    });

    const container = getContainer();

    renderComponent(
      <StrategySheetDataCellTooltip
        cell={mockCellInfo.mockCell}
        showOriginalValue
      />,
      container,
    );

    expect(
      container.querySelector('.s2-strategy-sheet-tooltip-original-value'),
    ).toBeDefined();
  });

  test('should render custom derived value', () => {
    render(
      <StrategySheetDataCellTooltip
        cell={mockCellInfo.mockCell}
        renderDerivedValue={() => 'customDerivedValue'}
      />,
    );
    expect(screen.getAllByText('customDerivedValue')).toHaveLength(3);
    expect(screen.getAllByText('customDerivedValue')).toMatchSnapshot();
  });

  // cli 的方式得到的结果是错, 基于 test:live 就是对的, 不知道为啥
  test.skip('should render overflow wrap description for row tooltip', () => {
    const description = `test_`.repeat(40);
    const mockDescCellInfo = createMockCellInfo('test', {
      extra: {
        description,
      },
    });

    const { container } = render(
      <StrategySheetRowCellTooltip
        cell={mockDescCellInfo.mockCell}
        label="test row label"
      />,
    );

    const { width, height } = container!
      .querySelector('.s2-strategy-sheet-tooltip-description-text')!
      .getBoundingClientRect();

    expect(Math.floor(width)).toBeCloseTo(937);
    expect(Math.floor(height)).toBeCloseTo(37);
  });
});
