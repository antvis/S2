---
title: 自定义 Icon
order: 3
---

默认情况下，`S2` 会在指标行头（指标挂行头）或列头 （指标挂列头）展示默认的组内排序操作 icon，如下图：

<img src="https://gw.alipayobjects.com/mdn/rms_56cbb2/afts/img/A*kV8gR555SxgAAAAAAAAAAAAAARQnAQ" width="600" alt="preview" />

但在很多情况下，会需要展示其他的操作 `icon`，例如：筛选、下钻等，`S2` 提供了 `headerActionIcons` 参数让你可以通过简单的配置项快速实现行头、列头、角头的操作 `icon` 自定义。

```ts
const s2Options = {
  headerActionIcons: [
    {
      iconNames: ['SortDown'],
      belongsCell: 'colCell',
    },
  ],
}
```

1、如果内置 `icon` 不满足，可以配置 `customSVGIcons` 参数额外注册自己的 `icon`, 自定义 `icon` 同时适用于**主题配置**，意味着你也可以调整它的大小，颜色，具体请查看 [主题配置](/zh/docs/manual/basic/theme) 章节。

```ts
const s2Options = {
  customSVGIcons: [
    {
      name: 'Filter',
      svg: 'https://gw.alipayobjects.com/zos/antfincdn/gu1Fsz3fw0/filter%26sort_filter.svg',
    },
  ],
}
```

或者覆盖默认 `icon`, 例如自定义树状表格收起展开 `icon`

``` ts
const s2Options = {
  customSVGIcons: [
    {
      name: 'Plus',
      svg: 'https://gw.alipayobjects.com/zos/antfincdn/kXgP1pnClS/plus.svg',
    },
    {
      name: 'Minus',
      svg: 'https://gw.alipayobjects.com/zos/antfincdn/2aWYZ7%26rQF/minus-circle.svg',
    },
  ],
}

```

内置 icon 列表

| icon 名称     | icon 图标                                                                                                                      | 功能描述   | icon 名称        | icon 图标                                                                                                                      | 功能描述           |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------ | ---------- | ---------------- | ------------------------------------------------------------------------------------------------------------------------------ | ------------------ |
| CellDown      | <img alt="icon" src="https://intranetproxy.alipay.com/skylark/lark/0/2021/png/315626/1632471683806-41687600-9f55-49f7-8210-25c438b8152e.png" height=30> | 同环比下降 | ExpandColIcon    | <img alt="icon" src="https://intranetproxy.alipay.com/skylark/lark/0/2021/png/315626/1632472462583-40f32d2a-0a26-4e4f-8ebf-39603c3b8939.png" height=30> | 明细表隐藏展开     |
| CellUp        | <img alt="icon" src="https://intranetproxy.alipay.com/skylark/lark/0/2021/png/315626/1632471716079-9bc714c4-0b4e-4176-a2b9-d620251d30d6.png" height=30> | 同环比上升 | Plus             | <img alt="icon" src="https://intranetproxy.alipay.com/skylark/lark/0/2021/png/315626/1632475581023-4a53ecff-942c-45ff-8dc5-1c5b08e7b157.png" height=30> | 树状表格展开       |
| GlobalAsc     | <img alt="icon" src="https://intranetproxy.alipay.com/skylark/lark/0/2021/png/315626/1632471780679-5a7ee62d-73be-4713-945d-6b03f2786e8d.png" height=30> | 全局升序   | Minus      | <img alt="icon" src="https://gw.alipayobjects.com/zos/antfincdn/dKGwptOOB9/34d9064e-eaee-4160-ad84-a08f4ef1fee4.png" height=30> | 树状表格收起       |
| GlobalDesc    | <img alt="icon" src="https://intranetproxy.alipay.com/skylark/lark/0/2021/png/315626/1632471882478-bdbe6981-ce4b-4082-b6ad-f13577329147.png" height=30> | 全局降序   | SortDown         | <img alt="icon" src="https://intranetproxy.alipay.com/skylark/lark/0/2021/png/315626/1632473030451-4aed635f-d192-470b-91e6-5bfed9fac595.png" height=30> | 明细表降序         |
| GroupAsc      | <img alt="icon" src="https://intranetproxy.alipay.com/skylark/lark/0/2021/png/315626/1632471962652-722d8fec-9bee-4a85-9cc1-ac4f51f483c6.png" height=30> | 组内升序   | SortDownSelected | <img alt="icon" src="https://intranetproxy.alipay.com/skylark/lark/0/2021/png/315626/1632472951651-80c2949e-7b03-4a64-a283-1c4e37fc5e60.png" height=30> | 明细表降序选择状态 |
| GroupDesc     | <img alt="icon" src="https://intranetproxy.alipay.com/skylark/lark/0/2021/png/315626/1632472173126-d751f07a-10c4-44fb-a916-362f2ba611e6.png" height=30> | 组内降序   | SortUp           | <img alt="icon" src="https://intranetproxy.alipay.com/skylark/lark/0/2021/png/315626/1632473083059-12d7b39e-1a59-4584-b2f6-4608ee9e04fb.png" height=30> | 明细表升序         |
| Trend         | <img alt="icon" src="https://intranetproxy.alipay.com/skylark/lark/0/2021/png/315626/1632473312620-593aeff4-c618-4b2e-bc26-136a751efff9.png" height=30> | 趋势图     | SortUpSelected   | <img alt="icon" src="https://intranetproxy.alipay.com/skylark/lark/0/2021/png/315626/1632473154460-1a7c66bc-7f3f-4c46-a6e1-a586d566b94c.png" height=30> | 明细表升序选择状态 |
| ArrowUp       | <img alt="icon" src="https://gw.alipayobjects.com/zos/antfincdn/g9lTlN2xG/84042923-69b2-4ccc-89b4-1b2b5aa45d68.png" height=30>                          | 指标上升   |ArrowDown        | <img alt="icon" src="https://gw.alipayobjects.com/zos/antfincdn/OjQEFxclz/c7f5cce0-16e4-4522-987a-ae21ab9f24fa.png" height=30>                    | 指标下降           |
| DrillDownIcon | <img alt="icon" src="https://intranetproxy.alipay.com/skylark/lark/0/2021/png/315626/1632473411428-4959bde8-ead3-4c81-921d-26035bee21ae.png" height=30> | 下钻       |                  |                                                                                                                                |                    |

2、配置 `headerActionIcons` 参数
​
⚠️ 注：注册自定义行列头操作图标需要先将 `options` 的 `showDefaultHeaderActionIcon` 设置为 `false`, 否则默认展示在指标列头的排序 icon 并不会消失

### 配置参数

`markdown:docs/common/header-action-icon.zh.md`

### 自定义行列头 icon 示例

<playground path='custom/custom-icon/demo/custom-header-action-icon.tsx' rid='container' height='400'></playground>

### 自定义单元格 icon 示例

> 单元格标记详情，可查看 [字段标记](/zh/docs/manual/basic/conditions) 章节

```javascript
const s2Options = {
  customSVGIcons: [
    {
      name: 'Filter',
      svg: 'https://gw.alipayobjects.com/zos/antfincdn/gu1Fsz3fw0/filter%26sort_filter.svg',
    },
  ],
  conditions: {
    icon: [
      {
        field: 'number',
        mapping(fieldValue, data) {
          return {
            // 使用自定义 icon 名称
            icon: 'Filter',
            fill: '#30BF78',
          };
        },
      },
    ],
  },
}
```

<playground path='custom/custom-icon/demo/custom-data-cell-icon.tsx' rid='customDataCellIcon' height='400'></playground>
