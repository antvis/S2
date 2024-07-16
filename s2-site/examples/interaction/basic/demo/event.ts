/* eslint-disable no-console */
import {
  InteractionStateName,
  PivotSheet,
  S2Event,
  S2Options,
  SpreadSheet,
} from '@antv/s2';
import { random } from 'lodash';

function addButtons(s2: SpreadSheet) {
  const [
    selectAllBtn,
    selectCornerCellBtn,
    selectRowCellBtn,
    selectColCellBtn,
    selectDataCellBtn,
    highlightCellBtn,
    hideColumnsBtn,
    highlightHeaderBtn,
    resetBtn,
  ] = Array.from({ length: 6 }).map(() => {
    const btn = document.createElement('button');

    btn.className = 'ant-btn ant-btn-default';

    return btn;
  });

  selectAllBtn.innerHTML = '选中全部';
  selectCornerCellBtn.innerHTML = '选中指定角头单元格';
  selectRowCellBtn.innerHTML = '选中指定行头单元格';
  selectColCellBtn.innerHTML = '选中指定列头单元格';
  selectDataCellBtn.innerHTML = '选中指定数值单元格';
  highlightCellBtn.innerHTML = '高亮指定单元格';
  hideColumnsBtn.innerHTML = '隐藏指定列头';
  highlightHeaderBtn.innerHTML = '高亮数值和对应的行列头单元格';
  resetBtn.innerHTML = '重置';

  // 查看更多 API: https://s2.antv.antgroup.com/api/basic-class/interaction
  selectAllBtn.addEventListener('click', () => {
    s2.interaction.selectAll();
  });

  selectCornerCellBtn.addEventListener('click', () => {
    const cornerCell =
      s2.facet.getCornerCells()[
        random(0, s2.facet.getCornerCells().length - 1)
      ];

    console.log('cornerCell: ', cornerCell);

    s2.interaction.selectCell(cornerCell);
  });

  selectRowCellBtn.addEventListener('click', () => {
    const rowCell =
      s2.facet.getRowCells()[random(0, s2.facet.getRowCells().length - 1)];

    console.log('rowCell: ', rowCell);

    s2.interaction.selectCell(rowCell);
  });

  selectColCellBtn.addEventListener('click', () => {
    const colCell =
      s2.facet.getColCells()[random(0, s2.facet.getColCells().length - 1)];

    console.log('colCell: ', colCell);

    s2.interaction.selectCell(colCell);
  });

  selectDataCellBtn.addEventListener('click', () => {
    const dataCell =
      s2.facet.getDataCells()[random(0, s2.facet.getDataCells().length - 1)];

    console.log('dataCell:', dataCell);

    s2.interaction.selectCell(dataCell);
  });

  highlightCellBtn.addEventListener('click', () => {
    const cell = s2.facet.getCells()[random(0, s2.facet.getCells().length - 1)];

    console.log('highlightCell:', cell);

    s2.interaction.highlightCell(cell);
  });

  hideColumnsBtn.addEventListener('click', () => {
    s2.interaction.hideColumns([
      'root[&]家具[&]桌子[&]number',
      'root[&]办公用品[&]笔[&]number',
    ]);
  });

  highlightHeaderBtn.addEventListener('click', () => {
    const dataCellViewMeta = s2.facet.getCellMeta(1, 1);

    s2.interaction.updateDataCellRelevantHeaderCells(
      dataCellViewMeta,
      InteractionStateName.HOVER,
    );

    // s2.interaction.updateDataCellRelevantRowCells(
    //   dataCellViewMeta,
    //   InteractionStateName.HOVER,
    // );

    // s2.interaction.updateDataCellRelevantColCells(
    //   dataCellViewMeta,
    //   InteractionStateName.HOVER,
    // );
  });

  resetBtn.addEventListener('click', () => {
    console.log('当前状态:', s2.interaction.getState());
    console.log('当前发生过交互的单元格:', s2.interaction.getInteractedCells());
    console.log('当前激活的单元格', s2.interaction.getActiveCells());
    console.log('当前未选中的单元格:', s2.interaction.getUnSelectedDataCells());

    s2.interaction.reset();
    // s2.interaction.resetState();
    s2.interaction.hideColumns([]);
  });

  const canvas = document.querySelector('#container > canvas');

  if (canvas) {
    canvas.style.marginTop = '10px';

    canvas.before(selectAllBtn);
    canvas.before(selectCornerCellBtn);
    canvas.before(selectRowCellBtn);
    canvas.before(selectColCellBtn);
    canvas.before(selectDataCellBtn);
    canvas.before(highlightCellBtn);
    canvas.before(hideColumnsBtn);
    canvas.before(highlightHeaderBtn);
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
          width: 80,
        },
        dataCell: {
          width: 100,
          height: 100,
        },
      },
      interaction: {
        copy: { enable: true },
        hoverHighlight: true,
        brushSelection: true,
        multiSelection: true,
        selectedCellHighlight: false,
        selectedCellsSpotlight: true,
        selectedCellMove: true,
        overscrollBehavior: 'none',
        autoResetSheetStyle: false,

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
      S2Event.COL_CELL_CLICK,
      S2Event.CORNER_CELL_CLICK,
      S2Event.DATA_CELL_CLICK,
      S2Event.GLOBAL_SELECTED,
      S2Event.DATA_CELL_BRUSH_SELECTION,
      S2Event.LAYOUT_RESIZE,
    ].forEach((eventName) => {
      s2.on(eventName, (...args) => {
        console.log(eventName, ...args);
      });
    });

    await s2.render();

    addButtons(s2);
  });
