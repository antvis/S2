---
title: S2 2.0 升级指南
order: 9
tag: New
---

本文档将帮助你从 S2 `1.x` 版本升级到 S2 `2.x` 版本。

## 官网地址变化

:::warning{title="注意"}
原官网 <https://s2.antv.vision> 和 <https://antv-s2.gitee.io> 不再维护和使用，请使用最新的文档，已确保您看到的不是过时的文档。
:::

- 原 `v1` 官网迁移至 <https://s2-v1.antv.antgroup.com>.
- 原 <https://s2.antv.antgroup.com> 将作为 `v2` 默认官网。

## npm dist-tag 变化

> 什么是 [dist-tag](https://docs.npmjs.com/adding-dist-tags-to-packages/) ?

:::warning{title="注意"}

`S2 2.0` 版本目前处于**内测阶段**, 部分 API 可能会随时改动。

`npm` 的 [`dist-tag`](https://docs.npmjs.com/cli/v10/commands/npm-dist-tag) 对应关系如下：

- `@antv/s2@next` 对应 `2.x` 版本
- `@antv/s2@latest` 对应 `1.x` 版本

在 `@antv/s2@next` 版本稳定后，`latest` 将默认指向 `2.x` 版本。

:::

## 不兼容的变化

TODO:

### 底层渲染引擎升级为 `AntV/G` 5.0

TODO:

### xxx

## API 调整

TODO:

## 多版本共存

> 该部分文档参考 <https://ant-design.antgroup.com/docs/react/migration-v5-cn>

### 通过别名安装 v2

```bash
$ npm install --save @antv/s2-v2@npm:@antv/s2-v2@2
# or
$ yarn add @antv/s2-v2@npm:@antv/s2-v2@2
# or
$ pnpm add @antv/s2-v2@npm:@antv/s2-v2@2
```

对应的 package.json 为：

```json
{
  "@antv/s2": "1.x",
  "@antv/s2-v2": "npm:@antv/s2-v2@2"
}
```

现在，你项目中的 `S2` 还是 `v1` 版本，`@antv/s2-v2` 是 `v2` 版本。

```ts
import { PivotSheet as  PivotSheetV1 } from '@antv/s2';
import { PivotSheet as  PivotSheetV2 } from '@antv/s2-v2';

async function bootstrap(){
  const container = document.getElementById('container');

  const s2V1 = new PivotSheetV1(container, s2DataConfig, s2Options);
  const s2V2 = new PivotSheetV2(container, s2DataConfig, s2Options);

  s2V1.render();
  await s2V2.render();
}

bootstrap()
```

## 遇到问题

如果您在升级过程中遇到了问题，请到 [GitHub issues](https://github.com/antvis/S2/issues/2454) 或者 [GitHub Discussions](https://github.com/antvis/S2/discussions/1933) 进行反馈。我们会尽快响应和相应改进这篇文档。
