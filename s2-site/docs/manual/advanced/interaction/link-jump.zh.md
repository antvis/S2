---
title: 链接跳转
order: 3
tag: Updated
---

将单元格文本标记为含有下划线的链接样式，实现链接跳转 🔗, 对于透视表和明细表，有细微的区别

<img src="https://gw.alipayobjects.com/mdn/rms_56cbb2/afts/img/A*1VD9RY8cxLcAAAAAAAAAAAAAARQnAQ" width="600" alt="preview" />

## 标记链接字段

```ts
const s2DataConfig = {
  fields: {
    rows: ['province', 'city'],
    columns: ['type'],
    values: ['price'],
  },
};

const s2Options = {
  width: 600,
  height: 600,
  interaction: {
    linkFields: ['city'],
  }
};
```

使用 `S2Event.GLOBAL_LINK_FIELD_JUMP` 监听链接点击

```ts | pure
import { S2Event } from '@antv/s2'

s2.on(S2Event.GLOBAL_LINK_FIELD_JUMP, (data) => {
  const { field, meta, record } = data;
  // ...
});
```

## 透视表

支持将行头 `rows`, 列头 `columns`, 数值 `values` 标记为链接样式。[查看示例](/examples/interaction/advanced/#pivot-link-jump)

```ts | pure
import { S2Event } from '@antv/s2'

const s2DataConfig = {
  fields: {
    rows: ['province', 'city'],
    columns: ['type'],
    values: ['price'],
  },
};

const s2Options = {
  width: 600,
  height: 600,
  interaction: {
    linkFields: ['province', 'city', 'type', 'price'],
  }
};

const s2 = new PivotSheet(container, s2DataConfig, s2Options);

s2.on(S2Event.GLOBAL_LINK_FIELD_JUMP, (data) => {
  const { field, meta, record } = data;
  const value = record?.[field];

  // 拼装自己的跳转地址
  location.href = `https://path/to/${field}=${value}}`;
});

await s2.render();
```

在单指标的情况下，指标挂行头或列头，对额外多出一个虚拟行列头字段，对应 `EXTRA_FIELD`, 在这个例子中即 `数量`

```ts
import { EXTRA_FIELD } from '@antv/s2'

const s2Options = {
  width: 600,
  height: 600,
  interaction: {
    linkFields: [EXTRA_FIELD],
  }
};
```

<Playground path='interaction/advanced/demo/pivot-link-jump.ts' rid='pivot-link-jump' height='400'></playground>

## 明细表

支持将列头 `columns` 和对应的数值标记为链接样式。[查看示例](/examples/interaction/advanced/#table-link-jump)

:::warning{title="注意"}
由于明细表单列头的特殊性，为和透视表保持一致，同时兼容多列头的场景，明细表的标记会对列头和数值**同时生效**.
如希望标记只对数值生效，可以参考下文 [自定义标记](#自定义标记)
:::

```ts | pure
import { S2Event } from '@antv/s2';

const s2DataConfig = {
  fields: {
    columns: ['type', 'price', 'province', 'city'],
  },
};

const s2Options = {
  width: 600,
  height: 600,
  interaction: {
    linkFields: ['type', 'price', 'province'],
  }
};

const s2 = new TableSheet(container, s2DataConfig, s2Options);

s2.on(S2Event.GLOBAL_LINK_FIELD_JUMP, (data) => {
  const { field, meta, record } = data;
  const value = record?.[field];

  // 拼装自己的跳转地址
  location.href = `https://path/to/${field}=${value}`;
});

await s2.render();
```

<Playground path='interaction/advanced/demo/table-link-jump.ts' rid='table-link-jump' height='400'></playground>

## 自定义标记

除了配置 `行头/列头/数值` 字段外，支持根据单元格信息自定义标记，满足更多使用场景。[查看示例](/examples/interaction/advanced/#custom-link-jump)

:::warning{title="注意"}
数值和表头的单元格数据结构不同，请注意区分，`meta` 对应关系如下：

1. 数值单元格对应 [ViewMeta](/api/general/s2-options#viewmeta)
2. 表头单元格对应 [Node](/api/basic-class/node)

:::

```ts
import { Node } from '@antv/s2'

const s2Options = {
  width: 600,
  height: 600,
  interaction: {
    linkFields: (meta) => {
      // 不标记列头
      if (meta instanceof Node) {
        return false;
      }

      // 根据数值动态标记
      return meta?.fieldValue === '浙江' || meta?.fieldValue >= 10;
    }
  }
};
```

<Playground path='interaction/advanced/demo/custom-link-jump.ts' rid='custom-link-jump' height='400'></playground>
