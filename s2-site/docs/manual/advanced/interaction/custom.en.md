---
title: Custom Interaction
order: 1
---

Don't worry if the built-in interactions fail to cover actual usage scenarios. You can use the interaction events provided by [`S2Event`](https://github.com/antvis/S2/blob/next/packages/s2-core/src/common/constant/events/basic.ts) to perform any permutation and combination to customize the interaction. Here is an example of [**double-clicking to hide the column header in the schedule**](/examples/interaction/custom#double-click-hide-columns) .

## 1. Custom interaction class

This is the basic format of a custom interaction class:

Inherit `BaseEvent` to get the current table instance `this.spreadsheet` , implement the `bindEvents` method, combine a [series of methods](/docs/api/basic-class/spreadsheet) provided by `this.spreadsheet` , and customize the interaction. Finally, the default interaction and custom interaction will be registered when the table is initialized.

```ts
import { BaseEvent } from '@antv/s2';

// 继承 BaseEvent, 可以拿到 this.spreadsheet
class HiddenInteraction extends BaseEvent {
  bindEvents() {
  }
}
```

Listen`列头`double-click event: `S2Event.COL_CELL_DOUBLE_CLICK`

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

## 2. Register custom interaction

```ts
import { TableSheet } from '@antv/s2';

const s2Options = {
  width: 600,
  height: 300,
  interaction: {
    customInteractions: [
      {
        // 交互的唯一标识，需要保证和已有交互不冲突
        key: 'MyInteraction',
        interaction: MyInteraction,
      },
    ],
  }
};
const s2 = new TableSheet(container, s2DataConfig, s2Options);

s2.render();
```

## 3. Multiple custom interactions

Of course, you can register any number of custom interactions, for example, you don't want the browser's default menu to appear when the user right-clicks the table

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
        key: 'MyInteraction',
        interaction: MyInteraction,
      },
      {
        key: 'ContextMenuInteraction',
        interaction: ContextMenuInteraction,
      },
    ],
  }
};

const s2 = new TableSheet(container, s2DataConfig, s2Options);

s2.render();
```

<Playground path="interaction/custom/demo/double-click-hide-columns.ts" rid="container"></playground>
