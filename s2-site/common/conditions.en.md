---
title: Conditions
order: 2
---

## Conditions

Describes the configuration for conditional formatting. This includes text, background, interval (bar chart), and icon formatting.

| Parameter  | Description                                                         | Type                                          | Default | Required |
| ---------- | ------------------------------------------------------------------- | --------------------------------------------- | ------- | -------- |
| text       | Text-based conditional formatting ([View Example](/examples/analysis/conditions/#text))   | [TextCondition](#textcondition)[]             | -       |          |
| background | Background-based conditional formatting ([View Example](/examples/analysis/conditions/#background))  | [BackgroundCondition](#backgroundcondition)[] | -       |          |
| interval   | Interval (bar chart) conditional formatting ([View Example](/examples/analysis/conditions/#interval)) | [IntervalCondition](#intervalcondition)[]     | -       |          |
| icon       | Icon-based conditional formatting ([View Example](/examples/analysis/conditions/#icon))  | [IconCondition](#iconcondition)[]             | -       |          |

### Condition

Describes the conditional formatting. `TextCondition`, `BackgroundCondition`, `IntervalCondition`, and `IconCondition` all inherit from `Condition`.

| Parameter | Description                                       | Type                                  | Default | Required |
| --------- | ------------------------------------------------- | ------------------------------------- | ------- | -------- |
| field     | 1. Field ID <br/> 2. Regular expression to match field IDs | `string \| RegExp`                    |         | ✓        |
| mapping   | The mapping function for the condition            | [ConditionMapping](#conditionmapping) |         | ✓        |

#### ConditionMapping

Function description: The callback function for conditional formatting. See the [documentation](/manual/basic/conditions) and [example](/examples/analysis/conditions/#interval).

```ts
// The generic type T in the return value of the mapping function differs for each of TextCondition, BackgroundCondition, IntervalCondition, and IconCondition.
export type ConditionMapping<T = unknown> = (
  fieldValue: number | string,
  data: RawData,
  cell: S2CellType,
) => ConditionMappingResult<T>;
```

**Example of `condition` usage:**

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

Same as [Condition](#condition). The `ConditionMappingResult` configuration is consistent with the [text theme configuration (partially effective)](/api/general/s2-theme#texttheme), which means you can control the color, opacity, alignment, font, etc., of different texts.

```ts
export type TextConditionMappingResult = TextTheme;
```

[View Example](/examples/analysis/conditions/#text)

### BackgroundCondition

Same as [Condition](#condition). The `ConditionMappingResult` is configured as:

```ts
export type BackgroundConditionMappingResult = {
  fill: string;
  intelligentReverseTextColor?: boolean;
};
```

[View Example](/examples/analysis/conditions/#background)

### IntervalCondition

Same as [Condition](#condition). The `ConditionMappingResult` is configured as:

```ts
export type IntervalConditionMappingResult = {
  fill?: string;
  isCompare?: boolean;
  minValue?: number;
  maxValue?: number;
}
```

[View Example](/examples/analysis/conditions/#interval)

### IconCondition

Describes the conditional formatting for icons. The only difference from other [Condition](#condition) types is the additional `position` parameter to customize the icon's position relative to the text. See the [documentation](/manual/basic/conditions) and [example](/examples/analysis/conditions/#icon).

| Parameter | Description | Type | Default | Required |
| --------- | --------------------- | --------------- | ------- | ---- |
| position  | The position of the icon relative to the text | `left` \| `right` | `right` |      |

**Example of `icon condition` usage:**

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

The `ConditionMappingResult` is configured as:

```ts
export type IconConditionMappingResult = {
  fill: string;
  icon: string;
};
```

<embed src="@/common/icon.en.md"></embed>
