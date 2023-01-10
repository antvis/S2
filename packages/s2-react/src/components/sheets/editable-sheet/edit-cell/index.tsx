import React, {
  useRef,
  useState,
  useEffect,
  useMemo,
  useCallback,
} from 'react';
import { Input } from 'antd';
import {
  BaseCell,
  S2Event,
  S2_PREFIX_CLS,
  SpreadSheet,
  type ViewMeta,
  GEvent,
} from '@antv/s2';
import { isNil, pick } from 'lodash';
import { useS2Event } from '../../../../hooks';
import { useSpreadSheetRef } from '../../../../context/SpreadSheetContext';
import {
  invokeComponent,
  type InvokeComponentProps,
} from '../../../../utils/invokeComponent';
import './index.less';

export interface CustomProps {
  style: React.CSSProperties;
  onChange: (val: string) => void;
  onSave: () => void;
  value: any;
  spreadsheet: SpreadSheet;
  cell: any;
}

type onChangeProps = {
  onChange?: (val: any[]) => void;
  trigger?: number;
  CustomComponent?: React.FunctionComponent<CustomProps>;
};

const EDIT_CELL_CLASS = `${S2_PREFIX_CLS}-edit-cell`;

function EditCellComponent(
  props: InvokeComponentProps<{ event: GEvent } & onChangeProps>,
) {
  const { params, resolver } = props;
  const spreadsheet = useSpreadSheetRef();
  const { event, onChange, CustomComponent } = params;
  const cell: BaseCell<ViewMeta> | null = spreadsheet.getCell(event.target);

  const { left, top, width, height } = useMemo(() => {
    const rect = spreadsheet?.getCanvasElement().getBoundingClientRect();

    const modified = {
      left: window.scrollX + rect.left,
      top: window.scrollY + rect.top,
      width: rect.width,
      height: rect.height,
    };

    return modified;
  }, [spreadsheet]);

  const {
    x: cellLeft,
    y: cellTop,
    width: cellWidth,
    height: cellHeight,
  } = useMemo(() => {
    const scroll = spreadsheet.facet.getScrollOffset();
    const cellMeta = pick(cell?.getMeta(), ['x', 'y', 'width', 'height']);

    if (isNil(cellMeta.x) || isNil(cellMeta.y)) {
      return {
        x: 0,
        y: 0,
        width: 0,
        height: 0,
      };
    }

    cellMeta.x -= scroll.scrollX || 0;
    cellMeta.y -=
      (scroll.scrollY || 0) -
      (spreadsheet.getColumnNodes()[0] || { height: 0 }).height;

    return cellMeta;
  }, [cell, spreadsheet]);

  const [inputVal, setInputVal] = useState(cell?.getMeta()?.fieldValue);

  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setTimeout(() => {
      // 防止触发表格全选
      if (containerRef.current) {
        containerRef.current!.click();
      }

      if (inputRef.current) {
        inputRef.current!.focus();
      }
    });
  }, []);

  const onSave = () => {
    if (!cell) {
      return;
    }

    const { rowIndex, valueField } = cell.getMeta();

    spreadsheet.dataSet.originData[rowIndex][valueField] = inputVal;
    spreadsheet.render(true);

    if (onChange) {
      onChange(spreadsheet.dataSet.originData);
    }

    resolver(true);
  };

  const onKeyDown: React.KeyboardEventHandler<HTMLTextAreaElement> = (e) => {
    if (e.keyCode === 13) {
      e.preventDefault();
      onSave();
    }
  };

  const styleProps = React.useMemo(
    () => ({
      left: cellLeft,
      top: cellTop,
      width: cellWidth,
      height: cellHeight,
      zIndex: 1000,
    }),
    [],
  );

  const changeValue = (val: string) => {
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
          value={inputVal}
          style={styleProps}
          onChange={changeValue}
          onSave={onSave}
        />
      ) : (
        <Input.TextArea
          required
          style={styleProps}
          className={EDIT_CELL_CLASS}
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

function EditCell({ onChange, CustomComponent }: onChangeProps) {
  const spreadsheet = useSpreadSheetRef();

  const onEditCell = useCallback(
    (event: GEvent) => {
      invokeComponent(
        EditCellComponent,
        { event, onChange, CustomComponent },
        spreadsheet,
      );
    },
    [CustomComponent, onChange, spreadsheet],
  );

  useS2Event(S2Event.DATA_CELL_CLICK, onEditCell, spreadsheet);

  return null;
}

export { EditCell };
