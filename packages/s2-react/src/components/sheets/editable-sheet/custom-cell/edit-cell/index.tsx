import {
  S2Event,
  SpreadSheet,
  TableDataCell,
  customMerge,
  type DataItem,
  type ViewMeta,
  GEvent,
} from '@antv/s2';
import { Input } from 'antd';
import { isNil, pick } from 'lodash';
import React from 'react';
import { useSpreadSheetInstance } from '../../../../../context/SpreadSheetContext';
import { useS2Event } from '../../../../../hooks';
import {
  invokeComponent,
  type InvokeComponentProps,
} from '../../../../../utils/invokeComponent';
import './index.less';

export interface CustomEditComponentProps {
  style: React.CSSProperties;
  onChange: (value: string) => void;
  onSave: () => void;
  value: DataItem;
  spreadsheet: SpreadSheet;
  cell: TableDataCell | null;
}

type DateCellEdit = (meta: ViewMeta, cell: TableDataCell) => void;

type EditCellProps = {
  onDataCellEditStart?: DateCellEdit;
  onDataCellEditEnd?: DateCellEdit;
  trigger?: number;
  CustomComponent?: React.FunctionComponent<CustomEditComponentProps>;
};

function EditCellComponent(
  props: InvokeComponentProps<{ cell: TableDataCell } & EditCellProps>,
) {
  const { params, resolver } = props;
  const s2 = useSpreadSheetInstance();
  const { cell, onDataCellEditStart, onDataCellEditEnd, CustomComponent } =
    params;

  const { left, top, width, height } = React.useMemo<Partial<DOMRect>>(() => {
    const rect = s2.getCanvasElement()?.getBoundingClientRect();

    return {
      left: window.scrollX + rect.left,
      top: window.scrollY + rect.top,
      width: rect.width,
      height: rect.height,
    };
  }, [s2]);

  const {
    x: cellLeft,
    y: cellTop,
    width: cellWidth,
    height: cellHeight,
  } = React.useMemo(() => {
    const scroll = s2.facet.getScrollOffset();
    const cellMeta = pick(cell?.getMeta(), ['x', 'y', 'width', 'height']);

    if (isNil(cellMeta.x) || isNil(cellMeta.y)) {
      return {
        x: 0,
        y: 0,
        width: 0,
        height: 0,
      };
    }

    const sampleColNode = s2.facet.getColNodes()[0];
    const sampleColNodeHeight = sampleColNode?.height || 0;

    cellMeta.x -= scroll.scrollX || 0;
    cellMeta.y -= (scroll.scrollY || 0) - sampleColNodeHeight;

    return cellMeta;
  }, [cell, s2]);

  const [inputVal, setInputVal] = React.useState(() => cell!.getFieldValue());

  const inputRef = React.useRef<HTMLInputElement>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);

  const onSave = () => {
    const { rowIndex, valueField, id } = cell!.getMeta();
    const displayData = s2.dataSet.getDisplayDataSet();

    displayData[rowIndex][valueField] = inputVal;
    // 编辑后的值作为格式化后的结果, formatter 不再触发, 避免二次格式化
    s2.dataSet.displayFormattedValueMap?.set(id, inputVal);
    s2.render();

    const editedMeta = customMerge<ViewMeta>(cell!.getMeta(), {
      fieldValue: inputVal,
      data: {
        [valueField]: inputVal,
      },
    });

    onDataCellEditEnd?.(editedMeta, cell!);
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

  const onChangeValue = React.useCallback((val: string) => {
    setInputVal(val);
  }, []);

  const onChange = React.useCallback<
    React.ChangeEventHandler<HTMLTextAreaElement>
  >(
    (e) => {
      onChangeValue(e.target.value);
    },
    [onChangeValue],
  );

  React.useEffect(() => {
    onDataCellEditStart?.(cell!.getMeta() as ViewMeta, cell!);
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
          cell={cell!}
          spreadsheet={s2}
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
          onChange={onChange}
          onBlur={onSave}
          onKeyDown={onKeyDown}
          onFocus={onFocus}
        />
      )}
    </div>
  );
}

export const EditCell: React.FC<EditCellProps> = React.memo((props) => {
  const { CustomComponent } = props;
  const s2 = useSpreadSheetInstance();

  const onEditCell = React.useCallback(
    (event: GEvent) => {
      invokeComponent({
        component: EditCellComponent,
        params: {
          cell: s2.getCell(event.target) as TableDataCell,
          CustomComponent,
        },
        s2,
      });
    },
    [CustomComponent, s2],
  );

  useS2Event(S2Event.DATA_CELL_DOUBLE_CLICK, onEditCell, s2);

  return null;
});

EditCell.displayName = 'EditCell';
