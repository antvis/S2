---
title: Link Jump
order: 3
---

Mark the cell text as an underlined link style to achieve link jumps 🔗, there are subtle differences between pivot tables and schedule tables

<img src="https://gw.alipayobjects.com/mdn/rms_56cbb2/afts/img/A*1VD9RY8cxLcAAAAAAAAAAAAAARQnAQ" width="600" alt="preview">

## tag link field

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

Use `S2Event.GLOBAL_LINK_FIELD_JUMP` listen for link clicks

```ts
import { S2Event } from '@antv/s2'

s2.on(S2Event.GLOBAL_LINK_FIELD_JUMP, (data) => {
  const { key, record } = data;
  ...
});
```

## pivot table

Support to mark row header `rows` as link style, `columns` and `values` are invalid

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
    linkFields: ['province', 'city'],
  }
};

const s2 = new PivotSheet(container, s2DataConfig, s2Options);

s2.on(S2Event.GLOBAL_LINK_FIELD_JUMP, (data) => {
  const { key, record } = data;
  const value = record[key]
  // 拼装自己的跳转地址
  location.href = `https://path/to/${key}=${value}}`;
});

s2.render();
```

<Playground path="interaction/advanced/demo/pivot-link-jump.ts" rid="container" height="400"></Playground>

## list

Support to mark row header `columns` as link style

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

s2.render();
```

<Playground path="interaction/advanced/demo/table-link-jump.ts" rid="container2" height="400"></Playground>
