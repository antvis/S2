---
title: 自定义交互
order: 1
---

如果内置交互未能覆盖实际的使用场景，不用担心。你可以使用 [`S2Event`](https://github.com/antvis/S2/blob/next/packages/s2-core/src/common/constant/events/basic.ts) 所提供的交互事件，进行任意排列组合，自定义交互。这里以 [**明细表双击隐藏列头**](/examples/interaction/custom#double-click-hide-columns) 的示例说明。

## 1. 自定义交互类

这是一个自定义交互类的基本格式：

继承 `BaseEvent` 拿到当前表格实例 `this.spreadsheet`, 实现 `bindEvents` 方法，结合 `this.spreadsheet` 提供的 [一系列方法](/docs/api/basic-class/spreadsheet)，自定义交互，最后表格初始化时会注册默认交互，和自定义交互。

```ts
import { BaseEvent } from '@antv/s2';

// 继承 BaseEvent, 可以拿到 this.spreadsheet
class HiddenInteraction extends BaseEvent {
  bindEvents() { }
}
```

监听 `列头` 双击事件：`S2Event.COL_CELL_DOUBLE_CLICK`

```ts
import { BaseEvent, S2Event } from '@antv/s2';

class HiddenInteraction extends BaseEvent {
  bindEvents() {
    // 列头双击时
    this.spreadsheet.on(S2Event.COL_CELL_DOUBLE_CLICK, (event) => {
      // 获取当前单元格
      const cell = this.spreadsheet.getCell(event.target);
      // 获取当前单元格元数据
      const meta = cell.getMeta();
      // 隐藏当前列
      this.spreadsheet.interaction.hideColumns([meta.field]);
    });
  }
}

```

## 2. 注册自定义交互

```ts
import { TableSheet } from '@antv/s2';

const s2Options = {
  width: 600,
  height: 300,
  interaction: {
    customInteractions: [
      {
        // 交互的唯一标识，需要保证和已有交互不冲突
        key: 'HiddenInteraction',
        interaction: HiddenInteraction,
      },
    ],
  }
};

const s2 = new TableSheet(container, s2DataConfig, s2Options);

await s2.render();
```

## 3. 多个自定义交互

当然，你可以注册任意数量的自定义交互，比如你不想让用户在表格右键时出现 浏览器默认的菜单

```ts
import { TableSheet } from '@antv/s2';

class ContextMenuInteraction extends BaseEvent {
  bindEvents() {
    this.spreadsheet.on(S2Event.GLOBAL_CONTEXT_MENU, (event) => {
      // 禁止弹出右键菜单
      event.preventDefault();
    });
  }
}

const s2Options = {
  width: 600,
  height: 300,
  interaction: {
    customInteractions: [
      {
        key: 'HiddenInteraction',
        interaction: HiddenInteraction,
      },
      {
        key: 'ContextMenuInteraction',
        interaction: ContextMenuInteraction,
      },
    ],
  }
};

const s2 = new TableSheet(container, s2DataConfig, s2Options);

await s2.render();
```

<Playground path="interaction/custom/demo/double-click-hide-columns.ts" rid="container"></playground>
