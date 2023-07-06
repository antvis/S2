import { isEmpty, isObject } from 'lodash';
import React from 'react';
import { SpreadSheet, getTooltipOptions } from '@antv/s2';
import { useLatest } from 'ahooks';
import {
  buildDrillDownOptions,
  handleDrillDown,
  type ActionIconCallback,
} from '@antv/s2-shared';
import { BaseSheet } from '../base-sheet';
import { usePivotSheetUpdate } from '../../../hooks';
import { DrillDown } from '../../drill-down';
import type { SheetComponentOptions, SheetComponentsProps } from '../interface';

export const PivotSheet: React.FC<SheetComponentsProps> = React.memo(
  (props) => {
    const { options: pivotOptions, ...restProps } = props;
    const { dataCfg, partDrillDown } = restProps;

    const s2Ref = React.useRef<SpreadSheet | null>(null);
    const [drillFields, setDrillFields] = React.useState<string[]>([]);

    const onDrillDownIconClick = useLatest<ActionIconCallback>(
      ({ sheetInstance, cacheDrillFields, disabledFields, event }) => {
        const content = (
          <DrillDown
            {...partDrillDown?.drillConfig}
            setDrillFields={setDrillFields}
            drillFields={cacheDrillFields}
            disabledFields={disabledFields}
          />
        );

        if (event) {
          const { enable: showTooltip } = getTooltipOptions(
            sheetInstance,
            event,
          )!;

          if (!showTooltip) {
            return;
          }

          sheetInstance.showTooltip<React.ReactNode>({
            position: {
              x: event.clientX,
              y: event.clientY,
            },
            content,
          });
        }
      },
    );

    /** 基于 props.options 来构造新的 options 传递给 base-sheet */
    const options = React.useMemo(
      () =>
        buildDrillDownOptions<SheetComponentOptions>(
          pivotOptions!,
          partDrillDown!,
          (params) => onDrillDownIconClick.current(params),
        ),
      [pivotOptions, partDrillDown, onDrillDownIconClick],
    );

    /**
     * 清空下钻信息
     * @param rowId 不传表示全部清空
     */
    const clearDrillDownInfo = (rowId?: string) => {
      s2Ref.current?.clearDrillDownData(rowId);
    };

    /**
     * 加载或清除下钻数据
     * 仅由 drillFields 驱动
     */
    React.useEffect(() => {
      s2Ref.current?.hideTooltip();
      if (isEmpty(drillFields)) {
        clearDrillDownInfo(s2Ref.current?.store.get('drillDownNode')?.id);
      } else {
        // 执行下钻
        handleDrillDown({
          rows: dataCfg.fields.rows as string[],
          drillFields,
          fetchData: partDrillDown?.fetchData,
          drillItemsNum: partDrillDown?.drillItemsNum,
          spreadsheet: s2Ref.current!,
        });
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [drillFields]);

    React.useEffect(() => {
      if (!isObject(partDrillDown?.clearDrillDown)) {
        return;
      }

      clearDrillDownInfo(partDrillDown?.clearDrillDown?.rowId);
    }, [partDrillDown?.clearDrillDown]);

    /**
     * 控制交叉表 render
     */
    const onSheetUpdate = usePivotSheetUpdate(partDrillDown!);

    return (
      <BaseSheet
        {...restProps}
        options={options}
        onSheetUpdate={onSheetUpdate}
        ref={s2Ref}
      />
    );
  },
);

PivotSheet.displayName = 'PivotSheet';
