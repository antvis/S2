import type {Adaptive, SheetType} from '@antv/s2';
import {
  generatePalette,
  getPalette,
  type S2DataConfig,
  type ThemeCfg,
} from '@antv/s2';
import {SheetComponent, SheetComponentOptions} from '@antv/s2-react';
import '@antv/s2-react/dist/s2-react.min.css';
import {Pagination} from 'antd';
import {concat, isEmpty, merge} from 'lodash';
import React, {useEffect} from 'react';
import {sheetDataCfg, subTotalsDimensions} from './config';
import './index.less';

type Props = {
  sheetConfig: any;
};

export const CustomSheet: React.FC<Props> = (props) => {
  const [sheetType, setSheetType] = React.useState<SheetType>('pivot');
  const [dataCfg, setDataCfg] = React.useState<S2DataConfig>();
  const [options, setOptions] = React.useState<SheetComponentOptions>();
  const [themeCfg, setThemeCfg] = React.useState<ThemeCfg>({
    name: 'default',
  });
  const [adaptive, setAdaptive] = React.useState<Adaptive>(true);
  const [showPagination, setShowPagination] = React.useState<boolean>(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  const {sheetConfig} = props;

  const getExampleDataCfg = () => {
    const {rows, columns, values, valueLocation} = sheetConfig;
    const pivotFields = {
      rows,
      columns,
      values,
      valueInCols: valueLocation && valueLocation === 'column',
    };
    const tableFields = {
      columns: concat([], rows || [], columns || [], values || []),
    };

    if (sheetType === 'pivot') {
      return {...sheetDataCfg, fields: pivotFields};
    }

    return {...sheetDataCfg, fields: tableFields};
  };

  const getImportDataCfg = () => {
    const {importData, valueLocation} = sheetConfig;
    const {fields} = importData;
    const pivotFields = {
      ...fields,
      valueInCols: valueLocation && valueLocation === 'column',
    };
    const {rows, columns, values} = fields;
    const tableFields = {
      columns: concat([], rows || [], columns || [], values || []),
    };

    if (sheetType === 'pivot') {
      return {...importData, fields: pivotFields};
    }

    return {...importData, fields: tableFields};
  };

  useEffect(() => {
    if (!sheetConfig?.sheetType) {
      return;
    }

    setSheetType(sheetConfig?.sheetType);
  }, [sheetConfig?.sheetType]);

  useEffect(() => {
    const dataCfg = getExampleDataCfg();

    setDataCfg(dataCfg);
  }, [
    sheetConfig?.rows,
    sheetConfig?.columns,
    sheetConfig?.values,
    sheetConfig?.valueLocation,
  ]);

  useEffect(() => {
    if (
      isEmpty(sheetConfig?.dataSource) ||
      sheetConfig?.dataSource === 'exampleData' ||
      isEmpty(sheetConfig?.importData)
    ) {
      const dataCfg = getExampleDataCfg();

      setDataCfg(dataCfg);
    } else if (!isEmpty(sheetConfig?.importData)) {
      const dataCfg = getImportDataCfg();

      setDataCfg(dataCfg);
    }
  }, [
    sheetConfig?.importData,
    sheetConfig?.dataSource,
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

    setOptions(op => ({
      ...op,
      hierarchyType,
      style: {layoutWidthType: widthChange},
      width: sheetWidth,
      height: sheetHeight,
      frozen: {
        rowHeader: frozenRowHeader,
      },
      pagination: showPagination && {
        pageSize: 10,
        current: 1,
      },
      totals: {
        row: {
          showGrandTotals: rowGrandTotals,
          showSubTotals: rowSubTotals,
          reverseGrandTotalsLayout: true,
          reverseSubTotalsLayout: true,
          subTotalsDimensions: subTotalsDimensions.rowSubTotalsDimensions,
          calcGrandTotals: {
            aggregation: 'SUM',
          },
          calcSubTotals: {
            aggregation: 'SUM',
          },
        },
        col: {
          showGrandTotals: columnGrandTotals,
          showSubTotals: columnSubTotals,
          reverseGrandTotalsLayout: true,
          reverseSubTotalsLayout: true,
          subTotalsDimensions: subTotalsDimensions.colSubTotalsDimensions,
          calcGrandTotals: {
            aggregation: 'SUM',
          },
          calcSubTotals: {
            aggregation: 'SUM',
          },
        },
      },
    }));
  }, [
    sheetConfig?.hierarchyType,
    sheetConfig?.widthChange,
    sheetConfig?.sheetWidth,
    sheetConfig?.sheetHeight,
    sheetConfig?.rowHeader,
    showPagination,
    sheetConfig?.rowSubTotals,
    sheetConfig?.rowGrandTotals,
    sheetConfig?.columnSubTotals,
    sheetConfig?.columnGrandTotals,
  ]);

  useEffect(() => {
    const {theme} = sheetConfig;

    setThemeCfg({name: theme});
  }, [sheetConfig?.theme]);

  useEffect(() => {
    if (!sheetConfig?.themeColor) {
      return;
    }

    const {theme, themeColor} = sheetConfig;
    const palette = getPalette(theme || 'default');
    const newPalette = generatePalette({
      ...palette,
      brandColor: themeColor?.hex || '#E0E9FD',
    });

    setThemeCfg({name: theme, palette: newPalette});
  }, [sheetConfig?.themeColor]);

  useEffect(() => {
    const {adaptive} = sheetConfig;

    if (adaptive) {
      setAdaptive({
        width: true,
        height: true,
        getContainer: () => containerRef.current,
      });
    } else {
      setAdaptive(false);
      setOptions(op => ({
        ...op,
        width: (sheetConfig?.sheetWidth ?? 600) + Math.random(),
        height: (sheetConfig?.sheetHeight ?? 480) + Math.random(),
      }));
    }
  }, [sheetConfig?.adaptive]);

  useEffect(() => {
    const {showPagination} = sheetConfig;

    setShowPagination(showPagination);
  }, [sheetConfig?.showPagination]);

  useEffect(() => {
    const {showSeriesNumber, showPagination} = sheetConfig;

    setOptions(op => ({
      ...op,
      seriesNumber: {
        enable: showSeriesNumber,
      },
      pagination: showPagination && {
        pageSize: 10,
        current: 1,
      },
    }));
  }, [sheetConfig?.showSeriesNumber]);

  return (
    <div className="sheet-container" ref={containerRef}>
      {dataCfg && (
        <SheetComponent
          dataCfg={dataCfg}
          options={options}
          themeCfg={themeCfg}
          sheetType={sheetType}
          adaptive={adaptive}
        >
          {({pagination}) =>
            showPagination && (
              <Pagination
                showQuickJumper
                showSizeChanger
                showTotal={(total) => `共计 ${total} 条`}
                {...pagination}
              />
            )
          }
        </SheetComponent>
      )}
    </div>
  );
};
