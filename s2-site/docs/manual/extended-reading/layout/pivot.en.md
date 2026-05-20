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
// Entrance to generate row hierarchy
buildGridHierarchy('province', ['province', 'city'], {}, new Hierarchy());

// Generate tree structure
function buildGridHierarchy({ currentField, fields, facetCfg, hierarchy }) { // currentField is province
    const fieldValues = dataSet.getDimensionValues(currentField); // ['Zhejiang']
    generateHeaderNodes({ // Generate hierarchy under Zhejiang
        currentField, fields, facetCfg, hierarchy,
        fieldValues // ['Zhejiang']
    });
}

// Generate hierarchy under current field, e.g. [Hangzhou, Shaoxing] under Zhejiang
function generateHeaderNodes(...args) {
    for(let fieldValue of fieldValues.entries()) { // Zhejiang
        const node = new Node({ value: fieldValue, parent: parentNode });
        hierarchy.pushIndexNode(node);
        hierarchy.sampleNodesForAllLevels.push(node);
        if (!node.isLeafNode) {
            // Generate leaf node
            buildGridHierarchy({
                parentNode: node, // Recursively generate sub-structure, if there is region, it will continue to generate [Xihu District, Yuhang District] under Hangzhou
                currentField: fields[level + 1], // The next dimension as the dimension of the next loop, e.g. first time is province, second time is city
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
    allNodesWithoutRoot: [(Node){ label: 'Zhejiang', key: 'province', ...}],
    sampleNodesForAllLevels: [(Node){ label: 'Zhejiang', key: 'province', ...}],
}
```

Then recursively call the sub-level of Zhejiang, the structure of `rowHierarchy` is as follows:

```ts
rowHierarchy: {
    height: 0,
    width: 0,
    maxLevel: 2,
    allNodesWithoutRoot: [(Node){ label: 'Zhejiang', key: 'province', ...}, (Node){ label: 'Hangzhou', key: 'city', ...}, (Node){ label: 'Shaoxing', key: 'city', ...}],
    indexNode: [(Node){ label: 'Hangzhou', key: 'city', ...}, (Node){ label: 'Shaoxing', key: 'city', ...}],
    sampleNodeForLastLevel: [(Node){ label: 'Hangzhou', key: 'city', ...}],
    sampleNodesForAllLevels: [(Node){ label: 'Zhejiang', key: 'province', ...}, (Node){ label: 'Hangzhou', key: 'city', ...}]
}
```

In the same way, the column header is also a similar process, generating `colsHierarchy` .

## level coordinates

The hierarchical structure of rows and columns is determined above, but note that the `width` and `height` of `rowHierarchy` are both 0. Next, we will determine the coordinate values of each node in the hierarchy, that is, determine their positions in the canvas.

In order to simplify the coordinate calculation process, we do not consider the tree shape and the width of the user's drag, but consider the simplest scenario.

First, calculate the width of the cell:

```ts
const cellWidth = calcCellWidth(); // Row and column cell width

// Calculate cell width
function calcCellWidth() {
    const rowHeaderColSize = rows.length; // [province, city], result is 2
    const colHeaderColSize = colLeafNodes.length; // Column leaf nodes, result is 2
    const { width } = this.getCanvasSize(); // Canvas width
    const size = Math.max(1, rowHeaderColSize + colHeaderColSize); // Sum of rows + columns, result is 4
    return Math.max(dataCell.width, canvasW / size); // Take the maximum of user configured width and calculated width
}
```

Then, calculate the dimensions of the `rowHierarchy` and the coordinates and dimensions of each child node ( `Node` ).

```ts
// Calculate rowsHierarchy width
for (const levelSample of rowsHierarchy.sampleNodesForAllLevels) {
    levelSample.width = cellWidth; // Width of sample nodes at each level
    rowsHierarchy.width += levelSample.width; // Calculate total width of rowsHierarchy
}
// Calculate node size and coordinates
let preLeafNode = Node.blankNode();
for (let i = 0; i < rowsHierarchy.getNodes().length; i++) {
    const currentNode = allNodes[i]; // Current node
    if (isLeaf) {
        // Leaf node
        currentNode.x = 0;
        currentNode.y = preLeafNode.y + preLeafNode.height;
        currentNode.height = dataCell.height + dataCell.padding?.top + dataCell.padding?.bottom;
        preLeafNode = currentNode; // Update previous leaf node
        rowsHierarchy.height += currentNode.height; // Update rowsHierarchy height
    } else {
        // Non-leaf node
        currentNode.x = preLevelSample?.x + preLevelSample?.width; // x coordinate of non-leaf node
    }
    currentNode.width = cellWidth; // Width of current node
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
    data: rowNodes // Nodes in rowNodes have coordinate and size info, call g2's <Group>RowHeader.add(<Group>RowCell)
});
this.colHeader = new ColHeader({
    width,
    height,
    data: colNodes // Same as above
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
// Dynamic on-demand rendering
function dynamicRender() {
    const indexes = this.calculateXYIndexes(scrollX, scrollY); // Calculate the set of coordinates of the current window based on scroll coordinates
    const { add, remove } = diffPanelIndexes(this.preCellIndexes, indexes); // Calculate the set of increased and decreased coordinates based on the difference between the last and current set of values

    each(add, ([i, j]) => {
        const viewMeta = this.getCellMeta(j, i);
        const cell = this.cfg.dataCell(viewMeta);
        this.addCell(cell); // Render added cells
    });
    each(remove, ([i, j]) => {
        const findOne = find(
            allCells,
            (cell) => cell.get('name') === `${i}-${j}`,
        );
        findOne?.remove(true); // Remove reduced cells
    });
    this.preCellIndexes = indexes; // Update this coordinate set to the last rendered set
}
```

Finally, scroll bars, background, etc. are rendered without too much explanation.

The above is the layout process of `S2` , including the generation process of the hierarchical structure `rowsHierarchy` and `colsHierarchy` , the coordinate calculation process of each node, and the on-demand rendering process.
