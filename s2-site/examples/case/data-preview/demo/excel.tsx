import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import { SheetComponent } from '@antv/s2-react';
import '@antv/s2-react/dist/style.min.css';
import 'antd/es/checkbox/style/index.css';
import { S2DataConfig, S2Event, S2Options, SpreadSheet, TableDataCell } from '@antv/s2';
import { isEqual, pick } from 'lodash';

// 初始化配置
const initOptions: S2Options = {
  width: 600,
  height: 400,
  showSeriesNumber: true,
  tooltip: { showTooltip: false },
  interaction: { enableCopy: true, hoverHighlight: false },
  showDefaultHeaderActionIcon: false,
}

// 初始化数据
const initData = {
  fields: { columns: ['province', 'city', 'type', 'price'], },
  sortParams: [],
}

const App = ({ data }) => {
  const S2Ref = useRef<SpreadSheet>(null);
  const inputRef = useRef<HTMLInputElement>(null)
  const [value, setValue] = useState<any>('');
  const [show, setShow] = useState(false)
  const [position, setPosition] = useState({
    left: 0,
    top: 0,
    width: 0,
    height: 0,
  })
  const [options, setOptions] = useState<S2Options>(initOptions);
  const [dataCfg, setDataCfg] = useState<S2DataConfig>({ ...initData, data });
  const [cell, setCell] = useState<TableDataCell | null>(null)
  const [scroll, setScroll] = useState<{ scrollX?: number, scrollY?: number }>({
    scrollX: 0,
    scrollY: 0,
  })

  // 改变S2实际渲染内容
  const onSave = (inputVal: string) => {
    console.log(1212, inputVal);

    const spreadsheet = S2Ref.current
    if (spreadsheet && cell) {
      const { rowIndex, valueField } = cell.getMeta();
      spreadsheet.dataSet.originData[rowIndex][valueField] = inputVal;
      spreadsheet.render(true);
      setShow(false)
    }
  }

  // 绑定 S2Event.DATA_CELL_CLICK 事件，触发时先将上一个cell的值保存，然后设置当前cell
  useEffect(() => {
    const spreadsheet = S2Ref.current
    const handleClick = (e) => {
      onSave(value)
      setCell(e.target.cfg.parent)
    }
    if (spreadsheet) {
      spreadsheet.on(S2Event.DATA_CELL_CLICK, handleClick)
    }
    return () => {
      spreadsheet?.off(S2Event.DATA_CELL_CLICK, handleClick)

    }
  }, [value])

  useEffect(() => {
    const spreadsheet = S2Ref.current
    const handleScroll = (e) => {
      if (spreadsheet) {
        const newScroll = spreadsheet.facet.getScrollOffset()
        if (!isEqual(newScroll, scroll)) {
          setScroll(spreadsheet.facet.getScrollOffset())
        }
      }
    }
    if (spreadsheet) {
      spreadsheet.on(S2Event.LAYOUT_CELL_SCROLL, handleScroll)
    }
    return () => {
      spreadsheet?.off(S2Event.LAYOUT_CELL_SCROLL, handleScroll)
    }
  }, [])

  // 设置 position 和 初始值
  useEffect(() => {
    const spreadsheet = S2Ref.current
    if (spreadsheet && cell) {
      const cellMeta = pick(cell.getMeta(), ['x', 'y', 'width', 'height', 'fieldValue']);
      cellMeta.x -= scroll.scrollX || 0;
      cellMeta.y -=
        (scroll.scrollY || 0) -
        (spreadsheet.getColumnNodes()[0] || { height: 0 }).height;
      setShow(true)
      setPosition({
        left: cellMeta.x,
        top: cellMeta.y,
        width: cellMeta.width,
        height: cellMeta.height,
      })
      setValue(cellMeta.fieldValue)
    }
  }, [cell])

  // 监听滚动
  useEffect(() => {
    const spreadsheet = S2Ref.current
    if (spreadsheet && cell) {
      const cellMeta = pick(cell.getMeta(), ['x', 'y', 'width', 'height', 'fieldValue']);
      cellMeta.x -= scroll.scrollX || 0;
      cellMeta.y -=
        (scroll.scrollY || 0) -
        (spreadsheet.getColumnNodes()[0] || { height: 0 }).height;
      setPosition({
        left: cellMeta.x,
        top: cellMeta.y,
        width: cellMeta.width,
        height: cellMeta.height,
      })
    }
  }, [scroll])

  // show的时候自动focus
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [show])

  // 绑定回车键 回车的时候触发保存
  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.keyCode === 13) {
        e.preventDefault();
        console.log('value', value);
        onSave(value);
      }
    };
    if (inputRef.current) {
      inputRef.current.addEventListener('keydown', onKeyDown)
    }
    return () => {
      inputRef.current?.removeEventListener('keydown', onKeyDown)
    }
  }, [value])

  const styleProps = {
    ...position,
    position: 'absolute',
    textAlign: 'right',
    zIndex: 1000,
  }

  return (
    <div style={{ position: 'relative' }}>
      {show && <input
        ref={inputRef}
        style={styleProps as any}
        value={value}
        onChange={e => setValue(e.target.value)}
        onBlur={() => onSave(value)}
      />}
      <SheetComponent
        ref={S2Ref}
        dataCfg={dataCfg}
        options={options}
        sheetType="table"
      />
    </div>
  );
};

fetch('../data/basic-table-mode.json')
  .then((res) => res.json())
  .then((res) => {
    ReactDOM.render(<App data={res} />, document.getElementById('container'));
  });
