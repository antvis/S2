---
title: 字段标记
order: 2
---

## Conditions

功能描述： 配置字段标记。分为文本 (text)，背景 (background)，柱状图 (interval)，图标 (icon)。

| 参数       | 说明           | 类型                                          | 默认值 | 必选 |
| ---------- | -------------- | --------------------------------------------- | ------ | ---- |
| text       | 文本字段标记 ([查看示例](/examples/analysis/conditions/#text))   | [TextCondition](#textcondition)[]             | -      |      |
| background | 背景字段标记 ([查看示例](/examples/analysis/conditions/#background))  | [BackgroundCondition](#backgroundcondition)[] | -      |      |
| interval   | 柱状图字段标记 ([查看示例](/examples/analysis/conditions/#interval)) | [IntervalCondition](#intervalcondition)[]     | -      |      |
| icon       | 图标字段标记 ([查看示例](/examples/analysis/conditions/#icon))  | [IconCondition](#iconcondition)[]             | -      |      |

### Condition

功能描述： 配置条件格式。TextCondition，BackgroundCondition，IntervalCondition，IconCondition 均继承于 Condition。

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
  cell: S2CellType,
) => ConditionMappingResult<T>;

```

**condition 用法示例：**

```javascript
const options = {
  conditions: {
    text: [
      {
        field: "province",
        mapping: (fieldValue, data, cell) => {
          return {
            fill: "green",
            fontSize: 16,
            opacity: 0.2,
            textAlign: 'right'
          };
        },
      },
    ],
    interval: [
      {
        field: "sub_type",
        mapping: (fieldValue, data, cell) => {
          return {
            fill: "green",
            isCompare: true,
            maxValue: 8000,
            minValue: 300,
          };
        },
      },
    ],
    background: [
      {
        field: "count",
        mapping: (fieldValue, data, cell) => {
          return {
            fill: "green",
            intelligentReverseTextColor: true,
          };
        },
      },
    ],
    icon: [
      {
        field: "number",
        position: 'left',
        mapping: (fieldValue, data, cell) => {
          return {
            icon: "InfoCircle",
            fill: "green",
          };
        },
      },
    ],
  },
};

```

### TextCondition

同 [Condition](#condition) 一致，`ConditionMappingResult` 配置和 [文本主题配置一致（部分生效）](/api/general/s2-theme#texttheme), 也就意味着可以控制不同文本的颜色，透明度，对齐方式，字体等配置。

```ts
export type TextConditionMappingResult = TextTheme;
```

[查看示例](/examples/analysis/conditions/#text)

### BackgroundCondition

同 [Condition](#condition) 一致，`ConditionMappingResult` 配置为：

```ts
export type BackgroundConditionMappingResult = {
  fill: string;
  intelligentReverseTextColor?: boolean;
};
```

[查看示例](/examples/analysis/conditions/#background)

### IntervalCondition

同 [Condition](#condition) 一致，`ConditionMappingResult` 配置为：

```ts
export type IntervalConditionMappingResult = {
  fill?: string;
  isCompare?: boolean;
  minValue?: number;
  maxValue?: number;
}
```

[查看示例](/examples/analysis/conditions/#interval)

### IconCondition

功能描述： 配置图标 (icon) 条件格式，和其他 [Condition](#condition) 的唯一区别在于多了 position 参数用于自定义 icon 相对于文本的位置。查看 [文档](/manual/basic/conditions) 和 [示例](/examples/analysis/conditions/#icon)

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
        mapping: (fieldValue, data, cell) => {
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

`ConditionMappingResult` 配置为：

```ts
export type IconConditionMappingResult = {
  fill: string;
  icon: string;
};
```

<embed src="@/docs/common/icon.zh.md"></embed>​
