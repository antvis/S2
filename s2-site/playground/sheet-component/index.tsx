import React, { useEffect } from 'react';
import { SheetComponent, SheetComponentOptions } from '@antv/s2-react';
import {
  type S2DataConfig,
  type ThemeCfg,
  getPalette,
  generatePalette,
} from '@antv/s2';
import type { SheetType, Adaptive } from '@antv/s2-shared';
import '@antv/s2-react/dist/style.min.css';
import { concat, merge } from 'lodash';
import { sheetDataCfg, subTotalsDimensions } from './config';
import './index.less';

type Props = {
  sheetConfig: any;
};

export const CustomSheet: React.FC<Props> = (props) => {
  const [sheetType, setSheetType] = React.useState<SheetType>('pivot');
  const [dataCfg, setDataCfg] = React.useState<S2DataConfig>(sheetDataCfg);
  const [options, setOptions] = React.useState<SheetComponentOptions>();
  const [themeCfg, setThemeCfg] = React.useState<ThemeCfg>({
    name: 'default',
  });
  const [adaptive, setAdaptive] = React.useState<Adaptive>(true);
  const [showPagination, setShowPagination] = React.useState<boolean>(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  const { sheetConfig } = props;

  useEffect(() => {
    if (!sheetConfig?.sheetType) {
      return;
    }
    setSheetType(sheetConfig?.sheetType);
  }, [sheetConfig?.sheetType]);

  useEffect(() => {
    const { rows, columns, values, valueLocation } = sheetConfig;
    const pivotFields = {
      rows,
      columns,
      values,
      valueInCols: valueLocation && valueLocation === 'column',
    };
    const tableFields = {
      columns: concat([], rows || [], columns || [], values || []),
    };
    setDataCfg(
      sheetType === 'pivot'
        ? { ...sheetDataCfg, fields: pivotFields }
        : { ...sheetDataCfg, fields: tableFields },
    );
  }, [
    sheetConfig?.rows,
    sheetConfig?.columns,
    sheetConfig?.values,
    sheetConfig?.valueLocation,
    sheetType,
  ]);

  useEffect(() => {
    const {
      hierarchyType,
      widthChange,
      sheetWidth,
      sheetHeight,
      frozenRowHeader,
      rowSubTotals,
      rowGrandTotals,
      columnSubTotals,
      columnGrandTotals,
    } = sheetConfig;
    const mergedOptions = merge(options, {
      hierarchyType,
      style: { layoutWidthType: widthChange },
      width: sheetWidth,
      height: sheetHeight,
      frozenRowHeader,
      pagination: showPagination && {
        pageSize: 10,
        current: 1,
      },
      totals: {
        row: {
          showGrandTotals: rowGrandTotals,
          showSubTotals: rowSubTotals,
          reverseLayout: true,
          reverseSubLayout: true,
          subTotalsDimensions: subTotalsDimensions.rowSubTotalsDimensions,
        },
        col: {
          showGrandTotals: columnGrandTotals,
          showSubTotals: columnSubTotals,
          reverseLayout: true,
          reverseSubLayout: true,
          subTotalsDimensions: subTotalsDimensions.colSubTotalsDimensions,
        },
      },
    });
    setOptions({ ...mergedOptions });
  }, [
    sheetConfig?.hierarchyType,
    sheetConfig?.widthChange,
    sheetConfig?.sheetWidth,
    sheetConfig?.sheetHeight,
    sheetConfig?.frozenRowHeader,
    showPagination,
    sheetConfig?.rowSubTotals,
    sheetConfig?.rowGrandTotals,
    sheetConfig?.columnSubTotals,
    sheetConfig?.columnGrandTotals,
  ]);

  useEffect(() => {
    const { theme } = sheetConfig;
    setThemeCfg({ name: theme });
  }, [sheetConfig?.theme]);

  useEffect(() => {
    if (!sheetConfig?.themeColor) {
      return;
    }
    const { theme, themeColor } = sheetConfig;
    const palette = getPalette(theme || 'default');
    const newPalette = generatePalette({
      ...palette,
      brandColor: themeColor?.hex || '#E0E9FD',
    });
    setThemeCfg({ name: theme, palette: newPalette });
  }, [sheetConfig?.themeColor]);

  useEffect(() => {
    const { adaptive } = sheetConfig;
    if (adaptive) {
      setAdaptive({
        width: true,
        height: true,
        getContainer: () => containerRef.current,
      });
    } else {
      setAdaptive(false);
      setOptions({
        width: sheetConfig?.sheetWidth ?? 600,
        height: sheetConfig?.sheetHeight ?? 480,
      });
    }
  }, [sheetConfig?.adaptive]);

  useEffect(() => {
    const { showPagination } = sheetConfig;
    setShowPagination(showPagination);
  }, [sheetConfig?.showPagination]);

  useEffect(() => {
    const { showSeriesNumber, showPagination } = sheetConfig;
    setOptions({
      showSeriesNumber,
      pagination: showPagination && {
        pageSize: 10,
        current: 1,
      },
    });
  }, [sheetConfig?.showSeriesNumber]);

  return (
    <div className="sheet-container" ref={containerRef}>
      <SheetComponent
        dataCfg={dataCfg}
        options={options}
        themeCfg={themeCfg}
        sheetType={sheetType}
        adaptive={adaptive}
        showPagination={showPagination}
      />
    </div>
  );
};
