---
title: Introduction
order: 1

---

<Badge>@antv/s2-react-components</Badge>

Starting from version `2.0`, `@antv/s2-react` is decoupled from the `antd` component library. Its built-in analysis components have been migrated to `@antv/s2-react-components`. Please use them on demand according to your actual scenario.

## Installation

```bash
$ npm install @antv/s2 @antv/s2-react-components --save
# yarn add @antv/s2 @antv/s2-react-components
```

## Prerequisites

The `React` version of the `Analysis Components`, such as `Advanced Sort`, `Export`, `Drill Down`, and `Dimension Switcher`, are developed based on the `antd` component library. Please ensure that the relevant dependencies are installed correctly and the corresponding styles are imported.

```bash
$ npm install antd @ant-design/icons --save
# yarn add antd @ant-design/icons --save
```

## Usage

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
