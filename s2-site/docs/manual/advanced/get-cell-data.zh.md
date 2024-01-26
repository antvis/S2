---
title: 获取单元格数据
order: 9
tag: Updated
---

:::warning{title='提示'}
阅读本章前，请确保已经阅读过 [基础教程](/manual/basic/base-concept)，[数据流处理](/manual/advanced/data-process/pivot)，[布局](/manual/advanced/layout/pivot) 等章节。
:::

在实际的业务场景中，我们往往会遇到一些需要获取**单元格数据**的场景，常见的比如：

- 点击某一个行头/列头单元格，获取**当前行/列**所有数据。
- 监听鼠标 `click` `hover` 事件 获取当前对应单元格数据。
- 点击数据单元格，获取当前单元格数据，或者整行数据。
- 自定义 `tooltip` 内容，需要根据当前单元格信息来渲染不同的操作项，或者显示不同的提示信息。

`S2` 的表格使用 `Canvas` 绘制，所以只会有一个 `dom` 元素，所有单元格对应的一组**数据结构**，里面存储了每个单元格的坐标，文本信息，交互状态等 [信息](/docs/api/basic-class/base-cell)

`S2` 提供了一系列获取数据的 [API](/docs/api/basic-class/spreadsheet), 下面介绍一些常用的场景：

<Playground path="analysis/get-data/demo/get-cell-data.ts" rid='get-cell-data' height='300'></playground>

### 获取指定区域单元格节点

在渲染完成后，访问 `s2.facet.getLayoutResult()` 获取到当前所有（**含不在可视范围的**）[单元格节点](/docs/api/basic-class/node)。

一个节点 (Node) 对应一个 单元格 (Cell), 当节点在可视范围内时，会被实例化为单元格 (Cell), 可通过 `node.belongsCell` 获取

```ts
await s2.render()

// 确保在 s2.render() 之后获取
console.log(s2.facet.getLayoutResult())
```

或者

```ts
import { S2Event } from '@antv/s2'

s2.on(S2Event.LAYOUT_AFTER_RENDER, () => {
  console.log(s2.facet.getLayoutResult())
})
```

<!-- <img src="https://gw.alipayobjects.com/zos/antfincdn/sdbdaWuLk/c93a05a9-b849-4f3b-96b3-73f6c33aac88.png" width="600" alt="preview"/> -->

:::info{title="可以获取到如下信息"}

- `cornerNodes` 角头节点
- `seriesNumberNodes` 序号列节点
- `colLeafNodes` 列头叶子节点
- `colNodes` 列头节点
- `colsHierarchy` 列头层级信息
- `rowLeafNodes` 行头叶子节点
- `rowNodes` 行头节点
- `rowsHierarchy` 行头层级信息

:::

[查看更多](/docs/api/basic-class/base-facet)

:::warning{title="注意"}
由于虚拟滚动的特性，获取到为不含可视区域外的单元格。
:::

### 获取行头单元格

```ts
s2.facet.getRowCells()
s2.facet.getRowLeafCells()
```

### 获取列头单元格

```ts
s2.facet.getColCells()
s2.facet.getColLeafCells()
```

### 获取角头单元格

```ts
s2.facet.getCornerCells()
```

### 获取合并单元格

```ts
s2.facet.getMergedCells()
```

### 获取序号单元格

```ts
s2.facet.getSeriesNumberCells()
```

### 获取数值单元格

更多请查看 [interaction API](/docs/api/basic-class/interaction)

```ts
// 当前可视范围内的数值单元格
s2.facet.getDataCells()
// 当前可视范围内未选中的数值单元格
s2.interaction.getUnSelectedDataCells()
```

### 获取表头单元格 （序号，角头，行头，列头）

```ts
s2.getHeaderCells()
```

### 获取所有单元格

```ts
s2.facet.getCells()
```

### 根据单元格 field 获取指定单元格

```ts
s2.facet.getCellsByField(field)
```

### 根据单元格 id 获取指定单元格

```ts
s2.facet.getCellById(id)
```

### 根据 Event 获取对应单元格

```ts
s2.getCell(event.target)
```

### 根据单元格获取元信息

```ts
cell.getMeta()
```

### 监听点击事件获取对应单元格

以点击行头单元格为例

```ts
import { S2Event } from '@antv/s2'

s2.on(S2Event.ROW_CELL_CLICK, (event) => {
  // 根据 event.target 拿到表格内部当前坐标对应的单元格
  const cell = s2.getCell(event.target)
  // 获取当前单元格对应的信息
  const meta = cell.getMeta()
})
```

<img src="https://gw.alipayobjects.com/zos/antfincdn/%24a%24HyJBIV/79abf381-a58a-460d-ad75-096c5484c780.png" width="600" alt="preview"/>

当然，任何能拿到 `event` 的地方你都可以通过这种方式拿到数据

### 获取选中的单元格

在单选，多选，刷选等场景，在选中后会透出 `S2Event.GLOBAL_SELECTED` 事件，可以获取到选中的单元格

```ts
s2.on(S2Event.GLOBAL_SELECTED, (cells) => {
  console.log('选中的单元格', cells)
})
```

<img src="https://gw.alipayobjects.com/zos/antfincdn/GO7xii%26LQ/13b44f81-271c-4771-b7b3-45789761eab2.png" width="600" alt="preview"/>

也可以调用 [交互方法](/docs/manual/advanced/interaction/basic#%E8%B0%83%E7%94%A8%E4%BA%A4%E4%BA%92%E6%96%B9%E6%B3%95), 手动的获取

```ts
// 获取所有激活的单元格 （包含不在可视范围内的）
s2.interaction.getCells();
// 获取所有激活的单元格 （不含不在可视范围内的）
s2.interaction.getActiveCells();
// 是否是选中状态
s2.interaction.isSelectedState();
// 获取当前交互状态
s2.interaction.getCurrentStateName();
// 获取当前发生过交互的单元格
s2.interaction.getInteractedCells();
// 获取未选中的单元格
s2.interaction.getUnSelectedDataCells();
```

### 获取单个单元格数据

[查看示例](/examples/analysis/get-data/#get-single-cell-data)

```ts | pure
import { EXTRA_FIELD } from '@antv/s2'

// 获取明细单元格
s2.dataSet.getCellData({
  query: {
    province: '浙江',
    city: '杭州',
    type: '笔',
    [EXTRA_FIELD]: 'price',
  },
});

// 获取小计数据
s2.dataSet.getCellData({
  query: {
    province: '浙江',
    type: '笔',
    [EXTRA_FIELD]: 'price',
  },
  isTotals: true,
});
```

### 获取多个单元格数据

[查看示例](/examples/analysis/get-data/#get-multi-cell-data)

```ts | pure
import { EXTRA_FIELD, QueryDataType } from '@antv/s2'

// 获取所有浙江下的数据
s2.dataSet.getCellMultiData({
  query: {
    province: '浙江',
    [EXTRA_FIELD]: 'price',
  },
  queryType: QueryDataType.All,
});

// 获取所有浙江下的明细数据
s2.dataSet.getCellMultiData({
  query: {
    province: '浙江',
    [EXTRA_FIELD]: 'price',
  },
  queryType: QueryDataType.DetailOnly,
});
```

### 获取行/列数据

表格初始化时，会将用户声明的数据配置 (s2DataConfig) 转换成内部所需要的数据集 (dataSet), 具体请查看 [数据流处理](/docs/manual/advanced/data-process/pivot)

数据集的 [实例](/docs/api/basic-class/base-data-set) 挂载在 `s2.dataSet` 命名空间下，可访问它获取你需要的：

- 原生数据
- 汇总数据
- 多维索引数据
- 格式化后的字段名，字段描述
- 获取维值
- 单个单元格数据
- 多个单元格数据

还是以点击行头单元格为例：

```ts
s2.on(S2Event.ROW_CELL_CLICK, (event) => {
  // 首先拿到单元格当前信息
  const cell = s2.getCell(event.target)
  const meta = cell.getMeta()

  // 获取当前行数据
  const rowData = s2.dataSet.getCellMultiData({ query: meta.query })
  // 获取当前行头单元格数据：
  const rowCellData = s2.dataSet.getCellData({ query: meta.query })
  // 获取当前行头维值
  const dimensionValues = s2.dataSet.getDimensionValues(meta.field)

  console.log('当前行数据：', rowData)
  console.log('当前行头单元格数据：', rowCellData)
  console.log('当前行头维值：', dimensionValues)
})

```

<img src="https://gw.alipayobjects.com/zos/antfincdn/5KTuqpLdy/cf26a185-2a1d-41f3-9caf-aa9343529cd5.png" width="600" alt="preview"/>

### 点击数值单元格获取数据

#### 透视表

```ts
s2.on(S2Event.DATA_CELL_CLICK, (event) => {
  // 获取当前单元格
  const cell = s2.getCell(event.target)
  // 获取当前单元格元数据
  const meta = cell.getMeta()
  // 获取当前行数据
  const rowData = s2.dataSet.getCellMultiData({ query: meta.rowQuery })
  // 获取当前列数据
  const colData = s2.dataSet.getCellMultiData({ query: meta.colQuery })

  console.log('当前行数据', rowData)
  console.log('当前行数据', colData)
  console.log('当前单元格数据', meta.data)
  /**
    {
    "number": 834,
    "province": "浙江省",
    "city": "舟山市",
    "type": "家具",
    "sub_type": "沙发",
    "$$extra$$": "number",
    "$$value$$": 834
  }
  */
})
```

#### 明细表

```ts
s2.on(S2Event.DATA_CELL_CLICK, (event) => {
  // 获取当前单元格
  const cell = s2.getCell(event.target)
  // 获取当前单元格元数据
  const meta = cell.getMeta()
  // 获取当前行数据
  const rowData = s2.dataSet.getCellData({
    query: {
      rowIndex: meta.rowIndex
    }
  })

  console.log('当前行数据', rowData) // { province: '吉林', city: '长春', type: '笔', price: 8 }
  console.log('当前单元格数据', meta.data) // { city: '长春' }
})
```

### 获取行列对应数值单元格数据

如图，比如我们想获取舟山市下的办公用品纸张的数量

<img src="https://gw.alipayobjects.com/zos/antfincdn/jHILwaZ50/d9af2488-add9-46ec-b0da-81fc4da2b7a1.png" width="600" alt="preview" />

```ts
// 找到 "舟山市" 对应的行头单元格节点
const rowCellNode = s2.facet.getRowNodes().find((node) => node.id === 'root[&]浙江省[&]舟山市')
// 找到 "办公用品" 下 "纸张" 对应的 "数量"列头单元格节点
const colCellNode = s2.facet.getColNodes().find((node) => node.id === 'root[&]办公用品[&]纸张[&]数量')

const data = s2.dataSet.getCellMultiData({
  query: {
    ...rowCellNode.query,
    ...colCellNode.query
  }
})

// 或者
const cellMeta = s2.facet.getCellMeta(
  rowCellNode?.rowIndex,
  colCellNode?.colIndex,
);

/**
  {
    "number": 1634,
    "province": "浙江省",
    "city": "舟山市",
    "type": "办公用品",
    "sub_type": "纸张",
    "$$extra$$": "number",
    "$$value$$": 1634
  }
*/
```

### 根据行列索引获取数值单元格信息

```ts
s2.facet.getCellMeta(rowIndex, colIndex)
```

### 获取隐藏列数据

[查看隐藏列头章节](/docs/manual/advanced/interaction/hide-columns/#%E8%8E%B7%E5%8F%96%E9%9A%90%E8%97%8F%E5%88%97%E5%A4%B4%E6%95%B0%E6%8D%AE)
