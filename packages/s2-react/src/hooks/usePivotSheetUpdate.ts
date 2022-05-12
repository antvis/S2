import { flatMap } from 'lodash';
import { useCallback } from 'react';
import { PartDrillDown } from '../';
import { usePrevious } from './usePrevious';
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
  const prePartDrillDown = usePrevious(partDrillDown);

  const depArry = flatMap(
    DRILL_DOWN_ATTR_TO_DIFF.map((attr) => [
      partDrillDown?.[attr],
      prePartDrillDown?.[attr],
    ]),
  );

  return useCallback<SheetUpdateCallback>((renderOptions) => {
    /** 对应属性，新老值有改变，则以 reload 方式 render */
    const shouldReloadData = !!DRILL_DOWN_ATTR_TO_DIFF.find(
      (attr) => !Object.is(partDrillDown?.[attr], prePartDrillDown?.[attr]),
    );

    return {
      reloadData: shouldReloadData || renderOptions.reloadData,
      reBuildDataSet: renderOptions.reBuildDataSet,
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, depArry);
};
