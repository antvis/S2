---
title: 字段标记
order: 2
---

## Conditions

类型：`object`，**必选**，默认值：`{}`

<description>功能描述： 配置字段标记。分为文本 (text)，背景 (background)，柱状图 (interval)，图标 (icon)。</description>

| 参数       | 类型            | 必选 | 取值 | 默认值 | 功能描述   |
| ---------- | --------------- | ---- | ---- | ------ | ---------- |
| text       | `Condition[]`     |      |      | `undefined`   | 文本字段标记   |
| background | `Condition[]`    |      |      | `undefined`   | 背景字段标记   |
| interval   | `Condition[]`     |      |      | `undefined`   | 柱状图字段标记 |
| icon       | `IconCondition[]` |      |      | `undefined`   | 图标字段标记   |

### Condition

类型：`object`，**必选**，默认值：`undefined`

<description>功能描述： 配置条件格式。包括文本 (text)，背景 (background)，柱状图 (interval)。</description>

| 参数    | 类型     | 必选 | 取值 | 默认值 | 功能描述     |
| ------- | -------- | ---- | ---- | ------ | ------------ |
| field   | `string`   | ✓    |      |        | 字段 ID       |
| mapping | `function` | ✓    |      |        | 作用映射函数​ |

#### mapping

```typescript
type MappingFunction = (
  fieldValue: number | string | null,
  data: Record<string, any>
) => {
  // 仅用于图标字段标记，可选
  icon?: string;
  
  // 背景 ｜ 文本 ｜ 柱状图 | 图标 字段标记颜色填充，必选
  fill: string;
 
  // 仅用于柱状图字段标记，可选
  isCompare?: boolean;
  minValue?: number;
  maxValue?: number;
} | null| undefined // 返回值为空时，表示当前字段不显示字段标记样式

```

**condition 用法示例：**

```javascript
const options = {
  conditions: {
    text: [
      {
        field: "province",
        mapping: () => ({
          fill: "rgba(0, 0, 0, .65)",
        }),
      },
    ],
    interval: [
      {
        field: "sub_type",
        mapping: () => {
          return {
            fill: "green",
          };
        },
      },
    ],
    background: [
      {
        field: "count",
        mapping: () => ({
          fill: "#ff00ff",
        }),
      },
    ],
  },
};

```

### IconCondition

类型：`object`，**必选**，默认值：`null`

<description>功能描述： 配置图标 (icon) 条件格式。</description>

| 参数     | 类型     | 必选 | 取值   | 默认值  | 功能描述     |
| -------- | -------- | ---- | ------ | ------- | ------------ |
| field    | `string`   | ✓    |        |         | 字段 ID       |
| position | `string`   |      | `left` &#124; `right`   | `right` | icon 相较于文字的位置 |
| mapping  | `function` | ✓    |        |         | 作用映射函数​ |

**icon condition 用法示例：**

```javascript
 const options = {
  conditions: {
    icon: [
      {
        field: "profit",
        position: "left",
        mapping: () => {
          return {
            icon: "InfoCircle",
            fill: "red",
          };
        },
      },
    ],
  },
};

```
