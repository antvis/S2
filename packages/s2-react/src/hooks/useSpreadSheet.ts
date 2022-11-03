import { PivotSheet, SpreadSheet, TableSheet } from '@antv/s2';
import type { S2DataConfig, S2Options, ThemeCfg } from '@antv/s2';
import { useUpdate, useUpdateEffect } from 'ahooks';
import { identity } from 'lodash';
import React from 'react';
import type {
  SheetComponentOptions,
  SheetComponentsProps,
} from '../components';
import { getSheetComponentOptions } from '../utils';
import { useEvents } from './useEvents';
import { useLoading } from './useLoading';
import { usePagination } from './usePagination';
import { useResize } from './useResize';

export function useSpreadSheet(props: SheetComponentsProps) {
  const forceUpdate = useUpdate();
  const s2Ref = React.useRef<SpreadSheet>();
  const containerRef = React.useRef<HTMLDivElement>();
  const wrapperRef = React.useRef<HTMLDivElement>();

  const {
    spreadsheet: customSpreadSheet,
    dataCfg,
    options,
    themeCfg,
    sheetType,
    onSheetUpdate = identity,
  } = props;

  /** 保存重渲 effect 的 deps */
  const updatePrevDepsRef = React.useRef<
    [S2DataConfig, SheetComponentOptions, ThemeCfg]
  >([dataCfg, options!, themeCfg!]);

  const { loading, setLoading } = useLoading(s2Ref.current!, props.loading);
  const pagination = usePagination(s2Ref.current!, props);

  useEvents(props, s2Ref.current!);

  const renderSpreadSheet = React.useCallback(
    (container: HTMLDivElement) => {
      const s2Options = getSheetComponentOptions(options!);
      if (customSpreadSheet) {
        return customSpreadSheet(container, dataCfg, s2Options);
      }
      if (sheetType === 'table') {
        return new TableSheet(container, dataCfg, s2Options as S2Options);
      }
      return new PivotSheet(container, dataCfg, s2Options as S2Options);
    },
    [sheetType, options, dataCfg, customSpreadSheet],
  );

  const buildSpreadSheet = React.useCallback(() => {
    setLoading(true);
    s2Ref.current = renderSpreadSheet(containerRef.current!);
    s2Ref.current.setThemeCfg(props.themeCfg);
    s2Ref.current.render();
    setLoading(false);

    // 子 hooks 内使用了 s2Ref.current 作为 dep
    // forceUpdate 一下保证子 hooks 能 rerender
    forceUpdate();

    if (props.getSpreadSheet) {
      // eslint-disable-next-line no-console
      console.warn(
        '[SheetComponent] `getSpreadSheet` is deprecated. Please use `onMounted` instead.',
      );
      props.getSpreadSheet(s2Ref.current);
    }
    props.onMounted?.(s2Ref.current);
  }, [props, renderSpreadSheet, setLoading, forceUpdate]);

  // init
  React.useEffect(() => {
    buildSpreadSheet();
    return () => {
      s2Ref.current?.destroy?.();
    };
  }, []);

  // 重渲 effect：dataCfg, options or theme changed
  useUpdateEffect(() => {
    const [prevDataCfg, prevOptions, prevThemeCfg] = updatePrevDepsRef.current;
    updatePrevDepsRef.current = [dataCfg, options!, themeCfg!];

    let reloadData = false;
    let reBuildDataSet = false;
    if (!Object.is(prevDataCfg, dataCfg)) {
      // 列头变化需要重新计算初始叶子节点
      if (
        prevDataCfg?.fields?.columns?.length !==
        dataCfg?.fields?.columns?.length
      ) {
        s2Ref.current?.clearColumnLeafNodes();
      }

      reloadData = true;
      s2Ref.current?.setDataCfg(dataCfg);
    }

    if (!Object.is(prevOptions, options)) {
      if (!Object.is(prevOptions?.hierarchyType, options?.hierarchyType)) {
        // 自定义树目录需要重新构建 CustomTreePivotDataSet
        reBuildDataSet = true;
        reloadData = true;
        s2Ref.current?.setDataCfg(dataCfg);
      }
      s2Ref.current?.setOptions(options as S2Options);
      s2Ref.current?.changeSheetSize(options!.width, options!.height);
    }

    if (!Object.is(prevThemeCfg, themeCfg)) {
      s2Ref.current?.setThemeCfg(themeCfg);
    }

    /**
     * onSheetUpdate 交出控制权
     * 由传入方决定最终的 render 模式
     */
    const renderOptions = onSheetUpdate({
      reloadData,
      reBuildDataSet,
    });

    s2Ref.current?.render(renderOptions!.reloadData, {
      reBuildDataSet: renderOptions!.reBuildDataSet,
    });
  }, [dataCfg, options, themeCfg, onSheetUpdate]);

  useResize({
    s2: s2Ref.current!,
    container: containerRef.current!,
    wrapper: wrapperRef.current!,
    adaptive: props.adaptive,
  });

  return {
    s2Ref,
    containerRef,
    wrapperRef,
    loading,
    setLoading,
    pagination,
  };
}
