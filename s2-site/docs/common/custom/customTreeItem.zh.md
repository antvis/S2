---
title: 自定义树结构
order: 8
---

## CustomTreeItem

功能描述：自定义树状结构的配置，基本兼容 [AntD Tree](https://ant.design/components/tree-cn/) 数据配置项；

| 参数 | 类型 | 必选  | 默认值 | 功能描述 |
| --- | --- | :-:  | --- | --- |
| key | string | ✓ |    | 当前节点位移的id |
| title | string | ✓ |    | 当前节点展示名 |
| collapsed | boolean | × |  true  | 节点是否收起(只会在自身代表非叶子节点生效) |
| description | string | × |  ""  | 节点的额外描述信息 |
