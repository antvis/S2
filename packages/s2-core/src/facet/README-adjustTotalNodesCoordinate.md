## 小计总计节点布局逻辑

1. 计算一个 multipleMap ，表示每个 level 的汇总节点实际占据一个单元格
2. 遍历所有汇总单元格，根据 multipleMap 中的值，计算宽或高为合并多个单元格

🌰 例子：

rows: [ 省份， 城市， 类别， 子类别 ]

Total - row - grandTotalsGroupDimensions: [ 城市， 类别 ]

Total - row - subTotalsGroupDimensions: [ 子类别 ]

<img src="https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*6kU_SqAmKMkAAAAAAAAAAAAADmJ7AQ/original" width="600"  alt="row" />

### multipleMap 如何计算 - getMultipleMap 函数

行总计 multipleMap：

1. 初始化一个长度与 rows 相同的数组 [ 1, 1, 1 ,1 ]
2. 从后往前判断 !(grandTotalsGroupDimensions.includes(field))
   - 第一个判断 子类别，判断为 true（子类别不在组内），将值加到上级 [ 1, 1, 2, 0 ]
   - 第二个判断 类别，判断为 false（类别在组内），不做处理，保持 [ 1, 1, 2, 0 ]
   - 第三个判断 城市，判断为 false（城市在组内），不做处理，保持 [ 1, 1, 2, 0 ]
   - 第四个 省份，首个维度不做遍历
3. multipleMap 结果为 [ 1, 1, 2, 0 ]

行小计 multipleMap：

1. 初始化一个长度与 rows 相同的数组 [ 1, 1, 1 ,1 ]
2. 从后往前判断 !(subTotalsGroupDimensions.includes(field))
    - 第一个判断 子类别，判断为 false（子类别在组内），不做处理，保持 [ 1, 1, 1, 1 ]
    - 第二个判断 类别，判断为 true（类别不在组内），将值加到上级 [ 1, 2, 0, 1 ]
    - 第三个判断 城市，判断为 true（城市不在组内），将值加到上级 [ 3, 0, 0, 1 ]
    - 第四个 省份，首个维度不做遍历
3. multipleMap 结果为 [ 3, 0, 0, 1 ]

### multipleMap 如何使用 - adjustTotalNodesCoordinate 函数

总计的 multipleMap = [ 1, 1, 2, 0 ]

multipleMap 表示：

- row 的第一、第二个维度占据一个单元格
- 第三个维度合并两个单元格
- 第四个维度没有节点

小计的 multipleMap = [ 3, 0, 0, 1 ]

multipleMap 表示：

- 小计结点，row 的第一个维度合并三个单元格
- 小计结点的最后一个维度占据一个单元格

特殊处理：小计根节点若为 0，则改为最近上级倍数 - level 差

``` javascript
// 小计根节点若为 0，则改为最近上级倍数 - level 差
if (!multiple && isSubTotal) {
    let lowerLevelIndex = 1;

    while (multiple < 1) {
        multiple =
        multipleMap[node.level - lowerLevelIndex] - lowerLevelIndex;
        lowerLevelIndex++;
    }
}
```

当小计节点出现在第二个维度，则合并量为‘最近的上一个不为0的值’ - level 差

multipleMap = [3, 0, 0, 1]，第二维度的小计节点 的multiple 会计算为：3 - 1 = 2

即实际该小计节点实际的 multipleMap 为 [1,2,0,1]
