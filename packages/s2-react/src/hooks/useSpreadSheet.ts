import {
  PivotSheet,
  S2Constructor,
  S2Options,
  SpreadSheet,
  TableSheet,
} from '@antv/s2';
import React from 'react';
import type { BaseSheetComponentProps, SheetType } from '../components';
import { getSheetComponentOptions } from '../utils';
import { useEvents } from './useEvents';
import { useLoading } from './useLoading';
import { usePagination } from './usePagination';
import { usePrevious } from './usePrevious';
import { useResize } from './useResize';

export interface UseSpreadSheetConfig {
  s2Options?: S2Options;
  sheetType: SheetType;
}

export function useSpreadSheet(
  props: BaseSheetComponentProps,
  config: UseSpreadSheetConfig,
) {
  const s2Ref = React.useRef<SpreadSheet>();
  const containerRef = React.useRef<HTMLDivElement>();

  const { spreadsheet: customSpreadSheet, dataCfg, options, themeCfg } = props;
  const { loading, setLoading } = useLoading(s2Ref.current, props.loading);
  const { registerEvent } = useEvents(props);
  const pagination = usePagination(s2Ref.current, props);
  const prevDataCfg = usePrevious(dataCfg);
  const prevOptions = usePrevious(options);
  const prevThemeCfg = usePrevious(themeCfg);

  const renderSpreadSheet = React.useCallback(
    (container: HTMLDivElement) => {
      const s2Options = config.s2Options || getSheetComponentOptions(options);
      const s2Constructor: S2Constructor = [container, dataCfg, s2Options];
      if (customSpreadSheet) {
        return customSpreadSheet(...s2Constructor);
      }
      if (config.sheetType === 'table') {
        return new TableSheet(container, dataCfg, s2Options);
      }
      return new PivotSheet(container, dataCfg, s2Options);
    },
    [config.s2Options, config.sheetType, options, dataCfg, customSpreadSheet],
  );

  const buildSpreadSheet = React.useCallback(() => {
    setLoading(true);
    s2Ref.current = renderSpreadSheet(containerRef.current);
    s2Ref.current.setThemeCfg(props.themeCfg);
    registerEvent(s2Ref.current);
    s2Ref.current.render();
    setLoading(false);
    props.getSpreadSheet?.(s2Ref.current);
  }, [props, registerEvent, renderSpreadSheet, setLoading]);

  // init
  React.useEffect(() => {
    buildSpreadSheet();
    return () => {
      s2Ref.current.destroy();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // dataCfg, options or theme changed
  React.useEffect(() => {
    let reloadData = false;
    let reBuildDataSet = false;
    if (!Object.is(prevDataCfg, dataCfg)) {
      reloadData = true;
      s2Ref.current?.setDataCfg(dataCfg);
    }

    if (!Object.is(prevOptions, options)) {
      if (
        !Object.is(prevOptions?.hierarchyType, options?.hierarchyType) &&
        Object.is(options?.hierarchyType, 'customTree')
      ) {
        // 自定义树目录需要重新构建 CustomTreePivotDataSet
        reBuildDataSet = true;
        reloadData = true;
        s2Ref.current?.setDataCfg(dataCfg);
      }
      s2Ref.current?.setOptions(options);
    }
    if (!Object.is(prevThemeCfg, themeCfg)) {
      s2Ref.current?.setThemeCfg(themeCfg);
    }
    s2Ref.current?.render(reloadData, reBuildDataSet);
  }, [dataCfg, options, prevDataCfg, prevOptions, prevThemeCfg, themeCfg]);

  useResize({
    s2: s2Ref.current,
    container: containerRef.current,
    adaptive: props.adaptive,
  });

  return {
    s2Ref,
    containerRef,
    loading,
    setLoading,
    pagination,
  };
}
