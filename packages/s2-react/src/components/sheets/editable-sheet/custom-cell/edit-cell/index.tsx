import {
  GEvent,
  S2Event,
  S2_PREFIX_CLS,
  SpreadSheet,
  type DataItem,
  type S2CellType,
  type ViewMeta,
  type RawData,
} from '@antv/s2';
import { Input } from 'antd';
import { isNil, merge, pick } from 'lodash';
import React, {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useSpreadSheetInstance } from '../../../../../context/SpreadSheetContext';
import { useS2Event } from '../../../../../hooks';
import {
  invokeComponent,
  type InvokeComponentProps,
} from '../../../../../utils/invokeComponent';
import './index.less';

export interface CustomProps {
  style: React.CSSProperties;
  onChange: (value: string) => void;
  onSave: () => void;
  value: DataItem;
  spreadsheet: SpreadSheet;
  cell: S2CellType | null;
}

type EditCellProps = {
  onChange?: (val: RawData[]) => void;
  onDataCellEditEnd?: (meta: ViewMeta) => void;
  trigger?: number;
  CustomComponent?: React.FunctionComponent<CustomProps>;
};

const EDIT_CELL_CLASS = `${S2_PREFIX_CLS}-edit-cell`;

function EditCellComponent(
  props: InvokeComponentProps<{ cell: S2CellType } & EditCellProps>,
) {
  const { params, resolver } = props;
  const s2 = useSpreadSheetInstance();
  const { cell, onChange, onDataCellEditEnd, CustomComponent } = params;

  const { left, top, width, height } = useMemo(() => {
    const rect = s2?.getCanvasElement().getBoundingClientRect();

    const modified = {
      left: window.scrollX + rect.left,
      top: window.scrollY + rect.top,
      width: rect.width,
      height: rect.height,
    };

    return modified;
  }, [s2]);

  const {
    x: cellLeft,
    y: cellTop,
    width: cellWidth,
    height: cellHeight,
  } = useMemo(() => {
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

  const [inputVal, setInputVal] = useState<DataItem>(
    cell?.getMeta()?.fieldValue,
  );

  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  /**
   * 在 Enter 确定输入后，会执行 onSave 逻辑，然后组件被销毁后，又会通过 blur 再执行一遍，这个时候 displayData 顺序已经变了，再执行获取的 rowIndex 是错误的
   * 本质上，还是和 invokeComponent 中在移除 dom 节点前，没有提前 unmount 组件有关（1.x 中进行了处理，2.x 中现在只对其中一个分支处理了）
   * */
  const hasSaved = useRef(false);

  useEffect(() => {
    setTimeout(() => {
      // 防止触发表格全选
      containerRef.current?.click();
      // 开启 preventScroll, 防止页面有滚动条时触发滚动
      inputRef.current?.focus({ preventScroll: true });
    });
  }, []);

  const onSave = () => {
    if (!cell || hasSaved.current) {
      return;
    }

    const { rowIndex, valueField } = cell.getMeta();
    const displayData = s2.dataSet.getDisplayDataSet();

    displayData[rowIndex][valueField] = inputVal;
    s2.render(true);

    const meta = merge(cell.getMeta(), {
      fieldValue: inputVal,
      valueField,
      data: {
        [valueField]: inputVal,
      },
    }) as ViewMeta;

    onDataCellEditEnd?.(meta);

    if (onChange) {
      onChange(displayData);
    }

    hasSaved.current = true;
    resolver(true);
  };

  const styleProps: React.CSSProperties = {
    left: cellLeft,
    top: cellTop,
    width: cellWidth,
    height: cellHeight,
    zIndex: 1000,
  };

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
          spreadsheet={s2}
          value={inputVal}
          style={styleProps}
          onChange={onChangeValue}
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
          onPressEnter={onSave}
        />
      )}
    </div>
  );
}

export const EditCell = memo(({ onChange, CustomComponent }: EditCellProps) => {
  const s2 = useSpreadSheetInstance();

  const onEditCell = useCallback(
    (event: GEvent) => {
      invokeComponent({
        component: EditCellComponent,
        params: {
          cell: s2.getCell(event.target)!,
          onChange,
          CustomComponent,
        },
        s2,
      });
    },
    [CustomComponent, onChange, s2],
  );

  useS2Event(S2Event.DATA_CELL_CLICK, onEditCell, s2);

  return null;
});

EditCell.displayName = 'EditCell';
