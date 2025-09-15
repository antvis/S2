# [@antv/s2-react-v2.2.3](https://github.com/antvis/S2/compare/@antv/s2-react-v2.2.2...@antv/s2-react-v2.2.3) (2025-09-15)


### Performance Improvements

* 复用网格线和ClipPath，优化getBackgroundColor以提升6%的滚动性能 ([#3219](https://github.com/antvis/S2/issues/3219)) ([1a94f17](https://github.com/antvis/S2/commit/1a94f175b0ec36dc4ee214f0119d6620598632cd))

# [@antv/s2-react-v2.2.2](https://github.com/antvis/S2/compare/@antv/s2-react-v2.2.1...@antv/s2-react-v2.2.2) (2025-07-21)


### Bug Fixes

* 修复onDataCellEditStart / End 不能触发的问题 ([#3197](https://github.com/antvis/S2/issues/3197)) ([cfd43f5](https://github.com/antvis/S2/commit/cfd43f5fe58bac8c0e33682fe278ddb1d65c4bc3))
* 单数值时，趋势分析表数值显示为空 ([#3201](https://github.com/antvis/S2/issues/3201)) ([15e76ba](https://github.com/antvis/S2/commit/15e76ba7a85fbfa2ee56add70d7d88ea0fd0cbfc))

# [@antv/s2-react-v2.2.1](https://github.com/antvis/S2/compare/@antv/s2-react-v2.2.0...@antv/s2-react-v2.2.1) (2025-06-09)


### Bug Fixes

* 兼容不支持less的项目 ([#3181](https://github.com/antvis/S2/issues/3181)) ([26dbcf8](https://github.com/antvis/S2/commit/26dbcf8348b99d3333ab99a8fd62a70dbed62301))


### Performance Improvements

* 仅必要时执行角/行头的滚动重绘以提升14%的滚动性能 ([#3180](https://github.com/antvis/S2/issues/3180)) ([629d51f](https://github.com/antvis/S2/commit/629d51f6e76e63675bb1dad5590ff9cd163c4d7c))

# [@antv/s2-react-v2.2.0](https://github.com/antvis/S2/compare/@antv/s2-react-v2.1.7...@antv/s2-react-v2.2.0) (2025-02-25)


### Features

* 新增隐藏列展开按钮hover事件 ([#3105](https://github.com/antvis/S2/issues/3105)) ([89d4b85](https://github.com/antvis/S2/commit/89d4b851009b5c54dee5ced61c6130e871b4c8c6))

# [@antv/s2-react-v2.1.7](https://github.com/antvis/S2/compare/@antv/s2-react-v2.1.6...@antv/s2-react-v2.1.7) (2025-01-17)


### Bug Fixes

* 修复默认配置对 ChartSheet 不生效 ([#3075](https://github.com/antvis/S2/issues/3075)) ([09a1f06](https://github.com/antvis/S2/commit/09a1f06f9d954a7165c37914bf8cc7d0f3505543))

# [@antv/s2-react-v2.1.6](https://github.com/antvis/S2/compare/@antv/s2-react-v2.1.5...@antv/s2-react-v2.1.6) (2025-01-03)


### Bug Fixes

* 修复表头存在自定义 icon 时, 文本换行高度自适应不准确 ([#3065](https://github.com/antvis/S2/issues/3065)) ([e2ab646](https://github.com/antvis/S2/commit/e2ab6461b98cc3f9308edb20d960846e49f10a13))

# [@antv/s2-react-v2.1.5](https://github.com/antvis/S2/compare/@antv/s2-react-v2.1.4...@antv/s2-react-v2.1.5) (2024-12-30)


### Bug Fixes

* 使用离屏 Canvas 测量文本, 提高宽度计算的准确性 close [#3018](https://github.com/antvis/S2/issues/3018) ([#3053](https://github.com/antvis/S2/issues/3053)) ([d834e60](https://github.com/antvis/S2/commit/d834e607e317b9425da04e0026b324bfc2099e4a))

# [@antv/s2-react-v2.1.4](https://github.com/antvis/S2/compare/@antv/s2-react-v2.1.3...@antv/s2-react-v2.1.4) (2024-12-20)


### Bug Fixes

* 修复明细表自定义列头时, 隐藏列头后出现空白区域 close [#3044](https://github.com/antvis/S2/issues/3044) ([#3046](https://github.com/antvis/S2/issues/3046)) ([7e30008](https://github.com/antvis/S2/commit/7e30008ca4d784c740dccd26a6fa891579d1cb99))
* 更新 G 到最新版, 修复换行符报错的问题 close [#3040](https://github.com/antvis/S2/issues/3040) ([b86dddf](https://github.com/antvis/S2/commit/b86dddff2bf6941a00e286ed684790af52832f54))

# [@antv/s2-react-v2.1.3](https://github.com/antvis/S2/compare/@antv/s2-react-v2.1.2...@antv/s2-react-v2.1.3) (2024-12-13)


### Bug Fixes

* 构建产物编译到 es2015 close [#3025](https://github.com/antvis/S2/issues/3025) ([#3026](https://github.com/antvis/S2/issues/3026)) ([0a7977c](https://github.com/antvis/S2/commit/0a7977c1793a8171b14b07a22847b4dd9ed85d5f))

# [@antv/s2-react-v2.1.2](https://github.com/antvis/S2/compare/@antv/s2-react-v2.1.1...@antv/s2-react-v2.1.2) (2024-12-06)


### Bug Fixes

* 修复手动调用 showTooltip 不展示菜单的问题 ([d8afe27](https://github.com/antvis/S2/commit/d8afe2723ba731c220a1dcd8be22afd8d63aed8e))

# [@antv/s2-react-v2.1.1](https://github.com/antvis/S2/compare/@antv/s2-react-v2.1.0...@antv/s2-react-v2.1.1) (2024-12-04)


### Bug Fixes

* 修复下钻组件展示错误操作 icon & 兼容低版本 menu 写法 ([#3011](https://github.com/antvis/S2/issues/3011)) ([7d171f0](https://github.com/antvis/S2/commit/7d171f037e7f52cc49ad02ddf56598aa477bf043))
* 修复点击单元格中的 icon 时无法获取到单元格 meta 信息的问题 close [#2985](https://github.com/antvis/S2/issues/2985) ([#3013](https://github.com/antvis/S2/issues/3013)) ([67853a2](https://github.com/antvis/S2/commit/67853a2c08456ff166e948c9be30eb817e220079))

# [@antv/s2-react-v2.1.0](https://github.com/antvis/S2/compare/@antv/s2-react-v2.0.2...@antv/s2-react-v2.1.0) (2024-11-29)


### Bug Fixes

* **tooltip:** 修复操作按钮的 visible 对角头和文本溢出场景不生效 ([#3001](https://github.com/antvis/S2/issues/3001)) ([8f56023](https://github.com/antvis/S2/commit/8f56023b4f29584bc619b00bc5a03a0c3bf30494))


### Features

* 增加树状模式下行头宽度配置 rowCell.treeWidth ([#2998](https://github.com/antvis/S2/issues/2998)) ([b8fdd2a](https://github.com/antvis/S2/commit/b8fdd2a700a9a3bdc5d565c2bf89a85427c66a88))

# [@antv/s2-react-v2.0.2](https://github.com/antvis/S2/compare/@antv/s2-react-v2.0.1...@antv/s2-react-v2.0.2) (2024-11-26)

# [@antv/s2-react-v2.0.1](https://github.com/antvis/S2/compare/@antv/s2-react-v2.0.0...@antv/s2-react-v2.0.1) (2024-11-21)


### Bug Fixes

* 修改包 peerDependencies 版本和样式依赖问题 ([11df5d5](https://github.com/antvis/S2/commit/11df5d511515817047b09d6e3dd37000f7b189f2))

# [@antv/s2-react-v2.0.0](#) (2024-11-21)

* 2.0 正式版已发布，请查看 [升级指南](https://s2.antv.antgroup.com/manual/migration-v2)

# [@antv/s2-react-v2.0.0-next.31](https://github.com/antvis/S2/compare/@antv/s2-react-v2.0.0-next.30...@antv/s2-react-v2.0.0-next.31) (2024-11-15)


### Bug Fixes

* 修复文本存在换行符时, 未显示省略号的问题 ([#2978](https://github.com/antvis/S2/issues/2978)) ([08dbf0d](https://github.com/antvis/S2/commit/08dbf0d9c63f1c64989fe242c9645df06e6b04e5))
* 减少开启 ReactDOM.unstable_batchedUpdates 后的重渲染次数 ([#2971](https://github.com/antvis/S2/issues/2971)) ([9007e8e](https://github.com/antvis/S2/commit/9007e8ecf41b6d7434db312398f3996018ef0ecf))

# [@antv/s2-react-v2.0.0-next.30](https://github.com/antvis/S2/compare/@antv/s2-react-v2.0.0-next.29...@antv/s2-react-v2.0.0-next.30) (2024-11-01)


### Bug Fixes

* 修复自定义菜单项不触发 click 事件的问题 ([#2946](https://github.com/antvis/S2/issues/2946)) ([82dbb61](https://github.com/antvis/S2/commit/82dbb617440ba3d81e7ade96ee98747a7a5ecf5a))


### Features

* 优化紧凑模式下的单元格宽度计算方式 ([#2953](https://github.com/antvis/S2/issues/2953)) ([68ed225](https://github.com/antvis/S2/commit/68ed2258305eca6f92be7c238cd29c21407bcdd7))
* 增加不同类型单元格的选中事件 & 支持识别事件来源 ([#2956](https://github.com/antvis/S2/issues/2956)) ([69f6479](https://github.com/antvis/S2/commit/69f6479b43055c12d0295a7c77709b990a069ee3))
* 增加对自定义行列头总计、小计节点和组内排序的支持，修复明细表自定义列头 icon 问题 icon closes [#2898](https://github.com/antvis/S2/issues/2898) [#2893](https://github.com/antvis/S2/issues/2893) ([#2934](https://github.com/antvis/S2/issues/2934)) ([a4ae432](https://github.com/antvis/S2/commit/a4ae432d2ddff8a3b44fdfb7abd96d6a2369c81b))

# [@antv/s2-react-v2.0.0-next.29](https://github.com/antvis/S2/compare/@antv/s2-react-v2.0.0-next.28...@antv/s2-react-v2.0.0-next.29) (2024-10-25)


### Bug Fixes

* **type:** 修复 g renderer 的错误类型定义 ([#2939](https://github.com/antvis/S2/issues/2939)) ([523b2cc](https://github.com/antvis/S2/commit/523b2ccb8884933060000854f28d9a6d8b2806f5))
* 修复下钻 icon 不应该默认全部展示和标题样式问题 ([#2925](https://github.com/antvis/S2/issues/2925)) ([55f1a40](https://github.com/antvis/S2/commit/55f1a40b85a5b8c03182f08accb856f56defc82c))
* 修复排序菜单没有子节点时图标展示错误 & 调整默认样式 ([#2932](https://github.com/antvis/S2/issues/2932)) ([da5ebfb](https://github.com/antvis/S2/commit/da5ebfb9049eb33180dbc9c556480cd105acbe60))
* 修复父容器存在 transform 时, 在 canvas 内点击也会重置交互的问题 close [#2879](https://github.com/antvis/S2/issues/2879) ([#2942](https://github.com/antvis/S2/issues/2942)) ([010ed05](https://github.com/antvis/S2/commit/010ed050214568ea1902e4a426d6638afd3ae2f9))
* 修复通过修改引用的方式修改菜单配置时, tooltip 未重新渲染 ([#2933](https://github.com/antvis/S2/issues/2933)) ([82c1500](https://github.com/antvis/S2/commit/82c15002bd12b5c21cfae581711abf51553d8000))
* 增加单元格单双击的判断范围 ([#2924](https://github.com/antvis/S2/issues/2924)) ([c40bbf9](https://github.com/antvis/S2/commit/c40bbf9a4bf29459a0cb6ac32e3a7c52068c4eb1))

# [@antv/s2-react-v2.0.0-next.28](https://github.com/antvis/S2/compare/@antv/s2-react-v2.0.0-next.27...@antv/s2-react-v2.0.0-next.28) (2024-10-12)


### Bug Fixes

* 修复自定义列宽对虚拟数值列不生效 ([#2921](https://github.com/antvis/S2/issues/2921)) ([c53cea4](https://github.com/antvis/S2/commit/c53cea4a2fa2d7b18939abfb984629a94eab936d))
* 调整分割线的颜色绘制逻辑, 优化和单元格边框颜色不一致的问题 ([#2919](https://github.com/antvis/S2/issues/2919)) ([3f766d0](https://github.com/antvis/S2/commit/3f766d02b14bf6d6ebac34b302a0232a58afe500))

# [@antv/s2-react-v2.0.0-next.27](https://github.com/antvis/S2/compare/@antv/s2-react-v2.0.0-next.26...@antv/s2-react-v2.0.0-next.27) (2024-09-18)


### Bug Fixes

* 修复 expandDepth 在自定义行头场景下不生效 ([#2895](https://github.com/antvis/S2/issues/2895)) ([d83a816](https://github.com/antvis/S2/commit/d83a81674e587eab129630c0d3bc4f87b6550471))

# [@antv/s2-react-v2.0.0-next.26](https://github.com/antvis/S2/compare/@antv/s2-react-v2.0.0-next.25...@antv/s2-react-v2.0.0-next.26) (2024-08-23)


### Features

* **i18n:** add support of the russian language ([#2853](https://github.com/antvis/S2/issues/2853)) ([3dcf491](https://github.com/antvis/S2/commit/3dcf4913f37d222fe6c57a780bc00cab8829953d))
* 导出组件支持复制 HTML (text/html) 格式的数据 close [#2828](https://github.com/antvis/S2/issues/2828) ([#2865](https://github.com/antvis/S2/issues/2865)) ([444fbf5](https://github.com/antvis/S2/commit/444fbf55b25e4edff70e9c58efa023a0274a3b1f))

# [@antv/s2-react-v2.0.0-next.25](https://github.com/antvis/S2/compare/@antv/s2-react-v2.0.0-next.24...@antv/s2-react-v2.0.0-next.25) (2024-08-09)


### Bug Fixes

* 调整维值生成规则, 修复导出格式化数据时空数据占位符未生效 close [#2808](https://github.com/antvis/S2/issues/2808) ([#2810](https://github.com/antvis/S2/issues/2810)) ([ad14ff4](https://github.com/antvis/S2/commit/ad14ff48dbc2b6874c18bdd3ccf1678f5b79f130))


### Features

* **interaction:** 新增选中/高亮单元格 & 滚动 API ([#2586](https://github.com/antvis/S2/issues/2586)) ([ac4f5ab](https://github.com/antvis/S2/commit/ac4f5ab9d87bf9bf725b2ef872342a597823ebf6))
* 更新 G 版本, 支持透传 dblClickSpeed ([ce11006](https://github.com/antvis/S2/commit/ce110069c855bc68fd89e014f8436d6e8bf92a49))
* 统一透视表和明细表 meta 中的 query 参数 ([#2818](https://github.com/antvis/S2/issues/2818)) ([ffdde84](https://github.com/antvis/S2/commit/ffdde84fc6a0ecad21888b8d66cffd1356568662))

# [@antv/s2-react-v2.0.0-next.24](https://github.com/antvis/S2/compare/@antv/s2-react-v2.0.0-next.23...@antv/s2-react-v2.0.0-next.24) (2024-07-05)


### Bug Fixes

* 取消双击表格时浏览器默认的选中文本行为 close [#2798](https://github.com/antvis/S2/issues/2798) ([#2800](https://github.com/antvis/S2/issues/2800)) ([5df9326](https://github.com/antvis/S2/commit/5df9326790fd127268c64d288a4b28616e40794c))


### Features

* 支持同时在 React 16/17/18 下运行 ([#2802](https://github.com/antvis/S2/issues/2802)) ([84253cb](https://github.com/antvis/S2/commit/84253cb498d8d98d199c32b1fb8a6af4663bee3e))
* 统一链接跳转字段绘制逻辑, 支持标记列头 close [#2430](https://github.com/antvis/S2/issues/2430) ([#2796](https://github.com/antvis/S2/issues/2796)) ([637f651](https://github.com/antvis/S2/commit/637f651bbaaf1fcb696afe12c03e5c7042f95fae))

# [@antv/s2-react-v2.0.0-next.23](https://github.com/antvis/S2/compare/@antv/s2-react-v2.0.0-next.22...@antv/s2-react-v2.0.0-next.23) (2024-06-21)


### Bug Fixes

* 修复 react 层对 frozen 的处理 ([#2763](https://github.com/antvis/S2/issues/2763)) ([f05b5ae](https://github.com/antvis/S2/commit/f05b5ae7bd3e8e118827d93a27bd588c68861dcc))


### Features

* **components:** 组件层更新时增加 loading 效果 close [#1790](https://github.com/antvis/S2/issues/1790) ([#2762](https://github.com/antvis/S2/issues/2762)) ([0ca8413](https://github.com/antvis/S2/commit/0ca841362bb4bbb3b81ca1046f5b4dcd7236b91e))
* **theme-panel:** 新增主题风格配置组件 ([#2770](https://github.com/antvis/S2/issues/2770)) ([b559947](https://github.com/antvis/S2/commit/b559947ae2695dc3e4b581b10785ce34956d3702))
* **type:** 使用 Template Literal Types 增强枚举类型的提示 ([#2783](https://github.com/antvis/S2/issues/2783)) ([6e571da](https://github.com/antvis/S2/commit/6e571da007c7a5185084f3a2c24c19d590d51319))

# [@antv/s2-react-v2.0.0-next.22](https://github.com/antvis/S2/compare/@antv/s2-react-v2.0.0-next.21...@antv/s2-react-v2.0.0-next.22) (2024-06-03)


### Bug Fixes

* wheel scroll error! ([#2643](https://github.com/antvis/S2/issues/2643)) ([43cf364](https://github.com/antvis/S2/commit/43cf364cabc22409f405a1e6297d2d7196f8050b))
* 修复自定义 dataCell 错误的传参写法 ([#2748](https://github.com/antvis/S2/issues/2748)) ([c54ca82](https://github.com/antvis/S2/commit/c54ca826ab3fd8aa1e760f522abbc0190c724060))


### Features

* 增强行列冻结能力 ([#2706](https://github.com/antvis/S2/issues/2706)) ([e72d053](https://github.com/antvis/S2/commit/e72d05326c3db5d20aa88eec947549a78014b030)), closes [#2739](https://github.com/antvis/S2/issues/2739)

# [@antv/s2-react-v2.0.0-next.21](https://github.com/antvis/S2/compare/@antv/s2-react-v2.0.0-next.20...@antv/s2-react-v2.0.0-next.21) (2024-05-24)


### Performance Improvements

* 优化开启多行文本时的布局性能 ([#2734](https://github.com/antvis/S2/issues/2734)) ([388157c](https://github.com/antvis/S2/commit/388157c0ecb82c45f8a0277b649e891366dc2f1c))

# [@antv/s2-react-v2.0.0-next.20](https://github.com/antvis/S2/compare/@antv/s2-react-v2.0.0-next.19...@antv/s2-react-v2.0.0-next.20) (2024-05-17)


### Features

* 明细表新增空数据占位符能力 ([#2729](https://github.com/antvis/S2/issues/2729)) ([19dbda5](https://github.com/antvis/S2/commit/19dbda5e9719d6a8f6d05ce0a93386e80c31ffab))


### BREAKING CHANGES

* s2Options.placeholder 配置更改为 cell 和 empty

* test: 增加单测

* fix: 兼容滚动条的展示

* test: 单测和文档补充

* test: 修改滚动条位置单测断言

* test: 更新 shared 包快照

* fix: 修复英文环境下未展示英文文案

* fix: 修复列头单元格宽度很小时占位符坐标错误的问题

* fix: 修复趋势分析表导出占位符解析错误

# [@antv/s2-react-v2.0.0-next.19](https://github.com/antvis/S2/compare/@antv/s2-react-v2.0.0-next.18...@antv/s2-react-v2.0.0-next.19) (2024-05-11)

### Bug Fixes

* 修复 React 18 环境下 Tooltip 卸载后无法再次渲染 & 排序菜单选中效果丢失的问题 ([#2698](https://github.com/antvis/S2/issues/2698)) ([0af329d](https://github.com/antvis/S2/commit/0af329da596733eee8013a7a1f04676a720767d3))
* 修复导出 CSV 时分隔符错误导致的展示格式错误 close [#2701](https://github.com/antvis/S2/issues/2701) ([#2703](https://github.com/antvis/S2/issues/2703)) ([98c051a](https://github.com/antvis/S2/commit/98c051a58c1d8b7c7831343ba909238e514615ae))
* 修复配置了多行文本但实际渲染的文本未换行时，单元格高度也会自适应调整的问题 ([#2705](https://github.com/antvis/S2/issues/2705)) ([5d19e62](https://github.com/antvis/S2/commit/5d19e623c8f726d4f417ea2cb55cc489ef09f1b2))

### Features

* **options:** customSVGIcons API 变更 ([#2700](https://github.com/antvis/S2/issues/2700)) ([fde8e8f](https://github.com/antvis/S2/commit/fde8e8f57d176057d052cbf0dd401211e2839a0e))
* 更新 g 到最新版 ([#2631](https://github.com/antvis/S2/issues/2631)) ([7647605](https://github.com/antvis/S2/commit/7647605dcd60e1e34f2014aafb180ac931bf0725)), closes [#2629](https://github.com/antvis/S2/issues/2629)

### BREAKING CHANGES

* Export 组件 和 asyncGetAllPlainData, copyToClipboard
的是否异步导出参数统一为 async

* test: 修复循环依赖

* fix: 修复格式化对角头未生效

* fix: 修复趋势分析表导出 CSV 错误

* test: 单测修复
* **options:** svg 变更为 src

* test: 单测修复

* test: 单测修复

# [@antv/s2-react-v2.0.0-next.18](https://github.com/antvis/S2/compare/@antv/s2-react-v2.0.0-next.17...@antv/s2-react-v2.0.0-next.18) (2024-04-30)

### Bug Fixes

* 修复表格右键事件无法触发 close [#2687](https://github.com/antvis/S2/issues/2687) ([#2690](https://github.com/antvis/S2/issues/2690)) ([8b4f3e3](https://github.com/antvis/S2/commit/8b4f3e3dab83e6ae38b1d3362049af8352a7a4a9))

### Features

* canvas 支持挂载 s2 实例 ([#2645](https://github.com/antvis/S2/issues/2645)) ([ed21dcb](https://github.com/antvis/S2/commit/ed21dcb82ea4cb434587a4ffa4819f2a619ca1aa))

### Performance Improvements

* 优化 getDimensionValues 在大量 flatten 情况下的性能 ([#2640](https://github.com/antvis/S2/issues/2640)) ([41980c5](https://github.com/antvis/S2/commit/41980c5a092e24214d21f41cfa288d5350f99c16))

# [@antv/s2-react-v2.0.0-next.17](https://github.com/antvis/S2/compare/@antv/s2-react-v2.0.0-next.16...@antv/s2-react-v2.0.0-next.17) (2024-04-26)

### Bug Fixes

* 修复明细表自定义多级列头导出格式错误 close [#2664](https://github.com/antvis/S2/issues/2664) ([#2674](https://github.com/antvis/S2/issues/2674)) ([ae9add9](https://github.com/antvis/S2/commit/ae9add9c722877aced481340f798408a09ad98fb))

# [@antv/s2-react-v2.0.0-next.16](https://github.com/antvis/S2/compare/@antv/s2-react-v2.0.0-next.15...@antv/s2-react-v2.0.0-next.16) (2024-03-29)

### Bug Fixes

* 修复紧凑模式下数值单元格错误的展示了省略号 ([#2632](https://github.com/antvis/S2/issues/2632)) ([2822471](https://github.com/antvis/S2/commit/2822471e9f73ba7b19292dc88a93b96d38afa471))
* 调整 peerDependencies 命中规则 ([#2633](https://github.com/antvis/S2/issues/2633)) ([73378c7](https://github.com/antvis/S2/commit/73378c70339c1d5536be33cdf3cece5404d1f5c9))

# [@antv/s2-react-v2.0.0-next.15](https://github.com/antvis/S2/compare/@antv/s2-react-v2.0.0-next.14...@antv/s2-react-v2.0.0-next.15) (2024-03-22)

### Bug Fixes

* **g:** 修复表格初次渲染时部分 icon 不展示 close [#2014](https://github.com/antvis/S2/issues/2014) ([#2606](https://github.com/antvis/S2/issues/2606)) ([3f9a176](https://github.com/antvis/S2/commit/3f9a176f75c46fa58e50d0fd70a652242f7b6df3))
* 修复角头和行头折叠展开 icon 的状态未同步以及展开异常的问题 close [#2607](https://github.com/antvis/S2/issues/2607) ([#2620](https://github.com/antvis/S2/issues/2620)) ([99829a6](https://github.com/antvis/S2/commit/99829a667c69394c0554ece841d6f6eb5c3f9b9e))

# [@antv/s2-react-v2.0.0-next.14](https://github.com/antvis/S2/compare/@antv/s2-react-v2.0.0-next.13...@antv/s2-react-v2.0.0-next.14) (2024-03-15)

### Bug Fixes

* 修复文本行数不一致时自动换行高度自适应失效 close [#2594](https://github.com/antvis/S2/issues/2594) ([#2598](https://github.com/antvis/S2/issues/2598)) ([fae5496](https://github.com/antvis/S2/commit/fae5496e503205f319e7bdc79240d31dacd4e850))

# [@antv/s2-react-v2.0.0-next.13](https://github.com/antvis/S2/compare/@antv/s2-react-v2.0.0-next.12...@antv/s2-react-v2.0.0-next.13) (2024-03-11)

### Features

* **interaction:** 支持批量调整行高列宽 close [#2574](https://github.com/antvis/S2/issues/2574) ([#2580](https://github.com/antvis/S2/issues/2580)) ([7d1be20](https://github.com/antvis/S2/commit/7d1be206442396371ab08a8224b2685aea2c025d))
* 增加角头和序号列的交互能力 ([#2571](https://github.com/antvis/S2/issues/2571)) ([fcb77cc](https://github.com/antvis/S2/commit/fcb77cce65ee56aeec189cf46d4226ef6a62a671))

# [@antv/s2-react-v2.0.0-next.12](https://github.com/antvis/S2/compare/@antv/s2-react-v2.0.0-next.11...@antv/s2-react-v2.0.0-next.12) (2024-03-04)

### Bug Fixes

* 修复树状模式选中非叶子节点时不展示汇总信息的问题 ([48b7073](https://github.com/antvis/S2/commit/48b70737f32d58d75c356a4d37afeb74a917cf23))
* 修复父容器存在 transform 缩放时单元格刷选偏移 close [#2553](https://github.com/antvis/S2/issues/2553) ([#2565](https://github.com/antvis/S2/issues/2565)) ([715bbf4](https://github.com/antvis/S2/commit/715bbf41541ca6b5bee47c44695345bfaa0605ea))
* 修复编辑表双击失效 ([9edcb74](https://github.com/antvis/S2/commit/9edcb74576c8137481c375258fa9d9e310fafc7c))
* 修复编辑表的输入框未回填格式化后的数据 close [#2528](https://github.com/antvis/S2/issues/2528) ([#2549](https://github.com/antvis/S2/issues/2549)) ([95d67ca](https://github.com/antvis/S2/commit/95d67ca02b774aed426a179a16aa27f0c172356e))
* 修复自定义目录树同名节点展示异常 & 导出缺失角头 close [#2455](https://github.com/antvis/S2/issues/2455) ([#2551](https://github.com/antvis/S2/issues/2551)) ([6d315bf](https://github.com/antvis/S2/commit/6d315bff20e74f0ce5f1d286105eeba749ebabaf))
* 修复行列头数值复制时未使用格式化的值 & 优化单测 ([989366f](https://github.com/antvis/S2/commit/989366fc740b7c1367c4cf246a6e3eb80e4f3338))
* 修复表格排序后，编辑单元格后数据更新错误 close [#2573](https://github.com/antvis/S2/issues/2573) ([#2544](https://github.com/antvis/S2/issues/2544)) ([c4ff49a](https://github.com/antvis/S2/commit/c4ff49a47c5ef6155a623edaf72e65ab3dccbc68))
* 修复趋势分析表复制错误 ([2e24418](https://github.com/antvis/S2/commit/2e24418cabebdbe1cd306cdf931c0c8fa7bae050))

### Features

* 移除已废弃的方法和逻辑 & 优化文档 ([#2566](https://github.com/antvis/S2/issues/2566)) ([de7c97b](https://github.com/antvis/S2/commit/de7c97b862e5b467fd335dd65f9dac5a95e4b621))

# [@antv/s2-react-v2.0.0-next.11](https://github.com/antvis/S2/compare/@antv/s2-react-v2.0.0-next.10...@antv/s2-react-v2.0.0-next.11) (2024-02-07)

### Bug Fixes

* 修复表格排序后，编辑单元格后数据更新错误 ([e841d3d](https://github.com/antvis/S2/commit/e841d3db020afb418f0b2f9223271c329390b192))

# [@antv/s2-react-v2.0.0-next.10](https://github.com/antvis/S2/compare/@antv/s2-react-v2.0.0-next.9...@antv/s2-react-v2.0.0-next.10) (2024-02-05)

### Features

* 合并 master 到 next ([#2493](https://github.com/antvis/S2/issues/2493)) ([6da530d](https://github.com/antvis/S2/commit/6da530d0c5f53d283ddfaa4b3e510ca11c9bf83e)), closes [#2186](https://github.com/antvis/S2/issues/2186) [#2204](https://github.com/antvis/S2/issues/2204) [#2191](https://github.com/antvis/S2/issues/2191)

### Performance Improvements

* 优化多行文本渲染性能 ([#2478](https://github.com/antvis/S2/issues/2478)) ([adc5ef3](https://github.com/antvis/S2/commit/adc5ef32056ca0427942f5a118af938124821bcc))

# [@antv/s2-react-v2.0.0-next.9](https://github.com/antvis/S2/compare/@antv/s2-react-v2.0.0-next.8...@antv/s2-react-v2.0.0-next.9) (2023-12-12)

* **table-sheet:** 修复明细表 tooltip 展示了错误的汇总数据的问题 ([#2457](https://github.com/antvis/S2/issues/2457)) ([51bc110](https://github.com/antvis/S2/commit/51bc1105d8c52bd46cc89dfe2698b0fe42745c69))
* **table-sheet:** 修复明细表排序后开启行列冻结，冻结行展示错误 close [#2388](https://github.com/antvis/S2/issues/2388) ([#2453](https://github.com/antvis/S2/issues/2453)) ([741e27a](https://github.com/antvis/S2/commit/741e27aab78b4b415d5f9e49760b401c93a84ca9))

### Features

* 交叉表支持冻结首行能力 ([#2416](https://github.com/antvis/S2/issues/2416)) ([b81b795](https://github.com/antvis/S2/commit/b81b7957b9e8b8e1fbac9ebc6cacdf45a14e5412))

# [@antv/s2-react-v1.44.3](https://github.com/antvis/S2/compare/@antv/s2-react-v1.44.2...@antv/s2-react-v1.44.3) (2023-12-01)

### Bug Fixes

* **copy:** 修复刷选复制行列头时，数值单元格未格式化 & 存在省略号时未复制原始值 ([#2410](https://github.com/antvis/S2/issues/2410)) ([708fde4](https://github.com/antvis/S2/commit/708fde479bb48b941445b3adaf1f56cf5cb6b301))
* 修复中英文标点符号 ([#2442](https://github.com/antvis/S2/issues/2442)) ([17a2d00](https://github.com/antvis/S2/commit/17a2d00f13ff1db4cc8236176b2a26c5212a2dbd))

# [@antv/s2-react-v1.44.2](https://github.com/antvis/S2/compare/@antv/s2-react-v1.44.1...@antv/s2-react-v1.44.2) (2023-11-10)

### Bug Fixes

* 修复趋势分析表自定义列头 tooltip 后错误的使用行头的 tooltip ([#2399](https://github.com/antvis/S2/issues/2399)) ([0310c2f](https://github.com/antvis/S2/commit/0310c2f7f6ea054a79f0fc71b972ee1d3dd1c649))

# [@antv/s2-react-v1.44.1](https://github.com/antvis/S2/compare/@antv/s2-react-v1.44.0...@antv/s2-react-v1.44.1) (2023-10-27)

### Bug Fixes

* **interaction:** 修复拖动水平滚动条后单元格选中状态被重置 close [#2376](https://github.com/antvis/S2/issues/2376) ([#2380](https://github.com/antvis/S2/issues/2380)) ([b2e9700](https://github.com/antvis/S2/commit/b2e97008122f5320342fd069a08f6e821a5c9ad6))
* **layout:** 修复在紧凑模式列头宽度未按文本自适应 close [#2385](https://github.com/antvis/S2/issues/2385) ([#2392](https://github.com/antvis/S2/issues/2392)) ([2edd99c](https://github.com/antvis/S2/commit/2edd99c367116bad661a02893a303311787eb647))

# [@antv/s2-react-v1.44.0](https://github.com/antvis/S2/compare/@antv/s2-react-v1.43.0...@antv/s2-react-v1.44.0) (2023-09-22)

### Features

* 对比值无波动时也显示灰色 ([#2351](https://github.com/antvis/S2/issues/2351)) ([12f2d02](https://github.com/antvis/S2/commit/12f2d0268d447ec99a1227ffedd5ed266d93e86b))
* 小计/总计功能，支持按维度分组汇总 ([#2346](https://github.com/antvis/S2/issues/2346)) ([20e608f](https://github.com/antvis/S2/commit/20e608f2447e9ffdb135d98e4cc7f39f1cfb308d))

# [@antv/s2-react-v1.43.0](https://github.com/antvis/S2/compare/@antv/s2-react-v1.42.1...@antv/s2-react-v1.43.0) (2023-09-09)

### Bug Fixes

* **interaction:** 修复行头滚动刷选范围判断错误 ([8b080af](https://github.com/antvis/S2/commit/8b080afccdd4bebc157e0d569d36b2b04175a522))

### Features

* 对比值无波动时也显示灰色 ([#2351](https://github.com/antvis/S2/issues/2351)) ([12f2d02](https://github.com/antvis/S2/commit/12f2d0268d447ec99a1227ffedd5ed266d93e86b))

# [@antv/s2-react-v1.42.2-alpha.1](https://github.com/antvis/S2/compare/@antv/s2-react-v1.42.1...@antv/s2-react-v1.42.2-alpha.1) (2023-09-07)

### Bug Fixes

* **interaction:** 修复行头滚动刷选范围判断错误 ([8b080af](https://github.com/antvis/S2/commit/8b080afccdd4bebc157e0d569d36b2b04175a522))
* **scroll:** 修复移动端快速滚动时控制台报错 close [#2266](https://github.com/antvis/S2/issues/2266) ([#2302](https://github.com/antvis/S2/issues/2302)) ([4ccc03d](https://github.com/antvis/S2/commit/4ccc03d50ef6622774a8c9e3599c988d2a7e126e))

# [@antv/s2-react-v1.37.1-alpha.2](https://github.com/antvis/S2/compare/@antv/s2-react-v1.37.1-alpha.1...@antv/s2-react-v1.37.1-alpha.2) (2023-03-08)

### Bug Fixes

* 修复 React 18 StrictMode 同时挂载两个表格的问题 ([#2432](https://github.com/antvis/S2/issues/2432)) ([7c4da43](https://github.com/antvis/S2/commit/7c4da435976076e5babe21012524694986286210))

### Features

* 支持在单元格内渲染 G2 图表 ([#2437](https://github.com/antvis/S2/issues/2437)) ([497f941](https://github.com/antvis/S2/commit/497f9414b89fce01b60db9b6c2eb4292ffe69c1d))

# [@antv/s2-react-v2.0.0-next.8](https://github.com/antvis/S2/compare/@antv/s2-react-v2.0.0-next.7...@antv/s2-react-v2.0.0-next.8) (2023-11-22)

### Features

* headerActionIcons 支持细粒度配置 & 修复异步渲染导致无法获取实例的问题 ([#2301](https://github.com/antvis/S2/issues/2301)) ([b2d6f1f](https://github.com/antvis/S2/commit/b2d6f1fb04d3fa73129669fc7d2dec84943252db))
* **layout:** 单元格支持渲染多行文本 ([#2383](https://github.com/antvis/S2/issues/2383)) ([e3b919a](https://github.com/antvis/S2/commit/e3b919a4f37d600a0f516944edf4eed8b2c0174d))
* 支持 antd v5 ([#2413](https://github.com/antvis/S2/issues/2413)) ([299c7bf](https://github.com/antvis/S2/commit/299c7bfe2e86838153273c92dd6d2b72917cfdea))
* 支持 React 18 （兼容 React 16/17) ([#2373](https://github.com/antvis/S2/issues/2373)) ([25ce9b0](https://github.com/antvis/S2/commit/25ce9b0ccc3e609d8add09b3209f6f981dc1dc4e))
* 支持自定义 G 5.0 插件和配置 ([#2423](https://github.com/antvis/S2/issues/2423)) ([cc6c47f](https://github.com/antvis/S2/commit/cc6c47fd0927125bbc378fe6914becfcbe1b0acd))

### BREAKING CHANGES

* 移除 devicePixelRatio 和 supportsCSSTransform

* docs: 增加文档

* test: update

* test: 增加单测
* antd v5, 组件层级样式升级

* feat: 更新操作项菜单类型和文档

* chore: 修复 s2-vue 类型

* chore: ci

* test: 单测修复

* test: 单测修复

* feat: 兼容暗黑模式

* feat: 兼容暗黑模式
* 支持 React 18

* fix: 修复 lint 和 test

* fix: 修复打包问题

* chore: pnpm v8

* chore: autoInstallPeers pnpm v8

* test: 修复 swc/jest 导致的单测问题

* fix: 修复打包问题

* test: 更新 react 快照

* feat: 兼容 React 16/17

* test: 更新 react 快照

* test: 更新 react 快照

* test: 更新 react 快照

# [@antv/s2-react-v2.0.0-next.7](https://github.com/antvis/S2/compare/@antv/s2-react-v2.0.0-next.6...@antv/s2-react-v2.0.0-next.7) (2023-07-17)

### Features

* 使用 requestIdleCallback 处理数据大量导出的情况 ([#2272](https://github.com/antvis/S2/issues/2272)) ([42a5551](https://github.com/antvis/S2/commit/42a55516dd369d9ab5579b52fbc9900b0ad81858))
* 同步复制支持自定义 transformer  ([#2201](https://github.com/antvis/S2/issues/2201)) ([9003767](https://github.com/antvis/S2/commit/9003767d584248b9d122f299326fd14753961883))
* 增加暗黑主题 ([#2130](https://github.com/antvis/S2/issues/2130)) ([51dbdcf](https://github.com/antvis/S2/commit/51dbdcf564b387a3fd1809a71016f3a91eebde38))
* 文本和图标的条件格式支持主题配置 ([#2267](https://github.com/antvis/S2/issues/2267)) ([c332c68](https://github.com/antvis/S2/commit/c332c687dfb7be1d07b79b44934f78c1947cc466))
* 行列头兼容 condition icon 和 action icons ([#2161](https://github.com/antvis/S2/issues/2161)) ([1df4286](https://github.com/antvis/S2/commit/1df42860f6a12d3cb182ba7633c4984a04e62890))
* 适配 g5.0 异步渲染 ([#2251](https://github.com/antvis/S2/issues/2251)) ([069d03d](https://github.com/antvis/S2/commit/069d03d299429c2ffab3e20d56ecd6bb30119ffd))

### Performance Improvements

* **react:** 防止不必要的重新渲染 ([#2275](https://github.com/antvis/S2/issues/2275)) ([f8da43d](https://github.com/antvis/S2/commit/f8da43de47761ce68ebfc0238f3e1bcb06f46bc1))

# [@antv/s2-react-v2.0.0-next.6](https://github.com/antvis/S2/compare/@antv/s2-react-v2.0.0-next.5...@antv/s2-react-v2.0.0-next.6) (2023-04-28)

### Bug Fixes

* fix lint error ([f3eba69](https://github.com/antvis/S2/commit/f3eba69a17f2febd7e3adc1ae0c2069295ba0ae6))
* **interaction:** 修复行头滚动刷选范围判断错误 ([#2101](https://github.com/antvis/S2/issues/2101)) ([8e38fb0](https://github.com/antvis/S2/commit/8e38fb0df6123360d2bd835cf80bcf72898a80b9))
* **layout:** 修复自定义列头采样错误导致行角头不显示 close [#2117](https://github.com/antvis/S2/issues/2117) ([#2175](https://github.com/antvis/S2/issues/2175)) ([2266272](https://github.com/antvis/S2/commit/22662721739b45fbe5c00c1157ad00071d8f5f0d))

### Features

* **interaction:** 点击角头后支持选中所对应那一列的行头 close [#2073](https://github.com/antvis/S2/issues/2073) ([#2081](https://github.com/antvis/S2/issues/2081)) ([ad2b5d8](https://github.com/antvis/S2/commit/ad2b5d87edf4c529d7c9a5e1348e893e14547ef3))
* **interaction:** 行头支持滚动刷选 ([#2087](https://github.com/antvis/S2/issues/2087)) ([65c3f3b](https://github.com/antvis/S2/commit/65c3f3b6a37709c0fa684b0f5717d3b349251e48))
* 修改文档、添加用例演示、修改方法名 drawLinkFieldShapLogic -> drawLinkField ([7f2bd69](https://github.com/antvis/S2/commit/7f2bd690bd703b8e4d678c03b9fc79db30848ca3))
* 增加 dataCell 下划线测试用例及 demo ([a5efe17](https://github.com/antvis/S2/commit/a5efe17bda06cc8eba633cbea9c56ceb8b8c703e))
* 提取跳转链接下划线 公共逻辑 到 BaseCell 类 ([34dbbb3](https://github.com/antvis/S2/commit/34dbbb3bdf028cb96508dcead724d9ac9bcc1ab9))
* 移除 switcher 按钮 important 样式 ([#2139](https://github.com/antvis/S2/issues/2139)) ([d4f9197](https://github.com/antvis/S2/commit/d4f9197f1c3d1b3cfc2bdfb8d375413a2daa79c3))

# [@antv/s2-react-v2.0.0-next.5](https://github.com/antvis/S2/compare/@antv/s2-react-v2.0.0-next.4...@antv/s2-react-v2.0.0-next.5) (2023-04-23)

### Features

* 统一导出和复制逻辑，优化导出和复制性能 ([#2152](https://github.com/antvis/S2/issues/2152)) ([df88455](https://github.com/antvis/S2/commit/df884557756e4374e95687cf4c99d575bc2cb6fc))

# [@antv/s2-react-v2.0.0-next.4](https://github.com/antvis/S2/compare/@antv/s2-react-v2.0.0-next.3...@antv/s2-react-v2.0.0-next.4) (2023-02-22)

### Bug Fixes

* **layout:** 修复存在列总计但不存在列小计时，隐藏其兄弟节点后单元格坐标偏移 close [#1993](https://github.com/antvis/S2/issues/1993) ([#2047](https://github.com/antvis/S2/issues/2047)) ([2ae663e](https://github.com/antvis/S2/commit/2ae663e1c46a3c8cb04b79d357fc033314f4cf77))
* **layout:** 修复存在多列头多数值且数值置于行头时，列总计单元格高度不对 close [#1715](https://github.com/antvis/S2/issues/1715) [#2049](https://github.com/antvis/S2/issues/2049) ([#2051](https://github.com/antvis/S2/issues/2051)) ([a415f46](https://github.com/antvis/S2/commit/a415f465e8fa355a5b68d556f6fa645e3a72b5b7))
* **layout:** 修复无列头时行头对应的角头不显示 close [#1929](https://github.com/antvis/S2/issues/1929) ([#2026](https://github.com/antvis/S2/issues/2026)) ([c073578](https://github.com/antvis/S2/commit/c073578dc008ef83a2877041830be18f827c7341))

### Features

* tooltip summaries 返回原始数据 ([#2044](https://github.com/antvis/S2/issues/2044)) ([f8efdd9](https://github.com/antvis/S2/commit/f8efdd997b8e76b4aab7615fb16af644a42d3d8e))
* 增加自定义行头最大固定宽度的功能 ([#2069](https://github.com/antvis/S2/issues/2069)) ([4db301d](https://github.com/antvis/S2/commit/4db301db0971fca40e65d43c417ca4a36db66493))

# [@antv/s2-react-v1.36.0](https://github.com/antvis/S2/compare/@antv/s2-react-v1.35.0...@antv/s2-react-v1.36.0) (2023-01-16)

### Bug Fixes

* **layout:** 修复存在列总计但不存在列小计时，隐藏其兄弟节点后单元格坐标偏移 close [#1993](https://github.com/antvis/S2/issues/1993) ([#2047](https://github.com/antvis/S2/issues/2047)) ([2ae663e](https://github.com/antvis/S2/commit/2ae663e1c46a3c8cb04b79d357fc033314f4cf77))
* **layout:** 修复存在多列头多数值且数值置于行头时，列总计单元格高度不对 close [#1715](https://github.com/antvis/S2/issues/1715) [#2049](https://github.com/antvis/S2/issues/2049) ([#2051](https://github.com/antvis/S2/issues/2051)) ([a415f46](https://github.com/antvis/S2/commit/a415f465e8fa355a5b68d556f6fa645e3a72b5b7))
* **layout:** 修复无列头时行头对应的角头不显示 close [#1929](https://github.com/antvis/S2/issues/1929) ([#2026](https://github.com/antvis/S2/issues/2026)) ([c073578](https://github.com/antvis/S2/commit/c073578dc008ef83a2877041830be18f827c7341))

### Features

* tooltip summaries 返回原始数据 ([#2044](https://github.com/antvis/S2/issues/2044)) ([f8efdd9](https://github.com/antvis/S2/commit/f8efdd997b8e76b4aab7615fb16af644a42d3d8e))

# [@antv/s2-react-v1.35.0](https://github.com/antvis/S2/compare/@antv/s2-react-v1.34.0...@antv/s2-react-v1.35.0) (2023-01-03)

### Bug Fixes

* 列头 label 存在数组，复制导出列头层级补齐错误 ([#1990](https://github.com/antvis/S2/issues/1990)) ([ec62409](https://github.com/antvis/S2/commit/ec62409b688c5dd5e39a93f5b292d909496ed830))

### Features

* selected cell highlight ([#1878](https://github.com/antvis/S2/issues/1878)) ([3e11a37](https://github.com/antvis/S2/commit/3e11a37bf94f758379ba2819ec5d8b3251708814))

# [@antv/s2-react-v1.34.0](https://github.com/antvis/S2/compare/@antv/s2-react-v1.33.0...@antv/s2-react-v1.34.0) (2022-12-09)

### Bug Fixes

* **interaction:** 修复自定义列头时无法调整第一列的叶子节点高度 close [#1979](https://github.com/antvis/S2/issues/1979) ([#2038](https://github.com/antvis/S2/issues/2038)) ([a632ab1](https://github.com/antvis/S2/commit/a632ab19193b19ab80f456ab3ce19740dce0e52b))
* 列头 label 存在数组，复制导出列头层级补齐错误 ([#1990](https://github.com/antvis/S2/issues/1990)) ([ec62409](https://github.com/antvis/S2/commit/ec62409b688c5dd5e39a93f5b292d909496ed830))

### Code Refactoring

* 调整 s2Options API 命名 ([#2015](https://github.com/antvis/S2/issues/2015)) ([e39b32f](https://github.com/antvis/S2/commit/e39b32f99befdf53569fab633087bb56edfc8720))

### Features

* selected cell highlight ([#1878](https://github.com/antvis/S2/issues/1878)) ([3e11a37](https://github.com/antvis/S2/commit/3e11a37bf94f758379ba2819ec5d8b3251708814))
* 单元格宽高配置增强 close [#1895](https://github.com/antvis/S2/issues/1895) ([#1981](https://github.com/antvis/S2/issues/1981)) ([ec6736f](https://github.com/antvis/S2/commit/ec6736f108801e1129c4d3fd29d13d1fbff2a1d2))
* 折叠展开重构 & 简化行头 tree 相关配置 ([#2030](https://github.com/antvis/S2/issues/2030)) ([0f3ea3b](https://github.com/antvis/S2/commit/0f3ea3b5c668137bc2fcb53bd186a41b34140e25))
* 暴露 afterRealCellRender，这样能够更灵活的使用 datacell ([#1970](https://github.com/antvis/S2/issues/1970)) ([66c5ab9](https://github.com/antvis/S2/commit/66c5ab9992c51b475be8acaf9a198d49f3114a49))

### BREAKING CHANGES

* s2Options.tooltip 和 s2Options.style API 命名更改，移除 trend 操作项

* refactor: tree 相关配置移动到 rowCell 下

* refactor: hideMeasureColumn => hideValue

* refactor: 冻结相关配置收拢到 forzen 命名空间下

* test: 修复测试

# [@antv/s2-react-v2.0.0-next.2](https://github.com/antvis/S2/compare/@antv/s2-react-v2.0.0-next.1...@antv/s2-react-v2.0.0-next.2) (2022-12-07)

### Bug Fixes

* 列头 label 存在数组，复制导出列头层级补齐错误 ([#1990](https://github.com/antvis/S2/issues/1990)) ([ec62409](https://github.com/antvis/S2/commit/ec62409b688c5dd5e39a93f5b292d909496ed830))

### Features

* selected cell highlight ([#1878](https://github.com/antvis/S2/issues/1878)) ([3e11a37](https://github.com/antvis/S2/commit/3e11a37bf94f758379ba2819ec5d8b3251708814))

# [@antv/s2-react-v1.34.0](https://github.com/antvis/S2/compare/@antv/s2-react-v1.33.0...@antv/s2-react-v1.34.0) (2022-12-09)

### Bug Fixes

* **tooltip:** 修复自定义操作菜单传入自定义 ReactNode 不显示 ([#1969](https://github.com/antvis/S2/issues/1969)) ([3eff993](https://github.com/antvis/S2/commit/3eff9932438cc95093686c03510b57648ff44391))

### Features

* 暴露 afterRealCellRender，这样能够更灵活的使用 datacell ([#1970](https://github.com/antvis/S2/issues/1970)) ([66c5ab9](https://github.com/antvis/S2/commit/66c5ab9992c51b475be8acaf9a198d49f3114a49))

# [@antv/s2-react-v1.33.0](https://github.com/antvis/S2/compare/@antv/s2-react-v1.32.0...@antv/s2-react-v1.33.0) (2022-12-02)

### Bug Fixes

* **interaction:** 修复趋势分析表选中高亮效果无效 close [#1960](https://github.com/antvis/S2/issues/1960) ([#1961](https://github.com/antvis/S2/issues/1961)) ([5140b60](https://github.com/antvis/S2/commit/5140b6060d03b0290ddb4b314e7892520038f369))
* **tooltip:** 修复自定义操作菜单传入自定义 ReactNode 不显示 ([#1969](https://github.com/antvis/S2/issues/1969)) ([3eff993](https://github.com/antvis/S2/commit/3eff9932438cc95093686c03510b57648ff44391))
* 修复所有 lint 错误 ([9b62503](https://github.com/antvis/S2/commit/9b62503ebdf1ef9aa94470c8d18be99122d0c2dc))
* 增加 style 配置为空时的容错 ([#1967](https://github.com/antvis/S2/issues/1967)) ([9250487](https://github.com/antvis/S2/commit/92504874e5f925a2fc2a640194f676c2bd32b55e))

### Features

* **header:** 去除 antd PageHeader 组件依赖 & Header 组件重构 close [#1981](https://github.com/antvis/S2/issues/1981) ([#1957](https://github.com/antvis/S2/issues/1957)) ([a3addd7](https://github.com/antvis/S2/commit/a3addd7494a2002e40c0cd00871bee47bedefb17))

# [@antv/s2-react-v1.32.0](https://github.com/antvis/S2/compare/@antv/s2-react-v1.31.0...@antv/s2-react-v1.32.0) (2022-11-21)

* feat!: 2.0 next 预览版发布 ([de5a406](https://github.com/antvis/S2/commit/de5a406f4fd5e0db23eea46c8e7185589215c195))
* feat!: 2.0 预览版发布 ([9abb76d](https://github.com/antvis/S2/commit/9abb76dd40c65ed2a6a122b6f2b20a9b963c8a58))

### Features

* 2.0 break ([a4ba788](https://github.com/antvis/S2/commit/a4ba788580788909f4fcfee98f3d7387dd883c4a))
* 2.0.0 next ([fe0aca3](https://github.com/antvis/S2/commit/fe0aca341f9c37e3a85e622a6eb30c9da5e02a96))
* **layout:** 自定义行列头 ([#1719](https://github.com/antvis/S2/issues/1719)) ([2e0746d](https://github.com/antvis/S2/commit/2e0746dc9ca4ec45d50b35a9408b8827252c1bfa))
* **total:** 全量移除所有 totalData 配置 ([#1799](https://github.com/antvis/S2/issues/1799)) ([23cc219](https://github.com/antvis/S2/commit/23cc21933e02d5da6b261afe1fe1bc67008054d8))
* version break ([064c0de](https://github.com/antvis/S2/commit/064c0de861f2e87814acf394cbdf6305397d476d))
* 升级的渲染引擎 g5.0 ([#1924](https://github.com/antvis/S2/issues/1924)) ([820a310](https://github.com/antvis/S2/commit/820a310998bae5c0324c2f3144747f7dbe0097d1)), closes [#1852](https://github.com/antvis/S2/issues/1852) [#1862](https://github.com/antvis/S2/issues/1862)
* 移动端组件适配 ([#1833](https://github.com/antvis/S2/issues/1833)) ([bd2e71e](https://github.com/antvis/S2/commit/bd2e71e0d1d55057af77d435a10730b7ac929324))

* G5.0, 透视表自定义行列头，数据流重构
* G5.0, 行列头自定义，数据流
* 2.0-next
* 2.0
* <https://github.com/antvis/S2/discussions/1933>

### Features

* **interaction:** 角头有省略号时 hover 后显示 tooltip ([#1889](https://github.com/antvis/S2/issues/1889)) ([1bd307a](https://github.com/antvis/S2/commit/1bd307ae913c82fd241057366530d16b51abfe69))

# [@antv/s2-react-v1.30.0](https://github.com/antvis/S2/compare/@antv/s2-react-v1.29.0...@antv/s2-react-v1.30.0) (2022-10-24)

### Bug Fixes

* customFilter 执行时不再执行 defaultFilter ([#1814](https://github.com/antvis/S2/issues/1814)) ([21710b2](https://github.com/antvis/S2/commit/21710b260dc41039e832d48d673a63dc21c60454))
* **interaction:** 修复滚动刷选 onDataCellBrushSelection 未透出正确的单元格 close [#1817](https://github.com/antvis/S2/issues/1817) ([#1825](https://github.com/antvis/S2/issues/1825)) ([5866ba1](https://github.com/antvis/S2/commit/5866ba1d33daa144a18f2771f77785c524fe67c3))
* 修复 SheetComponent 未使用 getSpreadSheet 也会报 warning 的问题 ([#1843](https://github.com/antvis/S2/issues/1843)) ([47765b8](https://github.com/antvis/S2/commit/47765b8eca7cdfe580ad341a7b4da9cfc4097b24))
* 修复 open 属性冲突的问题 close [#1736](https://github.com/antvis/S2/issues/1736) ([#1831](https://github.com/antvis/S2/issues/1831)) ([71b19b9](https://github.com/antvis/S2/commit/71b19b9377ea94527bdb32d7e293a58bf0cedce4))

### Features

* 组件层新增 onMounted 事件 ([#1830](https://github.com/antvis/S2/issues/1830)) ([0758160](https://github.com/antvis/S2/commit/0758160833c6be06c96dc851cab4605dd709e8ad))

### Reverts

* Revert "chore(release): 🔖@antv/s2@1.32.0 @antv/s2-react@1.29.0 @antv/s2-vue@1…" (#1846) ([7b0bcea](https://github.com/antvis/S2/commit/7b0bceab42acf8dae4a437f86148207848502c8b)), closes [#1846](https://github.com/antvis/S2/issues/1846) [#1844](https://github.com/antvis/S2/issues/1844)

# [@antv/s2-react-v1.29.0](https://github.com/antvis/S2/compare/@antv/s2-react-v1.28.0...@antv/s2-react-v1.29.0) (2022-10-14)

### Bug Fixes

* **tooltip:** tooltip 显示时不应该强制清空 dom ([#1816](https://github.com/antvis/S2/issues/1816)) ([98c95d8](https://github.com/antvis/S2/commit/98c95d8ab11df26a9618921d36bb9ce732495fcd))

### Features

* ✨ 表头单元格支持字段标记 ([#1809](https://github.com/antvis/S2/issues/1809)) ([307c5f9](https://github.com/antvis/S2/commit/307c5f9227351e57dca3f1d061ddca6be52c734d))

# [@antv/s2-react-v1.28.0](https://github.com/antvis/S2/compare/@antv/s2-react-v1.27.0...@antv/s2-react-v1.28.0) (2022-10-02)

### Bug Fixes

* **sort:** 修复 tooltip 中排序菜单未记住上一次选中状态 close [#1716](https://github.com/antvis/S2/issues/1716) ([#1746](https://github.com/antvis/S2/issues/1746)) ([67e09c4](https://github.com/antvis/S2/commit/67e09c43b6508cbd141dc47fedbebfbc247cbb3f))

### Features

* **strategysheet:** 支持自定义衍生指标 ([#1762](https://github.com/antvis/S2/issues/1762)) ([97e5124](https://github.com/antvis/S2/commit/97e512404bd5d171c581a53c92d130ef15e9e907))
* 初版编辑表 ([#1629](https://github.com/antvis/S2/issues/1629)) ([e7bd849](https://github.com/antvis/S2/commit/e7bd84935fe8dcabc8daf853953dc93680a9b448))

# [@antv/s2-react-v1.27.0](https://github.com/antvis/S2/compare/@antv/s2-react-v1.26.1...@antv/s2-react-v1.27.0) (2022-09-16)

### Bug Fixes

* 修复多指标单元格展示错误 ([#1754](https://github.com/antvis/S2/issues/1754)) ([228e101](https://github.com/antvis/S2/commit/228e101e37ab341886427dbbc7d7f3858e778dc5))

### Features

* **strategysheet:** 趋势分析表 tooltip 支持显示原始值 ([#1750](https://github.com/antvis/S2/issues/1750)) ([e757b99](https://github.com/antvis/S2/commit/e757b999a85a15d53dfa72bde2805b6b193dcd62))

# [@antv/s2-react-v1.26.1](https://github.com/antvis/S2/compare/@antv/s2-react-v1.26.0...@antv/s2-react-v1.26.1) (2022-09-13)

### Bug Fixes

* 修复表格 onDestroy 卸载事件无法触发 ([#1733](https://github.com/antvis/S2/issues/1733)) ([2195f1a](https://github.com/antvis/S2/commit/2195f1aec681085ec32ee1446b780e00af901c47))
* 修复趋势分析表多列头情况下，单元格数据为空引起的复制数据偏移问题 ([#1743](https://github.com/antvis/S2/issues/1743)) ([52ff51c](https://github.com/antvis/S2/commit/52ff51ccb350998eb01330a346c7abfc1e8ba579))
* 修复闭包导致的 pagination 被错误重置的问题 ([#1739](https://github.com/antvis/S2/issues/1739)) ([6cfad06](https://github.com/antvis/S2/commit/6cfad06f73d49c8f57a966a145846e383130351f))

# [@antv/s2-react-v1.26.0](https://github.com/antvis/S2/compare/@antv/s2-react-v1.25.0...@antv/s2-react-v1.26.0) (2022-09-05)

### Bug Fixes

* **types:** 修复严格模式下 S2Options 类型报错 ([#1723](https://github.com/antvis/S2/issues/1723)) ([ef55f55](https://github.com/antvis/S2/commit/ef55f559f940614b19f76fbc5c941e114f220461))
* 修复 pagination 组件属性透传问题，简化 usePagination 逻辑 ([#1722](https://github.com/antvis/S2/issues/1722)) ([287753d](https://github.com/antvis/S2/commit/287753d9b960031ee49b08747144a71056a5e503))
* 修复 tooltip 点击空白无法消失的问题 ([#1729](https://github.com/antvis/S2/issues/1729)) ([baa7245](https://github.com/antvis/S2/commit/baa72454702f34ccd9dc5957e8574b8e38087c62))

### Features

* 导出组件层 CustomTooltip 类 ([#1726](https://github.com/antvis/S2/issues/1726)) ([46270ab](https://github.com/antvis/S2/commit/46270ab0ae6e42cf92dcf77c0a35a70e07b9b10c))

# [@antv/s2-react-v1.25.0](https://github.com/antvis/S2/compare/@antv/s2-react-v1.24.0...@antv/s2-react-v1.25.0) (2022-08-29)

### Bug Fixes

* **pagination:** 透传组件分页参数 & 修复国际化不生效 close [#1697](https://github.com/antvis/S2/issues/1697) ([#1698](https://github.com/antvis/S2/issues/1698)) ([be334fc](https://github.com/antvis/S2/commit/be334fcef6a11d08358f007eba805cbd380560d5))

### Features

* 在树状模式下，增加默认展开层级的配置 ([#1703](https://github.com/antvis/S2/issues/1703)) ([bb1aaf1](https://github.com/antvis/S2/commit/bb1aaf1f5266ec6d6d76c3f7a97e236f4a3c15d3))

# [@antv/s2-react-v1.24.0](https://github.com/antvis/S2/compare/@antv/s2-react-v1.23.0...@antv/s2-react-v1.24.0) (2022-08-15)

### Bug Fixes

* **scroll:** 修复滚动条显示越界 & 优化滚动性能 ([#1671](https://github.com/antvis/S2/issues/1671)) ([cfbccb9](https://github.com/antvis/S2/commit/cfbccb93aaa78edbcf1e7860b940a5431ead8b7a))
* **scroll:** 修复滚动边界判断错误导致无法滚动 ([#1664](https://github.com/antvis/S2/issues/1664)) ([cf4b8b3](https://github.com/antvis/S2/commit/cf4b8b3e05fa7cf4d5386a3d4a1ad6d98c5179ce))
* 修复明细表 onRaneSort 失效问题 ([#1678](https://github.com/antvis/S2/issues/1678)) ([3563f3c](https://github.com/antvis/S2/commit/3563f3c9a48998827722babb265e7889b7a86a20))
* 修复趋势分析表对于不同个数同环比列头复制时，数据不对齐的问题 ([#1679](https://github.com/antvis/S2/issues/1679)) ([ba88dec](https://github.com/antvis/S2/commit/ba88dec2c2ef9506264c64ba069685c0bd9a4c67))

### Features

* 刷选时支持高亮所有对应的行列头 cell ([#1680](https://github.com/antvis/S2/issues/1680)) ([c7fb53f](https://github.com/antvis/S2/commit/c7fb53f403608e5194d745408966cc9b18c92025))

# [@antv/s2-react-v1.23.0](https://github.com/antvis/S2/compare/@antv/s2-react-v1.22.0...@antv/s2-react-v1.23.0) (2022-08-05)

### Bug Fixes

* **layout:** 修复 treeWidth 配置不生效 close [#1622](https://github.com/antvis/S2/issues/1622) ([#1646](https://github.com/antvis/S2/issues/1646)) ([9e70d62](https://github.com/antvis/S2/commit/9e70d62549da5e14d40d373d23d8592763c550a3))
* **pagination:** 分页配置未传 current 参数时表格渲染空白 ([#1633](https://github.com/antvis/S2/issues/1633)) ([1c65443](https://github.com/antvis/S2/commit/1c654437073071c1fb8b118018b3007922d198f4))
* **strategysheet:** 修复趋势分析表列头格式化不生效 ([#1616](https://github.com/antvis/S2/issues/1616)) ([ca3cbb5](https://github.com/antvis/S2/commit/ca3cbb58da57d7989654bb982e6a508d0fd3a42a))

### Features

* **interaction:** 宽高调整事件透出 resizedWidth/resizedHeight, 修复错误类型定义 ([#1638](https://github.com/antvis/S2/issues/1638)) ([fbf45df](https://github.com/antvis/S2/commit/fbf45dfffaf7b17409010c16c7f6a5bb73133197))

# [@antv/s2-react-v1.22.0](https://github.com/antvis/S2/compare/@antv/s2-react-v1.21.0...@antv/s2-react-v1.22.0) (2022-07-22)

### Bug Fixes

* **layout:** 修复 Firefox 浏览器部分 icon 渲染失败 close [#1571](https://github.com/antvis/S2/issues/1571) ([#1599](https://github.com/antvis/S2/issues/1599)) ([6b76c4e](https://github.com/antvis/S2/commit/6b76c4e2c80b88eeb63d7adfc6b48da7d0b3ea4c))
* **strategysheet:** 修复单元格宽度拖拽变小后子弹图宽度计算错误 ([#1584](https://github.com/antvis/S2/issues/1584)) ([99b8593](https://github.com/antvis/S2/commit/99b859392c7151d5700bf1c505a02f795b9a3f80))
* **strategysheet:** 修复子弹图进度小于 1% 时显示错误的问题 ([#1563](https://github.com/antvis/S2/issues/1563)) ([936ca6a](https://github.com/antvis/S2/commit/936ca6a3a7bf40ddc0ff1a0271c3a5ffb1091dcf))
* **strategysheet:** 修复子弹图颜色显示错误 & 百分比精度问题 ([#1588](https://github.com/antvis/S2/issues/1588)) ([c4bb48c](https://github.com/antvis/S2/commit/c4bb48cbe128b47e3574af903142934fd7452846))
* **strategysheet:** 修复趋势分析表错误的标题 ([#1556](https://github.com/antvis/S2/issues/1556)) ([d9ebb51](https://github.com/antvis/S2/commit/d9ebb51f39953ae5535c7c925cfdcef1fb9c2e0d))
* 下钻个数为-1 时应展示全部下钻数据 ([#1557](https://github.com/antvis/S2/issues/1557)) ([13caa5b](https://github.com/antvis/S2/commit/13caa5b5ad2c08c7c98685a97fb34dc8f04c7fe5))
* 修复趋势分析表导出问题 ([#1553](https://github.com/antvis/S2/issues/1553)) ([457c378](https://github.com/antvis/S2/commit/457c378ae346eb19a3d7822fd887eafecced420c))

### Features

* **interaction:** 行列宽高支持控制拖拽范围 ([#1583](https://github.com/antvis/S2/issues/1583)) ([1d51272](https://github.com/antvis/S2/commit/1d51272ee339f2c31b6236e16406c1b52f57a3b9))
* **strategysheet:** 趋势分析表允许对行头和列头的 tooltip 做自定义 ([#1552](https://github.com/antvis/S2/issues/1552)) ([abfa98b](https://github.com/antvis/S2/commit/abfa98bca5e2528040e1cdfbde0f55e4e1298d0b))
* **tooltip:** 支持设置多个 class 类名 ([#1546](https://github.com/antvis/S2/issues/1546)) ([1fb22c6](https://github.com/antvis/S2/commit/1fb22c64f32d739acbf9dee681b126a703b38a20))
* 增加允许/禁用指标在行列维度中相互切换的能力 ([#1558](https://github.com/antvis/S2/issues/1558)) ([39f0f89](https://github.com/antvis/S2/commit/39f0f89cc999313d55077c06f72da13dab1f1316))

# [@antv/s2-react-v1.21.0](https://github.com/antvis/S2/compare/@antv/s2-react-v1.20.0...@antv/s2-react-v1.21.0) (2022-07-08)

### Bug Fixes

* **drill-down:** values 配置为空时未显示下钻 icon ([#1535](https://github.com/antvis/S2/issues/1535)) ([8a1d27c](https://github.com/antvis/S2/commit/8a1d27c1a517e7a04d1037ef95b57450adc7df2c))
* **interaction:** 修复链接跳转会触发单选和 Tooltip 显示的问题 ([#1498](https://github.com/antvis/S2/issues/1498)) ([ebcb0c2](https://github.com/antvis/S2/commit/ebcb0c2c663da89c457a2149f6bc19fbde2ab8c9))
* **strategysheet:** 修复趋势分析表无法自定义 Tooltip ([#1523](https://github.com/antvis/S2/issues/1523)) ([6b47b05](https://github.com/antvis/S2/commit/6b47b052560ba0a6e3d20236770ee97bca535c61))
* **theme:** 修复调整序号列后色板丢失 close [#1538](https://github.com/antvis/S2/issues/1538) ([#1543](https://github.com/antvis/S2/issues/1543)) ([6678848](https://github.com/antvis/S2/commit/6678848094c5c707a5586b33117bfd0b968fc302))
* 优化 mini 图坐标计算逻辑 ([#1534](https://github.com/antvis/S2/issues/1534)) ([88a61e0](https://github.com/antvis/S2/commit/88a61e08b70750401d86e99dd5a6d320a1390da8))
* 趋势分析表 conditions 增加容错能力 ([#1537](https://github.com/antvis/S2/issues/1537)) ([4770c9a](https://github.com/antvis/S2/commit/4770c9af5025f2318ca4c9d02f8217ada83fd00c))

### Features

* **strategysheet:** 趋势分析表 Tooltip 增加 label 属性用于自定义标题 ([#1540](https://github.com/antvis/S2/issues/1540)) ([b44ffe3](https://github.com/antvis/S2/commit/b44ffe3dd03bc23dfbf8ba8828dc5e1b90a50310))
* 基础表、趋势分析表 tooltip 新增显示字段说明功能 ([#1541](https://github.com/antvis/S2/issues/1541)) ([3a9f3cb](https://github.com/antvis/S2/commit/3a9f3cb2f22aeb14b15b8d3fe79f107ff8f04516))
* 支持 绘制 mini 柱状图 ([#1505](https://github.com/antvis/S2/issues/1505)) ([24a6ca6](https://github.com/antvis/S2/commit/24a6ca643e3b1154e4093c15216b218ef02cf3df))

# [@antv/s2-react-v1.20.0](https://github.com/antvis/S2/compare/@antv/s2-react-v1.19.0...@antv/s2-react-v1.20.0) (2022-06-24)

### Bug Fixes

* **strategysheet:** 修复趋势分析表多列头切换为单列头后，隐藏列头功能失效 ([#1470](https://github.com/antvis/S2/issues/1470)) ([b39742e](https://github.com/antvis/S2/commit/b39742e3a7276836c504f2a0d5343ff201a65bba))
* 趋势表自定义列头数值误用数据单元格样式 ([#1479](https://github.com/antvis/S2/issues/1479)) ([c23e105](https://github.com/antvis/S2/commit/c23e105b6d633cd2b66ac3a8618851923be7d1be))

### Features

* **interaction:** 增加行头单元格和全局单元格滚动事件及文档 ([#1483](https://github.com/antvis/S2/issues/1483)) ([329aaa6](https://github.com/antvis/S2/commit/329aaa6c9f9ae926f392e3e8f676af1ec201cce2))
* **interaction:** 添加 onDataCellSelectMove 事件 ([#1468](https://github.com/antvis/S2/issues/1468)) ([da2a78e](https://github.com/antvis/S2/commit/da2a78ec511a85380824fa2b7147854e857df7f3))
* s2-vue 添加下钻组件 ([#1471](https://github.com/antvis/S2/issues/1471)) ([7f42b82](https://github.com/antvis/S2/commit/7f42b82264230f4b914adc39277e8ca6fbcf0cd3))
* **tooltip:** 支持额外的样式和类名 & 修复内容过长 tooltip 展示不全的问题 ([#1478](https://github.com/antvis/S2/issues/1478)) ([e3103d7](https://github.com/antvis/S2/commit/e3103d7a5499871f22bacf47bf7dbb89a947ff59))
* 支持绘制 mini 折线图 ([#1484](https://github.com/antvis/S2/issues/1484)) ([cfa5987](https://github.com/antvis/S2/commit/cfa5987f48ce3cc434e953fef00837e1fc617400))
* 明细表的 getCellData 可获取单行数据 ([#1482](https://github.com/antvis/S2/issues/1482)) ([c3e1662](https://github.com/antvis/S2/commit/c3e16622cf5e1247a5503c92e694adc7d047a321))
* 明细表趋势图透出点击透出整行数据 ([#1485](https://github.com/antvis/S2/issues/1485)) ([ea82780](https://github.com/antvis/S2/commit/ea827809e333d37a7301fac4785add8d87ca4c0e))

# [@antv/s2-react-v1.19.0](https://github.com/antvis/S2/compare/@antv/s2-react-v1.18.0...@antv/s2-react-v1.19.0) (2022-06-20)

### Bug Fixes

* **interaction:** 修复禁用多选后，未对行/列头生效 ([#1461](https://github.com/antvis/S2/issues/1461)) ([6dab9da](https://github.com/antvis/S2/commit/6dab9da19c9fd53bdd5198f18abe7c00f12f061e))

### Features

* **strategy-sheet:** 子弹图支持显示 Tooltip ([#1450](https://github.com/antvis/S2/issues/1450)) ([15a0799](https://github.com/antvis/S2/commit/15a0799a17893610a7aa8b4550e6d3647ad3a2b2))

# [@antv/s2-react-v1.18.0](https://github.com/antvis/S2/compare/@antv/s2-react-v1.17.0...@antv/s2-react-v1.18.0) (2022-06-17)

### Bug Fixes

* **tooltip:** 修复行/列层级超过 2 级时选中数据统计错误 ([#1443](https://github.com/antvis/S2/issues/1443)) ([09dd677](https://github.com/antvis/S2/commit/09dd677458c904f7b86c8457a489bca26a366269))
* **tooltip:** 减少 tooltip 框重绘 ([#1418](https://github.com/antvis/S2/issues/1418)) ([59c6a87](https://github.com/antvis/S2/commit/59c6a87f256866962ea3b523fd882a8d4e1eb6e9))
* 修复打包 core 层源码中样式文件错误问题 ([#1408](https://github.com/antvis/S2/issues/1408)) ([d2c0894](https://github.com/antvis/S2/commit/d2c08949d22dc61dbc73e01a779756e1d7a78fb6))

### Features

* **scroll:** 增加边界滚动配置，解决横屏滚动会触发 mac 回退的问题 ([#1409](https://github.com/antvis/S2/issues/1409)) ([ada5082](https://github.com/antvis/S2/commit/ada5082d299357b1b38af7629a784e3d071e6b77))

# [@antv/s2-react-v1.17.0](https://github.com/antvis/S2/compare/@antv/s2-react-v1.16.1...@antv/s2-react-v1.17.0) (2022-06-02)

### Bug Fixes

* **locale:** 修复国际化配置不生效 close [#1394](https://github.com/antvis/S2/issues/1394) ([#1397](https://github.com/antvis/S2/issues/1397)) ([cfd5dbe](https://github.com/antvis/S2/commit/cfd5dbe0344afbb6f3929bece1778c02f9bbc00b))
* style 引入失败 ([#1390](https://github.com/antvis/S2/issues/1390)) ([7d11561](https://github.com/antvis/S2/commit/7d11561039f33c897910bacab2cf8ce20b8543d0))
* 修复表格卸载后调用实例方法报错的问题 close [#1349](https://github.com/antvis/S2/issues/1349) ([#1400](https://github.com/antvis/S2/issues/1400)) ([bcf21bb](https://github.com/antvis/S2/commit/bcf21bb2099e04496c76b9cd28fa6d7723c9edcb))

### Features

* 趋势分析表支持子弹图配置 ([#1367](https://github.com/antvis/S2/issues/1367)) ([b5756cc](https://github.com/antvis/S2/commit/b5756cc2f4d2054f3d5a8eb31134efd23b1dd230))

# [@antv/s2-react-v1.16.1](https://github.com/antvis/S2/compare/@antv/s2-react-v1.16.0...@antv/s2-react-v1.16.1) (2022-05-30)

### Bug Fixes

* style 引入失败 ([8ee0a0b](https://github.com/antvis/S2/commit/8ee0a0b21c99d6f7bdf4a5d9fb91f9eaedf8d00f))

# [@antv/s2-react-v1.16.0](https://github.com/antvis/S2/compare/@antv/s2-react-v1.15.1...@antv/s2-react-v1.16.0) (2022-05-30)

### Bug Fixes

* **interaction:** 修复自定义单元格有自定义图片时无法触发点击 close [#1360](https://github.com/antvis/S2/issues/1360) ([#1365](https://github.com/antvis/S2/issues/1365)) ([685cd04](https://github.com/antvis/S2/commit/685cd0458e33d189ced36eb708c8ed697f3d024c))
* **interaction:** 修复默认隐藏列的配置更新为空数组时，未触发表格更新 ([#1351](https://github.com/antvis/S2/issues/1351)) ([7ed1011](https://github.com/antvis/S2/commit/7ed101152caa180cc7090861f4fbf7f774148a23))
* **strategysheet:** 修复趋势分析表多列头时叶子节点未和数值单元格对齐 ([#1371](https://github.com/antvis/S2/issues/1371)) ([2d3ff04](https://github.com/antvis/S2/commit/2d3ff047b414b5861203d39b5f3db23fe1307c16))
* **tooltip:** 修复存在小计/总计时汇总数据计算错误 close [#1137](https://github.com/antvis/S2/issues/1137) ([#1346](https://github.com/antvis/S2/issues/1346)) ([f6e5e8c](https://github.com/antvis/S2/commit/f6e5e8c1b05563dee29e926887aa08ef92bd4302))
* 下钻数据没有按照用户数据展示 ([#1353](https://github.com/antvis/S2/issues/1353)) ([065c3bd](https://github.com/antvis/S2/commit/065c3bdea3625232de7d98797ef7266eea74f67c))
* 不应以 mutable 的方式修改 headerActionIcons ([#1331](https://github.com/antvis/S2/issues/1331)) ([518456e](https://github.com/antvis/S2/commit/518456e7ec7ce7e9e5d91237f8092250b9a585d3))

### Features

* **theme:** 新增度量值的主题配置，修复小计总计主题配置不生效 close [#1357](https://github.com/antvis/S2/issues/1357) ([#1364](https://github.com/antvis/S2/issues/1364)) ([ef3f99e](https://github.com/antvis/S2/commit/ef3f99e312b2f0a49b9d5928084c842718ae23be))
* Vue 1.0 ([#1290](https://github.com/antvis/S2/issues/1290)) ([0745836](https://github.com/antvis/S2/commit/07458368d7eafd3ddee168d5b2adca463374ab5a))
* 丰富 tooltip 关闭的验证逻辑 ([#1352](https://github.com/antvis/S2/issues/1352)) ([264a9e9](https://github.com/antvis/S2/commit/264a9e93d586f8b8c5498af912c6a31aa4da8f04))
* 新增 "如何用 S2 买房" demo ([#1383](https://github.com/antvis/S2/issues/1383)) ([1e790dc](https://github.com/antvis/S2/commit/1e790dc4eb16b292d22dcf5233e199913ff1c17d))

### Reverts

* Revert "chore(release): @antv/s2@1.18.0 @antv/s2-react@1.16.0 @antv/s2-vue@1.0.0 (#1384)" (#1386) ([60cdf6a](https://github.com/antvis/S2/commit/60cdf6abe7fb3b44f831051bd55622587a0f5bf8)), closes [#1384](https://github.com/antvis/S2/issues/1384) [#1386](https://github.com/antvis/S2/issues/1386)

# [@antv/s2-react-v1.15.1](https://github.com/antvis/S2/compare/@antv/s2-react-v1.15.0...@antv/s2-react-v1.15.1) (2022-05-13)

### Bug Fixes

* **interaction:** 角头单元格增加对自定义 tooltip 的适配 ([#1322](https://github.com/antvis/S2/issues/1322)) ([11c8e48](https://github.com/antvis/S2/commit/11c8e48d37e4e08742ba2d0dbeccfc99a694beff))

# [@antv/s2-react-v1.15.0](https://github.com/antvis/S2/compare/@antv/s2-react-v1.14.0...@antv/s2-react-v1.15.0) (2022-05-06)

### Features

* 允许条件设置数据单元格为空的占位符 ([#1309](https://github.com/antvis/S2/issues/1309)) ([397caf1](https://github.com/antvis/S2/commit/397caf18e3eec7c82bd4f4bb7a6987839474a425))

# [@antv/s2-react-v1.14.0](https://github.com/antvis/S2/compare/@antv/s2-react-v1.13.0...@antv/s2-react-v1.14.0) (2022-04-22)

### Bug Fixes

* headerActionIcons 更新不应清除上一次下钻数据 ([#1254](https://github.com/antvis/S2/issues/1254)) ([92837fa](https://github.com/antvis/S2/commit/92837faadb532b42be164327ca510c47cf2ae336))
* **theme:**  修复颜色主题配置对自定义 icon 不生效的问题 ([#1261](https://github.com/antvis/S2/issues/1261)) ([ad52a03](https://github.com/antvis/S2/commit/ad52a03d1a59fbf87fe9dd2c14482f37181a4454))
* 修复 switcher 组件布局问题 ([#1270](https://github.com/antvis/S2/issues/1270)) ([8cd28fc](https://github.com/antvis/S2/commit/8cd28fc1e0a91ab8b969200e191a26c407513fc1))
* 修复交叉表分页问题 ([#1260](https://github.com/antvis/S2/issues/1260)) ([a8142b9](https://github.com/antvis/S2/commit/a8142b961e7c839a2de60aea232209f815f5d32d))

### Features

* **interaction:** 支持透传 addEventListener 的可选参数 ([#1262](https://github.com/antvis/S2/issues/1262)) ([d6bc064](https://github.com/antvis/S2/commit/d6bc064e971f8e0a18e8590931f6bff8fadabe44))
* **switcher:** add disabled property ([#1217](https://github.com/antvis/S2/issues/1217)) ([5c0f8fb](https://github.com/antvis/S2/commit/5c0f8fb741f4f4f5a2b726c52d796f8a7fa835f3))
* 增加根据主题色生成对应主题风格色板功能 ([#1190](https://github.com/antvis/S2/issues/1190)) ([4c81fa3](https://github.com/antvis/S2/commit/4c81fa3d0ac2c9563f022560cae75335c453b218))
* 新增 hoverFocusTime 配置项 ([#1281](https://github.com/antvis/S2/issues/1281)) ([b7636cb](https://github.com/antvis/S2/commit/b7636cb038a9a74bbce1dd81781db9128047693d))

# [@antv/s2-react-v1.14.0-alpha.5](https://github.com/antvis/S2/compare/@antv/s2-react-v1.14.0-alpha.4...@antv/s2-react-v1.14.0-alpha.5) (2022-04-21)

# [@antv/s2-react-v1.13.0](https://github.com/antvis/S2/compare/@antv/s2-react-v1.12.1...@antv/s2-react-v1.13.0) (2022-04-08)

### Bug Fixes

* headerActionIcons 更新覆盖了下钻 icon 展示 ([#1222](https://github.com/antvis/S2/issues/1222)) ([514f4db](https://github.com/antvis/S2/commit/514f4db087bc5d3e1c5d7faa0960c2d0ea773821))
* pagination 从 null 变为非空时未触发 total 更新 ([#1216](https://github.com/antvis/S2/issues/1216)) ([2baae0c](https://github.com/antvis/S2/commit/2baae0c84af894c9e1c4b180d91db942488f1511))

### Features

* 支持自定义角头的虚拟数值字段文本 close [#1212](https://github.com/antvis/S2/issues/1212) ([#1223](https://github.com/antvis/S2/issues/1223)) ([84bc978](https://github.com/antvis/S2/commit/84bc9786bf1391a9e7afd21888618403e7f786d3))

# [@antv/s2-react-v1.12.1](https://github.com/antvis/S2/compare/@antv/s2-react-v1.12.0...@antv/s2-react-v1.12.1) (2022-03-25)

### Bug Fixes

* **theme:**  修复颜色主题配置对自定义 icon 不生效的问题 ([#1261](https://github.com/antvis/S2/issues/1261)) ([ad52a03](https://github.com/antvis/S2/commit/ad52a03d1a59fbf87fe9dd2c14482f37181a4454))

### Features

* 增加根据主题色生成对应主题风格色板功能 ([#1190](https://github.com/antvis/S2/issues/1190)) ([4c81fa3](https://github.com/antvis/S2/commit/4c81fa3d0ac2c9563f022560cae75335c453b218))

# [@antv/s2-react-v1.14.0-alpha.4](https://github.com/antvis/S2/compare/@antv/s2-react-v1.14.0-alpha.3...@antv/s2-react-v1.14.0-alpha.4) (2022-04-18)

### Features

* **interaction:** 支持透传 addEventListener 的可选参数 ([#1262](https://github.com/antvis/S2/issues/1262)) ([d6bc064](https://github.com/antvis/S2/commit/d6bc064e971f8e0a18e8590931f6bff8fadabe44))

# [@antv/s2-react-v1.14.0-alpha.3](https://github.com/antvis/S2/compare/@antv/s2-react-v1.14.0-alpha.2...@antv/s2-react-v1.14.0-alpha.3) (2022-04-15)

### Bug Fixes

* 修复交叉表分页问题 ([#1260](https://github.com/antvis/S2/issues/1260)) ([a8142b9](https://github.com/antvis/S2/commit/a8142b961e7c839a2de60aea232209f815f5d32d))

# [@antv/s2-react-v1.14.0-alpha.2](https://github.com/antvis/S2/compare/@antv/s2-react-v1.14.0-alpha.1...@antv/s2-react-v1.14.0-alpha.2) (2022-04-14)

### Bug Fixes

* headerActionIcons 更新不应清除上一次下钻数据 ([#1254](https://github.com/antvis/S2/issues/1254)) ([92837fa](https://github.com/antvis/S2/commit/92837faadb532b42be164327ca510c47cf2ae336))

# [@antv/s2-react-v1.14.0-alpha.1](https://github.com/antvis/S2/compare/@antv/s2-react-v1.13.0...@antv/s2-react-v1.14.0-alpha.1) (2022-04-11)

### Features

* 增加根据主题色生成对应主题风格色板功能 ([9928227](https://github.com/antvis/S2/commit/992822784d65611eed2a1aa80d685e1b0a6d48c3))

# [@antv/s2-react-v1.13.0](https://github.com/antvis/S2/compare/@antv/s2-react-v1.12.1...@antv/s2-react-v1.13.0) (2022-04-08)

### Bug Fixes

* headerActionIcons 更新覆盖了下钻 icon 展示 ([#1222](https://github.com/antvis/S2/issues/1222)) ([514f4db](https://github.com/antvis/S2/commit/514f4db087bc5d3e1c5d7faa0960c2d0ea773821))
* pagination 从 null 变为非空时未触发 total 更新 ([#1216](https://github.com/antvis/S2/issues/1216)) ([2baae0c](https://github.com/antvis/S2/commit/2baae0c84af894c9e1c4b180d91db942488f1511))

### Features

* 支持自定义角头的虚拟数值字段文本 close [#1212](https://github.com/antvis/S2/issues/1212) ([#1223](https://github.com/antvis/S2/issues/1223)) ([84bc978](https://github.com/antvis/S2/commit/84bc9786bf1391a9e7afd21888618403e7f786d3))

# [@antv/s2-react-v1.12.1](https://github.com/antvis/S2/compare/@antv/s2-react-v1.12.0...@antv/s2-react-v1.12.1) (2022-03-25)

### Bug Fixes

* 未开启自适应，改变浏览器窗口大小，会导致表格重新渲染 close [#1197](https://github.com/antvis/S2/issues/1197) ([#1200](https://github.com/antvis/S2/issues/1200)) ([cfb8eaa](https://github.com/antvis/S2/commit/cfb8eaa5e07490a4935959f714efa33252ddc19a))

# [@antv/s2-react-v1.12.0](https://github.com/antvis/S2/compare/@antv/s2-react-v1.11.3...@antv/s2-react-v1.12.0) (2022-03-18)

* 增加根据主题色生成对应主题风格色板功能 ([9928227](https://github.com/antvis/S2/commit/992822784d65611eed2a1aa80d685e1b0a6d48c3))

# [@antv/s2-react-v1.12.1](https://github.com/antvis/S2/compare/@antv/s2-react-v1.12.0...@antv/s2-react-v1.12.1) (2022-03-25)

### Bug Fixes

* 未开启自适应，改变浏览器窗口大小，会导致表格重新渲染 close [#1197](https://github.com/antvis/S2/issues/1197) ([#1200](https://github.com/antvis/S2/issues/1200)) ([cfb8eaa](https://github.com/antvis/S2/commit/cfb8eaa5e07490a4935959f714efa33252ddc19a))

# [@antv/s2-react-v1.12.0](https://github.com/antvis/S2/compare/@antv/s2-react-v1.11.3...@antv/s2-react-v1.12.0) (2022-03-18)

### Bug Fixes

* **adaptive:** 修复开启自适应后 组件在 Safari 上无法渲染的问题 close [#1164](https://github.com/antvis/S2/issues/1164) ([#1195](https://github.com/antvis/S2/issues/1195)) ([c0414ec](https://github.com/antvis/S2/commit/c0414ec69479fe8d11ca8160a8326e1771287a77))
* **react:** 修复宽高改变后未重新渲染表格的问题 close [#1193](https://github.com/antvis/S2/issues/1193) ([#1194](https://github.com/antvis/S2/issues/1194)) ([7a1887f](https://github.com/antvis/S2/commit/7a1887ff8527160b6114b24ff944c987505277fb))
* 修复一些包之间的依赖问题 ([#1140](https://github.com/antvis/S2/issues/1140)) ([1952ecf](https://github.com/antvis/S2/commit/1952ecf070b4b6c1271c3bb6bfc5c37da9f08b6a))

### Features

* 趋势分析表支持列展示不同数量的指标 ([#1185](https://github.com/antvis/S2/issues/1185)) ([5692176](https://github.com/antvis/S2/commit/569217685e92b87e69bab6741422a23ea603cd45))

# [@antv/s2-react-v1.11.3](https://github.com/antvis/S2/compare/@antv/s2-react-v1.11.2...@antv/s2-react-v1.11.3) (2022-03-16)

### Bug Fixes

* 修复趋势分析表空数据不渲染问题 ([#1180](https://github.com/antvis/S2/issues/1180)) ([0b7c54b](https://github.com/antvis/S2/commit/0b7c54be03f43a2c422ea01bf78b326c9b31c0ae))

# [@antv/s2-react-v1.11.2](https://github.com/antvis/S2/compare/@antv/s2-react-v1.11.1...@antv/s2-react-v1.11.2) (2022-03-16)

### Bug Fixes

* 修复趋势分析表多指标丢失问题 ([#1175](https://github.com/antvis/S2/issues/1175)) ([2352dbe](https://github.com/antvis/S2/commit/2352dbe3e7ece8ee758fe7cc7ad672d6416f23a1))

# [@antv/s2-react-v1.11.1](https://github.com/antvis/S2/compare/@antv/s2-react-v1.11.0...@antv/s2-react-v1.11.1) (2022-03-11)

### Bug Fixes

* 修复开启 adaptive = true 时，options 更改后，宽度自适应，高度为 options.height ([6be62ba](https://github.com/antvis/S2/commit/6be62ba149e66aa95d9933ce0bfe7f88d41deb81))

### Performance Improvements

* **strategysheet:** :zap: 趋势分析表性能优化 ([#1166](https://github.com/antvis/S2/issues/1166)) ([d02772e](https://github.com/antvis/S2/commit/d02772e771f2cd4c3258f269f714018d53aea4ce))
* **useResize:** :zap: 减少当 adaptive 为 false 时宽高改变引发的重复渲染 ([#1162](https://github.com/antvis/S2/issues/1162)) ([575c15c](https://github.com/antvis/S2/commit/575c15cc91e1ee3067b90e22c2df2e2a68ded683))

# [@antv/s2-react-v1.11.0](https://github.com/antvis/S2/compare/@antv/s2-react-v1.10.0...@antv/s2-react-v1.11.0) (2022-03-01)

### Bug Fixes

* :bug: 修复 s2-react 组件污染全局样式问题 close[#1144](https://github.com/antvis/S2/issues/1144) ([#1149](https://github.com/antvis/S2/issues/1149)) ([6bad1ed](https://github.com/antvis/S2/commit/6bad1ed40300d0f3acaeeb787ceb8735c0877e08))
* :bug: 趋势分析表主题调优 ([#1148](https://github.com/antvis/S2/issues/1148)) ([4335c7c](https://github.com/antvis/S2/commit/4335c7ca2b00ed8c5e495bf5b8883a7a44b3ace6))
* **copy:** 当异步复制失败时降级为同步复制 ([#1125](https://github.com/antvis/S2/issues/1125)) ([009449f](https://github.com/antvis/S2/commit/009449f1d7aa3dcb78d93bdc57e337fd7e6c170f))
* **interaction:** 修复开启复制后，无法复制表格外的文字 ([#1134](https://github.com/antvis/S2/issues/1134)) ([333c3ac](https://github.com/antvis/S2/commit/333c3ac596e90ada8ef7fbfb80082deb99bfd523))
* 修复行头为空无默认角头指标文字问题 ([#1104](https://github.com/antvis/S2/issues/1104)) ([62e94af](https://github.com/antvis/S2/commit/62e94af75473f64aea606d831baa112d5e85cc4e))
* 增加行头收起展开按钮回调事件的透传参数 ([#1121](https://github.com/antvis/S2/issues/1121)) ([300a253](https://github.com/antvis/S2/commit/300a2538446a07ebfcd0c6355966e89c925529a0))

### Features

* :sparkles: 多指标支持切换文本水对齐方式 ([#1146](https://github.com/antvis/S2/issues/1146)) ([32cbf38](https://github.com/antvis/S2/commit/32cbf38786b27ededbf32b996e0ddc7e0439a963))
* adaptive 的 container 自适应包含 header 和 page ([#1133](https://github.com/antvis/S2/issues/1133)) ([988d356](https://github.com/antvis/S2/commit/988d3563ffa23b195fd90fd9ff45cb16dab10a76))
* **interaction:** 透视表支持隐藏列头 ([#1081](https://github.com/antvis/S2/issues/1081)) ([d770a99](https://github.com/antvis/S2/commit/d770a997ae88d9d7f2167aab52d07a5b6de82db6))
* **tooltip:** tooltip 自定义操作项点击事件透出 cell 信息 close [#1106](https://github.com/antvis/S2/issues/1106) ([#1107](https://github.com/antvis/S2/issues/1107)) ([c266e02](https://github.com/antvis/S2/commit/c266e02d8c6665dfda2d469dcfdb10ed3cffd81c))
* **tooltip:** 支持自定义挂载节点 ([#1139](https://github.com/antvis/S2/issues/1139)) ([8aa4778](https://github.com/antvis/S2/commit/8aa4778186e23d695752400c1971e89b39e8978a))
* 维度切换组件增加 allowEmpty 配置 close [#533](https://github.com/antvis/S2/issues/533) ([#1136](https://github.com/antvis/S2/issues/1136)) ([7250bac](https://github.com/antvis/S2/commit/7250bac8267171a78f1b38b1a6f99dbbff15d98c))
* 透出 s2 自带翻页器 change 事件 ([#1145](https://github.com/antvis/S2/issues/1145)) ([0dd305e](https://github.com/antvis/S2/commit/0dd305ef4e75a7d61d8ca1b6d97da1763069b0cd))

# [@antv/s2-react-v1.10.0](https://github.com/antvis/S2/compare/@antv/s2-react-v1.9.1...@antv/s2-react-v1.10.0) (2022-02-28)

### Bug Fixes

* **copy:** 当异步复制失败时降级为同步复制 ([#1125](https://github.com/antvis/S2/issues/1125)) ([43b469a](https://github.com/antvis/S2/commit/43b469ac88fe712723e4032741a8aabdf5fb02c2))
* **interaction:** 修复开启复制后，无法复制表格外的文字 ([#1134](https://github.com/antvis/S2/issues/1134)) ([75460ab](https://github.com/antvis/S2/commit/75460ab10267b80ee52dea63e02d9f5f28fc796f))
* 修复行头为空无默认角头指标文字问题 ([#1104](https://github.com/antvis/S2/issues/1104)) ([9866de3](https://github.com/antvis/S2/commit/9866de31a72644e19373436f356c4791caee6d1e))
* 增加行头收起展开按钮回调事件的透传参数 ([#1121](https://github.com/antvis/S2/issues/1121)) ([9a78d71](https://github.com/antvis/S2/commit/9a78d715083686f8d69c358d9a9b95c748cc8af7))

### Features

* adaptive 的 container 自适应包含 header 和 page ([#1133](https://github.com/antvis/S2/issues/1133)) ([407b495](https://github.com/antvis/S2/commit/407b495d465ec9ff8d52f5d1c21a100370bd2a7e))
* **interaction:** 透视表支持隐藏列头 ([#1081](https://github.com/antvis/S2/issues/1081)) ([bc44978](https://github.com/antvis/S2/commit/bc44978c56321e8e7d14728112edf07e24e2318a))
* **tooltip:** tooltip 自定义操作项点击事件透出 cell 信息 close [#1106](https://github.com/antvis/S2/issues/1106) ([#1107](https://github.com/antvis/S2/issues/1107)) ([259955d](https://github.com/antvis/S2/commit/259955d29ee1ac1395761add9520a78dbe5e6c6f))
* **tooltip:** 支持自定义挂载节点 ([#1139](https://github.com/antvis/S2/issues/1139)) ([b438554](https://github.com/antvis/S2/commit/b438554a193e7df94edea2334268daa3bb2e0577))
* 维度切换组件增加 allowEmpty 配置 close [#533](https://github.com/antvis/S2/issues/533) ([#1136](https://github.com/antvis/S2/issues/1136)) ([1ddc9c0](https://github.com/antvis/S2/commit/1ddc9c0f65d166f63c3ed9c0ecf34a0fae75f4b1))

# [@antv/s2-react-v1.9.1](https://github.com/antvis/S2/compare/@antv/s2-react-v1.9.0...@antv/s2-react-v1.9.1) (2022-02-17)

### Bug Fixes

* **header:** header props types ([#1096](https://github.com/antvis/S2/issues/1096)) ([e85c5df](https://github.com/antvis/S2/commit/e85c5df5b2c3354718b8b27cef847c4ccc52115a))
* 回退排序筛选事件变量名 ([#1097](https://github.com/antvis/S2/issues/1097)) ([9eeb1cd](https://github.com/antvis/S2/commit/9eeb1cdafdd051834383a1423583e221388a581e))

# [@antv/s2-react-v1.9.0](https://github.com/antvis/S2/compare/@antv/s2-react-v1.8.0...@antv/s2-react-v1.9.0) (2022-02-16)

### Bug Fixes

* **copy:** 当异步复制失败时降级为同步复制 ([#1125](https://github.com/antvis/S2/issues/1125)) ([43b469a](https://github.com/antvis/S2/commit/43b469ac88fe712723e4032741a8aabdf5fb02c2))
* **interaction:** 修复开启复制后，无法复制表格外的文字 ([#1134](https://github.com/antvis/S2/issues/1134)) ([75460ab](https://github.com/antvis/S2/commit/75460ab10267b80ee52dea63e02d9f5f28fc796f))
* 修复行头为空无默认角头指标文字问题 ([#1104](https://github.com/antvis/S2/issues/1104)) ([9866de3](https://github.com/antvis/S2/commit/9866de31a72644e19373436f356c4791caee6d1e))
* 增加行头收起展开按钮回调事件的透传参数 ([#1121](https://github.com/antvis/S2/issues/1121)) ([9a78d71](https://github.com/antvis/S2/commit/9a78d715083686f8d69c358d9a9b95c748cc8af7))

### Features

* adaptive 的 container 自适应包含 header 和 page ([#1133](https://github.com/antvis/S2/issues/1133)) ([407b495](https://github.com/antvis/S2/commit/407b495d465ec9ff8d52f5d1c21a100370bd2a7e))
* **interaction:** 透视表支持隐藏列头 ([#1081](https://github.com/antvis/S2/issues/1081)) ([bc44978](https://github.com/antvis/S2/commit/bc44978c56321e8e7d14728112edf07e24e2318a))
* **tooltip:** tooltip 自定义操作项点击事件透出 cell 信息 close [#1106](https://github.com/antvis/S2/issues/1106) ([#1107](https://github.com/antvis/S2/issues/1107)) ([259955d](https://github.com/antvis/S2/commit/259955d29ee1ac1395761add9520a78dbe5e6c6f))
* **tooltip:** 支持自定义挂载节点 ([#1139](https://github.com/antvis/S2/issues/1139)) ([b438554](https://github.com/antvis/S2/commit/b438554a193e7df94edea2334268daa3bb2e0577))
* 维度切换组件增加 allowEmpty 配置 close [#533](https://github.com/antvis/S2/issues/533) ([#1136](https://github.com/antvis/S2/issues/1136)) ([1ddc9c0](https://github.com/antvis/S2/commit/1ddc9c0f65d166f63c3ed9c0ecf34a0fae75f4b1))

# [@antv/s2-react-v1.9.1](https://github.com/antvis/S2/compare/@antv/s2-react-v1.9.0...@antv/s2-react-v1.9.1) (2022-02-17)

### Bug Fixes

* **header:** header props types ([#1096](https://github.com/antvis/S2/issues/1096)) ([e85c5df](https://github.com/antvis/S2/commit/e85c5df5b2c3354718b8b27cef847c4ccc52115a))
* 回退排序筛选事件变量名 ([#1097](https://github.com/antvis/S2/issues/1097)) ([9eeb1cd](https://github.com/antvis/S2/commit/9eeb1cdafdd051834383a1423583e221388a581e))

# [@antv/s2-react-v1.9.0](https://github.com/antvis/S2/compare/@antv/s2-react-v1.8.0...@antv/s2-react-v1.9.0) (2022-02-16)

### Bug Fixes

* s2-react 事件在 react hooks 使用中事件改变后未及时更新 ([#1091](https://github.com/antvis/S2/issues/1091)) ([304c03b](https://github.com/antvis/S2/commit/304c03b8b1dde57fbd2948954d8bd481051da205))
* 初始化后更新 dataCfg 不触发分页 total 变化 ([#1090](https://github.com/antvis/S2/issues/1090)) ([1244df6](https://github.com/antvis/S2/commit/1244df675090c05c6f7ac2208fc6a9b0917eb1db))

### Features

* s2-react 全量透出事件回调函数 ([#1092](https://github.com/antvis/S2/issues/1092)) ([7e5fe5d](https://github.com/antvis/S2/commit/7e5fe5db5df582966df4ecdc1bb96a33e139a979))

# [@antv/s2-react-v1.8.0](https://github.com/antvis/S2/compare/@antv/s2-react-v1.7.0...@antv/s2-react-v1.8.0) (2022-02-11)

### Bug Fixes

* 修复子节点收起后角头全部展开收起不生效 close [#1072](https://github.com/antvis/S2/issues/1072) ([#1074](https://github.com/antvis/S2/issues/1074)) ([6f70f38](https://github.com/antvis/S2/commit/6f70f389fe8a0825dfc80cac871e25adc45280ad))
* 当不同父节点下存在相同子节点时高级排序出错 close [#1065](https://github.com/antvis/S2/issues/1065) ([#1066](https://github.com/antvis/S2/issues/1066)) ([b561ac4](https://github.com/antvis/S2/commit/b561ac48f2e06a0f252e62edcfdc67839fe2689c))

### Features

* ✨ 新趋势分析表 ([#1080](https://github.com/antvis/S2/issues/1080)) ([f88fefb](https://github.com/antvis/S2/commit/f88fefbabc2df1226ef9484d4848aa77db833b67)), closes [#869](https://github.com/antvis/S2/issues/869) [#871](https://github.com/antvis/S2/issues/871) [#876](https://github.com/antvis/S2/issues/876) [#873](https://github.com/antvis/S2/issues/873) [#878](https://github.com/antvis/S2/issues/878) [#897](https://github.com/antvis/S2/issues/897) [#890](https://github.com/antvis/S2/issues/890) [#892](https://github.com/antvis/S2/issues/892) [#906](https://github.com/antvis/S2/issues/906) [#905](https://github.com/antvis/S2/issues/905) [#908](https://github.com/antvis/S2/issues/908) [#916](https://github.com/antvis/S2/issues/916) [#913](https://github.com/antvis/S2/issues/913) [#898](https://github.com/antvis/S2/issues/898) [#902](https://github.com/antvis/S2/issues/902) [#907](https://github.com/antvis/S2/issues/907) [#910](https://github.com/antvis/S2/issues/910) [#919](https://github.com/antvis/S2/issues/919) [#925](https://github.com/antvis/S2/issues/925) [#927](https://github.com/antvis/S2/issues/927) [#929](https://github.com/antvis/S2/issues/929) [#944](https://github.com/antvis/S2/issues/944) [#946](https://github.com/antvis/S2/issues/946) [#958](https://github.com/antvis/S2/issues/958) [#964](https://github.com/antvis/S2/issues/964) [#961](https://github.com/antvis/S2/issues/961) [#970](https://github.com/antvis/S2/issues/970) [#974](https://github.com/antvis/S2/issues/974) [#984](https://github.com/antvis/S2/issues/984) [#986](https://github.com/antvis/S2/issues/986) [#991](https://github.com/antvis/S2/issues/991) [#995](https://github.com/antvis/S2/issues/995) [#996](https://github.com/antvis/S2/issues/996) [#1003](https://github.com/antvis/S2/issues/1003) [#1005](https://github.com/antvis/S2/issues/1005) [#990](https://github.com/antvis/S2/issues/990) [#992](https://github.com/antvis/S2/issues/992) [#993](https://github.com/antvis/S2/issues/993) [#997](https://github.com/antvis/S2/issues/997) [#972](https://github.com/antvis/S2/issues/972) [#1001](https://github.com/antvis/S2/issues/1001) [#1002](https://github.com/antvis/S2/issues/1002) [#1007](https://github.com/antvis/S2/issues/1007) [#1010](https://github.com/antvis/S2/issues/1010) [#1019](https://github.com/antvis/S2/issues/1019) [#1015](https://github.com/antvis/S2/issues/1015) [#1023](https://github.com/antvis/S2/issues/1023) [#1024](https://github.com/antvis/S2/issues/1024) [#1030](https://github.com/antvis/S2/issues/1030) [#1046](https://github.com/antvis/S2/issues/1046) [#1049](https://github.com/antvis/S2/issues/1049) [#1052](https://github.com/antvis/S2/issues/1052) [#1058](https://github.com/antvis/S2/issues/1058) [#1059](https://github.com/antvis/S2/issues/1059) [#1062](https://github.com/antvis/S2/issues/1062) [#1063](https://github.com/antvis/S2/issues/1063) [#1064](https://github.com/antvis/S2/issues/1064) [#1067](https://github.com/antvis/S2/issues/1067) [#1069](https://github.com/antvis/S2/issues/1069) [#1070](https://github.com/antvis/S2/issues/1070) [#1071](https://github.com/antvis/S2/issues/1071) [#1073](https://github.com/antvis/S2/issues/1073) [#1076](https://github.com/antvis/S2/issues/1076) [#1075](https://github.com/antvis/S2/issues/1075) [#1077](https://github.com/antvis/S2/issues/1077)
* 支持自定义设备像素比 ([#1054](https://github.com/antvis/S2/issues/1054)) ([49ac6ac](https://github.com/antvis/S2/commit/49ac6ac3a259d3622a064333213b9a352ea344bb))

# [@antv/s2-react-v1.8.0-alpha.7](https://github.com/antvis/S2/compare/@antv/s2-react-v1.8.0-alpha.6...@antv/s2-react-v1.8.0-alpha.7) (2022-02-10)

### Bug Fixes

* 修复子节点收起后角头全部展开收起不生效 close [#1072](https://github.com/antvis/S2/issues/1072) ([#1074](https://github.com/antvis/S2/issues/1074)) ([6f70f38](https://github.com/antvis/S2/commit/6f70f389fe8a0825dfc80cac871e25adc45280ad))

# [@antv/s2-react-v1.8.0-alpha.6](https://github.com/antvis/S2/compare/@antv/s2-react-v1.8.0-alpha.5...@antv/s2-react-v1.8.0-alpha.6) (2022-02-10)

### Features

* 单元格内多指标支持分列导出 ([#1070](https://github.com/antvis/S2/issues/1070)) ([766fdc4](https://github.com/antvis/S2/commit/766fdc4ecb9360b41a921ec24debb4a7d935df13))

# [@antv/s2-react-v1.8.0-alpha.5](https://github.com/antvis/S2/compare/@antv/s2-react-v1.8.0-alpha.4...@antv/s2-react-v1.8.0-alpha.5) (2022-02-09)

### Bug Fixes

* **interaction:** 修复刷选不显示预选框，行列多选功能异常等交互问题 ([#1063](https://github.com/antvis/S2/issues/1063)) ([f0b988d](https://github.com/antvis/S2/commit/f0b988d5c0842f8a747237a3a89da8d74410f713))
* 修复自定义列头名称不显示问题 ([447e7e5](https://github.com/antvis/S2/commit/447e7e5a82bbd266e08792c35e59c2a29581d738))

### Features

* 数据导出适配自定义目录树 ([#1062](https://github.com/antvis/S2/issues/1062)) ([9111f73](https://github.com/antvis/S2/commit/9111f737e9359be7cf3f554d5315dcae4cef10e1))
* **tooltip:** tooltip 操作项支持动态显示 ([#1067](https://github.com/antvis/S2/issues/1067)) ([41ad27d](https://github.com/antvis/S2/commit/41ad27dd10970dc65b02d1684e54e19d8fae65bb))

# [@antv/s2-react-v1.8.0-alpha.4](https://github.com/antvis/S2/compare/@antv/s2-react-v1.8.0-alpha.3...@antv/s2-react-v1.8.0-alpha.4) (2022-02-08)

### Features

* **tooltip:** 支持自定义 tooltip 操作项 ([#1058](https://github.com/antvis/S2/issues/1058)) ([fc9cc66](https://github.com/antvis/S2/commit/fc9cc6621eb0d3794020375929460de94afcab79))
* 支持自定义设备像素比 ([#1054](https://github.com/antvis/S2/issues/1054)) ([49ac6ac](https://github.com/antvis/S2/commit/49ac6ac3a259d3622a064333213b9a352ea344bb))

# [@antv/s2-react-v1.8.0-alpha.3](https://github.com/antvis/S2/compare/@antv/s2-react-v1.8.0-alpha.2...@antv/s2-react-v1.8.0-alpha.3) (2022-01-28)

### Bug Fixes

* **strategy-sheet:** 修复自定义树布局模式下，获取不到字段描述 ([#1052](https://github.com/antvis/S2/issues/1052)) ([21cc6aa](https://github.com/antvis/S2/commit/21cc6aac7577477dea1d82dc3ddfc315970f03e1))

# [@antv/s2-react-v1.8.0-alpha.2](https://github.com/antvis/S2/compare/@antv/s2-react-v1.8.0-alpha.1...@antv/s2-react-v1.8.0-alpha.2) (2022-01-27)

### Bug Fixes

* **strategy-sheet:** 修复趋势分析表多列头时 tooltip 不显示指标名 ([d01ba98](https://github.com/antvis/S2/commit/d01ba98cd8eedc8347ddce9a988ca9f7a2a25d73))

# [@antv/s2-react-v1.8.0-alpha.1](https://github.com/antvis/S2/compare/@antv/s2-react-v1.7.0...@antv/s2-react-v1.8.0-alpha.1) (2022-01-26)

### Bug Fixes

* 🐛 修复趋势分析表和网格分析表无法自定义主题 ([#927](https://github.com/antvis/S2/issues/927)) ([59dc814](https://github.com/antvis/S2/commit/59dc814e9e3b63229a76009a803dfac1dbe9c9c0))
* bug: 修复趋势分析表自定义目录树渲染出错的问题 ([12a652a](https://github.com/antvis/S2/commit/12a652a47ea5b1188b894fc30b2e8cab06b02e77))
* **drilldown:** 修复 clearDrillDown 下钻清除错误及重渲逻辑 ([#1023](https://github.com/antvis/S2/issues/1023)) ([63c94c3](https://github.com/antvis/S2/commit/63c94c3bb061cd1c7619c2d19ee710cecc0ad10e))
* **s2-react:** 修复 hierarchyType 切换导致的渲染问题 ([#984](https://github.com/antvis/S2/issues/984)) ([34f6dd4](https://github.com/antvis/S2/commit/34f6dd4373991aed23a6f5340fc4dcc5e27ef91e))
* **startegysheet:** 趋势分析表列头文字根据数值坐标动态计算 ([#929](https://github.com/antvis/S2/issues/929)) ([38af37e](https://github.com/antvis/S2/commit/38af37ecc1dc5b27493d41aab195f894c7b542e2))
* **strategy-sheet:** 修复衍生指标颜色，图标显示不正确 & tooltip 不显示指标名 ([#1024](https://github.com/antvis/S2/issues/1024)) ([1f67fc0](https://github.com/antvis/S2/commit/1f67fc0ac6dcf7525c9b8080f74896c1df55ce03))
* **stratgysheet:** 逻辑兜底 ([ca8ea28](https://github.com/antvis/S2/commit/ca8ea28d13d51decff6a975ca517cc769db652ba))
* **useResize:** :bug: 修复自适应模式下重复渲染问题 ([#991](https://github.com/antvis/S2/issues/991)) ([1b8ab5c](https://github.com/antvis/S2/commit/1b8ab5cb931e67e5bd2db5297c7a1e813e8c96aa))
* 下钻参数变更后未正确重置 ([#1015](https://github.com/antvis/S2/issues/1015)) ([c922cd2](https://github.com/antvis/S2/commit/c922cd26e9dc64a4d196679a44707c7c85ed4027))
* 修复多指标情况下自定义树展示不全的问题 ([#986](https://github.com/antvis/S2/issues/986)) ([087e8e2](https://github.com/antvis/S2/commit/087e8e2ab1958ef708f4731185caf5f34583b831))
* 修复未配置 label 时，hover 数值单元格报错，并且列头文字上移的问题 ([#946](https://github.com/antvis/S2/issues/946)) ([d84cf75](https://github.com/antvis/S2/commit/d84cf757252949ac84c1adbf6193683c4ec0a350))
* 修复错误版本号 ([0a79d09](https://github.com/antvis/S2/commit/0a79d099721256b3d3295601d1b2a5e9850ea858))
* 修复高度自适应死循环问题 ([#1007](https://github.com/antvis/S2/issues/1007)) ([6fff9a0](https://github.com/antvis/S2/commit/6fff9a0511f042ee17eed7abb8af7e53233a0b66))
* 列宽计算适配多指标情况 ([#996](https://github.com/antvis/S2/issues/996)) ([e1d9c0f](https://github.com/antvis/S2/commit/e1d9c0f305ee6c2bc3d1f9235afffc8b87840bd8))
* 加载下钻数据引起 render 死循环 ([#1010](https://github.com/antvis/S2/issues/1010)) ([b784268](https://github.com/antvis/S2/commit/b78426857882fb255e5621606dd52dd50c4d21c9))
* 自定义目录树切换优化 ([#964](https://github.com/antvis/S2/issues/964)) ([6957795](https://github.com/antvis/S2/commit/695779573dbca5f8481accdc996b61968959b36e))

### Features

* ✨ init strategy sheet ([#897](https://github.com/antvis/S2/issues/897)) ([481385b](https://github.com/antvis/S2/commit/481385b92f0693bdf003db63031dc9ed8befd35d))
* ✨ 增加对象型数值单元格宽度和文本条件的映射 ([#916](https://github.com/antvis/S2/issues/916)) ([b94cf36](https://github.com/antvis/S2/commit/b94cf36f2e076d6fa7856d6ac8e71a8685cb3b0b))
* **interaction:** 支持禁用刷选功能 ([#908](https://github.com/antvis/S2/issues/908)) ([ea63461](https://github.com/antvis/S2/commit/ea63461fb0a108a823d9c572fa15a10e1500ba38))
* **interaction:** 新增 hoverFocus 配置项 ([#944](https://github.com/antvis/S2/issues/944)) ([e4f82c0](https://github.com/antvis/S2/commit/e4f82c02823a908378847e7b5e44fa3d150d36db))
* **interaction:** 透视表支持隐藏列头 ([#890](https://github.com/antvis/S2/issues/890)) ([ee938d6](https://github.com/antvis/S2/commit/ee938d6e43a703ef9b3b1a86a0c44dce9d833984)), closes [#892](https://github.com/antvis/S2/issues/892)
* **strategy-sheet:** 自定义趋势分析表 tooltip ([#905](https://github.com/antvis/S2/issues/905)) ([eb02845](https://github.com/antvis/S2/commit/eb0284559bb3fb179e5e1a89e5b27cb8b080fcb8))
* **strategy-sheet:** 趋势分析表禁用多选和快捷多选 ([#919](https://github.com/antvis/S2/issues/919)) ([9b840ad](https://github.com/antvis/S2/commit/9b840ada180e75ab8413f435416e6ced1636bfd6))
* 新增字段描述功能 ([#925](https://github.com/antvis/S2/issues/925)) ([e37d561](https://github.com/antvis/S2/commit/e37d561e9effe78e5ac1cebba21fa2ecee246fb1))
* 新增趋势分析表 hover 列头显示指标名 ([#913](https://github.com/antvis/S2/issues/913)) ([4ff9373](https://github.com/antvis/S2/commit/4ff9373d1094150883c0554e636fac1bca4104c7)), closes [#898](https://github.com/antvis/S2/issues/898) [#902](https://github.com/antvis/S2/issues/902) [#907](https://github.com/antvis/S2/issues/907) [#910](https://github.com/antvis/S2/issues/910)
* 趋势分析表列头支持多文本展示 ([#1049](https://github.com/antvis/S2/issues/1049)) ([7df40f7](https://github.com/antvis/S2/commit/7df40f76cf00ef3736b7cc67634eb682de6a93e2))

# [@antv/s2-react-v1.7.0-alpha.5](https://github.com/antvis/S2/compare/@antv/s2-react-v1.7.0-alpha.4...@antv/s2-react-v1.7.0-alpha.5) (2022-01-26)

### Bug Fixes

* **facet:** scroll speed options & pagination totals ([#1031](https://github.com/antvis/S2/issues/1031)) ([2082c22](https://github.com/antvis/S2/commit/2082c22950a0bfb043cfdf8ed37c28328b1e3b93))
* **tooltip:** 修复单元格文字过长时 tooltip 显示被截断 close [#1028](https://github.com/antvis/S2/issues/1028) ([#1034](https://github.com/antvis/S2/issues/1034)) ([4e654e7](https://github.com/antvis/S2/commit/4e654e78d34fdcddb2176fb88c802ffd679cf9c0))
* **tooltip:** 修复明细表列头的 tooltip 内容被错误的格式化 close [#998](https://github.com/antvis/S2/issues/998) ([#1036](https://github.com/antvis/S2/issues/1036)) ([279458d](https://github.com/antvis/S2/commit/279458de7167068194010473f6994ae5e19024c0))

### Features

* 完善交叉表分页功能 ([#1037](https://github.com/antvis/S2/issues/1037)) ([9c8657d](https://github.com/antvis/S2/commit/9c8657d8c711057a88b19dd1fd1705655b86a94e))
* 趋势分析表列头支持多文本展示 ([#1049](https://github.com/antvis/S2/issues/1049)) ([7df40f7](https://github.com/antvis/S2/commit/7df40f76cf00ef3736b7cc67634eb682de6a93e2))

# [@antv/s2-react-v1.7.0](https://github.com/antvis/S2/compare/@antv/s2-react-v1.6.0...@antv/s2-react-v1.7.0) (2022-01-24)

### Bug Fixes

* **facet:** scroll speed options & pagination totals ([#1031](https://github.com/antvis/S2/issues/1031)) ([2082c22](https://github.com/antvis/S2/commit/2082c22950a0bfb043cfdf8ed37c28328b1e3b93))
* **tooltip:** 修复单元格文字过长时 tooltip 显示被截断 close [#1028](https://github.com/antvis/S2/issues/1028) ([#1034](https://github.com/antvis/S2/issues/1034)) ([4e654e7](https://github.com/antvis/S2/commit/4e654e78d34fdcddb2176fb88c802ffd679cf9c0))
* **tooltip:** 修复明细表列头的 tooltip 内容被错误的格式化 close [#998](https://github.com/antvis/S2/issues/998) ([#1036](https://github.com/antvis/S2/issues/1036)) ([279458d](https://github.com/antvis/S2/commit/279458de7167068194010473f6994ae5e19024c0))

### Features

* 完善交叉表分页功能 ([#1037](https://github.com/antvis/S2/issues/1037)) ([9c8657d](https://github.com/antvis/S2/commit/9c8657d8c711057a88b19dd1fd1705655b86a94e))

# [@antv/s2-react-v1.6.0](https://github.com/antvis/S2/compare/@antv/s2-react-v1.5.0...@antv/s2-react-v1.6.0) (2022-01-14)

### Bug Fixes

* **react:** 修复 s2-react 无法安装到 alpha 版本 s2 的问题 ([#983](https://github.com/antvis/S2/issues/983)) ([98ab427](https://github.com/antvis/S2/commit/98ab427d9e06cdcf83994cd418a3153fa1e0c4cc))

### Features

* **facet:** add scrollBarPosition option ([#997](https://github.com/antvis/S2/issues/997)) ([8937dc8](https://github.com/antvis/S2/commit/8937dc84255c68b9d5b75255263866b8c1c359aa))
* 增加 supportsCSSTransform 设置 ([#990](https://github.com/antvis/S2/issues/990)) ([be45f83](https://github.com/antvis/S2/commit/be45f83ec0bfea402fab127641264c362405d289))

# [@antv/s2-react-v1.5.0](https://github.com/antvis/S2/compare/@antv/s2-react-v1.4.0...@antv/s2-react-v1.5.0) (2022-01-07)

### Bug Fixes

* bug: 修复交叉表手动设置滚动不生效问题 ([#955](https://github.com/antvis/S2/issues/955)) ([64eeee8](https://github.com/antvis/S2/commit/64eeee8454c90116c7fcfba891606c836317b49e))
* **components:** adaptive getContainer 类型修改为可选，并优化相关文档 ([#952](https://github.com/antvis/S2/issues/952)) ([1b1863d](https://github.com/antvis/S2/commit/1b1863df5414ad553f3ff38e0092549fba3442de))
* **export:** 优化复制数据到剪贴板的逻辑 ([#976](https://github.com/antvis/S2/issues/976)) ([a841c77](https://github.com/antvis/S2/commit/a841c77c57bb4c9b8aa39f2224dc3adb860b7337))
* 修改 s2-react 错误的 peerDependencies close [#963](https://github.com/antvis/S2/issues/963) ([#966](https://github.com/antvis/S2/issues/966)) ([f852704](https://github.com/antvis/S2/commit/f85270457d1045eccd2a453ba513d58e4d1652a7))

### Features

* **interaction:** 支持通过键盘方向键移动选中的单元格 ([#967](https://github.com/antvis/S2/issues/967)) ([c1a98ec](https://github.com/antvis/S2/commit/c1a98ec30c161624a48fda16bce0888b0af60f6b))

# [@antv/s2-react-v1.4.0](https://github.com/antvis/S2/compare/@antv/s2-react-v1.3.0...@antv/s2-react-v1.4.0) (2021-12-24)

### Bug Fixes

* **components:** 修复配置的宽度超过浏览器可视窗口宽度无法滚动的问题 close [#889](https://github.com/antvis/S2/issues/889) ([#931](https://github.com/antvis/S2/issues/931)) ([bf03b37](https://github.com/antvis/S2/commit/bf03b37d816258d465ffd4ede9bb759b1adaee12))
* **table:** 修复明细表 onDataCellHover 无法触发 ([#896](https://github.com/antvis/S2/issues/896)) ([794406a](https://github.com/antvis/S2/commit/794406a25fbc0f0be9f434aa8cde8cf324e278ab))
* 修复错误修改 DefaultOptions 问题 ([#910](https://github.com/antvis/S2/issues/910)) ([c6e3235](https://github.com/antvis/S2/commit/c6e32350b15611b4fe9aa457baf45329443c7aff))

### Features

* **facet:** 明细表增加行高 resize 调整 && 行高 resize 增加选项 ([#909](https://github.com/antvis/S2/issues/909)) ([cee6bdc](https://github.com/antvis/S2/commit/cee6bdced0cf3749e683ce157478ea2557da3a53))
* 自适应机制优化：开启 adaptive 读取容器宽高，关闭情况下再读取配置项 ([#940](https://github.com/antvis/S2/issues/940)) ([62c1bd0](https://github.com/antvis/S2/commit/62c1bd02de2e5538ccf9bd035068ae28d2cd0370))

# [@antv/s2-react-v1.3.0](https://github.com/antvis/S2/compare/@antv/s2-react-v1.2.0...@antv/s2-react-v1.3.0) (2021-12-13)

### Bug Fixes

* 🐛 solve the wrong data after drilling down twice ([#885](https://github.com/antvis/S2/issues/885)) ([e3c8729](https://github.com/antvis/S2/commit/e3c8729d8fd5383fa73349b9937daa7ea58e0301))
* **components:** add empty fragment close [#873](https://github.com/antvis/S2/issues/873) ([#878](https://github.com/antvis/S2/issues/878)) ([db98788](https://github.com/antvis/S2/commit/db98788954b74b2781f98568013135c8843725f2))
* export link problem ([#877](https://github.com/antvis/S2/issues/877)) ([aa8f428](https://github.com/antvis/S2/commit/aa8f428824ce90aa5b6c7177cc5ef4d371a1d847))

### Features

* ✨ show the sortIcon when the hideMeasureColumn is set ([#884](https://github.com/antvis/S2/issues/884)) ([de1c46a](https://github.com/antvis/S2/commit/de1c46acb12b257e32aa4cc568312abca873775a))

# [@antv/s2-react-v1.2.0](https://github.com/antvis/S2/compare/@antv/s2-react-v1.1.1...@antv/s2-react-v1.2.0) (2021-12-06)

### Bug Fixes

* **cell:** border width issue ([#859](https://github.com/antvis/S2/issues/859)) ([114e7fc](https://github.com/antvis/S2/commit/114e7fc9b7d37f2512dc17a812d280858b571f61))

### Features

* **components:** add switcher header config ([#851](https://github.com/antvis/S2/issues/851)) ([1ced482](https://github.com/antvis/S2/commit/1ced482715ce1d751bb0f40aac9c804d2409e890))
* **resize:** add resize active options, close [#855](https://github.com/antvis/S2/issues/855) ([#864](https://github.com/antvis/S2/issues/864)) ([1ce0951](https://github.com/antvis/S2/commit/1ce0951c20cc28495bf1c062d7c57128c3ef91fb))
* **tooltip:** enhance tooltip ([#862](https://github.com/antvis/S2/issues/862)) ([9e411b5](https://github.com/antvis/S2/commit/9e411b555ef320b856f67a0fcf0da8971de1c529))

# [@antv/s2-react-v1.1.1](https://github.com/antvis/S2/compare/@antv/s2-react-v1.1.0...@antv/s2-react-v1.1.1) (2021-11-30)

### Bug Fixes

* invalid react tooltip config ([#835](https://github.com/antvis/S2/issues/835)) ([10b44e7](https://github.com/antvis/S2/commit/10b44e7ef3b87fb042a4c515123e86ff94cb053e))

# [@antv/s2-react-v1.1.0](https://github.com/antvis/S2/compare/@antv/s2-react-v1.0.3...@antv/s2-react-v1.1.0) (2021-11-29)

### Bug Fixes

* **facet:** fix render crash if value fields is empty ([#822](https://github.com/antvis/S2/issues/822)) ([c91522a](https://github.com/antvis/S2/commit/c91522a7ae3d6c181f271772ee3d2b47f40d3a20))
* **facet:** remove extra row node if row fields is empty ([#824](https://github.com/antvis/S2/issues/824)) ([ab044c1](https://github.com/antvis/S2/commit/ab044c16466bdfe0d17cb9bf0365deb97a8fd38f))

### Features

* refactor react tooltip ([#831](https://github.com/antvis/S2/issues/831)) ([3e57279](https://github.com/antvis/S2/commit/3e572792398d3aec446a56ee70405702be2ced65))

## [1.0.3](https://github.com/antvis/S2/compare/v0.1.1...v1.0.3) (2021-11-24)

### Bug Fixes

* correct corner node width align with total cell, close [#522](https://github.com/antvis/S2/issues/522) ([#541](https://github.com/antvis/S2/issues/541)) ([49303e4](https://github.com/antvis/S2/commit/49303e40e70a316970c2ceade9494098d3eed391))
* :bug: correct the condition of the adustTotalNodesCoordinate ([#455](https://github.com/antvis/S2/issues/455)) ([34c9f87](https://github.com/antvis/S2/commit/34c9f87897186a2ab62c26062ddeae08c9704308))
* :bug: correct the wrong condition to show the default headerActionIcons for detail table mode ([#486](https://github.com/antvis/S2/issues/486)) ([596e9f3](https://github.com/antvis/S2/commit/596e9f333769967c49ae822292efe02412ed2220))
* :bug: optimize the rendering logic for the skeleton and close [#507](https://github.com/antvis/S2/issues/507) ([#564](https://github.com/antvis/S2/issues/564)) ([2cbd2b7](https://github.com/antvis/S2/commit/2cbd2b7b06260ec3a6a9290556ebce89f2d837ce))
* :bug: optimize the subTotal cells layout logic and close [#368](https://github.com/antvis/S2/issues/368) ([#425](https://github.com/antvis/S2/issues/425)) ([7fe2cbf](https://github.com/antvis/S2/commit/7fe2cbf1728b223e4717add85e0b6e27a398b56f))
* :bug: prevent the cell click event when clicking the HeaderActionIcon and close [#409](https://github.com/antvis/S2/issues/409) [#452](https://github.com/antvis/S2/issues/452) ([#489](https://github.com/antvis/S2/issues/489)) ([f1a1a82](https://github.com/antvis/S2/commit/f1a1a8252de46b137221c6fe85f0deced2591fb6))
* :bug: refactor the csvString ([#596](https://github.com/antvis/S2/issues/596)) ([1a88b8f](https://github.com/antvis/S2/commit/1a88b8f652b0d5eb404b7d230e6f62e3f275149c))
* :bug: refactor the process of standardTransform ([#528](https://github.com/antvis/S2/issues/528)) ([315f5c3](https://github.com/antvis/S2/commit/315f5c3b08c157458e3147bd0b99af2e79c8e094))
* :bug: set the default page and close [#473](https://github.com/antvis/S2/issues/473) ([#500](https://github.com/antvis/S2/issues/500)) ([567dc0e](https://github.com/antvis/S2/commit/567dc0e1b57c6dff4935cd387abd47ba251e86d8))
* :bug: solve the issue that the selectedCellsSpotlight does not work ([#704](https://github.com/antvis/S2/issues/704)) ([535a792](https://github.com/antvis/S2/commit/535a7929cc53a2f892e476ab87b418e6fe31adcd))
* :bug: solve the wrong clear drill-dwon state ([#539](https://github.com/antvis/S2/issues/539)) ([eb5b4ee](https://github.com/antvis/S2/commit/eb5b4ee61c53231bff0bc8936f7a0c490519bd65))
* :bug: solve the wrong numbers of headerActionIcons config in drill-down mode ([#445](https://github.com/antvis/S2/issues/445)) ([7ca0a70](https://github.com/antvis/S2/commit/7ca0a70a8f822146c9a672fa420e22ea5f2f617a))
* 🐛 solve the wrong position of the grandTotal cell in multi-value mode and close [#372](https://github.com/antvis/S2/issues/372) ([#437](https://github.com/antvis/S2/issues/437)) ([b24657c](https://github.com/antvis/S2/commit/b24657c65d027f3447cbbc07d089022f3edfbe27))
* 🐛 tweak the corner cell icon position and close [#464](https://github.com/antvis/S2/issues/464) ([#504](https://github.com/antvis/S2/issues/504)) ([5ea90a6](https://github.com/antvis/S2/commit/5ea90a63d953f3e79a02bf3352e02e09a53efa71))
* 🐛 修复 1px 边框错位的问题 ([#744](https://github.com/antvis/S2/issues/744)) ([2b628a6](https://github.com/antvis/S2/commit/2b628a68fb9c60c730bb5e849315824117317072))
* 🐛 add the `spreadsheet` for the meta of the corner cell in tree mode and tweak the style of cell borders ([#342](https://github.com/antvis/S2/issues/342)) ([f322519](https://github.com/antvis/S2/commit/f322519fe42659286c0d4306eef0fa2922ad69aa)), closes [#339](https://github.com/antvis/S2/issues/339)
* 🐛 clear the drill-down cache after setting the dataConfig and close [#496](https://github.com/antvis/S2/issues/496) ([#510](https://github.com/antvis/S2/issues/510)) ([c39a07b](https://github.com/antvis/S2/commit/c39a07bfa0c1caeae66d428278c29012b8e3e4ea))
* 🐛 err when hierarchyType is tree and data is empty ([#527](https://github.com/antvis/S2/issues/527)) ([1bbca96](https://github.com/antvis/S2/commit/1bbca962e26572ac94ec7501e5268795f57f22b1))
* 🐛 event disposal on facet destroy ([#493](https://github.com/antvis/S2/issues/493)) ([e48a20d](https://github.com/antvis/S2/commit/e48a20dfac17c6364909c157dd7ad6c4a7d0f51b))
* 🐛 getEndRows return all items when theres no frozen row ([#503](https://github.com/antvis/S2/issues/503)) ([6952526](https://github.com/antvis/S2/commit/6952526bd265638986ebbefa27b4b4d3922fa8cc))
* 🐛 interactorBorder 宽度自适应 ([#705](https://github.com/antvis/S2/issues/705)) ([1271081](https://github.com/antvis/S2/commit/12710811ce2e8a1afda7e873b44ffc15d6554b3e))
* 🐛 optimize the logic of toggleActionIcon and close [#552](https://github.com/antvis/S2/issues/552) ([#560](https://github.com/antvis/S2/issues/560)) ([2d08950](https://github.com/antvis/S2/commit/2d0895068fb1ea84cb722defa2b4774742b9f0bc))
* 🐛 solve the wrong order of the row meta and close [#511](https://github.com/antvis/S2/issues/511) ([#542](https://github.com/antvis/S2/issues/542)) ([6da8d42](https://github.com/antvis/S2/commit/6da8d427f1bad67747decc2ee784056397c8c224))
* 🐛 solve the wrong render state when updating the dataCfg and close [#285](https://github.com/antvis/S2/issues/285) ([#299](https://github.com/antvis/S2/issues/299)) ([b69cf24](https://github.com/antvis/S2/commit/b69cf2405584483cc1639adc2d44af1b728f8d05))
* 🐛 totals caculate width's err when data is empty but options have totals ([#517](https://github.com/antvis/S2/issues/517)) ([96c35f7](https://github.com/antvis/S2/commit/96c35f7151011322d8163440e9b8140a714356ec))
* add v scrollbar ([#685](https://github.com/antvis/S2/issues/685)) ([b5a1137](https://github.com/antvis/S2/commit/b5a113734b8138c5c0c680ca7245ad4ac2982a7d))
* cannot hidden columns ([#491](https://github.com/antvis/S2/issues/491)) ([dc78a4f](https://github.com/antvis/S2/commit/dc78a4f57b802b1ed2854b32a77abd7d0ecf7afd))
* **cell:** cell padding issue ([#595](https://github.com/antvis/S2/issues/595)) ([4a3a82b](https://github.com/antvis/S2/commit/4a3a82be3f43172992a612c21f3cea8e1dde0a61))
* **component:** fix not use container width when enable adaptive and first rendered ([#620](https://github.com/antvis/S2/issues/620)) ([f7cf450](https://github.com/antvis/S2/commit/f7cf45006ad1a51a5348ae0fddcc23ca6a14114b))
* **components:** fix cannot update table size by container resized ([#796](https://github.com/antvis/S2/issues/796)) ([b48fc3c](https://github.com/antvis/S2/commit/b48fc3cfa77afc50cc553b0c3a08beb0e5baec9e))
* **components:** fix component render crash with empty options ([#653](https://github.com/antvis/S2/issues/653)) ([ce7aacc](https://github.com/antvis/S2/commit/ce7aacc51c9dc2340fe0ce1a580dd120c562981a))
* **components:** switcher support receive antd popover props for resolve scroling with the page ([#715](https://github.com/antvis/S2/issues/715)) ([078afd3](https://github.com/antvis/S2/commit/078afd392e6cdea9f54c35ce41dc421dbe0fe7c2))
* **copy:** copy data with data sorted or filtered ([#781](https://github.com/antvis/S2/issues/781)) ([c602590](https://github.com/antvis/S2/commit/c60259037f2289cbebd1c04f40f8bf2bd84aebd7))
* **copy:** copy with format data ([#674](https://github.com/antvis/S2/issues/674)) ([9dc1b20](https://github.com/antvis/S2/commit/9dc1b20d8c6e550939c7a9c38e243ec7af7bed01))
* **copy:** do not copy when no cell selected ([#752](https://github.com/antvis/S2/issues/752)) ([1bc1192](https://github.com/antvis/S2/commit/1bc119273dbbec4e4c8e11424cb9c6613dab076c))
* **copy:** export data in pivot tree mode ([#572](https://github.com/antvis/S2/issues/572)) ([b9c5b89](https://github.com/antvis/S2/commit/b9c5b899728cb591052d2cb21457a64a486a498d))
* **copy:** fix copy data format problem ([#703](https://github.com/antvis/S2/issues/703)) ([8d15c88](https://github.com/antvis/S2/commit/8d15c883643b02ff925f33adb1feace2b3ec1cb2))
* difficult to select the tooltip after click then merged cell ([#731](https://github.com/antvis/S2/issues/731)) ([2f5bb46](https://github.com/antvis/S2/commit/2f5bb460a4cd5520f05253ead9d8e7608645eb8f))
* disable the drill-down icon for the total row ([#579](https://github.com/antvis/S2/issues/579)) ([37b42b9](https://github.com/antvis/S2/commit/37b42b985252cd42b4e0308ce7e0316321dda837))
* expand corner cell width, make it nowrap initially ([#408](https://github.com/antvis/S2/issues/408)) ([c73bb6d](https://github.com/antvis/S2/commit/c73bb6d391f8f030212eed9ff7b9da249ae95d4a))
* export feature ([#412](https://github.com/antvis/S2/issues/412)) ([6c2a5b8](https://github.com/antvis/S2/commit/6c2a5b8ad625567de5cf138aca51c9faf5d4c354))
* **export:** 🐛 solve the table sheet export problem and close [#446](https://github.com/antvis/S2/issues/446) ([#466](https://github.com/antvis/S2/issues/466)) ([d5eda7c](https://github.com/antvis/S2/commit/d5eda7c8461cc651b6653afcdea71cee5611bbb8))
* **export:** pivot tree mode export error in total dim ([#582](https://github.com/antvis/S2/issues/582)) ([136695e](https://github.com/antvis/S2/commit/136695e2001763b48e4f3b0e05bbbc21d2a1a34d))
* **facet:** adjustXY in pagination ([#709](https://github.com/antvis/S2/issues/709)) ([8238767](https://github.com/antvis/S2/commit/8238767661ac07f3cbcf8d2fa797823ae770b57a))
* **facet:** fix issue [#291](https://github.com/antvis/S2/issues/291) ([#297](https://github.com/antvis/S2/issues/297)) ([28a5c11](https://github.com/antvis/S2/commit/28a5c115501ddbe78432682c9c8cfb4b8b5c7780))
* **facet:** frozen clip and resizer issue ([#275](https://github.com/antvis/S2/issues/275)) ([6b53061](https://github.com/antvis/S2/commit/6b53061583e0062242a6473c2413bae339ff1338)), closes [#269](https://github.com/antvis/S2/issues/269) [#270](https://github.com/antvis/S2/issues/270) [#268](https://github.com/antvis/S2/issues/268) [#267](https://github.com/antvis/S2/issues/267) [#271](https://github.com/antvis/S2/issues/271) [#272](https://github.com/antvis/S2/issues/272) [#265](https://github.com/antvis/S2/issues/265) [#274](https://github.com/antvis/S2/issues/274) [#276](https://github.com/antvis/S2/issues/276)
* **facet:** scrollbar offset ([#707](https://github.com/antvis/S2/issues/707)) ([0bfa052](https://github.com/antvis/S2/commit/0bfa052dc64af97a1eda8ce27c4efcab1a71db9a))
* fix corner icon overlap close [#524](https://github.com/antvis/S2/issues/524) ([#536](https://github.com/antvis/S2/issues/536)) ([228f3bc](https://github.com/antvis/S2/commit/228f3bc07f74e0526e9a8b0e2edad3216f890d6d))
* fix internal svg icon disappear issue in official website ([#654](https://github.com/antvis/S2/issues/654)) ([bd2cdb2](https://github.com/antvis/S2/commit/bd2cdb2c9def850965a92519ebadccda74562cdd))
* fix linkField config path ([#650](https://github.com/antvis/S2/issues/650)) ([fc598b9](https://github.com/antvis/S2/commit/fc598b96171f89b73b74a872a266bc2b826d0a60))
* fix merge cells translate wrong position issue ([#458](https://github.com/antvis/S2/issues/458)) ([5bc7ede](https://github.com/antvis/S2/commit/5bc7ede4fbcb53e83cc77455f1b3ac353e6c1d87))
* fix merged cells can't be sorted and dragged ([#471](https://github.com/antvis/S2/issues/471)) ([cfd9ff0](https://github.com/antvis/S2/commit/cfd9ff03ad98253a4672a2e1117593b3703898e8))
* h scrollbar position ([#592](https://github.com/antvis/S2/issues/592)) ([0a64744](https://github.com/antvis/S2/commit/0a64744952cb21d131308f7406dedcfb7786a747))
* **hd-adapter:** fix wrong container style when zoom scale changed ([#706](https://github.com/antvis/S2/issues/706)) ([05c8fe1](https://github.com/antvis/S2/commit/05c8fe172d5628e3c13bb512e05b5894f6b7ca76))
* **interaction:** add brush move distance validate ([#321](https://github.com/antvis/S2/issues/321)) ([2ee8f9d](https://github.com/antvis/S2/commit/2ee8f9d163ad60692b6ee2e1173e4bfc397430cd))
* **interaction:** cancel data cell hover focus timer when row or col mousemove ([#603](https://github.com/antvis/S2/issues/603)) ([854282b](https://github.com/antvis/S2/commit/854282b77f60676731d9f5c23cac642daeddd422))
* **interaction:** fix wrong corner header width by resize ([#563](https://github.com/antvis/S2/issues/563)) ([6b25a17](https://github.com/antvis/S2/commit/6b25a17a64b3394d9645a5b0896cf1fe3585f0a7))
* **interaction:** hide tooltip and clear hover highlight if mouseleave the cell ([#624](https://github.com/antvis/S2/issues/624)) ([682bf35](https://github.com/antvis/S2/commit/682bf35a8a3e15dfe5aff52deba7cf4cb08ccb27))
* **interaction:** invalid "hiddenColumnFields" config close [#417](https://github.com/antvis/S2/issues/417) ([#431](https://github.com/antvis/S2/issues/431)) ([6cd461e](https://github.com/antvis/S2/commit/6cd461e6d132a18cc7192bf90d946f5de8b8d1f7))
* **interaction:** move hideColumns method to interaction scope ([#786](https://github.com/antvis/S2/issues/786)) ([f5dee01](https://github.com/antvis/S2/commit/f5dee011fea7f6ee482c7b861358a02aa8160bcf))
* **interaction:** optimize reset state logic ([#441](https://github.com/antvis/S2/issues/441)) ([f07e657](https://github.com/antvis/S2/commit/f07e657c0c2be5090a390fcc0ee7f4c74a008e3f))
* **interaction:** support batch hidden columns ([#439](https://github.com/antvis/S2/issues/439)) ([d0a4d97](https://github.com/antvis/S2/commit/d0a4d97d4f343c689f227e0ced6e8723dead007f))
* **interaction:** wrong hidden action tooltip when mouse outside the cell ([#635](https://github.com/antvis/S2/issues/635)) ([46274ee](https://github.com/antvis/S2/commit/46274ee5356a3aacaa9777c1d76c97da3e08fded))
* **interaction:** wrong hidden column icon position ([#329](https://github.com/antvis/S2/issues/329)) ([19d4497](https://github.com/antvis/S2/commit/19d4497b3112cf543d170e65f230f0e885ece8a4))
* multi measure render wrong and optimize sortedDimensionValues ([#737](https://github.com/antvis/S2/issues/737)) ([6f8afaa](https://github.com/antvis/S2/commit/6f8afaa555e163d84e345b7e2800d6505fc61b05))
* not sort when sortMethod is not true ([#562](https://github.com/antvis/S2/issues/562)) ([929bcdc](https://github.com/antvis/S2/commit/929bcdc4c3567ee2f65cd0b7b1e65c19370599a7))
* optimize handleGroupSort and add pivot sheet basic class tests ([#785](https://github.com/antvis/S2/issues/785)) ([9a92cf3](https://github.com/antvis/S2/commit/9a92cf38485d550f9d7a0f4930e03e7170a12c89))
* pagination err ([#453](https://github.com/antvis/S2/issues/453)) ([3d0535e](https://github.com/antvis/S2/commit/3d0535e2390a2ce258df00430dd387745251bd04))
* **performance:** optimize performance when table switch to pivot, [#415](https://github.com/antvis/S2/issues/415) ([#429](https://github.com/antvis/S2/issues/429)) ([215e6c4](https://github.com/antvis/S2/commit/215e6c4755c1101bd4920847a398cf48c07448ce))
* pivot data set's get multi data and optimize advanced sort ([#659](https://github.com/antvis/S2/issues/659)) ([248c038](https://github.com/antvis/S2/commit/248c038116df5a5d1d182bf5d53cadd4e45c2d47))
* pivot sheet sort icon's show ([#662](https://github.com/antvis/S2/issues/662)) ([ea1a4f3](https://github.com/antvis/S2/commit/ea1a4f3525001d2b0b898ad974e775c09e71e624))
* **placeholder:** placeholder issue ([#742](https://github.com/antvis/S2/issues/742)) ([144387a](https://github.com/antvis/S2/commit/144387af4e1ad9740b8b153b2d94e8e6a934593c))
* **poivt-table:** fix render apply font crash on ios15 ([#394](https://github.com/antvis/S2/issues/394)) ([cbb7045](https://github.com/antvis/S2/commit/cbb7045354e674c858185c307b1e5ac2ecd0a70f))
* **povit-table:** resolve scroll shake issue close [#374](https://github.com/antvis/S2/issues/374) ([#379](https://github.com/antvis/S2/issues/379)) ([014d683](https://github.com/antvis/S2/commit/014d683a8cc251f0f4cddb28662b45b7b96d4edb))
* remove exports config ([#795](https://github.com/antvis/S2/issues/795)) ([b5ab046](https://github.com/antvis/S2/commit/b5ab046976fbf76c8ac8c9fc74bf5e7b94702e56))
* render right trailing col ([#647](https://github.com/antvis/S2/issues/647)) ([f367f05](https://github.com/antvis/S2/commit/f367f0554d897826300bd007bd229c25e889567c))
* **resize:** fix corner resize blank ([#599](https://github.com/antvis/S2/issues/599)) ([82cc929](https://github.com/antvis/S2/commit/82cc929d656ff0c82c80bdbc339958af19c3fe7c))
* **resize:** fix set width and height problem ([#402](https://github.com/antvis/S2/issues/402)) ([41caf18](https://github.com/antvis/S2/commit/41caf1812687130d9d4d595b680c544a69a49843))
* return filtered dataset on range_filtered event ([#513](https://github.com/antvis/S2/issues/513)) ([ed7e78a](https://github.com/antvis/S2/commit/ed7e78adea7b8bd1c629c579f36ae6f2b5f2c15f))
* revert code ([#325](https://github.com/antvis/S2/issues/325)) ([6ece5e8](https://github.com/antvis/S2/commit/6ece5e89f50b7d450c412e224546e923792d0aca))
* row-col-click's show about pivot and table, formatter when onlyShowCellText ([#327](https://github.com/antvis/S2/issues/327)) ([23d3508](https://github.com/antvis/S2/commit/23d3508bc42954e1561c350cc11db54cc54bf321))
* scroll move event target ([#622](https://github.com/antvis/S2/issues/622)) ([79583c1](https://github.com/antvis/S2/commit/79583c183bfdc1f9fc383b0cc24168e98c46fa8b))
* **scroll:** fix cannot scroll by mouse or touch tablet ([#698](https://github.com/antvis/S2/issues/698)) ([edbbe6f](https://github.com/antvis/S2/commit/edbbe6f2598118f1762f7077e22fa319ab63547f))
* **scroll:** optimize scroll hover event ([#577](https://github.com/antvis/S2/issues/577)) ([5006bdc](https://github.com/antvis/S2/commit/5006bdc7b1bcd2d1f4e0d7157c59d84f3c51d66b))
* **scroll:** scroll by group ([#727](https://github.com/antvis/S2/issues/727)) ([b365e8b](https://github.com/antvis/S2/commit/b365e8b067ca6c92fafac404690b3157ca827a79))
* **scroll:** show tooltip when scrolling ([#567](https://github.com/antvis/S2/issues/567)) ([62b1d06](https://github.com/antvis/S2/commit/62b1d06afc417eec3fd90a4fab2309770fc0fadf))
* **scroll:** sync row scroll offset when corner cell resized ([#720](https://github.com/antvis/S2/issues/720)) ([6f9b8f4](https://github.com/antvis/S2/commit/6f9b8f41002fb0b9c21c1773f54529ee3422d5ab))
* solve the wrong collapse status and tweak the default icon size for the corner cell and close [#791](https://github.com/antvis/S2/issues/791) ([#798](https://github.com/antvis/S2/issues/798)) ([6bfa17b](https://github.com/antvis/S2/commit/6bfa17b258adf865046743bf4343e9c9a2144d99))
* sortBy ([#566](https://github.com/antvis/S2/issues/566)) ([a16a331](https://github.com/antvis/S2/commit/a16a331a27b4ece17e78919bdcf4fc9a97c03830))
* sortMethod ([#545](https://github.com/antvis/S2/issues/545)) ([a2af01a](https://github.com/antvis/S2/commit/a2af01a380801a5cd75021d9c6bd6931c5db9a95))
* **spreadsheet:** solve the workflow and test case ([#286](https://github.com/antvis/S2/issues/286)) ([c44e469](https://github.com/antvis/S2/commit/c44e4691435623d7de84b70c08308d2b1943d6bc)), closes [#269](https://github.com/antvis/S2/issues/269) [#270](https://github.com/antvis/S2/issues/270) [#268](https://github.com/antvis/S2/issues/268) [#267](https://github.com/antvis/S2/issues/267) [#271](https://github.com/antvis/S2/issues/271) [#272](https://github.com/antvis/S2/issues/272) [#265](https://github.com/antvis/S2/issues/265) [#274](https://github.com/antvis/S2/issues/274) [#276](https://github.com/antvis/S2/issues/276) [#277](https://github.com/antvis/S2/issues/277) [#283](https://github.com/antvis/S2/issues/283) [#273](https://github.com/antvis/S2/issues/273) [#267](https://github.com/antvis/S2/issues/267)
* table dataset spec ([#288](https://github.com/antvis/S2/issues/288)) ([63bef22](https://github.com/antvis/S2/commit/63bef22319ab05c7d1b3d9aeace49e043731d3af))
* **table:** frozen pagination issue ([#338](https://github.com/antvis/S2/issues/338)) ([39d26a5](https://github.com/antvis/S2/commit/39d26a56de3ecc862c529d72b9dc431b1af0611a))
* table sheet sort ([#763](https://github.com/antvis/S2/issues/763)) ([e5dd71a](https://github.com/antvis/S2/commit/e5dd71aed3292c1b08ed1e6917ac0beead260a26))
* **table-facet:** calulate colsHierarchy width after layoutCoordinate hook ([#518](https://github.com/antvis/S2/issues/518)) ([c0636fb](https://github.com/antvis/S2/commit/c0636fbc35ffcb27e95064fd6e04b596d09118cd))
* **table:** fix expand column icon cover text and sort icon ([#677](https://github.com/antvis/S2/issues/677)) ([b2e1658](https://github.com/antvis/S2/commit/b2e16585c3cf4995d8b11facfac3d11d7c024324))
* **table:** scroll position issue when re-render ([#459](https://github.com/antvis/S2/issues/459)) ([4dfa275](https://github.com/antvis/S2/commit/4dfa275ac8cbac33767dd6a8d4def60190c4afa4))
* **table:** table mode corner width err ([#396](https://github.com/antvis/S2/issues/396)) ([e3b9442](https://github.com/antvis/S2/commit/e3b9442ef2952b1047f9e46b3cdf5c153318b768))
* **table:** table sort fix && col layout fix ([#722](https://github.com/antvis/S2/issues/722)) ([6219860](https://github.com/antvis/S2/commit/6219860c3be5dd43eb3307dbee7df199fcb26c06))
* tooltip childNode repete show and add test ([#803](https://github.com/antvis/S2/issues/803)) ([744d0ea](https://github.com/antvis/S2/commit/744d0ea05e74fb630b4d3e7f6d4ebe8efba0f7e8))
* **tooltip:** custom tooltip keep right position wrong calc ([#436](https://github.com/antvis/S2/issues/436)) ([88fe05e](https://github.com/antvis/S2/commit/88fe05e7241e38e817ec60ddc40ef63315dbb3be))
* **tooltip:** fix cannot render tooltip element when first show ([#354](https://github.com/antvis/S2/issues/354)) ([78c22a6](https://github.com/antvis/S2/commit/78c22a6c8d3abb6357451e6752ad4fb4c2334e25))
* **tooltip:** fix cannot show sort menu when icon first clicked ([#366](https://github.com/antvis/S2/issues/366)) ([9c800a5](https://github.com/antvis/S2/commit/9c800a55291c36fed84bbf4e393e1b4dd6576e60))
* **tooltip:** fix tooltip position and point event ([#574](https://github.com/antvis/S2/issues/574)) ([da71848](https://github.com/antvis/S2/commit/da71848aa15f495d1570bc1d529bbd10ac27f2a0))
* **tooltip:** tooltip don't show ([#749](https://github.com/antvis/S2/issues/749)) ([25bda19](https://github.com/antvis/S2/commit/25bda197c21c9276963fb68eecae4a91d5a9841c))
* **tooltip:** tooltip will hide if cliced ([#370](https://github.com/antvis/S2/issues/370)) ([dccd4f5](https://github.com/antvis/S2/commit/dccd4f5bf667af0401e9d517f729992ba6dc7068))
* update d.ts path ([#319](https://github.com/antvis/S2/issues/319)) ([4117fa5](https://github.com/antvis/S2/commit/4117fa5bc3a23956f6e61cf0284cdd11356f7e39))
* update external using regex ([#304](https://github.com/antvis/S2/issues/304)) ([c40d3cc](https://github.com/antvis/S2/commit/c40d3cc6d37395b9c45d6ee2720126a2a1c8a87d))

### Features

* :art: only show the header cell tooltip when the text is omitted ([#633](https://github.com/antvis/S2/issues/633)) ([ad785db](https://github.com/antvis/S2/commit/ad785dbbaba3547f47d0d6390d5f1f3958165d86))
* :sparkles: add column header labels for the corner header ([#320](https://github.com/antvis/S2/issues/320)) ([1b87bda](https://github.com/antvis/S2/commit/1b87bda6e6c2decfbd60c975d78afbcf5f0eb400))
* :sparkles: add skeleton for empty data and close [#507](https://github.com/antvis/S2/issues/507) ([#532](https://github.com/antvis/S2/issues/532)) ([ba1b447](https://github.com/antvis/S2/commit/ba1b44764c0a817dc8453bbb5c56714cdbc354af))
* :sparkles: allow users to set different display condition for headerActionIcons ([#352](https://github.com/antvis/S2/issues/352)) ([9375f2b](https://github.com/antvis/S2/commit/9375f2b8e594355b2e456fb18910085139f76932))
* :sparkles: init examples gallery for the site ([#280](https://github.com/antvis/S2/issues/280)) ([891ce39](https://github.com/antvis/S2/commit/891ce391e5009384a34b7b91ee3507f8c1cae708))
* :sparkles: make the head width change with the width of the sheet ([#701](https://github.com/antvis/S2/issues/701)) ([498f6d7](https://github.com/antvis/S2/commit/498f6d775ded38e2a7997151b9cef92e4bda688d))
* ♻️ refactor the layout logic and provide tree layout-widths ([#682](https://github.com/antvis/S2/issues/682)) ([ac7dd6e](https://github.com/antvis/S2/commit/ac7dd6e1203d3f81ce7faf0ccad0557a944518ee))
* ✨ add custom header action icons ([#331](https://github.com/antvis/S2/issues/331)) ([4dcb1a2](https://github.com/antvis/S2/commit/4dcb1a2344783c8df283071bee1f8b07988b9b01))
* ✨ enable users to set the page size of the pagination configuration and close [#302](https://github.com/antvis/S2/issues/302) ([#309](https://github.com/antvis/S2/issues/309)) ([e5e961e](https://github.com/antvis/S2/commit/e5e961e306092c7ebabefa782a7ea54324656018))
* ✨ part drill down based on the new data process ([#399](https://github.com/antvis/S2/issues/399)) ([6a8889b](https://github.com/antvis/S2/commit/6a8889be5c47c49f335528548b3289577e0bd175))
* 🎸 修复 interactionState 的 borderWidth 和 borderColor 不生效问题 ([#664](https://github.com/antvis/S2/issues/664)) ([8464b4b](https://github.com/antvis/S2/commit/8464b4bc7f54a16599f4e20e5dac0344b873e385))
* 🎸 added ability to filter field values ([#356](https://github.com/antvis/S2/issues/356)) ([92d9698](https://github.com/antvis/S2/commit/92d9698cf40de4fb3a5f099fd6a44821cb2a1bab))
* 🔖 publish v0.1.3 ([#257](https://github.com/antvis/S2/issues/257)) ([92e452a](https://github.com/antvis/S2/commit/92e452ab6fef1bd4b3a3ed0e424e405e362ce425)), closes [#238](https://github.com/antvis/S2/issues/238) [#237](https://github.com/antvis/S2/issues/237) [#7](https://github.com/antvis/S2/issues/7) [#10](https://github.com/antvis/S2/issues/10) [#12](https://github.com/antvis/S2/issues/12) [#13](https://github.com/antvis/S2/issues/13) [#16](https://github.com/antvis/S2/issues/16) [#17](https://github.com/antvis/S2/issues/17) [#11](https://github.com/antvis/S2/issues/11) [#19](https://github.com/antvis/S2/issues/19) [#18](https://github.com/antvis/S2/issues/18) [#21](https://github.com/antvis/S2/issues/21) [#23](https://github.com/antvis/S2/issues/23) [#20](https://github.com/antvis/S2/issues/20) [#24](https://github.com/antvis/S2/issues/24) [#20](https://github.com/antvis/S2/issues/20) [#26](https://github.com/antvis/S2/issues/26) [#27](https://github.com/antvis/S2/issues/27) [#28](https://github.com/antvis/S2/issues/28) [#29](https://github.com/antvis/S2/issues/29) [#35](https://github.com/antvis/S2/issues/35) [#37](https://github.com/antvis/S2/issues/37) [#38](https://github.com/antvis/S2/issues/38) [#39](https://github.com/antvis/S2/issues/39) [#42](https://github.com/antvis/S2/issues/42) [#43](https://github.com/antvis/S2/issues/43) [#44](https://github.com/antvis/S2/issues/44) [#45](https://github.com/antvis/S2/issues/45) [#47](https://github.com/antvis/S2/issues/47) [#46](https://github.com/antvis/S2/issues/46) [#48](https://github.com/antvis/S2/issues/48) [#32](https://github.com/antvis/S2/issues/32) [#31](https://github.com/antvis/S2/issues/31) [#49](https://github.com/antvis/S2/issues/49) [#32](https://github.com/antvis/S2/issues/32) [#31](https://github.com/antvis/S2/issues/31) [#50](https://github.com/antvis/S2/issues/50) [#51](https://github.com/antvis/S2/issues/51) [#52](https://github.com/antvis/S2/issues/52) [#55](https://github.com/antvis/S2/issues/55) [#57](https://github.com/antvis/S2/issues/57) [#58](https://github.com/antvis/S2/issues/58) [#59](https://github.com/antvis/S2/issues/59) [#14](https://github.com/antvis/S2/issues/14) [#30](https://github.com/antvis/S2/issues/30) [#60](https://github.com/antvis/S2/issues/60) [#61](https://github.com/antvis/S2/issues/61) [#64](https://github.com/antvis/S2/issues/64) [#65](https://github.com/antvis/S2/issues/65) [#69](https://github.com/antvis/S2/issues/69) [#70](https://github.com/antvis/S2/issues/70) [#71](https://github.com/antvis/S2/issues/71) [#70](https://github.com/antvis/S2/issues/70) [#70](https://github.com/antvis/S2/issues/70) [#72](https://github.com/antvis/S2/issues/72) [#73](https://github.com/antvis/S2/issues/73) [#74](https://github.com/antvis/S2/issues/74) [#75](https://github.com/antvis/S2/issues/75) [#76](https://github.com/antvis/S2/issues/76) [#82](https://github.com/antvis/S2/issues/82) [#85](https://github.com/antvis/S2/issues/85) [#91](https://github.com/antvis/S2/issues/91) [#81](https://github.com/antvis/S2/issues/81) [#94](https://github.com/antvis/S2/issues/94) [#95](https://github.com/antvis/S2/issues/95) [#100](https://github.com/antvis/S2/issues/100) [#99](https://github.com/antvis/S2/issues/99) [#101](https://github.com/antvis/S2/issues/101) [#107](https://github.com/antvis/S2/issues/107) [#108](https://github.com/antvis/S2/issues/108) [#109](https://github.com/antvis/S2/issues/109) [#112](https://github.com/antvis/S2/issues/112) [#114](https://github.com/antvis/S2/issues/114) [#115](https://github.com/antvis/S2/issues/115) [#116](https://github.com/antvis/S2/issues/116) [#117](https://github.com/antvis/S2/issues/117) [#119](https://github.com/antvis/S2/issues/119) [#121](https://github.com/antvis/S2/issues/121) [#122](https://github.com/antvis/S2/issues/122) [#124](https://github.com/antvis/S2/issues/124) [#125](https://github.com/antvis/S2/issues/125) [#123](https://github.com/antvis/S2/issues/123) [#120](https://github.com/antvis/S2/issues/120) [#126](https://github.com/antvis/S2/issues/126) [#128](https://github.com/antvis/S2/issues/128) [#130](https://github.com/antvis/S2/issues/130) [#129](https://github.com/antvis/S2/issues/129) [#113](https://github.com/antvis/S2/issues/113) [#132](https://github.com/antvis/S2/issues/132) [#135](https://github.com/antvis/S2/issues/135) [#138](https://github.com/antvis/S2/issues/138) [#118](https://github.com/antvis/S2/issues/118) [#139](https://github.com/antvis/S2/issues/139) [#118](https://github.com/antvis/S2/issues/118) [#142](https://github.com/antvis/S2/issues/142) [#143](https://github.com/antvis/S2/issues/143) [#137](https://github.com/antvis/S2/issues/137) [#136](https://github.com/antvis/S2/issues/136) [#148](https://github.com/antvis/S2/issues/148) [#146](https://github.com/antvis/S2/issues/146) [#149](https://github.com/antvis/S2/issues/149) [#152](https://github.com/antvis/S2/issues/152) [#153](https://github.com/antvis/S2/issues/153) [#155](https://github.com/antvis/S2/issues/155) [#156](https://github.com/antvis/S2/issues/156) [#151](https://github.com/antvis/S2/issues/151) [#157](https://github.com/antvis/S2/issues/157) [#154](https://github.com/antvis/S2/issues/154) [#160](https://github.com/antvis/S2/issues/160) [#162](https://github.com/antvis/S2/issues/162) [#164](https://github.com/antvis/S2/issues/164) [#158](https://github.com/antvis/S2/issues/158) [#167](https://github.com/antvis/S2/issues/167) [#170](https://github.com/antvis/S2/issues/170) [#165](https://github.com/antvis/S2/issues/165) [#171](https://github.com/antvis/S2/issues/171) [#163](https://github.com/antvis/S2/issues/163) [#174](https://github.com/antvis/S2/issues/174) [#172](https://github.com/antvis/S2/issues/172) [#175](https://github.com/antvis/S2/issues/175) [#173](https://github.com/antvis/S2/issues/173) [#179](https://github.com/antvis/S2/issues/179) [#183](https://github.com/antvis/S2/issues/183) [#182](https://github.com/antvis/S2/issues/182) [#180](https://github.com/antvis/S2/issues/180) [#184](https://github.com/antvis/S2/issues/184) [#185](https://github.com/antvis/S2/issues/185) [#181](https://github.com/antvis/S2/issues/181) [#178](https://github.com/antvis/S2/issues/178) [#192](https://github.com/antvis/S2/issues/192) [#189](https://github.com/antvis/S2/issues/189) [#190](https://github.com/antvis/S2/issues/190) [#194](https://github.com/antvis/S2/issues/194) [#197](https://github.com/antvis/S2/issues/197) [#196](https://github.com/antvis/S2/issues/196) [#203](https://github.com/antvis/S2/issues/203) [#207](https://github.com/antvis/S2/issues/207) [#204](https://github.com/antvis/S2/issues/204) [#206](https://github.com/antvis/S2/issues/206) [#208](https://github.com/antvis/S2/issues/208) [#202](https://github.com/antvis/S2/issues/202) [#201](https://github.com/antvis/S2/issues/201) [#209](https://github.com/antvis/S2/issues/209) [#200](https://github.com/antvis/S2/issues/200) [#210](https://github.com/antvis/S2/issues/210) [#211](https://github.com/antvis/S2/issues/211) [#214](https://github.com/antvis/S2/issues/214) [#213](https://github.com/antvis/S2/issues/213) [#212](https://github.com/antvis/S2/issues/212) [#216](https://github.com/antvis/S2/issues/216) [#217](https://github.com/antvis/S2/issues/217) [#218](https://github.com/antvis/S2/issues/218) [#219](https://github.com/antvis/S2/issues/219) [#221](https://github.com/antvis/S2/issues/221) [#222](https://github.com/antvis/S2/issues/222) [#240](https://github.com/antvis/S2/issues/240) [#241](https://github.com/antvis/S2/issues/241) [#242](https://github.com/antvis/S2/issues/242) [#248](https://github.com/antvis/S2/issues/248) [#245](https://github.com/antvis/S2/issues/245) [#252](https://github.com/antvis/S2/issues/252) [#249](https://github.com/antvis/S2/issues/249)
* add advanced sort component ([#428](https://github.com/antvis/S2/issues/428)) ([c3a3fb5](https://github.com/antvis/S2/commit/c3a3fb5ba16dc4ef65f301b054a78095c36f5524))
* add confirm and cancel button for switcher ([#495](https://github.com/antvis/S2/issues/495)) ([d31ce63](https://github.com/antvis/S2/commit/d31ce63a87d87878f033f51ac2a0e7f4d90c2b31))
* add doc for table ([#360](https://github.com/antvis/S2/issues/360)) ([a7ee65e](https://github.com/antvis/S2/commit/a7ee65e4f46a0e8253a756d6c2619166e36a8c8e))
* add group sort in col's values and refactor tooltip's style ([#284](https://github.com/antvis/S2/issues/284)) ([ad02d9d](https://github.com/antvis/S2/commit/ad02d9db301f6be34112ac99e6db2de48af4c2dc)), closes [#269](https://github.com/antvis/S2/issues/269) [#270](https://github.com/antvis/S2/issues/270) [#268](https://github.com/antvis/S2/issues/268) [#267](https://github.com/antvis/S2/issues/267) [#271](https://github.com/antvis/S2/issues/271) [#272](https://github.com/antvis/S2/issues/272) [#265](https://github.com/antvis/S2/issues/265) [#274](https://github.com/antvis/S2/issues/274) [#276](https://github.com/antvis/S2/issues/276) [#277](https://github.com/antvis/S2/issues/277) [#283](https://github.com/antvis/S2/issues/283)
* add more util export ([#784](https://github.com/antvis/S2/issues/784)) ([a4e7127](https://github.com/antvis/S2/commit/a4e7127e0e6e16ae83cedeb22713ceaedb99a690))
* add resize area highlight for whole rows and columns ([#645](https://github.com/antvis/S2/issues/645)) ([ec224d9](https://github.com/antvis/S2/commit/ec224d9a2028ced85024d2a05f80e19d8af12e5e))
* add shadow for table mode ([#610](https://github.com/antvis/S2/issues/610)) ([07039a9](https://github.com/antvis/S2/commit/07039a95e7cedfdc3e6b84107ba36b64ddb87a74))
* add tooltip col and row config handle ([#440](https://github.com/antvis/S2/issues/440)) ([b457d27](https://github.com/antvis/S2/commit/b457d27ce1ba6de368e39632675c295ff3af8174))
* add total measure formatter for values in rows ([#462](https://github.com/antvis/S2/issues/462)) ([615be65](https://github.com/antvis/S2/commit/615be65b2f1afe9815c7889a34b6aa17a303dc66))
* copy with row and col ([#387](https://github.com/antvis/S2/issues/387)) ([7602ef8](https://github.com/antvis/S2/commit/7602ef87d5821b7a897c779f90d37bfc1e52d25f))
* **custom-tree:** fix custom-tree mode & custom-tree test ([#666](https://github.com/antvis/S2/issues/666)) ([f849a2f](https://github.com/antvis/S2/commit/f849a2f873e9bbed543e9bb3c8c57f2d1bd68506)), closes [#605](https://github.com/antvis/S2/issues/605)
* dimensions switcher ([#298](https://github.com/antvis/S2/issues/298)) ([f223319](https://github.com/antvis/S2/commit/f2233194850604f5245e7eb19ea61f3993a592fe)), closes [#269](https://github.com/antvis/S2/issues/269) [#270](https://github.com/antvis/S2/issues/270) [#268](https://github.com/antvis/S2/issues/268) [#267](https://github.com/antvis/S2/issues/267) [#271](https://github.com/antvis/S2/issues/271)
* **facet:** add scroll speed ratio ([#438](https://github.com/antvis/S2/issues/438)) ([9ba97fb](https://github.com/antvis/S2/commit/9ba97fb716132b5c5bd49f03e16a6cb5d0ae51e4))
* fix table col issue ([#589](https://github.com/antvis/S2/issues/589)) ([329b9a5](https://github.com/antvis/S2/commit/329b9a51829fafa5314cb2f8506d161ea0697ad3))
* **interaction:** add autoResetSheetStyle options ([#465](https://github.com/antvis/S2/issues/465)) ([00f316d](https://github.com/antvis/S2/commit/00f316d99566478c96660ff72d2f0541af572c74))
* **interaction:** hidden columns ([#296](https://github.com/antvis/S2/issues/296)) ([f5f4a69](https://github.com/antvis/S2/commit/f5f4a69dbd2b436f36e874323115d54af9f0aa16))
* **interaction:** select interaction imporement ([#324](https://github.com/antvis/S2/issues/324)) ([6b5479d](https://github.com/antvis/S2/commit/6b5479d9cb9718ce0c657277ef2ad30c56b8ded7))
* **interaction:** shift interval select ([#732](https://github.com/antvis/S2/issues/732)) ([d21d410](https://github.com/antvis/S2/commit/d21d41028f505d8ad9d5cb0e5bec192a3c3a34b4))
* merged cell related documents, tests and some refactoring ([#702](https://github.com/antvis/S2/issues/702)) ([74dc450](https://github.com/antvis/S2/commit/74dc450aed3e9057cf2b689f7c964dd40657a350))
* **options:** add empty cell placeholder options ([#658](https://github.com/antvis/S2/issues/658)) ([b4b7fdd](https://github.com/antvis/S2/commit/b4b7fdd94aba0f9312754435569d906b5d371ffb))
* perfect and repair merged cells ([#608](https://github.com/antvis/S2/issues/608)) ([edd3ae3](https://github.com/antvis/S2/commit/edd3ae36585607320646b4f3740b84237416bea7))
* refactor switcher component ([#380](https://github.com/antvis/S2/issues/380)) ([f5c2993](https://github.com/antvis/S2/commit/f5c2993801d4f2b0d09ecaf4b8f751deefbac0d0))
* select all ([#348](https://github.com/antvis/S2/issues/348)) ([334aac4](https://github.com/antvis/S2/commit/334aac41ac9511c3b417a7006591fdbf138ab618)), closes [#342](https://github.com/antvis/S2/issues/342) [#339](https://github.com/antvis/S2/issues/339)
* tooltip support config auto adjust boundary ([#538](https://github.com/antvis/S2/issues/538)) ([2a14873](https://github.com/antvis/S2/commit/2a14873507c1480b3b209ffd5cb46421aca4096e))
* **util:** add generateId export function ([#488](https://github.com/antvis/S2/issues/488)) ([0e6025e](https://github.com/antvis/S2/commit/0e6025e20e5b2eeca0692dbb90fabcaffd66d3c1))

### Performance Improvements

* **sa:** fix console.time & sa performance ([#672](https://github.com/antvis/S2/issues/672)) ([cb5990f](https://github.com/antvis/S2/commit/cb5990f81f8c9b4da674eebdb0c49bb8eaa4f19d))

## [1.0.1](https://github.com/antvis/S2/compare/v0.1.0-alpha.15...v1.0.1) (2021-11-21)

### Bug Fixes

* correct corner node width align with total cell, close [#522](https://github.com/antvis/S2/issues/522) ([#541](https://github.com/antvis/S2/issues/541)) ([49303e4](https://github.com/antvis/S2/commit/49303e40e70a316970c2ceade9494098d3eed391))
* :bug: correct the condition of the adustTotalNodesCoordinate ([#455](https://github.com/antvis/S2/issues/455)) ([34c9f87](https://github.com/antvis/S2/commit/34c9f87897186a2ab62c26062ddeae08c9704308))
* :bug: correct the wrong condition to show the default headerActionIcons for detail table mode ([#486](https://github.com/antvis/S2/issues/486)) ([596e9f3](https://github.com/antvis/S2/commit/596e9f333769967c49ae822292efe02412ed2220))
* :bug: optimize the rendering logic for the skeleton and close [#507](https://github.com/antvis/S2/issues/507) ([#564](https://github.com/antvis/S2/issues/564)) ([2cbd2b7](https://github.com/antvis/S2/commit/2cbd2b7b06260ec3a6a9290556ebce89f2d837ce))
* :bug: optimize the subTotal cells layout logic and close [#368](https://github.com/antvis/S2/issues/368) ([#425](https://github.com/antvis/S2/issues/425)) ([7fe2cbf](https://github.com/antvis/S2/commit/7fe2cbf1728b223e4717add85e0b6e27a398b56f))
* :bug: prevent the cell click event when clicking the HeaderActionIcon and close [#409](https://github.com/antvis/S2/issues/409) [#452](https://github.com/antvis/S2/issues/452) ([#489](https://github.com/antvis/S2/issues/489)) ([f1a1a82](https://github.com/antvis/S2/commit/f1a1a8252de46b137221c6fe85f0deced2591fb6))
* :bug: refactor the csvString ([#596](https://github.com/antvis/S2/issues/596)) ([1a88b8f](https://github.com/antvis/S2/commit/1a88b8f652b0d5eb404b7d230e6f62e3f275149c))
* :bug: refactor the process of standardTransform ([#528](https://github.com/antvis/S2/issues/528)) ([315f5c3](https://github.com/antvis/S2/commit/315f5c3b08c157458e3147bd0b99af2e79c8e094))
* :bug: set the default page and close [#473](https://github.com/antvis/S2/issues/473) ([#500](https://github.com/antvis/S2/issues/500)) ([567dc0e](https://github.com/antvis/S2/commit/567dc0e1b57c6dff4935cd387abd47ba251e86d8))
* :bug: solve the issue that the selectedCellsSpotlight does not work ([#704](https://github.com/antvis/S2/issues/704)) ([535a792](https://github.com/antvis/S2/commit/535a7929cc53a2f892e476ab87b418e6fe31adcd))
* :bug: solve the wrong clear drill-dwon state ([#539](https://github.com/antvis/S2/issues/539)) ([eb5b4ee](https://github.com/antvis/S2/commit/eb5b4ee61c53231bff0bc8936f7a0c490519bd65))
* :bug: solve the wrong numbers of headerActionIcons config in drill-down mode ([#445](https://github.com/antvis/S2/issues/445)) ([7ca0a70](https://github.com/antvis/S2/commit/7ca0a70a8f822146c9a672fa420e22ea5f2f617a))
* 🐛 solve the wrong position of the grandTotal cell in multi-value mode and close [#372](https://github.com/antvis/S2/issues/372) ([#437](https://github.com/antvis/S2/issues/437)) ([b24657c](https://github.com/antvis/S2/commit/b24657c65d027f3447cbbc07d089022f3edfbe27))
* 🐛 tweak the corner cell icon position and close [#464](https://github.com/antvis/S2/issues/464) ([#504](https://github.com/antvis/S2/issues/504)) ([5ea90a6](https://github.com/antvis/S2/commit/5ea90a63d953f3e79a02bf3352e02e09a53efa71))
* 🐛 add the `spreadsheet` for the meta of the corner cell in tree mode and tweak the style of cell borders ([#342](https://github.com/antvis/S2/issues/342)) ([f322519](https://github.com/antvis/S2/commit/f322519fe42659286c0d4306eef0fa2922ad69aa)), closes [#339](https://github.com/antvis/S2/issues/339)
* 🐛 clear the drill-down cache after setting the dataConfig and close [#496](https://github.com/antvis/S2/issues/496) ([#510](https://github.com/antvis/S2/issues/510)) ([c39a07b](https://github.com/antvis/S2/commit/c39a07bfa0c1caeae66d428278c29012b8e3e4ea))
* 🐛 err when hierarchyType is tree and data is empty ([#527](https://github.com/antvis/S2/issues/527)) ([1bbca96](https://github.com/antvis/S2/commit/1bbca962e26572ac94ec7501e5268795f57f22b1))
* 🐛 event disposal on facet destroy ([#493](https://github.com/antvis/S2/issues/493)) ([e48a20d](https://github.com/antvis/S2/commit/e48a20dfac17c6364909c157dd7ad6c4a7d0f51b))
* 🐛 fix the wrong params of export function ([#159](https://github.com/antvis/S2/issues/159)) ([ce66363](https://github.com/antvis/S2/commit/ce663637c63ef173019d8233237ed8ee7d98eaa9))
* 🐛 getEndRows return all items when theres no frozen row ([#503](https://github.com/antvis/S2/issues/503)) ([6952526](https://github.com/antvis/S2/commit/6952526bd265638986ebbefa27b4b4d3922fa8cc))
* 🐛 interactorBorder 宽度自适应 ([#705](https://github.com/antvis/S2/issues/705)) ([1271081](https://github.com/antvis/S2/commit/12710811ce2e8a1afda7e873b44ffc15d6554b3e))
* 🐛 optimize the logic of toggleActionIcon and close [#552](https://github.com/antvis/S2/issues/552) ([#560](https://github.com/antvis/S2/issues/560)) ([2d08950](https://github.com/antvis/S2/commit/2d0895068fb1ea84cb722defa2b4774742b9f0bc))
* 🐛 solve the wrong order of the row meta and close [#511](https://github.com/antvis/S2/issues/511) ([#542](https://github.com/antvis/S2/issues/542)) ([6da8d42](https://github.com/antvis/S2/commit/6da8d427f1bad67747decc2ee784056397c8c224))
* 🐛 solve the wrong render state when updating the dataCfg and close [#285](https://github.com/antvis/S2/issues/285) ([#299](https://github.com/antvis/S2/issues/299)) ([b69cf24](https://github.com/antvis/S2/commit/b69cf2405584483cc1639adc2d44af1b728f8d05))
* 🐛 totals caculate width's err when data is empty but options have totals ([#517](https://github.com/antvis/S2/issues/517)) ([96c35f7](https://github.com/antvis/S2/commit/96c35f7151011322d8163440e9b8140a714356ec))
* 🐛 修复 1px 边框错位的问题 ([#744](https://github.com/antvis/S2/issues/744)) ([2b628a6](https://github.com/antvis/S2/commit/2b628a68fb9c60c730bb5e849315824117317072))
* add v scrollbar ([#685](https://github.com/antvis/S2/issues/685)) ([b5a1137](https://github.com/antvis/S2/commit/b5a113734b8138c5c0c680ca7245ad4ac2982a7d))
* cannot hidden columns ([#491](https://github.com/antvis/S2/issues/491)) ([dc78a4f](https://github.com/antvis/S2/commit/dc78a4f57b802b1ed2854b32a77abd7d0ecf7afd))
* **cell:** cell padding issue ([#595](https://github.com/antvis/S2/issues/595)) ([4a3a82b](https://github.com/antvis/S2/commit/4a3a82be3f43172992a612c21f3cea8e1dde0a61))
* **component:** fix not use container width when enable adaptive and first rendered ([#620](https://github.com/antvis/S2/issues/620)) ([f7cf450](https://github.com/antvis/S2/commit/f7cf45006ad1a51a5348ae0fddcc23ca6a14114b))
* **components:** fix component render crash with empty options ([#653](https://github.com/antvis/S2/issues/653)) ([ce7aacc](https://github.com/antvis/S2/commit/ce7aacc51c9dc2340fe0ce1a580dd120c562981a))
* **components:** switcher support receive antd popover props for resolve scroling with the page ([#715](https://github.com/antvis/S2/issues/715)) ([078afd3](https://github.com/antvis/S2/commit/078afd392e6cdea9f54c35ce41dc421dbe0fe7c2))
* **copy:** copy with format data ([#674](https://github.com/antvis/S2/issues/674)) ([9dc1b20](https://github.com/antvis/S2/commit/9dc1b20d8c6e550939c7a9c38e243ec7af7bed01))
* **copy:** do not copy when no cell selected ([#752](https://github.com/antvis/S2/issues/752)) ([1bc1192](https://github.com/antvis/S2/commit/1bc119273dbbec4e4c8e11424cb9c6613dab076c))
* **copy:** export data in pivot tree mode ([#572](https://github.com/antvis/S2/issues/572)) ([b9c5b89](https://github.com/antvis/S2/commit/b9c5b899728cb591052d2cb21457a64a486a498d))
* **copy:** fix copy data format problem ([#703](https://github.com/antvis/S2/issues/703)) ([8d15c88](https://github.com/antvis/S2/commit/8d15c883643b02ff925f33adb1feace2b3ec1cb2))
* difficult to select the tooltip after click then merged cell ([#731](https://github.com/antvis/S2/issues/731)) ([2f5bb46](https://github.com/antvis/S2/commit/2f5bb460a4cd5520f05253ead9d8e7608645eb8f))
* disable the drill-down icon for the total row ([#579](https://github.com/antvis/S2/issues/579)) ([37b42b9](https://github.com/antvis/S2/commit/37b42b985252cd42b4e0308ce7e0316321dda837))
* expand corner cell width, make it nowrap initially ([#408](https://github.com/antvis/S2/issues/408)) ([c73bb6d](https://github.com/antvis/S2/commit/c73bb6d391f8f030212eed9ff7b9da249ae95d4a))
* export feature ([#412](https://github.com/antvis/S2/issues/412)) ([6c2a5b8](https://github.com/antvis/S2/commit/6c2a5b8ad625567de5cf138aca51c9faf5d4c354))
* **export:** 🐛 solve the table sheet export problem and close [#446](https://github.com/antvis/S2/issues/446) ([#466](https://github.com/antvis/S2/issues/466)) ([d5eda7c](https://github.com/antvis/S2/commit/d5eda7c8461cc651b6653afcdea71cee5611bbb8))
* **export:** pivot tree mode export error in total dim ([#582](https://github.com/antvis/S2/issues/582)) ([136695e](https://github.com/antvis/S2/commit/136695e2001763b48e4f3b0e05bbbc21d2a1a34d))
* **facet:** adjustXY in pagination ([#709](https://github.com/antvis/S2/issues/709)) ([8238767](https://github.com/antvis/S2/commit/8238767661ac07f3cbcf8d2fa797823ae770b57a))
* **facet:** fix issue [#291](https://github.com/antvis/S2/issues/291) ([#297](https://github.com/antvis/S2/issues/297)) ([28a5c11](https://github.com/antvis/S2/commit/28a5c115501ddbe78432682c9c8cfb4b8b5c7780))
* **facet:** frozen clip and resizer issue ([#275](https://github.com/antvis/S2/issues/275)) ([6b53061](https://github.com/antvis/S2/commit/6b53061583e0062242a6473c2413bae339ff1338)), closes [#269](https://github.com/antvis/S2/issues/269) [#270](https://github.com/antvis/S2/issues/270) [#268](https://github.com/antvis/S2/issues/268) [#267](https://github.com/antvis/S2/issues/267) [#271](https://github.com/antvis/S2/issues/271) [#272](https://github.com/antvis/S2/issues/272) [#265](https://github.com/antvis/S2/issues/265) [#274](https://github.com/antvis/S2/issues/274) [#276](https://github.com/antvis/S2/issues/276)
* **facet:** scrollbar offset ([#707](https://github.com/antvis/S2/issues/707)) ([0bfa052](https://github.com/antvis/S2/commit/0bfa052dc64af97a1eda8ce27c4efcab1a71db9a))
* fix corner icon overlap close [#524](https://github.com/antvis/S2/issues/524) ([#536](https://github.com/antvis/S2/issues/536)) ([228f3bc](https://github.com/antvis/S2/commit/228f3bc07f74e0526e9a8b0e2edad3216f890d6d))
* fix internal svg icon disappear issue in official website ([#654](https://github.com/antvis/S2/issues/654)) ([bd2cdb2](https://github.com/antvis/S2/commit/bd2cdb2c9def850965a92519ebadccda74562cdd))
* fix linkField config path ([#650](https://github.com/antvis/S2/issues/650)) ([fc598b9](https://github.com/antvis/S2/commit/fc598b96171f89b73b74a872a266bc2b826d0a60))
* fix merge cells translate wrong position issue ([#458](https://github.com/antvis/S2/issues/458)) ([5bc7ede](https://github.com/antvis/S2/commit/5bc7ede4fbcb53e83cc77455f1b3ac353e6c1d87))
* fix merged cells can't be sorted and dragged ([#471](https://github.com/antvis/S2/issues/471)) ([cfd9ff0](https://github.com/antvis/S2/commit/cfd9ff03ad98253a4672a2e1117593b3703898e8))
* h scrollbar position ([#592](https://github.com/antvis/S2/issues/592)) ([0a64744](https://github.com/antvis/S2/commit/0a64744952cb21d131308f7406dedcfb7786a747))
* **hd-adapter:** fix wrong container style when zoom scale changed ([#706](https://github.com/antvis/S2/issues/706)) ([05c8fe1](https://github.com/antvis/S2/commit/05c8fe172d5628e3c13bb512e05b5894f6b7ca76))
* **interaction:** add brush move distance validate ([#321](https://github.com/antvis/S2/issues/321)) ([2ee8f9d](https://github.com/antvis/S2/commit/2ee8f9d163ad60692b6ee2e1173e4bfc397430cd))
* **interaction:** cancel data cell hover focus timer when row or col mousemove ([#603](https://github.com/antvis/S2/issues/603)) ([854282b](https://github.com/antvis/S2/commit/854282b77f60676731d9f5c23cac642daeddd422))
* **interaction:** fix wrong corner header width by resize ([#563](https://github.com/antvis/S2/issues/563)) ([6b25a17](https://github.com/antvis/S2/commit/6b25a17a64b3394d9645a5b0896cf1fe3585f0a7))
* **interaction:** hide tooltip and clear hover highlight if mouseleave the cell ([#624](https://github.com/antvis/S2/issues/624)) ([682bf35](https://github.com/antvis/S2/commit/682bf35a8a3e15dfe5aff52deba7cf4cb08ccb27))
* **interaction:** invalid "hiddenColumnFields" config close [#417](https://github.com/antvis/S2/issues/417) ([#431](https://github.com/antvis/S2/issues/431)) ([6cd461e](https://github.com/antvis/S2/commit/6cd461e6d132a18cc7192bf90d946f5de8b8d1f7))
* **interaction:** optimize reset state logic ([#441](https://github.com/antvis/S2/issues/441)) ([f07e657](https://github.com/antvis/S2/commit/f07e657c0c2be5090a390fcc0ee7f4c74a008e3f))
* **interaction:** support batch hidden columns ([#439](https://github.com/antvis/S2/issues/439)) ([d0a4d97](https://github.com/antvis/S2/commit/d0a4d97d4f343c689f227e0ced6e8723dead007f))
* **interaction:** wrong hidden action tooltip when mouse outside the cell ([#635](https://github.com/antvis/S2/issues/635)) ([46274ee](https://github.com/antvis/S2/commit/46274ee5356a3aacaa9777c1d76c97da3e08fded))
* **interaction:** wrong hidden column icon position ([#329](https://github.com/antvis/S2/issues/329)) ([19d4497](https://github.com/antvis/S2/commit/19d4497b3112cf543d170e65f230f0e885ece8a4))
* multi measure render wrong and optimize sortedDimensionValues ([#737](https://github.com/antvis/S2/issues/737)) ([6f8afaa](https://github.com/antvis/S2/commit/6f8afaa555e163d84e345b7e2800d6505fc61b05))
* not sort when sortMethod is not true ([#562](https://github.com/antvis/S2/issues/562)) ([929bcdc](https://github.com/antvis/S2/commit/929bcdc4c3567ee2f65cd0b7b1e65c19370599a7))
* pagination err ([#453](https://github.com/antvis/S2/issues/453)) ([3d0535e](https://github.com/antvis/S2/commit/3d0535e2390a2ce258df00430dd387745251bd04))
* **performance:** optimize performance when table switch to pivot, [#415](https://github.com/antvis/S2/issues/415) ([#429](https://github.com/antvis/S2/issues/429)) ([215e6c4](https://github.com/antvis/S2/commit/215e6c4755c1101bd4920847a398cf48c07448ce))
* pivot data set's get multi data and optimize advanced sort ([#659](https://github.com/antvis/S2/issues/659)) ([248c038](https://github.com/antvis/S2/commit/248c038116df5a5d1d182bf5d53cadd4e45c2d47))
* pivot sheet sort icon's show ([#662](https://github.com/antvis/S2/issues/662)) ([ea1a4f3](https://github.com/antvis/S2/commit/ea1a4f3525001d2b0b898ad974e775c09e71e624))
* **placeholder:** placeholder issue ([#742](https://github.com/antvis/S2/issues/742)) ([144387a](https://github.com/antvis/S2/commit/144387af4e1ad9740b8b153b2d94e8e6a934593c))
* **poivt-table:** fix render apply font crash on ios15 ([#394](https://github.com/antvis/S2/issues/394)) ([cbb7045](https://github.com/antvis/S2/commit/cbb7045354e674c858185c307b1e5ac2ecd0a70f))
* **povit-table:** resolve scroll shake issue close [#374](https://github.com/antvis/S2/issues/374) ([#379](https://github.com/antvis/S2/issues/379)) ([014d683](https://github.com/antvis/S2/commit/014d683a8cc251f0f4cddb28662b45b7b96d4edb))
* render right trailing col ([#647](https://github.com/antvis/S2/issues/647)) ([f367f05](https://github.com/antvis/S2/commit/f367f0554d897826300bd007bd229c25e889567c))
* **resize:** fix corner resize blank ([#599](https://github.com/antvis/S2/issues/599)) ([82cc929](https://github.com/antvis/S2/commit/82cc929d656ff0c82c80bdbc339958af19c3fe7c))
* **resize:** fix set width and height problem ([#402](https://github.com/antvis/S2/issues/402)) ([41caf18](https://github.com/antvis/S2/commit/41caf1812687130d9d4d595b680c544a69a49843))
* return filtered dataset on range_filtered event ([#513](https://github.com/antvis/S2/issues/513)) ([ed7e78a](https://github.com/antvis/S2/commit/ed7e78adea7b8bd1c629c579f36ae6f2b5f2c15f))
* revert code ([#325](https://github.com/antvis/S2/issues/325)) ([6ece5e8](https://github.com/antvis/S2/commit/6ece5e89f50b7d450c412e224546e923792d0aca))
* row-col-click's show about pivot and table, formatter when onlyShowCellText ([#327](https://github.com/antvis/S2/issues/327)) ([23d3508](https://github.com/antvis/S2/commit/23d3508bc42954e1561c350cc11db54cc54bf321))
* scroll move event target ([#622](https://github.com/antvis/S2/issues/622)) ([79583c1](https://github.com/antvis/S2/commit/79583c183bfdc1f9fc383b0cc24168e98c46fa8b))
* **scroll:** fix cannot scroll by mouse or touch tablet ([#698](https://github.com/antvis/S2/issues/698)) ([edbbe6f](https://github.com/antvis/S2/commit/edbbe6f2598118f1762f7077e22fa319ab63547f))
* **scroll:** optimize scroll hover event ([#577](https://github.com/antvis/S2/issues/577)) ([5006bdc](https://github.com/antvis/S2/commit/5006bdc7b1bcd2d1f4e0d7157c59d84f3c51d66b))
* **scroll:** scroll by group ([#727](https://github.com/antvis/S2/issues/727)) ([b365e8b](https://github.com/antvis/S2/commit/b365e8b067ca6c92fafac404690b3157ca827a79))
* **scroll:** show tooltip when scrolling ([#567](https://github.com/antvis/S2/issues/567)) ([62b1d06](https://github.com/antvis/S2/commit/62b1d06afc417eec3fd90a4fab2309770fc0fadf))
* **scroll:** sync row scroll offset when corner cell resized ([#720](https://github.com/antvis/S2/issues/720)) ([6f9b8f4](https://github.com/antvis/S2/commit/6f9b8f41002fb0b9c21c1773f54529ee3422d5ab))
* sortBy ([#566](https://github.com/antvis/S2/issues/566)) ([a16a331](https://github.com/antvis/S2/commit/a16a331a27b4ece17e78919bdcf4fc9a97c03830))
* sortMethod ([#545](https://github.com/antvis/S2/issues/545)) ([a2af01a](https://github.com/antvis/S2/commit/a2af01a380801a5cd75021d9c6bd6931c5db9a95))
* **spreadsheet:** solve the workflow and test case ([#286](https://github.com/antvis/S2/issues/286)) ([c44e469](https://github.com/antvis/S2/commit/c44e4691435623d7de84b70c08308d2b1943d6bc)), closes [#269](https://github.com/antvis/S2/issues/269) [#270](https://github.com/antvis/S2/issues/270) [#268](https://github.com/antvis/S2/issues/268) [#267](https://github.com/antvis/S2/issues/267) [#271](https://github.com/antvis/S2/issues/271) [#272](https://github.com/antvis/S2/issues/272) [#265](https://github.com/antvis/S2/issues/265) [#274](https://github.com/antvis/S2/issues/274) [#276](https://github.com/antvis/S2/issues/276) [#277](https://github.com/antvis/S2/issues/277) [#283](https://github.com/antvis/S2/issues/283) [#273](https://github.com/antvis/S2/issues/273) [#267](https://github.com/antvis/S2/issues/267)
* table dataset spec ([#288](https://github.com/antvis/S2/issues/288)) ([63bef22](https://github.com/antvis/S2/commit/63bef22319ab05c7d1b3d9aeace49e043731d3af))
* **table:** frozen pagination issue ([#338](https://github.com/antvis/S2/issues/338)) ([39d26a5](https://github.com/antvis/S2/commit/39d26a56de3ecc862c529d72b9dc431b1af0611a))
* table sheet sort ([#763](https://github.com/antvis/S2/issues/763)) ([e5dd71a](https://github.com/antvis/S2/commit/e5dd71aed3292c1b08ed1e6917ac0beead260a26))
* **table-facet:** calulate colsHierarchy width after layoutCoordinate hook ([#518](https://github.com/antvis/S2/issues/518)) ([c0636fb](https://github.com/antvis/S2/commit/c0636fbc35ffcb27e95064fd6e04b596d09118cd))
* **table:** fix expand column icon cover text and sort icon ([#677](https://github.com/antvis/S2/issues/677)) ([b2e1658](https://github.com/antvis/S2/commit/b2e16585c3cf4995d8b11facfac3d11d7c024324))
* **table:** scroll position issue when re-render ([#459](https://github.com/antvis/S2/issues/459)) ([4dfa275](https://github.com/antvis/S2/commit/4dfa275ac8cbac33767dd6a8d4def60190c4afa4))
* **table:** table mode corner width err ([#396](https://github.com/antvis/S2/issues/396)) ([e3b9442](https://github.com/antvis/S2/commit/e3b9442ef2952b1047f9e46b3cdf5c153318b768))
* **table:** table sort fix && col layout fix ([#722](https://github.com/antvis/S2/issues/722)) ([6219860](https://github.com/antvis/S2/commit/6219860c3be5dd43eb3307dbee7df199fcb26c06))
* **tooltip:** custom tooltip keep right position wrong calc ([#436](https://github.com/antvis/S2/issues/436)) ([88fe05e](https://github.com/antvis/S2/commit/88fe05e7241e38e817ec60ddc40ef63315dbb3be))
* **tooltip:** fix cannot render tooltip element when first show ([#354](https://github.com/antvis/S2/issues/354)) ([78c22a6](https://github.com/antvis/S2/commit/78c22a6c8d3abb6357451e6752ad4fb4c2334e25))
* **tooltip:** fix cannot show sort menu when icon first clicked ([#366](https://github.com/antvis/S2/issues/366)) ([9c800a5](https://github.com/antvis/S2/commit/9c800a55291c36fed84bbf4e393e1b4dd6576e60))
* **tooltip:** fix tooltip position and point event ([#574](https://github.com/antvis/S2/issues/574)) ([da71848](https://github.com/antvis/S2/commit/da71848aa15f495d1570bc1d529bbd10ac27f2a0))
* **tooltip:** tooltip don't show ([#749](https://github.com/antvis/S2/issues/749)) ([25bda19](https://github.com/antvis/S2/commit/25bda197c21c9276963fb68eecae4a91d5a9841c))
* **tooltip:** tooltip will hide if cliced ([#370](https://github.com/antvis/S2/issues/370)) ([dccd4f5](https://github.com/antvis/S2/commit/dccd4f5bf667af0401e9d517f729992ba6dc7068))
* update d.ts path ([#319](https://github.com/antvis/S2/issues/319)) ([4117fa5](https://github.com/antvis/S2/commit/4117fa5bc3a23956f6e61cf0284cdd11356f7e39))
* update external using regex ([#304](https://github.com/antvis/S2/issues/304)) ([c40d3cc](https://github.com/antvis/S2/commit/c40d3cc6d37395b9c45d6ee2720126a2a1c8a87d))

### Features

* :art: only show the header cell tooltip when the text is omitted ([#633](https://github.com/antvis/S2/issues/633)) ([ad785db](https://github.com/antvis/S2/commit/ad785dbbaba3547f47d0d6390d5f1f3958165d86))
* :sparkles: add column header labels for the corner header ([#320](https://github.com/antvis/S2/issues/320)) ([1b87bda](https://github.com/antvis/S2/commit/1b87bda6e6c2decfbd60c975d78afbcf5f0eb400))
* :sparkles: add skeleton for empty data and close [#507](https://github.com/antvis/S2/issues/507) ([#532](https://github.com/antvis/S2/issues/532)) ([ba1b447](https://github.com/antvis/S2/commit/ba1b44764c0a817dc8453bbb5c56714cdbc354af))
* :sparkles: allow users to set different display condition for headerActionIcons ([#352](https://github.com/antvis/S2/issues/352)) ([9375f2b](https://github.com/antvis/S2/commit/9375f2b8e594355b2e456fb18910085139f76932))
* :sparkles: init examples gallery for the site ([#280](https://github.com/antvis/S2/issues/280)) ([891ce39](https://github.com/antvis/S2/commit/891ce391e5009384a34b7b91ee3507f8c1cae708))
* :sparkles: make the head width change with the width of the sheet ([#701](https://github.com/antvis/S2/issues/701)) ([498f6d7](https://github.com/antvis/S2/commit/498f6d775ded38e2a7997151b9cef92e4bda688d))
* ♻️ refactor the layout logic and provide tree layout-widths ([#682](https://github.com/antvis/S2/issues/682)) ([ac7dd6e](https://github.com/antvis/S2/commit/ac7dd6e1203d3f81ce7faf0ccad0557a944518ee))
* ✨ add custom header action icons ([#331](https://github.com/antvis/S2/issues/331)) ([4dcb1a2](https://github.com/antvis/S2/commit/4dcb1a2344783c8df283071bee1f8b07988b9b01))
* ✨ enable users to set the page size of the pagination configuration and close [#302](https://github.com/antvis/S2/issues/302) ([#309](https://github.com/antvis/S2/issues/309)) ([e5e961e](https://github.com/antvis/S2/commit/e5e961e306092c7ebabefa782a7ea54324656018))
* ✨ part drill down based on the new data process ([#399](https://github.com/antvis/S2/issues/399)) ([6a8889b](https://github.com/antvis/S2/commit/6a8889be5c47c49f335528548b3289577e0bd175))
* ✨ refactor the s2 based on new data-process ([#235](https://github.com/antvis/S2/issues/235)) ([31dd6a0](https://github.com/antvis/S2/commit/31dd6a0b9c96065b0f2bebb71fdb645b1d75db54)), closes [#7](https://github.com/antvis/S2/issues/7) [#10](https://github.com/antvis/S2/issues/10) [#12](https://github.com/antvis/S2/issues/12) [#13](https://github.com/antvis/S2/issues/13) [#16](https://github.com/antvis/S2/issues/16) [#17](https://github.com/antvis/S2/issues/17) [#11](https://github.com/antvis/S2/issues/11) [#19](https://github.com/antvis/S2/issues/19) [#18](https://github.com/antvis/S2/issues/18) [#21](https://github.com/antvis/S2/issues/21) [#23](https://github.com/antvis/S2/issues/23) [#20](https://github.com/antvis/S2/issues/20) [#24](https://github.com/antvis/S2/issues/24) [#20](https://github.com/antvis/S2/issues/20) [#26](https://github.com/antvis/S2/issues/26) [#27](https://github.com/antvis/S2/issues/27) [#28](https://github.com/antvis/S2/issues/28) [#29](https://github.com/antvis/S2/issues/29) [#35](https://github.com/antvis/S2/issues/35) [#37](https://github.com/antvis/S2/issues/37) [#38](https://github.com/antvis/S2/issues/38) [#39](https://github.com/antvis/S2/issues/39) [#42](https://github.com/antvis/S2/issues/42) [#43](https://github.com/antvis/S2/issues/43) [#44](https://github.com/antvis/S2/issues/44) [#45](https://github.com/antvis/S2/issues/45) [#47](https://github.com/antvis/S2/issues/47) [#46](https://github.com/antvis/S2/issues/46) [#48](https://github.com/antvis/S2/issues/48) [#32](https://github.com/antvis/S2/issues/32) [#31](https://github.com/antvis/S2/issues/31) [#49](https://github.com/antvis/S2/issues/49) [#32](https://github.com/antvis/S2/issues/32) [#31](https://github.com/antvis/S2/issues/31) [#50](https://github.com/antvis/S2/issues/50) [#51](https://github.com/antvis/S2/issues/51) [#52](https://github.com/antvis/S2/issues/52) [#55](https://github.com/antvis/S2/issues/55) [#57](https://github.com/antvis/S2/issues/57) [#58](https://github.com/antvis/S2/issues/58) [#59](https://github.com/antvis/S2/issues/59) [#14](https://github.com/antvis/S2/issues/14) [#30](https://github.com/antvis/S2/issues/30) [#60](https://github.com/antvis/S2/issues/60) [#61](https://github.com/antvis/S2/issues/61) [#64](https://github.com/antvis/S2/issues/64) [#65](https://github.com/antvis/S2/issues/65) [#69](https://github.com/antvis/S2/issues/69) [#70](https://github.com/antvis/S2/issues/70) [#71](https://github.com/antvis/S2/issues/71) [#70](https://github.com/antvis/S2/issues/70) [#70](https://github.com/antvis/S2/issues/70) [#72](https://github.com/antvis/S2/issues/72) [#73](https://github.com/antvis/S2/issues/73) [#74](https://github.com/antvis/S2/issues/74) [#75](https://github.com/antvis/S2/issues/75) [#76](https://github.com/antvis/S2/issues/76) [#82](https://github.com/antvis/S2/issues/82) [#85](https://github.com/antvis/S2/issues/85) [#91](https://github.com/antvis/S2/issues/91) [#81](https://github.com/antvis/S2/issues/81) [#94](https://github.com/antvis/S2/issues/94) [#95](https://github.com/antvis/S2/issues/95) [#100](https://github.com/antvis/S2/issues/100) [#99](https://github.com/antvis/S2/issues/99) [#101](https://github.com/antvis/S2/issues/101) [#107](https://github.com/antvis/S2/issues/107) [#108](https://github.com/antvis/S2/issues/108) [#109](https://github.com/antvis/S2/issues/109) [#112](https://github.com/antvis/S2/issues/112) [#114](https://github.com/antvis/S2/issues/114) [#115](https://github.com/antvis/S2/issues/115) [#116](https://github.com/antvis/S2/issues/116) [#117](https://github.com/antvis/S2/issues/117) [#119](https://github.com/antvis/S2/issues/119) [#121](https://github.com/antvis/S2/issues/121) [#122](https://github.com/antvis/S2/issues/122) [#124](https://github.com/antvis/S2/issues/124) [#125](https://github.com/antvis/S2/issues/125) [#123](https://github.com/antvis/S2/issues/123) [#120](https://github.com/antvis/S2/issues/120) [#126](https://github.com/antvis/S2/issues/126) [#128](https://github.com/antvis/S2/issues/128) [#130](https://github.com/antvis/S2/issues/130) [#129](https://github.com/antvis/S2/issues/129) [#113](https://github.com/antvis/S2/issues/113) [#132](https://github.com/antvis/S2/issues/132) [#135](https://github.com/antvis/S2/issues/135) [#138](https://github.com/antvis/S2/issues/138) [#118](https://github.com/antvis/S2/issues/118) [#139](https://github.com/antvis/S2/issues/139) [#118](https://github.com/antvis/S2/issues/118) [#142](https://github.com/antvis/S2/issues/142) [#143](https://github.com/antvis/S2/issues/143) [#137](https://github.com/antvis/S2/issues/137) [#136](https://github.com/antvis/S2/issues/136) [#148](https://github.com/antvis/S2/issues/148) [#146](https://github.com/antvis/S2/issues/146) [#149](https://github.com/antvis/S2/issues/149) [#152](https://github.com/antvis/S2/issues/152) [#153](https://github.com/antvis/S2/issues/153) [#155](https://github.com/antvis/S2/issues/155) [#156](https://github.com/antvis/S2/issues/156) [#151](https://github.com/antvis/S2/issues/151) [#157](https://github.com/antvis/S2/issues/157) [#154](https://github.com/antvis/S2/issues/154) [#160](https://github.com/antvis/S2/issues/160) [#162](https://github.com/antvis/S2/issues/162) [#164](https://github.com/antvis/S2/issues/164) [#158](https://github.com/antvis/S2/issues/158) [#167](https://github.com/antvis/S2/issues/167) [#170](https://github.com/antvis/S2/issues/170) [#165](https://github.com/antvis/S2/issues/165) [#171](https://github.com/antvis/S2/issues/171) [#163](https://github.com/antvis/S2/issues/163) [#174](https://github.com/antvis/S2/issues/174) [#172](https://github.com/antvis/S2/issues/172) [#175](https://github.com/antvis/S2/issues/175) [#173](https://github.com/antvis/S2/issues/173) [#179](https://github.com/antvis/S2/issues/179) [#183](https://github.com/antvis/S2/issues/183) [#182](https://github.com/antvis/S2/issues/182) [#180](https://github.com/antvis/S2/issues/180) [#184](https://github.com/antvis/S2/issues/184) [#185](https://github.com/antvis/S2/issues/185) [#181](https://github.com/antvis/S2/issues/181) [#178](https://github.com/antvis/S2/issues/178) [#192](https://github.com/antvis/S2/issues/192) [#189](https://github.com/antvis/S2/issues/189) [#190](https://github.com/antvis/S2/issues/190) [#194](https://github.com/antvis/S2/issues/194) [#197](https://github.com/antvis/S2/issues/197) [#196](https://github.com/antvis/S2/issues/196) [#203](https://github.com/antvis/S2/issues/203) [#207](https://github.com/antvis/S2/issues/207) [#204](https://github.com/antvis/S2/issues/204) [#206](https://github.com/antvis/S2/issues/206) [#208](https://github.com/antvis/S2/issues/208) [#202](https://github.com/antvis/S2/issues/202) [#201](https://github.com/antvis/S2/issues/201) [#209](https://github.com/antvis/S2/issues/209) [#200](https://github.com/antvis/S2/issues/200) [#210](https://github.com/antvis/S2/issues/210) [#211](https://github.com/antvis/S2/issues/211) [#214](https://github.com/antvis/S2/issues/214) [#213](https://github.com/antvis/S2/issues/213) [#212](https://github.com/antvis/S2/issues/212) [#216](https://github.com/antvis/S2/issues/216) [#217](https://github.com/antvis/S2/issues/217) [#218](https://github.com/antvis/S2/issues/218) [#219](https://github.com/antvis/S2/issues/219) [#221](https://github.com/antvis/S2/issues/221) [#222](https://github.com/antvis/S2/issues/222) [#223](https://github.com/antvis/S2/issues/223) [#227](https://github.com/antvis/S2/issues/227) [#228](https://github.com/antvis/S2/issues/228) [#231](https://github.com/antvis/S2/issues/231) [#234](https://github.com/antvis/S2/issues/234) [#230](https://github.com/antvis/S2/issues/230) [#233](https://github.com/antvis/S2/issues/233) [#230](https://github.com/antvis/S2/issues/230) [#236](https://github.com/antvis/S2/issues/236)
* 🎸 added ability to filter field values ([#356](https://github.com/antvis/S2/issues/356)) ([92d9698](https://github.com/antvis/S2/commit/92d9698cf40de4fb3a5f099fd6a44821cb2a1bab))
* 🎸 修复 interactionState 的 borderWidth 和 borderColor 不生效问题 ([#664](https://github.com/antvis/S2/issues/664)) ([8464b4b](https://github.com/antvis/S2/commit/8464b4bc7f54a16599f4e20e5dac0344b873e385))
* 🔖 publish v0.1.3 ([#257](https://github.com/antvis/S2/issues/257)) ([92e452a](https://github.com/antvis/S2/commit/92e452ab6fef1bd4b3a3ed0e424e405e362ce425)), closes [#238](https://github.com/antvis/S2/issues/238) [#237](https://github.com/antvis/S2/issues/237) [#7](https://github.com/antvis/S2/issues/7) [#10](https://github.com/antvis/S2/issues/10) [#12](https://github.com/antvis/S2/issues/12) [#13](https://github.com/antvis/S2/issues/13) [#16](https://github.com/antvis/S2/issues/16) [#17](https://github.com/antvis/S2/issues/17) [#11](https://github.com/antvis/S2/issues/11) [#19](https://github.com/antvis/S2/issues/19) [#18](https://github.com/antvis/S2/issues/18) [#21](https://github.com/antvis/S2/issues/21) [#23](https://github.com/antvis/S2/issues/23) [#20](https://github.com/antvis/S2/issues/20) [#24](https://github.com/antvis/S2/issues/24) [#20](https://github.com/antvis/S2/issues/20) [#26](https://github.com/antvis/S2/issues/26) [#27](https://github.com/antvis/S2/issues/27) [#28](https://github.com/antvis/S2/issues/28) [#29](https://github.com/antvis/S2/issues/29) [#35](https://github.com/antvis/S2/issues/35) [#37](https://github.com/antvis/S2/issues/37) [#38](https://github.com/antvis/S2/issues/38) [#39](https://github.com/antvis/S2/issues/39) [#42](https://github.com/antvis/S2/issues/42) [#43](https://github.com/antvis/S2/issues/43) [#44](https://github.com/antvis/S2/issues/44) [#45](https://github.com/antvis/S2/issues/45) [#47](https://github.com/antvis/S2/issues/47) [#46](https://github.com/antvis/S2/issues/46) [#48](https://github.com/antvis/S2/issues/48) [#32](https://github.com/antvis/S2/issues/32) [#31](https://github.com/antvis/S2/issues/31) [#49](https://github.com/antvis/S2/issues/49) [#32](https://github.com/antvis/S2/issues/32) [#31](https://github.com/antvis/S2/issues/31) [#50](https://github.com/antvis/S2/issues/50) [#51](https://github.com/antvis/S2/issues/51) [#52](https://github.com/antvis/S2/issues/52) [#55](https://github.com/antvis/S2/issues/55) [#57](https://github.com/antvis/S2/issues/57) [#58](https://github.com/antvis/S2/issues/58) [#59](https://github.com/antvis/S2/issues/59) [#14](https://github.com/antvis/S2/issues/14) [#30](https://github.com/antvis/S2/issues/30) [#60](https://github.com/antvis/S2/issues/60) [#61](https://github.com/antvis/S2/issues/61) [#64](https://github.com/antvis/S2/issues/64) [#65](https://github.com/antvis/S2/issues/65) [#69](https://github.com/antvis/S2/issues/69) [#70](https://github.com/antvis/S2/issues/70) [#71](https://github.com/antvis/S2/issues/71) [#70](https://github.com/antvis/S2/issues/70) [#70](https://github.com/antvis/S2/issues/70) [#72](https://github.com/antvis/S2/issues/72) [#73](https://github.com/antvis/S2/issues/73) [#74](https://github.com/antvis/S2/issues/74) [#75](https://github.com/antvis/S2/issues/75) [#76](https://github.com/antvis/S2/issues/76) [#82](https://github.com/antvis/S2/issues/82) [#85](https://github.com/antvis/S2/issues/85) [#91](https://github.com/antvis/S2/issues/91) [#81](https://github.com/antvis/S2/issues/81) [#94](https://github.com/antvis/S2/issues/94) [#95](https://github.com/antvis/S2/issues/95) [#100](https://github.com/antvis/S2/issues/100) [#99](https://github.com/antvis/S2/issues/99) [#101](https://github.com/antvis/S2/issues/101) [#107](https://github.com/antvis/S2/issues/107) [#108](https://github.com/antvis/S2/issues/108) [#109](https://github.com/antvis/S2/issues/109) [#112](https://github.com/antvis/S2/issues/112) [#114](https://github.com/antvis/S2/issues/114) [#115](https://github.com/antvis/S2/issues/115) [#116](https://github.com/antvis/S2/issues/116) [#117](https://github.com/antvis/S2/issues/117) [#119](https://github.com/antvis/S2/issues/119) [#121](https://github.com/antvis/S2/issues/121) [#122](https://github.com/antvis/S2/issues/122) [#124](https://github.com/antvis/S2/issues/124) [#125](https://github.com/antvis/S2/issues/125) [#123](https://github.com/antvis/S2/issues/123) [#120](https://github.com/antvis/S2/issues/120) [#126](https://github.com/antvis/S2/issues/126) [#128](https://github.com/antvis/S2/issues/128) [#130](https://github.com/antvis/S2/issues/130) [#129](https://github.com/antvis/S2/issues/129) [#113](https://github.com/antvis/S2/issues/113) [#132](https://github.com/antvis/S2/issues/132) [#135](https://github.com/antvis/S2/issues/135) [#138](https://github.com/antvis/S2/issues/138) [#118](https://github.com/antvis/S2/issues/118) [#139](https://github.com/antvis/S2/issues/139) [#118](https://github.com/antvis/S2/issues/118) [#142](https://github.com/antvis/S2/issues/142) [#143](https://github.com/antvis/S2/issues/143) [#137](https://github.com/antvis/S2/issues/137) [#136](https://github.com/antvis/S2/issues/136) [#148](https://github.com/antvis/S2/issues/148) [#146](https://github.com/antvis/S2/issues/146) [#149](https://github.com/antvis/S2/issues/149) [#152](https://github.com/antvis/S2/issues/152) [#153](https://github.com/antvis/S2/issues/153) [#155](https://github.com/antvis/S2/issues/155) [#156](https://github.com/antvis/S2/issues/156) [#151](https://github.com/antvis/S2/issues/151) [#157](https://github.com/antvis/S2/issues/157) [#154](https://github.com/antvis/S2/issues/154) [#160](https://github.com/antvis/S2/issues/160) [#162](https://github.com/antvis/S2/issues/162) [#164](https://github.com/antvis/S2/issues/164) [#158](https://github.com/antvis/S2/issues/158) [#167](https://github.com/antvis/S2/issues/167) [#170](https://github.com/antvis/S2/issues/170) [#165](https://github.com/antvis/S2/issues/165) [#171](https://github.com/antvis/S2/issues/171) [#163](https://github.com/antvis/S2/issues/163) [#174](https://github.com/antvis/S2/issues/174) [#172](https://github.com/antvis/S2/issues/172) [#175](https://github.com/antvis/S2/issues/175) [#173](https://github.com/antvis/S2/issues/173) [#179](https://github.com/antvis/S2/issues/179) [#183](https://github.com/antvis/S2/issues/183) [#182](https://github.com/antvis/S2/issues/182) [#180](https://github.com/antvis/S2/issues/180) [#184](https://github.com/antvis/S2/issues/184) [#185](https://github.com/antvis/S2/issues/185) [#181](https://github.com/antvis/S2/issues/181) [#178](https://github.com/antvis/S2/issues/178) [#192](https://github.com/antvis/S2/issues/192) [#189](https://github.com/antvis/S2/issues/189) [#190](https://github.com/antvis/S2/issues/190) [#194](https://github.com/antvis/S2/issues/194) [#197](https://github.com/antvis/S2/issues/197) [#196](https://github.com/antvis/S2/issues/196) [#203](https://github.com/antvis/S2/issues/203) [#207](https://github.com/antvis/S2/issues/207) [#204](https://github.com/antvis/S2/issues/204) [#206](https://github.com/antvis/S2/issues/206) [#208](https://github.com/antvis/S2/issues/208) [#202](https://github.com/antvis/S2/issues/202) [#201](https://github.com/antvis/S2/issues/201) [#209](https://github.com/antvis/S2/issues/209) [#200](https://github.com/antvis/S2/issues/200) [#210](https://github.com/antvis/S2/issues/210) [#211](https://github.com/antvis/S2/issues/211) [#214](https://github.com/antvis/S2/issues/214) [#213](https://github.com/antvis/S2/issues/213) [#212](https://github.com/antvis/S2/issues/212) [#216](https://github.com/antvis/S2/issues/216) [#217](https://github.com/antvis/S2/issues/217) [#218](https://github.com/antvis/S2/issues/218) [#219](https://github.com/antvis/S2/issues/219) [#221](https://github.com/antvis/S2/issues/221) [#222](https://github.com/antvis/S2/issues/222) [#240](https://github.com/antvis/S2/issues/240) [#241](https://github.com/antvis/S2/issues/241) [#242](https://github.com/antvis/S2/issues/242) [#248](https://github.com/antvis/S2/issues/248) [#245](https://github.com/antvis/S2/issues/245) [#252](https://github.com/antvis/S2/issues/252) [#249](https://github.com/antvis/S2/issues/249)
* add advanced sort component ([#428](https://github.com/antvis/S2/issues/428)) ([c3a3fb5](https://github.com/antvis/S2/commit/c3a3fb5ba16dc4ef65f301b054a78095c36f5524))
* add confirm and cancel button for switcher ([#495](https://github.com/antvis/S2/issues/495)) ([d31ce63](https://github.com/antvis/S2/commit/d31ce63a87d87878f033f51ac2a0e7f4d90c2b31))
* add doc for table ([#360](https://github.com/antvis/S2/issues/360)) ([a7ee65e](https://github.com/antvis/S2/commit/a7ee65e4f46a0e8253a756d6c2619166e36a8c8e))
* add group sort in col's values and refactor tooltip's style ([#284](https://github.com/antvis/S2/issues/284)) ([ad02d9d](https://github.com/antvis/S2/commit/ad02d9db301f6be34112ac99e6db2de48af4c2dc)), closes [#269](https://github.com/antvis/S2/issues/269) [#270](https://github.com/antvis/S2/issues/270) [#268](https://github.com/antvis/S2/issues/268) [#267](https://github.com/antvis/S2/issues/267) [#271](https://github.com/antvis/S2/issues/271) [#272](https://github.com/antvis/S2/issues/272) [#265](https://github.com/antvis/S2/issues/265) [#274](https://github.com/antvis/S2/issues/274) [#276](https://github.com/antvis/S2/issues/276) [#277](https://github.com/antvis/S2/issues/277) [#283](https://github.com/antvis/S2/issues/283)
* add resize area highlight for whole rows and columns ([#645](https://github.com/antvis/S2/issues/645)) ([ec224d9](https://github.com/antvis/S2/commit/ec224d9a2028ced85024d2a05f80e19d8af12e5e))
* add shadow for table mode ([#610](https://github.com/antvis/S2/issues/610)) ([07039a9](https://github.com/antvis/S2/commit/07039a95e7cedfdc3e6b84107ba36b64ddb87a74))
* add tooltip col and row config handle ([#440](https://github.com/antvis/S2/issues/440)) ([b457d27](https://github.com/antvis/S2/commit/b457d27ce1ba6de368e39632675c295ff3af8174))
* add total measure formatter for values in rows ([#462](https://github.com/antvis/S2/issues/462)) ([615be65](https://github.com/antvis/S2/commit/615be65b2f1afe9815c7889a34b6aa17a303dc66))
* copy with row and col ([#387](https://github.com/antvis/S2/issues/387)) ([7602ef8](https://github.com/antvis/S2/commit/7602ef87d5821b7a897c779f90d37bfc1e52d25f))
* **custom-tree:** fix custom-tree mode & custom-tree test ([#666](https://github.com/antvis/S2/issues/666)) ([f849a2f](https://github.com/antvis/S2/commit/f849a2f873e9bbed543e9bb3c8c57f2d1bd68506)), closes [#605](https://github.com/antvis/S2/issues/605)
* dimensions switcher ([#298](https://github.com/antvis/S2/issues/298)) ([f223319](https://github.com/antvis/S2/commit/f2233194850604f5245e7eb19ea61f3993a592fe)), closes [#269](https://github.com/antvis/S2/issues/269) [#270](https://github.com/antvis/S2/issues/270) [#268](https://github.com/antvis/S2/issues/268) [#267](https://github.com/antvis/S2/issues/267) [#271](https://github.com/antvis/S2/issues/271)
* **facet:** add scroll speed ratio ([#438](https://github.com/antvis/S2/issues/438)) ([9ba97fb](https://github.com/antvis/S2/commit/9ba97fb716132b5c5bd49f03e16a6cb5d0ae51e4))
* fix table col issue ([#589](https://github.com/antvis/S2/issues/589)) ([329b9a5](https://github.com/antvis/S2/commit/329b9a51829fafa5314cb2f8506d161ea0697ad3))
* **interaction:** add autoResetSheetStyle options ([#465](https://github.com/antvis/S2/issues/465)) ([00f316d](https://github.com/antvis/S2/commit/00f316d99566478c96660ff72d2f0541af572c74))
* **interaction:** hidden columns ([#296](https://github.com/antvis/S2/issues/296)) ([f5f4a69](https://github.com/antvis/S2/commit/f5f4a69dbd2b436f36e874323115d54af9f0aa16))
* **interaction:** select interaction imporement ([#324](https://github.com/antvis/S2/issues/324)) ([6b5479d](https://github.com/antvis/S2/commit/6b5479d9cb9718ce0c657277ef2ad30c56b8ded7))
* **interaction:** shift interval select ([#732](https://github.com/antvis/S2/issues/732)) ([d21d410](https://github.com/antvis/S2/commit/d21d41028f505d8ad9d5cb0e5bec192a3c3a34b4))
* merged cell related documents, tests and some refactoring ([#702](https://github.com/antvis/S2/issues/702)) ([74dc450](https://github.com/antvis/S2/commit/74dc450aed3e9057cf2b689f7c964dd40657a350))
* **options:** add empty cell placeholder options ([#658](https://github.com/antvis/S2/issues/658)) ([b4b7fdd](https://github.com/antvis/S2/commit/b4b7fdd94aba0f9312754435569d906b5d371ffb))
* perfect and repair merged cells ([#608](https://github.com/antvis/S2/issues/608)) ([edd3ae3](https://github.com/antvis/S2/commit/edd3ae36585607320646b4f3740b84237416bea7))
* refactor switcher component ([#380](https://github.com/antvis/S2/issues/380)) ([f5c2993](https://github.com/antvis/S2/commit/f5c2993801d4f2b0d09ecaf4b8f751deefbac0d0))
* select all ([#348](https://github.com/antvis/S2/issues/348)) ([334aac4](https://github.com/antvis/S2/commit/334aac41ac9511c3b417a7006591fdbf138ab618)), closes [#342](https://github.com/antvis/S2/issues/342) [#339](https://github.com/antvis/S2/issues/339)
* tooltip support config auto adjust boundary ([#538](https://github.com/antvis/S2/issues/538)) ([2a14873](https://github.com/antvis/S2/commit/2a14873507c1480b3b209ffd5cb46421aca4096e))
* **util:** add generateId export function ([#488](https://github.com/antvis/S2/issues/488)) ([0e6025e](https://github.com/antvis/S2/commit/0e6025e20e5b2eeca0692dbb90fabcaffd66d3c1))

### Performance Improvements

* **sa:** fix console.time & sa performance ([#672](https://github.com/antvis/S2/issues/672)) ([cb5990f](https://github.com/antvis/S2/commit/cb5990f81f8c9b4da674eebdb0c49bb8eaa4f19d))

# [1.0.0](https://github.com/antvis/S2/compare/v0.1.0-alpha.15...v1.0.0) (2021-11-21)

### Bug Fixes

* correct corner node width align with total cell, close [#522](https://github.com/antvis/S2/issues/522) ([#541](https://github.com/antvis/S2/issues/541)) ([49303e4](https://github.com/antvis/S2/commit/49303e40e70a316970c2ceade9494098d3eed391))
* :bug: correct the condition of the adustTotalNodesCoordinate ([#455](https://github.com/antvis/S2/issues/455)) ([34c9f87](https://github.com/antvis/S2/commit/34c9f87897186a2ab62c26062ddeae08c9704308))
* :bug: correct the wrong condition to show the default headerActionIcons for detail table mode ([#486](https://github.com/antvis/S2/issues/486)) ([596e9f3](https://github.com/antvis/S2/commit/596e9f333769967c49ae822292efe02412ed2220))
* :bug: optimize the rendering logic for the skeleton and close [#507](https://github.com/antvis/S2/issues/507) ([#564](https://github.com/antvis/S2/issues/564)) ([2cbd2b7](https://github.com/antvis/S2/commit/2cbd2b7b06260ec3a6a9290556ebce89f2d837ce))
* :bug: optimize the subTotal cells layout logic and close [#368](https://github.com/antvis/S2/issues/368) ([#425](https://github.com/antvis/S2/issues/425)) ([7fe2cbf](https://github.com/antvis/S2/commit/7fe2cbf1728b223e4717add85e0b6e27a398b56f))
* :bug: prevent the cell click event when clicking the HeaderActionIcon and close [#409](https://github.com/antvis/S2/issues/409) [#452](https://github.com/antvis/S2/issues/452) ([#489](https://github.com/antvis/S2/issues/489)) ([f1a1a82](https://github.com/antvis/S2/commit/f1a1a8252de46b137221c6fe85f0deced2591fb6))
* :bug: refactor the csvString ([#596](https://github.com/antvis/S2/issues/596)) ([1a88b8f](https://github.com/antvis/S2/commit/1a88b8f652b0d5eb404b7d230e6f62e3f275149c))
* :bug: refactor the process of standardTransform ([#528](https://github.com/antvis/S2/issues/528)) ([315f5c3](https://github.com/antvis/S2/commit/315f5c3b08c157458e3147bd0b99af2e79c8e094))
* :bug: set the default page and close [#473](https://github.com/antvis/S2/issues/473) ([#500](https://github.com/antvis/S2/issues/500)) ([567dc0e](https://github.com/antvis/S2/commit/567dc0e1b57c6dff4935cd387abd47ba251e86d8))
* :bug: solve the issue that the selectedCellsSpotlight does not work ([#704](https://github.com/antvis/S2/issues/704)) ([535a792](https://github.com/antvis/S2/commit/535a7929cc53a2f892e476ab87b418e6fe31adcd))
* :bug: solve the wrong clear drill-dwon state ([#539](https://github.com/antvis/S2/issues/539)) ([eb5b4ee](https://github.com/antvis/S2/commit/eb5b4ee61c53231bff0bc8936f7a0c490519bd65))
* :bug: solve the wrong numbers of headerActionIcons config in drill-down mode ([#445](https://github.com/antvis/S2/issues/445)) ([7ca0a70](https://github.com/antvis/S2/commit/7ca0a70a8f822146c9a672fa420e22ea5f2f617a))
* 🐛 solve the wrong position of the grandTotal cell in multi-value mode and close [#372](https://github.com/antvis/S2/issues/372) ([#437](https://github.com/antvis/S2/issues/437)) ([b24657c](https://github.com/antvis/S2/commit/b24657c65d027f3447cbbc07d089022f3edfbe27))
* 🐛 tweak the corner cell icon position and close [#464](https://github.com/antvis/S2/issues/464) ([#504](https://github.com/antvis/S2/issues/504)) ([5ea90a6](https://github.com/antvis/S2/commit/5ea90a63d953f3e79a02bf3352e02e09a53efa71))
* 🐛 add the `spreadsheet` for the meta of the corner cell in tree mode and tweak the style of cell borders ([#342](https://github.com/antvis/S2/issues/342)) ([f322519](https://github.com/antvis/S2/commit/f322519fe42659286c0d4306eef0fa2922ad69aa)), closes [#339](https://github.com/antvis/S2/issues/339)
* 🐛 clear the drill-down cache after setting the dataConfig and close [#496](https://github.com/antvis/S2/issues/496) ([#510](https://github.com/antvis/S2/issues/510)) ([c39a07b](https://github.com/antvis/S2/commit/c39a07bfa0c1caeae66d428278c29012b8e3e4ea))
* 🐛 err when hierarchyType is tree and data is empty ([#527](https://github.com/antvis/S2/issues/527)) ([1bbca96](https://github.com/antvis/S2/commit/1bbca962e26572ac94ec7501e5268795f57f22b1))
* 🐛 event disposal on facet destroy ([#493](https://github.com/antvis/S2/issues/493)) ([e48a20d](https://github.com/antvis/S2/commit/e48a20dfac17c6364909c157dd7ad6c4a7d0f51b))
* 🐛 fix the wrong params of export function ([#159](https://github.com/antvis/S2/issues/159)) ([ce66363](https://github.com/antvis/S2/commit/ce663637c63ef173019d8233237ed8ee7d98eaa9))
* 🐛 getEndRows return all items when theres no frozen row ([#503](https://github.com/antvis/S2/issues/503)) ([6952526](https://github.com/antvis/S2/commit/6952526bd265638986ebbefa27b4b4d3922fa8cc))
* 🐛 interactorBorder 宽度自适应 ([#705](https://github.com/antvis/S2/issues/705)) ([1271081](https://github.com/antvis/S2/commit/12710811ce2e8a1afda7e873b44ffc15d6554b3e))
* 🐛 optimize the logic of toggleActionIcon and close [#552](https://github.com/antvis/S2/issues/552) ([#560](https://github.com/antvis/S2/issues/560)) ([2d08950](https://github.com/antvis/S2/commit/2d0895068fb1ea84cb722defa2b4774742b9f0bc))
* 🐛 solve the wrong order of the row meta and close [#511](https://github.com/antvis/S2/issues/511) ([#542](https://github.com/antvis/S2/issues/542)) ([6da8d42](https://github.com/antvis/S2/commit/6da8d427f1bad67747decc2ee784056397c8c224))
* 🐛 solve the wrong render state when updating the dataCfg and close [#285](https://github.com/antvis/S2/issues/285) ([#299](https://github.com/antvis/S2/issues/299)) ([b69cf24](https://github.com/antvis/S2/commit/b69cf2405584483cc1639adc2d44af1b728f8d05))
* 🐛 totals caculate width's err when data is empty but options have totals ([#517](https://github.com/antvis/S2/issues/517)) ([96c35f7](https://github.com/antvis/S2/commit/96c35f7151011322d8163440e9b8140a714356ec))
* 🐛 修复 1px 边框错位的问题 ([#744](https://github.com/antvis/S2/issues/744)) ([2b628a6](https://github.com/antvis/S2/commit/2b628a68fb9c60c730bb5e849315824117317072))
* add v scrollbar ([#685](https://github.com/antvis/S2/issues/685)) ([b5a1137](https://github.com/antvis/S2/commit/b5a113734b8138c5c0c680ca7245ad4ac2982a7d))
* cannot hidden columns ([#491](https://github.com/antvis/S2/issues/491)) ([dc78a4f](https://github.com/antvis/S2/commit/dc78a4f57b802b1ed2854b32a77abd7d0ecf7afd))
* **cell:** cell padding issue ([#595](https://github.com/antvis/S2/issues/595)) ([4a3a82b](https://github.com/antvis/S2/commit/4a3a82be3f43172992a612c21f3cea8e1dde0a61))
* **component:** fix not use container width when enable adaptive and first rendered ([#620](https://github.com/antvis/S2/issues/620)) ([f7cf450](https://github.com/antvis/S2/commit/f7cf45006ad1a51a5348ae0fddcc23ca6a14114b))
* **components:** fix component render crash with empty options ([#653](https://github.com/antvis/S2/issues/653)) ([ce7aacc](https://github.com/antvis/S2/commit/ce7aacc51c9dc2340fe0ce1a580dd120c562981a))
* **components:** switcher support receive antd popover props for resolve scroling with the page ([#715](https://github.com/antvis/S2/issues/715)) ([078afd3](https://github.com/antvis/S2/commit/078afd392e6cdea9f54c35ce41dc421dbe0fe7c2))
* **copy:** copy with format data ([#674](https://github.com/antvis/S2/issues/674)) ([9dc1b20](https://github.com/antvis/S2/commit/9dc1b20d8c6e550939c7a9c38e243ec7af7bed01))
* **copy:** do not copy when no cell selected ([#752](https://github.com/antvis/S2/issues/752)) ([1bc1192](https://github.com/antvis/S2/commit/1bc119273dbbec4e4c8e11424cb9c6613dab076c))
* **copy:** export data in pivot tree mode ([#572](https://github.com/antvis/S2/issues/572)) ([b9c5b89](https://github.com/antvis/S2/commit/b9c5b899728cb591052d2cb21457a64a486a498d))
* **copy:** fix copy data format problem ([#703](https://github.com/antvis/S2/issues/703)) ([8d15c88](https://github.com/antvis/S2/commit/8d15c883643b02ff925f33adb1feace2b3ec1cb2))
* difficult to select the tooltip after click then merged cell ([#731](https://github.com/antvis/S2/issues/731)) ([2f5bb46](https://github.com/antvis/S2/commit/2f5bb460a4cd5520f05253ead9d8e7608645eb8f))
* disable the drill-down icon for the total row ([#579](https://github.com/antvis/S2/issues/579)) ([37b42b9](https://github.com/antvis/S2/commit/37b42b985252cd42b4e0308ce7e0316321dda837))
* expand corner cell width, make it nowrap initially ([#408](https://github.com/antvis/S2/issues/408)) ([c73bb6d](https://github.com/antvis/S2/commit/c73bb6d391f8f030212eed9ff7b9da249ae95d4a))
* export feature ([#412](https://github.com/antvis/S2/issues/412)) ([6c2a5b8](https://github.com/antvis/S2/commit/6c2a5b8ad625567de5cf138aca51c9faf5d4c354))
* **export:** 🐛 solve the table sheet export problem and close [#446](https://github.com/antvis/S2/issues/446) ([#466](https://github.com/antvis/S2/issues/466)) ([d5eda7c](https://github.com/antvis/S2/commit/d5eda7c8461cc651b6653afcdea71cee5611bbb8))
* **export:** pivot tree mode export error in total dim ([#582](https://github.com/antvis/S2/issues/582)) ([136695e](https://github.com/antvis/S2/commit/136695e2001763b48e4f3b0e05bbbc21d2a1a34d))
* **facet:** adjustXY in pagination ([#709](https://github.com/antvis/S2/issues/709)) ([8238767](https://github.com/antvis/S2/commit/8238767661ac07f3cbcf8d2fa797823ae770b57a))
* **facet:** fix issue [#291](https://github.com/antvis/S2/issues/291) ([#297](https://github.com/antvis/S2/issues/297)) ([28a5c11](https://github.com/antvis/S2/commit/28a5c115501ddbe78432682c9c8cfb4b8b5c7780))
* **facet:** frozen clip and resizer issue ([#275](https://github.com/antvis/S2/issues/275)) ([6b53061](https://github.com/antvis/S2/commit/6b53061583e0062242a6473c2413bae339ff1338)), closes [#269](https://github.com/antvis/S2/issues/269) [#270](https://github.com/antvis/S2/issues/270) [#268](https://github.com/antvis/S2/issues/268) [#267](https://github.com/antvis/S2/issues/267) [#271](https://github.com/antvis/S2/issues/271) [#272](https://github.com/antvis/S2/issues/272) [#265](https://github.com/antvis/S2/issues/265) [#274](https://github.com/antvis/S2/issues/274) [#276](https://github.com/antvis/S2/issues/276)
* **facet:** scrollbar offset ([#707](https://github.com/antvis/S2/issues/707)) ([0bfa052](https://github.com/antvis/S2/commit/0bfa052dc64af97a1eda8ce27c4efcab1a71db9a))
* fix corner icon overlap close [#524](https://github.com/antvis/S2/issues/524) ([#536](https://github.com/antvis/S2/issues/536)) ([228f3bc](https://github.com/antvis/S2/commit/228f3bc07f74e0526e9a8b0e2edad3216f890d6d))
* fix internal svg icon disappear issue in official website ([#654](https://github.com/antvis/S2/issues/654)) ([bd2cdb2](https://github.com/antvis/S2/commit/bd2cdb2c9def850965a92519ebadccda74562cdd))
* fix linkField config path ([#650](https://github.com/antvis/S2/issues/650)) ([fc598b9](https://github.com/antvis/S2/commit/fc598b96171f89b73b74a872a266bc2b826d0a60))
* fix merge cells translate wrong position issue ([#458](https://github.com/antvis/S2/issues/458)) ([5bc7ede](https://github.com/antvis/S2/commit/5bc7ede4fbcb53e83cc77455f1b3ac353e6c1d87))
* fix merged cells can't be sorted and dragged ([#471](https://github.com/antvis/S2/issues/471)) ([cfd9ff0](https://github.com/antvis/S2/commit/cfd9ff03ad98253a4672a2e1117593b3703898e8))
* h scrollbar position ([#592](https://github.com/antvis/S2/issues/592)) ([0a64744](https://github.com/antvis/S2/commit/0a64744952cb21d131308f7406dedcfb7786a747))
* **hd-adapter:** fix wrong container style when zoom scale changed ([#706](https://github.com/antvis/S2/issues/706)) ([05c8fe1](https://github.com/antvis/S2/commit/05c8fe172d5628e3c13bb512e05b5894f6b7ca76))
* **interaction:** add brush move distance validate ([#321](https://github.com/antvis/S2/issues/321)) ([2ee8f9d](https://github.com/antvis/S2/commit/2ee8f9d163ad60692b6ee2e1173e4bfc397430cd))
* **interaction:** cancel data cell hover focus timer when row or col mousemove ([#603](https://github.com/antvis/S2/issues/603)) ([854282b](https://github.com/antvis/S2/commit/854282b77f60676731d9f5c23cac642daeddd422))
* **interaction:** fix wrong corner header width by resize ([#563](https://github.com/antvis/S2/issues/563)) ([6b25a17](https://github.com/antvis/S2/commit/6b25a17a64b3394d9645a5b0896cf1fe3585f0a7))
* **interaction:** hide tooltip and clear hover highlight if mouseleave the cell ([#624](https://github.com/antvis/S2/issues/624)) ([682bf35](https://github.com/antvis/S2/commit/682bf35a8a3e15dfe5aff52deba7cf4cb08ccb27))
* **interaction:** invalid "hiddenColumnFields" config close [#417](https://github.com/antvis/S2/issues/417) ([#431](https://github.com/antvis/S2/issues/431)) ([6cd461e](https://github.com/antvis/S2/commit/6cd461e6d132a18cc7192bf90d946f5de8b8d1f7))
* **interaction:** optimize reset state logic ([#441](https://github.com/antvis/S2/issues/441)) ([f07e657](https://github.com/antvis/S2/commit/f07e657c0c2be5090a390fcc0ee7f4c74a008e3f))
* **interaction:** support batch hidden columns ([#439](https://github.com/antvis/S2/issues/439)) ([d0a4d97](https://github.com/antvis/S2/commit/d0a4d97d4f343c689f227e0ced6e8723dead007f))
* **interaction:** wrong hidden action tooltip when mouse outside the cell ([#635](https://github.com/antvis/S2/issues/635)) ([46274ee](https://github.com/antvis/S2/commit/46274ee5356a3aacaa9777c1d76c97da3e08fded))
* **interaction:** wrong hidden column icon position ([#329](https://github.com/antvis/S2/issues/329)) ([19d4497](https://github.com/antvis/S2/commit/19d4497b3112cf543d170e65f230f0e885ece8a4))
* multi measure render wrong and optimize sortedDimensionValues ([#737](https://github.com/antvis/S2/issues/737)) ([6f8afaa](https://github.com/antvis/S2/commit/6f8afaa555e163d84e345b7e2800d6505fc61b05))
* not sort when sortMethod is not true ([#562](https://github.com/antvis/S2/issues/562)) ([929bcdc](https://github.com/antvis/S2/commit/929bcdc4c3567ee2f65cd0b7b1e65c19370599a7))
* pagination err ([#453](https://github.com/antvis/S2/issues/453)) ([3d0535e](https://github.com/antvis/S2/commit/3d0535e2390a2ce258df00430dd387745251bd04))
* **performance:** optimize performance when table switch to pivot, [#415](https://github.com/antvis/S2/issues/415) ([#429](https://github.com/antvis/S2/issues/429)) ([215e6c4](https://github.com/antvis/S2/commit/215e6c4755c1101bd4920847a398cf48c07448ce))
* pivot data set's get multi data and optimize advanced sort ([#659](https://github.com/antvis/S2/issues/659)) ([248c038](https://github.com/antvis/S2/commit/248c038116df5a5d1d182bf5d53cadd4e45c2d47))
* pivot sheet sort icon's show ([#662](https://github.com/antvis/S2/issues/662)) ([ea1a4f3](https://github.com/antvis/S2/commit/ea1a4f3525001d2b0b898ad974e775c09e71e624))
* **placeholder:** placeholder issue ([#742](https://github.com/antvis/S2/issues/742)) ([144387a](https://github.com/antvis/S2/commit/144387af4e1ad9740b8b153b2d94e8e6a934593c))
* **poivt-table:** fix render apply font crash on ios15 ([#394](https://github.com/antvis/S2/issues/394)) ([cbb7045](https://github.com/antvis/S2/commit/cbb7045354e674c858185c307b1e5ac2ecd0a70f))
* **povit-table:** resolve scroll shake issue close [#374](https://github.com/antvis/S2/issues/374) ([#379](https://github.com/antvis/S2/issues/379)) ([014d683](https://github.com/antvis/S2/commit/014d683a8cc251f0f4cddb28662b45b7b96d4edb))
* render right trailing col ([#647](https://github.com/antvis/S2/issues/647)) ([f367f05](https://github.com/antvis/S2/commit/f367f0554d897826300bd007bd229c25e889567c))
* **resize:** fix corner resize blank ([#599](https://github.com/antvis/S2/issues/599)) ([82cc929](https://github.com/antvis/S2/commit/82cc929d656ff0c82c80bdbc339958af19c3fe7c))
* **resize:** fix set width and height problem ([#402](https://github.com/antvis/S2/issues/402)) ([41caf18](https://github.com/antvis/S2/commit/41caf1812687130d9d4d595b680c544a69a49843))
* return filtered dataset on range_filtered event ([#513](https://github.com/antvis/S2/issues/513)) ([ed7e78a](https://github.com/antvis/S2/commit/ed7e78adea7b8bd1c629c579f36ae6f2b5f2c15f))
* revert code ([#325](https://github.com/antvis/S2/issues/325)) ([6ece5e8](https://github.com/antvis/S2/commit/6ece5e89f50b7d450c412e224546e923792d0aca))
* row-col-click's show about pivot and table, formatter when onlyShowCellText ([#327](https://github.com/antvis/S2/issues/327)) ([23d3508](https://github.com/antvis/S2/commit/23d3508bc42954e1561c350cc11db54cc54bf321))
* scroll move event target ([#622](https://github.com/antvis/S2/issues/622)) ([79583c1](https://github.com/antvis/S2/commit/79583c183bfdc1f9fc383b0cc24168e98c46fa8b))
* **scroll:** fix cannot scroll by mouse or touch tablet ([#698](https://github.com/antvis/S2/issues/698)) ([edbbe6f](https://github.com/antvis/S2/commit/edbbe6f2598118f1762f7077e22fa319ab63547f))
* **scroll:** optimize scroll hover event ([#577](https://github.com/antvis/S2/issues/577)) ([5006bdc](https://github.com/antvis/S2/commit/5006bdc7b1bcd2d1f4e0d7157c59d84f3c51d66b))
* **scroll:** scroll by group ([#727](https://github.com/antvis/S2/issues/727)) ([b365e8b](https://github.com/antvis/S2/commit/b365e8b067ca6c92fafac404690b3157ca827a79))
* **scroll:** show tooltip when scrolling ([#567](https://github.com/antvis/S2/issues/567)) ([62b1d06](https://github.com/antvis/S2/commit/62b1d06afc417eec3fd90a4fab2309770fc0fadf))
* **scroll:** sync row scroll offset when corner cell resized ([#720](https://github.com/antvis/S2/issues/720)) ([6f9b8f4](https://github.com/antvis/S2/commit/6f9b8f41002fb0b9c21c1773f54529ee3422d5ab))
* sortBy ([#566](https://github.com/antvis/S2/issues/566)) ([a16a331](https://github.com/antvis/S2/commit/a16a331a27b4ece17e78919bdcf4fc9a97c03830))
* sortMethod ([#545](https://github.com/antvis/S2/issues/545)) ([a2af01a](https://github.com/antvis/S2/commit/a2af01a380801a5cd75021d9c6bd6931c5db9a95))
* **spreadsheet:** solve the workflow and test case ([#286](https://github.com/antvis/S2/issues/286)) ([c44e469](https://github.com/antvis/S2/commit/c44e4691435623d7de84b70c08308d2b1943d6bc)), closes [#269](https://github.com/antvis/S2/issues/269) [#270](https://github.com/antvis/S2/issues/270) [#268](https://github.com/antvis/S2/issues/268) [#267](https://github.com/antvis/S2/issues/267) [#271](https://github.com/antvis/S2/issues/271) [#272](https://github.com/antvis/S2/issues/272) [#265](https://github.com/antvis/S2/issues/265) [#274](https://github.com/antvis/S2/issues/274) [#276](https://github.com/antvis/S2/issues/276) [#277](https://github.com/antvis/S2/issues/277) [#283](https://github.com/antvis/S2/issues/283) [#273](https://github.com/antvis/S2/issues/273) [#267](https://github.com/antvis/S2/issues/267)
* table dataset spec ([#288](https://github.com/antvis/S2/issues/288)) ([63bef22](https://github.com/antvis/S2/commit/63bef22319ab05c7d1b3d9aeace49e043731d3af))
* **table:** frozen pagination issue ([#338](https://github.com/antvis/S2/issues/338)) ([39d26a5](https://github.com/antvis/S2/commit/39d26a56de3ecc862c529d72b9dc431b1af0611a))
* table sheet sort ([#763](https://github.com/antvis/S2/issues/763)) ([e5dd71a](https://github.com/antvis/S2/commit/e5dd71aed3292c1b08ed1e6917ac0beead260a26))
* **table-facet:** calulate colsHierarchy width after layoutCoordinate hook ([#518](https://github.com/antvis/S2/issues/518)) ([c0636fb](https://github.com/antvis/S2/commit/c0636fbc35ffcb27e95064fd6e04b596d09118cd))
* **table:** fix expand column icon cover text and sort icon ([#677](https://github.com/antvis/S2/issues/677)) ([b2e1658](https://github.com/antvis/S2/commit/b2e16585c3cf4995d8b11facfac3d11d7c024324))
* **table:** scroll position issue when re-render ([#459](https://github.com/antvis/S2/issues/459)) ([4dfa275](https://github.com/antvis/S2/commit/4dfa275ac8cbac33767dd6a8d4def60190c4afa4))
* **table:** table mode corner width err ([#396](https://github.com/antvis/S2/issues/396)) ([e3b9442](https://github.com/antvis/S2/commit/e3b9442ef2952b1047f9e46b3cdf5c153318b768))
* **table:** table sort fix && col layout fix ([#722](https://github.com/antvis/S2/issues/722)) ([6219860](https://github.com/antvis/S2/commit/6219860c3be5dd43eb3307dbee7df199fcb26c06))
* **tooltip:** custom tooltip keep right position wrong calc ([#436](https://github.com/antvis/S2/issues/436)) ([88fe05e](https://github.com/antvis/S2/commit/88fe05e7241e38e817ec60ddc40ef63315dbb3be))
* **tooltip:** fix cannot render tooltip element when first show ([#354](https://github.com/antvis/S2/issues/354)) ([78c22a6](https://github.com/antvis/S2/commit/78c22a6c8d3abb6357451e6752ad4fb4c2334e25))
* **tooltip:** fix cannot show sort menu when icon first clicked ([#366](https://github.com/antvis/S2/issues/366)) ([9c800a5](https://github.com/antvis/S2/commit/9c800a55291c36fed84bbf4e393e1b4dd6576e60))
* **tooltip:** fix tooltip position and point event ([#574](https://github.com/antvis/S2/issues/574)) ([da71848](https://github.com/antvis/S2/commit/da71848aa15f495d1570bc1d529bbd10ac27f2a0))
* **tooltip:** tooltip don't show ([#749](https://github.com/antvis/S2/issues/749)) ([25bda19](https://github.com/antvis/S2/commit/25bda197c21c9276963fb68eecae4a91d5a9841c))
* **tooltip:** tooltip will hide if cliced ([#370](https://github.com/antvis/S2/issues/370)) ([dccd4f5](https://github.com/antvis/S2/commit/dccd4f5bf667af0401e9d517f729992ba6dc7068))
* update d.ts path ([#319](https://github.com/antvis/S2/issues/319)) ([4117fa5](https://github.com/antvis/S2/commit/4117fa5bc3a23956f6e61cf0284cdd11356f7e39))
* update external using regex ([#304](https://github.com/antvis/S2/issues/304)) ([c40d3cc](https://github.com/antvis/S2/commit/c40d3cc6d37395b9c45d6ee2720126a2a1c8a87d))

### Features

* :art: only show the header cell tooltip when the text is omitted ([#633](https://github.com/antvis/S2/issues/633)) ([ad785db](https://github.com/antvis/S2/commit/ad785dbbaba3547f47d0d6390d5f1f3958165d86))
* :sparkles: add column header labels for the corner header ([#320](https://github.com/antvis/S2/issues/320)) ([1b87bda](https://github.com/antvis/S2/commit/1b87bda6e6c2decfbd60c975d78afbcf5f0eb400))
* :sparkles: add skeleton for empty data and close [#507](https://github.com/antvis/S2/issues/507) ([#532](https://github.com/antvis/S2/issues/532)) ([ba1b447](https://github.com/antvis/S2/commit/ba1b44764c0a817dc8453bbb5c56714cdbc354af))
* :sparkles: allow users to set different display condition for headerActionIcons ([#352](https://github.com/antvis/S2/issues/352)) ([9375f2b](https://github.com/antvis/S2/commit/9375f2b8e594355b2e456fb18910085139f76932))
* :sparkles: init examples gallery for the site ([#280](https://github.com/antvis/S2/issues/280)) ([891ce39](https://github.com/antvis/S2/commit/891ce391e5009384a34b7b91ee3507f8c1cae708))
* :sparkles: make the head width change with the width of the sheet ([#701](https://github.com/antvis/S2/issues/701)) ([498f6d7](https://github.com/antvis/S2/commit/498f6d775ded38e2a7997151b9cef92e4bda688d))
* ♻️ refactor the layout logic and provide tree layout-widths ([#682](https://github.com/antvis/S2/issues/682)) ([ac7dd6e](https://github.com/antvis/S2/commit/ac7dd6e1203d3f81ce7faf0ccad0557a944518ee))
* ✨ add custom header action icons ([#331](https://github.com/antvis/S2/issues/331)) ([4dcb1a2](https://github.com/antvis/S2/commit/4dcb1a2344783c8df283071bee1f8b07988b9b01))
* ✨ enable users to set the page size of the pagination configuration and close [#302](https://github.com/antvis/S2/issues/302) ([#309](https://github.com/antvis/S2/issues/309)) ([e5e961e](https://github.com/antvis/S2/commit/e5e961e306092c7ebabefa782a7ea54324656018))
* ✨ part drill down based on the new data process ([#399](https://github.com/antvis/S2/issues/399)) ([6a8889b](https://github.com/antvis/S2/commit/6a8889be5c47c49f335528548b3289577e0bd175))
* ✨ refactor the s2 based on new data-process ([#235](https://github.com/antvis/S2/issues/235)) ([31dd6a0](https://github.com/antvis/S2/commit/31dd6a0b9c96065b0f2bebb71fdb645b1d75db54)), closes [#7](https://github.com/antvis/S2/issues/7) [#10](https://github.com/antvis/S2/issues/10) [#12](https://github.com/antvis/S2/issues/12) [#13](https://github.com/antvis/S2/issues/13) [#16](https://github.com/antvis/S2/issues/16) [#17](https://github.com/antvis/S2/issues/17) [#11](https://github.com/antvis/S2/issues/11) [#19](https://github.com/antvis/S2/issues/19) [#18](https://github.com/antvis/S2/issues/18) [#21](https://github.com/antvis/S2/issues/21) [#23](https://github.com/antvis/S2/issues/23) [#20](https://github.com/antvis/S2/issues/20) [#24](https://github.com/antvis/S2/issues/24) [#20](https://github.com/antvis/S2/issues/20) [#26](https://github.com/antvis/S2/issues/26) [#27](https://github.com/antvis/S2/issues/27) [#28](https://github.com/antvis/S2/issues/28) [#29](https://github.com/antvis/S2/issues/29) [#35](https://github.com/antvis/S2/issues/35) [#37](https://github.com/antvis/S2/issues/37) [#38](https://github.com/antvis/S2/issues/38) [#39](https://github.com/antvis/S2/issues/39) [#42](https://github.com/antvis/S2/issues/42) [#43](https://github.com/antvis/S2/issues/43) [#44](https://github.com/antvis/S2/issues/44) [#45](https://github.com/antvis/S2/issues/45) [#47](https://github.com/antvis/S2/issues/47) [#46](https://github.com/antvis/S2/issues/46) [#48](https://github.com/antvis/S2/issues/48) [#32](https://github.com/antvis/S2/issues/32) [#31](https://github.com/antvis/S2/issues/31) [#49](https://github.com/antvis/S2/issues/49) [#32](https://github.com/antvis/S2/issues/32) [#31](https://github.com/antvis/S2/issues/31) [#50](https://github.com/antvis/S2/issues/50) [#51](https://github.com/antvis/S2/issues/51) [#52](https://github.com/antvis/S2/issues/52) [#55](https://github.com/antvis/S2/issues/55) [#57](https://github.com/antvis/S2/issues/57) [#58](https://github.com/antvis/S2/issues/58) [#59](https://github.com/antvis/S2/issues/59) [#14](https://github.com/antvis/S2/issues/14) [#30](https://github.com/antvis/S2/issues/30) [#60](https://github.com/antvis/S2/issues/60) [#61](https://github.com/antvis/S2/issues/61) [#64](https://github.com/antvis/S2/issues/64) [#65](https://github.com/antvis/S2/issues/65) [#69](https://github.com/antvis/S2/issues/69) [#70](https://github.com/antvis/S2/issues/70) [#71](https://github.com/antvis/S2/issues/71) [#70](https://github.com/antvis/S2/issues/70) [#70](https://github.com/antvis/S2/issues/70) [#72](https://github.com/antvis/S2/issues/72) [#73](https://github.com/antvis/S2/issues/73) [#74](https://github.com/antvis/S2/issues/74) [#75](https://github.com/antvis/S2/issues/75) [#76](https://github.com/antvis/S2/issues/76) [#82](https://github.com/antvis/S2/issues/82) [#85](https://github.com/antvis/S2/issues/85) [#91](https://github.com/antvis/S2/issues/91) [#81](https://github.com/antvis/S2/issues/81) [#94](https://github.com/antvis/S2/issues/94) [#95](https://github.com/antvis/S2/issues/95) [#100](https://github.com/antvis/S2/issues/100) [#99](https://github.com/antvis/S2/issues/99) [#101](https://github.com/antvis/S2/issues/101) [#107](https://github.com/antvis/S2/issues/107) [#108](https://github.com/antvis/S2/issues/108) [#109](https://github.com/antvis/S2/issues/109) [#112](https://github.com/antvis/S2/issues/112) [#114](https://github.com/antvis/S2/issues/114) [#115](https://github.com/antvis/S2/issues/115) [#116](https://github.com/antvis/S2/issues/116) [#117](https://github.com/antvis/S2/issues/117) [#119](https://github.com/antvis/S2/issues/119) [#121](https://github.com/antvis/S2/issues/121) [#122](https://github.com/antvis/S2/issues/122) [#124](https://github.com/antvis/S2/issues/124) [#125](https://github.com/antvis/S2/issues/125) [#123](https://github.com/antvis/S2/issues/123) [#120](https://github.com/antvis/S2/issues/120) [#126](https://github.com/antvis/S2/issues/126) [#128](https://github.com/antvis/S2/issues/128) [#130](https://github.com/antvis/S2/issues/130) [#129](https://github.com/antvis/S2/issues/129) [#113](https://github.com/antvis/S2/issues/113) [#132](https://github.com/antvis/S2/issues/132) [#135](https://github.com/antvis/S2/issues/135) [#138](https://github.com/antvis/S2/issues/138) [#118](https://github.com/antvis/S2/issues/118) [#139](https://github.com/antvis/S2/issues/139) [#118](https://github.com/antvis/S2/issues/118) [#142](https://github.com/antvis/S2/issues/142) [#143](https://github.com/antvis/S2/issues/143) [#137](https://github.com/antvis/S2/issues/137) [#136](https://github.com/antvis/S2/issues/136) [#148](https://github.com/antvis/S2/issues/148) [#146](https://github.com/antvis/S2/issues/146) [#149](https://github.com/antvis/S2/issues/149) [#152](https://github.com/antvis/S2/issues/152) [#153](https://github.com/antvis/S2/issues/153) [#155](https://github.com/antvis/S2/issues/155) [#156](https://github.com/antvis/S2/issues/156) [#151](https://github.com/antvis/S2/issues/151) [#157](https://github.com/antvis/S2/issues/157) [#154](https://github.com/antvis/S2/issues/154) [#160](https://github.com/antvis/S2/issues/160) [#162](https://github.com/antvis/S2/issues/162) [#164](https://github.com/antvis/S2/issues/164) [#158](https://github.com/antvis/S2/issues/158) [#167](https://github.com/antvis/S2/issues/167) [#170](https://github.com/antvis/S2/issues/170) [#165](https://github.com/antvis/S2/issues/165) [#171](https://github.com/antvis/S2/issues/171) [#163](https://github.com/antvis/S2/issues/163) [#174](https://github.com/antvis/S2/issues/174) [#172](https://github.com/antvis/S2/issues/172) [#175](https://github.com/antvis/S2/issues/175) [#173](https://github.com/antvis/S2/issues/173) [#179](https://github.com/antvis/S2/issues/179) [#183](https://github.com/antvis/S2/issues/183) [#182](https://github.com/antvis/S2/issues/182) [#180](https://github.com/antvis/S2/issues/180) [#184](https://github.com/antvis/S2/issues/184) [#185](https://github.com/antvis/S2/issues/185) [#181](https://github.com/antvis/S2/issues/181) [#178](https://github.com/antvis/S2/issues/178) [#192](https://github.com/antvis/S2/issues/192) [#189](https://github.com/antvis/S2/issues/189) [#190](https://github.com/antvis/S2/issues/190) [#194](https://github.com/antvis/S2/issues/194) [#197](https://github.com/antvis/S2/issues/197) [#196](https://github.com/antvis/S2/issues/196) [#203](https://github.com/antvis/S2/issues/203) [#207](https://github.com/antvis/S2/issues/207) [#204](https://github.com/antvis/S2/issues/204) [#206](https://github.com/antvis/S2/issues/206) [#208](https://github.com/antvis/S2/issues/208) [#202](https://github.com/antvis/S2/issues/202) [#201](https://github.com/antvis/S2/issues/201) [#209](https://github.com/antvis/S2/issues/209) [#200](https://github.com/antvis/S2/issues/200) [#210](https://github.com/antvis/S2/issues/210) [#211](https://github.com/antvis/S2/issues/211) [#214](https://github.com/antvis/S2/issues/214) [#213](https://github.com/antvis/S2/issues/213) [#212](https://github.com/antvis/S2/issues/212) [#216](https://github.com/antvis/S2/issues/216) [#217](https://github.com/antvis/S2/issues/217) [#218](https://github.com/antvis/S2/issues/218) [#219](https://github.com/antvis/S2/issues/219) [#221](https://github.com/antvis/S2/issues/221) [#222](https://github.com/antvis/S2/issues/222) [#223](https://github.com/antvis/S2/issues/223) [#227](https://github.com/antvis/S2/issues/227) [#228](https://github.com/antvis/S2/issues/228) [#231](https://github.com/antvis/S2/issues/231) [#234](https://github.com/antvis/S2/issues/234) [#230](https://github.com/antvis/S2/issues/230) [#233](https://github.com/antvis/S2/issues/233) [#230](https://github.com/antvis/S2/issues/230) [#236](https://github.com/antvis/S2/issues/236)
* 🎸 added ability to filter field values ([#356](https://github.com/antvis/S2/issues/356)) ([92d9698](https://github.com/antvis/S2/commit/92d9698cf40de4fb3a5f099fd6a44821cb2a1bab))
* 🎸 修复 interactionState 的 borderWidth 和 borderColor 不生效问题 ([#664](https://github.com/antvis/S2/issues/664)) ([8464b4b](https://github.com/antvis/S2/commit/8464b4bc7f54a16599f4e20e5dac0344b873e385))
* 🔖 publish v0.1.3 ([#257](https://github.com/antvis/S2/issues/257)) ([92e452a](https://github.com/antvis/S2/commit/92e452ab6fef1bd4b3a3ed0e424e405e362ce425)), closes [#238](https://github.com/antvis/S2/issues/238) [#237](https://github.com/antvis/S2/issues/237) [#7](https://github.com/antvis/S2/issues/7) [#10](https://github.com/antvis/S2/issues/10) [#12](https://github.com/antvis/S2/issues/12) [#13](https://github.com/antvis/S2/issues/13) [#16](https://github.com/antvis/S2/issues/16) [#17](https://github.com/antvis/S2/issues/17) [#11](https://github.com/antvis/S2/issues/11) [#19](https://github.com/antvis/S2/issues/19) [#18](https://github.com/antvis/S2/issues/18) [#21](https://github.com/antvis/S2/issues/21) [#23](https://github.com/antvis/S2/issues/23) [#20](https://github.com/antvis/S2/issues/20) [#24](https://github.com/antvis/S2/issues/24) [#20](https://github.com/antvis/S2/issues/20) [#26](https://github.com/antvis/S2/issues/26) [#27](https://github.com/antvis/S2/issues/27) [#28](https://github.com/antvis/S2/issues/28) [#29](https://github.com/antvis/S2/issues/29) [#35](https://github.com/antvis/S2/issues/35) [#37](https://github.com/antvis/S2/issues/37) [#38](https://github.com/antvis/S2/issues/38) [#39](https://github.com/antvis/S2/issues/39) [#42](https://github.com/antvis/S2/issues/42) [#43](https://github.com/antvis/S2/issues/43) [#44](https://github.com/antvis/S2/issues/44) [#45](https://github.com/antvis/S2/issues/45) [#47](https://github.com/antvis/S2/issues/47) [#46](https://github.com/antvis/S2/issues/46) [#48](https://github.com/antvis/S2/issues/48) [#32](https://github.com/antvis/S2/issues/32) [#31](https://github.com/antvis/S2/issues/31) [#49](https://github.com/antvis/S2/issues/49) [#32](https://github.com/antvis/S2/issues/32) [#31](https://github.com/antvis/S2/issues/31) [#50](https://github.com/antvis/S2/issues/50) [#51](https://github.com/antvis/S2/issues/51) [#52](https://github.com/antvis/S2/issues/52) [#55](https://github.com/antvis/S2/issues/55) [#57](https://github.com/antvis/S2/issues/57) [#58](https://github.com/antvis/S2/issues/58) [#59](https://github.com/antvis/S2/issues/59) [#14](https://github.com/antvis/S2/issues/14) [#30](https://github.com/antvis/S2/issues/30) [#60](https://github.com/antvis/S2/issues/60) [#61](https://github.com/antvis/S2/issues/61) [#64](https://github.com/antvis/S2/issues/64) [#65](https://github.com/antvis/S2/issues/65) [#69](https://github.com/antvis/S2/issues/69) [#70](https://github.com/antvis/S2/issues/70) [#71](https://github.com/antvis/S2/issues/71) [#70](https://github.com/antvis/S2/issues/70) [#70](https://github.com/antvis/S2/issues/70) [#72](https://github.com/antvis/S2/issues/72) [#73](https://github.com/antvis/S2/issues/73) [#74](https://github.com/antvis/S2/issues/74) [#75](https://github.com/antvis/S2/issues/75) [#76](https://github.com/antvis/S2/issues/76) [#82](https://github.com/antvis/S2/issues/82) [#85](https://github.com/antvis/S2/issues/85) [#91](https://github.com/antvis/S2/issues/91) [#81](https://github.com/antvis/S2/issues/81) [#94](https://github.com/antvis/S2/issues/94) [#95](https://github.com/antvis/S2/issues/95) [#100](https://github.com/antvis/S2/issues/100) [#99](https://github.com/antvis/S2/issues/99) [#101](https://github.com/antvis/S2/issues/101) [#107](https://github.com/antvis/S2/issues/107) [#108](https://github.com/antvis/S2/issues/108) [#109](https://github.com/antvis/S2/issues/109) [#112](https://github.com/antvis/S2/issues/112) [#114](https://github.com/antvis/S2/issues/114) [#115](https://github.com/antvis/S2/issues/115) [#116](https://github.com/antvis/S2/issues/116) [#117](https://github.com/antvis/S2/issues/117) [#119](https://github.com/antvis/S2/issues/119) [#121](https://github.com/antvis/S2/issues/121) [#122](https://github.com/antvis/S2/issues/122) [#124](https://github.com/antvis/S2/issues/124) [#125](https://github.com/antvis/S2/issues/125) [#123](https://github.com/antvis/S2/issues/123) [#120](https://github.com/antvis/S2/issues/120) [#126](https://github.com/antvis/S2/issues/126) [#128](https://github.com/antvis/S2/issues/128) [#130](https://github.com/antvis/S2/issues/130) [#129](https://github.com/antvis/S2/issues/129) [#113](https://github.com/antvis/S2/issues/113) [#132](https://github.com/antvis/S2/issues/132) [#135](https://github.com/antvis/S2/issues/135) [#138](https://github.com/antvis/S2/issues/138) [#118](https://github.com/antvis/S2/issues/118) [#139](https://github.com/antvis/S2/issues/139) [#118](https://github.com/antvis/S2/issues/118) [#142](https://github.com/antvis/S2/issues/142) [#143](https://github.com/antvis/S2/issues/143) [#137](https://github.com/antvis/S2/issues/137) [#136](https://github.com/antvis/S2/issues/136) [#148](https://github.com/antvis/S2/issues/148) [#146](https://github.com/antvis/S2/issues/146) [#149](https://github.com/antvis/S2/issues/149) [#152](https://github.com/antvis/S2/issues/152) [#153](https://github.com/antvis/S2/issues/153) [#155](https://github.com/antvis/S2/issues/155) [#156](https://github.com/antvis/S2/issues/156) [#151](https://github.com/antvis/S2/issues/151) [#157](https://github.com/antvis/S2/issues/157) [#154](https://github.com/antvis/S2/issues/154) [#160](https://github.com/antvis/S2/issues/160) [#162](https://github.com/antvis/S2/issues/162) [#164](https://github.com/antvis/S2/issues/164) [#158](https://github.com/antvis/S2/issues/158) [#167](https://github.com/antvis/S2/issues/167) [#170](https://github.com/antvis/S2/issues/170) [#165](https://github.com/antvis/S2/issues/165) [#171](https://github.com/antvis/S2/issues/171) [#163](https://github.com/antvis/S2/issues/163) [#174](https://github.com/antvis/S2/issues/174) [#172](https://github.com/antvis/S2/issues/172) [#175](https://github.com/antvis/S2/issues/175) [#173](https://github.com/antvis/S2/issues/173) [#179](https://github.com/antvis/S2/issues/179) [#183](https://github.com/antvis/S2/issues/183) [#182](https://github.com/antvis/S2/issues/182) [#180](https://github.com/antvis/S2/issues/180) [#184](https://github.com/antvis/S2/issues/184) [#185](https://github.com/antvis/S2/issues/185) [#181](https://github.com/antvis/S2/issues/181) [#178](https://github.com/antvis/S2/issues/178) [#192](https://github.com/antvis/S2/issues/192) [#189](https://github.com/antvis/S2/issues/189) [#190](https://github.com/antvis/S2/issues/190) [#194](https://github.com/antvis/S2/issues/194) [#197](https://github.com/antvis/S2/issues/197) [#196](https://github.com/antvis/S2/issues/196) [#203](https://github.com/antvis/S2/issues/203) [#207](https://github.com/antvis/S2/issues/207) [#204](https://github.com/antvis/S2/issues/204) [#206](https://github.com/antvis/S2/issues/206) [#208](https://github.com/antvis/S2/issues/208) [#202](https://github.com/antvis/S2/issues/202) [#201](https://github.com/antvis/S2/issues/201) [#209](https://github.com/antvis/S2/issues/209) [#200](https://github.com/antvis/S2/issues/200) [#210](https://github.com/antvis/S2/issues/210) [#211](https://github.com/antvis/S2/issues/211) [#214](https://github.com/antvis/S2/issues/214) [#213](https://github.com/antvis/S2/issues/213) [#212](https://github.com/antvis/S2/issues/212) [#216](https://github.com/antvis/S2/issues/216) [#217](https://github.com/antvis/S2/issues/217) [#218](https://github.com/antvis/S2/issues/218) [#219](https://github.com/antvis/S2/issues/219) [#221](https://github.com/antvis/S2/issues/221) [#222](https://github.com/antvis/S2/issues/222) [#240](https://github.com/antvis/S2/issues/240) [#241](https://github.com/antvis/S2/issues/241) [#242](https://github.com/antvis/S2/issues/242) [#248](https://github.com/antvis/S2/issues/248) [#245](https://github.com/antvis/S2/issues/245) [#252](https://github.com/antvis/S2/issues/252) [#249](https://github.com/antvis/S2/issues/249)
* add advanced sort component ([#428](https://github.com/antvis/S2/issues/428)) ([c3a3fb5](https://github.com/antvis/S2/commit/c3a3fb5ba16dc4ef65f301b054a78095c36f5524))
* add confirm and cancel button for switcher ([#495](https://github.com/antvis/S2/issues/495)) ([d31ce63](https://github.com/antvis/S2/commit/d31ce63a87d87878f033f51ac2a0e7f4d90c2b31))
* add doc for table ([#360](https://github.com/antvis/S2/issues/360)) ([a7ee65e](https://github.com/antvis/S2/commit/a7ee65e4f46a0e8253a756d6c2619166e36a8c8e))
* add group sort in col's values and refactor tooltip's style ([#284](https://github.com/antvis/S2/issues/284)) ([ad02d9d](https://github.com/antvis/S2/commit/ad02d9db301f6be34112ac99e6db2de48af4c2dc)), closes [#269](https://github.com/antvis/S2/issues/269) [#270](https://github.com/antvis/S2/issues/270) [#268](https://github.com/antvis/S2/issues/268) [#267](https://github.com/antvis/S2/issues/267) [#271](https://github.com/antvis/S2/issues/271) [#272](https://github.com/antvis/S2/issues/272) [#265](https://github.com/antvis/S2/issues/265) [#274](https://github.com/antvis/S2/issues/274) [#276](https://github.com/antvis/S2/issues/276) [#277](https://github.com/antvis/S2/issues/277) [#283](https://github.com/antvis/S2/issues/283)
* add resize area highlight for whole rows and columns ([#645](https://github.com/antvis/S2/issues/645)) ([ec224d9](https://github.com/antvis/S2/commit/ec224d9a2028ced85024d2a05f80e19d8af12e5e))
* add shadow for table mode ([#610](https://github.com/antvis/S2/issues/610)) ([07039a9](https://github.com/antvis/S2/commit/07039a95e7cedfdc3e6b84107ba36b64ddb87a74))
* add tooltip col and row config handle ([#440](https://github.com/antvis/S2/issues/440)) ([b457d27](https://github.com/antvis/S2/commit/b457d27ce1ba6de368e39632675c295ff3af8174))
* add total measure formatter for values in rows ([#462](https://github.com/antvis/S2/issues/462)) ([615be65](https://github.com/antvis/S2/commit/615be65b2f1afe9815c7889a34b6aa17a303dc66))
* copy with row and col ([#387](https://github.com/antvis/S2/issues/387)) ([7602ef8](https://github.com/antvis/S2/commit/7602ef87d5821b7a897c779f90d37bfc1e52d25f))
* **custom-tree:** fix custom-tree mode & custom-tree test ([#666](https://github.com/antvis/S2/issues/666)) ([f849a2f](https://github.com/antvis/S2/commit/f849a2f873e9bbed543e9bb3c8c57f2d1bd68506)), closes [#605](https://github.com/antvis/S2/issues/605)
* dimensions switcher ([#298](https://github.com/antvis/S2/issues/298)) ([f223319](https://github.com/antvis/S2/commit/f2233194850604f5245e7eb19ea61f3993a592fe)), closes [#269](https://github.com/antvis/S2/issues/269) [#270](https://github.com/antvis/S2/issues/270) [#268](https://github.com/antvis/S2/issues/268) [#267](https://github.com/antvis/S2/issues/267) [#271](https://github.com/antvis/S2/issues/271)
* **facet:** add scroll speed ratio ([#438](https://github.com/antvis/S2/issues/438)) ([9ba97fb](https://github.com/antvis/S2/commit/9ba97fb716132b5c5bd49f03e16a6cb5d0ae51e4))
* fix table col issue ([#589](https://github.com/antvis/S2/issues/589)) ([329b9a5](https://github.com/antvis/S2/commit/329b9a51829fafa5314cb2f8506d161ea0697ad3))
* **interaction:** add autoResetSheetStyle options ([#465](https://github.com/antvis/S2/issues/465)) ([00f316d](https://github.com/antvis/S2/commit/00f316d99566478c96660ff72d2f0541af572c74))
* **interaction:** hidden columns ([#296](https://github.com/antvis/S2/issues/296)) ([f5f4a69](https://github.com/antvis/S2/commit/f5f4a69dbd2b436f36e874323115d54af9f0aa16))
* **interaction:** select interaction imporement ([#324](https://github.com/antvis/S2/issues/324)) ([6b5479d](https://github.com/antvis/S2/commit/6b5479d9cb9718ce0c657277ef2ad30c56b8ded7))
* **interaction:** shift interval select ([#732](https://github.com/antvis/S2/issues/732)) ([d21d410](https://github.com/antvis/S2/commit/d21d41028f505d8ad9d5cb0e5bec192a3c3a34b4))
* merged cell related documents, tests and some refactoring ([#702](https://github.com/antvis/S2/issues/702)) ([74dc450](https://github.com/antvis/S2/commit/74dc450aed3e9057cf2b689f7c964dd40657a350))
* **options:** add empty cell placeholder options ([#658](https://github.com/antvis/S2/issues/658)) ([b4b7fdd](https://github.com/antvis/S2/commit/b4b7fdd94aba0f9312754435569d906b5d371ffb))
* perfect and repair merged cells ([#608](https://github.com/antvis/S2/issues/608)) ([edd3ae3](https://github.com/antvis/S2/commit/edd3ae36585607320646b4f3740b84237416bea7))
* refactor switcher component ([#380](https://github.com/antvis/S2/issues/380)) ([f5c2993](https://github.com/antvis/S2/commit/f5c2993801d4f2b0d09ecaf4b8f751deefbac0d0))
* select all ([#348](https://github.com/antvis/S2/issues/348)) ([334aac4](https://github.com/antvis/S2/commit/334aac41ac9511c3b417a7006591fdbf138ab618)), closes [#342](https://github.com/antvis/S2/issues/342) [#339](https://github.com/antvis/S2/issues/339)
* tooltip support config auto adjust boundary ([#538](https://github.com/antvis/S2/issues/538)) ([2a14873](https://github.com/antvis/S2/commit/2a14873507c1480b3b209ffd5cb46421aca4096e))
* **util:** add generateId export function ([#488](https://github.com/antvis/S2/issues/488)) ([0e6025e](https://github.com/antvis/S2/commit/0e6025e20e5b2eeca0692dbb90fabcaffd66d3c1))

### Performance Improvements

* **sa:** fix console.time & sa performance ([#672](https://github.com/antvis/S2/issues/672)) ([cb5990f](https://github.com/antvis/S2/commit/cb5990f81f8c9b4da674eebdb0c49bb8eaa4f19d))
