---
title: 简介
order: 1
tag: New
---

<Badge>@antv/s2-react-components</Badge>

从 `2.0` 版本开始，`@antv/s2-react` 和 `antd` 组件库解耦，其内置分析组件迁移至 `@antv/s2-react-components` 中，请根据实际场景按需使用。

## 安装

```bash
$ npm install @antv/s2 @antv/s2-react-components --save
# yarn add @antv/s2 @antv/s2-react-components
```

## 前置依赖

`React` 版本的 `分析组件` 如：`高级排序`, `导出`, `下钻`, `维度切换` 等组件基于 `antd` 组件库开发，请确保相关依赖已正确安装，并引入对应样式。

```bash
$ npm install antd @ant-design/icons --save
# yarn add antd @ant-design/icons --save
```

## 使用

```tsx
import React from 'react';
import { AdvancedSort } from '@antv/s2-react-components';
import '@antv/s2-react-components/dist/s2-react-components.min.css';

export const App = () => {
  return (
    <AdvancedSort />
  );
};

```
