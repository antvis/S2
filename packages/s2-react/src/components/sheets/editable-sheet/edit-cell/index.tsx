import type { Event as CanvasEvent } from '@antv/g-canvas';
import {
  S2Event,
  SpreadSheet,
  customMerge,
  type DataType,
  type S2CellType,
  type TableDataCell,
  type ViewMeta,
} from '@antv/s2';
import { Input } from 'antd';
import { pick } from 'lodash';
import React from 'react';
import { useS2Event } from '../../../../hooks';
import { useSpreadSheetRef } from '../../../../utils/SpreadSheetContext';
import {
  invokeComponent,
  type InvokeComponentProps,
} from '../../../../utils/invokeComponent';
import './index.less';

export interface CustomProps {
  style: React.CSSProperties;
  onChange: (value: string) => void;
  onSave: () => void;
  value: string;
  spreadsheet: SpreadSheet;
  cell: S2CellType;
}

type DateCellEdit = (meta: ViewMeta, cell: TableDataCell) => void;

type EditCellProps = {
  /**
   * @deprecated use `onDataCellEditEnd` instead.
   */
  onChange?: (data: DataType[]) => void;
  onDataCellEditStart?: DateCellEdit;
  onDataCellEditEnd?: DateCellEdit;
  trigger?: number;
  CustomComponent?: React.FunctionComponent<CustomProps>;
};

function EditCellComponent(
  props: InvokeComponentProps<{ event: CanvasEvent } & EditCellProps>,
) {
  const { params, resolver } = props;
  const spreadsheet = useSpreadSheetRef();
  const {
    event,
    onChange,
    onDataCellEditStart,
    onDataCellEditEnd,
    CustomComponent,
  } = params;

  const cell = spreadsheet.getCell<TableDataCell>(event.target);
  const { left, top, width, height } = React.useMemo<Partial<DOMRect>>(() => {
    const rect = spreadsheet.getCanvasElement()?.getBoundingClientRect();

    return {
      left: window.scrollX + rect.left,
      top: window.scrollY + rect.top,
      width: rect.width,
      height: rect.height,
    };
  }, [spreadsheet]);

  const {
    x: cellLeft,
    y: cellTop,
    width: cellWidth,
    height: cellHeight,
  } = React.useMemo(() => {
    const scroll = spreadsheet.facet.getScrollOffset();
    const cellMeta = pick(cell.getMeta(), ['x', 'y', 'width', 'height']);

    cellMeta.x -= scroll.scrollX || 0;
    cellMeta.y -=
      (scroll.scrollY || 0) -
      (spreadsheet.getColumnNodes()[0] || { height: 0 }).height;

    return cellMeta;
  }, [cell, spreadsheet]);

  const [inputVal, setInputVal] = React.useState(() => cell.getFieldValue());

  const inputRef = React.useRef<HTMLInputElement>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);

  const onSave = () => {
    const { rowIndex, valueField, id } = cell.getMeta();
    const displayData = spreadsheet.dataSet.getDisplayDataSet();
    displayData[rowIndex][valueField] = inputVal;
    // 编辑后的值作为格式化后的结果, formatter 不再触发, 避免二次格式化
    spreadsheet.dataSet.displayFormattedValueMap.set(id, inputVal);
    spreadsheet.render();

    const editedMeta = customMerge(cell.getMeta(), {
      fieldValue: inputVal,
      data: {
        [valueField]: inputVal,
      },
    });

    onDataCellEditEnd?.(editedMeta, cell);
    onChange?.(displayData);
    resolver(true);
  };

  const onKeyDown: React.KeyboardEventHandler<HTMLTextAreaElement> = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      onSave();
    }
  };

  // 让输入框聚焦时光标在文字的末尾
  const onFocus: React.FocusEventHandler<HTMLTextAreaElement> = (e) => {
    e.target.selectionStart = e.target.value.length;
    e.target.selectionEnd = e.target.value.length;
  };

  const styleProps = React.useMemo<React.CSSProperties>(() => {
    return {
      left: cellLeft,
      top: cellTop,
      width: cellWidth,
      height: cellHeight,
      zIndex: 1000,
    };
  }, []);

  const onChangeValue = (val: string) => {
    setInputVal(val);
  };

  React.useEffect(() => {
    onDataCellEditStart?.(cell.getMeta(), cell);
    setTimeout(() => {
      // 防止触发表格全选
      containerRef.current?.click();
      // 开启 preventScroll, 防止页面有滚动条时触发滚动
      inputRef.current?.focus({ preventScroll: true });
    });
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        zIndex: 500,
        position: 'absolute',
        overflow: 'hidden',
        left,
        top,
        width,
        height,
      }}
    >
      {CustomComponent ? (
        <CustomComponent
          cell={cell}
          spreadsheet={spreadsheet}
          value={inputVal as string}
          style={styleProps}
          onChange={onChangeValue}
          onSave={onSave}
        />
      ) : (
        <Input.TextArea
          required
          style={styleProps}
          className={'s2-edit-cell'}
          value={inputVal as string}
          ref={inputRef}
          onChange={(e) => {
            setInputVal(e.target.value);
          }}
          onBlur={onSave}
          onKeyDown={onKeyDown}
          onFocus={onFocus}
        />
      )}
    </div>
  );
}

export const EditCell: React.FC<EditCellProps> = React.memo((props) => {
  const spreadsheet = useSpreadSheetRef();

  const cb = React.useCallback(
    (event: CanvasEvent) => {
      invokeComponent(EditCellComponent, { ...props, event }, spreadsheet);
    },
    [spreadsheet],
  );

  useS2Event(S2Event.DATA_CELL_DOUBLE_CLICK, cb, spreadsheet);

  return null;
});

EditCell.displayName = 'EditCell';
