---
title: 贡献指南
order: 7
---

如果你恰好看到了这篇文章，你一定是希望对这个项目贡献自己的一份力量。

## 🫡 欢迎任何形式的贡献

"我代码水平不行", "会不会受到鄙视？", "会不会不太好？", 放心，不存在的！

我们欢迎任何形式的贡献，不管是一个**错别字的修改**，还是**一次友好的建议**，不管是通过提交 [Issue](https://github.com/antvis/S2/issues/new/choose), 还是一个帅气 [pull request](https://github.com/antvis/S2/pulls), 亦或是一次钉钉群的讨论，参与 [discussions](https://github.com/antvis/S2/discussions) 的讨论，期待在 [贡献者列表](https://github.com/antvis/S2/graphs/contributors) 里看见你的头像。

## ✍️ 分支管理

目前我们主要基于 `master` 和 `next` 分支开发，有任何修改，请基于 `master` 或 `next` 拉一个分支，然后通过 `PR` 的形式提交，我们集成了钉钉机器人，会第一次时间 `review` 你的 `PR`, 给与反馈。

- `master`: `1.x` 版本
- `next`: `2.x` 版本
- `alpha`: `1.x-alpha.x` 版本
- `beta`: `1.x-beta.x` 版本

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
5. 确保加上了对应的单元测试和文档 （如有必要）.
6. 所有 Lint 和 Test 检查通过后，并且 review 通过，我们会合并你的 pr.

![preview](https://gw.alipayobjects.com/zos/antfincdn/ssOxFrycD/86339514-5f9a-4101-8690-e47c97cd8af5.png)

## ⌨️ 本地开发

:::info{title="提示"}

我们使用 `pnpm` 作为包管理

```bash
npm i -g pnpm
```

推荐本地运行 `pnpm react:playground` 来调试 `@antv/s2` 和 `@antv/s2-react`
:::

<embed src="@/docs/common/development.zh.md#L4-L100"></embed>

## 📦 版本

<embed src="@/docs/common/packages.zh.md"></embed>
