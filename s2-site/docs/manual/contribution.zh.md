---
title: 贡献指南
order: 7
tag: Updated
---

如果你恰好看到了这篇文章，你一定是希望对这个项目贡献自己的一份力量。这是一个开源项目，我们也有繁忙的业务要做，是用自己的业余时间在维护，为爱发电，精力有限，所以有时候 issue 响应速度不是那么及时，如果你遇到了问题，或者对 Issues 和 Discussions 列表的问题感兴趣，可以直接认领并尝试修复，帮助 S2 变得更好，而不是一味的埋怨和催促，我们不是甲方乙方的关系。

## 🫡 欢迎任何形式的贡献

"我代码水平不行", "会不会受到鄙视？", "会不会不太好？", 放心，不存在的！

我们欢迎任何形式的贡献，不管是一个**错别字的修改**，还是**一次友好的建议**，不管是通过提交 [Issue](https://github.com/antvis/S2/issues/new/choose), 还是一个帅气 [pull request](https://github.com/antvis/S2/pulls), 亦或是参与 [discussions](https://github.com/antvis/S2/discussions) 的讨论。

如果你遇到了问题，或者对 [Issues](https://github.com/antvis/S2/issues) 和 [Discussions](https://github.com/antvis/S2/discussions) 列表的问题感兴趣，可以直接认领并尝试修复，帮助 S2 变得更好，期待在 [贡献者列表](https://github.com/antvis/S2/graphs/contributors) 里看见你的头像。

## ✍️ 分支管理

目前我们主要基于 `next` 分支开发，有任何修改，请基于 `next` 拉一个分支，然后通过 `PR` 的形式提交，我们集成了钉钉机器人，会第一次时间 `review` 你的 `PR`, 给与反馈。

- `master`: `1.x` 版本
- `next`: `2.x` 版本

## 🐛 提交 Bug 反馈

很抱歉又写了一些 bug, 但求友好的提交一个有意义的 bug 反馈，谁也不希望反馈的 bug 是这样：

![preview](https://gw.alipayobjects.com/zos/antfincdn/j0jUvKwT%26/dd59fe64-7108-4ad7-a544-e19d79eea890.png)

没有版本信息，没有复现步骤，没有问题描述，没有代码片段，开局一句话，内容全靠猜。

首先选择 [Bug report](https://github.com/antvis/S2/issues/new?assignees=&labels=&projects=&template=bug-report.md&title=%F0%9F%90%9B)

![preview](https://gw.alipayobjects.com/zos/antfincdn/oAnzfiVl2/9d83b3e8-b05c-4475-b736-92c45448546a.png)

按照 [Issue 模板](https://github.com/antvis/S2/tree/next/.github/ISSUE_TEMPLATE) 填写相关信息。
是的，这些步骤稍微有一些繁琐，但的确是有效且必须的，每个用户使用的场景都不同，系统环境，软件版本，又或是需要一些特定的步骤才能复现 bug, 这个时候说清楚，可以节省大家的时间！

![preview](https://gw.alipayobjects.com/zos/antfincdn/05O3p5nE5/d0d4b120-e5aa-4b51-918b-8a573f8fb794.png)

## 🙋‍♂️ Pull Request

> 示例 [PR](https://github.com/antvis/S2/pull/1652) (pr 描述参考）

1. fork 项目 并 clone 下来 （或者使用 GitHub 的 Codespaces 功能，非常方便）.
2. 安装依赖：`pnpm install` 或者 `pnpm bootstrap` 然后本地启动项目。
3. 提交你的改动，commit 请遵守 [AngularJS Git Commit Message Conventions](https://docs.google.com/document/d/1QrDFcIiPjSLDn3EL15IJygNPiHORgU1_OOAqWjiDU5Y/edit#heading=h.uyo6cb12dt6w).
4. 如果你的改动是修复 bug, 还可以在提交信息后面加上 `close #issue 号`, 这样可以在 pr 合并后，可以自动关闭对应的 issue, 比如 `fix: render bug close #123`.
5. 确保加上了对应的单元测试和文档 （如果有 `Snapshot` UI 快照 (.snap 文件）更新，可以运行 `pnpm core:test -- -u` 和 `pnpm react:test -- -u` 自动更新，并一起提交上来，请勿手动编辑）
6. 所有 Lint 和 Test 检查通过后，并且 review 通过，我们会合并你的 pr.

![preview](https://gw.alipayobjects.com/zos/antfincdn/ssOxFrycD/86339514-5f9a-4101-8690-e47c97cd8af5.png)

## ⌨️ 本地开发

<embed src="@/common/development.zh.md#L4-L100"></embed>

### 调试功能

:::info{title="提示"}
安装依赖后，会自动构建 `@antv/s2`, 如果是首次运行，并且自动构建失败，提示找不到 `@antv/s2/esm` 之类的报错，手动执行一次 `pnpm core:build-esm` 即可。
:::

根目录运行 `pnpm react:playground` 来运行 `S2`, 可用于调试 `@antv/s2` 和 `@antv/s2-react`, 提供了一些常用的图表场景和配置。

<img alt="preview" height="600" src="https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*6t8RRbg5x_kAAAAAAAAAAAAADmJ7AQ/original" />

S2 基于 `AntV/G` 渲染引擎绘制，如果想像 DOM 一样调试的话，可以安装 [G 开发者工具](https://g.antv.antgroup.com/api/devtools/g-devtools)

1. 访问 `chrome://extensions/` 安装后

<img alt="preview" height="600" src="https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*RTYXTpb3WuIAAAAAAAAAAAAADmJ7AQ/original" />

2. 开始调试

<img alt="preview" height="600" src="https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*sP9eQaWxDpcAAAAAAAAAAAAADmJ7AQ/original" />

### 调试单测

如果你想查看单测的运行结果，除了常规的 `pnpm core:test` 和 `pnpm react:test` 来运行测试之外，还可以 `可视化的调试单测（基于 jest-electron)`, 可以更快的发现单测的问题。

1. 选择单测

命令行运行 `pnpm core:start` 或者 `pnpm react:start`, 可以选择测试来运行

<img alt="preview" height="600" src="https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*g52KT5CybhYAAAAAAAAAAAAADmJ7AQ/original" />

也可以指定具体的测试文件名，跳过选择的步骤直接运行。

```bash
pnpm core:start packages/s2-core/__tests__/spreadsheet/scroll-spec.ts
pnpm react:start packages/s2-react/__tests__/spreadsheet/spread-sheet-spec.tsx
```

2. 查看结果

因为本质上就是一个浏览器，如果单测结果不符合预期，可以正常打断点进行调试，快速分析原因。

<img alt="preview" height="600" src="https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*E71uSYmhz9cAAAAAAAAAAAAADmJ7AQ/original" />

### 调试文档

如果有涉及到官网文档的改动，可以在本地调试运行，便于更直观的看到改动效果。

- `使用文档` - `s2-site/docs/manual`
- `API 文档` - `s2-site/docs/api`
- `图表示例` - `s2-site/examples`

```bash
# 开发
pnpm site:start

# 预览
pnpm site:preview
```

<img alt="preview" height="600" src="https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*OmeaT5vR0a8AAAAAAAAAAAAADmJ7AQ/original" />

如果是新增图表示例，需要在对应目录下的 `meta.json` 添加相应的配置信息，**其中 "screenshot" 是示例的截图，不需要填写**，PR 合并后我们会进行上传。

```diff
{
  "demos": [
+   {
+     "filename": "filename.ts",
+     "title": {
+       "zh": "中文描述",
+       "en": "English description"
+     },
+     "screenshot": "",
+     "new": true
+   }
  ]
}

```

## 📦 版本

<embed src="@/common/packages.zh.md"></embed>
