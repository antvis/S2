import { render, waitFor } from '@testing-library/react';
import React from 'react';
import type { SpreadSheet } from '@antv/s2';
import { MobileSheetComponent } from '../../../../../src/components/sheets/mobile-sheet';
import { SheetComponent } from '../../../../../src/components/sheets';
import { CustomTooltip } from '../../../../../src';
import * as mockDataConfig from '../../../../data/simple-data.json';

describe('Mobile Tooltip Different Tests', () => {
  test('SheetComponent hide tooltip do not trigger renderContent', async () => {
    let s2: SpreadSheet;
    let customTooltipInstance;

    render(
      <SheetComponent
        dataCfg={mockDataConfig}
        options={{
          tooltip: {
            render: (s) => {
              customTooltipInstance = new CustomTooltip(s);
              customTooltipInstance.renderContent = jest.fn();

              return customTooltipInstance;
            },
          },
        }}
        onMounted={(s) => {
          s2 = s;
        }}
      />,
    );

    await waitFor(() => {
      s2!.showTooltip({ position: { x: 0, y: 0 }, content: '111' });
      expect(s2!.tooltip).toBeInstanceOf(CustomTooltip);
      expect(s2!.tooltip.renderContent).toHaveBeenCalledTimes(1);

      s2!.hideTooltip();
      expect(s2!.tooltip.renderContent).toHaveBeenCalledTimes(1);
    });
  });

  test('hide tooltip trigger renderContent', async () => {
    let s2: SpreadSheet;
    let customTooltipInstance;

    render(
      <MobileSheetComponent
        dataCfg={mockDataConfig}
        options={{
          tooltip: {
            render: (s) => {
              customTooltipInstance = new CustomTooltip(s);
              customTooltipInstance.renderContent = jest.fn();

              return customTooltipInstance;
            },
          },
        }}
        onMounted={(s) => {
          s2 = s;
        }}
      />,
    );

    await waitFor(() => {
      s2!.showTooltip({ position: { x: 0, y: 0 }, content: '111' });
      expect(s2!.tooltip).toBeInstanceOf(CustomTooltip);
      expect(s2!.tooltip.renderContent).toHaveBeenCalledTimes(1);

      s2!.hideTooltip();
      expect(s2!.tooltip.renderContent).toHaveBeenCalledTimes(2);
    });
  });

  test('show tooltip when visible is true', async () => {
    let s2: SpreadSheet;
    let customTooltipInstance;

    render(
      <MobileSheetComponent
        dataCfg={mockDataConfig}
        options={{
          tooltip: {
            render: (s) => {
              customTooltipInstance = new CustomTooltip(s);
              customTooltipInstance.renderContent = jest.fn();

              return customTooltipInstance;
            },
          },
        }}
        onMounted={(s) => {
          s2 = s;
        }}
      />,
    );

    await waitFor(() => {
      s2!.showTooltip({ position: { x: 0, y: 0 }, content: '111' });
      expect(s2!.tooltip.visible).toEqual(true);
    });
  });
});
