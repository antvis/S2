---
title: 简介
order: 1
tag: New
---

从 `2.0` 版本开始，`@antv/s2-react` 和 `antd` 组件库解耦，其内置分析组件迁移至 `@antv/s2-react-components` 中，请根据实际场景按需使用。

## 安装

```bash
npm install @antv/s2-react-components --save
# yarn add @antv/s2-react-components
```

## 使用

```tsx
import React from 'react';
import { AdvancedSort } from '@antv/s2-react-components';
import '@antv/s2-react-components/dist/style.min.css';

export const App = () => {
  return (
    <AdvancedSort />
  );
};

```
