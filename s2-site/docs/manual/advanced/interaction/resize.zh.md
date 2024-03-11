---
title: 行列宽高调整
order: 3
tag: Updated
---

<img src="https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*WdvmQ5pd4BwAAAAAAAAAAAAADmJ7AQ/original" alt="preview" width="600" />

S2 默认提供 [`行列等宽`](/examples/layout/basic#adaptive), [`列等宽`](/examples/layout/basic#colAdaptive), [`紧凑`](/examples/layout/basic#compact) 三种布局方式，**也可以拖拽行/列头的单元格进行行列宽高动态调整**.

### 基本使用

可配置 `resize` 控制需要开启的单元格宽高调整热区范围，分为 `角头`，`行头`，`列头` 三个部分，默认为**全部开启**。可以通过设置 `boolean` 类型值快捷开启或关闭所有 `resize` 热区，也可以通过对象类型配置各个区域的热区开启或关闭。[查看示例](/examples/interaction/advanced#resize-active)

:::info{title="提示"}
调整宽高时，会关闭 tooltip 避免遮挡，但是交互状态会保留（如选中）.
:::

```ts
const s2Options = {
  interaction: {
    resize: true
  },
};

// 等价于
// const s2Options = {
//   interaction: {
//     resize: {
//       rowCellVertical: true,
//       cornerCellHorizontal: true,
//       colCellHorizontal: true,
//       colCellVertical: true
//     }
//   },
// };
```

<Playground path="interaction/basic/demo/resize.ts" rid="resize"></playground>

### 热区控制

支持配置 `rowCellVertical`, `cornerCellHorizontal`, `colCellHorizontal`, `colCellVertical` 来便捷的控制区域热区控制。

<table style="width: 100%; outline: none; border-collapse: collapse;">
  <colgroup>
    <col width="40%"/>
    <col width="60%" />
  </colgroup>
  <tbody>
    <tr>
      <td style="text-align: center;">
        rowCellVertical（行头垂直方向） - 针对行头叶子节点
      </td>
      <td>
        <img height="300" alt="default" style="max-height: unset;" src="https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*LdioQJ5NU-MAAAAAAAAAAAAADmJ7AQ/original" />
      </td>
    </tr>
    <tr>
      <td style="text-align: center;">
        cornerCellHorizontal |（角头水平方向） - 针对角头 CornerNodeType 为 Series 和 Row
      </td>
      <td>
        <img height="300" alt="colorful" style="max-height: unset;" src="https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*57S1QLpmaY8AAAAAAAAAAAAADmJ7AQ/original" />
      </td>
    </tr>
    <tr>
      <td style="text-align: center;">
        colCellHorizontal |（列头水平方向） - 针对列头叶子节点
      </td>
      <td>
        <img height="300" alt="gray" style="max-height: unset;" src="https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*Zni8Ro69STkAAAAAAAAAAAAADmJ7AQ/original" />
      </td>
    </tr>
    <tr>
      <td style="text-align: center;">
        colCellVertical |（列头垂直方向） - 针对列头各层级节点
      </td>
      <td>
        <img height="300" alt="dark" style="max-height: unset;" src="https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*qtxcR7_YAYgAAAAAAAAAAAAADmJ7AQ/original" />
      </td>
    </tr>
  </tbody>
</table>

除此之外，还支持 `resize.visible` 动态控制热区是否展示。[查看示例](/examples/interaction/basic#resize)

1. 例：只有叶子节点才显示 `resize` 热区：

```ts
const s2Options = {
  interaction: {
    resize: {
      visible: (cell) => {
        const meta = cell.getMeta();
        return meta.isLeaf
      }
    }
  },
};
```

2. 例：只有某一个单元格显示 `resize` 热区：

```ts
const s2Options = {
  interaction: {
    resize: {
      visible: (cell) => {
        const meta = cell.getMeta();
        return meta.id === 'root[&]家具[&]桌子[&]数量'
      }
    }
  },
};
```

### 拖拽禁用

配置 `resize.disable`，用于控制热区的自定义拖拽校验逻辑。[查看示例](/examples/interaction/advanced#resize-disable)

<img src="https://gw.alipayobjects.com/zos/antfincdn/64tnK5%263K/Kapture%2525202022-07-19%252520at%25252015.40.15.gif" alt="preview" width="600" />

例：不允许调小单元格宽度：

```ts
const s2Options = {
  interaction: {
    resize: {
      disable: (resizeInfo) => resizeInfo.resizedWidth <= resizeInfo.width;
    }
  },
};
```

### 拖拽影响范围

默认宽高调整只作用于当前单元格，可以通过 `rowResizeType`, `colResizeType` 配置拖拽后是影响所有行（列）, 还是当前行（列）。

- `all`: 对应单元格维度 `{ city: 20, type: 100 }`
- `current` 对应单元格 ID `{ 'root[&]杭州市': 20, 'root[&]类别': 100 }`
- `selected` 对应当前选中的单元格 ID `{ 'root[&]杭州市': 20, 'root[&]成都市': 100 }`

```ts
const s2Options = {
  interaction: {
    resize: {
      // 行高调整时，影响全部行
      rowResizeType: 'all', // 'all' | 'current' | 'selected'
      // 列宽调整时，只影响当前列
      colResizeType: 'current',
    }
  },
};
```

<table style="width: 100%; outline: none; border-collapse: collapse;">
  <colgroup>
    <col width="40%"/>
    <col width="60%" />
  </colgroup>
  <tbody>
    <tr>
      <td style="text-align: center;">
        resizeType: 'all'
      </td>
      <td>
        <img height="300" alt="default" style="max-height: unset;" src="https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*K9BHSYFdps4AAAAAAAAAAAAADmJ7AQ/original" />
      </td>
    </tr>
    <tr>
      <td style="text-align: center;">
        resizeType: 'current'
      </td>
      <td>
        <img height="300" alt="colorful" style="max-height: unset;" src="https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*aXByQbhqG7AAAAAAAAAAAAAADmJ7AQ/original" />
      </td>
    </tr>
    <tr>
      <td style="text-align: center;">
        resizeType: 'selected'
      </td>
      <td>
        <img height="300" alt="colorful" style="max-height: unset;" src="https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*HuK4SK1EKykAAAAAAAAAAAAADmJ7AQ/original" />
      </td>
    </tr>
  </tbody>
</table>

### 最小可拖拽宽高

```ts
const s2Options = {
  interaction: {
    resize: {
      // 单元格可拖拽最小宽度
      minCellWidth: 20,
      // 单元格可拖拽最小高度
      minCellHeight: 20
    }
  },
};
```

### 主题配置

支持通过调整主题修改热区大小/颜色，参考线颜色/间隔等配置，具体请查看 [主题配置](/manual/basic/theme) 章节。

<img src="https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*4fHCSaNfxvYAAAAAAAAAAAAADmJ7AQ/original" alt="preview" width="600" />

```ts
s2.setTheme({
  resizeArea: {
    // 热区大小
    size: 2,
    // 热区背景色
    background: '#396',
    // 热区背景色透明度
    backgroundOpacity: 0,
    // 拖拽参考线颜色
    guideLineColor: '#396',
    // 拖拽参考线禁用颜色
    guideLineDisableColor: 'rgba(0,0,0,0.25)',
    //  参考线间隔
    guideLineDash: [1, 6]
  },
});
```
