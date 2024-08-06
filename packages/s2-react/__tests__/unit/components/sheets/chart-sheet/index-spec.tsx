/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable max-classes-per-file */
import {
  SheetComponent,
  type SheetComponentOptions,
  type SheetComponentProps,
} from '@/components';
import { customMerge, type SpreadSheet } from '@antv/s2';
import { waitFor } from '@testing-library/react';
import React from 'react';
import type { Root } from 'react-dom/client';
import { ChartDataConfig } from '../../../../data/data-g2-chart';
import { renderComponent } from '../../../../util/helpers';

describe('<ChartSheet/> Tests', () => {
  let s2: SpreadSheet;
  let unmount: Root['unmount'];

  afterEach(() => {
    unmount?.();
  });

  const renderChartSheet = (
    options: SheetComponentOptions | null,
    props?: Partial<SheetComponentProps>,
  ) => {
    unmount = renderComponent(
      <SheetComponent
        sheetType="chart"
        options={customMerge(
          {
            width: 1000,
            height: 800,
          },
          options,
        )}
        dataCfg={ChartDataConfig}
        onMounted={(instance) => {
          s2 = instance;
        }}
        {...props}
      />,
    );
  };

  test('should default render empty text shape', async () => {
    renderChartSheet(null);

    await waitFor(() => {
      s2.facet.getDataCells().forEach((cell) => {
        expect(cell.getActualText()).toBeUndefined();
        expect(cell.getTextShapes()).toBeEmpty();
      });
    });
  });

  test('should trigger date cell render event', async () => {
    renderChartSheet(null);

    await waitFor(() => {
      s2.facet.getDataCells().forEach((cell) => {
        expect(cell.getActualText()).toBeUndefined();
        expect(cell.getTextShapes()).toBeEmpty();
      });
    });
  });

  test('should find canvas container for g2 library', async () => {
    const errorSpy = jest
      .spyOn(console, 'error')
      .mockImplementationOnce(() => {});

    renderChartSheet(null);

    await waitFor(() => {
      expect(errorSpy).not.toHaveBeenCalledWith(
        `Uncaught (in promise) TypeError: Cannot read property 'createElement' of null`,
      );
      expect(errorSpy).not.toHaveBeenCalledWith(
        `Uncaught (in promise) TypeError: Cannot read property 'defaultView' of null`,
      );
      expect(errorSpy).not.toHaveBeenCalledWith(
        `Uncaught Error: renderToMountedElement can't render chart to unmounted group.`,
      );
    });
  });
});
