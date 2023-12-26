---
title: 链接跳转
order: 3
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

```ts
import { S2Event } from '@antv/s2'

s2.on(S2Event.GLOBAL_LINK_FIELD_JUMP, (data) => {
  const { key, record } = data;
  ...
});
```

## 透视表

支持将行头 `rows`, （数值 `values` <Badge type="success">@antv/s2@^1.44.0 新增</Badge>) 标记为链接样式，`columns` 暂不支持

```ts
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
    linkFields: ['province', 'city', 'price'],
  }
};

const s2 = new PivotSheet(container, s2DataConfig, s2Options);

s2.on(S2Event.GLOBAL_LINK_FIELD_JUMP, (data) => {
  const { key, record } = data;
  const value = record[key]
  // 拼装自己的跳转地址
  location.href = `https://path/to/${key}=${value}}`;
});

await s2.render();
```

<Playground path='interaction/advanced/demo/pivot-link-jump.ts' rid='container' height='400'></playground>

## 明细表

支持将行头 `columns` 标记为链接样式

```ts
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
  const { key, record } = data;
  const value = record[key]
  // 拼装自己的跳转地址
  location.href = `https://path/to/${key}=${value}}`;
});

await s2.render();
```

<Playground path='interaction/advanced/demo/table-link-jump.ts' rid='container2' height='400'></playground>
