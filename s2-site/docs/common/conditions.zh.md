---
title: 字段标记
order: 2
---

## Conditions

功能描述： 配置字段标记。分为文本 (text)，背景 (background)，柱状图 (interval)，图标 (icon)。

| 参数       | 说明           | 类型                                          | 默认值 | 必选 |
| ---------- | -------------- | --------------------------------------------- | ------ | ---- |
| text       | 文本字段标记   | [TextCondition](#textcondition)[]             | -      |      |
| background | 背景字段标记   | [BackgroundCondition](#backgroundcondition)[] | -      |      |
| interval   | 柱状图字段标记 | [IntervalCondition](#intervalcondition)[]     | -      |      |
| icon       | 图标字段标记   | [IconCondition](#iconcondition)[]             | -      |      |

### Condition

功能描述： 配置条件格式。TextCondition，BackgroundCondition，IntervalCondition，IconCondition 具继承于 Condition。

| 参数    | 说明                                           | 类型                                  | 默认值 | 必选 |
| ------- | ---------------------------------------------- | ------------------------------------- | ------ | ---- |
| field   | 1. 字段 ID <br /> 2. 使用正则表达式匹配字段 ID | `string \| RegExp`                    |        | ✓    |
| mapping | 作用映射函数​                                  | [ConditionMapping](#conditionmapping) |        | ✓    |

#### ConditionMapping

功能描述：字段标记处理函数。查看 [文档](/manual/basic/conditions) 和 [示例](/examples/analysis/conditions/#interval)

```ts
// TextCondition，BackgroundCondition，IntervalCondition，IconCondition 各自对应的 mapping 函数返回 的 T 有所不同
export type ConditionMapping<T = unknown> = (
  fieldValue: number | string,
  data: RawData,
  cell?: DataCell | HeaderCell,
) => ConditionMappingResult<T>;

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

功能描述： 配置图标 (icon) 条件格式，和其他 Condition 的唯一区别在于多了 position 参数用于自定义 icon 相对于文本的位置。查看 [文档](/manual/basic/conditions) 和 [示例](/examples/analysis/conditions/#icon)

| 参数     | 说明                  | 类型            | 默认值  | 必选 |
| -------- | --------------------- | --------------- | ------- | ---- |
| position | icon 相较于文字的位置 | `left` \| `right` | `right` |      |

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

<embed src="@/docs/common/icon.zh.md"></embed>​
