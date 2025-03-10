---
title: 富文本 HTML
order: 7
tag: New
---

:::warning{title='安全免责声明'}

##### 功能边界声明

S2 是专注于数据渲染的轻量级解决方案，不包含任何形式的：

1. ❌ XSS（跨站脚本）攻击防御机制

2. ❌ 用户输入内容的安全过滤
3. ❌️ 脚本代码的沙箱隔离
4. ❌️ 动态内容的安全审计

##### 使用方责任

开发者在使用 S2 渲染第三方/用户提交内容时，必须：

1. ✅ 实施严格的内容安全策略（CSP）

2. ✅ 对原始数据进行 HTML 实体编码
3. ✅ 使用业界认可的 XSS 过滤库
4. ✅ 定期进行安全渗透测试

##### 风险承担条款

因直接使用 S2 渲染未经验证的内容导致的：

1. 🔴 数据泄露

2. 🔴 隐私侵权
3. 🔴 财产损失
4. 🔴 法律纠纷

本库作者及贡献者 不承担任何连带责任
:::

纯粹的 Canvas 绘制有时并不能满足业务的需要。基于 [`AntV/G`](https://g.antv.antgroup.com/) 强大的渲染能力，S2 可以在数据单元格内绘制富文本 HTML，以满足各种特殊的需求。

<Playground path="/custom/custom-renderer/demo/html.ts" rid='custom-renderer-html' height='300'></playground>

## HTML渲染介绍

请阅读 [`AntV/G`](https://g.antv.antgroup.com/)  [HTML](https://g.antv.antgroup.com/api/basic/html) 相关章节。

## 使用

在[S2DataConfig.meta](https://s2.antv.antgroup.com/api/general/s2-data-config#meta)中，添加HTML渲染相关配置项：

```ts
const s2DataConfig = {
  meta: {
    field: string,
    name: string,
    renderer: {
      type: 'HTML',  // 单元格渲染为HTML
      config?: Partial<HTMLRendererConfig> // G的HTML配置，https://g.antv.antgroup.com/api/basic/html
    }
  }
}
```

## 交互

1. 默认启用了`pointerEvents: 'auto'`，使得鼠标事件可穿透，实现点击链接跳转等交互效果
2. 默认会按照富文本原始大小比例显示，请勿设置富文本的宽高等属性。若调整单元格宽高，富文本也会自适应调整尺寸
