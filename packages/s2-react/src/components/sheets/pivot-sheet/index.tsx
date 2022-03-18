import { isEmpty } from 'lodash';
import React from 'react';
import {
  SpreadSheet,
  getTooltipOptions,
  HeaderActionIcon,
  GEvent,
} from '@antv/s2';
import { useLatest } from 'ahooks';
import { BaseSheet } from '../base-sheet';
import { DrillDown } from '@/components/drill-down';
import { SheetComponentsProps } from '@/components/sheets/interface';

import { handleDrillDown, handleDrillDownIcon } from '@/utils';

export const PivotSheet: React.FC<SheetComponentsProps> = React.memo(
  (props) => {
    const { dataCfg, partDrillDown, options } = props;
    // 记录 headerIcons 中的 下钻 icon
    const drillDownIconRef = React.useRef<HeaderActionIcon>();

    // 一些 props 的 latest ref
    const latestPropsRef = useLatest(props);
    const drillConfigRef = useLatest(partDrillDown?.drillConfig);
    const rowFieldsRef = useLatest(dataCfg.fields.rows);
    const fetchDataRef = useLatest(partDrillDown?.fetchData);
    const drillItemsNumRef = useLatest(partDrillDown?.drillItemsNum);

    const s2Ref = React.useRef<SpreadSheet>();

    const [drillFields, setDrillFields] = React.useState<string[]>([]);

    const onDrillDownIconClick = (
      sheetInstance: SpreadSheet,
      cacheDrillFields?: string[],
      disabledFields?: string[],
      event?: GEvent,
    ) => {
      const content = (
        <DrillDown
          {...drillConfigRef.current}
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
    };

    const updateDrillDownOptions = (
      sheetProps: SheetComponentsProps = latestPropsRef.current,
    ) => {
      const drillDownOptions = handleDrillDownIcon(
        sheetProps,
        s2Ref.current,
        onDrillDownIconClick,
        drillDownIconRef,
      );
      s2Ref.current.setOptions(drillDownOptions);
    };

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
        clearDrillDownInfo(s2Ref.current.store.get('drillDownNode')?.id);
      } else {
        handleDrillDown({
          rows: rowFieldsRef.current,
          drillFields: drillFields,
          fetchData: fetchDataRef.current,
          drillItemsNum: drillItemsNumRef.current,
          spreadsheet: s2Ref.current,
        });
      }
      updateDrillDownOptions();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [drillFields]);

    React.useEffect(() => {
      if (isEmpty(partDrillDown?.clearDrillDown)) {
        return;
      }
      clearDrillDownInfo(partDrillDown?.clearDrillDown?.rowId);
    }, [partDrillDown?.clearDrillDown]);

    /**
     * 表格重渲染 effect
     */
    React.useEffect(() => {
      updateDrillDownOptions();
      s2Ref.current.render();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
      partDrillDown?.drillConfig,
      partDrillDown?.displayCondition,
      partDrillDown?.drillItemsNum,
      options.hierarchyType,
    ]);

    return <BaseSheet {...props} ref={s2Ref} />;
  },
);

PivotSheet.displayName = 'PivotSheet';
