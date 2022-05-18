import { useRef } from 'react';
import { useCallback } from 'react';
import { PartDrillDown } from '../';
import { SheetUpdateCallback } from './useSpreadSheet';

/**
 * 触发 render 的下钻属性
 */
const DRILL_DOWN_ATTR_TO_DIFF = [
  'drillConfig',
  'displayCondition',
  'drillItemsNum',
];

/**
 * 获取交叉表 update callback
 * @param partDrillDown 下钻参数
 * @returns update callback
 */
export const usePivotSheetUpdate = (partDrillDown: PartDrillDown) => {
  const prePartDrillDownRef = useRef(partDrillDown);

  /** 属性值发生变化时，才更新 callback，触发底表 render */
  const callbackDeps = DRILL_DOWN_ATTR_TO_DIFF.map(
    (attr) => partDrillDown?.[attr],
  );

  return useCallback<SheetUpdateCallback>((renderOptions) => {
    const prePartDrillDown = prePartDrillDownRef.current;

    /** 对应属性的新老值有改变，则以 reload 方式 render */
    const shouldReloadData = !!DRILL_DOWN_ATTR_TO_DIFF.find(
      (attr) => !Object.is(partDrillDown?.[attr], prePartDrillDown?.[attr]),
    );

    // 更新.current，防止一直返回同一个 shouldReloadData
    prePartDrillDownRef.current = partDrillDown;

    return {
      reloadData: shouldReloadData || renderOptions.reloadData,
      reBuildDataSet: renderOptions.reBuildDataSet,
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, callbackDeps);
};
