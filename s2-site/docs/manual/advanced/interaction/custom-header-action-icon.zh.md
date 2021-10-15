---
title: 自定义行列头操作图标
order: 2
---

默认情况下，s2 会在指标行头（指标挂行头）或列头 （指标挂列头）展示默认的组内排序操作 icon，如下图：

![组内排序icon](https://intranetproxy.alipay.com/skylark/lark/0/2021/png/315626/1632466011246-d40bad8b-7d71-430b-a2c7-f3f11c9f8050.png#clientId=uebe03e5f-c55b-4&from=paste&height=236&id=u01e893d7&margin=%5Bobject%20Object%5D&name=image.png&originHeight=472&originWidth=1744&originalType=binary&ratio=1&size=136679&status=done&style=none&taskId=u7cd02bb4-2341-4554-8d42-2f92bb9288f&width=872)

但在很多情况下，会需要展示其他的操作 icon，例如：筛选、下钻等，S2 提供了 `headerActionIcons` 参数可以通过简单的配置项快速实现行头、列头、角头的操作 icon 自定义。

1、如果内置icon不满组的情况下需要 `options` 先配置 `customSVGIcons` 参数 注册自己的 icon。如果内置已经满足，可以忽略。
内置 icon 列表

![内置 icon 列表](https://gw.alipayobjects.com/zos/antfincdn/8Bxia4Q64X/d4d4feec-4186-49c4-9d30-df5cff74b6ef.png)

2、配置 `headerActionIcons` 参数
​
⚠️ 注：注册自定义行列头操作图标需要先将 `options` 的 `showDefaultHeaderActionIcon` 设置为 `false`, 否则默认展示在指标列头的排序 icon 也并不会消失

# 配置参数

`markdown:docs/common/header-action-icon.zh.md`

# 完整示例

<playground path='interaction/advanced/demo/custom-header-action-icon.tsx' rid='container' height='400'></playground>
