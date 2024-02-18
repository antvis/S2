import type { Event as CanvasEvent } from '@antv/g-canvas';
import {
  BaseCell,
  S2Event,
  SpreadSheet,
  type DataType,
  type S2CellType,
  type ViewMeta,
} from '@antv/s2';
import { Input } from 'antd';
import { merge, pick } from 'lodash';
import React, {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
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

type EditCellProps = {
  onChange?: (data: DataType[]) => void;
  onDataCellEditEnd?: (meta: ViewMeta) => void;
  trigger?: number;
  CustomComponent?: React.FunctionComponent<CustomProps>;
};

function EditCellComponent(
  props: InvokeComponentProps<{ event: CanvasEvent } & EditCellProps>,
) {
  const { params, resolver } = props;
  const spreadsheet = useSpreadSheetRef();
  const { event, onChange, onDataCellEditEnd, CustomComponent } = params;
  const cell: BaseCell<ViewMeta> = event.target.cfg.parent;

  const { left, top, width, height } = useMemo(() => {
    const rect = (
      spreadsheet?.container.cfg.container as HTMLElement
    ).getBoundingClientRect();

    const modified = {
      left: window.scrollX + rect.left,
      top: window.scrollY + rect.top,
      width: rect.width,
      height: rect.height,
    };

    return modified;
  }, [spreadsheet?.container.cfg.container]);

  const {
    x: cellLeft,
    y: cellTop,
    width: cellWidth,
    height: cellHeight,
  } = useMemo(() => {
    const scroll = spreadsheet.facet.getScrollOffset();
    const cellMeta = pick(cell.getMeta(), ['x', 'y', 'width', 'height']);

    cellMeta.x -= scroll.scrollX || 0;
    cellMeta.y -=
      (scroll.scrollY || 0) -
      (spreadsheet.getColumnNodes()[0] || { height: 0 }).height;

    return cellMeta;
  }, [cell, spreadsheet]);

  const [inputVal, setInputVal] = useState(cell.getMeta().fieldValue);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setTimeout(() => {
      // 防止触发表格全选
      containerRef.current?.click();
      // 开启 preventScroll, 防止页面有滚动条时触发滚动
      inputRef.current?.focus({ preventScroll: true });
    });
  }, []);

  const onSave = () => {
    const { rowIndex, valueField } = cell.getMeta();
    const displayData = spreadsheet.dataSet.getDisplayDataSet();
    displayData[rowIndex][valueField] = inputVal;
    spreadsheet.render(true);

    onDataCellEditEnd?.(
      merge(cell.getMeta(), {
        fieldValue: inputVal,
        data: {
          [valueField]: inputVal,
        },
      }),
    );

    onChange?.(displayData);
    resolver(true);
  };

  const onKeyDown: React.KeyboardEventHandler<HTMLTextAreaElement> = (e) => {
    if (e.keyCode === 13) {
      e.preventDefault();
      onSave();
    }
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
        />
      )}
    </div>
  );
}

export const EditCell: React.FC<EditCellProps> = memo(
  ({ onChange, onDataCellEditEnd, CustomComponent }) => {
    const spreadsheet = useSpreadSheetRef();

    const cb = useCallback(
      (event: CanvasEvent) => {
        invokeComponent(
          EditCellComponent,
          { event, onChange, onDataCellEditEnd, CustomComponent },
          spreadsheet,
        );
      },
      [spreadsheet],
    );

    useS2Event(S2Event.DATA_CELL_DOUBLE_CLICK, cb, spreadsheet);

    return null;
  },
);

EditCell.displayName = 'EditCell';
