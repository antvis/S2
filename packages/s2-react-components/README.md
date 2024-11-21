<h1 align="center">@antv/s2-react-components</h1>

<div align="center">

S2 多维分析表格配置套的 React 分析/配置组件库。

<p>
 <a href="https://www.npmjs.com/package/@antv/s2-react-components" title="npm">
    <img src="https://img.shields.io/npm/dm/@antv/s2-react-components.svg" alt="npm" />
  </a>
  <a href="https://www.npmjs.com/package/@antv/s2-react-components" target="_blank">
    <img alt="Version" src="https://img.shields.io/npm/v/@antv/s2-react-components/latest.svg?logo=npm" alt="latest version" />
  </a>
   <a href="https://github.com/antvis/S2/actions/workflows/test.yml" target="_blank">
    <img src="https://github.com/antvis/S2/actions/workflows/test.yml/badge.svg" alt="ci test status" />
  </a>
</p>

</div>

## 📦 安装

```bash
$ pnpm add @antv/s2-react-components
# npm install @antv/s2-react-components --save
# yarn add @antv/s2-react-components
```

## 🔨 使用

```tsx
import React from 'React'
import { ThemePanel, TextAlignPanel, FrozenPanel } from '@antv/s2-react-components'
import '@antv/s2-react-components/dist/s2-react-components.min.css'

const App = () => {
  return (
    <>
      <ThemePanel
        title="主题配置"
        disableCustomPrimaryColorPicker={false}
        defaultCollapsed={false}
        onChange={(options, theme) => {
          console.log('onChange:', options, theme);
        }}
        onReset={(options, prevOptions, theme) => {
          console.log('onReset:', options, prevOptions, theme);
        }}
      />
      <TextAlignPanel
        title="文字对齐"
        defaultCollapsed={false}
        onChange={(options, theme) => {
          console.log('onChange:', options, theme);
        }}
        onReset={(options, prevOptions, theme) => {
          console.log('onReset:', options, prevOptions, theme);
        }}
      />
      <FrozenPanel
        title="冻结行列头"
        defaultCollapsed={false}
        onChange={(options) => {
          console.log('onChange:', options);
        }}
        onReset={(options, prevOptions) => {
          console.log('onReset:', options, prevOptions);
        }}
      />
    </>
  )
}
```

### 结果

![result](https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*YomqTrWu7y0AAAAAAAAAAAAADmJ7AQ/original)

### 结合表格使用

```tsx
import React from 'React'
import { ThemePanel } from '@antv/s2-react-components'
import '@antv/s2-react-components/dist/s2-react-components.min.css'

const App = () => {
  const s2Ref = React.useRef<SpreadSheet>();
  const [themeCfg, setThemeCfg] = React.useState<ThemeCfg>({
    name: 'default',
  });

  return (
    <>
      <ThemePanel
        title="主题配置"
        disableCustomPrimaryColorPicker={false}
        defaultCollapsed={false}
        onChange={(options, theme) => {
          setThemeCfg({
            name: options.themeType as ThemeName,
            theme,
          });
          s2Ref.current?.setOptions({
            hierarchyType: options.hierarchyType,
          });
          s2Ref.current?.render(false);
          console.log('onChange:', options, theme);
        }}
        onReset={(options, prevOptions, theme) => {
          console.log('onReset:', options, prevOptions, theme);
        }}
      />
      <SheetComponent
        ref={s2Ref}
        dataCfg={s2DataConfig}
        options={s2Options}
        sheetType="pivot"
        themeCfg={themeCfg}
      />
    </>
  )
```

![result](https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*RsLDQIXlyMgAAAAAAAAAAAAADmJ7AQ/original)
