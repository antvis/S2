---
title: header action icons
order: 6
---

## HeaderActionIcon

功能描述：为表格行列头角头注册自定义操作 `icon`。如果该配置位空，则展示透视表默认操作icon。

| 参数 | 类型 | 必选  | 默认值 | 功能描述 |
| --- | --- | :-:  | --- | --- |
| iconNames | string[] | ✓ |    | 已经注册的 icon 名称，或用户通过 customSVGIcons 注册的 icon 名称 |
| belongsCell | string[] | ✓ | |   需要增加操作图标的单元格名称 cornerCell、colCell、rowCell |
| defaultHide | boolean |  |  |   是否默认隐藏, 如果为 true 则为 hover 后再显示；false 则始终显示  |
| displayCondition | (mete: Node)=> boolean; |  |  | 展示的过滤条件，可以通过该回调函数用户自定义行列头哪些层级或单元格需要展示 icon。 所有返回值为 true 的单元格会展示 icon，反之则无 |
| action | (headerActionIconProps: HeaderActionIconProps) => void; | ✓ |  | icon 点击之后的执行函数 |
