---
title: 获取单元格数据
order: 9
---

> 请确保已经阅读过 基础教程，数据流处理，布局等章节

在实际的业务场景中，往往会遇到一些需要获取**单元格数据**的场景，常见的比如：

- 点击某一个行头/列头单元格，获取**当前行/列**所有数据
- 监听鼠标 `click` `hover` 事件 获取当前对应单元格数据
- 自定义 `tooltip` 内容，需要根据当前单元格信息来渲染不同的操作项，或者显示不同的提示信息

`S2` 的表格由 `canvas` 绘制，所以只会有一个 `dom` 元素，所有单元格对应的一组数据结构，里面存储了每个单元格的坐标，文本信息，交互状态等 [信息](/zh/docs/api/basic-class/base-cell)

`S2` 提供了一系列获取数据的 [API](/zh/docs/api/basic-class/spreadsheet), 下面介绍一些常用的场景

### 监听点击事件获取对应单元格

以点击行头单元格为例

```ts
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

也可以调用 [交互方法](/zh/docs/manual/advanced/interaction/basic#%E8%B0%83%E7%94%A8%E4%BA%A4%E4%BA%92%E6%96%B9%E6%B3%95), 手动的获取

```ts
s2.interaction.getAllCells() // 获取所有单元格
s2.interaction.getActiveCells() // 获取所有激活的单元格
s2.interaction.isSelectedState() // 是否是选中状态
```

### 获取行/列数据

表格初始化时，会将用户声明的数据配置 (s2DataConfig) 转换成内部所需要的数据集 (dataSet), 具体请查看 [数据流处理](/zh/docs/manual/advanced/data-process/pivot)

数据集的 [实例](/zh/docs/api/basic-class/base-data-set) 挂载在 `s2.dataSet` 命名空间下，可访问它获取你需要的：

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
  const rowData = s2.dataSet.getMultiData(meta.query)
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
