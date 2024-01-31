---
title: Pivot
order: 1
---

This article will introduce the layout process of the pivot table, so that readers can more directly understand the internal layout logic of `S2` .

In the process of parsing the layout, the following pivot table is taken as an example:

<img src="https://gw.alipayobjects.com/mdn/rms_56cbb2/afts/img/A*J2fuRIJnQdgAAAAAAAAAAAAAARQnAQ" alt="s2-data-process-demo" width="600">

## basic concept

### node

Pivot table node class, used for row header, column header, and corner header cell rendering.

```ts
class Node {
    x, y, width, height, label, level, ...
}
```

### Hierarchy

Pivot table hierarchy, manage all nodes of row header and column header.

```ts
class Hierarchy {
    width, height, sampleNodesForAllLevels, allNodesWithoutRoot, indexNode,
    getLeaves: () => {},
    getNodes: () => {},
    getIndexNodes: () => {},
    pushNode: () => {}
}
```

## hierarchical structure

The process of generating the row-column hierarchy is also the process of traversing the row-column configuration. The following takes the row header hierarchy as an example.

```ts
// 生成行层级结构入口
buildGridHierarchy('province', ['province', 'city'], {}, new Hierarchy());

// 生成树状结构
function buildGridHierarchy({ currentField, fields, facetCfg, hierarchy }) { // currentField 为 province
    const fieldValues = dataSet.getDimensionValues(currentField); // ['浙江省']
    generateHeaderNodes({ // 生成浙江省下面的层级结构
        currentField, fields, facetCfg, hierarchy,
        fieldValues // ['浙江省']
    });
}

// 生成当前字段下面的层级结构，比如浙江省下面的 [杭州市， 绍兴市]
function generateHeaderNodes(...args) {
    for(let fieldValue of fieldValues.entries()) { // 浙江省
        const node = new Node({ value: fieldValue, parent: parentNode });
        hierarchy.pushIndexNode(node);
        hierarchy.sampleNodesForAllLevels.push(node);
        if (!node.isLeafNode) {
            // 生成叶子节点
            buildGridHierarchy({
                parentNode: node, // 递归生成子结构，如果还有 region, 会继续生成杭州市下面的 [西湖区，余杭区]
                currentField: fields[level + 1], // 下一个维度作为下个循环的维度，比如第一次是 province，第二次是 city
                hierarchy,
                fields,
                facetCfg,
            });
        }
    }
}
```

After the first layer structure is executed, the structure of `rowHierarchy` is as follows:

```ts
rowHierarchy: {
    height: 0,
    width: 0,
    maxLevel: 1,
    allNodesWithoutRoot: [(Node){ label: '浙江省', key: 'province', ...}],
    sampleNodesForAllLevels: [(Node){ label: '浙江省', key: 'province', ...}],
}
```

Then recursively call the sub-level of Zhejiang Province, the structure of `rowHierarchy` is as follows:

```ts
rowHierarchy: {
    height: 0,
    width: 0,
    maxLevel: 2,
    allNodesWithoutRoot: [(Node){ label: '浙江省', key: 'province', ...}, (Node){ label: '杭州市', key: 'city', ...}, (Node){ label: '绍兴市', key: 'city', ...}],
    indexNode: [(Node){ label: '杭州市', key: 'city', ...}, (Node){ label: '绍兴市', key: 'city', ...}],
    sampleNodeForLastLevel: [(Node){ label: '杭州市', key: 'city', ...}],
    sampleNodesForAllLevels: [(Node){ label: '浙江省', key: 'province', ...}, (Node){ label: '杭州市', key: 'city', ...}]
}
```

In the same way, the column header is also a similar process, generating `colsHierarchy` .

## level coordinates

The hierarchical structure of rows and columns is determined above, but note that the `width` and `height` of `rowHierarchy` are both 0. Next, we will determine the coordinate values of each node in the hierarchy, that is, determine their positions in the canvas.

In order to simplify the coordinate calculation process, we do not consider the tree shape and the width of the user's drag, but consider the simplest scenario.

First, calculate the width of the cell:

```ts
const cellWidth = calcCellWidth(); // 行、列 单元格宽度

// 计算单元格宽度
function calcCellWidth() {
    const rowHeaderColSize = rows.length; // [province, city]，结果是 2
    const colHeaderColSize = colLeafNodes.length; // 列叶子节点，结果是 2
    const { width } = this.getCanvasSize(); // 画布宽度
    const size = Math.max(1, rowHeaderColSize + colHeaderColSize); // 行+列 总数量，结果是 4
    return Math.max(dataCell.width, canvasW / size); // 用户配置的宽度和计算宽度取最大值
}
```

Then, calculate the dimensions of the `rowHierarchy` and the coordinates and dimensions of each child node ( `Node` ).

```ts
// 计算 rowsHierarchy 宽度
for (const levelSample of rowsHierarchy.sampleNodesForAllLevels) {
    levelSample.width = cellWidth; // 各层级样例节点的宽度
    rowsHierarchy.width += levelSample.width; // 计算 rowsHierarchy 总宽度
}
// 计算节点的尺寸和坐标
let preLeafNode = Node.blankNode();
for (let i = 0; i < rowsHierarchy.getNodes().length; i++) {
    const currentNode = allNodes[i]; // 当前节点
    if (isLeaf) {
        // 叶子节点
        currentNode.x = 0;
        currentNode.y = preLeafNode.y + preLeafNode.height;
        currentNode.height = dataCell.height + dataCell.padding?.top + dataCell.padding?.bottom;
        preLeafNode = currentNode; // 更改前一个叶子节点
        rowsHierarchy.height += currentNode.height; // 更新 rowsHierarchy 高度
    } else {
        // 非叶子节点
        currentNode.x = preLevelSample?.x + preLevelSample?.width; // 非叶子节点的 x 坐标
    }
    currentNode.width = cellWidth; // 当前节点的宽度
}
```

Similarly, we can also calculate the size of `colsHierarchy` and the size and coordinates of each child node.

## Render on demand

Above, we have generated the hierarchy and the coordinates of each child node. Next, we start rendering the nodes.

First render row headers, column headers, and corner headers:

```ts
this.rowHeader = new RowHeader({
    width,
    height,
    data: rowNodes // rowNodes 中的节点有坐标和尺寸信息，调用 g2 的 <Group>RowHeader.add(<Group>RowCell)
});
this.colHeader = new ColHeader({
    width,
    height,
    data: colNodes // 同上
});
this.cornerHeader = new CornerHeader({
    data: cornerNodes,
    width: cornerWidth,
    height: cornerHeight,
});
this.foregroundGroup.add([this.rowHeader, this.colHeader, this.cornerHeader]);
```

Second render the cell:

```ts
// 动态按需渲染
function dynamicRender() {
    const indexes = this.calculateXYIndexes(scrollX, scrollY); // 根据滚动坐标计算当前视窗的坐标集合
    const { add, remove } = diffPanelIndexes(this.preCellIndexes, indexes); // 根据上次和这次坐标集合差值计算增加和减少的坐标集合

    each(add, ([i, j]) => {
        const viewMeta = this.getCellMeta(j, i);
        const cell = this.cfg.dataCell(viewMeta);
        this.addCell(cell); // 渲染增加的单元格
    });
    each(remove, ([i, j]) => {
        const findOne = find(
            allCells,
            (cell) => cell.get('name') === `${i}-${j}`,
        );
        findOne?.remove(true); // 移除减少的单元格
    });
    this.preCellIndexes = indexes; // 更新本次坐标集合为上次渲染的集合
}
```

Finally, scroll bars, background, etc. are rendered without too much explanation.

The above is the layout process of `S2` , including the generation process of the hierarchical structure `rowsHierarchy` and `colsHierarchy` , the coordinate calculation process of each node, and the on-demand rendering process.
