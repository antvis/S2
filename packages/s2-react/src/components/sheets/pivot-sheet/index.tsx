import { Event as GEvent } from '@antv/g-canvas';
import { isEmpty } from 'lodash';
import React from 'react';
import { SpreadSheet, getTooltipOptions } from '@antv/s2';
import { BaseSheet } from '../base-sheet';
import { DrillDown } from '@/components/drill-down';
import { SheetComponentsProps } from '@/components/sheets/interface';

import { handleDrillDown, handleDrillDownIcon } from '@/utils';

export const PivotSheet: React.FC<SheetComponentsProps> = React.memo(
  (props) => {
    const { dataCfg, partDrillDown } = props;

    const s2Ref = React.useRef<SpreadSheet>();

    const [drillFields, setDrillFields] = React.useState<string[]>([]);

    const onDrillDownIconClick = React.useCallback(
      (
        sheetInstance: SpreadSheet,
        cacheDrillFields?: string[],
        disabledFields?: string[],
        event?: GEvent,
      ) => {
        const content = (
          <DrillDown
            {...partDrillDown?.drillConfig}
            setDrillFields={setDrillFields}
            drillFields={cacheDrillFields}
            disabledFields={disabledFields}
          />
        );

        if (event) {
          const { showTooltip } = getTooltipOptions(sheetInstance, event);
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
      [partDrillDown?.drillConfig],
    );

    const updateDrillDownOptions = React.useCallback(
      (sheetProps: SheetComponentsProps = props) => {
        if (partDrillDown) {
          const drillDownOptions = handleDrillDownIcon(
            sheetProps,
            s2Ref.current,
            onDrillDownIconClick,
          );
          s2Ref.current.setOptions(drillDownOptions);
        }
      },
      [onDrillDownIconClick, partDrillDown, props, s2Ref],
    );

    /**
     * 清空下钻信息
     * @param rowId 不传表示全部清空
     */
    const clearDrillDownInfo = React.useCallback(
      (rowId?: string) => {
        s2Ref.current?.clearDrillDownData(rowId);
      },
      [s2Ref],
    );

    React.useEffect(() => {
      s2Ref.current?.hideTooltip();
      if (isEmpty(drillFields)) {
        clearDrillDownInfo(s2Ref.current.store.get('drillDownNode')?.id);
      } else {
        // TODO 下钻整体流程梳理
        // setLoading(true);
        handleDrillDown({
          rows: dataCfg.fields.rows,
          drillFields: drillFields,
          fetchData: partDrillDown?.fetchData,
          drillItemsNum: partDrillDown?.drillItemsNum,
          spreadsheet: s2Ref.current,
        });
      }
      updateDrillDownOptions();
    }, [
      clearDrillDownInfo,
      dataCfg.fields.rows,
      drillFields,
      partDrillDown,
      s2Ref,
      updateDrillDownOptions,
    ]);

    React.useEffect(() => {
      if (isEmpty(partDrillDown?.clearDrillDown)) {
        return;
      }
      clearDrillDownInfo(partDrillDown?.clearDrillDown?.rowId);
    }, [clearDrillDownInfo, partDrillDown?.clearDrillDown]);

    React.useEffect(() => {
      if (!partDrillDown?.drillItemsNum) {
        return;
      }
      clearDrillDownInfo();
    }, [clearDrillDownInfo, partDrillDown?.drillItemsNum]);

    React.useEffect(() => {
      updateDrillDownOptions();
      s2Ref.current.render();
    }, [partDrillDown, s2Ref, updateDrillDownOptions]);

    return <BaseSheet {...props} ref={s2Ref} />;
  },
);

PivotSheet.displayName = 'PivotSheet';
