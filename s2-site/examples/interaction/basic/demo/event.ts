/* eslint-disable no-console */
import {
  PivotSheet,
  S2Options,
  S2Event,
  SpreadSheet,
  InteractionStateName,
} from '@antv/s2';

function addButtons(s2: SpreadSheet) {
  const selectAllBtn = document.createElement('button');
  const selectHeaderCellBtn = document.createElement('button');
  const selectDataCellBtn = document.createElement('button');
  const hideColumnsBtn = document.createElement('button');
  const resetBtn = document.createElement('button');

  [
    selectAllBtn,
    selectHeaderCellBtn,
    selectDataCellBtn,
    hideColumnsBtn,
    resetBtn,
  ].forEach((btn) => {
    btn.className = 'ant-btn ant-btn-default';
  });

  selectAllBtn.innerHTML = '选中全部';
  selectHeaderCellBtn.innerHTML = '选中指定行列头单元格';
  selectDataCellBtn.innerHTML = '选中指定数值单元格';
  hideColumnsBtn.innerHTML = '隐藏指定列头';
  resetBtn.innerHTML = '重置';

  // 查看更多 API: https://s2.antv.antgroup.com/api/basic-class/interaction
  selectAllBtn.addEventListener('click', () => {
    s2.interaction.selectAll();
  });

  selectHeaderCellBtn.addEventListener('click', () => {
    const rowNode = s2.facet.getRowNodeById('root[&]浙江省[&]杭州市');

    console.log(
      '🚀 ~ selectHeaderCellBtn.addEventListener ~ rowNode:',
      rowNode,
    );

    s2.interaction.selectHeaderCell({
      cell: rowNode?.belongsCell,
    });
  });

  selectDataCellBtn.addEventListener('click', () => {
    const dataCells = s2.facet
      .getDataCells()
      .slice(0, 4)
      .map((cell) => {
        const meta = cell.getMeta();

        return {
          id: meta.id,
          rowIndex: meta.rowIndex,
          colIndex: meta.colIndex,
          type: cell.cellType,
        };
      });

    console.log(
      '🚀 ~ selectDataCellBtn.addEventListener ~ dataCells:',
      dataCells,
    );

    s2.interaction.setState({
      stateName: InteractionStateName.SELECTED,
      cells: dataCells,
    });
  });

  hideColumnsBtn.addEventListener('click', () => {
    s2.interaction.hideColumns([
      'root[&]家具[&]桌子[&]数量',
      'root[&]办公用品[&]笔[&]数量',
    ]);
  });

  resetBtn.addEventListener('click', () => {
    console.log('当前状态:', s2.interaction.getState());
    console.log('当前发生过交互的单元格:', s2.interaction.getInteractedCells());
    console.log('当前激活的单元格', s2.interaction.getActiveCells());
    console.log('当前未选中的单元格:', s2.interaction.getUnSelectedDataCells());

    s2.interaction.reset();
    s2.interaction.resetState();
    s2.interaction.hideColumns([]);
  });

  const canvas = document.querySelector('#container > canvas');

  if (canvas) {
    canvas.style.marginTop = '10px';
    canvas.before(selectAllBtn);
    canvas.before(selectHeaderCellBtn);
    canvas.before(selectDataCellBtn);
    canvas.before(hideColumnsBtn);
    canvas.before(resetBtn);
  }
}

fetch(
  'https://gw.alipayobjects.com/os/bmw-prod/2a5dbbc8-d0a7-4d02-b7c9-34f6ca63cff6.json',
)
  .then((res) => res.json())
  .then(async (dataCfg) => {
    const container = document.getElementById('container');

    const s2Options: S2Options = {
      width: 600,
      height: 480,
      style: {
        rowCell: {
          width: 200,
        },
        dataCell: {
          width: 100,
          height: 100,
        },
      },
      interaction: {
        enableCopy: true,
        hoverHighlight: true,
        brushSelection: true,
        multiSelection: true,
        selectedCellHighlight: true,
        selectedCellsSpotlight: true,
        selectedCellMove: true,
        overscrollBehavior: 'none',

        /**
         * 透传底层 Event Listener 属性的可选参数对象
         * @see https://developer.mozilla.org/zh-CN/docs/Web/API/EventTarget/addEventListener
         */
        // eventListenerOptions: {
        //   once: true,
        //   capture: false,
        //   passive: true
        // }
      },
    };

    const s2 = new PivotSheet(container, dataCfg, s2Options);

    [
      S2Event.GLOBAL_SCROLL,
      S2Event.ROW_CELL_CLICK,
      S2Event.GLOBAL_SELECTED,
      S2Event.DATA_CELL_BRUSH_SELECTION,
    ].forEach((eventName) => {
      s2.on(eventName, (...args) => {
        console.log(eventName, ...args);
      });
    });

    await s2.render();

    addButtons(s2);
  });
