// TODO 抽取不同sheet组件的公共方法
import React, { useEffect, useState } from 'react';
import {
  debounce,
  forEach,
  isEmpty,
  isFunction,
  forIn,
  isObject,
  max,
} from 'lodash';
import { merge } from 'lodash';
import { Spin } from 'antd';
import { Header } from '../../header';

import { TabularDataCell } from './tabular-data-cell';
import { TabularTheme } from './tabular-theme';
import {
  KEY_COLUMN_CELL_CLICK,
  KEY_CORNER_CELL_CLICK,
  KEY_ROW_CELL_CLICK,
  KEY_SINGLE_CELL_CLICK,
} from 'src/index';
import BaseSpreadsheet from 'src/sheet-type/base-spread-sheet';
import SpreadSheet from 'src/sheet-type/spread-sheet';
import { BaseSheetProps } from '../interface';
import {
  safetyDataConfig,
  safetyOptions,
  S2Options,
} from 'src/common/interface';

export const TabularSheet = (props: BaseSheetProps) => {
  const {
    spreadsheet,
    // TODO dataCfg细化
    dataCfg,
    options,
    adaptive = true,
    header,
    theme = TabularTheme,
    isLoading,
    onRowCellClick,
    onColCellClick,
    onCornerCellClick,
    onDataCellClick,
    getSpreadsheet,
  } = props;
  let container: HTMLDivElement;
  let baseSpreadsheet: BaseSpreadsheet;
  const [ownSpreadsheet, setOwnSpreadsheet] = useState<BaseSpreadsheet>();
  const [resizeTimeStamp, setResizeTimeStamp] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // 网格内行高
  const CELL_LINEHEIGHT = 30;

  const getCellHeight = (): number => {
    const { data } = dataCfg;
    const height = options?.style?.cellCfg?.height;
    if (height) return height;
    const lineHeight = options?.style?.cellCfg?.lineHeight || CELL_LINEHEIGHT;
    if (isEmpty(data)) return lineHeight;
    const lengths = [];
    // TODO 还没想清楚需不需要找最大的，需不需要限定都一样的个数，先让子弹飞一飞
    forEach(data, (value) => {
      forIn(value, (v) => {
        if (isObject(v) && v?.values) {
          lengths.push(v?.values.length);
        }
      });
    });
    const maxLength = max(lengths) || 1;
    return maxLength * lineHeight;
  };

  const buildOptions = (): S2Options => {
    return safetyOptions(
      merge(options, {
        dataCell: TabularDataCell,
        style: {
          colCfg: {
            colWidthType: 'adaptive',
            hideMeasureColumn: true,
          },
          cellCfg: {
            height: getCellHeight(),
          },
          device: 'pc',
        },
      }),
    );
  };

  const setOptions = (sheetInstance?: BaseSpreadsheet) => {
    const newOptions = buildOptions();
    const curSheet = sheetInstance || ownSpreadsheet;
    curSheet.setOptions(newOptions);
  };

  const setDataCfg = () => {
    ownSpreadsheet.setDataCfg(dataCfg);
  };

  const update = (reset?: () => void, callBack?: () => void) => {
    if (!ownSpreadsheet) return;

    reset?.();
    callBack?.();
    ownSpreadsheet.render();
    setLoading(false);
  };

  const getSpreadSheet = (): BaseSpreadsheet => {
    if (spreadsheet) {
      return spreadsheet(container, dataCfg, buildOptions());
    }
    return new SpreadSheet(container, dataCfg, buildOptions());
  };

  const bindEvent = () => {
    baseSpreadsheet.on(KEY_ROW_CELL_CLICK, (value) => {
      if (isFunction(onRowCellClick)) onRowCellClick(value);
    });
    baseSpreadsheet.on(KEY_COLUMN_CELL_CLICK, (value) => {
      if (isFunction(onColCellClick)) onColCellClick(value);
    });
    baseSpreadsheet.on(KEY_CORNER_CELL_CLICK, (value) => {
      if (isFunction(onCornerCellClick)) onCornerCellClick(value);
    });
    baseSpreadsheet.on(KEY_SINGLE_CELL_CLICK, (value) => {
      if (isFunction(onDataCellClick)) onDataCellClick(value);
    });
  };

  const unBindEvent = () => {
    baseSpreadsheet.off(KEY_ROW_CELL_CLICK);
    baseSpreadsheet.off(KEY_COLUMN_CELL_CLICK);
    baseSpreadsheet.off(KEY_CORNER_CELL_CLICK);
    baseSpreadsheet.off(KEY_SINGLE_CELL_CLICK);
  };

  const buildSpreadSheet = () => {
    if (!baseSpreadsheet) {
      baseSpreadsheet = getSpreadSheet();
      bindEvent();
      const newDataCfg = safetyDataConfig(dataCfg);
      baseSpreadsheet.setDataCfg(newDataCfg);
      setOptions(baseSpreadsheet);
      baseSpreadsheet.setTheme(theme);
      baseSpreadsheet.render();
      setLoading(false);
      setOwnSpreadsheet(baseSpreadsheet);
      if (getSpreadsheet) getSpreadsheet(baseSpreadsheet);
    }
  };

  const debounceResize = debounce((e: Event) => {
    setResizeTimeStamp(e.timeStamp);
  }, 200);

  useEffect(() => {
    buildSpreadSheet();
    // 监听窗口变化
    if (adaptive) window.addEventListener('resize', debounceResize);
    return () => {
      unBindEvent();
      baseSpreadsheet.destroy();
      if (adaptive) window.removeEventListener('resize', debounceResize);
    };
  }, []);

  useEffect(() => {
    if (!container || !ownSpreadsheet) return;

    const style = getComputedStyle(container);

    const box = {
      width: parseInt(style.getPropertyValue('width').replace('px', ''), 10),
      height: parseInt(style.getPropertyValue('height').replace('px', ''), 10),
    };

    ownSpreadsheet.changeSize(box?.width, box?.height);
    ownSpreadsheet.render(false);
  }, [resizeTimeStamp]);

  useEffect(() => {
    update(setDataCfg, setOptions);
  }, [dataCfg]);

  useEffect(() => {
    update(setOptions);
  }, [options]);

  useEffect(() => {
    update(() => {
      ownSpreadsheet.setTheme(theme);
    });
  }, [JSON.stringify(theme)]);

  useEffect(() => {
    if (!ownSpreadsheet) return;
    buildSpreadSheet();
  }, [spreadsheet]);

  return (
    <Spin spinning={isLoading === undefined ? loading : isLoading}>
      {header && <Header {...header} sheet={ownSpreadsheet} />}
      <div
        ref={(e: HTMLDivElement) => {
          container = e;
        }}
      />
    </Spin>
  );
};
