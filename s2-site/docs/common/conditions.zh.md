---
title: 字段标记
order: 2
---

## Conditions

功能描述： 配置字段标记。分为文本 (text)，背景 (background)，柱状图 (interval)，图标 (icon)。

| 参数       | 说明 | 类型            | 默认值 | 必选  |
| ---------- | ---------- | ---------------  | ------ | ---- |
| text       | 文本字段标记   | [Condition](#condition)[]     | - |            |
| background | 背景字段标记   | [Condition](#condition)[]     | -      |            |
| interval   | 柱状图字段标记 | [Condition](#condition)[]   | -      |            |
| icon       | 图标字段标记   | [IconCondition](#iconcondition) | -  |            |

### Condition

功能描述： 配置条件格式。包括文本 (text)，背景 (background)，柱状图 (interval)。

| 参数      | 说明                                | 类型         | 默认值      | 必选  |
|---------|-----------------------------------|------------|----------|-----|
| field   | 1. 字段 ID <br /> 2. 使用正则表达式匹配字段 ID | `string \| RegExp` |     | ✓          |
| mapping | 作用映射函数​                           | `function` |          | ✓   |

#### MappingFunction

功能描述：字段标记处理函数。查看 [文档](/manual/basic/conditions) 和 [示例](/examples/analysis/conditions/#interval)

```ts
type MappingFunction = (
  fieldValue: number | string | null,
  data: Record<string, any>,
  node: DataCell | HeaderCell
) => {
  // 仅用于图标字段标记，可选
  icon?: string;

  // 背景 ｜ 文本 ｜ 柱状图 | 图标 字段标记颜色填充，必选
  fill: string;

  // 仅用于柱状图字段标记，可选
  isCompare?: boolean;
  minValue?: number;
  maxValue?: number;

  // 仅用于背景字段标记，可选。（当背景颜色较暗，将文本颜色设置为白色。优先级低于 文本字段标记）
  intelligentReverseTextColor?: boolean;
} | null | undefined // 返回值为空时，表示当前字段不显示字段标记样式

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

功能描述： 配置图标 (icon) 条件格式。查看 [文档](/manual/basic/conditions) 和 [示例](/examples/analysis/conditions/#icon)

| 参数     | 说明 | 类型     | 默认值  | 必选    |
| -------- | ------------ | -------- | ------- | ----  |
| field    | 字段 ID       | `string`   |                | ✓    |
| position | icon 相较于文字的位置 | `left \| right`   | `right` |         |
| mapping  | 映射函数 | [MappingFunction](#mappingfunction) |                 | ✓    |

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
