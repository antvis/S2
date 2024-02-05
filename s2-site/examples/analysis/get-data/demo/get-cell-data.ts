/* eslint-disable no-console */
import {
  EXTRA_FIELD,
  PivotSheet,
  QueryDataType,
  S2DataConfig,
  S2Event,
  S2Options,
  SpreadSheet,
} from '@antv/s2';
import insertCSS from 'insert-css';

// 了解更多请阅读文档: https://s2.antv.antgroup.com/manual/advanced/get-cell-data

function addButton(text, handler) {
  const btn = document.createElement('button');

  btn.className = 'ant-btn ant-btn-default';
  btn.innerHTML = text;

  btn.addEventListener('click', () => {
    handler?.();
  });

  document.querySelector('#container > canvas')?.before(btn);
}

function logLayoutResult(s2: SpreadSheet) {
  console.log('布局信息:', s2.facet.getLayoutResult());
  console.log(
    '序号单元格和节点:',
    s2.facet.getSeriesNumberCells(),
    s2.facet.getSeriesNumberNodes(),
  );
  console.log(
    '角头单元格和节点:',
    s2.facet.getCornerCells(),
    s2.facet.getCornerNodes(),
  );
  console.log(
    '行头单元格和节点:',
    s2.facet.getRowCells(),
    s2.facet.getRowNodes(),
  );
  console.log(
    '列头单元格和节点:',
    s2.facet.getColCells(),
    s2.facet.getColNodes(),
  );
  console.log('数值单元格:', s2.facet.getDataCells());
  console.log('表头单元格:', s2.facet.getHeaderCells());
  console.log('行头总计节点:', s2.facet.getRowGrandTotalsNodes());
  console.log('行头小计节点:', s2.facet.getRowSubTotalsNodes());
  console.log('列头总计节点:', s2.facet.getRowGrandTotalsNodes());
  console.log('列头小计节点:', s2.facet.getRowSubTotalsNodes());
  console.log('当前可视范围内所有单元格:', s2.facet.getCells());
}

function logEvent(s2: SpreadSheet) {
  s2.on(S2Event.ROW_CELL_CLICK, (event) => {
    // 根据 event.target 拿到表格内部当前坐标对应的单元格
    const cell = s2.getCell(event.target);
    // 获取当前单元格对应的信息
    const meta = cell.getMeta();

    const rowData = s2.dataSet.getCellMultiData({ query: meta.query });
    const rowCellData = s2.dataSet.getCellData({ query: meta.query });
    const dimensionValues = s2.dataSet.getDimensionValues(meta.field);

    console.log('当前行数据：', rowData);
    console.log('当前行头单元格数据：', rowCellData);
    console.log('当前行头维值：', dimensionValues);
    console.log('当前行头单元格信息:', cell, meta);
  });

  s2.on(S2Event.COL_CELL_CLICK, (event) => {
    const cell = s2.getCell(event.target);
    const meta = cell.getMeta();

    const colData = s2.dataSet.getCellMultiData({ query: meta.query });
    const colCellData = s2.dataSet.getCellData({ query: meta.query });
    const dimensionValues = s2.dataSet.getDimensionValues(meta.field);

    console.log('当前列数据：', colData);
    console.log('当前列头单元格数据：', colCellData);
    console.log('当前列头维值：', dimensionValues);
    console.log('当前列头单元格信息:', cell, meta);
  });

  s2.on(S2Event.DATA_CELL_CLICK, (event) => {
    const cell = s2.getCell(event.target);
    const meta = cell.getMeta();

    // 获取当前行数据
    const rowData = s2.dataSet.getCellMultiData({ query: meta.rowQuery });
    // 获取当前列数据
    const colData = s2.dataSet.getCellMultiData({ query: meta.colQuery });

    console.log('当前行数据', rowData);
    console.log('当前行数据', colData);
    console.log('当前单元格数据', meta.data);
    console.log('当前数值单元格信息:', cell, meta);
  });

  s2.on(S2Event.GLOBAL_SELECTED, (cells) => {
    console.log('选中的单元格', cells);
  });
}

// 获取行列对应数值单元格数据
function logData(s2: SpreadSheet) {
  // 找到 "舟山市" 对应的行头单元格节点
  const rowCellNode = s2.facet
    .getRowNodes()
    .find((node) => node.id === 'root[&]浙江省[&]舟山市');

  // 找到 "办公用品" 下 "纸张" 对应的 "数量"列头单元格节点
  const colCellNode = s2.facet
    .getColNodes()
    .find((node) => node.id === 'root[&]纸张[&]价格');

  const data = s2.dataSet.getCellMultiData({
    query: {
      ...rowCellNode?.query,
      ...colCellNode?.query,
      [EXTRA_FIELD]: 'price',
    },
    queryType: QueryDataType.DetailOnly,
    // queryType: QueryDataType.All,
  });

  const cellMeta = s2.facet.getCellMeta(
    rowCellNode?.rowIndex,
    colCellNode?.colIndex,
  );

  console.log(data, cellMeta);
}

// 获取 [杭州] 对应的整行明细数据
function logRowData(s2: SpreadSheet) {
  const rowCellNode = s2.facet
    .getRowNodes()
    .find((node) => node.id === 'root[&]浙江省[&]杭州');

  const data = s2.dataSet.getCellMultiData({
    query: { ...rowCellNode?.query, [EXTRA_FIELD]: 'price' },
    queryType: QueryDataType.DetailOnly,
    // queryType: QueryDataType.All,
  });

  console.log('rowData:', data);
}

// 获取 [纸张] 对应的整列明细数据
function logColData(s2: SpreadSheet) {
  const colCellNode = s2.facet
    .getColNodes()
    .find((node) => node.id === 'root[&]纸张[&]价格');

  const data = s2.dataSet.getCellMultiData({
    query: { ...colCellNode?.query, [EXTRA_FIELD]: 'price' },
    queryType: QueryDataType.DetailOnly,
    // queryType: QueryDataType.All,
  });

  console.log('colData:', data);
}

function logCellMeta(s2: SpreadSheet) {
  const rowIndex = 1;
  const colIndex = 2;
  const cellMeta = s2.facet.getCellMeta(rowIndex, colIndex);

  console.log('cellMeta:', cellMeta);
}

function logInteractionData(s2: SpreadSheet) {
  // 获取所有激活的单元格 （包含不在可视范围内的）
  console.log(s2.interaction.getCells());
  // 获取所有激活的单元格 （不含不在可视范围内的）
  console.log(s2.interaction.getActiveCells());
  // 是否是选中状态
  console.log(s2.interaction.isSelectedState());
  // 获取当前交互状态
  console.log(s2.interaction.getCurrentStateName());
  // 获取当前发生过交互的单元格
  console.log(s2.interaction.getInteractedCells());
  // 获取未选中的单元格
  console.log(s2.interaction.getUnSelectedDataCells());
}

fetch(
  'https://gw.alipayobjects.com/os/bmw-prod/4347c2dd-6554-451b-9d44-15b04e5de657.json',
)
  .then((res) => res.json())
  .then(async (data) => {
    const container = document.getElementById('container');
    const s2DataConfig: S2DataConfig = {
      fields: {
        rows: ['province', 'city'],
        columns: ['type'],
        values: ['price'],
      },
      meta: [
        {
          field: 'province',
          name: '省份',
        },
        {
          field: 'city',
          name: '城市',
        },
        {
          field: 'type',
          name: '商品类别',
        },
        {
          field: 'price',
          name: '价格',
        },
      ],
      data,
    };

    const s2Options: S2Options = {
      width: 600,
      height: 480,
      seriesNumber: {
        enable: true
      },
      interaction: {
        selectedCellsSpotlight: true,
        hoverHighlight: true,
        copy: { enable: true },
      },
      // 配置小计总计显示
      totals: {
        row: {
          showGrandTotals: true,
          showSubTotals: true,
          reverseGrandTotalsLayout: true,
          reverseSubTotalsLayout: true,
          subTotalsDimensions: ['province'],
        },
        col: {
          showGrandTotals: true,
          showSubTotals: true,
          reverseGrandTotalsLayout: true,
          reverseSubTotalsLayout: true,
          subTotalsDimensions: ['type'],
        },
      },
    };

    const s2 = new PivotSheet(container, s2DataConfig, s2Options);

    await s2.render();

    logEvent(s2);

    addButton('获取布局信息', () => {
      logLayoutResult(s2);
    });

    addButton('获取行列对应数值单元格数据', () => {
      logData(s2);
    });

    addButton('根据行列索引获取数值单元格信息', () => {
      logCellMeta(s2);
    });

    addButton('获取整行数据', () => {
      logRowData(s2);
    });

    addButton('获取整列数据', () => {
      logColData(s2);
    });

    addButton('获取交互信息', () => {
      logInteractionData(s2);
    });
  });

insertCSS(`
  #container > canvas {
    margin-top: 10px;
  }
`);
