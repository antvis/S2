---
title: 行列宽高调整
order: 3
tag: New
---

<img src="https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*WdvmQ5pd4BwAAAAAAAAAAAAADmJ7AQ/original" alt="preview" width="600" />

S2 默认提供 [`行列等宽`](/examples/layout/basic#adaptive), [`列等宽`](/examples/layout/basic#colAdaptive), [`紧凑`](/examples/layout/basic#compact) 三种布局方式，**也可以拖拽行/列头的单元格进行行列宽高动态调整**.

### 基本使用

可配置 `resize` 控制需要开启的单元格宽高调整热区范围，分为 `角头`，`行头`，`列头` 三个部分，默认为**全部开启**。可以通过设置 `boolean` 类型值快捷开启或关闭所有 `resize` 热区，也可以通过对象类型配置各个区域的热区开启或关闭。[查看示例](/examples/interaction/advanced#resize-active)

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

除了 `rowCellVertical`, `cornerCellHorizontal`, `colCellHorizontal`, `colCellVertical` 便捷的区域热区控制外，还支持 `resize.visible` 动态控制热区是否展示。[查看示例](/examples/interaction/basic#resize)

#### 例：只有前 4 个单元格显示 resize 热区

```ts
const s2Options = {
  interaction: {
    resize: {
      visible: (cell) => {
        const meta = cell.getMeta();
        return meta.colIndex < 3
      }
    }
  },
};
```

#### 例：只有某一个单元格系那是 resize 热区

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

#### 例：不允许调小单元格宽度

```ts
const s2Options = {
  interaction: {
    resize: {
      disable: (resizeInfo) => resizeInfo.resizedWidth <= resizeInfo.width;
    }
  },
};
```
