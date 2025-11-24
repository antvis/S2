---
title: Conditions
order: 2
---

## Conditions

Type: `object` , **required** , default value: `{}`

Function description: Configure field marking. Divided into text (text), background (background), histogram (interval), icon (icon).

| parameter  | illustrate              | type                            | Defaults | required |
| ---------- | ----------------------- | ------------------------------- | -------- | -------- |
| text       | text field tag          | [Condition](#condition) \[]     | -        |          |
| background | background field tag    | [Condition](#condition) \[]     | -        |          |
| interval   | Histogram Field Markers | [Condition](#condition) \[]     | -        |          |
| icon       | Icon Field Marker       | [IconCondition](#iconcondition) | -        |          |

### condition

Type: `object` , **required**

Function description: Configure conditional formatting. Including text (text), background (background), histogram (interval).

| parameter | illustrate                                                   | type               | Defaults | required |
| --------- | ------------------------------------------------------------ | ------------------ | -------- | -------- |
| field     | 1. Field ID<br>2. Use regular expressions to match field IDs | `string \| RegExp` |          | ✓        |
| mapping   | role mapping function​                                       | `function`         |          | ✓        |

#### MappingFunction

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

**Example usage of condition:**

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

Type: `object` , **required** , default value: `null`

Function description: Configure icon (icon) conditional formatting.

| parameter | illustrate                                    | type                                | Defaults | required |
| --------- | --------------------------------------------- | ----------------------------------- | -------- | -------- |
| field     | Field ID                                      | `string`                            |          | ✓        |
| position  | The position of the icon relative to the text | `left \| right`                     | `right`  |          |
| mapping   | mapping function                              | [MappingFunction](#mappingfunction) |          | ✓        |

**Example of icon condition usage:**

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
