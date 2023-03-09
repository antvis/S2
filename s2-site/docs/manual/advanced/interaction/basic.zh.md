---
title: 基础交互
order: 0
---

## 交互种类

表格常见的交互主要通过键盘和鼠标

- 鼠标点击 (click)
- 鼠标悬停 (hover)
- 键盘按下/弹起 (keydown / keyup)
- ...

通过这些事件，排列组合，来实现常用的交互，
以 `刷选` 为例，它由三个事件组成

- `mousedown` => `mousemove` => `mouseup`

## 内置交互

| 名称         | 事件名     | 描述   |
|-------------|-----------|--------|
| 单选         | `S2Event.GLOBAL_SELECTED`                                     | 单击单元格，弹出 tooltip, 展示对应单元格的信息，再次单击取消选中                                                                                 |
| 多选         | `S2Event.GLOBAL_SELECTED`                                     | 单选单元格后，按住 `Command / Ctrl` 键，继续单选                                                                                     |
| 行/列头快捷多选   | `S2Event.GLOBAL_SELECTED`                                     | 单击行/列头，选中对应行/列头所有单元格 （含不在可视范围内的）, 再次单击取消选中                                                                            |
| 行/列头手动调整宽高 | `S2Event.LAYOUT_RESIZE`                                       | 鼠标悬浮在行/列头单元格边缘，出现指示条和光标，按住鼠标左键拖动，调整宽高                                                                                 |
| 刷选         | `S2Event.DATA_CELL_BRUSH_SELECTION` `S2Event.GLOBAL_SELECTED` |  批量选中刷选范围内的数值单元格，刷选过程中，显示刷选范围提示蒙层，刷选完成后，弹出 tooltip, 展示被刷选单元格信息和数量                              |
| 行头刷选       | `S2Event.ROW_CELL_BRUSH_SELECTION` `S2Event.GLOBAL_SELECTED`  | 批量选中刷选范围内的行头单元格，刷选过程中，显示刷选范围提示蒙层，刷选完成后，弹出 tooltip, 展示被刷选单元格信息（仅支持透视表）          |
| 列头刷选       | `S2Event.COL_CELL_BRUSH_SELECTION`  `S2Event.GLOBAL_SELECTED` | 批量选中刷选范围内的列头单元格，刷选过程中，显示刷选范围提示蒙层，刷选完成后，弹出 tooltip, 展示被刷选单元格信息（仅支持透视表）              |
| 区间快捷多选     | `S2Event.GLOBAL_SELECTED`                                     | 单选单元格 (start), 然后按住 `Shift` 再次选中一个单元格 (end), 选中两个单元格区间所有单元格                                                           |
| 悬停         | `S2Event.GLOBAL_HOVER`                                        | 鼠标悬停时，对应单元格高亮展示，如果是数值单元格，则默认 [十字高亮](/docs/manual/advanced/interaction/basic#行列联动高亮)，可设置 `hoverHighlight: false` 关闭 |
| 复制         | `S2Event.GLOBAL_COPIED`                                       | 复制选中的单元格数据                                                                                                            |
| 隐藏列头       | `S2Event.LAYOUT_COLS_EXPANDED` `S2Event.LAYOUT_COLS_HIDDEN`   | 隐藏/展开 列头                                                                                                              |
| 链接跳转       | `S2Event.GLOBAL_LINK_FIELD_JUMP`                              | 行头/列头 链接跳转                                                                                                            |
| 重置         | `S2Event.GLOBAL_RESET`                                        | 再次点击，点击空白处，或按下 `Esc` 取消选中的单元格                                                                                         |
| 移动高亮单元格    | `S2Event.GLOBAL_SELECTED`                                     | 点击数值单元格后，使用键盘方向键即可移动当前高亮单元格                                                                                           |

## 交互事件

[查看完整事件列表](/docs/api/general/S2Event)

- `global:xx`: 全局图表事件
- `layout:xx`: 布局改变事件
- `cell:xx`:  单元格级别的事件，整个表格分为不同的单元格类型，你可以对特定的单元格进行事件监听，实现自定义需求

```ts
import { ColCell, DataCell, PivotSheet, RowCell, S2Event } from '@antv/s2';

const s2 = new PivotSheet(container, s2DataConfig, s2Options);

s2.on(S2Event.DATA_CELL_BRUSH_SELECTION, (cells: DataCell[]) => {
  // 此事件默认打开，配置 options: { interaction: { brushSelection : { data: true } } } 开启数值单元格刷选
  console.log('刷选的单元格', cells)
})

s2.on(S2Event.ROW_BRUSH_SELECTION, (cells: RowCell[]) => {
  // 此事件默认关闭，配置 options: { interaction: { brushSelection : { data: true } } } 开启数值行头单元格刷选
  console.log('刷选的行头单元格：', cells)
})

s2.on(S2Event.COL_BRUSH_SELECTION, (cells: ColCell[]) => {
  // 此事件默认关闭，配置 options: { interaction: { brushSelection : { data: true } } } 开启数值列头单元格刷选
  console.log('刷选的列头单元格：', cells)
})

s2.on(S2Event.COL_CELL_HOVER, (event) => {
  ...
})

s2.on(S2Event.GLOBAL_KEYBOARD_DOWN, (event) => {
  ...
})
```

如果使用的是 `@antv/s2-react` 或 `@antv/s2-vue`, 可以拿到 [S2 表格实例](/docs/manual/advanced/get-instance/) 后对所需事件进行监听，和 `@antv/s2` **使用方式完全一致** .

```ts
import { S2Event, SpreadSheet } from '@antv/s2'
import { SheetComponent } from '@antv/s2-react';

function App() {
  const s2Ref = React.useRef<SpreadSheet>();

  const onSheetMounted = () => {
    s2Ref.current?.on(S2Event.DATA_CELL_CLICK, (event) => {
      console.log('onDataCellClick: ', event)
    })
  }

  return <SheetComponent ref={s2Ref} onMounted={onSheetMounted}/>
}

```

同时 `React`, `Vue3` 版本提供了事件的隐射，也可以方便的使用更符合使用习惯的 `onDataCellClick`, `@dataCellClick` 的方式 ([查看所有 API](/docs/api/components/sheet-component))

> React

```tsx
import { SheetComponent } from '@antv/s2-react';

const onDataCellClick = () => {}

<SheetComponent onDataCellClick={onDataCellClick} />
```

> Vue

```tsx
import { SheetComponent } from '@antv/s2-vue';

const onDataCellClick = () => {}

<SheetComponent @dataCellClick={onDataCellClick} />
```

对于全局图表事件，底层通过浏览器的 [EventTarget.addEventListener()](https://developer.mozilla.org/zh-CN/docs/Web/API/EventTarget/addEventListener) API 实现，如需配置其第三个可选参数，可通过 `eventListenerOptions` 进行透传，从而控制事件从 `冒泡阶段` 还是 `捕获阶段` 触发，或者只触发一次等配置。

```ts
const s2Options = {
  interaction: {
    eventListenerOptions: {
      capture: true,
    }
  }
}

// 等价于
window.addEventListener('mouseup', () => {}, {
  capture: true,
})

window.addEventListener('mouseup', () => {}, true)
```

## 交互相关配置

[查看具体 API 配置详情](/docs/api/basic-class/interaction#interaction)

```ts
const s2Options = {
  interaction: {
    ...
  }
}
```

## 内置交互

> 如何修改交互默认样式？请查看 [主题配置](/docs/manual/basic/theme) 章节

### 单选高亮

<img src="https://gw.alipayobjects.com/zos/antfincdn/0lw2grIHZN/click.gif" width="600" alt="preview" />

在选中单元格后，如果需要置灰未选中的单元格，强调需要关注的数据，默认关闭，可配置 `selectedCellsSpotlight` 开启：

```ts
const s2Options = {
  interaction: {
    selectedCellsSpotlight: true, // 默认 false
  }
};
```

### 行列联动高亮

在鼠标悬停时，高亮当前单元格和对应的行列头单元格，形成一个"十字高亮"的效果，更直观的查看数据，默认开启，可配置 `hoverHighlight` 关闭：

<img src="https://gw.alipayobjects.com/zos/antfincdn/l23NpRrPmF/hover.gif" alt="preview" width="600" />

```ts
const s2Options = {
  interaction: {
    hoverHighlight: false // 默认 true
  }
};
```

### 单选后行列头高亮

在鼠标选中单元格或刷选选中单元格时，高亮当前单元格对应的行列头单元格，利于快速定位单元格所在行列。默认关闭，可配置 `selectedCellHighlight` 开启：

<img src="https://gw.alipayobjects.com/mdn/rms_28a65c/afts/img/A*bqsoRpdz8mgAAAAAAAAAAAAAARQnAQ" alt="preview" width="600" />

```ts
// selectedCellHighlight 的类型为  boolean | { rowHeader: boolean, colHeader: boolean, rowCells: boolean, colCells: boolean }
// 当 selectedCellHighlight 为 boolean 时
const s2Options = {
  interaction: {
    selectedCellHighlight: true // 默认 false， 当 selectedCellsSpotlight 为 true 时，会高亮 rowHeader 和 colHeader （兼容未拓展类型前的设计）
  }
};

// 同时还可以分别配置 selectedCellHighlight 中 header 和 cells 的高亮
const s2Options = {
  interaction: {
    selectedCellHighlight: {
      rowHeader: true,  // 选中单元格时，高亮行头
      colHeader: true,  // 选中单元格时，高亮列头
      rowCells: false,  // 选中单元格时，高亮当前行
      colCells: false,  // 选中单元格时，高亮当前列
    },
  },
};
```

### 悬停聚焦

鼠标悬停在当前单元格超过 `800ms` 后，保持当前高亮，显示 `tooltip`, 聚焦于当前数据，默认开启，可配置 `hoverFocus` 关闭，也可配置 `hoverFocus.duration` 更改出现 `tooltip` 的时间间隔。如果希望 hover 后立刻出现 tooltip，可以设置 `duration` 为 0;

> 如果你实现了自定义交互，如 hover 后显示 tooltip, 推荐关闭此功能，以免出现 hover 悬停后 tooltip 被意外关闭

<img src="https://gw.alipayobjects.com/zos/antfincdn/46WvUNsfP/Kapture%2525202022-05-17%252520at%25252018.18.12.gif" alt="preview" width="600" />

```ts
const s2Options = {
  interaction: {
    hoverFocus: false // 默认 true
  }
};
```

### 圈选

圈选又叫刷选，刷选过程中，会提示预选中的单元格，并且显示半透明的刷选蒙层，支持对 `数据单元格 (dataCell)`, `行头单元格 (rowCell)`, `列头单元格 (colCell)` 进行圈选，同时支持 `滚动圈选`, 可以用来做 `统计数据总和`, `单元格个数`, `复制选定数据` 等操作，默认开启 `数据单元格`，可配置 `brushSelection` 关闭：

#### 数据单元格圈选

<img src="https://gw.alipayobjects.com/zos/antfincdn/WBFq3TzTY9/multi-select.gif" alt="preview" width="600" />

```ts
const s2Options = {
  interaction: {
    brushSelection: false
    // 等同于：
    // brushSelection:  {
    //   row: false,
    //   col: false,
    //   data: false,
    // }
  }
};
```

#### 行头单元格圈选

<img src="https://gw.alipayobjects.com/zos/antfincdn/1M9vUtedn/hangtoushuaxuan.gif" alt="preview" width="600" />

```ts
const s2Options = {
  interaction: {
    brushSelection:  {
      row: true // 默认 false
    }
  }
};
```

#### 列头单元格圈选

<img src="https://gw.alipayobjects.com/zos/antfincdn/%24DEZUiWFW/lietoushuaxuan.gif" alt="preview" width="600" />

```ts
const s2Options = {
  interaction: {
    brushSelection:  {
      col: true // 默认 false
    }
  }
};
```

#### 滚动圈选

##### 数值滚动圈选

<img src="https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*pmskQL_WvMIAAAAAAAAAAAAADmJ7AQ/original" alt="preview" width="600" />

##### 行头滚动圈选 <Badge type="success">@antv/s2@^1.42.0 新增</Badge>

<img src="https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*r8fFQ6ySwScAAAAAAAAAAAAADmJ7AQ/original" alt="preview" width="600" />

### 角头选中 <Badge type="success">@antv/s2@^1.42.0 新增</Badge>

单击行头所对应的角头，可以快捷选中当前列

<img src="https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*TNjTS7HzcgUAAAAAAAAAAAAADmJ7AQ/original" width="600" alt="preview" />

### 快捷键多选

(Command/Ctrl) + click: 单个多选叠加，再次点击选中的单元格或行列可取消选中，默认开启，可配置 `multiSelection` 关闭：

<img src="https://gw.alipayobjects.com/zos/antfincdn/XYZaL1w%24M/Kapture%2525202022-04-15%252520at%25252011.45.55.gif" width="600" alt="preview" />

Shift + click: 区间选择（类似刷选）, 默认开启，可配置 `rangeSelection` 关闭：

<img src="https://gw.alipayobjects.com/zos/antfincdn/RcIcQc7O2/Kapture%2525202022-04-15%252520at%25252011.52.52.gif" width="600" alt="preview" />

```ts
const s2Options = {
  interaction: {
    multiSelection: false, // 默认 true
    rangeSelection: false // 默认 true
  }
};
```

### 移动高亮单元格

点击数值单元格后，使用键盘方向键即可移动当前高亮单元格，默认开启，可配置 `selectedCellMove` 关闭：

<img src="https://gw.alipayobjects.com/mdn/rms_56cbb2/afts/img/A*w2M7Q7PzS3gAAAAAAAAAAAAAARQnAQ" width="600" alt="preview" />

```ts
const s2Options = {
  interaction: {
    selectedCellMove: false // 默认 true
  }
};
```

### 隐藏列头

<img src="https://gw.alipayobjects.com/zos/antfincdn/0TMss8KAY/Kapture%2525202022-02-11%252520at%25252017.52.53.gif" alt="preview" width="600" />

同时支持透视表，和明细表，点击叶子节点的列头后，显示隐藏列头按钮，点击隐藏后，会在紧邻的兄弟单元格显示一个展示按钮，和一个隐藏提示线，鼠标单击即可展开，可配置 `hiddenColumns` 实现 `默认隐藏` 和 `交互式隐藏`. 查看 [详情](/docs/manual/advanced/interaction/hide-columns/) 或 [具体例子](/examples/interaction/advanced#pivot-hide-columns)

```ts
const s2DataConfig = {
  fields: {
    columns: ['fieldA', 'fieldB']
  }
}

const s2Options = {
  interaction: {
    // 默认隐藏
    hiddenColumns: ['fieldA']
  },
  // 关闭手动隐藏
  tooltip: {
    operation: {
      hiddenColumns: false
    }
  }
};
```

### 行列宽高调整

<img src="https://gw.alipayobjects.com/zos/antfincdn/F6l3SoxBCx/resize.gif" alt="preview" width="600" />

S2 默认提供 `列等宽布局` `行列等宽布局`和 `紧凑布局` 三种布局方式 ([预览](/examples/layout/basic#compact)), 也可以拖拽行/列头进行动态调整

可配置 `resize` 控制需要开启的单元格宽高调整热区范围，分为 角头，行头，列头三个部分，默认为全部开启。可以通过设置`boolean` 类型值快捷开启或关闭所有 `resize` 热区，也可以通过对象类型配置各个区域的热区开启或关闭。[查看具体例子](/examples/interaction/advanced#resize-active)

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
//       rowCellVertical:true,
//       cornerCellHorizontal:true,
//       colCellHorizontal:true,
//       colCellVertical:true
//     }
//   },
// };
```

还可以配置 `resize.visible` 和 `resize.disable` 两个属性，分别用于控制 `resize` 热区的显示和自定义拖拽校验逻辑。[查看具体例子](/examples/interaction/advanced#resize-disable)

<img src="https://gw.alipayobjects.com/zos/antfincdn/64tnK5%263K/Kapture%2525202022-07-19%252520at%25252015.40.15.gif" alt="preview" width="600" />

> 例：不允许调小单元格宽度

```ts
const s2Options = {
  interaction: {
    resize: {
      disable: (resizeInfo) => resizeInfo.resizedWidth <= resizeInfo.width;
    }
  },
};
```

> 例：只有前 4 个单元格显示 resize 热区

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

### 合并单元格

<img src="https://gw.alipayobjects.com/zos/antfincdn/ouXuK7MMt/Kapture%2525202022-04-19%252520at%25252019.31.02.gif" alt="preview" width="600" />

查看 [详情](/docs/manual/advanced/interaction/merge-cell) 或 [具体例子](/examples/interaction/advanced#merge-cell)

### 链接跳转

<img src="https://gw.alipayobjects.com/zos/antfincdn/W0bikxI2pn/link-pivot.gif" alt="preview" width="600" />

查看 [详情](/docs/manual/advanced/interaction/link-jump) 或 [具体例子](/examples/interaction/advanced#pivot-link-jump)

### 滚动

查看 [详情](/docs/manual/advanced/interaction/scroll)

### 重置交互

<img src="https://gw.alipayobjects.com/zos/antfincdn/pTs1QZPz4/Kapture%2525202022-04-19%252520at%25252019.24.56.gif" alt="preview" width="600" />

支持重置交互的情况：

- 点击非表格空白处
- 按下 `Esc` 键
- 选中单元格后再次点击

对应事件：`GLOBAL_RESET`

```ts
s2.on(S2Event.GLOBAL_RESET, () => {
  console.log('重置')
})
```

可配置 `autoResetSheetStyle` 关闭重置交互。[查看具体例子](/examples/interaction/advanced#auto-reset-sheet-style)

```ts
const s2Options = {
  interaction: {
    autoResetSheetStyle: false
  }
};
```

## 调用 API

`S2` 内置了一些交互相关的 `API`，统一挂载在 `s2.interaction` 命名空间下，你可以在拿到 [SpreadSheet 实例](/docs/api/basic-class/spreadsheet) 后调用它们来实现你的效果，比如 `选中所有单元格`, `获取列头单元格` 等常用方法，具体请查看 [Interaction 实例类](/docs/api/basic-class/interaction)

```ts
const s2 = new PivotSheet()
s2.interaction.selectAll()
```

对背后的交互实现原理感兴趣？欢迎阅读文章 [《你不知道的 Canvas 表格交互》](https://www.yuque.com/antv/vo4vyz/bvzbaz)
