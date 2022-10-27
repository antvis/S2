---
title: 透视表
order: 1
---

本文会介绍透视表的布局过程，让读者更直接了解 `S2` 内部布局逻辑。

在解析布局过程中，以下图透视表为例：

<img src="https://gw.alipayobjects.com/mdn/rms_56cbb2/afts/img/A*J2fuRIJnQdgAAAAAAAAAAAAAARQnAQ" alt="s2-data-process-demo" width="600" />

## 基础概念

### Node

透视表节点类，用于行头、列头、角头单元格渲染。

```ts
class Node {
    x, y, width, height, label, level, ...
}
```

### Hierarchy

透视表层级结构，管理行头、列头的所有节点。

```ts
class Hierarchy {
    width, height, sampleNodesForAllLevels, allNodesWithoutRoot, indexNode,
    getLeaves: () => {},
    getNodes: () => {},
    getIndexNodes: () => {},
    pushNode: () => {}
}
```

## 层级结构

生成行列层级结构的过程，也是遍历行列配置的过程，下面以行头层级结构为例。

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

当第一层结构执行完后， `rowHierarchy` 的结构如下：

```ts
rowHierarchy: {
    height: 0,
    width: 0,
    maxLevel: 1,
    allNodesWithoutRoot: [(Node){ label: '浙江省', key: 'province', ...}],
    sampleNodesForAllLevels: [(Node){ label: '浙江省', key: 'province', ...}],
}
```

然后递归调用浙江省的子层级，`rowHierarchy` 的结构如下：

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

同理，列头也是类似的过程，生成 `colsHierarchy`。

## 层级坐标

上面确定了行、列的层级结构，但是注意 `rowHierarchy` 的 `width` 和 `height` 都是 0。接下来我们会确定层级中各个节点的坐标值，也就是确定他们在画布中的位置。

为了简化坐标计算过程，我们不考虑树形、用户拖拽宽度，考虑最简单的场景。

首先，计算单元格的宽度：

```ts
const cellWidth = calcCellWidth(); // 行、列 单元格宽度

// 计算单元格宽度
function calcCellWidth() {
    const rowHeaderColSize = rows.length; // [province, city]，结果是 2
    const colHeaderColSize = colLeafNodes.length; // 列叶子节点，结果是 2
    const { width } = this.getCanvasSize(); // 画布宽度
    const size = Math.max(1, rowHeaderColSize + colHeaderColSize); // 行+列 总数量，结果是 4
    return Math.max(cellCfg.width, canvasW / size); // 用户配置的宽度和计算宽度取最大值
}
```

然后，计算 `rowHierarchy` 的尺寸和各个子节点 (`Node`) 的坐标和尺寸。

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
        currentNode.height = cellCfg.height + cellCfg.padding?.top + cellCfg.padding?.bottom;
        preLeafNode = currentNode; // 更改前一个叶子节点
        rowsHierarchy.height += currentNode.height; // 更新 rowsHierarchy 高度
    } else {
        // 非叶子节点
        currentNode.x = preLevelSample?.x + preLevelSample?.width; // 非叶子节点的 x 坐标
    }
    currentNode.width = cellWidth; // 当前节点的宽度
}

```

同理，我们也可以计算出 `colsHierarchy` 的尺寸和各个子节点的尺寸和坐标。

## 按需渲染

上面，我们已经生成层级结构和各个子节点的坐标。接下来，我们开始渲染节点。

首先渲染行头、列头、角头：

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

其次渲染单元格：

```ts
// 动态按需渲染
function dynamicRender() {
    const indexes = this.calculateXYIndexes(scrollX, scrollY); // 根据滚动坐标计算当前视窗的坐标集合
    const { add, remove } = diffPanelIndexes(this.preCellIndexes, indexes); // 根据上次和这次坐标集合差值计算增加和减少的坐标集合

    each(add, ([i, j]) => {
        const viewMeta = this.layoutResult.getCellMeta(j, i);
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

最后渲染滚动条、背景等，不做过多解释。

以上就是 `S2` 的布局过程，包含了层级结构 `rowsHierarchy` 和 `colsHierarchy` 的生成过程，各个节点坐标计算过程，以及按需渲染过程。
