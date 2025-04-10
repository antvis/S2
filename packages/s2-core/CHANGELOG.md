# [@antv/s2-v2.3.1](https://github.com/antvis/S2/compare/@antv/s2-v2.3.0...@antv/s2-v2.3.1) (2025-04-10)


### Bug Fixes

* 明细表自定义列头prefix重复展示异常 ([#3142](https://github.com/antvis/S2/issues/3142)) ([986bdc2](https://github.com/antvis/S2/commit/986bdc254902162ec27803375377e585bbbd9dfd))

# [@antv/s2-v2.3.0](https://github.com/antvis/S2/compare/@antv/s2-v2.2.4...@antv/s2-v2.3.0) (2025-03-17)


### Bug Fixes

* 滚动动画，冻结行列滚动位置 ([#3121](https://github.com/antvis/S2/issues/3121)) ([60e8431](https://github.com/antvis/S2/commit/60e843168d30e4ddc6e61c014f56744534b29051))


### Features

* 单元格渲染支持图片、视频 ([#3101](https://github.com/antvis/S2/issues/3101)) ([b514b5e](https://github.com/antvis/S2/commit/b514b5e1bb47fd4b3b533e5409a888743bd389d7))

# [@antv/s2-v2.2.4](https://github.com/antvis/S2/compare/@antv/s2-v2.2.3...@antv/s2-v2.2.4) (2025-03-05)


### Bug Fixes

* 修复单层列头下，隐藏完所有非总计列头后，总计列头高度异常 ([#3119](https://github.com/antvis/S2/issues/3119)) ([6ece5d8](https://github.com/antvis/S2/commit/6ece5d8074a774570896b2954f1f9862bf8d2c7d))
* 避免getIntervalScale除0异常 ([#3115](https://github.com/antvis/S2/issues/3115)) ([cdecc07](https://github.com/antvis/S2/commit/cdecc07bec9a7640575f43e4786642bda0c35ceb))

# [@antv/s2-v2.2.3](https://github.com/antvis/S2/compare/@antv/s2-v2.2.2...@antv/s2-v2.2.3) (2025-02-28)


### Bug Fixes

* 修复隐藏列后变更列顺序，隐藏列展开异常 ([#3112](https://github.com/antvis/S2/issues/3112)) ([eb06cf7](https://github.com/antvis/S2/commit/eb06cf7e40469440209ab3e9a8aaf74b26186fc8))
* 列头换行，隐藏采样节点后，列头高度异常 ([#3114](https://github.com/antvis/S2/issues/3114)) ([0c5d5b8](https://github.com/antvis/S2/commit/0c5d5b8cb0bbb887413a3d52b97c670889b79f40))

# [@antv/s2-v2.2.2](https://github.com/antvis/S2/compare/@antv/s2-v2.2.1...@antv/s2-v2.2.2) (2025-02-26)


### Bug Fixes

* 在ios 14.8.1中正则前瞻和后顾存在兼容问题 ([#3109](https://github.com/antvis/S2/issues/3109)) ([32e56ea](https://github.com/antvis/S2/commit/32e56ea682e11874aa4ff01d4061bc270e3f012f))

# [@antv/s2-v2.2.1](https://github.com/antvis/S2/compare/@antv/s2-v2.2.0...@antv/s2-v2.2.1) (2025-02-25)


### Bug Fixes

* 修复调用hideColumns方法时，展开icon未透出 ([#3107](https://github.com/antvis/S2/issues/3107)) ([26fa6fb](https://github.com/antvis/S2/commit/26fa6fbf92edd892e575dd40c58478a56460c0cb))

# [@antv/s2-v2.2.0](https://github.com/antvis/S2/compare/@antv/s2-v2.1.12...@antv/s2-v2.2.0) (2025-02-25)


### Bug Fixes

* 修复前后节点都被隐藏的尾列展开icon位置异常和展开节点异常 ([#3103](https://github.com/antvis/S2/issues/3103)) ([556a66c](https://github.com/antvis/S2/commit/556a66ce856510ec026594f241d8d0bd560724c8))
* 修复透视表尾列隐藏后的展开icon位置异常 ([#3102](https://github.com/antvis/S2/issues/3102)) ([af6a95d](https://github.com/antvis/S2/commit/af6a95d41c929f7826911c76b8bbad27f08ceb17))


### Features

* 新增隐藏列展开按钮hover事件 ([#3105](https://github.com/antvis/S2/issues/3105)) ([89d4b85](https://github.com/antvis/S2/commit/89d4b851009b5c54dee5ced61c6130e871b4c8c6))

# [@antv/s2-v2.1.12](https://github.com/antvis/S2/compare/@antv/s2-v2.1.11...@antv/s2-v2.1.12) (2025-02-12)


### Bug Fixes

* 修复移动端禁用外部容器滚动不生效 ([#3097](https://github.com/antvis/S2/issues/3097)) ([ba93684](https://github.com/antvis/S2/commit/ba93684ad1c3ad7b10ac95194b36e3ebaac66808))

# [@antv/s2-v2.1.11](https://github.com/antvis/S2/compare/@antv/s2-v2.1.10...@antv/s2-v2.1.11) (2025-02-08)


### Bug Fixes

* 多行文本二次渲染后少一行 ([#3089](https://github.com/antvis/S2/issues/3089)) ([f31e616](https://github.com/antvis/S2/commit/f31e6162e752e583ba4785d0682e6efa27a3558e))
* 导出复制时处理特殊字符 ([#3093](https://github.com/antvis/S2/issues/3093)) ([dd368ab](https://github.com/antvis/S2/commit/dd368aba72a5107ff9f3db842531a83c81e96cba))

# [@antv/s2-v2.1.10](https://github.com/antvis/S2/compare/@antv/s2-v2.1.9...@antv/s2-v2.1.10) (2025-01-24)


### Bug Fixes

* 修复维值包含 '\t' 制表符时导致复制到 Excel 中数据错列的问题 ([#3085](https://github.com/antvis/S2/issues/3085)) ([339e532](https://github.com/antvis/S2/commit/339e532572654d2dffe6b4893575c41999b86f20))
* 升级 G 版本, 修复超长文本中含有单词时换行异常 ([#3086](https://github.com/antvis/S2/issues/3086)) ([a815f1a](https://github.com/antvis/S2/commit/a815f1a12583908dbb7b1e3db2d0076a7843ae28))

# [@antv/s2-v2.1.9](https://github.com/antvis/S2/compare/@antv/s2-v2.1.8...@antv/s2-v2.1.9) (2025-01-17)


### Bug Fixes

* 修复明细表空数据占位符背景穿透的问题 close [#3077](https://github.com/antvis/S2/issues/3077) ([#3079](https://github.com/antvis/S2/issues/3079)) ([4d2f941](https://github.com/antvis/S2/commit/4d2f941814155fd68bf44a6778ac65730ff884e1))
* 修复组件层更新后 G 的 Group 图层累加的问题 ([#3081](https://github.com/antvis/S2/issues/3081)) ([c290b08](https://github.com/antvis/S2/commit/c290b081f1df99a79608d4533ad95eb326eaa0be))

# [@antv/s2-v2.1.8](https://github.com/antvis/S2/compare/@antv/s2-v2.1.7...@antv/s2-v2.1.8) (2025-01-03)


### Bug Fixes

* 修复单元格宽度为浮点数时单元格之间有几率出现多余空隙的问题 close [#3014](https://github.com/antvis/S2/issues/3014) ([#3066](https://github.com/antvis/S2/issues/3066)) ([6c1f74a](https://github.com/antvis/S2/commit/6c1f74a7c34cacd8b208cee1d8240f83a3be969d))
* 修复自定义选中交互主题对行列叶子节点不生效 ([#3064](https://github.com/antvis/S2/issues/3064)) ([0c6c383](https://github.com/antvis/S2/commit/0c6c3832a2db87b9a353cb62f5a4698fcfa8532b))
* 修复表头存在自定义 icon 时, 文本换行高度自适应不准确 ([#3065](https://github.com/antvis/S2/issues/3065)) ([e2ab646](https://github.com/antvis/S2/commit/e2ab6461b98cc3f9308edb20d960846e49f10a13))

# [@antv/s2-v2.1.7](https://github.com/antvis/S2/compare/@antv/s2-v2.1.6...@antv/s2-v2.1.7) (2025-01-02)


### Bug Fixes

* **g:** 修复列宽很小时多行文本渲染错误 ([#3060](https://github.com/antvis/S2/issues/3060)) ([aca03ac](https://github.com/antvis/S2/commit/aca03ac87d3c08183d220dd82a219fa2e4491367))
* 修复存在字段标记时, 紧凑模式下有几率显示省略号的问题 ([#3061](https://github.com/antvis/S2/issues/3061)) ([d200b13](https://github.com/antvis/S2/commit/d200b13ffaced2af37e69739077b4734a516dd95))

# [@antv/s2-v2.1.6](https://github.com/antvis/S2/compare/@antv/s2-v2.1.5...@antv/s2-v2.1.6) (2024-12-30)


### Bug Fixes

* 使用离屏 Canvas 测量文本, 提高宽度计算的准确性 close [#3018](https://github.com/antvis/S2/issues/3018) ([#3053](https://github.com/antvis/S2/issues/3053)) ([d834e60](https://github.com/antvis/S2/commit/d834e607e317b9425da04e0026b324bfc2099e4a))
* 修复 Safari 浏览器复制/导出报错 ([#3050](https://github.com/antvis/S2/issues/3050)) ([da7d9e5](https://github.com/antvis/S2/commit/da7d9e5bcb4a125de5cea934f91e6661d9200528))
* 修复切换到 4k 显示器时渲染模糊的问题 ([#3051](https://github.com/antvis/S2/issues/3051)) ([41a2ad0](https://github.com/antvis/S2/commit/41a2ad0a93443f61f28ec1ed178cc437b12a0dc6))

# [@antv/s2-v2.1.5](https://github.com/antvis/S2/compare/@antv/s2-v2.1.4...@antv/s2-v2.1.5) (2024-12-20)


### Bug Fixes

* 修复合并单元格滚动出可视范围后边框绘制错误 close [#3048](https://github.com/antvis/S2/issues/3048) ([#3049](https://github.com/antvis/S2/issues/3049)) ([572ed93](https://github.com/antvis/S2/commit/572ed93cd00f24b050c8714182eae8d142399931))
* 修复明细表在 dataCfg 为空, 同时开启序号列时, 错误的渲染了占位符的问题 ([#3042](https://github.com/antvis/S2/issues/3042)) ([feab43f](https://github.com/antvis/S2/commit/feab43f9aa8afe7035c46f39ddccb2c31e22b787))
* 修复明细表自定义列头时, 隐藏列头后出现空白区域 close [#3044](https://github.com/antvis/S2/issues/3044) ([#3046](https://github.com/antvis/S2/issues/3046)) ([7e30008](https://github.com/antvis/S2/commit/7e30008ca4d784c740dccd26a6fa891579d1cb99))
* 更新 G 到最新版, 修复换行符报错的问题 close [#3040](https://github.com/antvis/S2/issues/3040) ([b86dddf](https://github.com/antvis/S2/commit/b86dddff2bf6941a00e286ed684790af52832f54))

# [@antv/s2-v2.1.4](https://github.com/antvis/S2/compare/@antv/s2-v2.1.3...@antv/s2-v2.1.4) (2024-12-13)


### Bug Fixes

* 修复在维值缺失场景下导出数据占位符未解析的问题 ([#3027](https://github.com/antvis/S2/issues/3027)) ([6e63b97](https://github.com/antvis/S2/commit/6e63b970da353a7ccc231e3cbf716a008e191f4f))
* 修复行头圈选复制时部分场景下数据重复 close [#2975](https://github.com/antvis/S2/issues/2975) ([#3029](https://github.com/antvis/S2/issues/3029)) ([001573f](https://github.com/antvis/S2/commit/001573f2dedbf069c996deb1579bcc9525f5efa8))
* 构建产物编译到 es2015 close [#3025](https://github.com/antvis/S2/issues/3025) ([#3026](https://github.com/antvis/S2/issues/3026)) ([0a7977c](https://github.com/antvis/S2/commit/0a7977c1793a8171b14b07a22847b4dd9ed85d5f))
* 解决移动端下，树形结构展开、收起交互失效的问题 ([#3039](https://github.com/antvis/S2/issues/3039)) ([a97625c](https://github.com/antvis/S2/commit/a97625c8524c660956fbb815ba943210d6f3fc76))

# [@antv/s2-v2.1.3](https://github.com/antvis/S2/compare/@antv/s2-v2.1.2...@antv/s2-v2.1.3) (2024-12-09)


### Bug Fixes

* 修复手动排序在单行头且维值相似的场景不生效 ([#3019](https://github.com/antvis/S2/issues/3019)) ([6221958](https://github.com/antvis/S2/commit/6221958ddc4113384260f82fd54f768077168287))
* 选中事件增加 event 信息 ([#3021](https://github.com/antvis/S2/issues/3021)) ([291c727](https://github.com/antvis/S2/commit/291c727959d496f5210a2bc47bcdb0919080defa))

# [@antv/s2-v2.1.2](https://github.com/antvis/S2/compare/@antv/s2-v2.1.1...@antv/s2-v2.1.2) (2024-12-06)


### Bug Fixes

* 修复明细表自定义行高时多行文本未自适应调整 ([#3017](https://github.com/antvis/S2/issues/3017)) ([8a55fa6](https://github.com/antvis/S2/commit/8a55fa6be4d3030845b54f5f11e752e31d9919e1))

# [@antv/s2-v2.1.1](https://github.com/antvis/S2/compare/@antv/s2-v2.1.0...@antv/s2-v2.1.1) (2024-12-04)


### Bug Fixes

* 修复下钻组件展示错误操作 icon & 兼容低版本 menu 写法 ([#3011](https://github.com/antvis/S2/issues/3011)) ([7d171f0](https://github.com/antvis/S2/commit/7d171f037e7f52cc49ad02ddf56598aa477bf043))
* 修复点击单元格中的 icon 时无法获取到单元格 meta 信息的问题 close [#2985](https://github.com/antvis/S2/issues/2985) ([#3013](https://github.com/antvis/S2/issues/3013)) ([67853a2](https://github.com/antvis/S2/commit/67853a2c08456ff166e948c9be30eb817e220079))
* 修复角头存在多行文本时未自动撑开列头高度的问题 ([#3010](https://github.com/antvis/S2/issues/3010)) ([0b79f27](https://github.com/antvis/S2/commit/0b79f27870b7183cdb1632f713823059f7449444))

# [@antv/s2-v2.1.0](https://github.com/antvis/S2/compare/@antv/s2-v2.0.1...@antv/s2-v2.1.0) (2024-11-29)


### Bug Fixes

* **tooltip:** 修复操作按钮的 visible 对角头和文本溢出场景不生效 ([#3001](https://github.com/antvis/S2/issues/3001)) ([8f56023](https://github.com/antvis/S2/commit/8f56023b4f29584bc619b00bc5a03a0c3bf30494))
* 修复行头底部存在多行文本, 初始化和滚动时文本展示溢出的问题 ([#3000](https://github.com/antvis/S2/issues/3000)) ([6204839](https://github.com/antvis/S2/commit/620483901c40d64e2e1e6be6753a08ee26f35677))
* 明细表未指定 dataCfg.fields 配置时不应该渲染空数据占位 ([#3003](https://github.com/antvis/S2/issues/3003)) ([60d6497](https://github.com/antvis/S2/commit/60d649705365bca0bde3acc836bd8eeb13e47c3c))


### Features

* 增加树状模式下行头宽度配置 rowCell.treeWidth ([#2998](https://github.com/antvis/S2/issues/2998)) ([b8fdd2a](https://github.com/antvis/S2/commit/b8fdd2a700a9a3bdc5d565c2bf89a85427c66a88))

# [@antv/s2-v2.0.1](https://github.com/antvis/S2/compare/@antv/s2-v2.0.0...@antv/s2-v2.0.1) (2024-11-26)

# [@antv/s2-v2.0.0](https://github.com/antvis/S2/compare/@antv/s2-v1.45.1...@antv/s2-v2.0.0) (2024-11-21)


### Bug Fixes

* canvas mouseout 判断错误 ([#2181](https://github.com/antvis/S2/issues/2181)) ([16c0b82](https://github.com/antvis/S2/commit/16c0b824aef16d109e8db8d2fe6b3a25a413dcfa))
* cornerheader无列头时不渲染序号列 ([abf5e68](https://github.com/antvis/S2/commit/abf5e6821209665a6c9aea9050e069eaa4fe8b46))
* **g:** 修复表格初次渲染时部分 icon 不展示 close [#2014](https://github.com/antvis/S2/issues/2014) ([#2606](https://github.com/antvis/S2/issues/2606)) ([3f9a176](https://github.com/antvis/S2/commit/3f9a176f75c46fa58e50d0fd70a652242f7b6df3))
* **interaction:** 修复在未选中状态下调整宽高, 错误的修改了相邻单元格的样式 ([#2605](https://github.com/antvis/S2/issues/2605)) ([8019788](https://github.com/antvis/S2/commit/8019788bf5b44414a2006f34c89f68fcb37207f0))
* **interaction:** 修复自定义列头时无法调整第一列的叶子节点高度 close [#1979](https://github.com/antvis/S2/issues/1979) ([#2038](https://github.com/antvis/S2/issues/2038)) ([a632ab1](https://github.com/antvis/S2/commit/a632ab19193b19ab80f456ab3ce19740dce0e52b))
* **interaction:** 修复表格滚动后, 行列头部分单元格选中高亮效果丢失 close [#2503](https://github.com/antvis/S2/issues/2503) ([#2545](https://github.com/antvis/S2/issues/2545)) ([3a7803b](https://github.com/antvis/S2/commit/3a7803bd460fa332ff4d1a5b37f3192bf58bf866))
* **interaction:** 修复隐藏列头配置更新时未覆盖上一次的配置 close [#2495](https://github.com/antvis/S2/issues/2495) ([#2527](https://github.com/antvis/S2/issues/2527)) ([ddc1283](https://github.com/antvis/S2/commit/ddc12830fa32f001ff7009a2bee8ce8624a1a187))
* **layout:** 修复空数据的情况开启汇总分组渲染报错 close [#2661](https://github.com/antvis/S2/issues/2661) ([#2662](https://github.com/antvis/S2/issues/2662)) ([8158660](https://github.com/antvis/S2/commit/81586601ea7451f6ca56932bd4bf4ef7738dbd7d))
* **layout:** 修复自定义列头采样错误导致行角头不显示 close [#2117](https://github.com/antvis/S2/issues/2117) ([#2175](https://github.com/antvis/S2/issues/2175)) ([2266272](https://github.com/antvis/S2/commit/22662721739b45fbe5c00c1157ad00071d8f5f0d))
* **layout:** 修复行头收起全部时, 自定义列头被折叠的问题 closes [#2018](https://github.com/antvis/S2/issues/2018) [#2019](https://github.com/antvis/S2/issues/2019) ([#2639](https://github.com/antvis/S2/issues/2639)) ([dfc3225](https://github.com/antvis/S2/commit/dfc3225bbc431e8dcc30d0f42f7fb5389ec53c82))
* **scroll:** 修复移动端滚动至边缘时抖动 ([#2556](https://github.com/antvis/S2/issues/2556)) ([3a2cd7c](https://github.com/antvis/S2/commit/3a2cd7c10bb59cc1eb9e23f366db3e65674eede1))
* **table-sheet:** 修复明细表配置自定义行高后展示异常 close [#2501](https://github.com/antvis/S2/issues/2501) ([#2521](https://github.com/antvis/S2/issues/2521)) ([47fdee3](https://github.com/antvis/S2/commit/47fdee3ebbae900ba815fba8c18e3a0566aa8f8c))
* **type:** 修复 g renderer 的错误类型定义 ([#2939](https://github.com/antvis/S2/issues/2939)) ([523b2cc](https://github.com/antvis/S2/commit/523b2ccb8884933060000854f28d9a6d8b2806f5))
* wheel scroll error! ([#2643](https://github.com/antvis/S2/issues/2643)) ([43cf364](https://github.com/antvis/S2/commit/43cf364cabc22409f405a1e6297d2d7196f8050b))
* 下钻后meta.childField不正确 ([#1788](https://github.com/antvis/S2/issues/1788)) ([1c61dd4](https://github.com/antvis/S2/commit/1c61dd4081c9d3fed6f276b0546865914040b07a))
* 传入g的supportCSSTransform改为supportsCSSTransform ([7531aab](https://github.com/antvis/S2/commit/7531aab7fd12a35533d95267a818dfd3f821ece0))
* 修复 expandDepth 在自定义行头场景下不生效 ([#2895](https://github.com/antvis/S2/issues/2895)) ([d83a816](https://github.com/antvis/S2/commit/d83a81674e587eab129630c0d3bc4f87b6550471))
* 修复 frame 角头部分绘制尺寸问题 ([aa6e48a](https://github.com/antvis/S2/commit/aa6e48acc54b0bb87c81842c7951f5872e446e8f))
* 修复 headerActionIcons 下的 defaultHide 属性不生效 close [#2772](https://github.com/antvis/S2/issues/2772) ([#2774](https://github.com/antvis/S2/issues/2774)) ([d142efa](https://github.com/antvis/S2/commit/d142efacf3b35bbcc5f8ac3dc0a1dbe61eb167bd))
* 修复 meta name 同名时，hoverFocus 出错的问题 ([#2180](https://github.com/antvis/S2/issues/2180)) ([1480528](https://github.com/antvis/S2/commit/1480528c119f33fe40bc08e52e7abf87e9f9a797))
* 修复 React 18 环境下 Tooltip 卸载后无法再次渲染 & 排序菜单选中效果丢失的问题 ([#2698](https://github.com/antvis/S2/issues/2698)) ([0af329d](https://github.com/antvis/S2/commit/0af329da596733eee8013a7a1f04676a720767d3))
* 修复下载数据重复 close [#2718](https://github.com/antvis/S2/issues/2718) ([#2719](https://github.com/antvis/S2/issues/2719)) ([f0d5192](https://github.com/antvis/S2/commit/f0d5192e769a392df84a4e85e245496ac7c0ef31))
* 修复分割线在深色背景下颜色渲染异常 & 内容宽高未包含分割线的问题 ([#2961](https://github.com/antvis/S2/issues/2961)) ([e759891](https://github.com/antvis/S2/commit/e759891865eee0940d0f5c92345d5490e10eb57c))
* 修复列等宽布局模式下角头出现省略号 close [#2726](https://github.com/antvis/S2/issues/2726) ([#2732](https://github.com/antvis/S2/issues/2732)) ([b4e07b9](https://github.com/antvis/S2/commit/b4e07b94a1c77163254ff3acc39baa93b0d151aa))
* 修复只有一行数据时异步导出数据为空 close [#2681](https://github.com/antvis/S2/issues/2681) ([#2682](https://github.com/antvis/S2/issues/2682)) ([fecd455](https://github.com/antvis/S2/commit/fecd455cf3b18a76cbae680ebb27ae7c1dcb66ec))
* 修复合并 master 的 copy 相关单测 ([8587137](https://github.com/antvis/S2/commit/8587137703b89152f67335908e47e04ef6d41997))
* 修复在局部复制和导出场景时, 格式化函数获取不到单元格信息 close [#2866](https://github.com/antvis/S2/issues/2866) ([#2871](https://github.com/antvis/S2/issues/2871)) ([f0db754](https://github.com/antvis/S2/commit/f0db75405561e0c841ae2fe57fb490f08dad7d50))
* 修复在明细表中绘制 G2 图表, 点击单元格报错 close [#2843](https://github.com/antvis/S2/issues/2843) ([#2864](https://github.com/antvis/S2/issues/2864)) ([8684fb2](https://github.com/antvis/S2/commit/8684fb286279c4d1e280e00baf197f154ac3a540))
* 修复字段标记 mapping 函数部分场景缺失第三个参数 & 调整参数类型 ([#2927](https://github.com/antvis/S2/issues/2927)) ([676c1f6](https://github.com/antvis/S2/commit/676c1f68101a9191b48d23ce1ec15f852bcebc5d))
* 修复字段标记背景色透明度优先级低于主题背景色透明度的问题 ([#2744](https://github.com/antvis/S2/issues/2744)) ([6949f60](https://github.com/antvis/S2/commit/6949f6007f1d6c6ced4011803be9c24d326f084b))
* 修复存在字段标记的 icon 时, 紧凑模式列宽计算错误出现省略号的问题 ([#2920](https://github.com/antvis/S2/issues/2920)) ([75acbfe](https://github.com/antvis/S2/commit/75acbfe4540bf8dc702a3a068c214c9217239261))
* 修复导出 CSV 时分隔符错误导致的展示格式错误 close [#2701](https://github.com/antvis/S2/issues/2701) ([#2703](https://github.com/antvis/S2/issues/2703)) ([98c051a](https://github.com/antvis/S2/commit/98c051a58c1d8b7c7831343ba909238e514615ae))
* 修复导出数据分隔符有误的问题 ([#2241](https://github.com/antvis/S2/issues/2241)) ([ec0a31c](https://github.com/antvis/S2/commit/ec0a31c4fc660b44176b074d4cc8c098dbe95eb4))
* 修复开启 supportsCSSTransform 后 hover 在表格上时报错 ([#2947](https://github.com/antvis/S2/issues/2947)) ([d328598](https://github.com/antvis/S2/commit/d328598f080ff5ce8336f8cd98c200a5052d348c))
* 修复开启自定义指标层级后, 角头数值文本未对齐 close [#2957](https://github.com/antvis/S2/issues/2957) ([#2966](https://github.com/antvis/S2/issues/2966)) ([6558a0d](https://github.com/antvis/S2/commit/6558a0df55dc324e1810e2f2a5d314de7389e2b1))
* 修复所有lint错误 ([9b62503](https://github.com/antvis/S2/commit/9b62503ebdf1ef9aa94470c8d18be99122d0c2dc))
* 修复拖拽列宽后, 默认的自定义列宽失效 close [#2910](https://github.com/antvis/S2/issues/2910) ([#2915](https://github.com/antvis/S2/issues/2915)) ([8302fe4](https://github.com/antvis/S2/commit/8302fe40bc475baecf72ba463ac948d33a391a3f))
* 修复数值单元格 tooltip 内的指标名展示错误 ([#2941](https://github.com/antvis/S2/issues/2941)) ([a426a46](https://github.com/antvis/S2/commit/a426a468d8cc1fe7ec0fd1db0e04938884ec0f46))
* 修复数值单元格内的自定义 icon 点击时会选中单元格的问题 close [#2333](https://github.com/antvis/S2/issues/2333) ([#2567](https://github.com/antvis/S2/issues/2567)) ([3d9f9aa](https://github.com/antvis/S2/commit/3d9f9aaba931b54226e4fd9e6004fc1bd9688791))
* 修复数据导出时列头被格式化 close [#2688](https://github.com/antvis/S2/issues/2688) ([#2694](https://github.com/antvis/S2/issues/2694)) ([19d8e60](https://github.com/antvis/S2/commit/19d8e608c27da89771cef7439402585af00750b9))
* 修复文本存在换行符时, 未显示省略号的问题 ([#2978](https://github.com/antvis/S2/issues/2978)) ([08dbf0d](https://github.com/antvis/S2/commit/08dbf0d9c63f1c64989fe242c9645df06e6b04e5))
* 修复文本行数不一致时自动换行高度自适应失效 close [#2594](https://github.com/antvis/S2/issues/2594) ([#2598](https://github.com/antvis/S2/issues/2598)) ([fae5496](https://github.com/antvis/S2/commit/fae5496e503205f319e7bdc79240d31dacd4e850))
* 修复文本设为左对齐时, 角头文本没有垂直对齐的问题 ([#2960](https://github.com/antvis/S2/issues/2960)) ([af8c968](https://github.com/antvis/S2/commit/af8c96809fd0e52f1da81e2a1c082a5f5b0b122a))
* 修复无汇总数据时前端计算汇总值缺少聚合方式导致排序失效的问题 ([#2711](https://github.com/antvis/S2/issues/2711)) ([97b0aeb](https://github.com/antvis/S2/commit/97b0aeb73f0fdeb1416f4d28214f912fa490db02))
* 修复明细表含有空数据占位符时排序错误 close [#2707](https://github.com/antvis/S2/issues/2707) ([#2708](https://github.com/antvis/S2/issues/2708)) ([40792ce](https://github.com/antvis/S2/commit/40792ce994bc2b574a256433263e54af754f7dba))
* 修复明细表导出时自定义序号文本不生效 close [#2755](https://github.com/antvis/S2/issues/2755) ([#2757](https://github.com/antvis/S2/issues/2757)) ([ebe68d8](https://github.com/antvis/S2/commit/ebe68d83986a1e9de87d0154382f3725818d5bfd))
* 修复明细表自定义列头时开启文本换行, 单元格高度错误的问题 close [#2955](https://github.com/antvis/S2/issues/2955) ([#2968](https://github.com/antvis/S2/issues/2968)) ([ca1f7e8](https://github.com/antvis/S2/commit/ca1f7e8a614dc5b36a6bc270df4ea8338e670444))
* 修复明细表自定义多级列头导出格式错误 close [#2664](https://github.com/antvis/S2/issues/2664) ([#2674](https://github.com/antvis/S2/issues/2674)) ([ae9add9](https://github.com/antvis/S2/commit/ae9add9c722877aced481340f798408a09ad98fb))
* 修复树状模式下开启分页, 行头展开收起后表格渲染异常 close [#2582](https://github.com/antvis/S2/issues/2582) ([#2590](https://github.com/antvis/S2/issues/2590)) ([b9e48a0](https://github.com/antvis/S2/commit/b9e48a0202d4105b75b0961096f106ca6039c553))
* 修复树状模式下开启分页, 行头展开收起后表格渲染异常 close [#2582](https://github.com/antvis/S2/issues/2582) ([#2590](https://github.com/antvis/S2/issues/2590)) ([6bab9f6](https://github.com/antvis/S2/commit/6bab9f630e26bdfb9513bb0d5fe0b4c0903f885b))
* 修复树状模式当一组数据只有一条数据时, 叶子节点判断错误, 也渲染了展开/收起图标 close [#2804](https://github.com/antvis/S2/issues/2804) ([#2806](https://github.com/antvis/S2/issues/2806)) ([76a7a59](https://github.com/antvis/S2/commit/76a7a59cf12c7b3df1ec2b8a43d04479ab25cb73))
* 修复树状模式选中非叶子节点时不展示汇总信息的问题 ([48b7073](https://github.com/antvis/S2/commit/48b70737f32d58d75c356a4d37afeb74a917cf23))
* 修复浏览器窗口多次放大后表格渲染模糊 close [#2884](https://github.com/antvis/S2/issues/2884) ([#2897](https://github.com/antvis/S2/issues/2897)) ([97e2905](https://github.com/antvis/S2/commit/97e2905d6b42a20728950cd51ddabd3bcdd14f1e))
* 修复滚动边界问题 close [#2720](https://github.com/antvis/S2/issues/2720) ([#2721](https://github.com/antvis/S2/issues/2721)) ([24591fb](https://github.com/antvis/S2/commit/24591fbb65d9e760a566223a0a0fde6ce360c189))
* 修复父容器存在 transform 时, 在 canvas 内点击也会重置交互的问题 close [#2879](https://github.com/antvis/S2/issues/2879) ([#2942](https://github.com/antvis/S2/issues/2942)) ([010ed05](https://github.com/antvis/S2/commit/010ed050214568ea1902e4a426d6638afd3ae2f9))
* 修复父容器存在 transform 缩放时单元格刷选偏移 close [#2553](https://github.com/antvis/S2/issues/2553) ([#2565](https://github.com/antvis/S2/issues/2565)) ([715bbf4](https://github.com/antvis/S2/commit/715bbf41541ca6b5bee47c44695345bfaa0605ea))
* 修复紧凑模式下, 文本带有 '\n' 换行符时 maxLines 配置未生效和文本溢出的问题 closes [#2963](https://github.com/antvis/S2/issues/2963) [#2900](https://github.com/antvis/S2/issues/2900) ([#2972](https://github.com/antvis/S2/issues/2972)) ([8d45f07](https://github.com/antvis/S2/commit/8d45f07ae86b24d088b609401817d535be2b43bc))
* 修复紧凑模式下单元格宽度计算忽略了icon宽度的问题 ([#2673](https://github.com/antvis/S2/issues/2673)) ([23ee734](https://github.com/antvis/S2/commit/23ee734ee09106f05b4278b8ab02202a78949a1d))
* 修复紧凑模式下数值单元格错误的展示了省略号 ([#2632](https://github.com/antvis/S2/issues/2632)) ([2822471](https://github.com/antvis/S2/commit/2822471e9f73ba7b19292dc88a93b96d38afa471))
* 修复组件层事件回调无法获取单元格信息 closes [#2615](https://github.com/antvis/S2/issues/2615) [#2610](https://github.com/antvis/S2/issues/2610) ([#2616](https://github.com/antvis/S2/issues/2616)) ([3682d50](https://github.com/antvis/S2/commit/3682d501a71dbff3c91d7be86c852546f3e8f271))
* 修复维值带有 '-' 时刷选复制无法复制表头 close [#2684](https://github.com/antvis/S2/issues/2684) ([#2691](https://github.com/antvis/S2/issues/2691)) ([11c0325](https://github.com/antvis/S2/commit/11c03256cf7bdc369601d9efd8f8e65807ae7b2f))
* 修复编辑表双击失效 ([9edcb74](https://github.com/antvis/S2/commit/9edcb74576c8137481c375258fa9d9e310fafc7c))
* 修复编辑表的输入框未回填格式化后的数据 close [#2528](https://github.com/antvis/S2/issues/2528) ([#2549](https://github.com/antvis/S2/issues/2549)) ([95d67ca](https://github.com/antvis/S2/commit/95d67ca02b774aed426a179a16aa27f0c172356e))
* 修复自定义 dataCell 错误的传参写法 ([#2748](https://github.com/antvis/S2/issues/2748)) ([c54ca82](https://github.com/antvis/S2/commit/c54ca826ab3fd8aa1e760f522abbc0190c724060))
* 修复自定义 tooltip 时, 刷选时无法获取到单元格信息 ([#2738](https://github.com/antvis/S2/issues/2738)) ([782a2fc](https://github.com/antvis/S2/commit/782a2fcd78fa6009c1335fbdfe0392dd894c94ad))
* 修复自定义列头导出数据时, 角头文本展示错误 close [#2844](https://github.com/antvis/S2/issues/2844) ([#2869](https://github.com/antvis/S2/issues/2869)) ([63dba54](https://github.com/antvis/S2/commit/63dba54b947b1c36a996004823841c98284c232a))
* 修复自定义列宽对虚拟数值列不生效 ([#2921](https://github.com/antvis/S2/issues/2921)) ([c53cea4](https://github.com/antvis/S2/commit/c53cea4a2fa2d7b18939abfb984629a94eab936d))
* 修复自定义目录树同名节点展示异常 & 导出缺失角头 close [#2455](https://github.com/antvis/S2/issues/2455) ([#2551](https://github.com/antvis/S2/issues/2551)) ([6d315bf](https://github.com/antvis/S2/commit/6d315bff20e74f0ce5f1d286105eeba749ebabaf))
* 修复自定义菜单项不触发 click 事件的问题 ([#2946](https://github.com/antvis/S2/issues/2946)) ([82dbb61](https://github.com/antvis/S2/commit/82dbb617440ba3d81e7ade96ee98747a7a5ecf5a))
* 修复自定义计算总计时, 复制的数据不正确 close [#2928](https://github.com/antvis/S2/issues/2928) ([#2937](https://github.com/antvis/S2/issues/2937)) ([f82de36](https://github.com/antvis/S2/commit/f82de36d6bb92a2ae51577dbc40e16ced0b1792c))
* 修复行列头数值复制时未使用格式化的值 & 优化单测 ([989366f](https://github.com/antvis/S2/commit/989366fc740b7c1367c4cf246a6e3eb80e4f3338))
* 修复表格卸载后, 高清适配逻辑还会触发的问题 ([#2965](https://github.com/antvis/S2/issues/2965)) ([c837efe](https://github.com/antvis/S2/commit/c837efe29f2ff02ea8957bcaf62be57d2467f160)), closes [L#116](https://github.com/L/issues/116)
* 修复表格右键事件无法触发 close [#2687](https://github.com/antvis/S2/issues/2687) ([#2690](https://github.com/antvis/S2/issues/2690)) ([8b4f3e3](https://github.com/antvis/S2/commit/8b4f3e3dab83e6ae38b1d3362049af8352a7a4a9))
* 修复表格排序后, 编辑单元格后数据更新错误 ([e841d3d](https://github.com/antvis/S2/commit/e841d3db020afb418f0b2f9223271c329390b192))
* 修复角头和行头折叠展开 icon 的状态未同步以及展开异常的问题 close [#2607](https://github.com/antvis/S2/issues/2607) ([#2620](https://github.com/antvis/S2/issues/2620)) ([99829a6](https://github.com/antvis/S2/commit/99829a667c69394c0554ece841d6f6eb5c3f9b9e))
* 修复计算列宽时计算的文字宽度和判断文本是否溢出隐藏的文字宽度不一致的问题 ([#2689](https://github.com/antvis/S2/issues/2689)) ([2f52f3b](https://github.com/antvis/S2/commit/2f52f3be865327230d7a44762f34eb5711452cfa))
* 修复趋势分析表复制错误 ([2e24418](https://github.com/antvis/S2/commit/2e24418cabebdbe1cd306cdf931c0c8fa7bae050))
* 修复透视表开启多行文本后自定义行高不生效 close [#2678](https://github.com/antvis/S2/issues/2678) ([#2686](https://github.com/antvis/S2/issues/2686)) ([164259b](https://github.com/antvis/S2/commit/164259b66194de03c2073520389d2edfc352f9ab))
* 修复配置了多行文本但实际渲染的文本未换行时, 单元格高度也会自适应调整的问题 ([#2705](https://github.com/antvis/S2/issues/2705)) ([5d19e62](https://github.com/antvis/S2/commit/5d19e623c8f726d4f417ea2cb55cc489ef09f1b2))
* 修复非滚动引起的渲染也会触发滚动事件的问题 ([#2692](https://github.com/antvis/S2/issues/2692)) ([0cc2839](https://github.com/antvis/S2/commit/0cc2839c4058bb8fea8d73b03db00165612d6515))
* 修改滚动动画默认值为 false ([23df3ca](https://github.com/antvis/S2/commit/23df3ca19680a197411a6667760f73229716bae5))
* 减少开启 ReactDOM.unstable_batchedUpdates 后的重渲染次数 ([#2971](https://github.com/antvis/S2/issues/2971)) ([9007e8e](https://github.com/antvis/S2/commit/9007e8ecf41b6d7434db312398f3996018ef0ecf))
* 取消双击表格时浏览器默认的选中文本行为 close [#2798](https://github.com/antvis/S2/issues/2798) ([#2800](https://github.com/antvis/S2/issues/2800)) ([5df9326](https://github.com/antvis/S2/commit/5df9326790fd127268c64d288a4b28616e40794c))
* 回退生成 nodeId 时对 extra 字段的格式化 ([#2546](https://github.com/antvis/S2/issues/2546)) ([7d1cf9a](https://github.com/antvis/S2/commit/7d1cf9a68dd434b4843236d0e3570afc6ca22148))
* 增加单元格单双击的判断范围 ([#2924](https://github.com/antvis/S2/issues/2924)) ([c40bbf9](https://github.com/antvis/S2/commit/c40bbf9a4bf29459a0cb6ac32e3a7c52068c4eb1))
* 增加树状模式自定义宽度的容错 ([#2519](https://github.com/antvis/S2/issues/2519)) ([5f2c582](https://github.com/antvis/S2/commit/5f2c582378510e13cf34ccf92edb0a7d172ec07d))
* 处理自定义mini图显示柱状图时，全为正值&全为零值 展示异常问题 ([#2826](https://github.com/antvis/S2/issues/2826)) ([81def62](https://github.com/antvis/S2/commit/81def62ddc3e69ff2a2426b9c4824549ca728194))
* 暂时修复g版本冲突问题 ([#2003](https://github.com/antvis/S2/issues/2003)) ([1de7ec2](https://github.com/antvis/S2/commit/1de7ec215bc96c28e7493c8a32fe1764fd08cb2d))
* 移动端关闭 supportsPointerEvents, 避免禁用 touchAction close [#2857](https://github.com/antvis/S2/issues/2857) ([#2891](https://github.com/antvis/S2/issues/2891)) ([14c55aa](https://github.com/antvis/S2/commit/14c55aa7aae2e1fab63e612f7ecdaa00e7e7b567))
* 自定义 icon 支持跨域 close [#2513](https://github.com/antvis/S2/issues/2513) ([#2524](https://github.com/antvis/S2/issues/2524)) ([cdf58ea](https://github.com/antvis/S2/commit/cdf58ea34e7342b5fdd169d43cccc63309b36103))
* 角头选中列兼容树状模式和自定义行头场景 ([#2562](https://github.com/antvis/S2/issues/2562)) ([49ad04d](https://github.com/antvis/S2/commit/49ad04d4bcfdc932ac793bcf1d2866c01a694f9e))
* 调整分割线的颜色绘制逻辑, 优化和单元格边框颜色不一致的问题 ([#2919](https://github.com/antvis/S2/issues/2919)) ([3f766d0](https://github.com/antvis/S2/commit/3f766d02b14bf6d6ebac34b302a0232a58afe500))
* 调整换行高度自适应和自定义高度的优先级 close [#2613](https://github.com/antvis/S2/issues/2613) ([#2630](https://github.com/antvis/S2/issues/2630)) ([4caabed](https://github.com/antvis/S2/commit/4caabed679b4959faf598e38efbf23b4802ae29b))
* 调整维值生成规则, 修复导出格式化数据时空数据占位符未生效 close [#2808](https://github.com/antvis/S2/issues/2808) ([#2810](https://github.com/antvis/S2/issues/2810)) ([ad14ff4](https://github.com/antvis/S2/commit/ad14ff48dbc2b6874c18bdd3ccf1678f5b79f130))
* 重构绘制盒模型，修复边框偏移问题 ([#1854](https://github.com/antvis/S2/issues/1854)) ([f7e0858](https://github.com/antvis/S2/commit/f7e0858a937ea557532a7fff948e9af3b6a1fdff))


### Code Refactoring

* 调整 s2Options API 命名 ([#2015](https://github.com/antvis/S2/issues/2015)) ([e39b32f](https://github.com/antvis/S2/commit/e39b32f99befdf53569fab633087bb56edfc8720))


* feat!: 2.0 next 预览版发布 ([de5a406](https://github.com/antvis/S2/commit/de5a406f4fd5e0db23eea46c8e7185589215c195))
* feat!: 2.0 预览版发布 ([9abb76d](https://github.com/antvis/S2/commit/9abb76dd40c65ed2a6a122b6f2b20a9b963c8a58))


### Features

* 2.0 break ([a4ba788](https://github.com/antvis/S2/commit/a4ba788580788909f4fcfee98f3d7387dd883c4a))
* 2.0.0 next ([fe0aca3](https://github.com/antvis/S2/commit/fe0aca341f9c37e3a85e622a6eb30c9da5e02a96))
* canvas 支持挂载 s2 实例 ([#2645](https://github.com/antvis/S2/issues/2645)) ([ed21dcb](https://github.com/antvis/S2/commit/ed21dcb82ea4cb434587a4ffa4819f2a619ca1aa))
* **components:** 组件层更新时增加 loading 效果 close [#1790](https://github.com/antvis/S2/issues/1790) ([#2762](https://github.com/antvis/S2/issues/2762)) ([0ca8413](https://github.com/antvis/S2/commit/0ca841362bb4bbb3b81ca1046f5b4dcd7236b91e))
* custom icon support fill null close [#2654](https://github.com/antvis/S2/issues/2654) ([#2699](https://github.com/antvis/S2/issues/2699)) ([bdbd1b3](https://github.com/antvis/S2/commit/bdbd1b3b797c77d78d7e09925ff5898bfcc6953f))
* **frozen-panel:** 增加行列头冻结配置面板 ([#2782](https://github.com/antvis/S2/issues/2782)) ([d2fa5c9](https://github.com/antvis/S2/commit/d2fa5c958cee04a09d95ae481d62fd035728c7ae))
* headerActionIcons 支持细粒度配置 & 修复异步渲染导致无法获取实例的问题 ([#2301](https://github.com/antvis/S2/issues/2301)) ([b2d6f1f](https://github.com/antvis/S2/commit/b2d6f1fb04d3fa73129669fc7d2dec84943252db))
* **i18n:** add support of the russian language ([#2853](https://github.com/antvis/S2/issues/2853)) ([3dcf491](https://github.com/antvis/S2/commit/3dcf4913f37d222fe6c57a780bc00cab8829953d))
* **interaction:** 支持批量调整行高列宽 close [#2574](https://github.com/antvis/S2/issues/2574) ([#2580](https://github.com/antvis/S2/issues/2580)) ([7d1be20](https://github.com/antvis/S2/commit/7d1be206442396371ab08a8224b2685aea2c025d))
* **interaction:** 新增选中/高亮单元格 & 滚动 API ([#2586](https://github.com/antvis/S2/issues/2586)) ([ac4f5ab](https://github.com/antvis/S2/commit/ac4f5ab9d87bf9bf725b2ef872342a597823ebf6))
* **layout:** 单元格支持渲染多行文本 ([#2383](https://github.com/antvis/S2/issues/2383)) ([e3b919a](https://github.com/antvis/S2/commit/e3b919a4f37d600a0f516944edf4eed8b2c0174d))
* **layout:** 自定义行列头 ([#1719](https://github.com/antvis/S2/issues/1719)) ([2e0746d](https://github.com/antvis/S2/commit/2e0746dc9ca4ec45d50b35a9408b8827252c1bfa))
* meta 支持配置数值和正则, 便于批量配置 close [#2647](https://github.com/antvis/S2/issues/2647) ([#2799](https://github.com/antvis/S2/issues/2799)) ([3d89940](https://github.com/antvis/S2/commit/3d899401d37406ce44fa5dd54524f8b33ed9560f))
* **options:** customSVGIcons API 变更 ([#2700](https://github.com/antvis/S2/issues/2700)) ([fde8e8f](https://github.com/antvis/S2/commit/fde8e8f57d176057d052cbf0dd401211e2839a0e))
* s2-react 移除 antd 的依赖和部分基础组件, 相关分析组件迁移到 s2-react-components  中 ([#2887](https://github.com/antvis/S2/issues/2887)) ([64e3882](https://github.com/antvis/S2/commit/64e3882f1cd2fb52964710848674f58d8c9a3865))
* **theme-panel:** 新增主题风格配置组件 ([#2770](https://github.com/antvis/S2/issues/2770)) ([b559947](https://github.com/antvis/S2/commit/b559947ae2695dc3e4b581b10785ce34956d3702))
* **total:** 全量移除所有 totalData 配置 ([#1799](https://github.com/antvis/S2/issues/1799)) ([23cc219](https://github.com/antvis/S2/commit/23cc21933e02d5da6b261afe1fe1bc67008054d8))
* **type:** 使用 Template Literal Types 增强枚举类型的提示 ([#2783](https://github.com/antvis/S2/issues/2783)) ([6e571da](https://github.com/antvis/S2/commit/6e571da007c7a5185084f3a2c24c19d590d51319))
* version break ([064c0de](https://github.com/antvis/S2/commit/064c0de861f2e87814acf394cbdf6305397d476d))
* 优化 ViewMeta 类型定义和相关文档 ([#2935](https://github.com/antvis/S2/issues/2935)) ([55b6f55](https://github.com/antvis/S2/commit/55b6f551148672c1edd6442632ff9ffddc83aa72))
* 优化紧凑模式下的单元格宽度计算方式 ([#2953](https://github.com/antvis/S2/issues/2953)) ([68ed225](https://github.com/antvis/S2/commit/68ed2258305eca6f92be7c238cd29c21407bcdd7))
* 使用 requestIdleCallback 处理数据大量导出的情况 ([#2272](https://github.com/antvis/S2/issues/2272)) ([42a5551](https://github.com/antvis/S2/commit/42a55516dd369d9ab5579b52fbc9900b0ad81858))
* 升级的渲染引擎g5.0 ([#1924](https://github.com/antvis/S2/issues/1924)) ([820a310](https://github.com/antvis/S2/commit/820a310998bae5c0324c2f3144747f7dbe0097d1)), closes [#1852](https://github.com/antvis/S2/issues/1852) [#1862](https://github.com/antvis/S2/issues/1862)
* 单元格宽高配置增强 close [#1895](https://github.com/antvis/S2/issues/1895) ([#1981](https://github.com/antvis/S2/issues/1981)) ([ec6736f](https://github.com/antvis/S2/commit/ec6736f108801e1129c4d3fd29d13d1fbff2a1d2))
* 单元格行高拖拽支持多行文本自适应 ([#2980](https://github.com/antvis/S2/issues/2980)) ([535c2aa](https://github.com/antvis/S2/commit/535c2aa130a68bf189fbc861bcdc7f9979c2078e))
* 合并 master 到 next ([#2493](https://github.com/antvis/S2/issues/2493)) ([6da530d](https://github.com/antvis/S2/commit/6da530d0c5f53d283ddfaa4b3e510ca11c9bf83e)), closes [#2186](https://github.com/antvis/S2/issues/2186) [#2204](https://github.com/antvis/S2/issues/2204) [#2191](https://github.com/antvis/S2/issues/2191)
* 同步复制支持自定义transformer  ([#2201](https://github.com/antvis/S2/issues/2201)) ([9003767](https://github.com/antvis/S2/commit/9003767d584248b9d122f299326fd14753961883))
* 在生成 id 时，对 undefined, null 做区分 ([#1828](https://github.com/antvis/S2/issues/1828)) ([0687779](https://github.com/antvis/S2/commit/06877794be701608e5a68e6cab43e56927d59967))
* 增加不同类型单元格的选中事件 & 支持识别事件来源 ([#2956](https://github.com/antvis/S2/issues/2956)) ([69f6479](https://github.com/antvis/S2/commit/69f6479b43055c12d0295a7c77709b990a069ee3))
* 增加对自定义行列头总计、小计节点和组内排序的支持，修复明细表自定义列头 icon 问题 icon closes [#2898](https://github.com/antvis/S2/issues/2898) [#2893](https://github.com/antvis/S2/issues/2893) ([#2934](https://github.com/antvis/S2/issues/2934)) ([a4ae432](https://github.com/antvis/S2/commit/a4ae432d2ddff8a3b44fdfb7abd96d6a2369c81b))
* 增加暗黑主题 ([#2130](https://github.com/antvis/S2/issues/2130)) ([51dbdcf](https://github.com/antvis/S2/commit/51dbdcf564b387a3fd1809a71016f3a91eebde38))
* 增加绘制透视组合图的能力 ([#2780](https://github.com/antvis/S2/issues/2780)) ([e243e89](https://github.com/antvis/S2/commit/e243e890d3272b12372ecdd1b5139114a90d93ea))
* 增加自定义行头最大固定宽度的功能 ([#2069](https://github.com/antvis/S2/issues/2069)) ([4db301d](https://github.com/antvis/S2/commit/4db301db0971fca40e65d43c417ca4a36db66493))
* 增加角头和序号列的交互能力 ([#2571](https://github.com/antvis/S2/issues/2571)) ([fcb77cc](https://github.com/antvis/S2/commit/fcb77cce65ee56aeec189cf46d4226ef6a62a671))
* 增强行列冻结能力 ([#2706](https://github.com/antvis/S2/issues/2706)) ([e72d053](https://github.com/antvis/S2/commit/e72d05326c3db5d20aa88eec947549a78014b030)), closes [#2739](https://github.com/antvis/S2/issues/2739)
* 完善复制和导出在格式化后，总计、小计对应数值没有格式化的问题 ([#2237](https://github.com/antvis/S2/issues/2237)) ([abc0dbb](https://github.com/antvis/S2/commit/abc0dbb1544d9a4ef133e6a2c7d2d09ac8f35b48))
* 导出组件支持复制 HTML (text/html) 格式的数据 close [#2828](https://github.com/antvis/S2/issues/2828) ([#2865](https://github.com/antvis/S2/issues/2865)) ([444fbf5](https://github.com/antvis/S2/commit/444fbf55b25e4edff70e9c58efa023a0274a3b1f))
* 折叠展开重构 & 简化行头 tree 相关配置 ([#2030](https://github.com/antvis/S2/issues/2030)) ([0f3ea3b](https://github.com/antvis/S2/commit/0f3ea3b5c668137bc2fcb53bd186a41b34140e25))
* 支持 antd v5 ([#2413](https://github.com/antvis/S2/issues/2413)) ([299c7bf](https://github.com/antvis/S2/commit/299c7bfe2e86838153273c92dd6d2b72917cfdea))
* 支持 React 18 (兼容 React 16/17) ([#2373](https://github.com/antvis/S2/issues/2373)) ([25ce9b0](https://github.com/antvis/S2/commit/25ce9b0ccc3e609d8add09b3209f6f981dc1dc4e))
* 支持在单元格内渲染 G2 图表 ([#2437](https://github.com/antvis/S2/issues/2437)) ([497f941](https://github.com/antvis/S2/commit/497f9414b89fce01b60db9b6c2eb4292ffe69c1d))
* 支持自定义 G 5.0 插件和配置 ([#2423](https://github.com/antvis/S2/issues/2423)) ([cc6c47f](https://github.com/antvis/S2/commit/cc6c47fd0927125bbc378fe6914becfcbe1b0acd))
* 文本和图标的条件格式支持主题配置 ([#2267](https://github.com/antvis/S2/issues/2267)) ([c332c68](https://github.com/antvis/S2/commit/c332c687dfb7be1d07b79b44934f78c1947cc466))
* 新增 s2.facet.getContentWidth() API ([#2883](https://github.com/antvis/S2/issues/2883)) ([395db7e](https://github.com/antvis/S2/commit/395db7e313fd1de6e42ee5dd4d6c475c517609d4))
* 明细表支持同名列渲染 closes [#2502](https://github.com/antvis/S2/issues/2502) [#2510](https://github.com/antvis/S2/issues/2510) ([#2568](https://github.com/antvis/S2/issues/2568)) ([e324c93](https://github.com/antvis/S2/commit/e324c934a310a3b514cc49f607d21434e095f1f7)), closes [#2519](https://github.com/antvis/S2/issues/2519)
* 明细表新增空数据占位符能力 ([#2729](https://github.com/antvis/S2/issues/2729)) ([19dbda5](https://github.com/antvis/S2/commit/19dbda5e9719d6a8f6d05ce0a93386e80c31ffab))
* 更新 g 到最新版 ([#2631](https://github.com/antvis/S2/issues/2631)) ([7647605](https://github.com/antvis/S2/commit/7647605dcd60e1e34f2014aafb180ac931bf0725)), closes [#2629](https://github.com/antvis/S2/issues/2629)
* 更新 G 版本, 支持透传 dblClickSpeed ([ce11006](https://github.com/antvis/S2/commit/ce110069c855bc68fd89e014f8436d6e8bf92a49))
* 更新英语文档，使用依赖包进行翻译 ([#2067](https://github.com/antvis/S2/issues/2067)) ([f271684](https://github.com/antvis/S2/commit/f2716847ec0d06a0867eabe16a7f5e2e3a9263ee))
* 条件格式 mapping 增加第三个参数获取单元格实例 ([#2242](https://github.com/antvis/S2/issues/2242)) ([aae427d](https://github.com/antvis/S2/commit/aae427dfe6a87cae577ce2449fd6058d358971f9))
* 移动端组件适配 ([#1833](https://github.com/antvis/S2/issues/1833)) ([bd2e71e](https://github.com/antvis/S2/commit/bd2e71e0d1d55057af77d435a10730b7ac929324))
* 移除已废弃的方法和逻辑 & 优化文档 ([#2566](https://github.com/antvis/S2/issues/2566)) ([de7c97b](https://github.com/antvis/S2/commit/de7c97b862e5b467fd335dd65f9dac5a95e4b621))
* 统一导出和复制逻辑，优化导出和复制性能 ([#2152](https://github.com/antvis/S2/issues/2152)) ([df88455](https://github.com/antvis/S2/commit/df884557756e4374e95687cf4c99d575bc2cb6fc))
* 统一透视表和明细表 meta 中的 query 参数 ([#2818](https://github.com/antvis/S2/issues/2818)) ([ffdde84](https://github.com/antvis/S2/commit/ffdde84fc6a0ecad21888b8d66cffd1356568662))
* 统一链接跳转字段绘制逻辑, 支持标记列头 close [#2430](https://github.com/antvis/S2/issues/2430) ([#2796](https://github.com/antvis/S2/issues/2796)) ([637f651](https://github.com/antvis/S2/commit/637f651bbaaf1fcb696afe12c03e5c7042f95fae))
* 行列头兼容 condition icon 和 action icons ([#2161](https://github.com/antvis/S2/issues/2161)) ([1df4286](https://github.com/antvis/S2/commit/1df42860f6a12d3cb182ba7633c4984a04e62890))
* 调整单元格默认 padding, 优化多行文本时的展示效果 ([#2970](https://github.com/antvis/S2/issues/2970)) ([599d7a4](https://github.com/antvis/S2/commit/599d7a4e76d2b606bdb0509eb684f47870a9e69d))
* 适配g5.0异步渲染 ([#2251](https://github.com/antvis/S2/issues/2251)) ([069d03d](https://github.com/antvis/S2/commit/069d03d299429c2ffab3e20d56ecd6bb30119ffd))


### Performance Improvements

* 优化 getDimensionValues 在大量 flatten 情况下的性能 ([#2640](https://github.com/antvis/S2/issues/2640)) ([e0348d7](https://github.com/antvis/S2/commit/e0348d77e6c0296151566214ad975f810732e5b8))
* 优化多行文本渲染性能 ([#2478](https://github.com/antvis/S2/issues/2478)) ([adc5ef3](https://github.com/antvis/S2/commit/adc5ef32056ca0427942f5a118af938124821bcc))
* 优化开启多行文本时的布局性能 ([#2734](https://github.com/antvis/S2/issues/2734)) ([388157c](https://github.com/antvis/S2/commit/388157c0ecb82c45f8a0277b649e891366dc2f1c))
* 优化明细表滚动性能 close [#2548](https://github.com/antvis/S2/issues/2548), [#2402](https://github.com/antvis/S2/issues/2402) ([#2561](https://github.com/antvis/S2/issues/2561)) ([c2d5812](https://github.com/antvis/S2/commit/c2d581286253e09cf09ecba00673be738bf14cf9))
* 优化未开启多行文本时的布局性能 close [#2693](https://github.com/antvis/S2/issues/2693) ([#2728](https://github.com/antvis/S2/issues/2728)) ([439162d](https://github.com/antvis/S2/commit/439162d8e14adedd26f1a125b319f2ab6636b8b1))


### Reverts

* Revert "chore(release): bump version" ([d1bdfb2](https://github.com/antvis/S2/commit/d1bdfb27564fc38e78d4d424042e3cd02e182e58))


### BREAKING CHANGES

* 移除 header props 参数 (不再内置行列切换, 导出,
高级排序), 移除 antd ConfigProvider 包裹

* feat: 移除 header

* feat: 移除 SheetComponent 中的 Spin 组件

* feat: 移除分页组件

* docs: 更新文档

* feat: 解耦操作栏 Menu 组件

* feat: 移除编辑表的 Input 依赖

* feat: 迁移下钻组件

* docs: 更新文档

* docs: 完善分页文档

* docs: 完善导出文档

* docs: 调整目录结构

* refactor: 优化分页组件的使用方式

* docs: 完善导出和维度切换组件文档

* test: 迁移并修复 s2-react 中的分析组件单测

* test: 完善 s2-react-components 中高级排序/下钻/导出 单测

* feat: 完善 switcher 功能和单测

* feat: 统一入口文件风格

* test: 更新单测

* feat: 移除 s2-react 的 antd peerDependencies

* chore: 更新 lock

* docs: 更新文档

* docs: 完善文档和示例

* feat: 优化目录结构和文档合理性

* fix: 修复类型问题

* test: 调整单测路径

* feat: shared 包移动到 s2-core 中, 优化打包方式

* chore: 移除 s2-react-components 中的 shared 依赖

* chore: 移除 s2-vue 中的 shared 依赖

* test: 迁移 shared 单测

* docs: 完善文档

* fix: 修复布局错误

* build: 修复 umd 打包失败

* chore: 调整 size-limit

* docs: 完善文档

* build: 使用 tsc 打包

* test: 修复单测

* build: 移除 father

* build: 移除 father

* chore: 修复 ci

* test: 更新 jest 别名

* test: 修复 svg mock 不生效

* docs: 优化文档

* test: 修复单测

* test: 更新快照

* docs: 优化文档跳转效果和迁移文档

* docs: 优化 2.0-next => 2.0 迁移文档

* docs: 更新贡献指南

* chore: 移除无用开发依赖

* chore: 更新 lock

* chore(ci): 尝试解决 CI 单测进程挂起的问题

* chore(ci): 尝试解决 CI 单测进程挂起的问题
* 移除 s2.getContentHeight() API

* docs: 补充迁移文档
* s2Options.placeholder 配置更改为 cell 和 empty

* test: 增加单测

* fix: 兼容滚动条的展示

* test: 单测和文档补充

* test: 修改滚动条位置单测断言

* test: 更新 shared 包快照

* fix: 修复英文环境下未展示英文文案

* fix: 修复列头单元格宽度很小时占位符坐标错误的问题

* fix: 修复趋势分析表导出占位符解析错误
* Export 组件 和 asyncGetAllPlainData, copyToClipboard
的是否异步导出参数统一为 async

* test: 修复循环依赖

* fix: 修复格式化对角头未生效

* fix: 修复趋势分析表导出 CSV 错误

* test: 单测修复
* **options:** svg 变更为 src

* test: 单测修复

* test: 单测修复
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
* s2Options.tooltip 和 s2Options.style API 命名更改, 移除 trend 操作项

* refactor: tree 相关配置移动到 rowCell 下

* refactor: hideMeasureColumn => hideValue

* refactor: 冻结相关配置收拢到 forzen 命名空间下

* test: 修复测试
* G5.0, 透视表自定义行列头, 数据流重构
* G5.0, 行列头自定义, 数据流
* 2.0-next
* 2.0
* https://github.com/antvis/S2/discussions/1933

# [@antv/s2-v2.0.0-next.33](https://github.com/antvis/S2/compare/@antv/s2-v2.0.0-next.32...@antv/s2-v2.0.0-next.33) (2024-11-15)


### Bug Fixes

* 修复文本存在换行符时, 未显示省略号的问题 ([#2978](https://github.com/antvis/S2/issues/2978)) ([08dbf0d](https://github.com/antvis/S2/commit/08dbf0d9c63f1c64989fe242c9645df06e6b04e5))
* 修复紧凑模式下, 文本带有 '\n' 换行符时 maxLines 配置未生效和文本溢出的问题 closes [#2963](https://github.com/antvis/S2/issues/2963) [#2900](https://github.com/antvis/S2/issues/2900) ([#2972](https://github.com/antvis/S2/issues/2972)) ([8d45f07](https://github.com/antvis/S2/commit/8d45f07ae86b24d088b609401817d535be2b43bc))
* 减少开启 ReactDOM.unstable_batchedUpdates 后的重渲染次数 ([#2971](https://github.com/antvis/S2/issues/2971)) ([9007e8e](https://github.com/antvis/S2/commit/9007e8ecf41b6d7434db312398f3996018ef0ecf))


### Features

* 调整单元格默认 padding, 优化多行文本时的展示效果 ([#2970](https://github.com/antvis/S2/issues/2970)) ([599d7a4](https://github.com/antvis/S2/commit/599d7a4e76d2b606bdb0509eb684f47870a9e69d))

# [@antv/s2-v2.0.0-next.32](https://github.com/antvis/S2/compare/@antv/s2-v2.0.0-next.31...@antv/s2-v2.0.0-next.32) (2024-11-08)


### Bug Fixes

* 修复分割线在深色背景下颜色渲染异常 & 内容宽高未包含分割线的问题 ([#2961](https://github.com/antvis/S2/issues/2961)) ([e759891](https://github.com/antvis/S2/commit/e759891865eee0940d0f5c92345d5490e10eb57c))
* 修复开启自定义指标层级后, 角头数值文本未对齐 close [#2957](https://github.com/antvis/S2/issues/2957) ([#2966](https://github.com/antvis/S2/issues/2966)) ([6558a0d](https://github.com/antvis/S2/commit/6558a0df55dc324e1810e2f2a5d314de7389e2b1))
* 修复文本设为左对齐时, 角头文本没有垂直对齐的问题 ([#2960](https://github.com/antvis/S2/issues/2960)) ([af8c968](https://github.com/antvis/S2/commit/af8c96809fd0e52f1da81e2a1c082a5f5b0b122a))
* 修复明细表自定义列头时开启文本换行, 单元格高度错误的问题 close [#2955](https://github.com/antvis/S2/issues/2955) ([#2968](https://github.com/antvis/S2/issues/2968)) ([ca1f7e8](https://github.com/antvis/S2/commit/ca1f7e8a614dc5b36a6bc270df4ea8338e670444))
* 修复表格卸载后, 高清适配逻辑还会触发的问题 ([#2965](https://github.com/antvis/S2/issues/2965)) ([c837efe](https://github.com/antvis/S2/commit/c837efe29f2ff02ea8957bcaf62be57d2467f160)), closes [L#116](https://github.com/L/issues/116)

# [@antv/s2-v2.0.0-next.31](https://github.com/antvis/S2/compare/@antv/s2-v2.0.0-next.30...@antv/s2-v2.0.0-next.31) (2024-11-01)


### Bug Fixes

* 修复开启 supportsCSSTransform 后 hover 在表格上时报错 ([#2947](https://github.com/antvis/S2/issues/2947)) ([d328598](https://github.com/antvis/S2/commit/d328598f080ff5ce8336f8cd98c200a5052d348c))
* 修复自定义菜单项不触发 click 事件的问题 ([#2946](https://github.com/antvis/S2/issues/2946)) ([82dbb61](https://github.com/antvis/S2/commit/82dbb617440ba3d81e7ade96ee98747a7a5ecf5a))


### Features

* 优化紧凑模式下的单元格宽度计算方式 ([#2953](https://github.com/antvis/S2/issues/2953)) ([68ed225](https://github.com/antvis/S2/commit/68ed2258305eca6f92be7c238cd29c21407bcdd7))
* 增加不同类型单元格的选中事件 & 支持识别事件来源 ([#2956](https://github.com/antvis/S2/issues/2956)) ([69f6479](https://github.com/antvis/S2/commit/69f6479b43055c12d0295a7c77709b990a069ee3))
* 增加对自定义行列头总计、小计节点和组内排序的支持，修复明细表自定义列头 icon 问题 icon closes [#2898](https://github.com/antvis/S2/issues/2898) [#2893](https://github.com/antvis/S2/issues/2893) ([#2934](https://github.com/antvis/S2/issues/2934)) ([a4ae432](https://github.com/antvis/S2/commit/a4ae432d2ddff8a3b44fdfb7abd96d6a2369c81b))

# [@antv/s2-v2.0.0-next.30](https://github.com/antvis/S2/compare/@antv/s2-v2.0.0-next.29...@antv/s2-v2.0.0-next.30) (2024-10-25)


### Bug Fixes

* **type:** 修复 g renderer 的错误类型定义 ([#2939](https://github.com/antvis/S2/issues/2939)) ([523b2cc](https://github.com/antvis/S2/commit/523b2ccb8884933060000854f28d9a6d8b2806f5))
* 修复字段标记 mapping 函数部分场景缺失第三个参数 & 调整参数类型 ([#2927](https://github.com/antvis/S2/issues/2927)) ([676c1f6](https://github.com/antvis/S2/commit/676c1f68101a9191b48d23ce1ec15f852bcebc5d))
* 修复数值单元格 tooltip 内的指标名展示错误 ([#2941](https://github.com/antvis/S2/issues/2941)) ([a426a46](https://github.com/antvis/S2/commit/a426a468d8cc1fe7ec0fd1db0e04938884ec0f46))
* 修复父容器存在 transform 时, 在 canvas 内点击也会重置交互的问题 close [#2879](https://github.com/antvis/S2/issues/2879) ([#2942](https://github.com/antvis/S2/issues/2942)) ([010ed05](https://github.com/antvis/S2/commit/010ed050214568ea1902e4a426d6638afd3ae2f9))
* 修复自定义计算总计时, 复制的数据不正确 close [#2928](https://github.com/antvis/S2/issues/2928) ([#2937](https://github.com/antvis/S2/issues/2937)) ([f82de36](https://github.com/antvis/S2/commit/f82de36d6bb92a2ae51577dbc40e16ced0b1792c))
* 增加单元格单双击的判断范围 ([#2924](https://github.com/antvis/S2/issues/2924)) ([c40bbf9](https://github.com/antvis/S2/commit/c40bbf9a4bf29459a0cb6ac32e3a7c52068c4eb1))


### Features

* 优化 ViewMeta 类型定义和相关文档 ([#2935](https://github.com/antvis/S2/issues/2935)) ([55b6f55](https://github.com/antvis/S2/commit/55b6f551148672c1edd6442632ff9ffddc83aa72))

# [@antv/s2-v2.0.0-next.29](https://github.com/antvis/S2/compare/@antv/s2-v2.0.0-next.28...@antv/s2-v2.0.0-next.29) (2024-10-12)


### Bug Fixes

* 修复存在字段标记的 icon 时, 紧凑模式列宽计算错误出现省略号的问题 ([#2920](https://github.com/antvis/S2/issues/2920)) ([75acbfe](https://github.com/antvis/S2/commit/75acbfe4540bf8dc702a3a068c214c9217239261))
* 修复拖拽列宽后, 默认的自定义列宽失效 close [#2910](https://github.com/antvis/S2/issues/2910) ([#2915](https://github.com/antvis/S2/issues/2915)) ([8302fe4](https://github.com/antvis/S2/commit/8302fe40bc475baecf72ba463ac948d33a391a3f))
* 修复自定义列宽对虚拟数值列不生效 ([#2921](https://github.com/antvis/S2/issues/2921)) ([c53cea4](https://github.com/antvis/S2/commit/c53cea4a2fa2d7b18939abfb984629a94eab936d))
* 调整分割线的颜色绘制逻辑, 优化和单元格边框颜色不一致的问题 ([#2919](https://github.com/antvis/S2/issues/2919)) ([3f766d0](https://github.com/antvis/S2/commit/3f766d02b14bf6d6ebac34b302a0232a58afe500))

# [@antv/s2-v2.0.0-next.28](https://github.com/antvis/S2/compare/@antv/s2-v2.0.0-next.27...@antv/s2-v2.0.0-next.28) (2024-09-18)


### Bug Fixes

* 修复 expandDepth 在自定义行头场景下不生效 ([#2895](https://github.com/antvis/S2/issues/2895)) ([d83a816](https://github.com/antvis/S2/commit/d83a81674e587eab129630c0d3bc4f87b6550471))
* 修复浏览器窗口多次放大后表格渲染模糊 close [#2884](https://github.com/antvis/S2/issues/2884) ([#2897](https://github.com/antvis/S2/issues/2897)) ([97e2905](https://github.com/antvis/S2/commit/97e2905d6b42a20728950cd51ddabd3bcdd14f1e))
* 移动端关闭 supportsPointerEvents, 避免禁用 touchAction close [#2857](https://github.com/antvis/S2/issues/2857) ([#2891](https://github.com/antvis/S2/issues/2891)) ([14c55aa](https://github.com/antvis/S2/commit/14c55aa7aae2e1fab63e612f7ecdaa00e7e7b567))


### Features

* 新增 s2.facet.getContentWidth() API ([#2883](https://github.com/antvis/S2/issues/2883)) ([395db7e](https://github.com/antvis/S2/commit/395db7e313fd1de6e42ee5dd4d6c475c517609d4))


### BREAKING CHANGES

* 移除 s2.getContentHeight() API

* docs: 补充迁移文档

# [@antv/s2-v2.0.0-next.27](https://github.com/antvis/S2/compare/@antv/s2-v2.0.0-next.26...@antv/s2-v2.0.0-next.27) (2024-08-23)


### Bug Fixes

* 修复在局部复制和导出场景时, 格式化函数获取不到单元格信息 close [#2866](https://github.com/antvis/S2/issues/2866) ([#2871](https://github.com/antvis/S2/issues/2871)) ([f0db754](https://github.com/antvis/S2/commit/f0db75405561e0c841ae2fe57fb490f08dad7d50))
* 修复在明细表中绘制 G2 图表, 点击单元格报错 close [#2843](https://github.com/antvis/S2/issues/2843) ([#2864](https://github.com/antvis/S2/issues/2864)) ([8684fb2](https://github.com/antvis/S2/commit/8684fb286279c4d1e280e00baf197f154ac3a540))
* 修复自定义列头导出数据时, 角头文本展示错误 close [#2844](https://github.com/antvis/S2/issues/2844) ([#2869](https://github.com/antvis/S2/issues/2869)) ([63dba54](https://github.com/antvis/S2/commit/63dba54b947b1c36a996004823841c98284c232a))


### Features

* **i18n:** add support of the russian language ([#2853](https://github.com/antvis/S2/issues/2853)) ([3dcf491](https://github.com/antvis/S2/commit/3dcf4913f37d222fe6c57a780bc00cab8829953d))
* 导出组件支持复制 HTML (text/html) 格式的数据 close [#2828](https://github.com/antvis/S2/issues/2828) ([#2865](https://github.com/antvis/S2/issues/2865)) ([444fbf5](https://github.com/antvis/S2/commit/444fbf55b25e4edff70e9c58efa023a0274a3b1f))

# [@antv/s2-v2.0.0-next.26](https://github.com/antvis/S2/compare/@antv/s2-v2.0.0-next.25...@antv/s2-v2.0.0-next.26) (2024-08-09)


### Bug Fixes

* 修改滚动动画默认值为 false ([23df3ca](https://github.com/antvis/S2/commit/23df3ca19680a197411a6667760f73229716bae5))
* 处理自定义mini图显示柱状图时，全为正值&全为零值 展示异常问题 ([#2826](https://github.com/antvis/S2/issues/2826)) ([81def62](https://github.com/antvis/S2/commit/81def62ddc3e69ff2a2426b9c4824549ca728194))
* 调整维值生成规则, 修复导出格式化数据时空数据占位符未生效 close [#2808](https://github.com/antvis/S2/issues/2808) ([#2810](https://github.com/antvis/S2/issues/2810)) ([ad14ff4](https://github.com/antvis/S2/commit/ad14ff48dbc2b6874c18bdd3ccf1678f5b79f130))


### Features

* **interaction:** 新增选中/高亮单元格 & 滚动 API ([#2586](https://github.com/antvis/S2/issues/2586)) ([ac4f5ab](https://github.com/antvis/S2/commit/ac4f5ab9d87bf9bf725b2ef872342a597823ebf6))
* 更新 G 版本, 支持透传 dblClickSpeed ([ce11006](https://github.com/antvis/S2/commit/ce110069c855bc68fd89e014f8436d6e8bf92a49))
* 统一透视表和明细表 meta 中的 query 参数 ([#2818](https://github.com/antvis/S2/issues/2818)) ([ffdde84](https://github.com/antvis/S2/commit/ffdde84fc6a0ecad21888b8d66cffd1356568662))

# [@antv/s2-v2.0.0-next.25](https://github.com/antvis/S2/compare/@antv/s2-v2.0.0-next.24...@antv/s2-v2.0.0-next.25) (2024-07-05)


### Bug Fixes

* 修复树状模式当一组数据只有一条数据时, 叶子节点判断错误, 也渲染了展开/收起图标 close [#2804](https://github.com/antvis/S2/issues/2804) ([#2806](https://github.com/antvis/S2/issues/2806)) ([76a7a59](https://github.com/antvis/S2/commit/76a7a59cf12c7b3df1ec2b8a43d04479ab25cb73))
* 取消双击表格时浏览器默认的选中文本行为 close [#2798](https://github.com/antvis/S2/issues/2798) ([#2800](https://github.com/antvis/S2/issues/2800)) ([5df9326](https://github.com/antvis/S2/commit/5df9326790fd127268c64d288a4b28616e40794c))


### Features

* meta 支持配置数值和正则, 便于批量配置 close [#2647](https://github.com/antvis/S2/issues/2647) ([#2799](https://github.com/antvis/S2/issues/2799)) ([3d89940](https://github.com/antvis/S2/commit/3d899401d37406ce44fa5dd54524f8b33ed9560f))
* 统一链接跳转字段绘制逻辑, 支持标记列头 close [#2430](https://github.com/antvis/S2/issues/2430) ([#2796](https://github.com/antvis/S2/issues/2796)) ([637f651](https://github.com/antvis/S2/commit/637f651bbaaf1fcb696afe12c03e5c7042f95fae))

# [@antv/s2-v2.0.0-next.24](https://github.com/antvis/S2/compare/@antv/s2-v2.0.0-next.23...@antv/s2-v2.0.0-next.24) (2024-06-21)


### Bug Fixes

* 修复 headerActionIcons 下的 defaultHide 属性不生效 close [#2772](https://github.com/antvis/S2/issues/2772) ([#2774](https://github.com/antvis/S2/issues/2774)) ([d142efa](https://github.com/antvis/S2/commit/d142efacf3b35bbcc5f8ac3dc0a1dbe61eb167bd))


### Features

* **components:** 组件层更新时增加 loading 效果 close [#1790](https://github.com/antvis/S2/issues/1790) ([#2762](https://github.com/antvis/S2/issues/2762)) ([0ca8413](https://github.com/antvis/S2/commit/0ca841362bb4bbb3b81ca1046f5b4dcd7236b91e))
* **frozen-panel:** 增加行列头冻结配置面板 ([#2782](https://github.com/antvis/S2/issues/2782)) ([d2fa5c9](https://github.com/antvis/S2/commit/d2fa5c958cee04a09d95ae481d62fd035728c7ae))
* **theme-panel:** 新增主题风格配置组件 ([#2770](https://github.com/antvis/S2/issues/2770)) ([b559947](https://github.com/antvis/S2/commit/b559947ae2695dc3e4b581b10785ce34956d3702))
* **type:** 使用 Template Literal Types 增强枚举类型的提示 ([#2783](https://github.com/antvis/S2/issues/2783)) ([6e571da](https://github.com/antvis/S2/commit/6e571da007c7a5185084f3a2c24c19d590d51319))

# [@antv/s2-v2.0.0-next.23](https://github.com/antvis/S2/compare/@antv/s2-v2.0.0-next.22...@antv/s2-v2.0.0-next.23) (2024-06-03)


### Bug Fixes

* wheel scroll error! ([#2643](https://github.com/antvis/S2/issues/2643)) ([43cf364](https://github.com/antvis/S2/commit/43cf364cabc22409f405a1e6297d2d7196f8050b))
* 修复字段标记背景色透明度优先级低于主题背景色透明度的问题 ([#2744](https://github.com/antvis/S2/issues/2744)) ([6949f60](https://github.com/antvis/S2/commit/6949f6007f1d6c6ced4011803be9c24d326f084b))
* 修复明细表导出时自定义序号文本不生效 close [#2755](https://github.com/antvis/S2/issues/2755) ([#2757](https://github.com/antvis/S2/issues/2757)) ([ebe68d8](https://github.com/antvis/S2/commit/ebe68d83986a1e9de87d0154382f3725818d5bfd))
* 修复自定义 dataCell 错误的传参写法 ([#2748](https://github.com/antvis/S2/issues/2748)) ([c54ca82](https://github.com/antvis/S2/commit/c54ca826ab3fd8aa1e760f522abbc0190c724060))


### Features

* 增强行列冻结能力 ([#2706](https://github.com/antvis/S2/issues/2706)) ([e72d053](https://github.com/antvis/S2/commit/e72d05326c3db5d20aa88eec947549a78014b030)), closes [#2739](https://github.com/antvis/S2/issues/2739)

# [@antv/s2-v2.0.0-next.22](https://github.com/antvis/S2/compare/@antv/s2-v2.0.0-next.21...@antv/s2-v2.0.0-next.22) (2024-05-24)


### Bug Fixes

* 修复自定义 tooltip 时, 刷选时无法获取到单元格信息 ([#2738](https://github.com/antvis/S2/issues/2738)) ([782a2fc](https://github.com/antvis/S2/commit/782a2fcd78fa6009c1335fbdfe0392dd894c94ad))


### Performance Improvements

* 优化开启多行文本时的布局性能 ([#2734](https://github.com/antvis/S2/issues/2734)) ([388157c](https://github.com/antvis/S2/commit/388157c0ecb82c45f8a0277b649e891366dc2f1c))

# [@antv/s2-v2.0.0-next.21](https://github.com/antvis/S2/compare/@antv/s2-v2.0.0-next.20...@antv/s2-v2.0.0-next.21) (2024-05-17)


### Bug Fixes

* 修复下载数据重复 close [#2718](https://github.com/antvis/S2/issues/2718) ([#2719](https://github.com/antvis/S2/issues/2719)) ([f0d5192](https://github.com/antvis/S2/commit/f0d5192e769a392df84a4e85e245496ac7c0ef31))
* 修复列等宽布局模式下角头出现省略号 close [#2726](https://github.com/antvis/S2/issues/2726) ([#2732](https://github.com/antvis/S2/issues/2732)) ([b4e07b9](https://github.com/antvis/S2/commit/b4e07b94a1c77163254ff3acc39baa93b0d151aa))
* 修复滚动边界问题 close [#2720](https://github.com/antvis/S2/issues/2720) ([#2721](https://github.com/antvis/S2/issues/2721)) ([24591fb](https://github.com/antvis/S2/commit/24591fbb65d9e760a566223a0a0fde6ce360c189))


### Features

* 明细表新增空数据占位符能力 ([#2729](https://github.com/antvis/S2/issues/2729)) ([19dbda5](https://github.com/antvis/S2/commit/19dbda5e9719d6a8f6d05ce0a93386e80c31ffab))


### Performance Improvements

* 优化未开启多行文本时的布局性能 close [#2693](https://github.com/antvis/S2/issues/2693) ([#2728](https://github.com/antvis/S2/issues/2728)) ([439162d](https://github.com/antvis/S2/commit/439162d8e14adedd26f1a125b319f2ab6636b8b1))


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

# [@antv/s2-v2.0.0-next.20](https://github.com/antvis/S2/compare/@antv/s2-v2.0.0-next.19...@antv/s2-v2.0.0-next.20) (2024-05-11)


### Bug Fixes

* 修复 React 18 环境下 Tooltip 卸载后无法再次渲染 & 排序菜单选中效果丢失的问题 ([#2698](https://github.com/antvis/S2/issues/2698)) ([0af329d](https://github.com/antvis/S2/commit/0af329da596733eee8013a7a1f04676a720767d3))
* 修复导出 CSV 时分隔符错误导致的展示格式错误 close [#2701](https://github.com/antvis/S2/issues/2701) ([#2703](https://github.com/antvis/S2/issues/2703)) ([98c051a](https://github.com/antvis/S2/commit/98c051a58c1d8b7c7831343ba909238e514615ae))
* 修复无汇总数据时前端计算汇总值缺少聚合方式导致排序失效的问题 ([#2711](https://github.com/antvis/S2/issues/2711)) ([97b0aeb](https://github.com/antvis/S2/commit/97b0aeb73f0fdeb1416f4d28214f912fa490db02))
* 修复明细表含有空数据占位符时排序错误 close [#2707](https://github.com/antvis/S2/issues/2707) ([#2708](https://github.com/antvis/S2/issues/2708)) ([40792ce](https://github.com/antvis/S2/commit/40792ce994bc2b574a256433263e54af754f7dba))
* 修复配置了多行文本但实际渲染的文本未换行时, 单元格高度也会自适应调整的问题 ([#2705](https://github.com/antvis/S2/issues/2705)) ([5d19e62](https://github.com/antvis/S2/commit/5d19e623c8f726d4f417ea2cb55cc489ef09f1b2))


### Features

* custom icon support fill null close [#2654](https://github.com/antvis/S2/issues/2654) ([#2699](https://github.com/antvis/S2/issues/2699)) ([bdbd1b3](https://github.com/antvis/S2/commit/bdbd1b3b797c77d78d7e09925ff5898bfcc6953f))
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

# [@antv/s2-v2.0.0-next.19](https://github.com/antvis/S2/compare/@antv/s2-v2.0.0-next.18...@antv/s2-v2.0.0-next.19) (2024-04-30)


### Bug Fixes

* **layout:** 修复空数据的情况开启汇总分组渲染报错 close [#2661](https://github.com/antvis/S2/issues/2661) ([#2662](https://github.com/antvis/S2/issues/2662)) ([8158660](https://github.com/antvis/S2/commit/81586601ea7451f6ca56932bd4bf4ef7738dbd7d))
* 修复数据导出时列头被格式化 close [#2688](https://github.com/antvis/S2/issues/2688) ([#2694](https://github.com/antvis/S2/issues/2694)) ([19d8e60](https://github.com/antvis/S2/commit/19d8e608c27da89771cef7439402585af00750b9))
* 修复树状模式下开启分页, 行头展开收起后表格渲染异常 close [#2582](https://github.com/antvis/S2/issues/2582) ([#2590](https://github.com/antvis/S2/issues/2590)) ([b9e48a0](https://github.com/antvis/S2/commit/b9e48a0202d4105b75b0961096f106ca6039c553))
* 修复紧凑模式下单元格宽度计算忽略了icon宽度的问题 ([#2673](https://github.com/antvis/S2/issues/2673)) ([23ee734](https://github.com/antvis/S2/commit/23ee734ee09106f05b4278b8ab02202a78949a1d))
* 修复维值带有 '-' 时刷选复制无法复制表头 close [#2684](https://github.com/antvis/S2/issues/2684) ([#2691](https://github.com/antvis/S2/issues/2691)) ([11c0325](https://github.com/antvis/S2/commit/11c03256cf7bdc369601d9efd8f8e65807ae7b2f))
* 修复表格右键事件无法触发 close [#2687](https://github.com/antvis/S2/issues/2687) ([#2690](https://github.com/antvis/S2/issues/2690)) ([8b4f3e3](https://github.com/antvis/S2/commit/8b4f3e3dab83e6ae38b1d3362049af8352a7a4a9))
* 修复计算列宽时计算的文字宽度和判断文本是否溢出隐藏的文字宽度不一致的问题 ([#2689](https://github.com/antvis/S2/issues/2689)) ([2f52f3b](https://github.com/antvis/S2/commit/2f52f3be865327230d7a44762f34eb5711452cfa))
* 修复透视表开启多行文本后自定义行高不生效 close [#2678](https://github.com/antvis/S2/issues/2678) ([#2686](https://github.com/antvis/S2/issues/2686)) ([164259b](https://github.com/antvis/S2/commit/164259b66194de03c2073520389d2edfc352f9ab))
* 修复非滚动引起的渲染也会触发滚动事件的问题 ([#2692](https://github.com/antvis/S2/issues/2692)) ([0cc2839](https://github.com/antvis/S2/commit/0cc2839c4058bb8fea8d73b03db00165612d6515))


### Features

* canvas 支持挂载 s2 实例 ([#2645](https://github.com/antvis/S2/issues/2645)) ([ed21dcb](https://github.com/antvis/S2/commit/ed21dcb82ea4cb434587a4ffa4819f2a619ca1aa))

# [@antv/s2-v2.0.0-next.18](https://github.com/antvis/S2/compare/@antv/s2-v2.0.0-next.17...@antv/s2-v2.0.0-next.18) (2024-04-26)


### Bug Fixes

* 修复只有一行数据时异步导出数据为空 close [#2681](https://github.com/antvis/S2/issues/2681) ([#2682](https://github.com/antvis/S2/issues/2682)) ([fecd455](https://github.com/antvis/S2/commit/fecd455cf3b18a76cbae680ebb27ae7c1dcb66ec))
* 修复明细表自定义多级列头导出格式错误 close [#2664](https://github.com/antvis/S2/issues/2664) ([#2674](https://github.com/antvis/S2/issues/2674)) ([ae9add9](https://github.com/antvis/S2/commit/ae9add9c722877aced481340f798408a09ad98fb))

# [@antv/s2-v2.0.0-next.17](https://github.com/antvis/S2/compare/@antv/s2-v2.0.0-next.16...@antv/s2-v2.0.0-next.17) (2024-03-29)


### Bug Fixes

* **layout:** 修复行头收起全部时, 自定义列头被折叠的问题 closes [#2018](https://github.com/antvis/S2/issues/2018) [#2019](https://github.com/antvis/S2/issues/2019) ([#2639](https://github.com/antvis/S2/issues/2639)) ([dfc3225](https://github.com/antvis/S2/commit/dfc3225bbc431e8dcc30d0f42f7fb5389ec53c82))
* 修复紧凑模式下数值单元格错误的展示了省略号 ([#2632](https://github.com/antvis/S2/issues/2632)) ([2822471](https://github.com/antvis/S2/commit/2822471e9f73ba7b19292dc88a93b96d38afa471))
* 调整换行高度自适应和自定义高度的优先级 close [#2613](https://github.com/antvis/S2/issues/2613) ([#2630](https://github.com/antvis/S2/issues/2630)) ([4caabed](https://github.com/antvis/S2/commit/4caabed679b4959faf598e38efbf23b4802ae29b))


### Performance Improvements

* 优化 getDimensionValues 在大量 flatten 情况下的性能 ([#2640](https://github.com/antvis/S2/issues/2640)) ([e0348d7](https://github.com/antvis/S2/commit/e0348d77e6c0296151566214ad975f810732e5b8))

# [@antv/s2-v2.0.0-next.16](https://github.com/antvis/S2/compare/@antv/s2-v2.0.0-next.15...@antv/s2-v2.0.0-next.16) (2024-03-22)


### Bug Fixes

* **g:** 修复表格初次渲染时部分 icon 不展示 close [#2014](https://github.com/antvis/S2/issues/2014) ([#2606](https://github.com/antvis/S2/issues/2606)) ([3f9a176](https://github.com/antvis/S2/commit/3f9a176f75c46fa58e50d0fd70a652242f7b6df3))
* **interaction:** 修复在未选中状态下调整宽高, 错误的修改了相邻单元格的样式 ([#2605](https://github.com/antvis/S2/issues/2605)) ([8019788](https://github.com/antvis/S2/commit/8019788bf5b44414a2006f34c89f68fcb37207f0))
* 修复组件层事件回调无法获取单元格信息 closes [#2615](https://github.com/antvis/S2/issues/2615) [#2610](https://github.com/antvis/S2/issues/2610) ([#2616](https://github.com/antvis/S2/issues/2616)) ([3682d50](https://github.com/antvis/S2/commit/3682d501a71dbff3c91d7be86c852546f3e8f271))
* 修复角头和行头折叠展开 icon 的状态未同步以及展开异常的问题 close [#2607](https://github.com/antvis/S2/issues/2607) ([#2620](https://github.com/antvis/S2/issues/2620)) ([99829a6](https://github.com/antvis/S2/commit/99829a667c69394c0554ece841d6f6eb5c3f9b9e))

# [@antv/s2-v2.0.0-next.15](https://github.com/antvis/S2/compare/@antv/s2-v2.0.0-next.14...@antv/s2-v2.0.0-next.15) (2024-03-15)


### Bug Fixes

* 修复文本行数不一致时自动换行高度自适应失效 close [#2594](https://github.com/antvis/S2/issues/2594) ([#2598](https://github.com/antvis/S2/issues/2598)) ([fae5496](https://github.com/antvis/S2/commit/fae5496e503205f319e7bdc79240d31dacd4e850))
* 修复树状模式下开启分页, 行头展开收起后表格渲染异常 close [#2582](https://github.com/antvis/S2/issues/2582) ([#2590](https://github.com/antvis/S2/issues/2590)) ([6bab9f6](https://github.com/antvis/S2/commit/6bab9f630e26bdfb9513bb0d5fe0b4c0903f885b))

# [@antv/s2-v2.0.0-next.14](https://github.com/antvis/S2/compare/@antv/s2-v2.0.0-next.13...@antv/s2-v2.0.0-next.14) (2024-03-11)


### Features

* **interaction:** 支持批量调整行高列宽 close [#2574](https://github.com/antvis/S2/issues/2574) ([#2580](https://github.com/antvis/S2/issues/2580)) ([7d1be20](https://github.com/antvis/S2/commit/7d1be206442396371ab08a8224b2685aea2c025d))
* 增加角头和序号列的交互能力 ([#2571](https://github.com/antvis/S2/issues/2571)) ([fcb77cc](https://github.com/antvis/S2/commit/fcb77cce65ee56aeec189cf46d4226ef6a62a671))


### Performance Improvements

* 优化明细表滚动性能 close [#2548](https://github.com/antvis/S2/issues/2548), [#2402](https://github.com/antvis/S2/issues/2402) ([#2561](https://github.com/antvis/S2/issues/2561)) ([c2d5812](https://github.com/antvis/S2/commit/c2d581286253e09cf09ecba00673be738bf14cf9))

# [@antv/s2-v2.0.0-next.13](https://github.com/antvis/S2/compare/@antv/s2-v2.0.0-next.12...@antv/s2-v2.0.0-next.13) (2024-03-04)


### Bug Fixes

* **interaction:** 修复表格滚动后, 行列头部分单元格选中高亮效果丢失 close [#2503](https://github.com/antvis/S2/issues/2503) ([#2545](https://github.com/antvis/S2/issues/2545)) ([3a7803b](https://github.com/antvis/S2/commit/3a7803bd460fa332ff4d1a5b37f3192bf58bf866))
* **scroll:** 修复移动端滚动至边缘时抖动 ([#2556](https://github.com/antvis/S2/issues/2556)) ([3a2cd7c](https://github.com/antvis/S2/commit/3a2cd7c10bb59cc1eb9e23f366db3e65674eede1))
* 修复数值单元格内的自定义 icon 点击时会选中单元格的问题 close [#2333](https://github.com/antvis/S2/issues/2333) ([#2567](https://github.com/antvis/S2/issues/2567)) ([3d9f9aa](https://github.com/antvis/S2/commit/3d9f9aaba931b54226e4fd9e6004fc1bd9688791))
* 修复树状模式选中非叶子节点时不展示汇总信息的问题 ([48b7073](https://github.com/antvis/S2/commit/48b70737f32d58d75c356a4d37afeb74a917cf23))
* 修复父容器存在 transform 缩放时单元格刷选偏移 close [#2553](https://github.com/antvis/S2/issues/2553) ([#2565](https://github.com/antvis/S2/issues/2565)) ([715bbf4](https://github.com/antvis/S2/commit/715bbf41541ca6b5bee47c44695345bfaa0605ea))
* 修复编辑表双击失效 ([9edcb74](https://github.com/antvis/S2/commit/9edcb74576c8137481c375258fa9d9e310fafc7c))
* 修复编辑表的输入框未回填格式化后的数据 close [#2528](https://github.com/antvis/S2/issues/2528) ([#2549](https://github.com/antvis/S2/issues/2549)) ([95d67ca](https://github.com/antvis/S2/commit/95d67ca02b774aed426a179a16aa27f0c172356e))
* 修复自定义目录树同名节点展示异常 & 导出缺失角头 close [#2455](https://github.com/antvis/S2/issues/2455) ([#2551](https://github.com/antvis/S2/issues/2551)) ([6d315bf](https://github.com/antvis/S2/commit/6d315bff20e74f0ce5f1d286105eeba749ebabaf))
* 修复行列头数值复制时未使用格式化的值 & 优化单测 ([989366f](https://github.com/antvis/S2/commit/989366fc740b7c1367c4cf246a6e3eb80e4f3338))
* 修复趋势分析表复制错误 ([2e24418](https://github.com/antvis/S2/commit/2e24418cabebdbe1cd306cdf931c0c8fa7bae050))
* 角头选中列兼容树状模式和自定义行头场景 ([#2562](https://github.com/antvis/S2/issues/2562)) ([49ad04d](https://github.com/antvis/S2/commit/49ad04d4bcfdc932ac793bcf1d2866c01a694f9e))


### Features

* 明细表支持同名列渲染 closes [#2502](https://github.com/antvis/S2/issues/2502) [#2510](https://github.com/antvis/S2/issues/2510) ([#2568](https://github.com/antvis/S2/issues/2568)) ([e324c93](https://github.com/antvis/S2/commit/e324c934a310a3b514cc49f607d21434e095f1f7)), closes [#2519](https://github.com/antvis/S2/issues/2519)
* 移除已废弃的方法和逻辑 & 优化文档 ([#2566](https://github.com/antvis/S2/issues/2566)) ([de7c97b](https://github.com/antvis/S2/commit/de7c97b862e5b467fd335dd65f9dac5a95e4b621))

# [@antv/s2-v2.0.0-next.12](https://github.com/antvis/S2/compare/@antv/s2-v2.0.0-next.11...@antv/s2-v2.0.0-next.12) (2024-02-07)


### Bug Fixes

* 修复表格排序后, 编辑单元格后数据更新错误 ([e841d3d](https://github.com/antvis/S2/commit/e841d3db020afb418f0b2f9223271c329390b192))
* 回退生成 nodeId 时对 extra 字段的格式化 ([#2546](https://github.com/antvis/S2/issues/2546)) ([7d1cf9a](https://github.com/antvis/S2/commit/7d1cf9a68dd434b4843236d0e3570afc6ca22148))

# [@antv/s2-v2.0.0-next.11](https://github.com/antvis/S2/compare/@antv/s2-v2.0.0-next.10...@antv/s2-v2.0.0-next.11) (2024-02-05)


### Bug Fixes

* **interaction:** 修复隐藏列头配置更新时未覆盖上一次的配置 close [#2495](https://github.com/antvis/S2/issues/2495) ([#2527](https://github.com/antvis/S2/issues/2527)) ([ddc1283](https://github.com/antvis/S2/commit/ddc12830fa32f001ff7009a2bee8ce8624a1a187))
* **table-sheet:** 修复明细表配置自定义行高后展示异常 close [#2501](https://github.com/antvis/S2/issues/2501) ([#2521](https://github.com/antvis/S2/issues/2521)) ([47fdee3](https://github.com/antvis/S2/commit/47fdee3ebbae900ba815fba8c18e3a0566aa8f8c))
* 增加树状模式自定义宽度的容错 ([#2519](https://github.com/antvis/S2/issues/2519)) ([5f2c582](https://github.com/antvis/S2/commit/5f2c582378510e13cf34ccf92edb0a7d172ec07d))
* 自定义 icon 支持跨域 close [#2513](https://github.com/antvis/S2/issues/2513) ([#2524](https://github.com/antvis/S2/issues/2524)) ([cdf58ea](https://github.com/antvis/S2/commit/cdf58ea34e7342b5fdd169d43cccc63309b36103))


### Features

* 合并 master 到 next ([#2493](https://github.com/antvis/S2/issues/2493)) ([6da530d](https://github.com/antvis/S2/commit/6da530d0c5f53d283ddfaa4b3e510ca11c9bf83e)), closes [#2186](https://github.com/antvis/S2/issues/2186) [#2204](https://github.com/antvis/S2/issues/2204) [#2191](https://github.com/antvis/S2/issues/2191)


### Performance Improvements

* 优化多行文本渲染性能 ([#2478](https://github.com/antvis/S2/issues/2478)) ([adc5ef3](https://github.com/antvis/S2/commit/adc5ef32056ca0427942f5a118af938124821bcc))

# [@antv/s2-v2.0.0-next.10](https://github.com/antvis/S2/compare/@antv/s2-v2.0.0-next.9...@antv/s2-v2.0.0-next.10) (2023-12-12)

### Features

* 支持在单元格内渲染 G2 图表 ([#2437](https://github.com/antvis/S2/issues/2437)) ([497f941](https://github.com/antvis/S2/commit/497f9414b89fce01b60db9b6c2eb4292ffe69c1d))

# [@antv/s2-v2.0.0-next.9](https://github.com/antvis/S2/compare/@antv/s2-v2.0.0-next.8...@antv/s2-v2.0.0-next.9) (2023-11-22)

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

# [@antv/s2-v2.0.0-next.8](https://github.com/antvis/S2/compare/@antv/s2-v2.0.0-next.7...@antv/s2-v2.0.0-next.8) (2023-07-17)

### Bug Fixes

* 修复 meta name 同名时，hoverFocus 出错的问题 ([#2180](https://github.com/antvis/S2/issues/2180)) ([1480528](https://github.com/antvis/S2/commit/1480528c119f33fe40bc08e52e7abf87e9f9a797))
* 修复导出数据分隔符有误的问题 ([#2241](https://github.com/antvis/S2/issues/2241)) ([ec0a31c](https://github.com/antvis/S2/commit/ec0a31c4fc660b44176b074d4cc8c098dbe95eb4))

### Features

* 使用 requestIdleCallback 处理数据大量导出的情况 ([#2272](https://github.com/antvis/S2/issues/2272)) ([42a5551](https://github.com/antvis/S2/commit/42a55516dd369d9ab5579b52fbc9900b0ad81858))
* 同步复制支持自定义 transformer  ([#2201](https://github.com/antvis/S2/issues/2201)) ([9003767](https://github.com/antvis/S2/commit/9003767d584248b9d122f299326fd14753961883))
* 增加暗黑主题 ([#2130](https://github.com/antvis/S2/issues/2130)) ([51dbdcf](https://github.com/antvis/S2/commit/51dbdcf564b387a3fd1809a71016f3a91eebde38))
* 完善复制和导出在格式化后，总计、小计对应数值没有格式化的问题 ([#2237](https://github.com/antvis/S2/issues/2237)) ([abc0dbb](https://github.com/antvis/S2/commit/abc0dbb1544d9a4ef133e6a2c7d2d09ac8f35b48))
* 文本和图标的条件格式支持主题配置 ([#2267](https://github.com/antvis/S2/issues/2267)) ([c332c68](https://github.com/antvis/S2/commit/c332c687dfb7be1d07b79b44934f78c1947cc466))
* 条件格式 mapping 增加第三个参数获取单元格实例 ([#2242](https://github.com/antvis/S2/issues/2242)) ([aae427d](https://github.com/antvis/S2/commit/aae427dfe6a87cae577ce2449fd6058d358971f9))
* 行列头兼容 condition icon 和 action icons ([#2161](https://github.com/antvis/S2/issues/2161)) ([1df4286](https://github.com/antvis/S2/commit/1df42860f6a12d3cb182ba7633c4984a04e62890))
* 适配 g5.0 异步渲染 ([#2251](https://github.com/antvis/S2/issues/2251)) ([069d03d](https://github.com/antvis/S2/commit/069d03d299429c2ffab3e20d56ecd6bb30119ffd))

# [@antv/s2-v2.0.0-next.7](https://github.com/antvis/S2/compare/@antv/s2-v2.0.0-next.6...@antv/s2-v2.0.0-next.7) (2023-04-28)

### Bug Fixes

* canvas mouseout 判断错误 ([#2181](https://github.com/antvis/S2/issues/2181)) ([16c0b82](https://github.com/antvis/S2/commit/16c0b824aef16d109e8db8d2fe6b3a25a413dcfa))
* fix lint error ([f3eba69](https://github.com/antvis/S2/commit/f3eba69a17f2febd7e3adc1ae0c2069295ba0ae6))
* **interaction:** 修复从下往上滚动刷选速度缓慢 & 优化滚动刷选蒙层显示 ([#2119](https://github.com/antvis/S2/issues/2119)) ([8131d80](https://github.com/antvis/S2/commit/8131d8034ce255e05273c1792ecb11cd3e5aece2))
* **interaction:** 修复行头滚动刷选范围判断错误 ([#2101](https://github.com/antvis/S2/issues/2101)) ([8e38fb0](https://github.com/antvis/S2/commit/8e38fb0df6123360d2bd835cf80bcf72898a80b9))
* **layout:** 修复自定义列头采样错误导致行角头不显示 close [#2117](https://github.com/antvis/S2/issues/2117) ([#2175](https://github.com/antvis/S2/issues/2175)) ([2266272](https://github.com/antvis/S2/commit/22662721739b45fbe5c00c1157ad00071d8f5f0d))
* **tooltip:** 修复特定配置下点击 tooltip 内容后 tooltip 关闭 close [#2170](https://github.com/antvis/S2/issues/2170) ([#2172](https://github.com/antvis/S2/issues/2172)) ([6219e57](https://github.com/antvis/S2/commit/6219e579364cfb7ac3a8b3db4ae01c5672d7f2d4))
* 修复 cornerText 配置对树状模式的适配 ([#2167](https://github.com/antvis/S2/issues/2167)) ([e9efcea](https://github.com/antvis/S2/commit/e9efcea944f5d0793d4a1250362e6b6f6b492c52))
* 修复总计小计 linkField 样式问题 ([#2169](https://github.com/antvis/S2/issues/2169)) ([4450278](https://github.com/antvis/S2/commit/4450278d82888c117e5bd9d31874b88ecdb33d99))
* 修改 DataCell 类 drawLinkFieldShape 方法名为 drawLinkFieldShapeOwn ([d5e14b2](https://github.com/antvis/S2/commit/d5e14b25abba5bfaf74dddb17d9f5b44c74bc29b))
* 多指标行头总计节点宽度计算错误 ([#2165](https://github.com/antvis/S2/issues/2165)) ([08ef330](https://github.com/antvis/S2/commit/08ef330a02a1fbf11f49090f4fd7f5d2b0cc1093))
* 微应用环境识别 mouseEvent 失效 ([bddbe34](https://github.com/antvis/S2/commit/bddbe34104355ac0087bc9f72377889a8f444d7a)), closes [#2162](https://github.com/antvis/S2/issues/2162)
* 统一风格、删除冗余代码 ([7b4ef0e](https://github.com/antvis/S2/commit/7b4ef0edf72e059b427c54e6ea881c4c8e347aed))
* 行头过宽且不冻结时滚动条渲染错误 ([#2173](https://github.com/antvis/S2/issues/2173)) ([ab79ea0](https://github.com/antvis/S2/commit/ab79ea0664046bc6479a717d7b3b0ee7efe05b31))
* 避免 s2 实例被污染 ([8c44a85](https://github.com/antvis/S2/commit/8c44a85a678eadaab3fb2a66b5b02a123f74c9bb))

### Features

* icon 支持更新 name 与 fill ([#2138](https://github.com/antvis/S2/issues/2138)) ([d000aea](https://github.com/antvis/S2/commit/d000aeac332676cfa15d9986ec7f4be948c565d0))
* **interaction:** 点击角头后支持选中所对应那一列的行头 close [#2073](https://github.com/antvis/S2/issues/2073) ([#2081](https://github.com/antvis/S2/issues/2081)) ([ad2b5d8](https://github.com/antvis/S2/commit/ad2b5d87edf4c529d7c9a5e1348e893e14547ef3))
* **interaction:** 行头支持滚动刷选 ([#2087](https://github.com/antvis/S2/issues/2087)) ([65c3f3b](https://github.com/antvis/S2/commit/65c3f3b6a37709c0fa684b0f5717d3b349251e48))
* 修改文档、添加用例演示、修改方法名 drawLinkFieldShapLogic -> drawLinkField ([7f2bd69](https://github.com/antvis/S2/commit/7f2bd690bd703b8e4d678c03b9fc79db30848ca3))
* 在 shape 中添加文本的原始值 ([#2109](https://github.com/antvis/S2/issues/2109)) ([4d81e72](https://github.com/antvis/S2/commit/4d81e72440d797fd7a06179794c342f009fc39c3))
* 增加 dataCell 下划线测试用例及 demo ([a5efe17](https://github.com/antvis/S2/commit/a5efe17bda06cc8eba633cbea9c56ceb8b8c703e))
* 增加自定义 merged-cell ([534cc15](https://github.com/antvis/S2/commit/534cc15da9f766f95be3c622e65e45d8796ff020))
* 复制支持自定义 transformer ([#2090](https://github.com/antvis/S2/issues/2090)) ([250eecd](https://github.com/antvis/S2/commit/250eecd32ed4f48b95ed7c4e480fa3c75d4bb5d7))
* 提取跳转链接下划线 公共逻辑 到 BaseCell 类 ([34dbbb3](https://github.com/antvis/S2/commit/34dbbb3bdf028cb96508dcead724d9ac9bcc1ab9))
* 数据单元格 DataCell 类中增加链接跳转渲染 ([bb5a964](https://github.com/antvis/S2/commit/bb5a964787a80843515b4d552adb3fdb59393e3d))

# [@antv/s2-v2.0.0-next.6](https://github.com/antvis/S2/compare/@antv/s2-v2.0.0-next.5...@antv/s2-v2.0.0-next.6) (2023-04-23)

### Bug Fixes

* 传入 g 的 supportsCSSTransform 改为 supportsCSSTransform ([7531aab](https://github.com/antvis/S2/commit/7531aab7fd12a35533d95267a818dfd3f821ece0))

### Features

* 统一导出和复制逻辑，优化导出和复制性能 ([#2152](https://github.com/antvis/S2/issues/2152)) ([df88455](https://github.com/antvis/S2/commit/df884557756e4374e95687cf4c99d575bc2cb6fc))

# [@antv/s2-v2.0.0-next.5](https://github.com/antvis/S2/compare/@antv/s2-v2.0.0-next.4...@antv/s2-v2.0.0-next.5) (2023-02-22)

### Bug Fixes

* cornerheader 无列头时不渲染序号列 ([abf5e68](https://github.com/antvis/S2/commit/abf5e6821209665a6c9aea9050e069eaa4fe8b46))
* **layout:** 修复存在列总计但不存在列小计时，隐藏其兄弟节点后单元格坐标偏移 close [#1993](https://github.com/antvis/S2/issues/1993) ([#2047](https://github.com/antvis/S2/issues/2047)) ([2ae663e](https://github.com/antvis/S2/commit/2ae663e1c46a3c8cb04b79d357fc033314f4cf77))
* **layout:** 修复存在多列头多数值且数值置于行头时，列总计单元格高度不对 close [#1715](https://github.com/antvis/S2/issues/1715) [#2049](https://github.com/antvis/S2/issues/2049) ([#2051](https://github.com/antvis/S2/issues/2051)) ([a415f46](https://github.com/antvis/S2/commit/a415f465e8fa355a5b68d556f6fa645e3a72b5b7))
* **layout:** 修复无列头时行头对应的角头不显示 close [#1929](https://github.com/antvis/S2/issues/1929) ([#2026](https://github.com/antvis/S2/issues/2026)) ([c073578](https://github.com/antvis/S2/commit/c073578dc008ef83a2877041830be18f827c7341))
* **layout:** 修复树状模式下无列头时行头对应的角头不显示 ([#2041](https://github.com/antvis/S2/issues/2041)) ([1b49667](https://github.com/antvis/S2/commit/1b49667378b3f54bc277ab8255db757f844a0107))
* 修复 2k 显示器切换到 MacBook 后表格渲染模糊 close [#2072](https://github.com/antvis/S2/issues/2072) ([#2074](https://github.com/antvis/S2/issues/2074)) ([a98d3fd](https://github.com/antvis/S2/commit/a98d3fd20ff5e3f817f1ac269504719ce7967f04))
* 修复单元格宽高为 0 时的无意义渲染 ([#2024](https://github.com/antvis/S2/issues/2024)) ([9f952fd](https://github.com/antvis/S2/commit/9f952fd4bfd280b657b589e5912399f89bb1f0ea))
* 修复合并 master 的 copy 相关单测 ([8587137](https://github.com/antvis/S2/commit/8587137703b89152f67335908e47e04ef6d41997))
* 自定义 svg 支持无后缀的在线链接 ([#2065](https://github.com/antvis/S2/issues/2065)) ([4602b42](https://github.com/antvis/S2/commit/4602b42406689706f91e634d0453335eff8dcada))

### Features

* tooltip summaries 返回原始数据 ([#2044](https://github.com/antvis/S2/issues/2044)) ([f8efdd9](https://github.com/antvis/S2/commit/f8efdd997b8e76b4aab7615fb16af644a42d3d8e))
* 增加自定义行头最大固定宽度的功能 ([#2069](https://github.com/antvis/S2/issues/2069)) ([4db301d](https://github.com/antvis/S2/commit/4db301db0971fca40e65d43c417ca4a36db66493))
* 新增链接跳转配置 ([5e08055](https://github.com/antvis/S2/commit/5e08055b52a125e75cbc41bb748d247ef25ba016))
* 更新英语文档，使用依赖包进行翻译 ([#2067](https://github.com/antvis/S2/issues/2067)) ([f271684](https://github.com/antvis/S2/commit/f2716847ec0d06a0867eabe16a7f5e2e3a9263ee))

# [@antv/s2-v1.41.1](https://github.com/antvis/S2/compare/@antv/s2-v1.41.0...@antv/s2-v1.41.1) (2023-02-17)

### Bug Fixes

* 修复 2k 显示器切换到 MacBook 后表格渲染模糊 close [#2072](https://github.com/antvis/S2/issues/2072) ([#2074](https://github.com/antvis/S2/issues/2074)) ([a98d3fd](https://github.com/antvis/S2/commit/a98d3fd20ff5e3f817f1ac269504719ce7967f04))
* 自定义 svg 支持无后缀的在线链接 ([#2065](https://github.com/antvis/S2/issues/2065)) ([4602b42](https://github.com/antvis/S2/commit/4602b42406689706f91e634d0453335eff8dcada))

# [@antv/s2-v1.41.0](https://github.com/antvis/S2/compare/@antv/s2-v1.40.0...@antv/s2-v1.41.0) (2023-01-16)

### Bug Fixes

* **layout:** 修复存在列总计但不存在列小计时，隐藏其兄弟节点后单元格坐标偏移 close [#1993](https://github.com/antvis/S2/issues/1993) ([#2047](https://github.com/antvis/S2/issues/2047)) ([2ae663e](https://github.com/antvis/S2/commit/2ae663e1c46a3c8cb04b79d357fc033314f4cf77))
* **layout:** 修复存在多列头多数值且数值置于行头时，列总计单元格高度不对 close [#1715](https://github.com/antvis/S2/issues/1715) [#2049](https://github.com/antvis/S2/issues/2049) ([#2051](https://github.com/antvis/S2/issues/2051)) ([a415f46](https://github.com/antvis/S2/commit/a415f465e8fa355a5b68d556f6fa645e3a72b5b7))
* **layout:** 修复无列头时行头对应的角头不显示 close [#1929](https://github.com/antvis/S2/issues/1929) ([#2026](https://github.com/antvis/S2/issues/2026)) ([c073578](https://github.com/antvis/S2/commit/c073578dc008ef83a2877041830be18f827c7341))
* **layout:** 修复树状模式下无列头时行头对应的角头不显示 ([#2041](https://github.com/antvis/S2/issues/2041)) ([1b49667](https://github.com/antvis/S2/commit/1b49667378b3f54bc277ab8255db757f844a0107))

### Features

* tooltip summaries 返回原始数据 ([#2044](https://github.com/antvis/S2/issues/2044)) ([f8efdd9](https://github.com/antvis/S2/commit/f8efdd997b8e76b4aab7615fb16af644a42d3d8e))

# [@antv/s2-v1.40.0](https://github.com/antvis/S2/compare/@antv/s2-v1.39.1...@antv/s2-v1.40.0) (2023-01-03)

### Bug Fixes

* bullet 占位符绘制错误 ([#2022](https://github.com/antvis/S2/issues/2022)) ([c95c446](https://github.com/antvis/S2/commit/c95c446219216b190bf6af632104edd125a82ff3))
* 修复单元格宽高为 0 时的无意义渲染 ([#2024](https://github.com/antvis/S2/issues/2024)) ([9f952fd](https://github.com/antvis/S2/commit/9f952fd4bfd280b657b589e5912399f89bb1f0ea))
* 列头 label 存在数组，复制导出列头层级补齐错误 ([#1990](https://github.com/antvis/S2/issues/1990)) ([ec62409](https://github.com/antvis/S2/commit/ec62409b688c5dd5e39a93f5b292d909496ed830))

### Features

* selected cell highlight ([#1878](https://github.com/antvis/S2/issues/1878)) ([3e11a37](https://github.com/antvis/S2/commit/3e11a37bf94f758379ba2819ec5d8b3251708814))
* 子弹图为空时使用 placeholder 占位 ([#2010](https://github.com/antvis/S2/issues/2010)) ([8d28254](https://github.com/antvis/S2/commit/8d28254aa9aa29d9b2a9e24efb21f185cb5ffe4c))

# [@antv/s2-v1.39.1](https://github.com/antvis/S2/compare/@antv/s2-v1.39.0...@antv/s2-v1.39.1) (2022-12-20)

### Bug Fixes

* bullet 占位符绘制错误 ([#2022](https://github.com/antvis/S2/issues/2022)) ([c95c446](https://github.com/antvis/S2/commit/c95c446219216b190bf6af632104edd125a82ff3))
* gui icon 加载完成后，增加检测步骤，避免无意义的渲染 warning ([#1997](https://github.com/antvis/S2/issues/1997)) ([6f13aa4](https://github.com/antvis/S2/commit/6f13aa43d8910f9ed83d59a9c958b26a0eb163d6))
* **interaction:** 修复自定义列头时无法调整第一列的叶子节点高度 close [#1979](https://github.com/antvis/S2/issues/1979) ([#2038](https://github.com/antvis/S2/issues/2038)) ([a632ab1](https://github.com/antvis/S2/commit/a632ab19193b19ab80f456ab3ce19740dce0e52b))
* 修复 enableCopy 和 hideMeasureColumn 都开启为 true 时，复制报错问题 ([#1984](https://github.com/antvis/S2/issues/1984)) ([528d2b6](https://github.com/antvis/S2/commit/528d2b6b6b912f790449aaef015fc27d2e0e33c9))
* 列头 label 存在数组，复制导出列头层级补齐错误 ([#1990](https://github.com/antvis/S2/issues/1990)) ([ec62409](https://github.com/antvis/S2/commit/ec62409b688c5dd5e39a93f5b292d909496ed830))
* 明细表 linkField 失效 ([#2007](https://github.com/antvis/S2/issues/2007)) ([122552b](https://github.com/antvis/S2/commit/122552bdd25aa538cfd38a6210e9979698c13188))
* 明细表紧凑模式宽度计算错误 ([#2006](https://github.com/antvis/S2/issues/2006)) ([89f5c9e](https://github.com/antvis/S2/commit/89f5c9eb7719834ce9a55d340bf04415639cc277))

### Code Refactoring

* 调整 s2Options API 命名 ([#2015](https://github.com/antvis/S2/issues/2015)) ([e39b32f](https://github.com/antvis/S2/commit/e39b32f99befdf53569fab633087bb56edfc8720))

### Features

* selected cell highlight ([#1878](https://github.com/antvis/S2/issues/1878)) ([3e11a37](https://github.com/antvis/S2/commit/3e11a37bf94f758379ba2819ec5d8b3251708814))
* 单元格宽高配置增强 close [#1895](https://github.com/antvis/S2/issues/1895) ([#1981](https://github.com/antvis/S2/issues/1981)) ([ec6736f](https://github.com/antvis/S2/commit/ec6736f108801e1129c4d3fd29d13d1fbff2a1d2))
* 增加 linkFields 参数传入类型 ([#1992](https://github.com/antvis/S2/issues/1992)) ([66bce2a](https://github.com/antvis/S2/commit/66bce2ae77635b530058f56b0545bd5558c119e1))
* 子弹图为空时使用 placeholder 占位 ([#2010](https://github.com/antvis/S2/issues/2010)) ([8d28254](https://github.com/antvis/S2/commit/8d28254aa9aa29d9b2a9e24efb21f185cb5ffe4c))
* 实现树状模式下可复制 ([#1986](https://github.com/antvis/S2/issues/1986)) ([96ccb1e](https://github.com/antvis/S2/commit/96ccb1ee14908fc1daf82d1eccb3bd852e642f7d))
* 折叠展开重构 & 简化行头 tree 相关配置 ([#2030](https://github.com/antvis/S2/issues/2030)) ([0f3ea3b](https://github.com/antvis/S2/commit/0f3ea3b5c668137bc2fcb53bd186a41b34140e25))
* 暴露 afterRealCellRender，这样能够更灵活的使用 datacell ([#1970](https://github.com/antvis/S2/issues/1970)) ([66c5ab9](https://github.com/antvis/S2/commit/66c5ab9992c51b475be8acaf9a198d49f3114a49))
* 添加字段标记中，定制柱状图的长度的功能 （filedValue） ([#2002](https://github.com/antvis/S2/issues/2002)) ([457e5e7](https://github.com/antvis/S2/commit/457e5e7989ce460e445f46925eaee79b49f56615))
* 适配链接跳转的判断方式 ([#1983](https://github.com/antvis/S2/issues/1983)) ([2a26259](https://github.com/antvis/S2/commit/2a2625971bcefd119d2e2a280608d1acf56b5d32))

### BREAKING CHANGES

* s2Options.tooltip 和 s2Options.style API 命名更改，移除 trend 操作项

* refactor: tree 相关配置移动到 rowCell 下

* refactor: hideMeasureColumn => hideValue

* refactor: 冻结相关配置收拢到 forzen 命名空间下

* test: 修复测试

# [@antv/s2-v2.0.0-next.3](https://github.com/antvis/S2/compare/@antv/s2-v2.0.0-next.2...@antv/s2-v2.0.0-next.3) (2022-12-16)

### Bug Fixes

# [@antv/s2-v1.40.0](https://github.com/antvis/S2/compare/@antv/s2-v1.39.1...@antv/s2-v1.40.0) (2023-01-03)

### Bug Fixes

* bullet 占位符绘制错误 ([#2022](https://github.com/antvis/S2/issues/2022)) ([c95c446](https://github.com/antvis/S2/commit/c95c446219216b190bf6af632104edd125a82ff3))
* 修复单元格宽高为 0 时的无意义渲染 ([#2024](https://github.com/antvis/S2/issues/2024)) ([9f952fd](https://github.com/antvis/S2/commit/9f952fd4bfd280b657b589e5912399f89bb1f0ea))
* 列头 label 存在数组，复制导出列头层级补齐错误 ([#1990](https://github.com/antvis/S2/issues/1990)) ([ec62409](https://github.com/antvis/S2/commit/ec62409b688c5dd5e39a93f5b292d909496ed830))

### Features

* selected cell highlight ([#1878](https://github.com/antvis/S2/issues/1878)) ([3e11a37](https://github.com/antvis/S2/commit/3e11a37bf94f758379ba2819ec5d8b3251708814))
* 子弹图为空时使用 placeholder 占位 ([#2010](https://github.com/antvis/S2/issues/2010)) ([8d28254](https://github.com/antvis/S2/commit/8d28254aa9aa29d9b2a9e24efb21f185cb5ffe4c))

# [@antv/s2-v1.39.1](https://github.com/antvis/S2/compare/@antv/s2-v1.39.0...@antv/s2-v1.39.1) (2022-12-20)

### Bug Fixes

* 明细表 linkField 失效 ([#2007](https://github.com/antvis/S2/issues/2007)) ([122552b](https://github.com/antvis/S2/commit/122552bdd25aa538cfd38a6210e9979698c13188))
* 明细表紧凑模式宽度计算错误 ([#2006](https://github.com/antvis/S2/issues/2006)) ([89f5c9e](https://github.com/antvis/S2/commit/89f5c9eb7719834ce9a55d340bf04415639cc277))

# [@antv/s2-v1.39.0](https://github.com/antvis/S2/compare/@antv/s2-v1.38.0...@antv/s2-v1.39.0) (2022-12-19)

### Bug Fixes

* gui icon 加载完成后，增加检测步骤，避免无意义的渲染 warning ([#1997](https://github.com/antvis/S2/issues/1997)) ([6f13aa4](https://github.com/antvis/S2/commit/6f13aa43d8910f9ed83d59a9c958b26a0eb163d6))

### Features

* 添加字段标记中，定制柱状图的长度的功能 （filedValue） ([#2002](https://github.com/antvis/S2/issues/2002)) ([457e5e7](https://github.com/antvis/S2/commit/457e5e7989ce460e445f46925eaee79b49f56615))

# [@antv/s2-v1.38.0](https://github.com/antvis/S2/compare/@antv/s2-v1.37.0...@antv/s2-v1.38.0) (2022-12-16)

### Features

* 增加 linkFields 参数传入类型 ([#1992](https://github.com/antvis/S2/issues/1992)) ([66bce2a](https://github.com/antvis/S2/commit/66bce2ae77635b530058f56b0545bd5558c119e1))
* 新增链接跳转配置 ([5e08055](https://github.com/antvis/S2/commit/5e08055b52a125e75cbc41bb748d247ef25ba016))

# [@antv/s2-v1.37.0](https://github.com/antvis/S2/compare/@antv/s2-v1.36.0...@antv/s2-v1.37.0) (2022-12-09)

### Bug Fixes

* **tooltip:** 修复自定义操作菜单传入自定义 ReactNode 不显示 ([#1969](https://github.com/antvis/S2/issues/1969)) ([3eff993](https://github.com/antvis/S2/commit/3eff9932438cc95093686c03510b57648ff44391))
* 修复 enableCopy 和 hideMeasureColumn 都开启为 true 时，复制报错问题 ([#1984](https://github.com/antvis/S2/issues/1984)) ([528d2b6](https://github.com/antvis/S2/commit/528d2b6b6b912f790449aaef015fc27d2e0e33c9))

### Features

* 实现树状模式下可复制 ([#1986](https://github.com/antvis/S2/issues/1986)) ([96ccb1e](https://github.com/antvis/S2/commit/96ccb1ee14908fc1daf82d1eccb3bd852e642f7d))
* 暴露 afterRealCellRender，这样能够更灵活的使用 datacell ([#1970](https://github.com/antvis/S2/issues/1970)) ([66c5ab9](https://github.com/antvis/S2/commit/66c5ab9992c51b475be8acaf9a198d49f3114a49))
* 适配链接跳转的判断方式 ([#1983](https://github.com/antvis/S2/issues/1983)) ([2a26259](https://github.com/antvis/S2/commit/2a2625971bcefd119d2e2a280608d1acf56b5d32))

# [@antv/s2-v1.36.0](https://github.com/antvis/S2/compare/@antv/s2-v1.35.1...@antv/s2-v1.36.0) (2022-12-02)

* 暂时修复 g 版本冲突问题 ([#2003](https://github.com/antvis/S2/issues/2003)) ([1de7ec2](https://github.com/antvis/S2/commit/1de7ec215bc96c28e7493c8a32fe1764fd08cb2d))

# [@antv/s2-v2.0.0-next.2](https://github.com/antvis/S2/compare/@antv/s2-v2.0.0-next.1...@antv/s2-v2.0.0-next.2) (2022-12-07)

### Bug Fixes

* **dataset:** 修复数据 undefined 情况 ([#1954](https://github.com/antvis/S2/issues/1954)) ([8815d86](https://github.com/antvis/S2/commit/8815d865f839c9b5d4083a804378492be42a5673))
* **facet:** 调整 layoutCoordinate 执行顺序 ([#1953](https://github.com/antvis/S2/issues/1953)) ([dba62d7](https://github.com/antvis/S2/commit/dba62d720427f99109ef3fe4fb3a121631f4f256))
* **interaction:** 修复趋势分析表选中高亮效果无效 close [#1960](https://github.com/antvis/S2/issues/1960) ([#1961](https://github.com/antvis/S2/issues/1961)) ([5140b60](https://github.com/antvis/S2/commit/5140b6060d03b0290ddb4b314e7892520038f369))
* **tooltip:** 修复自定义操作菜单传入自定义 ReactNode 不显示 ([#1969](https://github.com/antvis/S2/issues/1969)) ([3eff993](https://github.com/antvis/S2/commit/3eff9932438cc95093686c03510b57648ff44391))
* 修复所有 lint 错误 ([9b62503](https://github.com/antvis/S2/commit/9b62503ebdf1ef9aa94470c8d18be99122d0c2dc))
* 增加 style 配置为空时的容错 ([#1967](https://github.com/antvis/S2/issues/1967)) ([9250487](https://github.com/antvis/S2/commit/92504874e5f925a2fc2a640194f676c2bd32b55e))
* 角头序号单元格 meta 无 spreadsheet 实例 ([#1950](https://github.com/antvis/S2/issues/1950)) ([e3ad987](https://github.com/antvis/S2/commit/e3ad987ba4136444fcc28246d93b892896ac8f50))

### Features

* **header:** 去除 antd PageHeader 组件依赖 & Header 组件重构 close [#1981](https://github.com/antvis/S2/issues/1981) ([#1957](https://github.com/antvis/S2/issues/1957)) ([a3addd7](https://github.com/antvis/S2/commit/a3addd7494a2002e40c0cd00871bee47bedefb17))
* **scroll:** 增加滚动条最小尺寸配置 close [#1892](https://github.com/antvis/S2/issues/1892) ([#1948](https://github.com/antvis/S2/issues/1948)) ([7040ac0](https://github.com/antvis/S2/commit/7040ac08acc0dffff60fb20e2a19ff6daeb4625e))
* shift+按键支持横向滚动 ([#1956](https://github.com/antvis/S2/issues/1956)) ([d40a638](https://github.com/antvis/S2/commit/d40a638a0786fe3df1cb5f6052c4e54cbf137060))
* 明细表模式的"字段标记"，mapping 中第二个参数，返回整行信息 ([#1947](https://github.com/antvis/S2/issues/1947)) ([4958b88](https://github.com/antvis/S2/commit/4958b88ff6d0ee80bf65194f06239220d08dbf40))

# [@antv/s2-v2.0.0-next.1](https://github.com/antvis/S2/compare/@antv/s2-v1.35.0...@antv/s2-v2.0.0-next.1) (2022-11-25)

### Bug Fixes

* 重构绘制盒模型，修复边框偏移问题 ([#1854](https://github.com/antvis/S2/issues/1854)) ([f7e0858](https://github.com/antvis/S2/commit/f7e0858a937ea557532a7fff948e9af3b6a1fdff))

# [@antv/s2-v1.35.0](https://github.com/antvis/S2/compare/@antv/s2-v1.34.1...@antv/s2-v1.35.0) (2022-11-21)

### BREAKING CHANGES

* G5.0, 透视表自定义行列头，数据流重构
* G5.0, 行列头自定义，数据流
* 2.0-next
* 2.0
* <https://github.com/antvis/S2/discussions/1933>

# [@antv/s2-v1.35.0](https://github.com/antvis/S2/compare/@antv/s2-v1.34.1...@antv/s2-v1.35.0) (2022-11-21)

=======

# [@antv/s2-v1.35.1](https://github.com/antvis/S2/compare/@antv/s2-v1.35.0...@antv/s2-v1.35.1) (2022-11-28)

### Bug Fixes

### Bug Fixes

* **interaction:** 修复多列头多指标场景下隐藏列头错误 close [#1721](https://github.com/antvis/S2/issues/1721) ([#1905](https://github.com/antvis/S2/issues/1905)) ([fb8838f](https://github.com/antvis/S2/commit/fb8838f18ee9e966da76f7a038149351143e3769))
* 修复 sortedDimensionValues 过滤不正确而导致的排序错乱的问题 ([#1908](https://github.com/antvis/S2/issues/1908)) ([bfe02cb](https://github.com/antvis/S2/commit/bfe02cbdae11793e8fcdc267f19ad1572354bc28))
* 修复圈选偏移问题 ([#1883](https://github.com/antvis/S2/issues/1883)) ([fbffdcf](https://github.com/antvis/S2/commit/fbffdcfa1c57e4e66016826c43cadf8f066c0ee4))

# [@antv/s2-v1.34.0](https://github.com/antvis/S2/compare/@antv/s2-v1.33.1...@antv/s2-v1.34.0) (2022-11-11)

### Bug Fixes

* 修复行头链接跳转时，获取行数据的问题 ([#1888](https://github.com/antvis/S2/issues/1888)) ([bee41fd](https://github.com/antvis/S2/commit/bee41fdb50fe4d116e738de53295e818a729a9cb))

### Features

* **interaction:** 角头有省略号时 hover 后显示 tooltip ([#1889](https://github.com/antvis/S2/issues/1889)) ([1bd307a](https://github.com/antvis/S2/commit/1bd307ae913c82fd241057366530d16b51abfe69))
* 新增 measureTextHeight 用于测量文字高度 ([#1880](https://github.com/antvis/S2/issues/1880)) ([3da1bd5](https://github.com/antvis/S2/commit/3da1bd52db39ff7b116a4c6faa56c415f5a5ea5c))

# [@antv/s2-v1.33.1](https://github.com/antvis/S2/compare/@antv/s2-v1.33.0...@antv/s2-v1.33.1) (2022-11-04)

### Bug Fixes

* 修复 mergedCell 缺失 theme 导致的报错 ([#1874](https://github.com/antvis/S2/issues/1874)) ([9da12a9](https://github.com/antvis/S2/commit/9da12a93b48f0f12903caba92d362d3174e3fe81))

# [@antv/s2-v1.33.0](https://github.com/antvis/S2/compare/@antv/s2-v1.32.0...@antv/s2-v1.33.0) (2022-10-24)

### Bug Fixes

* bold 字体对应数字字重不正确 ([#1841](https://github.com/antvis/S2/issues/1841)) ([abe1607](https://github.com/antvis/S2/commit/abe16074ae7924190e2aa4c2f1bf64bad0151328))
* customFilter 执行时不再执行 defaultFilter ([#1814](https://github.com/antvis/S2/issues/1814)) ([21710b2](https://github.com/antvis/S2/commit/21710b260dc41039e832d48d673a63dc21c60454))
* **interaction:** 修复滚动刷选 onDataCellBrushSelection 未透出正确的单元格 close [#1817](https://github.com/antvis/S2/issues/1817) ([#1825](https://github.com/antvis/S2/issues/1825)) ([5866ba1](https://github.com/antvis/S2/commit/5866ba1d33daa144a18f2771f77785c524fe67c3))
* **theme:** 获取标准色时增加容错和兜底 ([#1847](https://github.com/antvis/S2/issues/1847)) ([6e61b0c](https://github.com/antvis/S2/commit/6e61b0c69aee3389397b433bc63c227f42376f1a))
* 紧凑模式下节点宽度计算错误 ([#1834](https://github.com/antvis/S2/issues/1834)) ([7f2f2b3](https://github.com/antvis/S2/commit/7f2f2b3b699eb8dbc8b43ce12f4b3a32888b17e5))
* 自适应模式节点宽度计算错误 ([#1839](https://github.com/antvis/S2/issues/1839)) ([7bdceb2](https://github.com/antvis/S2/commit/7bdceb251f1d418025e99209145b67a9bf2ef786))

### Features

* 在背景字段标记中添加 文本智能反色 ([#1842](https://github.com/antvis/S2/issues/1842)) ([80cbf20](https://github.com/antvis/S2/commit/80cbf2060ac530e0edeae1f7adef7a56303f8723))

### Reverts

* Revert "chore(release): 🔖@antv/s2@1.32.0 @antv/s2-react@1.29.0 @antv/s2-vue@1…" (#1846) ([7b0bcea](https://github.com/antvis/S2/commit/7b0bceab42acf8dae4a437f86148207848502c8b)), closes [#1846](https://github.com/antvis/S2/issues/1846) [#1844](https://github.com/antvis/S2/issues/1844)

# [@antv/s2-v1.32.0](https://github.com/antvis/S2/compare/@antv/s2-v1.31.1...@antv/s2-v1.32.0) (2022-10-14)

### Bug Fixes

* data-cell 文字无法交互 ([#1822](https://github.com/antvis/S2/issues/1822)) ([1ede665](https://github.com/antvis/S2/commit/1ede6657598fd58f4360f054418a579684f9b116))
* **tooltip:** tooltip 显示时不应该强制清空 dom ([#1816](https://github.com/antvis/S2/issues/1816)) ([98c95d8](https://github.com/antvis/S2/commit/98c95d8ab11df26a9618921d36bb9ce732495fcd))
* 带行头复制报错修复 ([#1812](https://github.com/antvis/S2/issues/1812)) ([0558ed3](https://github.com/antvis/S2/commit/0558ed35580f54abe01f9637a4f1ad4745cf0328))

### Features

* ✨ 表头单元格支持字段标记 ([#1809](https://github.com/antvis/S2/issues/1809)) ([307c5f9](https://github.com/antvis/S2/commit/307c5f9227351e57dca3f1d061ddca6be52c734d))

# [@antv/s2-v1.31.1](https://github.com/antvis/S2/compare/@antv/s2-v1.31.0...@antv/s2-v1.31.1) (2022-10-14)

### Bug Fixes

* data-cell 文字无法交互 ([89faca0](https://github.com/antvis/S2/commit/89faca03f5a5282ae4d67114d6f7daed8f59660a))

# [@antv/s2-v1.31.0](https://github.com/antvis/S2/compare/@antv/s2-v1.30.0...@antv/s2-v1.31.0) (2022-10-02)

### Bug Fixes

* clipbardItem 不存在时不报错 ([#1791](https://github.com/antvis/S2/issues/1791)) ([e7261ff](https://github.com/antvis/S2/commit/e7261ff1e8b44019fe75204a2adccade505c16d5))
* **scroll:** 修复点击滚动条滑道区域表格渲染空白 close [#1764](https://github.com/antvis/S2/issues/1764) [#1780](https://github.com/antvis/S2/issues/1780) ([#1785](https://github.com/antvis/S2/issues/1785)) ([41166be](https://github.com/antvis/S2/commit/41166be08065ebdea3db7202eec141b850bcaae3))
* **sort:** 修复 tooltip 中排序菜单未记住上一次选中状态 close [#1716](https://github.com/antvis/S2/issues/1716) ([#1746](https://github.com/antvis/S2/issues/1746)) ([67e09c4](https://github.com/antvis/S2/commit/67e09c43b6508cbd141dc47fedbebfbc247cbb3f))
* table formatter with header selected ([#1786](https://github.com/antvis/S2/issues/1786)) ([71a7a3b](https://github.com/antvis/S2/commit/71a7a3b9c2f07b754c1aced0b82eea90249044c0))
* 将依赖检查移动到外层 ([#1792](https://github.com/antvis/S2/issues/1792)) ([0a8e4ed](https://github.com/antvis/S2/commit/0a8e4edb55a81f0dfdcefbcb6ef38d5642ca179b))
* 明细表奇数行背景色不生效修复 ([#1795](https://github.com/antvis/S2/issues/1795)) ([f1bd3ec](https://github.com/antvis/S2/commit/f1bd3ecdce0318bb11739f0f58bbec0755403994))

### Features

* 树状结构下，行小计数据显示配置规则 ([#1797](https://github.com/antvis/S2/issues/1797)) ([68a397d](https://github.com/antvis/S2/commit/68a397d0c296399e35e2ab8362b789e771ffcb99))

# [@antv/s2-v1.30.0](https://github.com/antvis/S2/compare/@antv/s2-v1.29.1...@antv/s2-v1.30.0) (2022-09-16)

### Bug Fixes

* 修复合并单元格条件格式不生效问题 close [#1751](https://github.com/antvis/S2/issues/1751) ([#1753](https://github.com/antvis/S2/issues/1753)) ([50570cd](https://github.com/antvis/S2/commit/50570cdd717cd152d8090aa737ce722621a844aa))
* 修复多指标单元格展示错误 ([#1754](https://github.com/antvis/S2/issues/1754)) ([228e101](https://github.com/antvis/S2/commit/228e101e37ab341886427dbbc7d7f3858e778dc5))
* 子弹图左侧文字未对齐 ([#1759](https://github.com/antvis/S2/issues/1759)) ([d061d47](https://github.com/antvis/S2/commit/d061d47d5bff271aa77c1c00551985110eac0405))

### Features

* **strategysheet:** 趋势分析表 tooltip 支持显示原始值 ([#1750](https://github.com/antvis/S2/issues/1750)) ([e757b99](https://github.com/antvis/S2/commit/e757b999a85a15d53dfa72bde2805b6b193dcd62))
* 圈选复制行列头功能 ([#1742](https://github.com/antvis/S2/issues/1742)) ([5a0a942](https://github.com/antvis/S2/commit/5a0a94206edf5e6da64a1869ad3871ed203fb08c))

# [@antv/s2-v1.29.1](https://github.com/antvis/S2/compare/@antv/s2-v1.29.0...@antv/s2-v1.29.1) (2022-09-13)

### Bug Fixes

* 修复表格 onDestroy 卸载事件无法触发 ([#1733](https://github.com/antvis/S2/issues/1733)) ([2195f1a](https://github.com/antvis/S2/commit/2195f1aec681085ec32ee1446b780e00af901c47))
* 修复趋势分析表多列头情况下，单元格数据为空引起的复制数据偏移问题 ([#1743](https://github.com/antvis/S2/issues/1743)) ([52ff51c](https://github.com/antvis/S2/commit/52ff51ccb350998eb01330a346c7abfc1e8ba579))

# [@antv/s2-v1.29.0](https://github.com/antvis/S2/compare/@antv/s2-v1.28.0...@antv/s2-v1.29.0) (2022-09-05)

### Bug Fixes

* **types:** 修复严格模式下 S2Options 类型报错 ([#1723](https://github.com/antvis/S2/issues/1723)) ([ef55f55](https://github.com/antvis/S2/commit/ef55f559f940614b19f76fbc5c941e114f220461))
* 修复 tooltip 点击空白无法消失的问题 ([#1729](https://github.com/antvis/S2/issues/1729)) ([baa7245](https://github.com/antvis/S2/commit/baa72454702f34ccd9dc5957e8574b8e38087c62))

### Features

* 导出组件层 CustomTooltip 类 ([#1726](https://github.com/antvis/S2/issues/1726)) ([46270ab](https://github.com/antvis/S2/commit/46270ab0ae6e42cf92dcf77c0a35a70e07b9b10c))

# [@antv/s2-v1.28.0](https://github.com/antvis/S2/compare/@antv/s2-v1.27.0...@antv/s2-v1.28.0) (2022-08-29)

### Bug Fixes

* **pagination:** 透传组件分页参数 & 修复国际化不生效 close [#1697](https://github.com/antvis/S2/issues/1697) ([#1698](https://github.com/antvis/S2/issues/1698)) ([be334fc](https://github.com/antvis/S2/commit/be334fcef6a11d08358f007eba805cbd380560d5))
* tablefacet 销毁时 off 事件 ([#1704](https://github.com/antvis/S2/issues/1704)) ([9067538](https://github.com/antvis/S2/commit/906753878612b790dcd6c0f9298d0049c48d2b8d))
* text 居中居右时 link 绘制错位 ([#1706](https://github.com/antvis/S2/issues/1706)) ([da9af7a](https://github.com/antvis/S2/commit/da9af7a605af72a0d3b477e502aad790f17a942a))

### Features

* 在树状模式下，增加默认展开层级的配置 ([#1703](https://github.com/antvis/S2/issues/1703)) ([bb1aaf1](https://github.com/antvis/S2/commit/bb1aaf1f5266ec6d6d76c3f7a97e236f4a3c15d3))
* 实现行头和列头的圈选功能 ([#1699](https://github.com/antvis/S2/issues/1699)) ([9aeb744](https://github.com/antvis/S2/commit/9aeb744f9eb1b7145894a12058d9ceb48602dc9f))

# [@antv/s2-v1.27.0](https://github.com/antvis/S2/compare/@antv/s2-v1.26.0...@antv/s2-v1.27.0) (2022-08-22)

### Features

* actionIcons 支持细粒度展示控制 ([#1689](https://github.com/antvis/S2/issues/1689)) ([8029511](https://github.com/antvis/S2/commit/80295113965a77f0e1756c7d0f32c95ec7550834))

# [@antv/s2-v1.26.0](https://github.com/antvis/S2/compare/@antv/s2-v1.25.0...@antv/s2-v1.26.0) (2022-08-15)

### Bug Fixes

* **interaction:** 优化 resetSheetStyle 性能 ([#1653](https://github.com/antvis/S2/issues/1653)) ([972afc6](https://github.com/antvis/S2/commit/972afc6c4cfc5192db753c1488f4ed852254ae13))
* **resize:** 修复总计列存在子节点时无法调整宽度 ([#1675](https://github.com/antvis/S2/issues/1675)) ([62f3459](https://github.com/antvis/S2/commit/62f3459bdccba72f40404a9ccdd5572202bbfcee))
* **scroll:** 修复滚动条显示越界 & 优化滚动性能 ([#1671](https://github.com/antvis/S2/issues/1671)) ([cfbccb9](https://github.com/antvis/S2/commit/cfbccb93aaa78edbcf1e7860b940a5431ead8b7a))
* **scroll:** 修复滚动边界判断错误导致无法滚动 ([#1664](https://github.com/antvis/S2/issues/1664)) ([cf4b8b3](https://github.com/antvis/S2/commit/cf4b8b3e05fa7cf4d5386a3d4a1ad6d98c5179ce))
* 修复明细表 onRaneSort 失效问题 ([#1678](https://github.com/antvis/S2/issues/1678)) ([3563f3c](https://github.com/antvis/S2/commit/3563f3c9a48998827722babb265e7889b7a86a20))
* 修复趋势分析表对于不同个数同环比列头复制时，数据不对齐的问题 ([#1679](https://github.com/antvis/S2/issues/1679)) ([ba88dec](https://github.com/antvis/S2/commit/ba88dec2c2ef9506264c64ba069685c0bd9a4c67))
* 修复选中态的描边宽度样式问题 ([#1654](https://github.com/antvis/S2/issues/1654)) ([577cd84](https://github.com/antvis/S2/commit/577cd84bebe3351bf93b8f1a33c298b7cde66b11))
* 双击时不取消 datacell 选中态 ([#1682](https://github.com/antvis/S2/issues/1682)) ([779940b](https://github.com/antvis/S2/commit/779940b149d2c7b6d18f7e9ec5a1652e3b559273))
* 链接字段高亮下划线过长 ([#1652](https://github.com/antvis/S2/issues/1652)) ([4a79470](https://github.com/antvis/S2/commit/4a794704a48147a91379666c7530c60d9f4644e8))

### Features

* 刷选时支持高亮所有对应的行列头 cell ([#1680](https://github.com/antvis/S2/issues/1680)) ([c7fb53f](https://github.com/antvis/S2/commit/c7fb53f403608e5194d745408966cc9b18c92025))
* 明细表行头单元格支持拖拽 ([#1655](https://github.com/antvis/S2/issues/1655)) ([ab470cb](https://github.com/antvis/S2/commit/ab470cb43eb1ed0d0162b3bed48e568ecaf42cb2))

### Performance Improvements

* 优化生成 grid 模式时性能问题 ([#1686](https://github.com/antvis/S2/issues/1686)) ([a4f52e6](https://github.com/antvis/S2/commit/a4f52e677ee30a7987614846fa061541d4170a97))

# [@antv/s2-v1.25.0](https://github.com/antvis/S2/compare/@antv/s2-v1.24.0...@antv/s2-v1.25.0) (2022-08-05)

### Bug Fixes

* 修复存在 0 时，数值为 number 时，排序错误的问题 ([#1644](https://github.com/antvis/S2/issues/1644)) ([8138c69](https://github.com/antvis/S2/commit/8138c699dd4e14385ee8dc78ddcaca6f8f7a5ec0))
* **interaction:** 向左移动到不完全可见 cell 的时候，没有滚动过去 ([#1607](https://github.com/antvis/S2/issues/1607)) ([42541a5](https://github.com/antvis/S2/commit/42541a55f50158f5241c5777cb5d70a4c26599af))
* **layout:** 修复 treeWidth 配置不生效 close [#1622](https://github.com/antvis/S2/issues/1622) ([#1646](https://github.com/antvis/S2/issues/1646)) ([9e70d62](https://github.com/antvis/S2/commit/9e70d62549da5e14d40d373d23d8592763c550a3))
* **pagination:** 分页配置未传 current 参数时表格渲染空白 ([#1633](https://github.com/antvis/S2/issues/1633)) ([1c65443](https://github.com/antvis/S2/commit/1c654437073071c1fb8b118018b3007922d198f4))
* sortByFunc 排序后行列维度节点丢失 ([#1606](https://github.com/antvis/S2/issues/1606)) ([3a20d7d](https://github.com/antvis/S2/commit/3a20d7d8d4f86d3413c191cda08c71cd293538b0))
* **strategysheet:** 修复趋势分析表列头格式化不生效 ([#1616](https://github.com/antvis/S2/issues/1616)) ([ca3cbb5](https://github.com/antvis/S2/commit/ca3cbb58da57d7989654bb982e6a508d0fd3a42a))
* 明细表复制时无需使用 formatter 格式化列头 label ([#1610](https://github.com/antvis/S2/issues/1610)) ([8f13911](https://github.com/antvis/S2/commit/8f13911a176384c8ce27ad6d02862dd3ba04e27c))

### Features

* **interaction:** 宽高调整事件透出 resizedWidth/resizedHeight, 修复错误类型定义 ([#1638](https://github.com/antvis/S2/issues/1638)) ([fbf45df](https://github.com/antvis/S2/commit/fbf45dfffaf7b17409010c16c7f6a5bb73133197))
* 复制支持 html 格式 ([#1647](https://github.com/antvis/S2/issues/1647)) ([3ea6349](https://github.com/antvis/S2/commit/3ea634970a162d869cf12dad7aa754bebafd30f3))
* 支持 resize 最右侧 column ([#1611](https://github.com/antvis/S2/issues/1611)) ([f63bfa2](https://github.com/antvis/S2/commit/f63bfa2a0e95c8c42c064d0e2e56ce9550ac50c6))

* **strategysheet:** 修复单元格宽度拖拽变小后子弹图宽度计算错误 ([#1584](https://github.com/antvis/S2/issues/1584)) ([99b8593](https://github.com/antvis/S2/commit/99b859392c7151d5700bf1c505a02f795b9a3f80))
* **strategysheet:** 修复子弹图进度小于 1% 时显示错误的问题 ([#1563](https://github.com/antvis/S2/issues/1563)) ([936ca6a](https://github.com/antvis/S2/commit/936ca6a3a7bf40ddc0ff1a0271c3a5ffb1091dcf))
* **strategysheet:** 修复子弹图颜色显示错误 & 百分比精度问题 ([#1588](https://github.com/antvis/S2/issues/1588)) ([c4bb48c](https://github.com/antvis/S2/commit/c4bb48cbe128b47e3574af903142934fd7452846))
* 下钻个数为-1 时应展示全部下钻数据 ([#1557](https://github.com/antvis/S2/issues/1557)) ([13caa5b](https://github.com/antvis/S2/commit/13caa5b5ad2c08c7c98685a97fb34dc8f04c7fe5))
* 修复 line 包围盒问题 ([#1566](https://github.com/antvis/S2/issues/1566)) ([7fb4352](https://github.com/antvis/S2/commit/7fb435289f8de078382426695a2ebc18b8c25efc))
* 修复初始化时，border 不见的问题 ([#1581](https://github.com/antvis/S2/issues/1581)) ([5d9e204](https://github.com/antvis/S2/commit/5d9e2041466e38e603eb509bb9d35398484f9f65))
* 修复合并单元格临界情况被错误移除的问题 ([#1574](https://github.com/antvis/S2/issues/1574)) ([311eeaa](https://github.com/antvis/S2/commit/311eeaa64e612ca81bbb5d5f5ea036d4bfe2111d))
* 修复合并单元格被 grid 边框覆盖的问题 ([#1569](https://github.com/antvis/S2/issues/1569)) ([3498edb](https://github.com/antvis/S2/commit/3498edbe901ac99605d61191fcf55530b71dd32e))
* 修复明细表最左侧边框绘制问题 ([#1562](https://github.com/antvis/S2/issues/1562)) ([a8b62bb](https://github.com/antvis/S2/commit/a8b62bbe6421829bd2067030caeb5bbad0651649))
* 修复移动端滚动没有 prevent 问题 ([#1549](https://github.com/antvis/S2/issues/1549)) ([a3ab84c](https://github.com/antvis/S2/commit/a3ab84c80b582190bee6094b1c1c44e5ef0b9b3c))
* 修复趋势分析表导出问题 ([#1553](https://github.com/antvis/S2/issues/1553)) ([457c378](https://github.com/antvis/S2/commit/457c378ae346eb19a3d7822fd887eafecced420c))
* 有冻结行且有垂直 scrollWidth 时冻结行无法 resize ([#1594](https://github.com/antvis/S2/issues/1594)) ([bcdcbe1](https://github.com/antvis/S2/commit/bcdcbe1a8ab889b2b040625e01989c099854843c))
* 维度按指标汇总值排序时结果错误 ([#1550](https://github.com/antvis/S2/issues/1550)) ([b60564c](https://github.com/antvis/S2/commit/b60564cea08fac0a5334f38b1b1d4882d22d284b))

### Features

* **interaction:** 行列宽高支持控制拖拽范围 ([#1583](https://github.com/antvis/S2/issues/1583)) ([1d51272](https://github.com/antvis/S2/commit/1d51272ee339f2c31b6236e16406c1b52f57a3b9))
* **layout:** 支持自定义行/列单元格宽度 close [#1585](https://github.com/antvis/S2/issues/1585) ([#1591](https://github.com/antvis/S2/issues/1591)) ([ea5c1f3](https://github.com/antvis/S2/commit/ea5c1f3b41a0ccc9766fe2466924db1b8ea586ee))
* **tooltip:** 支持设置多个 class 类名 ([#1546](https://github.com/antvis/S2/issues/1546)) ([1fb22c6](https://github.com/antvis/S2/commit/1fb22c64f32d739acbf9dee681b126a703b38a20))
* 当前只能复制数值可带表头复制 ([#1590](https://github.com/antvis/S2/issues/1590)) ([b2ff70e](https://github.com/antvis/S2/commit/b2ff70e11d3abaab318aec9acc4bc4e2ac8c4114)), closes [#1583](https://github.com/antvis/S2/issues/1583)

# [@antv/s2-v1.23.0](https://github.com/antvis/S2/compare/@antv/s2-v1.22.0...@antv/s2-v1.23.0) (2022-07-08)

### Bug Fixes

* 🐛 明细表大数据量下滚动条无法滚动到顶部 ([#1529](https://github.com/antvis/S2/issues/1529)) ([2791be9](https://github.com/antvis/S2/commit/2791be9769b3082bdfe8ae9a8ae0831ca821251a)), closes [#1528](https://github.com/antvis/S2/issues/1528)
* **drill-down:** values 配置为空时未显示下钻 icon ([#1535](https://github.com/antvis/S2/issues/1535)) ([8a1d27c](https://github.com/antvis/S2/commit/8a1d27c1a517e7a04d1037ef95b57450adc7df2c))
* **interaction:** 修复按下快捷选中按钮之后通过触控板切换页面，快捷键状态没有 reset 的问题 ([#1496](https://github.com/antvis/S2/issues/1496)) ([704e8e0](https://github.com/antvis/S2/commit/704e8e0f4e8cbbeb2b1e0e1dacbd2c3dd13b9dbc))
* **interaction:** 修复链接跳转会触发单选和 Tooltip 显示的问题 ([#1498](https://github.com/antvis/S2/issues/1498)) ([ebcb0c2](https://github.com/antvis/S2/commit/ebcb0c2c663da89c457a2149f6bc19fbde2ab8c9))
* **theme:** 修复调整序号列后色板丢失 close [#1538](https://github.com/antvis/S2/issues/1538) ([#1543](https://github.com/antvis/S2/issues/1543)) ([6678848](https://github.com/antvis/S2/commit/6678848094c5c707a5586b33117bfd0b968fc302))
* 优化 mini 图坐标计算逻辑 ([#1534](https://github.com/antvis/S2/issues/1534)) ([88a61e0](https://github.com/antvis/S2/commit/88a61e08b70750401d86e99dd5a6d320a1390da8))
* 修复 pivot 无法获取整行数据，而报错的问题 ([#1504](https://github.com/antvis/S2/issues/1504)) ([89e22d3](https://github.com/antvis/S2/commit/89e22d3ffd425b3e1e7a180744b3d85e3635adb6))
* 修复大量数据下，行列总计单元格计算时耗时和内存问题 ([#1531](https://github.com/antvis/S2/issues/1531)) ([2913ce9](https://github.com/antvis/S2/commit/2913ce98b053edafde3568e67df9112e69bf3bab))
* 修复角头数值 i18n 展示问题 ([#1509](https://github.com/antvis/S2/issues/1509)) ([9166137](https://github.com/antvis/S2/commit/91661376dadc66def28ec328de36d0bf828a3f2e))
* 列头文字&icon 无法正确对齐 ([#1515](https://github.com/antvis/S2/issues/1515)) ([3457af9](https://github.com/antvis/S2/commit/3457af9da4205765115b6174a53d7a4d92a8ceef))
* 移除字段标记中多余的 fieldValue 判断 ([#1525](https://github.com/antvis/S2/issues/1525)) ([fb06ce0](https://github.com/antvis/S2/commit/fb06ce0fadb7cc8f2b42c5f78b85f22d91a2640a))
* 趋势分析表 conditions 增加容错能力 ([#1537](https://github.com/antvis/S2/issues/1537)) ([4770c9a](https://github.com/antvis/S2/commit/4770c9af5025f2318ca4c9d02f8217ada83fd00c))

### Features

* 基础表、趋势分析表 tooltip 新增显示字段说明功能 ([#1541](https://github.com/antvis/S2/issues/1541)) ([3a9f3cb](https://github.com/antvis/S2/commit/3a9f3cb2f22aeb14b15b8d3fe79f107ff8f04516))
* 支持 绘制 mini 柱状图 ([#1505](https://github.com/antvis/S2/issues/1505)) ([24a6ca6](https://github.com/antvis/S2/commit/24a6ca643e3b1154e4093c15216b218ef02cf3df))

# [@antv/s2-v1.22.0](https://github.com/antvis/S2/compare/@antv/s2-v1.21.1...@antv/s2-v1.22.0) (2022-06-24)

### Bug Fixes

* node 可能为 null ([#1486](https://github.com/antvis/S2/issues/1486)) ([bce985f](https://github.com/antvis/S2/commit/bce985fac083009668cb30c9b936e68c4b97b4ba))
* **strategysheet:** 修复趋势分析表多列头切换为单列头后，隐藏列头功能失效 ([#1470](https://github.com/antvis/S2/issues/1470)) ([b39742e](https://github.com/antvis/S2/commit/b39742e3a7276836c504f2a0d5343ff201a65bba))
* 修复柱状图区间及零点问题 ([#1465](https://github.com/antvis/S2/issues/1465)) ([a78d944](https://github.com/antvis/S2/commit/a78d9441d7b821c1518ed70ddaa80f468b4a110b))
* 增加 tooltip 允许复制的样式防止被覆盖 ([#1477](https://github.com/antvis/S2/issues/1477)) ([39775ca](https://github.com/antvis/S2/commit/39775ca6dddf830e52f1fc530cd0af2f32c84da6))
* 构造含总计的 tree 行头布局时报错 ([#1472](https://github.com/antvis/S2/issues/1472)) ([faff65c](https://github.com/antvis/S2/commit/faff65cb5378e94e2557c0b561b461eaaa5f1c37))
* 趋势表自定义列头数值误用数据单元格样式 ([#1479](https://github.com/antvis/S2/issues/1479)) ([c23e105](https://github.com/antvis/S2/commit/c23e105b6d633cd2b66ac3a8618851923be7d1be))

### Features

* **interaction:** 增加行头单元格和全局单元格滚动事件及文档 ([#1483](https://github.com/antvis/S2/issues/1483)) ([329aaa6](https://github.com/antvis/S2/commit/329aaa6c9f9ae926f392e3e8f676af1ec201cce2))
* **interaction:** 添加 onDataCellSelectMove 事件 ([#1468](https://github.com/antvis/S2/issues/1468)) ([da2a78e](https://github.com/antvis/S2/commit/da2a78ec511a85380824fa2b7147854e857df7f3))
* **tooltip:** 支持额外的样式和类名 & 修复内容过长 tooltip 展示不全的问题 ([#1478](https://github.com/antvis/S2/issues/1478)) ([e3103d7](https://github.com/antvis/S2/commit/e3103d7a5499871f22bacf47bf7dbb89a947ff59))
* 支持绘制 mini 折线图 ([#1484](https://github.com/antvis/S2/issues/1484)) ([cfa5987](https://github.com/antvis/S2/commit/cfa5987f48ce3cc434e953fef00837e1fc617400))
* 明细表的 getCellData 可获取单行数据 ([#1482](https://github.com/antvis/S2/issues/1482)) ([c3e1662](https://github.com/antvis/S2/commit/c3e16622cf5e1247a5503c92e694adc7d047a321))
* 明细表趋势图透出点击透出整行数据 ([#1485](https://github.com/antvis/S2/issues/1485)) ([ea82780](https://github.com/antvis/S2/commit/ea827809e333d37a7301fac4785add8d87ca4c0e))

# [@antv/s2-v1.21.1](https://github.com/antvis/S2/compare/@antv/s2-v1.21.0...@antv/s2-v1.21.1) (2022-06-21)

### Bug Fixes

* 构造含总计的 tree 行头布局时报错 ([a44c2c8](https://github.com/antvis/S2/commit/a44c2c81a5c0454a506ebd61014a72f810c921e8))

# [@antv/s2-v1.21.0](https://github.com/antvis/S2/compare/@antv/s2-v1.20.0...@antv/s2-v1.21.0) (2022-06-20)

### Bug Fixes

* customFlatten 空值保护 ([#1463](https://github.com/antvis/S2/issues/1463)) ([34a5cdc](https://github.com/antvis/S2/commit/34a5cdc1f5bffe0f35b1fa499dd325b4d19db289))
* **interaction:** 修复禁用多选后，未对行/列头生效 ([#1461](https://github.com/antvis/S2/issues/1461)) ([6dab9da](https://github.com/antvis/S2/commit/6dab9da19c9fd53bdd5198f18abe7c00f12f061e))
* 修复相同配置字段导致程序出错 ([#1460](https://github.com/antvis/S2/issues/1460)) ([a92a4b7](https://github.com/antvis/S2/commit/a92a4b717f48dd12040ce1d3fac02bdc8aea157a))

### Features

* **strategy-sheet:** 子弹图支持显示 Tooltip ([#1450](https://github.com/antvis/S2/issues/1450)) ([15a0799](https://github.com/antvis/S2/commit/15a0799a17893610a7aa8b4550e6d3647ad3a2b2))

# [@antv/s2-v1.20.0](https://github.com/antvis/S2/compare/@antv/s2-v1.19.0...@antv/s2-v1.20.0) (2022-06-17)

### Bug Fixes

* **copy:** 修复字段名带有-导致复制失败的问题 ([#1433](https://github.com/antvis/S2/issues/1433)) ([7fb7fac](https://github.com/antvis/S2/commit/7fb7fac7fb6ab09762c26efa2dd0226dc35c15bb))
* **sort:** 透视表/明细表 排序菜单文案显示错误 ([#1424](https://github.com/antvis/S2/issues/1424)) ([d837b41](https://github.com/antvis/S2/commit/d837b415d55189d3c5f7e7b2734d41076a054ce3))
* **tooltip:** 修复行/列层级超过 2 级时选中数据统计错误 ([#1443](https://github.com/antvis/S2/issues/1443)) ([09dd677](https://github.com/antvis/S2/commit/09dd677458c904f7b86c8457a489bca26a366269))
* **tooltip:** 减少 tooltip 框重绘 ([#1418](https://github.com/antvis/S2/issues/1418)) ([59c6a87](https://github.com/antvis/S2/commit/59c6a87f256866962ea3b523fd882a8d4e1eb6e9))
* 修复序号对齐问题， close [#1412](https://github.com/antvis/S2/issues/1412) ([#1431](https://github.com/antvis/S2/issues/1431)) ([cbe4980](https://github.com/antvis/S2/commit/cbe498059dacd53edb58e387f5357f9740ffb194))
* 出现 tooltip 后点击画布外面的空白区域可能抛出错误 ([#1438](https://github.com/antvis/S2/issues/1438)) ([483367e](https://github.com/antvis/S2/commit/483367e0363373965290831d2cb1e479854641f7))
* 树状结构下，子节点全部折叠，导出内容错误 ([#1435](https://github.com/antvis/S2/issues/1435)) ([fa36599](https://github.com/antvis/S2/commit/fa36599a988a6e7b1ac75b65646b2e767587081a))

### Features

* canvas 未聚焦时不触发选中格子的键盘 move 行为 ([#1415](https://github.com/antvis/S2/issues/1415)) ([e9255be](https://github.com/antvis/S2/commit/e9255bead71d44b344851ccdcc7def6fb51e79c2))
* **interaction:** 选中单元格后对应行列头高亮 ([#1414](https://github.com/antvis/S2/issues/1414)) ([202b378](https://github.com/antvis/S2/commit/202b378fed8e880cea0a75b12db905c3ae385b19))
* **scroll:** 增加边界滚动配置，解决横屏滚动会触发 mac 回退的问题 ([#1409](https://github.com/antvis/S2/issues/1409)) ([ada5082](https://github.com/antvis/S2/commit/ada5082d299357b1b38af7629a784e3d071e6b77))
* 无序号列时绘制左侧列边框 ([#1417](https://github.com/antvis/S2/issues/1417)) ([041b8aa](https://github.com/antvis/S2/commit/041b8aa9714b096e0f24e62dd57079401519ec07))

# [@antv/s2-v1.19.0](https://github.com/antvis/S2/compare/@antv/s2-v1.18.0...@antv/s2-v1.19.0) (2022-06-02)

### Bug Fixes

* **copy:** 修复 rowdata 可能为 null 的情况 ([#1393](https://github.com/antvis/S2/issues/1393)) ([0beeac4](https://github.com/antvis/S2/commit/0beeac424d809e5d97844ff95490bd80e7c451ea))
* **locale:** 修复国际化配置不生效 close [#1394](https://github.com/antvis/S2/issues/1394) ([#1397](https://github.com/antvis/S2/issues/1397)) ([cfd5dbe](https://github.com/antvis/S2/commit/cfd5dbe0344afbb6f3929bece1778c02f9bbc00b))
* 修复表格卸载后调用实例方法报错的问题 close [#1349](https://github.com/antvis/S2/issues/1349) ([#1400](https://github.com/antvis/S2/issues/1400)) ([bcf21bb](https://github.com/antvis/S2/commit/bcf21bb2099e04496c76b9cd28fa6d7723c9edcb))

### Features

* 趋势分析表支持子弹图配置 ([#1367](https://github.com/antvis/S2/issues/1367)) ([b5756cc](https://github.com/antvis/S2/commit/b5756cc2f4d2054f3d5a8eb31134efd23b1dd230))

# [@antv/s2-v1.18.0](https://github.com/antvis/S2/compare/@antv/s2-v1.17.0...@antv/s2-v1.18.0) (2022-05-30)

### Bug Fixes

* **facet:** DataCell 边框改为统一绘制的 Grid ([#1297](https://github.com/antvis/S2/issues/1297)) ([daaf989](https://github.com/antvis/S2/commit/daaf989fbb2be537d30675c661aff08a74d6b7f6))
* fieldValue 精度过高时 intervalShape 未绘制 ([#1372](https://github.com/antvis/S2/issues/1372)) ([0bb19b7](https://github.com/antvis/S2/commit/0bb19b7215c6d55b31fb4111d736f7d9a39e2fd8))
* **interaction:** 修复自定义单元格有自定义图片时无法触发点击 close [#1360](https://github.com/antvis/S2/issues/1360) ([#1365](https://github.com/antvis/S2/issues/1365)) ([685cd04](https://github.com/antvis/S2/commit/685cd0458e33d189ced36eb708c8ed697f3d024c))
* **interaction:** 修复默认隐藏列的配置更新为空数组时，未触发表格更新 ([#1351](https://github.com/antvis/S2/issues/1351)) ([7ed1011](https://github.com/antvis/S2/commit/7ed101152caa180cc7090861f4fbf7f774148a23))
* **strategysheet:** 修复趋势分析表多列头时叶子节点未和数值单元格对齐 ([#1371](https://github.com/antvis/S2/issues/1371)) ([2d3ff04](https://github.com/antvis/S2/commit/2d3ff047b414b5861203d39b5f3db23fe1307c16))
* **tooltip:** 修复存在小计/总计时汇总数据计算错误 close [#1137](https://github.com/antvis/S2/issues/1137) ([#1346](https://github.com/antvis/S2/issues/1346)) ([f6e5e8c](https://github.com/antvis/S2/commit/f6e5e8c1b05563dee29e926887aa08ef92bd4302))
* total 配置项取用错误 ([#1338](https://github.com/antvis/S2/issues/1338)) ([e514ad6](https://github.com/antvis/S2/commit/e514ad6048a12ab52f6137c14ba3c27582424e84))
* 下钻数据没有按照用户数据展示 ([#1353](https://github.com/antvis/S2/issues/1353)) ([065c3bd](https://github.com/antvis/S2/commit/065c3bdea3625232de7d98797ef7266eea74f67c))
* 增加默认条件格式默认默认默认值 ([#1379](https://github.com/antvis/S2/issues/1379)) ([c084c01](https://github.com/antvis/S2/commit/c084c01ddb471000f32b255260c45e1427884681))
* 明细表下 range-selection 报错 ([#1368](https://github.com/antvis/S2/issues/1368)) ([189d337](https://github.com/antvis/S2/commit/189d337dc7efc3ec9ba1a48c4fc8d0649d1d5439))

### Features

* **interaction:** 增加单元格的右键事件 close [#1326](https://github.com/antvis/S2/issues/1326) ([#1334](https://github.com/antvis/S2/issues/1334)) ([230f3cc](https://github.com/antvis/S2/commit/230f3cc80137d666acf90c35891654cbefa83703))
* sortFunc 支持使用手动排序兜底 ([#1374](https://github.com/antvis/S2/issues/1374)) ([252acdd](https://github.com/antvis/S2/commit/252acdd3f44816a0cf490a1fe2c39fd1e461bc54))
* **theme:** 新增度量值的主题配置，修复小计总计主题配置不生效 close [#1357](https://github.com/antvis/S2/issues/1357) ([#1364](https://github.com/antvis/S2/issues/1364)) ([ef3f99e](https://github.com/antvis/S2/commit/ef3f99e312b2f0a49b9d5928084c842718ae23be))
* Vue 1.0 ([#1290](https://github.com/antvis/S2/issues/1290)) ([0745836](https://github.com/antvis/S2/commit/07458368d7eafd3ddee168d5b2adca463374ab5a))
* 丰富 tooltip 关闭的验证逻辑 ([#1352](https://github.com/antvis/S2/issues/1352)) ([264a9e9](https://github.com/antvis/S2/commit/264a9e93d586f8b8c5498af912c6a31aa4da8f04))
* 支持回调函数调整 Tooltip 位置 ([#1350](https://github.com/antvis/S2/issues/1350)) ([898f3df](https://github.com/antvis/S2/commit/898f3df590227ef0f0d2afd17892a9514bb7c2a3))

### Reverts

* Revert "chore(release): @antv/s2@1.18.0 @antv/s2-react@1.16.0 @antv/s2-vue@1.0.0 (#1384)" (#1386) ([60cdf6a](https://github.com/antvis/S2/commit/60cdf6abe7fb3b44f831051bd55622587a0f5bf8)), closes [#1384](https://github.com/antvis/S2/issues/1384) [#1386](https://github.com/antvis/S2/issues/1386)

# [@antv/s2-v1.17.0](https://github.com/antvis/S2/compare/@antv/s2-v1.16.0...@antv/s2-v1.17.0) (2022-05-13)

### Bug Fixes

* **copy:** 修复同步复制时会触发页面滚动的问题 close [#1317](https://github.com/antvis/S2/issues/1317) ([#1321](https://github.com/antvis/S2/issues/1321)) ([821e676](https://github.com/antvis/S2/commit/821e676a6f2e2f9c57554afa751ddf20e153da80))
* dataCfg 变化时未重新计算 treeRow 宽度 ([#1316](https://github.com/antvis/S2/issues/1316)) ([f5e53b0](https://github.com/antvis/S2/commit/f5e53b0313ef7bcf23fd63438f1059ef91c0afa1))
* **interaction:** 角头单元格增加对自定义 tooltip 的适配 ([#1322](https://github.com/antvis/S2/issues/1322)) ([11c8e48](https://github.com/antvis/S2/commit/11c8e48d37e4e08742ba2d0dbeccfc99a694beff))
* 去除 header cell 中对 sortParams 的原地反转操作 ([#1313](https://github.com/antvis/S2/issues/1313)) ([843757c](https://github.com/antvis/S2/commit/843757cf2cd88b500db19e47e35727edf585ddcc))
* 在复制或者表格数据时，可对行列头进行格式化导出 ([#1319](https://github.com/antvis/S2/issues/1319)) ([6e5fc0a](https://github.com/antvis/S2/commit/6e5fc0a34e5b1bcee23b5e634e3dba517f370485))
* 带总/小计的交叉表复制报错 ([#1332](https://github.com/antvis/S2/issues/1332)) ([2063583](https://github.com/antvis/S2/commit/20635836f5d56f11c99de7c95e73d5e29080c2e9))

### Features

* 当子维度不足 2 个时可隐藏小计节点 ([#1325](https://github.com/antvis/S2/issues/1325)) ([444fea3](https://github.com/antvis/S2/commit/444fea31ca305a47c696d4f876b350710810b9de))

# [@antv/s2-v1.16.0](https://github.com/antvis/S2/compare/@antv/s2-v1.15.0...@antv/s2-v1.16.0) (2022-05-06)

### Bug Fixes

* **interaction:** 树状模式列头非叶子节点选中无法高亮当前列 ([#1307](https://github.com/antvis/S2/issues/1307)) ([bba5f72](https://github.com/antvis/S2/commit/bba5f72ab8d8fe2fa98eac57bc282405b55e1e3d))
* **interaction:** 设置 stateShape 的 visible 默认为 false 来减少绘制调用 ([#1295](https://github.com/antvis/S2/issues/1295)) ([10f4391](https://github.com/antvis/S2/commit/10f43916e884bdebdc35c05734091dff9d8b2ca0))
* **interaction:** 连续 Hover 失效问题修复 ([#1292](https://github.com/antvis/S2/issues/1292)) ([162b5f2](https://github.com/antvis/S2/commit/162b5f22d3b67b321c83bdee234528d247105bd0))
* **strategySheet:** 隐藏列兼容趋势分析表衍生指标场景 ([#1299](https://github.com/antvis/S2/issues/1299)) ([f67731e](https://github.com/antvis/S2/commit/f67731ee2d39a806d0f886658d8332646108865c))
* 修复容器设置 transform 样式后框选背景框错位问题 ([#1311](https://github.com/antvis/S2/issues/1311)) ([0582bb5](https://github.com/antvis/S2/commit/0582bb5a5fb652523b21ca91f8f09af6103b18f2))
* 修正 auto reset 的 canvas 外判断逻辑 ([#1293](https://github.com/antvis/S2/issues/1293)) ([307963c](https://github.com/antvis/S2/commit/307963ce76325edfdb339abdacdb07ab6e554121))

### Features

* 允许条件设置数据单元格为空的占位符 ([#1309](https://github.com/antvis/S2/issues/1309)) ([397caf1](https://github.com/antvis/S2/commit/397caf18e3eec7c82bd4f4bb7a6987839474a425))
* 树状层级样式优化 ([#1302](https://github.com/antvis/S2/issues/1302)) ([ef907db](https://github.com/antvis/S2/commit/ef907db2e870638115e5b905ccf6963de4c4ddd1))

# [@antv/s2-v1.15.0](https://github.com/antvis/S2/compare/@antv/s2-v1.14.0...@antv/s2-v1.15.0) (2022-04-22)

### Bug Fixes

* all selected ([#1275](https://github.com/antvis/S2/issues/1275)) ([cf002e8](https://github.com/antvis/S2/commit/cf002e80d1ed111e470edee5d7c70ea2d50daf16))
* **corner-cell:** 微调角头 icon 位置保持和行头对齐 ([#1287](https://github.com/antvis/S2/issues/1287)) ([5235afc](https://github.com/antvis/S2/commit/5235afca9bf0ddc774695741b8aa4fff469e8fa5))
* **row-column-resize:** 修复虚线宽度设置不生效问题 ([#1250](https://github.com/antvis/S2/issues/1250)) ([a1810b9](https://github.com/antvis/S2/commit/a1810b94e48792ae4399c155e33573fa72ec0e0e))
* scrollY 越界问题修复 & 重构 ([#1274](https://github.com/antvis/S2/issues/1274)) ([0bac1c1](https://github.com/antvis/S2/commit/0bac1c1f929f7389bb58dafd7e1fdec8a5b7fce3))
* **theme:**  修复颜色主题配置对自定义 icon 不生效的问题 ([#1261](https://github.com/antvis/S2/issues/1261)) ([ad52a03](https://github.com/antvis/S2/commit/ad52a03d1a59fbf87fe9dd2c14482f37181a4454))
* 修复 switcher 组件布局问题 ([#1270](https://github.com/antvis/S2/issues/1270)) ([8cd28fc](https://github.com/antvis/S2/commit/8cd28fc1e0a91ab8b969200e191a26c407513fc1))
* 修复交叉表分页问题 ([#1260](https://github.com/antvis/S2/issues/1260)) ([a8142b9](https://github.com/antvis/S2/commit/a8142b961e7c839a2de60aea232209f815f5d32d))
* 修复树形状态下收起展开后汇总数据错误问题，close issue [#1153](https://github.com/antvis/S2/issues/1153) ([#1282](https://github.com/antvis/S2/issues/1282)) ([6a7260c](https://github.com/antvis/S2/commit/6a7260c5492973f4caba9a2ef537200c551857b2))
* 行头/单元格 icon 颜色应默认与字体色一致 ([#1276](https://github.com/antvis/S2/issues/1276)) ([5a0dcd8](https://github.com/antvis/S2/commit/5a0dcd8d6c9cbd83ae405eaceaf10db8d0d86a95))
* 解决明细表表头被格式化的问题 ([#1257](https://github.com/antvis/S2/issues/1257)) ([aca54aa](https://github.com/antvis/S2/commit/aca54aa8b5455f195c52b034cce80de2c5ced5d3))

### Features

* **copy:** 添加复制全部 复制行 复制列功能 ([#1253](https://github.com/antvis/S2/issues/1253)) ([6fa2144](https://github.com/antvis/S2/commit/6fa21443cb81d43379955a28c7afac7a2ed4d809))
* **interaction:** 支持行列头反选 ([#1256](https://github.com/antvis/S2/issues/1256)) ([9544706](https://github.com/antvis/S2/commit/9544706bbf017d425506016fbd23af89e76c5824))
* **interaction:** 支持透传 addEventListener 的可选参数 ([#1262](https://github.com/antvis/S2/issues/1262)) ([d6bc064](https://github.com/antvis/S2/commit/d6bc064e971f8e0a18e8590931f6bff8fadabe44))
* 去除自定义树无用的 transformCustomTreeItems 方法 ([#1271](https://github.com/antvis/S2/issues/1271)) ([5923c25](https://github.com/antvis/S2/commit/5923c2530f049dd7b9904831d4f482074dc58ef1))
* 增加根据主题色生成对应主题风格色板功能 ([#1190](https://github.com/antvis/S2/issues/1190)) ([4c81fa3](https://github.com/antvis/S2/commit/4c81fa3d0ac2c9563f022560cae75335c453b218))
* 新增 hoverFocusTime 配置项 ([#1281](https://github.com/antvis/S2/issues/1281)) ([b7636cb](https://github.com/antvis/S2/commit/b7636cb038a9a74bbce1dd81781db9128047693d))

# [@antv/s2-v1.14.0](https://github.com/antvis/S2/compare/@antv/s2-v1.13.1...@antv/s2-v1.14.0) (2022-04-08)

### Bug Fixes

* **copy:** 修复因为 header 的 key 内带有‘-’字符串导致的 row 和 col id 识别错误 ([#1234](https://github.com/antvis/S2/issues/1234)) ([b685c95](https://github.com/antvis/S2/commit/b685c95adaa190a0491e32a902bc5aa2f3463704))
* **facet:** getIndexRangeWithOffsets return correct value with equal min and max height ([#1218](https://github.com/antvis/S2/issues/1218)) ([f99d104](https://github.com/antvis/S2/commit/f99d1041e5ec7a66dd3a3b6d12fa8baa0c13f27b))
* 修复 backgroundColorOpacity 不生效问题，close [#1201](https://github.com/antvis/S2/issues/1201) ([#1244](https://github.com/antvis/S2/issues/1244)) ([e7ff60d](https://github.com/antvis/S2/commit/e7ff60d266c4cefee38c88e30cc21e75d5283572))
* 更改 remapping 字段顺序 ([#1246](https://github.com/antvis/S2/issues/1246)) ([f0ffe28](https://github.com/antvis/S2/commit/f0ffe28f0d731e2cb45527a598fc461d5a13395f))
* 行头文字右对齐未展示 icon ([#1215](https://github.com/antvis/S2/issues/1215)) ([f37ee0e](https://github.com/antvis/S2/commit/f37ee0ef3665aa7edfd2dec10083397af815a91d))

### Features

* update brush interactiontest case ([#1239](https://github.com/antvis/S2/issues/1239)) ([604abba](https://github.com/antvis/S2/commit/604abba188a04f90b4eb12f9b4fc46a90b46a75a))
* 支持自定义角头的虚拟数值字段文本 close [#1212](https://github.com/antvis/S2/issues/1212) ([#1223](https://github.com/antvis/S2/issues/1223)) ([84bc978](https://github.com/antvis/S2/commit/84bc9786bf1391a9e7afd21888618403e7f786d3))
* 添加行头和列头的格式化功能 ([#1219](https://github.com/antvis/S2/issues/1219)) ([f375f58](https://github.com/antvis/S2/commit/f375f58d37aa2901df0ceed31ec919ad0ae09a4f))

# [@antv/s2-v1.13.1](https://github.com/antvis/S2/compare/@antv/s2-v1.13.0...@antv/s2-v1.13.1) (2022-03-25)

### Bug Fixes

* **s2:** 如果是 table mode，列头不需要被格式化 ([#1249](https://github.com/antvis/S2/issues/1249)) ([d3141d3](https://github.com/antvis/S2/commit/d3141d3b2ca5bc8a68e7333e3e8f720bc121e52d))
* **strategySheet:** 隐藏列兼容趋势分析表衍生指标场景 ([#1299](https://github.com/antvis/S2/issues/1299)) ([f67731e](https://github.com/antvis/S2/commit/f67731ee2d39a806d0f886658d8332646108865c))
* 为第一个子层级时，parentNode.id === ROOT_ID 时，不需要通过分割获取当前节点的真实 value ([#1285](https://github.com/antvis/S2/issues/1285)) ([d488615](https://github.com/antvis/S2/commit/d488615fb68788e316f757eb1ff7da92ebf97628))
* 修复 lint 报错 ([cbba5d9](https://github.com/antvis/S2/commit/cbba5d9c3ef0dee5026472aac51b3c0e13eadda2))
* 修正 auto reset 的 canvas 外判断逻辑 ([#1293](https://github.com/antvis/S2/issues/1293)) ([307963c](https://github.com/antvis/S2/commit/307963ce76325edfdb339abdacdb07ab6e554121))
* 添加当多个数值在行头显示时，小计展示被遮挡的问题 ([#1267](https://github.com/antvis/S2/issues/1267)) ([87127d0](https://github.com/antvis/S2/commit/87127d08cfa3be1a34922a619e4244475f0aa8ff))

### Features

* hsl 分量作用方式从 ([2edce7b](https://github.com/antvis/S2/commit/2edce7be4d7e0cf7719dc3988d3a6d6b34ec0b86))
* 固定背景色 ([3c24dad](https://github.com/antvis/S2/commit/3c24dadd93409c648aa417ee0e261c744a016081))
* 增加搜索高亮交互状态及主题色 ([#1240](https://github.com/antvis/S2/issues/1240)) ([0897888](https://github.com/antvis/S2/commit/0897888772172b1afe38f815d95994433cc68915))
* 增加根据主题色生成对应主题风格色板功能 ([9928227](https://github.com/antvis/S2/commit/992822784d65611eed2a1aa80d685e1b0a6d48c3))
* 树状层级样式优化 ([#1302](https://github.com/antvis/S2/issues/1302)) ([ef907db](https://github.com/antvis/S2/commit/ef907db2e870638115e5b905ccf6963de4c4ddd1))

# [@antv/s2-v1.15.0](https://github.com/antvis/S2/compare/@antv/s2-v1.14.0...@antv/s2-v1.15.0) (2022-04-22)

### Bug Fixes

* all selected ([#1275](https://github.com/antvis/S2/issues/1275)) ([cf002e8](https://github.com/antvis/S2/commit/cf002e80d1ed111e470edee5d7c70ea2d50daf16))
* **corner-cell:** 微调角头 icon 位置保持和行头对齐 ([#1287](https://github.com/antvis/S2/issues/1287)) ([5235afc](https://github.com/antvis/S2/commit/5235afca9bf0ddc774695741b8aa4fff469e8fa5))
* **row-column-resize:** 修复虚线宽度设置不生效问题 ([#1250](https://github.com/antvis/S2/issues/1250)) ([a1810b9](https://github.com/antvis/S2/commit/a1810b94e48792ae4399c155e33573fa72ec0e0e))
* scrollY 越界问题修复 & 重构 ([#1274](https://github.com/antvis/S2/issues/1274)) ([0bac1c1](https://github.com/antvis/S2/commit/0bac1c1f929f7389bb58dafd7e1fdec8a5b7fce3))
* **theme:**  修复颜色主题配置对自定义 icon 不生效的问题 ([#1261](https://github.com/antvis/S2/issues/1261)) ([ad52a03](https://github.com/antvis/S2/commit/ad52a03d1a59fbf87fe9dd2c14482f37181a4454))
* 修复 switcher 组件布局问题 ([#1270](https://github.com/antvis/S2/issues/1270)) ([8cd28fc](https://github.com/antvis/S2/commit/8cd28fc1e0a91ab8b969200e191a26c407513fc1))
* 修复交叉表分页问题 ([#1260](https://github.com/antvis/S2/issues/1260)) ([a8142b9](https://github.com/antvis/S2/commit/a8142b961e7c839a2de60aea232209f815f5d32d))
* 修复树形状态下收起展开后汇总数据错误问题，close issue [#1153](https://github.com/antvis/S2/issues/1153) ([#1282](https://github.com/antvis/S2/issues/1282)) ([6a7260c](https://github.com/antvis/S2/commit/6a7260c5492973f4caba9a2ef537200c551857b2))
* 行头/单元格 icon 颜色应默认与字体色一致 ([#1276](https://github.com/antvis/S2/issues/1276)) ([5a0dcd8](https://github.com/antvis/S2/commit/5a0dcd8d6c9cbd83ae405eaceaf10db8d0d86a95))
* 解决明细表表头被格式化的问题 ([#1257](https://github.com/antvis/S2/issues/1257)) ([aca54aa](https://github.com/antvis/S2/commit/aca54aa8b5455f195c52b034cce80de2c5ced5d3))

### Features

* **copy:** 添加复制全部 复制行 复制列功能 ([#1253](https://github.com/antvis/S2/issues/1253)) ([6fa2144](https://github.com/antvis/S2/commit/6fa21443cb81d43379955a28c7afac7a2ed4d809))
* **interaction:** 支持行列头反选 ([#1256](https://github.com/antvis/S2/issues/1256)) ([9544706](https://github.com/antvis/S2/commit/9544706bbf017d425506016fbd23af89e76c5824))
* **interaction:** 支持透传 addEventListener 的可选参数 ([#1262](https://github.com/antvis/S2/issues/1262)) ([d6bc064](https://github.com/antvis/S2/commit/d6bc064e971f8e0a18e8590931f6bff8fadabe44))
* 去除自定义树无用的 transformCustomTreeItems 方法 ([#1271](https://github.com/antvis/S2/issues/1271)) ([5923c25](https://github.com/antvis/S2/commit/5923c2530f049dd7b9904831d4f482074dc58ef1))
* 增加根据主题色生成对应主题风格色板功能 ([#1190](https://github.com/antvis/S2/issues/1190)) ([4c81fa3](https://github.com/antvis/S2/commit/4c81fa3d0ac2c9563f022560cae75335c453b218))
* 新增 hoverFocusTime 配置项 ([#1281](https://github.com/antvis/S2/issues/1281)) ([b7636cb](https://github.com/antvis/S2/commit/b7636cb038a9a74bbce1dd81781db9128047693d))

# [@antv/s2-v1.15.0-alpha.6](https://github.com/antvis/S2/compare/@antv/s2-v1.15.0-alpha.5...@antv/s2-v1.15.0-alpha.6) (2022-04-21)

### Bug Fixes

* **copy:** 修复因为 header 的 key 内带有‘-’字符串导致的 row 和 col id 识别错误 ([#1234](https://github.com/antvis/S2/issues/1234)) ([b685c95](https://github.com/antvis/S2/commit/b685c95adaa190a0491e32a902bc5aa2f3463704))
* **facet:** getIndexRangeWithOffsets return correct value with equal min and max height ([#1218](https://github.com/antvis/S2/issues/1218)) ([f99d104](https://github.com/antvis/S2/commit/f99d1041e5ec7a66dd3a3b6d12fa8baa0c13f27b))
* 修复 backgroundColorOpacity 不生效问题，close [#1201](https://github.com/antvis/S2/issues/1201) ([#1244](https://github.com/antvis/S2/issues/1244)) ([e7ff60d](https://github.com/antvis/S2/commit/e7ff60d266c4cefee38c88e30cc21e75d5283572))
* 更改 remapping 字段顺序 ([#1246](https://github.com/antvis/S2/issues/1246)) ([f0ffe28](https://github.com/antvis/S2/commit/f0ffe28f0d731e2cb45527a598fc461d5a13395f))
* 行头文字右对齐未展示 icon ([#1215](https://github.com/antvis/S2/issues/1215)) ([f37ee0e](https://github.com/antvis/S2/commit/f37ee0ef3665aa7edfd2dec10083397af815a91d))

### Features

* update brush interactiontest case ([#1239](https://github.com/antvis/S2/issues/1239)) ([604abba](https://github.com/antvis/S2/commit/604abba188a04f90b4eb12f9b4fc46a90b46a75a))
* 支持自定义角头的虚拟数值字段文本 close [#1212](https://github.com/antvis/S2/issues/1212) ([#1223](https://github.com/antvis/S2/issues/1223)) ([84bc978](https://github.com/antvis/S2/commit/84bc9786bf1391a9e7afd21888618403e7f786d3))
* 添加行头和列头的格式化功能 ([#1219](https://github.com/antvis/S2/issues/1219)) ([f375f58](https://github.com/antvis/S2/commit/f375f58d37aa2901df0ceed31ec919ad0ae09a4f))

# [@antv/s2-v1.13.1](https://github.com/antvis/S2/compare/@antv/s2-v1.13.0...@antv/s2-v1.13.1) (2022-03-25)

### Features

* **interaction:** 支持透传 addEventListener 的可选参数 ([#1262](https://github.com/antvis/S2/issues/1262)) ([d6bc064](https://github.com/antvis/S2/commit/d6bc064e971f8e0a18e8590931f6bff8fadabe44))

# [@antv/s2-v1.15.0-alpha.3](https://github.com/antvis/S2/compare/@antv/s2-v1.15.0-alpha.2...@antv/s2-v1.15.0-alpha.3) (2022-04-15)

### Bug Fixes

* 修复交叉表分页问题 ([#1260](https://github.com/antvis/S2/issues/1260)) ([a8142b9](https://github.com/antvis/S2/commit/a8142b961e7c839a2de60aea232209f815f5d32d))

### Features

* **copy:** 添加复制全部 复制行 复制列功能 ([#1253](https://github.com/antvis/S2/issues/1253)) ([6fa2144](https://github.com/antvis/S2/commit/6fa21443cb81d43379955a28c7afac7a2ed4d809))
* **interaction:** 支持行列头反选 ([#1256](https://github.com/antvis/S2/issues/1256)) ([9544706](https://github.com/antvis/S2/commit/9544706bbf017d425506016fbd23af89e76c5824))

# [@antv/s2-v1.15.0-alpha.2](https://github.com/antvis/S2/compare/@antv/s2-v1.15.0-alpha.1...@antv/s2-v1.15.0-alpha.2) (2022-04-13)

### Bug Fixes

* **row-column-resize:** 修复虚线宽度设置不生效问题 ([#1250](https://github.com/antvis/S2/issues/1250)) ([a1810b9](https://github.com/antvis/S2/commit/a1810b94e48792ae4399c155e33573fa72ec0e0e))
* **s2:** 如果是 table mode，列头不需要被格式化 ([#1249](https://github.com/antvis/S2/issues/1249)) ([d3141d3](https://github.com/antvis/S2/commit/d3141d3b2ca5bc8a68e7333e3e8f720bc121e52d))

# [@antv/s2-v1.15.0-alpha.1](https://github.com/antvis/S2/compare/@antv/s2-v1.14.0...@antv/s2-v1.15.0-alpha.1) (2022-04-11)

### Bug Fixes

* 修复 lint 报错 ([cbba5d9](https://github.com/antvis/S2/commit/cbba5d9c3ef0dee5026472aac51b3c0e13eadda2))

### Features

* hsl 分量作用方式从 ([2edce7b](https://github.com/antvis/S2/commit/2edce7be4d7e0cf7719dc3988d3a6d6b34ec0b86))
* 固定背景色 ([3c24dad](https://github.com/antvis/S2/commit/3c24dadd93409c648aa417ee0e261c744a016081))
* 增加搜索高亮交互状态及主题色 ([#1240](https://github.com/antvis/S2/issues/1240)) ([0897888](https://github.com/antvis/S2/commit/0897888772172b1afe38f815d95994433cc68915))
* 增加根据主题色生成对应主题风格色板功能 ([9928227](https://github.com/antvis/S2/commit/992822784d65611eed2a1aa80d685e1b0a6d48c3))

# [@antv/s2-v1.14.0](https://github.com/antvis/S2/compare/@antv/s2-v1.13.1...@antv/s2-v1.14.0) (2022-04-08)

### Bug Fixes

* **copy:** 修复因为 header 的 key 内带有‘-’字符串导致的 row 和 col id 识别错误 ([#1234](https://github.com/antvis/S2/issues/1234)) ([b685c95](https://github.com/antvis/S2/commit/b685c95adaa190a0491e32a902bc5aa2f3463704))
* **facet:** getIndexRangeWithOffsets return correct value with equal min and max height ([#1218](https://github.com/antvis/S2/issues/1218)) ([f99d104](https://github.com/antvis/S2/commit/f99d1041e5ec7a66dd3a3b6d12fa8baa0c13f27b))
* 修复 backgroundColorOpacity 不生效问题，close [#1201](https://github.com/antvis/S2/issues/1201) ([#1244](https://github.com/antvis/S2/issues/1244)) ([e7ff60d](https://github.com/antvis/S2/commit/e7ff60d266c4cefee38c88e30cc21e75d5283572))
* 更改 remapping 字段顺序 ([#1246](https://github.com/antvis/S2/issues/1246)) ([f0ffe28](https://github.com/antvis/S2/commit/f0ffe28f0d731e2cb45527a598fc461d5a13395f))
* 行头文字右对齐未展示 icon ([#1215](https://github.com/antvis/S2/issues/1215)) ([f37ee0e](https://github.com/antvis/S2/commit/f37ee0ef3665aa7edfd2dec10083397af815a91d))

### Features

* update brush interactiontest case ([#1239](https://github.com/antvis/S2/issues/1239)) ([604abba](https://github.com/antvis/S2/commit/604abba188a04f90b4eb12f9b4fc46a90b46a75a))
* 支持自定义角头的虚拟数值字段文本 close [#1212](https://github.com/antvis/S2/issues/1212) ([#1223](https://github.com/antvis/S2/issues/1223)) ([84bc978](https://github.com/antvis/S2/commit/84bc9786bf1391a9e7afd21888618403e7f786d3))
* 添加行头和列头的格式化功能 ([#1219](https://github.com/antvis/S2/issues/1219)) ([f375f58](https://github.com/antvis/S2/commit/f375f58d37aa2901df0ceed31ec919ad0ae09a4f))

# [@antv/s2-v1.13.1](https://github.com/antvis/S2/compare/@antv/s2-v1.13.0...@antv/s2-v1.13.1) (2022-03-25)

### Bug Fixes

* **copy:** 修复因为 header 的 key 内带有‘-’字符串导致的 row 和 col id 识别错误 ([#1234](https://github.com/antvis/S2/issues/1234)) ([b685c95](https://github.com/antvis/S2/commit/b685c95adaa190a0491e32a902bc5aa2f3463704))

### Features

* update brush interactiontest case ([#1239](https://github.com/antvis/S2/issues/1239)) ([604abba](https://github.com/antvis/S2/commit/604abba188a04f90b4eb12f9b4fc46a90b46a75a))
* 增加搜索高亮交互状态及主题色 ([#1240](https://github.com/antvis/S2/issues/1240)) ([0897888](https://github.com/antvis/S2/commit/0897888772172b1afe38f815d95994433cc68915))
* 支持自定义角头的虚拟数值字段文本 close [#1212](https://github.com/antvis/S2/issues/1212) ([#1223](https://github.com/antvis/S2/issues/1223)) ([84bc978](https://github.com/antvis/S2/commit/84bc9786bf1391a9e7afd21888618403e7f786d3))

# [@antv/s2-v1.14.0-alpha.3](https://github.com/antvis/S2/compare/@antv/s2-v1.14.0-alpha.2...@antv/s2-v1.14.0-alpha.3) (2022-04-01)

### Features

* hsl 分量作用方式从 ([2edce7b](https://github.com/antvis/S2/commit/2edce7be4d7e0cf7719dc3988d3a6d6b34ec0b86))

# [@antv/s2-v1.14.0-alpha.2](https://github.com/antvis/S2/compare/@antv/s2-v1.14.0-alpha.1...@antv/s2-v1.14.0-alpha.2) (2022-03-29)

### Bug Fixes

* **facet:** getIndexRangeWithOffsets return correct value with equal min and max height ([#1218](https://github.com/antvis/S2/issues/1218)) ([f99d104](https://github.com/antvis/S2/commit/f99d1041e5ec7a66dd3a3b6d12fa8baa0c13f27b))
* **table-facet:** 修复 row 高度大于 canvas 高度后导致的 index 计算错误 ([#1208](https://github.com/antvis/S2/issues/1208)) ([06983bc](https://github.com/antvis/S2/commit/06983bc847cebb02c416e3c13279cc763a3d2d4a))
* 修复以行列总计依赖度量汇总排序失败问题。 ([#1167](https://github.com/antvis/S2/issues/1167)) ([be3e650](https://github.com/antvis/S2/commit/be3e6503a4ae9d658afea7b1f4f5ce9aed5e75b9))
* 修复趋势分析表 label 文字对齐问题 ([#1205](https://github.com/antvis/S2/issues/1205)) ([22e954f](https://github.com/antvis/S2/commit/22e954f32644b0658c05edd595c8b4e4f682b132))
* 单元格内换行存在"字符 ([#1210](https://github.com/antvis/S2/issues/1210)) ([f1e1e5b](https://github.com/antvis/S2/commit/f1e1e5bbe167bc0cdfb8469d33deb94061629b6e))
* 行列头多选支持 Ctrl 键 ([#1207](https://github.com/antvis/S2/issues/1207)) ([bf9c11b](https://github.com/antvis/S2/commit/bf9c11b0863153fd86d07a72fc5c96d0408d216b))
* 行头文字右对齐未展示 icon ([#1215](https://github.com/antvis/S2/issues/1215)) ([f37ee0e](https://github.com/antvis/S2/commit/f37ee0ef3665aa7edfd2dec10083397af815a91d))

### Features

* 添加行头和列头的格式化功能 ([#1219](https://github.com/antvis/S2/issues/1219)) ([f375f58](https://github.com/antvis/S2/commit/f375f58d37aa2901df0ceed31ec919ad0ae09a4f))

# [@antv/s2-v1.13.1](https://github.com/antvis/S2/compare/@antv/s2-v1.13.0...@antv/s2-v1.13.1) (2022-03-25)

### Bug Fixes

* **table-facet:** 修复 row 高度大于 canvas 高度后导致的 index 计算错误 ([#1208](https://github.com/antvis/S2/issues/1208)) ([06983bc](https://github.com/antvis/S2/commit/06983bc847cebb02c416e3c13279cc763a3d2d4a))
* 修复以行列总计依赖度量汇总排序失败问题。 ([#1167](https://github.com/antvis/S2/issues/1167)) ([be3e650](https://github.com/antvis/S2/commit/be3e6503a4ae9d658afea7b1f4f5ce9aed5e75b9))
* 修复趋势分析表 label 文字对齐问题 ([#1205](https://github.com/antvis/S2/issues/1205)) ([22e954f](https://github.com/antvis/S2/commit/22e954f32644b0658c05edd595c8b4e4f682b132))
* 单元格内换行存在"字符 ([#1210](https://github.com/antvis/S2/issues/1210)) ([f1e1e5b](https://github.com/antvis/S2/commit/f1e1e5bbe167bc0cdfb8469d33deb94061629b6e))
* 未开启自适应，改变浏览器窗口大小，会导致表格重新渲染 close [#1197](https://github.com/antvis/S2/issues/1197) ([#1200](https://github.com/antvis/S2/issues/1200)) ([cfb8eaa](https://github.com/antvis/S2/commit/cfb8eaa5e07490a4935959f714efa33252ddc19a))
* 行列头多选支持 Ctrl 键 ([#1207](https://github.com/antvis/S2/issues/1207)) ([bf9c11b](https://github.com/antvis/S2/commit/bf9c11b0863153fd86d07a72fc5c96d0408d216b))

# [@antv/s2-v1.13.0](https://github.com/antvis/S2/compare/@antv/s2-v1.12.2...@antv/s2-v1.13.0) (2022-03-18)

### Features

* 固定背景色 ([3c24dad](https://github.com/antvis/S2/commit/3c24dadd93409c648aa417ee0e261c744a016081))

* # 增加根据主题色生成对应主题风格色板功能 ([9928227](https://github.com/antvis/S2/commit/992822784d65611eed2a1aa80d685e1b0a6d48c3))

# [@antv/s2-v1.13.1](https://github.com/antvis/S2/compare/@antv/s2-v1.13.0...@antv/s2-v1.13.1) (2022-03-25)

### Features

* 固定背景色 ([3c24dad](https://github.com/antvis/S2/commit/3c24dadd93409c648aa417ee0e261c744a016081))

* # 增加根据主题色生成对应主题风格色板功能 ([9928227](https://github.com/antvis/S2/commit/992822784d65611eed2a1aa80d685e1b0a6d48c3))

* **table-facet:** 修复 row 高度大于 canvas 高度后导致的 index 计算错误 ([#1208](https://github.com/antvis/S2/issues/1208)) ([06983bc](https://github.com/antvis/S2/commit/06983bc847cebb02c416e3c13279cc763a3d2d4a))

* 修复以行列总计依赖度量汇总排序失败问题。 ([#1167](https://github.com/antvis/S2/issues/1167)) ([be3e650](https://github.com/antvis/S2/commit/be3e6503a4ae9d658afea7b1f4f5ce9aed5e75b9))
* 修复趋势分析表 label 文字对齐问题 ([#1205](https://github.com/antvis/S2/issues/1205)) ([22e954f](https://github.com/antvis/S2/commit/22e954f32644b0658c05edd595c8b4e4f682b132))
* 单元格内换行存在"字符 ([#1210](https://github.com/antvis/S2/issues/1210)) ([f1e1e5b](https://github.com/antvis/S2/commit/f1e1e5bbe167bc0cdfb8469d33deb94061629b6e))
* 未开启自适应，改变浏览器窗口大小，会导致表格重新渲染 close [#1197](https://github.com/antvis/S2/issues/1197) ([#1200](https://github.com/antvis/S2/issues/1200)) ([cfb8eaa](https://github.com/antvis/S2/commit/cfb8eaa5e07490a4935959f714efa33252ddc19a))
* 行列头多选支持 Ctrl 键 ([#1207](https://github.com/antvis/S2/issues/1207)) ([bf9c11b](https://github.com/antvis/S2/commit/bf9c11b0863153fd86d07a72fc5c96d0408d216b))

# [@antv/s2-v1.13.0](https://github.com/antvis/S2/compare/@antv/s2-v1.12.2...@antv/s2-v1.13.0) (2022-03-18)

### Bug Fixes

* invalid input for getIndexRange ([#1196](https://github.com/antvis/S2/issues/1196)) ([e6d47fa](https://github.com/antvis/S2/commit/e6d47fa441ea5f5a5b4d2400041a6a072dc154fa))
* **react:** 修复宽高改变后未重新渲染表格的问题 close [#1193](https://github.com/antvis/S2/issues/1193) ([#1194](https://github.com/antvis/S2/issues/1194)) ([7a1887f](https://github.com/antvis/S2/commit/7a1887ff8527160b6114b24ff944c987505277fb))
* 修复 linkTextFill 不生效的问题，close [#1191](https://github.com/antvis/S2/issues/1191) ([#1192](https://github.com/antvis/S2/issues/1192)) ([0f0f98e](https://github.com/antvis/S2/commit/0f0f98e09de72d5b766e7b52495a809b3720ab52))
* 修复一些包之间的依赖问题 ([#1140](https://github.com/antvis/S2/issues/1140)) ([1952ecf](https://github.com/antvis/S2/commit/1952ecf070b4b6c1271c3bb6bfc5c37da9f08b6a))
* 支持 Ctrl 键触发多选 Cell ([#1184](https://github.com/antvis/S2/issues/1184)) ([5a0cb7b](https://github.com/antvis/S2/commit/5a0cb7bcaa414bb707b184f1ff9805fe524db3c7))
* 明细表 layoutCoordinate 问题、样式取值问题、resize options 读取问题修复 ([#1182](https://github.com/antvis/S2/issues/1182)) ([f32d36a](https://github.com/antvis/S2/commit/f32d36adf45117c7978e1a7e66400d8505c9517e))

### Features

* **derection:** 方向键加快捷键操作 ([#1171](https://github.com/antvis/S2/issues/1171)) ([2773900](https://github.com/antvis/S2/commit/2773900de8ee7a29911cde101798c8547bed78ac))
* 趋势分析表支持列展示不同数量的指标 ([#1185](https://github.com/antvis/S2/issues/1185)) ([5692176](https://github.com/antvis/S2/commit/569217685e92b87e69bab6741422a23ea603cd45))

# [@antv/s2-v1.12.2](https://github.com/antvis/S2/compare/@antv/s2-v1.12.1...@antv/s2-v1.12.2) (2022-03-16)

### Bug Fixes

* 指标列头对齐样式修复升级 ([f4e4b29](https://github.com/antvis/S2/commit/f4e4b298e556ae96b902e4839f680802ccec19ae))

# [@antv/s2-v1.12.1](https://github.com/antvis/S2/compare/@antv/s2-v1.12.0...@antv/s2-v1.12.1) (2022-03-15)

### Bug Fixes

* 修复 draggable 事件失效问题 close[#1172](https://github.com/antvis/S2/issues/1172) ([#1173](https://github.com/antvis/S2/issues/1173)) ([0e8373c](https://github.com/antvis/S2/commit/0e8373c140a4afa9602ac623cc40ae67f9dbe02b))

# [@antv/s2-v1.12.0](https://github.com/antvis/S2/compare/@antv/s2-v1.11.0...@antv/s2-v1.12.0) (2022-03-11)

### Bug Fixes

* 明细表排序 API 和透视表对齐 ([#1154](https://github.com/antvis/S2/issues/1154)) ([ff524ab](https://github.com/antvis/S2/commit/ff524ab49a1782f5b59d8650b5db2eef016a7c5f))

### Features

* **interaction:** 框选下拉支持自动滚动 ([#1147](https://github.com/antvis/S2/issues/1147)) ([39a860b](https://github.com/antvis/S2/commit/39a860bf8a5aea6a8f52b8035ece50c8c65ff58b))
* **totals:** 增加前端 totals 计算方式 ([#1157](https://github.com/antvis/S2/issues/1157)) ([4dd635d](https://github.com/antvis/S2/commit/4dd635ddda9c4978567300586ef85ba7ad14ebed))
* 列头滚动场景下非维度文字支持左/右对齐 ([#1152](https://github.com/antvis/S2/issues/1152)) ([b52885c](https://github.com/antvis/S2/commit/b52885c1ced80a1da11c3cac273b8e5639cff63c))

# [@antv/s2-v1.11.0](https://github.com/antvis/S2/compare/@antv/s2-v1.10.0...@antv/s2-v1.11.0) (2022-03-01)

### Bug Fixes

* :bug: 趋势分析表主题调优 ([#1148](https://github.com/antvis/S2/issues/1148)) ([4335c7c](https://github.com/antvis/S2/commit/4335c7ca2b00ed8c5e495bf5b8883a7a44b3ace6))
* **copy:** 当异步复制失败时降级为同步复制 ([#1125](https://github.com/antvis/S2/issues/1125)) ([009449f](https://github.com/antvis/S2/commit/009449f1d7aa3dcb78d93bdc57e337fd7e6c170f))
* corner 事件监听失效（之前只有点击文字时生效） ([#1131](https://github.com/antvis/S2/issues/1131)) ([d0215dc](https://github.com/antvis/S2/commit/d0215dccb536043752162a359a5f4d93cbf9a715))
* **interaction:** 修复开启复制后，无法复制表格外的文字 ([#1134](https://github.com/antvis/S2/issues/1134)) ([333c3ac](https://github.com/antvis/S2/commit/333c3ac596e90ada8ef7fbfb80082deb99bfd523))
* 不添加总计时错误地添加了小计节点 ([#1111](https://github.com/antvis/S2/issues/1111)) ([65739aa](https://github.com/antvis/S2/commit/65739aa9768bb281b89230c4de699e2a06073892))
* 修复头部 cell 错误使用 meta 中 formatter 的问题，close [#1014](https://github.com/antvis/S2/issues/1014) ([#1120](https://github.com/antvis/S2/issues/1120)) ([bf2a4ae](https://github.com/antvis/S2/commit/bf2a4ae55e185e0d0ea8567f0ba8b264f1071183))
* 修复对全局鼠标按下事件的污染 ([#1132](https://github.com/antvis/S2/issues/1132)) ([3d0bb55](https://github.com/antvis/S2/commit/3d0bb55089211e48072b345314f37e4c94b9ba0f))
* 修复行头为空无默认角头指标文字问题 ([#1104](https://github.com/antvis/S2/issues/1104)) ([62e94af](https://github.com/antvis/S2/commit/62e94af75473f64aea606d831baa112d5e85cc4e))
* 增加行头收起展开按钮回调事件的透传参数 ([#1121](https://github.com/antvis/S2/issues/1121)) ([300a253](https://github.com/antvis/S2/commit/300a2538446a07ebfcd0c6355966e89c925529a0))
* 明细表锁行/列时分割线阴影显隐逻辑 ([#1123](https://github.com/antvis/S2/issues/1123)) ([16895de](https://github.com/antvis/S2/commit/16895de1ee7fea16949bc5b5c43a8f2fdaf71e78))
* 梳理单元格对齐方式，close [#1084](https://github.com/antvis/S2/issues/1084) ([#1128](https://github.com/antvis/S2/issues/1128)) ([58f0573](https://github.com/antvis/S2/commit/58f05737a275e759711d31afdee05bebe1b5829b))

### Features

* :sparkles: 允许用户自定义行头单元格宽度 ([#1135](https://github.com/antvis/S2/issues/1135)) ([a5e7f6f](https://github.com/antvis/S2/commit/a5e7f6f5fdd46129c6daf76d2b563a6aa9684196))
* :sparkles: 多指标支持切换文本水对齐方式 ([#1146](https://github.com/antvis/S2/issues/1146)) ([32cbf38](https://github.com/antvis/S2/commit/32cbf38786b27ededbf32b996e0ddc7e0439a963))
* :sparkles: 支持覆盖默认 icon ([#1130](https://github.com/antvis/S2/issues/1130)) ([6d8857d](https://github.com/antvis/S2/commit/6d8857d69fb54ad79ec7ce12a7fe07c17f790c5a))
* adaptive 的 container 自适应包含 header 和 page ([#1133](https://github.com/antvis/S2/issues/1133)) ([988d356](https://github.com/antvis/S2/commit/988d3563ffa23b195fd90fd9ff45cb16dab10a76))
* **interaction:** 透视表支持隐藏列头 ([#1081](https://github.com/antvis/S2/issues/1081)) ([d770a99](https://github.com/antvis/S2/commit/d770a997ae88d9d7f2167aab52d07a5b6de82db6))
* **tooltip:** tooltip 自定义操作项点击事件透出 cell 信息 close [#1106](https://github.com/antvis/S2/issues/1106) ([#1107](https://github.com/antvis/S2/issues/1107)) ([c266e02](https://github.com/antvis/S2/commit/c266e02d8c6665dfda2d469dcfdb10ed3cffd81c))
* **tooltip:** 支持自定义挂载节点 ([#1139](https://github.com/antvis/S2/issues/1139)) ([8aa4778](https://github.com/antvis/S2/commit/8aa4778186e23d695752400c1971e89b39e8978a))

# [@antv/s2-v1.10.0](https://github.com/antvis/S2/compare/@antv/s2-v1.9.1...@antv/s2-v1.10.0) (2022-02-28)

### Bug Fixes

* **copy:** 当异步复制失败时降级为同步复制 ([#1125](https://github.com/antvis/S2/issues/1125)) ([43b469a](https://github.com/antvis/S2/commit/43b469ac88fe712723e4032741a8aabdf5fb02c2))
* corner 事件监听失效（之前只有点击文字时生效） ([#1131](https://github.com/antvis/S2/issues/1131)) ([65fda32](https://github.com/antvis/S2/commit/65fda3250f28921728f064dafa2ae98b92b6c455))
* **interaction:** 修复开启复制后，无法复制表格外的文字 ([#1134](https://github.com/antvis/S2/issues/1134)) ([75460ab](https://github.com/antvis/S2/commit/75460ab10267b80ee52dea63e02d9f5f28fc796f))
* 不添加总计时错误地添加了小计节点 ([#1111](https://github.com/antvis/S2/issues/1111)) ([fd4e718](https://github.com/antvis/S2/commit/fd4e7184aa3fe2a0af75e40f2a169e17b75b7f33))
* 修复头部 cell 错误使用 meta 中 formatter 的问题，close [#1014](https://github.com/antvis/S2/issues/1014) ([#1120](https://github.com/antvis/S2/issues/1120)) ([4191806](https://github.com/antvis/S2/commit/41918067b521398ef668f222a76efccbce952d03))
* 修复对全局鼠标按下事件的污染 ([#1132](https://github.com/antvis/S2/issues/1132)) ([98f9ae6](https://github.com/antvis/S2/commit/98f9ae6aa4f9b3bf5437a81b6cbc77289df41ac3))
* 修复行头为空无默认角头指标文字问题 ([#1104](https://github.com/antvis/S2/issues/1104)) ([9866de3](https://github.com/antvis/S2/commit/9866de31a72644e19373436f356c4791caee6d1e))
* 增加行头收起展开按钮回调事件的透传参数 ([#1121](https://github.com/antvis/S2/issues/1121)) ([9a78d71](https://github.com/antvis/S2/commit/9a78d715083686f8d69c358d9a9b95c748cc8af7))
* 明细表锁行/列时分割线阴影显隐逻辑 ([#1123](https://github.com/antvis/S2/issues/1123)) ([b31a491](https://github.com/antvis/S2/commit/b31a4918e4eeee5e20ba77244345ae4c937bc02a))
* 梳理单元格对齐方式，close [#1084](https://github.com/antvis/S2/issues/1084) ([#1128](https://github.com/antvis/S2/issues/1128)) ([8929226](https://github.com/antvis/S2/commit/8929226a714331fa2359fc7a9afc40c991c6c444))

### Features

* :sparkles: 允许用户自定义行头单元格宽度 ([#1135](https://github.com/antvis/S2/issues/1135)) ([f990bc2](https://github.com/antvis/S2/commit/f990bc2df129cc092f2cbfd00b7c2ee5ba8d2977))
* :sparkles: 支持覆盖默认 icon ([#1130](https://github.com/antvis/S2/issues/1130)) ([9d48bf4](https://github.com/antvis/S2/commit/9d48bf48fad5dec33fee94244a6f0aacf2457162))
* adaptive 的 container 自适应包含 header 和 page ([#1133](https://github.com/antvis/S2/issues/1133)) ([407b495](https://github.com/antvis/S2/commit/407b495d465ec9ff8d52f5d1c21a100370bd2a7e))
* **interaction:** 透视表支持隐藏列头 ([#1081](https://github.com/antvis/S2/issues/1081)) ([bc44978](https://github.com/antvis/S2/commit/bc44978c56321e8e7d14728112edf07e24e2318a))
* **tooltip:** tooltip 自定义操作项点击事件透出 cell 信息 close [#1106](https://github.com/antvis/S2/issues/1106) ([#1107](https://github.com/antvis/S2/issues/1107)) ([259955d](https://github.com/antvis/S2/commit/259955d29ee1ac1395761add9520a78dbe5e6c6f))
* **tooltip:** 支持自定义挂载节点 ([#1139](https://github.com/antvis/S2/issues/1139)) ([b438554](https://github.com/antvis/S2/commit/b438554a193e7df94edea2334268daa3bb2e0577))

# [@antv/s2-v1.9.1](https://github.com/antvis/S2/compare/@antv/s2-v1.9.0...@antv/s2-v1.9.1) (2022-02-17)

### Bug Fixes

* 回退排序筛选事件变量名 ([#1097](https://github.com/antvis/S2/issues/1097)) ([9eeb1cd](https://github.com/antvis/S2/commit/9eeb1cdafdd051834383a1423583e221388a581e))
* 明细表增加排序事件回调 close[#1087](https://github.com/antvis/S2/issues/1087) ([#1099](https://github.com/antvis/S2/issues/1099)) ([bfccdc3](https://github.com/antvis/S2/commit/bfccdc31012c3653af25b07b3e6eede029f9a5bb))

# [@antv/s2-v1.9.0](https://github.com/antvis/S2/compare/@antv/s2-v1.8.0...@antv/s2-v1.9.0) (2022-02-16)

### Features

* :sparkles: 允许用户自定义行头单元格宽度 ([#1135](https://github.com/antvis/S2/issues/1135)) ([f990bc2](https://github.com/antvis/S2/commit/f990bc2df129cc092f2cbfd00b7c2ee5ba8d2977))
* :sparkles: 支持覆盖默认 icon ([#1130](https://github.com/antvis/S2/issues/1130)) ([9d48bf4](https://github.com/antvis/S2/commit/9d48bf48fad5dec33fee94244a6f0aacf2457162))
* adaptive 的 container 自适应包含 header 和 page ([#1133](https://github.com/antvis/S2/issues/1133)) ([407b495](https://github.com/antvis/S2/commit/407b495d465ec9ff8d52f5d1c21a100370bd2a7e))
* **interaction:** 透视表支持隐藏列头 ([#1081](https://github.com/antvis/S2/issues/1081)) ([bc44978](https://github.com/antvis/S2/commit/bc44978c56321e8e7d14728112edf07e24e2318a))
* **tooltip:** tooltip 自定义操作项点击事件透出 cell 信息 close [#1106](https://github.com/antvis/S2/issues/1106) ([#1107](https://github.com/antvis/S2/issues/1107)) ([259955d](https://github.com/antvis/S2/commit/259955d29ee1ac1395761add9520a78dbe5e6c6f))
* **tooltip:** 支持自定义挂载节点 ([#1139](https://github.com/antvis/S2/issues/1139)) ([b438554](https://github.com/antvis/S2/commit/b438554a193e7df94edea2334268daa3bb2e0577))

# [@antv/s2-v1.9.1](https://github.com/antvis/S2/compare/@antv/s2-v1.9.0...@antv/s2-v1.9.1) (2022-02-17)

### Bug Fixes

* 回退排序筛选事件变量名 ([#1097](https://github.com/antvis/S2/issues/1097)) ([9eeb1cd](https://github.com/antvis/S2/commit/9eeb1cdafdd051834383a1423583e221388a581e))
* 明细表增加排序事件回调 close[#1087](https://github.com/antvis/S2/issues/1087) ([#1099](https://github.com/antvis/S2/issues/1099)) ([bfccdc3](https://github.com/antvis/S2/commit/bfccdc31012c3653af25b07b3e6eede029f9a5bb))

# [@antv/s2-v1.9.0](https://github.com/antvis/S2/compare/@antv/s2-v1.8.0...@antv/s2-v1.9.0) (2022-02-16)

### Features

* Meta 内 formatter 增加入参提供完整数据 close [#994](https://github.com/antvis/S2/issues/994) ([#1085](https://github.com/antvis/S2/issues/1085)) ([c4f3c47](https://github.com/antvis/S2/commit/c4f3c47b75dd0e97319f32a17c6596b5b4922f9b))
* s2-react 全量透出事件回调函数 ([#1092](https://github.com/antvis/S2/issues/1092)) ([7e5fe5d](https://github.com/antvis/S2/commit/7e5fe5db5df582966df4ecdc1bb96a33e139a979))
* 全量展示小计项 ([#1086](https://github.com/antvis/S2/issues/1086)) ([ae24364](https://github.com/antvis/S2/commit/ae24364585424f11417eb7814744f90f736e3bda))

# [@antv/s2-v1.8.0](https://github.com/antvis/S2/compare/@antv/s2-v1.7.0...@antv/s2-v1.8.0) (2022-02-11)

### Bug Fixes

* table 模式下的序列号兼容 ([#1048](https://github.com/antvis/S2/issues/1048)) ([22d3009](https://github.com/antvis/S2/commit/22d300994bfd2eabc8b3459c4288da9b63ba1c3d))
* 修复子节点收起后角头全部展开收起不生效 close [#1072](https://github.com/antvis/S2/issues/1072) ([#1074](https://github.com/antvis/S2/issues/1074)) ([6f70f38](https://github.com/antvis/S2/commit/6f70f389fe8a0825dfc80cac871e25adc45280ad))
* 只在移动端绑定 tap 事件，防止多次触发 collapse 事件 ([#1060](https://github.com/antvis/S2/issues/1060)) ([31f3f68](https://github.com/antvis/S2/commit/31f3f68fcf414d8945bea2f24c820d2d06275de2))
* 当不同父节点下存在相同子节点时高级排序出错 close [#1065](https://github.com/antvis/S2/issues/1065) ([#1066](https://github.com/antvis/S2/issues/1066)) ([b561ac4](https://github.com/antvis/S2/commit/b561ac48f2e06a0f252e62edcfdc67839fe2689c))
* 透视表无序未按原顺序展示问题 ([#1053](https://github.com/antvis/S2/issues/1053)) ([62db4a6](https://github.com/antvis/S2/commit/62db4a681a4da306241c888ab2754441cad29817))

### Features

* ✨ 新趋势分析表 ([#1080](https://github.com/antvis/S2/issues/1080)) ([f88fefb](https://github.com/antvis/S2/commit/f88fefbabc2df1226ef9484d4848aa77db833b67)), closes [#869](https://github.com/antvis/S2/issues/869) [#871](https://github.com/antvis/S2/issues/871) [#876](https://github.com/antvis/S2/issues/876) [#873](https://github.com/antvis/S2/issues/873) [#878](https://github.com/antvis/S2/issues/878) [#897](https://github.com/antvis/S2/issues/897) [#890](https://github.com/antvis/S2/issues/890) [#892](https://github.com/antvis/S2/issues/892) [#906](https://github.com/antvis/S2/issues/906) [#905](https://github.com/antvis/S2/issues/905) [#908](https://github.com/antvis/S2/issues/908) [#916](https://github.com/antvis/S2/issues/916) [#913](https://github.com/antvis/S2/issues/913) [#898](https://github.com/antvis/S2/issues/898) [#902](https://github.com/antvis/S2/issues/902) [#907](https://github.com/antvis/S2/issues/907) [#910](https://github.com/antvis/S2/issues/910) [#919](https://github.com/antvis/S2/issues/919) [#925](https://github.com/antvis/S2/issues/925) [#927](https://github.com/antvis/S2/issues/927) [#929](https://github.com/antvis/S2/issues/929) [#944](https://github.com/antvis/S2/issues/944) [#946](https://github.com/antvis/S2/issues/946) [#958](https://github.com/antvis/S2/issues/958) [#964](https://github.com/antvis/S2/issues/964) [#961](https://github.com/antvis/S2/issues/961) [#970](https://github.com/antvis/S2/issues/970) [#974](https://github.com/antvis/S2/issues/974) [#984](https://github.com/antvis/S2/issues/984) [#986](https://github.com/antvis/S2/issues/986) [#991](https://github.com/antvis/S2/issues/991) [#995](https://github.com/antvis/S2/issues/995) [#996](https://github.com/antvis/S2/issues/996) [#1003](https://github.com/antvis/S2/issues/1003) [#1005](https://github.com/antvis/S2/issues/1005) [#990](https://github.com/antvis/S2/issues/990) [#992](https://github.com/antvis/S2/issues/992) [#993](https://github.com/antvis/S2/issues/993) [#997](https://github.com/antvis/S2/issues/997) [#972](https://github.com/antvis/S2/issues/972) [#1001](https://github.com/antvis/S2/issues/1001) [#1002](https://github.com/antvis/S2/issues/1002) [#1007](https://github.com/antvis/S2/issues/1007) [#1010](https://github.com/antvis/S2/issues/1010) [#1019](https://github.com/antvis/S2/issues/1019) [#1015](https://github.com/antvis/S2/issues/1015) [#1023](https://github.com/antvis/S2/issues/1023) [#1024](https://github.com/antvis/S2/issues/1024) [#1030](https://github.com/antvis/S2/issues/1030) [#1046](https://github.com/antvis/S2/issues/1046) [#1049](https://github.com/antvis/S2/issues/1049) [#1052](https://github.com/antvis/S2/issues/1052) [#1058](https://github.com/antvis/S2/issues/1058) [#1059](https://github.com/antvis/S2/issues/1059) [#1062](https://github.com/antvis/S2/issues/1062) [#1063](https://github.com/antvis/S2/issues/1063) [#1064](https://github.com/antvis/S2/issues/1064) [#1067](https://github.com/antvis/S2/issues/1067) [#1069](https://github.com/antvis/S2/issues/1069) [#1070](https://github.com/antvis/S2/issues/1070) [#1071](https://github.com/antvis/S2/issues/1071) [#1073](https://github.com/antvis/S2/issues/1073) [#1076](https://github.com/antvis/S2/issues/1076) [#1075](https://github.com/antvis/S2/issues/1075) [#1077](https://github.com/antvis/S2/issues/1077)
* copy with grid pivot sheet ([#1045](https://github.com/antvis/S2/issues/1045)) ([17c0aa6](https://github.com/antvis/S2/commit/17c0aa6ea1afa05c13b140e8c7fc8ed9f11c57d0))
* refactor mobile scrolling ([#1061](https://github.com/antvis/S2/issues/1061)) ([bf995e3](https://github.com/antvis/S2/commit/bf995e3ccb93d86f2966ba6a0190cb3b84818833))
* 支持自定义设备像素比 ([#1054](https://github.com/antvis/S2/issues/1054)) ([49ac6ac](https://github.com/antvis/S2/commit/49ac6ac3a259d3622a064333213b9a352ea344bb))

# [@antv/s2-v1.7.0](https://github.com/antvis/S2/compare/@antv/s2-v1.6.0...@antv/s2-v1.7.0) (2022-01-24)

### Bug Fixes

* **facet:** scroll speed options & pagination totals ([#1031](https://github.com/antvis/S2/issues/1031)) ([2082c22](https://github.com/antvis/S2/commit/2082c22950a0bfb043cfdf8ed37c28328b1e3b93))
* **facet:** 序号列应早于列头添加到 group ([#1040](https://github.com/antvis/S2/issues/1040)) ([0f82076](https://github.com/antvis/S2/commit/0f82076aabfaa874cd0b88f6554da3422676d61a))
* **interactive:** table move problem ([#1013](https://github.com/antvis/S2/issues/1013)) ([f73a1c9](https://github.com/antvis/S2/commit/f73a1c9cbf5ccbcbe1d01a23e0880f9c8cf45937))
* **s2-core:** 修复延迟销毁表格时没有移除 canvas 节点的问题 close [#1011](https://github.com/antvis/S2/issues/1011) ([#1033](https://github.com/antvis/S2/issues/1033)) ([608dc49](https://github.com/antvis/S2/commit/608dc49c54abd7c3cc7d96c2b7285499358a5cfe))
* **tooltip:** 修复单元格文字过长时 tooltip 显示被截断 close [#1028](https://github.com/antvis/S2/issues/1028) ([#1034](https://github.com/antvis/S2/issues/1034)) ([4e654e7](https://github.com/antvis/S2/commit/4e654e78d34fdcddb2176fb88c802ffd679cf9c0))
* **tooltip:** 修复明细表列头的 tooltip 内容被错误的格式化 close [#998](https://github.com/antvis/S2/issues/998) ([#1036](https://github.com/antvis/S2/issues/1036)) ([279458d](https://github.com/antvis/S2/commit/279458de7167068194010473f6994ae5e19024c0))

### Features

* 完善交叉表分页功能 ([#1037](https://github.com/antvis/S2/issues/1037)) ([9c8657d](https://github.com/antvis/S2/commit/9c8657d8c711057a88b19dd1fd1705655b86a94e))
* 支持配置前端计算小计/总计 ([#921](https://github.com/antvis/S2/issues/921)) ([999cfc1](https://github.com/antvis/S2/commit/999cfc1a522a8d1f2331c28be23a21fa31da3b5a))

# [@antv/s2-v1.6.0](https://github.com/antvis/S2/compare/@antv/s2-v1.5.0...@antv/s2-v1.6.0) (2022-01-14)

### Bug Fixes

* **facet:** 交叉表 compact 模式下行/列头宽度计算错误 ([#972](https://github.com/antvis/S2/issues/972)) ([2c59806](https://github.com/antvis/S2/commit/2c598066c70be4e53bb15f6f610dcf906c424af7))
* **facet:** 数据量较少时，维持 panelBBox 宽高 ([#989](https://github.com/antvis/S2/issues/989)) ([c79d6b1](https://github.com/antvis/S2/commit/c79d6b1b892cfaa397d95fba6ff6151c44ed7632))
* **interaction:** shift 区间多选在明细表序列号上失效 ([#981](https://github.com/antvis/S2/issues/981)) ([38e4f93](https://github.com/antvis/S2/commit/38e4f935eb061ebaeb0c5a1a453adf593945770c))
* scrollbarOpts to enum const ([#1001](https://github.com/antvis/S2/issues/1001)) ([f7ffcf0](https://github.com/antvis/S2/commit/f7ffcf06a3d8011fadab23ff325e72398d926184))

### Features

* **facet:** add scrollBarPosition option ([#997](https://github.com/antvis/S2/issues/997)) ([8937dc8](https://github.com/antvis/S2/commit/8937dc84255c68b9d5b75255263866b8c1c359aa))
* 增加 supportsCSSTransform 设置 ([#990](https://github.com/antvis/S2/issues/990)) ([be45f83](https://github.com/antvis/S2/commit/be45f83ec0bfea402fab127641264c362405d289))

# [@antv/s2-v1.5.0](https://github.com/antvis/S2/compare/@antv/s2-v1.4.0...@antv/s2-v1.5.0) (2022-01-07)

### Bug Fixes

* bug: 修复交叉表手动设置滚动不生效问题 ([#955](https://github.com/antvis/S2/issues/955)) ([64eeee8](https://github.com/antvis/S2/commit/64eeee8454c90116c7fcfba891606c836317b49e))
* **export:** 优化复制数据到剪贴板的逻辑 ([#976](https://github.com/antvis/S2/issues/976)) ([a841c77](https://github.com/antvis/S2/commit/a841c77c57bb4c9b8aa39f2224dc3adb860b7337))
* **facet:** frozenRowHeader=false 滚动时列头展示不全 ([#975](https://github.com/antvis/S2/issues/975)) ([298802e](https://github.com/antvis/S2/commit/298802e1a35d5512a6438c7738d820d1baa74877))
* table facet test add toFixed ([#960](https://github.com/antvis/S2/issues/960)) ([e1b9e34](https://github.com/antvis/S2/commit/e1b9e343803cb7beac9692f4e473429160cfa7f3))
* 优化复制功能，解决大数据量复制导致的页面崩溃问题 ([#968](https://github.com/antvis/S2/issues/968)) ([b9e5d36](https://github.com/antvis/S2/commit/b9e5d3617815240342bf211bb919c82c1eaa3656))

### Features

* **interaction:** 支持通过键盘方向键移动选中的单元格 ([#967](https://github.com/antvis/S2/issues/967)) ([c1a98ec](https://github.com/antvis/S2/commit/c1a98ec30c161624a48fda16bce0888b0af60f6b))
* 字段标记 (filed) 可使用正则进行匹配 ([#973](https://github.com/antvis/S2/issues/973)) ([5502936](https://github.com/antvis/S2/commit/5502936d4b7b7eb2940a3dd7c22b3f0cffcd2c9e))

# [@antv/s2-v1.4.0](https://github.com/antvis/S2/compare/@antv/s2-v1.3.0...@antv/s2-v1.4.0) (2021-12-24)

### Bug Fixes

* :bug: 修复列头小计总计位置漂移问题， close [#836](https://github.com/antvis/S2/issues/836) ([#934](https://github.com/antvis/S2/issues/934)) ([3dc04b7](https://github.com/antvis/S2/commit/3dc04b7816eedfbc8669227fef850414f9b3c72c))
* :bug: 修复指标列头 hover 行为和维值列头不一致问题 ([#912](https://github.com/antvis/S2/issues/912)) ([8fa67bb](https://github.com/antvis/S2/commit/8fa67bbec21e0d336a3ac4bc589d472100a9e89f))
* **components:** 修复配置的宽度超过浏览器可视窗口宽度无法滚动的问题 close [#889](https://github.com/antvis/S2/issues/889) ([#931](https://github.com/antvis/S2/issues/931)) ([bf03b37](https://github.com/antvis/S2/commit/bf03b37d816258d465ffd4ede9bb759b1adaee12))
* event-controller 重复注册事件 ([#922](https://github.com/antvis/S2/issues/922)) ([683f8e8](https://github.com/antvis/S2/commit/683f8e893dda6fa6f2a687b2014f499d95e198a3))
* **facet:** table adaptive layout ([#932](https://github.com/antvis/S2/issues/932)) ([f35cd3b](https://github.com/antvis/S2/commit/f35cd3b6bc389371f57cde3f33ed3965ab237f1b))
* **frame:** incorrect viewport splitline shadow ([#898](https://github.com/antvis/S2/issues/898)) ([197381e](https://github.com/antvis/S2/commit/197381e01bb79135f3217546baee5434ef28253d))
* **interactive:** global selected event emit ([#902](https://github.com/antvis/S2/issues/902)) ([bd4eca3](https://github.com/antvis/S2/commit/bd4eca3a7f8ca46109c15f3d06003970429b2011))
* **scroll:** 修复滚动表格后，鼠标移动会重置已选中单元格 close [#904](https://github.com/antvis/S2/issues/904) ([#914](https://github.com/antvis/S2/issues/914)) ([d6ebc3d](https://github.com/antvis/S2/commit/d6ebc3dc2773977b8a5a5aa4203d513281b6090c))
* **table:** add frozen opts validation & frozen col resize fix ([#933](https://github.com/antvis/S2/issues/933)) ([c88f649](https://github.com/antvis/S2/commit/c88f64946346c730191266bfadbc7b11cb0144e1))
* **table:** 明细表数据为空时添加兜底 ([#947](https://github.com/antvis/S2/issues/947)) ([529ad10](https://github.com/antvis/S2/commit/529ad10474b98f3a01edf5232819539a49f5ea1e))
* 修复错误修改 DefaultOptions 问题 ([#910](https://github.com/antvis/S2/issues/910)) ([c6e3235](https://github.com/antvis/S2/commit/c6e32350b15611b4fe9aa457baf45329443c7aff))

### Features

* **facet:** 明细表增加行高 resize 调整 && 行高 resize 增加选项 ([#909](https://github.com/antvis/S2/issues/909)) ([cee6bdc](https://github.com/antvis/S2/commit/cee6bdced0cf3749e683ce157478ea2557da3a53))
* **table filter:** add custom filter function ([#894](https://github.com/antvis/S2/issues/894)) ([2c7b49d](https://github.com/antvis/S2/commit/2c7b49de9ce204829e90e335b15860c95c34eee6))

# [@antv/s2-v1.3.0](https://github.com/antvis/S2/compare/@antv/s2-v1.2.0...@antv/s2-v1.3.0) (2021-12-13)

### Bug Fixes

* 🐛 solve the issue that the measure does not shown when the type of dimensions are number ([#871](https://github.com/antvis/S2/issues/871)) ([296b50b](https://github.com/antvis/S2/commit/296b50bc0af25032e72a7aee332eccd9b557e72c))
* 🐛 solve the wrong data after drilling down twice ([#885](https://github.com/antvis/S2/issues/885)) ([e3c8729](https://github.com/antvis/S2/commit/e3c8729d8fd5383fa73349b9937daa7ea58e0301))

### Features

* ✨ show the sortIcon when the hideMeasureColumn is set ([#884](https://github.com/antvis/S2/issues/884)) ([de1c46a](https://github.com/antvis/S2/commit/de1c46acb12b257e32aa4cc568312abca873775a))

# [@antv/s2-v1.2.0](https://github.com/antvis/S2/compare/@antv/s2-v1.1.2...@antv/s2-v1.2.0) (2021-12-06)

### Bug Fixes

* **cell:** border width issue ([#859](https://github.com/antvis/S2/issues/859)) ([114e7fc](https://github.com/antvis/S2/commit/114e7fc9b7d37f2512dc17a812d280858b571f61))
* **export:** export corner bug ([#856](https://github.com/antvis/S2/issues/856)) ([ccbc851](https://github.com/antvis/S2/commit/ccbc85142697d14f6d899899beef1a2fd2a9ec38))
* fix series resize area ([#858](https://github.com/antvis/S2/issues/858)) ([76407db](https://github.com/antvis/S2/commit/76407db3bf0975f6ad815e0078c4db5a293b6db4))
* only omit undefined row cell ([#861](https://github.com/antvis/S2/issues/861)) ([9386688](https://github.com/antvis/S2/commit/9386688c14607a260c446c9c18f2d11bf05eb5b6))
* revert default palette change ([#863](https://github.com/antvis/S2/issues/863)) ([c49fa9f](https://github.com/antvis/S2/commit/c49fa9f86db47783337a06c005df33145418b8e3))
* the order of multiple selection of cells is wrong ([#857](https://github.com/antvis/S2/issues/857)) ([63d1fcb](https://github.com/antvis/S2/commit/63d1fcb2a5653683e51a36afd280b81b4fc4ed55))

### Features

* **resize:** add resize active options, close [#855](https://github.com/antvis/S2/issues/855) ([#864](https://github.com/antvis/S2/issues/864)) ([1ce0951](https://github.com/antvis/S2/commit/1ce0951c20cc28495bf1c062d7c57128c3ef91fb))
* **tooltip:** enhance tooltip ([#862](https://github.com/antvis/S2/issues/862)) ([9e411b5](https://github.com/antvis/S2/commit/9e411b555ef320b856f67a0fcf0da8971de1c529))

# [@antv/s2-v1.1.2](https://github.com/antvis/S2/compare/@antv/s2-v1.1.1...@antv/s2-v1.1.2) (2021-11-30)

### Bug Fixes

* copy refactor ([#834](https://github.com/antvis/S2/issues/834)) ([dac76ab](https://github.com/antvis/S2/commit/dac76ab72da266eddfcfafecacea47e4ea831cf9))
* **copy:** copy \r\n problem ([#843](https://github.com/antvis/S2/issues/843)) ([6f885ab](https://github.com/antvis/S2/commit/6f885ab24ab7afbd11eec123cd8f13824f023d0b))
* **table:** column should not be formatted ([#845](https://github.com/antvis/S2/issues/845)) ([ed8423a](https://github.com/antvis/S2/commit/ed8423afb3d4a1957806dd7f890769a278755076))

# [@antv/s2-v1.1.1](https://github.com/antvis/S2/compare/@antv/s2-v1.1.0...@antv/s2-v1.1.1) (2021-11-30)

### Bug Fixes

* invalid react tooltip config ([#835](https://github.com/antvis/S2/issues/835)) ([10b44e7](https://github.com/antvis/S2/commit/10b44e7ef3b87fb042a4c515123e86ff94cb053e))

# [@antv/s2-v1.1.0](https://github.com/antvis/S2/compare/@antv/s2-v1.0.3...@antv/s2-v1.1.0) (2021-11-29)

### Bug Fixes

* **facet:** fix render crash if value fields is empty ([#822](https://github.com/antvis/S2/issues/822)) ([c91522a](https://github.com/antvis/S2/commit/c91522a7ae3d6c181f271772ee3d2b47f40d3a20))
* **facet:** getAdjustedScrollY add negative check ([#816](https://github.com/antvis/S2/issues/816)) ([675eab8](https://github.com/antvis/S2/commit/675eab8e1555f0e8da0bd5c4a7d117ad5a667dcb))
* **facet:** remove extra row node if row fields is empty ([#824](https://github.com/antvis/S2/issues/824)) ([ab044c1](https://github.com/antvis/S2/commit/ab044c16466bdfe0d17cb9bf0365deb97a8fd38f))
* remove '' on copied data ([#817](https://github.com/antvis/S2/issues/817)) ([2bfb1d2](https://github.com/antvis/S2/commit/2bfb1d2e05d9165589811e7352bbe9f73e209398))

### Features

* refactor react tooltip ([#831](https://github.com/antvis/S2/issues/831)) ([3e57279](https://github.com/antvis/S2/commit/3e572792398d3aec446a56ee70405702be2ced65))
* the order of the measure values in rows or cols, only works for PivotSheet (customValueOrder) ([#832](https://github.com/antvis/S2/issues/832)) ([41dd313](https://github.com/antvis/S2/commit/41dd313e9beaf88fe58198962809d25725ec8e72))

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
* 🐛 add the `spreadsheet` for the meta of the corner cell in tree mode and tweak the style of cell borders ([#342](https://github.com/antvis/S2/issues/342)) ([f322519](https://github.com/antvis/S2/commit/f322519fe42659286c0d4306eef0fa2922ad69aa)), closes [#339](https://github.com/antvis/S2/issues/339)
* 🐛 clear the drill-down cache after setting the dataConfig and close [#496](https://github.com/antvis/S2/issues/496) ([#510](https://github.com/antvis/S2/issues/510)) ([c39a07b](https://github.com/antvis/S2/commit/c39a07bfa0c1caeae66d428278c29012b8e3e4ea))
* 🐛 do not handle tooltip options when using the custom tooltip ([#80](https://github.com/antvis/S2/issues/80)) ([77456eb](https://github.com/antvis/S2/commit/77456eb40098d758db3576c6292d264565afbb33))
* 🐛 err when hierarchyType is tree and data is empty ([#527](https://github.com/antvis/S2/issues/527)) ([1bbca96](https://github.com/antvis/S2/commit/1bbca962e26572ac94ec7501e5268795f57f22b1))
* 🐛 event disposal on facet destroy ([#493](https://github.com/antvis/S2/issues/493)) ([e48a20d](https://github.com/antvis/S2/commit/e48a20dfac17c6364909c157dd7ad6c4a7d0f51b))
* 🐛 fix the min dragging width for the adaptive mode ([#110](https://github.com/antvis/S2/issues/110)) ([c854bc8](https://github.com/antvis/S2/commit/c854bc81674e6ea2e16a4e75fdc5ea89bdd455a1))
* 🐛 fix the wrong params of export function ([#159](https://github.com/antvis/S2/issues/159)) ([ce66363](https://github.com/antvis/S2/commit/ce663637c63ef173019d8233237ed8ee7d98eaa9))
* 🐛 getEndRows return all items when theres no frozen row ([#503](https://github.com/antvis/S2/issues/503)) ([6952526](https://github.com/antvis/S2/commit/6952526bd265638986ebbefa27b4b4d3922fa8cc))
* 🐛 interactorBorder 宽度自适应 ([#705](https://github.com/antvis/S2/issues/705)) ([1271081](https://github.com/antvis/S2/commit/12710811ce2e8a1afda7e873b44ffc15d6554b3e))
* 🐛 optimize the logic of toggleActionIcon and close [#552](https://github.com/antvis/S2/issues/552) ([#560](https://github.com/antvis/S2/issues/560)) ([2d08950](https://github.com/antvis/S2/commit/2d0895068fb1ea84cb722defa2b4774742b9f0bc))
* 🐛 replace function names with the constant map ([#84](https://github.com/antvis/S2/issues/84)) ([a0c7a21](https://github.com/antvis/S2/commit/a0c7a210e5dceddd1c33fef03d7ecd6bbe12c1c0))
* 🐛 rollback the version of jest ([#111](https://github.com/antvis/S2/issues/111)) ([61c517f](https://github.com/antvis/S2/commit/61c517f40d29bb9dcb4c79076cff0388afb3cd1e))
* 🐛 solve the wrong order of the row meta and close [#511](https://github.com/antvis/S2/issues/511) ([#542](https://github.com/antvis/S2/issues/542)) ([6da8d42](https://github.com/antvis/S2/commit/6da8d427f1bad67747decc2ee784056397c8c224))
* 🐛 solve the wrong render state when updating the dataCfg and close [#285](https://github.com/antvis/S2/issues/285) ([#299](https://github.com/antvis/S2/issues/299)) ([b69cf24](https://github.com/antvis/S2/commit/b69cf2405584483cc1639adc2d44af1b728f8d05))
* 🐛 totals caculate width's err when data is empty but options have totals ([#517](https://github.com/antvis/S2/issues/517)) ([96c35f7](https://github.com/antvis/S2/commit/96c35f7151011322d8163440e9b8140a714356ec))
* 🐛 修复 1px 边框错位的问题 ([#744](https://github.com/antvis/S2/issues/744)) ([2b628a6](https://github.com/antvis/S2/commit/2b628a68fb9c60c730bb5e849315824117317072))
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
* render right trailing col ([#647](https://github.com/antvis/S2/issues/647)) ([f367f05](https://github.com/antvis/S2/commit/f367f0554d897826300bd007bd229c25e889567c))
* **resize:** fix corner resize blank ([#599](https://github.com/antvis/S2/issues/599)) ([82cc929](https://github.com/antvis/S2/commit/82cc929d656ff0c82c80bdbc339958af19c3fe7c))
* **resize:** fix set width and height problem ([#402](https://github.com/antvis/S2/issues/402)) ([41caf18](https://github.com/antvis/S2/commit/41caf1812687130d9d4d595b680c544a69a49843))
* return filtered dataset on range_filtered event ([#513](https://github.com/antvis/S2/issues/513)) ([ed7e78a](https://github.com/antvis/S2/commit/ed7e78adea7b8bd1c629c579f36ae6f2b5f2c15f))
* revert code ([#325](https://github.com/antvis/S2/issues/325)) ([6ece5e8](https://github.com/antvis/S2/commit/6ece5e89f50b7d450c412e224546e923792d0aca))
* row-col-click's show about pivot and table, formatter when showSingleTips ([#327](https://github.com/antvis/S2/issues/327)) ([23d3508](https://github.com/antvis/S2/commit/23d3508bc42954e1561c350cc11db54cc54bf321))
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
* row-col-click's show about pivot and table, formatter when showSingleTips ([#327](https://github.com/antvis/S2/issues/327)) ([23d3508](https://github.com/antvis/S2/commit/23d3508bc42954e1561c350cc11db54cc54bf321))
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
* row-col-click's show about pivot and table, formatter when showSingleTips ([#327](https://github.com/antvis/S2/issues/327)) ([23d3508](https://github.com/antvis/S2/commit/23d3508bc42954e1561c350cc11db54cc54bf321))
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

## [0.2.5](https://github.com/antvis/S2/compare/v0.1.1...v0.2.5) (2021-10-25)

### Bug Fixes

* :bug: correct the condition of the adustTotalNodesCoordinate ([#455](https://github.com/antvis/S2/issues/455)) ([34c9f87](https://github.com/antvis/S2/commit/34c9f87897186a2ab62c26062ddeae08c9704308))
* :bug: correct the wrong condition to show the default headerActionIcons for detail table mode ([#486](https://github.com/antvis/S2/issues/486)) ([596e9f3](https://github.com/antvis/S2/commit/596e9f333769967c49ae822292efe02412ed2220))
* :bug: optimize the subTotal cells layout logic and close [#368](https://github.com/antvis/S2/issues/368) ([#425](https://github.com/antvis/S2/issues/425)) ([7fe2cbf](https://github.com/antvis/S2/commit/7fe2cbf1728b223e4717add85e0b6e27a398b56f))
* :bug: prevent the cell click event when clicking the HeaderActionIcon and close [#409](https://github.com/antvis/S2/issues/409) [#452](https://github.com/antvis/S2/issues/452) ([#489](https://github.com/antvis/S2/issues/489)) ([f1a1a82](https://github.com/antvis/S2/commit/f1a1a8252de46b137221c6fe85f0deced2591fb6))
* :bug: refactor the process of standardTransform ([#528](https://github.com/antvis/S2/issues/528)) ([315f5c3](https://github.com/antvis/S2/commit/315f5c3b08c157458e3147bd0b99af2e79c8e094))
* :bug: set the default page and close [#473](https://github.com/antvis/S2/issues/473) ([#500](https://github.com/antvis/S2/issues/500)) ([567dc0e](https://github.com/antvis/S2/commit/567dc0e1b57c6dff4935cd387abd47ba251e86d8))
* :bug: solve the wrong clear drill-dwon state ([#539](https://github.com/antvis/S2/issues/539)) ([eb5b4ee](https://github.com/antvis/S2/commit/eb5b4ee61c53231bff0bc8936f7a0c490519bd65))
* :bug: solve the wrong numbers of headerActionIcons config in drill-down mode ([#445](https://github.com/antvis/S2/issues/445)) ([7ca0a70](https://github.com/antvis/S2/commit/7ca0a70a8f822146c9a672fa420e22ea5f2f617a))
* 🐛 solve the wrong position of the grandTotal cell in multi-value mode and close [#372](https://github.com/antvis/S2/issues/372) ([#437](https://github.com/antvis/S2/issues/437)) ([b24657c](https://github.com/antvis/S2/commit/b24657c65d027f3447cbbc07d089022f3edfbe27))
* 🐛 tweak the corner cell icon position and close [#464](https://github.com/antvis/S2/issues/464) ([#504](https://github.com/antvis/S2/issues/504)) ([5ea90a6](https://github.com/antvis/S2/commit/5ea90a63d953f3e79a02bf3352e02e09a53efa71))
* 🐛 add the `spreadsheet` for the meta of the corner cell in tree mode and tweak the style of cell borders ([#342](https://github.com/antvis/S2/issues/342)) ([f322519](https://github.com/antvis/S2/commit/f322519fe42659286c0d4306eef0fa2922ad69aa)), closes [#339](https://github.com/antvis/S2/issues/339)
* 🐛 clear the drill-down cache after setting the dataConfig and close [#496](https://github.com/antvis/S2/issues/496) ([#510](https://github.com/antvis/S2/issues/510)) ([c39a07b](https://github.com/antvis/S2/commit/c39a07bfa0c1caeae66d428278c29012b8e3e4ea))
* 🐛 err when hierarchyType is tree and data is empty ([#527](https://github.com/antvis/S2/issues/527)) ([1bbca96](https://github.com/antvis/S2/commit/1bbca962e26572ac94ec7501e5268795f57f22b1))
* 🐛 event disposal on facet destroy ([#493](https://github.com/antvis/S2/issues/493)) ([e48a20d](https://github.com/antvis/S2/commit/e48a20dfac17c6364909c157dd7ad6c4a7d0f51b))
* 🐛 getEndRows return all items when theres no frozen row ([#503](https://github.com/antvis/S2/issues/503)) ([6952526](https://github.com/antvis/S2/commit/6952526bd265638986ebbefa27b4b4d3922fa8cc))
* 🐛 solve the wrong order of the row meta and close [#511](https://github.com/antvis/S2/issues/511) ([#542](https://github.com/antvis/S2/issues/542)) ([6da8d42](https://github.com/antvis/S2/commit/6da8d427f1bad67747decc2ee784056397c8c224))
* 🐛 solve the wrong render state when updating the dataCfg and close [#285](https://github.com/antvis/S2/issues/285) ([#299](https://github.com/antvis/S2/issues/299)) ([b69cf24](https://github.com/antvis/S2/commit/b69cf2405584483cc1639adc2d44af1b728f8d05))
* 🐛 totals caculate width's err when data is empty but options have totals ([#517](https://github.com/antvis/S2/issues/517)) ([96c35f7](https://github.com/antvis/S2/commit/96c35f7151011322d8163440e9b8140a714356ec))
* cannot hidden columns ([#491](https://github.com/antvis/S2/issues/491)) ([dc78a4f](https://github.com/antvis/S2/commit/dc78a4f57b802b1ed2854b32a77abd7d0ecf7afd))
* expand corner cell width, make it nowrap initially ([#408](https://github.com/antvis/S2/issues/408)) ([c73bb6d](https://github.com/antvis/S2/commit/c73bb6d391f8f030212eed9ff7b9da249ae95d4a))
* export feature ([#412](https://github.com/antvis/S2/issues/412)) ([6c2a5b8](https://github.com/antvis/S2/commit/6c2a5b8ad625567de5cf138aca51c9faf5d4c354))
* **export:** 🐛 solve the table sheet export problem and close [#446](https://github.com/antvis/S2/issues/446) ([#466](https://github.com/antvis/S2/issues/466)) ([d5eda7c](https://github.com/antvis/S2/commit/d5eda7c8461cc651b6653afcdea71cee5611bbb8))
* **facet:** fix issue [#291](https://github.com/antvis/S2/issues/291) ([#297](https://github.com/antvis/S2/issues/297)) ([28a5c11](https://github.com/antvis/S2/commit/28a5c115501ddbe78432682c9c8cfb4b8b5c7780))
* **facet:** frozen clip and resizer issue ([#275](https://github.com/antvis/S2/issues/275)) ([6b53061](https://github.com/antvis/S2/commit/6b53061583e0062242a6473c2413bae339ff1338)), closes [#269](https://github.com/antvis/S2/issues/269) [#270](https://github.com/antvis/S2/issues/270) [#268](https://github.com/antvis/S2/issues/268) [#267](https://github.com/antvis/S2/issues/267) [#271](https://github.com/antvis/S2/issues/271) [#272](https://github.com/antvis/S2/issues/272) [#265](https://github.com/antvis/S2/issues/265) [#274](https://github.com/antvis/S2/issues/274) [#276](https://github.com/antvis/S2/issues/276)
* fix corner icon overlap close [#524](https://github.com/antvis/S2/issues/524) ([#536](https://github.com/antvis/S2/issues/536)) ([228f3bc](https://github.com/antvis/S2/commit/228f3bc07f74e0526e9a8b0e2edad3216f890d6d))
* fix merge cells translate wrong position issue ([#458](https://github.com/antvis/S2/issues/458)) ([5bc7ede](https://github.com/antvis/S2/commit/5bc7ede4fbcb53e83cc77455f1b3ac353e6c1d87))
* fix merged cells can't be sorted and dragged ([#471](https://github.com/antvis/S2/issues/471)) ([cfd9ff0](https://github.com/antvis/S2/commit/cfd9ff03ad98253a4672a2e1117593b3703898e8))
* **interaction:** add brush move distance validate ([#321](https://github.com/antvis/S2/issues/321)) ([2ee8f9d](https://github.com/antvis/S2/commit/2ee8f9d163ad60692b6ee2e1173e4bfc397430cd))
* **interaction:** invalid "hiddenColumnFields" config close [#417](https://github.com/antvis/S2/issues/417) ([#431](https://github.com/antvis/S2/issues/431)) ([6cd461e](https://github.com/antvis/S2/commit/6cd461e6d132a18cc7192bf90d946f5de8b8d1f7))
* **interaction:** optimize reset state logic ([#441](https://github.com/antvis/S2/issues/441)) ([f07e657](https://github.com/antvis/S2/commit/f07e657c0c2be5090a390fcc0ee7f4c74a008e3f))
* **interaction:** support batch hidden columns ([#439](https://github.com/antvis/S2/issues/439)) ([d0a4d97](https://github.com/antvis/S2/commit/d0a4d97d4f343c689f227e0ced6e8723dead007f))
* **interaction:** wrong hidden column icon position ([#329](https://github.com/antvis/S2/issues/329)) ([19d4497](https://github.com/antvis/S2/commit/19d4497b3112cf543d170e65f230f0e885ece8a4))
* pagination err ([#453](https://github.com/antvis/S2/issues/453)) ([3d0535e](https://github.com/antvis/S2/commit/3d0535e2390a2ce258df00430dd387745251bd04))
* **performance:** optimize performance when table switch to pivot, [#415](https://github.com/antvis/S2/issues/415) ([#429](https://github.com/antvis/S2/issues/429)) ([215e6c4](https://github.com/antvis/S2/commit/215e6c4755c1101bd4920847a398cf48c07448ce))
* **poivt-table:** fix render apply font crash on ios15 ([#394](https://github.com/antvis/S2/issues/394)) ([cbb7045](https://github.com/antvis/S2/commit/cbb7045354e674c858185c307b1e5ac2ecd0a70f))
* **povit-table:** resolve scroll shake issue close [#374](https://github.com/antvis/S2/issues/374) ([#379](https://github.com/antvis/S2/issues/379)) ([014d683](https://github.com/antvis/S2/commit/014d683a8cc251f0f4cddb28662b45b7b96d4edb))
* **resize:** fix set width and height problem ([#402](https://github.com/antvis/S2/issues/402)) ([41caf18](https://github.com/antvis/S2/commit/41caf1812687130d9d4d595b680c544a69a49843))
* return filtered dataset on range_filtered event ([#513](https://github.com/antvis/S2/issues/513)) ([ed7e78a](https://github.com/antvis/S2/commit/ed7e78adea7b8bd1c629c579f36ae6f2b5f2c15f))
* revert code ([#325](https://github.com/antvis/S2/issues/325)) ([6ece5e8](https://github.com/antvis/S2/commit/6ece5e89f50b7d450c412e224546e923792d0aca))
* row-col-click's show about pivot and table, formatter when showSingleTips ([#327](https://github.com/antvis/S2/issues/327)) ([23d3508](https://github.com/antvis/S2/commit/23d3508bc42954e1561c350cc11db54cc54bf321))
* **spreadsheet:** solve the workflow and test case ([#286](https://github.com/antvis/S2/issues/286)) ([c44e469](https://github.com/antvis/S2/commit/c44e4691435623d7de84b70c08308d2b1943d6bc)), closes [#269](https://github.com/antvis/S2/issues/269) [#270](https://github.com/antvis/S2/issues/270) [#268](https://github.com/antvis/S2/issues/268) [#267](https://github.com/antvis/S2/issues/267) [#271](https://github.com/antvis/S2/issues/271) [#272](https://github.com/antvis/S2/issues/272) [#265](https://github.com/antvis/S2/issues/265) [#274](https://github.com/antvis/S2/issues/274) [#276](https://github.com/antvis/S2/issues/276) [#277](https://github.com/antvis/S2/issues/277) [#283](https://github.com/antvis/S2/issues/283) [#273](https://github.com/antvis/S2/issues/273) [#267](https://github.com/antvis/S2/issues/267)
* table dataset spec ([#288](https://github.com/antvis/S2/issues/288)) ([63bef22](https://github.com/antvis/S2/commit/63bef22319ab05c7d1b3d9aeace49e043731d3af))
* **table:** frozen pagination issue ([#338](https://github.com/antvis/S2/issues/338)) ([39d26a5](https://github.com/antvis/S2/commit/39d26a56de3ecc862c529d72b9dc431b1af0611a))
* **table-facet:** calulate colsHierarchy width after layoutCoordinate hook ([#518](https://github.com/antvis/S2/issues/518)) ([c0636fb](https://github.com/antvis/S2/commit/c0636fbc35ffcb27e95064fd6e04b596d09118cd))
* **table:** scroll position issue when re-render ([#459](https://github.com/antvis/S2/issues/459)) ([4dfa275](https://github.com/antvis/S2/commit/4dfa275ac8cbac33767dd6a8d4def60190c4afa4))
* **table:** table mode corner width err ([#396](https://github.com/antvis/S2/issues/396)) ([e3b9442](https://github.com/antvis/S2/commit/e3b9442ef2952b1047f9e46b3cdf5c153318b768))
* **tooltip:** custom tooltip keep right position wrong calc ([#436](https://github.com/antvis/S2/issues/436)) ([88fe05e](https://github.com/antvis/S2/commit/88fe05e7241e38e817ec60ddc40ef63315dbb3be))
* **tooltip:** fix cannot render tooltip element when first show ([#354](https://github.com/antvis/S2/issues/354)) ([78c22a6](https://github.com/antvis/S2/commit/78c22a6c8d3abb6357451e6752ad4fb4c2334e25))
* **tooltip:** fix cannot show sort menu when icon first clicked ([#366](https://github.com/antvis/S2/issues/366)) ([9c800a5](https://github.com/antvis/S2/commit/9c800a55291c36fed84bbf4e393e1b4dd6576e60))
* **tooltip:** tooltip will hide if cliced ([#370](https://github.com/antvis/S2/issues/370)) ([dccd4f5](https://github.com/antvis/S2/commit/dccd4f5bf667af0401e9d517f729992ba6dc7068))
* update d.ts path ([#319](https://github.com/antvis/S2/issues/319)) ([4117fa5](https://github.com/antvis/S2/commit/4117fa5bc3a23956f6e61cf0284cdd11356f7e39))
* update external using regex ([#304](https://github.com/antvis/S2/issues/304)) ([c40d3cc](https://github.com/antvis/S2/commit/c40d3cc6d37395b9c45d6ee2720126a2a1c8a87d))

### Features

* :sparkles: add column header labels for the corner header ([#320](https://github.com/antvis/S2/issues/320)) ([1b87bda](https://github.com/antvis/S2/commit/1b87bda6e6c2decfbd60c975d78afbcf5f0eb400))
* :sparkles: add skeleton for empty data and close [#507](https://github.com/antvis/S2/issues/507) ([#532](https://github.com/antvis/S2/issues/532)) ([ba1b447](https://github.com/antvis/S2/commit/ba1b44764c0a817dc8453bbb5c56714cdbc354af))
* :sparkles: allow users to set different display condition for headerActionIcons ([#352](https://github.com/antvis/S2/issues/352)) ([9375f2b](https://github.com/antvis/S2/commit/9375f2b8e594355b2e456fb18910085139f76932))
* :sparkles: init examples gallery for the site ([#280](https://github.com/antvis/S2/issues/280)) ([891ce39](https://github.com/antvis/S2/commit/891ce391e5009384a34b7b91ee3507f8c1cae708))
* ✨ add custom header action icons ([#331](https://github.com/antvis/S2/issues/331)) ([4dcb1a2](https://github.com/antvis/S2/commit/4dcb1a2344783c8df283071bee1f8b07988b9b01))
* ✨ enable users to set the page size of the pagination configuration and close [#302](https://github.com/antvis/S2/issues/302) ([#309](https://github.com/antvis/S2/issues/309)) ([e5e961e](https://github.com/antvis/S2/commit/e5e961e306092c7ebabefa782a7ea54324656018))
* ✨ part drill down based on the new data process ([#399](https://github.com/antvis/S2/issues/399)) ([6a8889b](https://github.com/antvis/S2/commit/6a8889be5c47c49f335528548b3289577e0bd175))
* 🎸 added ability to filter field values ([#356](https://github.com/antvis/S2/issues/356)) ([92d9698](https://github.com/antvis/S2/commit/92d9698cf40de4fb3a5f099fd6a44821cb2a1bab))
* 🔖 publish v0.1.3 ([#257](https://github.com/antvis/S2/issues/257)) ([92e452a](https://github.com/antvis/S2/commit/92e452ab6fef1bd4b3a3ed0e424e405e362ce425)), closes [#238](https://github.com/antvis/S2/issues/238) [#237](https://github.com/antvis/S2/issues/237) [#7](https://github.com/antvis/S2/issues/7) [#10](https://github.com/antvis/S2/issues/10) [#12](https://github.com/antvis/S2/issues/12) [#13](https://github.com/antvis/S2/issues/13) [#16](https://github.com/antvis/S2/issues/16) [#17](https://github.com/antvis/S2/issues/17) [#11](https://github.com/antvis/S2/issues/11) [#19](https://github.com/antvis/S2/issues/19) [#18](https://github.com/antvis/S2/issues/18) [#21](https://github.com/antvis/S2/issues/21) [#23](https://github.com/antvis/S2/issues/23) [#20](https://github.com/antvis/S2/issues/20) [#24](https://github.com/antvis/S2/issues/24) [#20](https://github.com/antvis/S2/issues/20) [#26](https://github.com/antvis/S2/issues/26) [#27](https://github.com/antvis/S2/issues/27) [#28](https://github.com/antvis/S2/issues/28) [#29](https://github.com/antvis/S2/issues/29) [#35](https://github.com/antvis/S2/issues/35) [#37](https://github.com/antvis/S2/issues/37) [#38](https://github.com/antvis/S2/issues/38) [#39](https://github.com/antvis/S2/issues/39) [#42](https://github.com/antvis/S2/issues/42) [#43](https://github.com/antvis/S2/issues/43) [#44](https://github.com/antvis/S2/issues/44) [#45](https://github.com/antvis/S2/issues/45) [#47](https://github.com/antvis/S2/issues/47) [#46](https://github.com/antvis/S2/issues/46) [#48](https://github.com/antvis/S2/issues/48) [#32](https://github.com/antvis/S2/issues/32) [#31](https://github.com/antvis/S2/issues/31) [#49](https://github.com/antvis/S2/issues/49) [#32](https://github.com/antvis/S2/issues/32) [#31](https://github.com/antvis/S2/issues/31) [#50](https://github.com/antvis/S2/issues/50) [#51](https://github.com/antvis/S2/issues/51) [#52](https://github.com/antvis/S2/issues/52) [#55](https://github.com/antvis/S2/issues/55) [#57](https://github.com/antvis/S2/issues/57) [#58](https://github.com/antvis/S2/issues/58) [#59](https://github.com/antvis/S2/issues/59) [#14](https://github.com/antvis/S2/issues/14) [#30](https://github.com/antvis/S2/issues/30) [#60](https://github.com/antvis/S2/issues/60) [#61](https://github.com/antvis/S2/issues/61) [#64](https://github.com/antvis/S2/issues/64) [#65](https://github.com/antvis/S2/issues/65) [#69](https://github.com/antvis/S2/issues/69) [#70](https://github.com/antvis/S2/issues/70) [#71](https://github.com/antvis/S2/issues/71) [#70](https://github.com/antvis/S2/issues/70) [#70](https://github.com/antvis/S2/issues/70) [#72](https://github.com/antvis/S2/issues/72) [#73](https://github.com/antvis/S2/issues/73) [#74](https://github.com/antvis/S2/issues/74) [#75](https://github.com/antvis/S2/issues/75) [#76](https://github.com/antvis/S2/issues/76) [#82](https://github.com/antvis/S2/issues/82) [#85](https://github.com/antvis/S2/issues/85) [#91](https://github.com/antvis/S2/issues/91) [#81](https://github.com/antvis/S2/issues/81) [#94](https://github.com/antvis/S2/issues/94) [#95](https://github.com/antvis/S2/issues/95) [#100](https://github.com/antvis/S2/issues/100) [#99](https://github.com/antvis/S2/issues/99) [#101](https://github.com/antvis/S2/issues/101) [#107](https://github.com/antvis/S2/issues/107) [#108](https://github.com/antvis/S2/issues/108) [#109](https://github.com/antvis/S2/issues/109) [#112](https://github.com/antvis/S2/issues/112) [#114](https://github.com/antvis/S2/issues/114) [#115](https://github.com/antvis/S2/issues/115) [#116](https://github.com/antvis/S2/issues/116) [#117](https://github.com/antvis/S2/issues/117) [#119](https://github.com/antvis/S2/issues/119) [#121](https://github.com/antvis/S2/issues/121) [#122](https://github.com/antvis/S2/issues/122) [#124](https://github.com/antvis/S2/issues/124) [#125](https://github.com/antvis/S2/issues/125) [#123](https://github.com/antvis/S2/issues/123) [#120](https://github.com/antvis/S2/issues/120) [#126](https://github.com/antvis/S2/issues/126) [#128](https://github.com/antvis/S2/issues/128) [#130](https://github.com/antvis/S2/issues/130) [#129](https://github.com/antvis/S2/issues/129) [#113](https://github.com/antvis/S2/issues/113) [#132](https://github.com/antvis/S2/issues/132) [#135](https://github.com/antvis/S2/issues/135) [#138](https://github.com/antvis/S2/issues/138) [#118](https://github.com/antvis/S2/issues/118) [#139](https://github.com/antvis/S2/issues/139) [#118](https://github.com/antvis/S2/issues/118) [#142](https://github.com/antvis/S2/issues/142) [#143](https://github.com/antvis/S2/issues/143) [#137](https://github.com/antvis/S2/issues/137) [#136](https://github.com/antvis/S2/issues/136) [#148](https://github.com/antvis/S2/issues/148) [#146](https://github.com/antvis/S2/issues/146) [#149](https://github.com/antvis/S2/issues/149) [#152](https://github.com/antvis/S2/issues/152) [#153](https://github.com/antvis/S2/issues/153) [#155](https://github.com/antvis/S2/issues/155) [#156](https://github.com/antvis/S2/issues/156) [#151](https://github.com/antvis/S2/issues/151) [#157](https://github.com/antvis/S2/issues/157) [#154](https://github.com/antvis/S2/issues/154) [#160](https://github.com/antvis/S2/issues/160) [#162](https://github.com/antvis/S2/issues/162) [#164](https://github.com/antvis/S2/issues/164) [#158](https://github.com/antvis/S2/issues/158) [#167](https://github.com/antvis/S2/issues/167) [#170](https://github.com/antvis/S2/issues/170) [#165](https://github.com/antvis/S2/issues/165) [#171](https://github.com/antvis/S2/issues/171) [#163](https://github.com/antvis/S2/issues/163) [#174](https://github.com/antvis/S2/issues/174) [#172](https://github.com/antvis/S2/issues/172) [#175](https://github.com/antvis/S2/issues/175) [#173](https://github.com/antvis/S2/issues/173) [#179](https://github.com/antvis/S2/issues/179) [#183](https://github.com/antvis/S2/issues/183) [#182](https://github.com/antvis/S2/issues/182) [#180](https://github.com/antvis/S2/issues/180) [#184](https://github.com/antvis/S2/issues/184) [#185](https://github.com/antvis/S2/issues/185) [#181](https://github.com/antvis/S2/issues/181) [#178](https://github.com/antvis/S2/issues/178) [#192](https://github.com/antvis/S2/issues/192) [#189](https://github.com/antvis/S2/issues/189) [#190](https://github.com/antvis/S2/issues/190) [#194](https://github.com/antvis/S2/issues/194) [#197](https://github.com/antvis/S2/issues/197) [#196](https://github.com/antvis/S2/issues/196) [#203](https://github.com/antvis/S2/issues/203) [#207](https://github.com/antvis/S2/issues/207) [#204](https://github.com/antvis/S2/issues/204) [#206](https://github.com/antvis/S2/issues/206) [#208](https://github.com/antvis/S2/issues/208) [#202](https://github.com/antvis/S2/issues/202) [#201](https://github.com/antvis/S2/issues/201) [#209](https://github.com/antvis/S2/issues/209) [#200](https://github.com/antvis/S2/issues/200) [#210](https://github.com/antvis/S2/issues/210) [#211](https://github.com/antvis/S2/issues/211) [#214](https://github.com/antvis/S2/issues/214) [#213](https://github.com/antvis/S2/issues/213) [#212](https://github.com/antvis/S2/issues/212) [#216](https://github.com/antvis/S2/issues/216) [#217](https://github.com/antvis/S2/issues/217) [#218](https://github.com/antvis/S2/issues/218) [#219](https://github.com/antvis/S2/issues/219) [#221](https://github.com/antvis/S2/issues/221) [#222](https://github.com/antvis/S2/issues/222) [#240](https://github.com/antvis/S2/issues/240) [#241](https://github.com/antvis/S2/issues/241) [#242](https://github.com/antvis/S2/issues/242) [#248](https://github.com/antvis/S2/issues/248) [#245](https://github.com/antvis/S2/issues/245) [#252](https://github.com/antvis/S2/issues/252) [#249](https://github.com/antvis/S2/issues/249)
* add advanced sort component ([#428](https://github.com/antvis/S2/issues/428)) ([c3a3fb5](https://github.com/antvis/S2/commit/c3a3fb5ba16dc4ef65f301b054a78095c36f5524))
* add confirm and cancel button for switcher ([#495](https://github.com/antvis/S2/issues/495)) ([d31ce63](https://github.com/antvis/S2/commit/d31ce63a87d87878f033f51ac2a0e7f4d90c2b31))
* add doc for table ([#360](https://github.com/antvis/S2/issues/360)) ([a7ee65e](https://github.com/antvis/S2/commit/a7ee65e4f46a0e8253a756d6c2619166e36a8c8e))
* add group sort in col's values and refactor tooltip's style ([#284](https://github.com/antvis/S2/issues/284)) ([ad02d9d](https://github.com/antvis/S2/commit/ad02d9db301f6be34112ac99e6db2de48af4c2dc)), closes [#269](https://github.com/antvis/S2/issues/269) [#270](https://github.com/antvis/S2/issues/270) [#268](https://github.com/antvis/S2/issues/268) [#267](https://github.com/antvis/S2/issues/267) [#271](https://github.com/antvis/S2/issues/271) [#272](https://github.com/antvis/S2/issues/272) [#265](https://github.com/antvis/S2/issues/265) [#274](https://github.com/antvis/S2/issues/274) [#276](https://github.com/antvis/S2/issues/276) [#277](https://github.com/antvis/S2/issues/277) [#283](https://github.com/antvis/S2/issues/283)
* add tooltip col and row config handle ([#440](https://github.com/antvis/S2/issues/440)) ([b457d27](https://github.com/antvis/S2/commit/b457d27ce1ba6de368e39632675c295ff3af8174))
* add total measure formatter for values in rows ([#462](https://github.com/antvis/S2/issues/462)) ([615be65](https://github.com/antvis/S2/commit/615be65b2f1afe9815c7889a34b6aa17a303dc66))
* copy with row and col ([#387](https://github.com/antvis/S2/issues/387)) ([7602ef8](https://github.com/antvis/S2/commit/7602ef87d5821b7a897c779f90d37bfc1e52d25f))
* dimensions switcher ([#298](https://github.com/antvis/S2/issues/298)) ([f223319](https://github.com/antvis/S2/commit/f2233194850604f5245e7eb19ea61f3993a592fe)), closes [#269](https://github.com/antvis/S2/issues/269) [#270](https://github.com/antvis/S2/issues/270) [#268](https://github.com/antvis/S2/issues/268) [#267](https://github.com/antvis/S2/issues/267) [#271](https://github.com/antvis/S2/issues/271)
* **facet:** add scroll speed ratio ([#438](https://github.com/antvis/S2/issues/438)) ([9ba97fb](https://github.com/antvis/S2/commit/9ba97fb716132b5c5bd49f03e16a6cb5d0ae51e4))
* **interaction:** add autoResetSheetStyle options ([#465](https://github.com/antvis/S2/issues/465)) ([00f316d](https://github.com/antvis/S2/commit/00f316d99566478c96660ff72d2f0541af572c74))
* **interaction:** hidden columns ([#296](https://github.com/antvis/S2/issues/296)) ([f5f4a69](https://github.com/antvis/S2/commit/f5f4a69dbd2b436f36e874323115d54af9f0aa16))
* **interaction:** select interaction imporement ([#324](https://github.com/antvis/S2/issues/324)) ([6b5479d](https://github.com/antvis/S2/commit/6b5479d9cb9718ce0c657277ef2ad30c56b8ded7))
* refactor switcher component ([#380](https://github.com/antvis/S2/issues/380)) ([f5c2993](https://github.com/antvis/S2/commit/f5c2993801d4f2b0d09ecaf4b8f751deefbac0d0))
* select all ([#348](https://github.com/antvis/S2/issues/348)) ([334aac4](https://github.com/antvis/S2/commit/334aac41ac9511c3b417a7006591fdbf138ab618)), closes [#342](https://github.com/antvis/S2/issues/342) [#339](https://github.com/antvis/S2/issues/339)
* tooltip support config auto adjust boundary ([#538](https://github.com/antvis/S2/issues/538)) ([2a14873](https://github.com/antvis/S2/commit/2a14873507c1480b3b209ffd5cb46421aca4096e))
* **util:** add generateId export function ([#488](https://github.com/antvis/S2/issues/488)) ([0e6025e](https://github.com/antvis/S2/commit/0e6025e20e5b2eeca0692dbb90fabcaffd66d3c1))

## [0.2.4](https://github.com/antvis/S2/compare/v0.1.1...v0.2.4) (2021-10-22)

### Bug Fixes

* :bug: correct the condition of the adustTotalNodesCoordinate ([#455](https://github.com/antvis/S2/issues/455)) ([34c9f87](https://github.com/antvis/S2/commit/34c9f87897186a2ab62c26062ddeae08c9704308))
* :bug: correct the wrong condition to show the default headerActionIcons for detail table mode ([#486](https://github.com/antvis/S2/issues/486)) ([596e9f3](https://github.com/antvis/S2/commit/596e9f333769967c49ae822292efe02412ed2220))
* :bug: optimize the subTotal cells layout logic and close [#368](https://github.com/antvis/S2/issues/368) ([#425](https://github.com/antvis/S2/issues/425)) ([7fe2cbf](https://github.com/antvis/S2/commit/7fe2cbf1728b223e4717add85e0b6e27a398b56f))
* :bug: prevent the cell click event when clicking the HeaderActionIcon and close [#409](https://github.com/antvis/S2/issues/409) [#452](https://github.com/antvis/S2/issues/452) ([#489](https://github.com/antvis/S2/issues/489)) ([f1a1a82](https://github.com/antvis/S2/commit/f1a1a8252de46b137221c6fe85f0deced2591fb6))
* :bug: refactor the process of standardTransform ([#528](https://github.com/antvis/S2/issues/528)) ([315f5c3](https://github.com/antvis/S2/commit/315f5c3b08c157458e3147bd0b99af2e79c8e094))
* :bug: set the default page and close [#473](https://github.com/antvis/S2/issues/473) ([#500](https://github.com/antvis/S2/issues/500)) ([567dc0e](https://github.com/antvis/S2/commit/567dc0e1b57c6dff4935cd387abd47ba251e86d8))
* :bug: solve the wrong clear drill-dwon state ([#539](https://github.com/antvis/S2/issues/539)) ([eb5b4ee](https://github.com/antvis/S2/commit/eb5b4ee61c53231bff0bc8936f7a0c490519bd65))
* :bug: solve the wrong numbers of headerActionIcons config in drill-down mode ([#445](https://github.com/antvis/S2/issues/445)) ([7ca0a70](https://github.com/antvis/S2/commit/7ca0a70a8f822146c9a672fa420e22ea5f2f617a))
* 🐛 solve the wrong position of the grandTotal cell in multi-value mode and close [#372](https://github.com/antvis/S2/issues/372) ([#437](https://github.com/antvis/S2/issues/437)) ([b24657c](https://github.com/antvis/S2/commit/b24657c65d027f3447cbbc07d089022f3edfbe27))
* 🐛 tweak the corner cell icon position and close [#464](https://github.com/antvis/S2/issues/464) ([#504](https://github.com/antvis/S2/issues/504)) ([5ea90a6](https://github.com/antvis/S2/commit/5ea90a63d953f3e79a02bf3352e02e09a53efa71))
* 🐛 add the `spreadsheet` for the meta of the corner cell in tree mode and tweak the style of cell borders ([#342](https://github.com/antvis/S2/issues/342)) ([f322519](https://github.com/antvis/S2/commit/f322519fe42659286c0d4306eef0fa2922ad69aa)), closes [#339](https://github.com/antvis/S2/issues/339)
* 🐛 clear the drill-down cache after setting the dataConfig and close [#496](https://github.com/antvis/S2/issues/496) ([#510](https://github.com/antvis/S2/issues/510)) ([c39a07b](https://github.com/antvis/S2/commit/c39a07bfa0c1caeae66d428278c29012b8e3e4ea))
* 🐛 err when hierarchyType is tree and data is empty ([#527](https://github.com/antvis/S2/issues/527)) ([1bbca96](https://github.com/antvis/S2/commit/1bbca962e26572ac94ec7501e5268795f57f22b1))
* 🐛 event disposal on facet destroy ([#493](https://github.com/antvis/S2/issues/493)) ([e48a20d](https://github.com/antvis/S2/commit/e48a20dfac17c6364909c157dd7ad6c4a7d0f51b))
* 🐛 getEndRows return all items when theres no frozen row ([#503](https://github.com/antvis/S2/issues/503)) ([6952526](https://github.com/antvis/S2/commit/6952526bd265638986ebbefa27b4b4d3922fa8cc))
* 🐛 solve the wrong render state when updating the dataCfg and close [#285](https://github.com/antvis/S2/issues/285) ([#299](https://github.com/antvis/S2/issues/299)) ([b69cf24](https://github.com/antvis/S2/commit/b69cf2405584483cc1639adc2d44af1b728f8d05))
* 🐛 totals caculate width's err when data is empty but options have totals ([#517](https://github.com/antvis/S2/issues/517)) ([96c35f7](https://github.com/antvis/S2/commit/96c35f7151011322d8163440e9b8140a714356ec))
* cannot hidden columns ([#491](https://github.com/antvis/S2/issues/491)) ([dc78a4f](https://github.com/antvis/S2/commit/dc78a4f57b802b1ed2854b32a77abd7d0ecf7afd))
* expand corner cell width, make it nowrap initially ([#408](https://github.com/antvis/S2/issues/408)) ([c73bb6d](https://github.com/antvis/S2/commit/c73bb6d391f8f030212eed9ff7b9da249ae95d4a))
* export feature ([#412](https://github.com/antvis/S2/issues/412)) ([6c2a5b8](https://github.com/antvis/S2/commit/6c2a5b8ad625567de5cf138aca51c9faf5d4c354))
* **export:** 🐛 solve the table sheet export problem and close [#446](https://github.com/antvis/S2/issues/446) ([#466](https://github.com/antvis/S2/issues/466)) ([d5eda7c](https://github.com/antvis/S2/commit/d5eda7c8461cc651b6653afcdea71cee5611bbb8))
* **facet:** fix issue [#291](https://github.com/antvis/S2/issues/291) ([#297](https://github.com/antvis/S2/issues/297)) ([28a5c11](https://github.com/antvis/S2/commit/28a5c115501ddbe78432682c9c8cfb4b8b5c7780))
* **facet:** frozen clip and resizer issue ([#275](https://github.com/antvis/S2/issues/275)) ([6b53061](https://github.com/antvis/S2/commit/6b53061583e0062242a6473c2413bae339ff1338)), closes [#269](https://github.com/antvis/S2/issues/269) [#270](https://github.com/antvis/S2/issues/270) [#268](https://github.com/antvis/S2/issues/268) [#267](https://github.com/antvis/S2/issues/267) [#271](https://github.com/antvis/S2/issues/271) [#272](https://github.com/antvis/S2/issues/272) [#265](https://github.com/antvis/S2/issues/265) [#274](https://github.com/antvis/S2/issues/274) [#276](https://github.com/antvis/S2/issues/276)
* fix corner icon overlap close [#524](https://github.com/antvis/S2/issues/524) ([#536](https://github.com/antvis/S2/issues/536)) ([228f3bc](https://github.com/antvis/S2/commit/228f3bc07f74e0526e9a8b0e2edad3216f890d6d))
* fix merge cells translate wrong position issue ([#458](https://github.com/antvis/S2/issues/458)) ([5bc7ede](https://github.com/antvis/S2/commit/5bc7ede4fbcb53e83cc77455f1b3ac353e6c1d87))
* fix merged cells can't be sorted and dragged ([#471](https://github.com/antvis/S2/issues/471)) ([cfd9ff0](https://github.com/antvis/S2/commit/cfd9ff03ad98253a4672a2e1117593b3703898e8))
* **interaction:** add brush move distance validate ([#321](https://github.com/antvis/S2/issues/321)) ([2ee8f9d](https://github.com/antvis/S2/commit/2ee8f9d163ad60692b6ee2e1173e4bfc397430cd))
* **interaction:** invalid "hiddenColumnFields" config close [#417](https://github.com/antvis/S2/issues/417) ([#431](https://github.com/antvis/S2/issues/431)) ([6cd461e](https://github.com/antvis/S2/commit/6cd461e6d132a18cc7192bf90d946f5de8b8d1f7))
* **interaction:** optimize reset state logic ([#441](https://github.com/antvis/S2/issues/441)) ([f07e657](https://github.com/antvis/S2/commit/f07e657c0c2be5090a390fcc0ee7f4c74a008e3f))
* **interaction:** support batch hidden columns ([#439](https://github.com/antvis/S2/issues/439)) ([d0a4d97](https://github.com/antvis/S2/commit/d0a4d97d4f343c689f227e0ced6e8723dead007f))
* **interaction:** wrong hidden column icon position ([#329](https://github.com/antvis/S2/issues/329)) ([19d4497](https://github.com/antvis/S2/commit/19d4497b3112cf543d170e65f230f0e885ece8a4))
* pagination err ([#453](https://github.com/antvis/S2/issues/453)) ([3d0535e](https://github.com/antvis/S2/commit/3d0535e2390a2ce258df00430dd387745251bd04))
* **performance:** optimize performance when table switch to pivot, [#415](https://github.com/antvis/S2/issues/415) ([#429](https://github.com/antvis/S2/issues/429)) ([215e6c4](https://github.com/antvis/S2/commit/215e6c4755c1101bd4920847a398cf48c07448ce))
* **poivt-table:** fix render apply font crash on ios15 ([#394](https://github.com/antvis/S2/issues/394)) ([cbb7045](https://github.com/antvis/S2/commit/cbb7045354e674c858185c307b1e5ac2ecd0a70f))
* **povit-table:** resolve scroll shake issue close [#374](https://github.com/antvis/S2/issues/374) ([#379](https://github.com/antvis/S2/issues/379)) ([014d683](https://github.com/antvis/S2/commit/014d683a8cc251f0f4cddb28662b45b7b96d4edb))
* **resize:** fix set width and height problem ([#402](https://github.com/antvis/S2/issues/402)) ([41caf18](https://github.com/antvis/S2/commit/41caf1812687130d9d4d595b680c544a69a49843))
* return filtered dataset on range_filtered event ([#513](https://github.com/antvis/S2/issues/513)) ([ed7e78a](https://github.com/antvis/S2/commit/ed7e78adea7b8bd1c629c579f36ae6f2b5f2c15f))
* revert code ([#325](https://github.com/antvis/S2/issues/325)) ([6ece5e8](https://github.com/antvis/S2/commit/6ece5e89f50b7d450c412e224546e923792d0aca))
* row-col-click's show about pivot and table, formatter when showSingleTips ([#327](https://github.com/antvis/S2/issues/327)) ([23d3508](https://github.com/antvis/S2/commit/23d3508bc42954e1561c350cc11db54cc54bf321))
* **spreadsheet:** solve the workflow and test case ([#286](https://github.com/antvis/S2/issues/286)) ([c44e469](https://github.com/antvis/S2/commit/c44e4691435623d7de84b70c08308d2b1943d6bc)), closes [#269](https://github.com/antvis/S2/issues/269) [#270](https://github.com/antvis/S2/issues/270) [#268](https://github.com/antvis/S2/issues/268) [#267](https://github.com/antvis/S2/issues/267) [#271](https://github.com/antvis/S2/issues/271) [#272](https://github.com/antvis/S2/issues/272) [#265](https://github.com/antvis/S2/issues/265) [#274](https://github.com/antvis/S2/issues/274) [#276](https://github.com/antvis/S2/issues/276) [#277](https://github.com/antvis/S2/issues/277) [#283](https://github.com/antvis/S2/issues/283) [#273](https://github.com/antvis/S2/issues/273) [#267](https://github.com/antvis/S2/issues/267)
* table dataset spec ([#288](https://github.com/antvis/S2/issues/288)) ([63bef22](https://github.com/antvis/S2/commit/63bef22319ab05c7d1b3d9aeace49e043731d3af))
* **table:** frozen pagination issue ([#338](https://github.com/antvis/S2/issues/338)) ([39d26a5](https://github.com/antvis/S2/commit/39d26a56de3ecc862c529d72b9dc431b1af0611a))
* **table-facet:** calulate colsHierarchy width after layoutCoordinate hook ([#518](https://github.com/antvis/S2/issues/518)) ([c0636fb](https://github.com/antvis/S2/commit/c0636fbc35ffcb27e95064fd6e04b596d09118cd))
* **table:** scroll position issue when re-render ([#459](https://github.com/antvis/S2/issues/459)) ([4dfa275](https://github.com/antvis/S2/commit/4dfa275ac8cbac33767dd6a8d4def60190c4afa4))
* **table:** table mode corner width err ([#396](https://github.com/antvis/S2/issues/396)) ([e3b9442](https://github.com/antvis/S2/commit/e3b9442ef2952b1047f9e46b3cdf5c153318b768))
* **tooltip:** custom tooltip keep right position wrong calc ([#436](https://github.com/antvis/S2/issues/436)) ([88fe05e](https://github.com/antvis/S2/commit/88fe05e7241e38e817ec60ddc40ef63315dbb3be))
* **tooltip:** fix cannot render tooltip element when first show ([#354](https://github.com/antvis/S2/issues/354)) ([78c22a6](https://github.com/antvis/S2/commit/78c22a6c8d3abb6357451e6752ad4fb4c2334e25))
* **tooltip:** fix cannot show sort menu when icon first clicked ([#366](https://github.com/antvis/S2/issues/366)) ([9c800a5](https://github.com/antvis/S2/commit/9c800a55291c36fed84bbf4e393e1b4dd6576e60))
* **tooltip:** tooltip will hide if cliced ([#370](https://github.com/antvis/S2/issues/370)) ([dccd4f5](https://github.com/antvis/S2/commit/dccd4f5bf667af0401e9d517f729992ba6dc7068))
* update d.ts path ([#319](https://github.com/antvis/S2/issues/319)) ([4117fa5](https://github.com/antvis/S2/commit/4117fa5bc3a23956f6e61cf0284cdd11356f7e39))
* update external using regex ([#304](https://github.com/antvis/S2/issues/304)) ([c40d3cc](https://github.com/antvis/S2/commit/c40d3cc6d37395b9c45d6ee2720126a2a1c8a87d))

### Features

* :sparkles: add column header labels for the corner header ([#320](https://github.com/antvis/S2/issues/320)) ([1b87bda](https://github.com/antvis/S2/commit/1b87bda6e6c2decfbd60c975d78afbcf5f0eb400))
* :sparkles: add skeleton for empty data and close [#507](https://github.com/antvis/S2/issues/507) ([#532](https://github.com/antvis/S2/issues/532)) ([ba1b447](https://github.com/antvis/S2/commit/ba1b44764c0a817dc8453bbb5c56714cdbc354af))
* :sparkles: allow users to set different display condition for headerActionIcons ([#352](https://github.com/antvis/S2/issues/352)) ([9375f2b](https://github.com/antvis/S2/commit/9375f2b8e594355b2e456fb18910085139f76932))
* :sparkles: init examples gallery for the site ([#280](https://github.com/antvis/S2/issues/280)) ([891ce39](https://github.com/antvis/S2/commit/891ce391e5009384a34b7b91ee3507f8c1cae708))
* ✨ add custom header action icons ([#331](https://github.com/antvis/S2/issues/331)) ([4dcb1a2](https://github.com/antvis/S2/commit/4dcb1a2344783c8df283071bee1f8b07988b9b01))
* ✨ enable users to set the page size of the pagination configuration and close [#302](https://github.com/antvis/S2/issues/302) ([#309](https://github.com/antvis/S2/issues/309)) ([e5e961e](https://github.com/antvis/S2/commit/e5e961e306092c7ebabefa782a7ea54324656018))
* ✨ part drill down based on the new data process ([#399](https://github.com/antvis/S2/issues/399)) ([6a8889b](https://github.com/antvis/S2/commit/6a8889be5c47c49f335528548b3289577e0bd175))
* 🎸 added ability to filter field values ([#356](https://github.com/antvis/S2/issues/356)) ([92d9698](https://github.com/antvis/S2/commit/92d9698cf40de4fb3a5f099fd6a44821cb2a1bab))
* 🔖 publish v0.1.3 ([#257](https://github.com/antvis/S2/issues/257)) ([92e452a](https://github.com/antvis/S2/commit/92e452ab6fef1bd4b3a3ed0e424e405e362ce425)), closes [#238](https://github.com/antvis/S2/issues/238) [#237](https://github.com/antvis/S2/issues/237) [#7](https://github.com/antvis/S2/issues/7) [#10](https://github.com/antvis/S2/issues/10) [#12](https://github.com/antvis/S2/issues/12) [#13](https://github.com/antvis/S2/issues/13) [#16](https://github.com/antvis/S2/issues/16) [#17](https://github.com/antvis/S2/issues/17) [#11](https://github.com/antvis/S2/issues/11) [#19](https://github.com/antvis/S2/issues/19) [#18](https://github.com/antvis/S2/issues/18) [#21](https://github.com/antvis/S2/issues/21) [#23](https://github.com/antvis/S2/issues/23) [#20](https://github.com/antvis/S2/issues/20) [#24](https://github.com/antvis/S2/issues/24) [#20](https://github.com/antvis/S2/issues/20) [#26](https://github.com/antvis/S2/issues/26) [#27](https://github.com/antvis/S2/issues/27) [#28](https://github.com/antvis/S2/issues/28) [#29](https://github.com/antvis/S2/issues/29) [#35](https://github.com/antvis/S2/issues/35) [#37](https://github.com/antvis/S2/issues/37) [#38](https://github.com/antvis/S2/issues/38) [#39](https://github.com/antvis/S2/issues/39) [#42](https://github.com/antvis/S2/issues/42) [#43](https://github.com/antvis/S2/issues/43) [#44](https://github.com/antvis/S2/issues/44) [#45](https://github.com/antvis/S2/issues/45) [#47](https://github.com/antvis/S2/issues/47) [#46](https://github.com/antvis/S2/issues/46) [#48](https://github.com/antvis/S2/issues/48) [#32](https://github.com/antvis/S2/issues/32) [#31](https://github.com/antvis/S2/issues/31) [#49](https://github.com/antvis/S2/issues/49) [#32](https://github.com/antvis/S2/issues/32) [#31](https://github.com/antvis/S2/issues/31) [#50](https://github.com/antvis/S2/issues/50) [#51](https://github.com/antvis/S2/issues/51) [#52](https://github.com/antvis/S2/issues/52) [#55](https://github.com/antvis/S2/issues/55) [#57](https://github.com/antvis/S2/issues/57) [#58](https://github.com/antvis/S2/issues/58) [#59](https://github.com/antvis/S2/issues/59) [#14](https://github.com/antvis/S2/issues/14) [#30](https://github.com/antvis/S2/issues/30) [#60](https://github.com/antvis/S2/issues/60) [#61](https://github.com/antvis/S2/issues/61) [#64](https://github.com/antvis/S2/issues/64) [#65](https://github.com/antvis/S2/issues/65) [#69](https://github.com/antvis/S2/issues/69) [#70](https://github.com/antvis/S2/issues/70) [#71](https://github.com/antvis/S2/issues/71) [#70](https://github.com/antvis/S2/issues/70) [#70](https://github.com/antvis/S2/issues/70) [#72](https://github.com/antvis/S2/issues/72) [#73](https://github.com/antvis/S2/issues/73) [#74](https://github.com/antvis/S2/issues/74) [#75](https://github.com/antvis/S2/issues/75) [#76](https://github.com/antvis/S2/issues/76) [#82](https://github.com/antvis/S2/issues/82) [#85](https://github.com/antvis/S2/issues/85) [#91](https://github.com/antvis/S2/issues/91) [#81](https://github.com/antvis/S2/issues/81) [#94](https://github.com/antvis/S2/issues/94) [#95](https://github.com/antvis/S2/issues/95) [#100](https://github.com/antvis/S2/issues/100) [#99](https://github.com/antvis/S2/issues/99) [#101](https://github.com/antvis/S2/issues/101) [#107](https://github.com/antvis/S2/issues/107) [#108](https://github.com/antvis/S2/issues/108) [#109](https://github.com/antvis/S2/issues/109) [#112](https://github.com/antvis/S2/issues/112) [#114](https://github.com/antvis/S2/issues/114) [#115](https://github.com/antvis/S2/issues/115) [#116](https://github.com/antvis/S2/issues/116) [#117](https://github.com/antvis/S2/issues/117) [#119](https://github.com/antvis/S2/issues/119) [#121](https://github.com/antvis/S2/issues/121) [#122](https://github.com/antvis/S2/issues/122) [#124](https://github.com/antvis/S2/issues/124) [#125](https://github.com/antvis/S2/issues/125) [#123](https://github.com/antvis/S2/issues/123) [#120](https://github.com/antvis/S2/issues/120) [#126](https://github.com/antvis/S2/issues/126) [#128](https://github.com/antvis/S2/issues/128) [#130](https://github.com/antvis/S2/issues/130) [#129](https://github.com/antvis/S2/issues/129) [#113](https://github.com/antvis/S2/issues/113) [#132](https://github.com/antvis/S2/issues/132) [#135](https://github.com/antvis/S2/issues/135) [#138](https://github.com/antvis/S2/issues/138) [#118](https://github.com/antvis/S2/issues/118) [#139](https://github.com/antvis/S2/issues/139) [#118](https://github.com/antvis/S2/issues/118) [#142](https://github.com/antvis/S2/issues/142) [#143](https://github.com/antvis/S2/issues/143) [#137](https://github.com/antvis/S2/issues/137) [#136](https://github.com/antvis/S2/issues/136) [#148](https://github.com/antvis/S2/issues/148) [#146](https://github.com/antvis/S2/issues/146) [#149](https://github.com/antvis/S2/issues/149) [#152](https://github.com/antvis/S2/issues/152) [#153](https://github.com/antvis/S2/issues/153) [#155](https://github.com/antvis/S2/issues/155) [#156](https://github.com/antvis/S2/issues/156) [#151](https://github.com/antvis/S2/issues/151) [#157](https://github.com/antvis/S2/issues/157) [#154](https://github.com/antvis/S2/issues/154) [#160](https://github.com/antvis/S2/issues/160) [#162](https://github.com/antvis/S2/issues/162) [#164](https://github.com/antvis/S2/issues/164) [#158](https://github.com/antvis/S2/issues/158) [#167](https://github.com/antvis/S2/issues/167) [#170](https://github.com/antvis/S2/issues/170) [#165](https://github.com/antvis/S2/issues/165) [#171](https://github.com/antvis/S2/issues/171) [#163](https://github.com/antvis/S2/issues/163) [#174](https://github.com/antvis/S2/issues/174) [#172](https://github.com/antvis/S2/issues/172) [#175](https://github.com/antvis/S2/issues/175) [#173](https://github.com/antvis/S2/issues/173) [#179](https://github.com/antvis/S2/issues/179) [#183](https://github.com/antvis/S2/issues/183) [#182](https://github.com/antvis/S2/issues/182) [#180](https://github.com/antvis/S2/issues/180) [#184](https://github.com/antvis/S2/issues/184) [#185](https://github.com/antvis/S2/issues/185) [#181](https://github.com/antvis/S2/issues/181) [#178](https://github.com/antvis/S2/issues/178) [#192](https://github.com/antvis/S2/issues/192) [#189](https://github.com/antvis/S2/issues/189) [#190](https://github.com/antvis/S2/issues/190) [#194](https://github.com/antvis/S2/issues/194) [#197](https://github.com/antvis/S2/issues/197) [#196](https://github.com/antvis/S2/issues/196) [#203](https://github.com/antvis/S2/issues/203) [#207](https://github.com/antvis/S2/issues/207) [#204](https://github.com/antvis/S2/issues/204) [#206](https://github.com/antvis/S2/issues/206) [#208](https://github.com/antvis/S2/issues/208) [#202](https://github.com/antvis/S2/issues/202) [#201](https://github.com/antvis/S2/issues/201) [#209](https://github.com/antvis/S2/issues/209) [#200](https://github.com/antvis/S2/issues/200) [#210](https://github.com/antvis/S2/issues/210) [#211](https://github.com/antvis/S2/issues/211) [#214](https://github.com/antvis/S2/issues/214) [#213](https://github.com/antvis/S2/issues/213) [#212](https://github.com/antvis/S2/issues/212) [#216](https://github.com/antvis/S2/issues/216) [#217](https://github.com/antvis/S2/issues/217) [#218](https://github.com/antvis/S2/issues/218) [#219](https://github.com/antvis/S2/issues/219) [#221](https://github.com/antvis/S2/issues/221) [#222](https://github.com/antvis/S2/issues/222) [#240](https://github.com/antvis/S2/issues/240) [#241](https://github.com/antvis/S2/issues/241) [#242](https://github.com/antvis/S2/issues/242) [#248](https://github.com/antvis/S2/issues/248) [#245](https://github.com/antvis/S2/issues/245) [#252](https://github.com/antvis/S2/issues/252) [#249](https://github.com/antvis/S2/issues/249)
* add advanced sort component ([#428](https://github.com/antvis/S2/issues/428)) ([c3a3fb5](https://github.com/antvis/S2/commit/c3a3fb5ba16dc4ef65f301b054a78095c36f5524))
* add confirm and cancel button for switcher ([#495](https://github.com/antvis/S2/issues/495)) ([d31ce63](https://github.com/antvis/S2/commit/d31ce63a87d87878f033f51ac2a0e7f4d90c2b31))
* add doc for table ([#360](https://github.com/antvis/S2/issues/360)) ([a7ee65e](https://github.com/antvis/S2/commit/a7ee65e4f46a0e8253a756d6c2619166e36a8c8e))
* add group sort in col's values and refactor tooltip's style ([#284](https://github.com/antvis/S2/issues/284)) ([ad02d9d](https://github.com/antvis/S2/commit/ad02d9db301f6be34112ac99e6db2de48af4c2dc)), closes [#269](https://github.com/antvis/S2/issues/269) [#270](https://github.com/antvis/S2/issues/270) [#268](https://github.com/antvis/S2/issues/268) [#267](https://github.com/antvis/S2/issues/267) [#271](https://github.com/antvis/S2/issues/271) [#272](https://github.com/antvis/S2/issues/272) [#265](https://github.com/antvis/S2/issues/265) [#274](https://github.com/antvis/S2/issues/274) [#276](https://github.com/antvis/S2/issues/276) [#277](https://github.com/antvis/S2/issues/277) [#283](https://github.com/antvis/S2/issues/283)
* add tooltip col and row config handle ([#440](https://github.com/antvis/S2/issues/440)) ([b457d27](https://github.com/antvis/S2/commit/b457d27ce1ba6de368e39632675c295ff3af8174))
* add total measure formatter for values in rows ([#462](https://github.com/antvis/S2/issues/462)) ([615be65](https://github.com/antvis/S2/commit/615be65b2f1afe9815c7889a34b6aa17a303dc66))
* copy with row and col ([#387](https://github.com/antvis/S2/issues/387)) ([7602ef8](https://github.com/antvis/S2/commit/7602ef87d5821b7a897c779f90d37bfc1e52d25f))
* dimensions switcher ([#298](https://github.com/antvis/S2/issues/298)) ([f223319](https://github.com/antvis/S2/commit/f2233194850604f5245e7eb19ea61f3993a592fe)), closes [#269](https://github.com/antvis/S2/issues/269) [#270](https://github.com/antvis/S2/issues/270) [#268](https://github.com/antvis/S2/issues/268) [#267](https://github.com/antvis/S2/issues/267) [#271](https://github.com/antvis/S2/issues/271)
* **facet:** add scroll speed ratio ([#438](https://github.com/antvis/S2/issues/438)) ([9ba97fb](https://github.com/antvis/S2/commit/9ba97fb716132b5c5bd49f03e16a6cb5d0ae51e4))
* **interaction:** add autoResetSheetStyle options ([#465](https://github.com/antvis/S2/issues/465)) ([00f316d](https://github.com/antvis/S2/commit/00f316d99566478c96660ff72d2f0541af572c74))
* **interaction:** hidden columns ([#296](https://github.com/antvis/S2/issues/296)) ([f5f4a69](https://github.com/antvis/S2/commit/f5f4a69dbd2b436f36e874323115d54af9f0aa16))
* **interaction:** select interaction imporement ([#324](https://github.com/antvis/S2/issues/324)) ([6b5479d](https://github.com/antvis/S2/commit/6b5479d9cb9718ce0c657277ef2ad30c56b8ded7))
* refactor switcher component ([#380](https://github.com/antvis/S2/issues/380)) ([f5c2993](https://github.com/antvis/S2/commit/f5c2993801d4f2b0d09ecaf4b8f751deefbac0d0))
* select all ([#348](https://github.com/antvis/S2/issues/348)) ([334aac4](https://github.com/antvis/S2/commit/334aac41ac9511c3b417a7006591fdbf138ab618)), closes [#342](https://github.com/antvis/S2/issues/342) [#339](https://github.com/antvis/S2/issues/339)
* tooltip support config auto adjust boundary ([#538](https://github.com/antvis/S2/issues/538)) ([2a14873](https://github.com/antvis/S2/commit/2a14873507c1480b3b209ffd5cb46421aca4096e))
* **util:** add generateId export function ([#488](https://github.com/antvis/S2/issues/488)) ([0e6025e](https://github.com/antvis/S2/commit/0e6025e20e5b2eeca0692dbb90fabcaffd66d3c1))

## [0.2.3](https://github.com/antvis/S2/compare/v0.1.1...v0.2.3) (2021-10-22)

### Bug Fixes

* :bug: correct the condition of the adustTotalNodesCoordinate ([#455](https://github.com/antvis/S2/issues/455)) ([34c9f87](https://github.com/antvis/S2/commit/34c9f87897186a2ab62c26062ddeae08c9704308))
* :bug: correct the wrong condition to show the default headerActionIcons for detail table mode ([#486](https://github.com/antvis/S2/issues/486)) ([596e9f3](https://github.com/antvis/S2/commit/596e9f333769967c49ae822292efe02412ed2220))
* :bug: optimize the subTotal cells layout logic and close [#368](https://github.com/antvis/S2/issues/368) ([#425](https://github.com/antvis/S2/issues/425)) ([7fe2cbf](https://github.com/antvis/S2/commit/7fe2cbf1728b223e4717add85e0b6e27a398b56f))
* :bug: prevent the cell click event when clicking the HeaderActionIcon and close [#409](https://github.com/antvis/S2/issues/409) [#452](https://github.com/antvis/S2/issues/452) ([#489](https://github.com/antvis/S2/issues/489)) ([f1a1a82](https://github.com/antvis/S2/commit/f1a1a8252de46b137221c6fe85f0deced2591fb6))
* :bug: set the default page and close [#473](https://github.com/antvis/S2/issues/473) ([#500](https://github.com/antvis/S2/issues/500)) ([567dc0e](https://github.com/antvis/S2/commit/567dc0e1b57c6dff4935cd387abd47ba251e86d8))
* :bug: solve the wrong numbers of headerActionIcons config in drill-down mode ([#445](https://github.com/antvis/S2/issues/445)) ([7ca0a70](https://github.com/antvis/S2/commit/7ca0a70a8f822146c9a672fa420e22ea5f2f617a))
* 🐛 solve the wrong position of the grandTotal cell in multi-value mode and close [#372](https://github.com/antvis/S2/issues/372) ([#437](https://github.com/antvis/S2/issues/437)) ([b24657c](https://github.com/antvis/S2/commit/b24657c65d027f3447cbbc07d089022f3edfbe27))
* 🐛 tweak the corner cell icon position and close [#464](https://github.com/antvis/S2/issues/464) ([#504](https://github.com/antvis/S2/issues/504)) ([5ea90a6](https://github.com/antvis/S2/commit/5ea90a63d953f3e79a02bf3352e02e09a53efa71))
* 🐛 add the `spreadsheet` for the meta of the corner cell in tree mode and tweak the style of cell borders ([#342](https://github.com/antvis/S2/issues/342)) ([f322519](https://github.com/antvis/S2/commit/f322519fe42659286c0d4306eef0fa2922ad69aa)), closes [#339](https://github.com/antvis/S2/issues/339)
* 🐛 clear the drill-down cache after setting the dataConfig and close [#496](https://github.com/antvis/S2/issues/496) ([#510](https://github.com/antvis/S2/issues/510)) ([c39a07b](https://github.com/antvis/S2/commit/c39a07bfa0c1caeae66d428278c29012b8e3e4ea))
* 🐛 event disposal on facet destroy ([#493](https://github.com/antvis/S2/issues/493)) ([e48a20d](https://github.com/antvis/S2/commit/e48a20dfac17c6364909c157dd7ad6c4a7d0f51b))
* 🐛 getEndRows return all items when theres no frozen row ([#503](https://github.com/antvis/S2/issues/503)) ([6952526](https://github.com/antvis/S2/commit/6952526bd265638986ebbefa27b4b4d3922fa8cc))
* 🐛 solve the wrong render state when updating the dataCfg and close [#285](https://github.com/antvis/S2/issues/285) ([#299](https://github.com/antvis/S2/issues/299)) ([b69cf24](https://github.com/antvis/S2/commit/b69cf2405584483cc1639adc2d44af1b728f8d05))
* 🐛 totals caculate width's err when data is empty but options have totals ([#517](https://github.com/antvis/S2/issues/517)) ([96c35f7](https://github.com/antvis/S2/commit/96c35f7151011322d8163440e9b8140a714356ec))
* cannot hidden columns ([#491](https://github.com/antvis/S2/issues/491)) ([dc78a4f](https://github.com/antvis/S2/commit/dc78a4f57b802b1ed2854b32a77abd7d0ecf7afd))
* expand corner cell width, make it nowrap initially ([#408](https://github.com/antvis/S2/issues/408)) ([c73bb6d](https://github.com/antvis/S2/commit/c73bb6d391f8f030212eed9ff7b9da249ae95d4a))
* export feature ([#412](https://github.com/antvis/S2/issues/412)) ([6c2a5b8](https://github.com/antvis/S2/commit/6c2a5b8ad625567de5cf138aca51c9faf5d4c354))
* **export:** 🐛 solve the table sheet export problem and close [#446](https://github.com/antvis/S2/issues/446) ([#466](https://github.com/antvis/S2/issues/466)) ([d5eda7c](https://github.com/antvis/S2/commit/d5eda7c8461cc651b6653afcdea71cee5611bbb8))
* **facet:** fix issue [#291](https://github.com/antvis/S2/issues/291) ([#297](https://github.com/antvis/S2/issues/297)) ([28a5c11](https://github.com/antvis/S2/commit/28a5c115501ddbe78432682c9c8cfb4b8b5c7780))
* **facet:** frozen clip and resizer issue ([#275](https://github.com/antvis/S2/issues/275)) ([6b53061](https://github.com/antvis/S2/commit/6b53061583e0062242a6473c2413bae339ff1338)), closes [#269](https://github.com/antvis/S2/issues/269) [#270](https://github.com/antvis/S2/issues/270) [#268](https://github.com/antvis/S2/issues/268) [#267](https://github.com/antvis/S2/issues/267) [#271](https://github.com/antvis/S2/issues/271) [#272](https://github.com/antvis/S2/issues/272) [#265](https://github.com/antvis/S2/issues/265) [#274](https://github.com/antvis/S2/issues/274) [#276](https://github.com/antvis/S2/issues/276)
* fix merge cells translate wrong position issue ([#458](https://github.com/antvis/S2/issues/458)) ([5bc7ede](https://github.com/antvis/S2/commit/5bc7ede4fbcb53e83cc77455f1b3ac353e6c1d87))
* fix merged cells can't be sorted and dragged ([#471](https://github.com/antvis/S2/issues/471)) ([cfd9ff0](https://github.com/antvis/S2/commit/cfd9ff03ad98253a4672a2e1117593b3703898e8))
* **interaction:** add brush move distance validate ([#321](https://github.com/antvis/S2/issues/321)) ([2ee8f9d](https://github.com/antvis/S2/commit/2ee8f9d163ad60692b6ee2e1173e4bfc397430cd))
* **interaction:** invalid "hiddenColumnFields" config close [#417](https://github.com/antvis/S2/issues/417) ([#431](https://github.com/antvis/S2/issues/431)) ([6cd461e](https://github.com/antvis/S2/commit/6cd461e6d132a18cc7192bf90d946f5de8b8d1f7))
* **interaction:** optimize reset state logic ([#441](https://github.com/antvis/S2/issues/441)) ([f07e657](https://github.com/antvis/S2/commit/f07e657c0c2be5090a390fcc0ee7f4c74a008e3f))
* **interaction:** support batch hidden columns ([#439](https://github.com/antvis/S2/issues/439)) ([d0a4d97](https://github.com/antvis/S2/commit/d0a4d97d4f343c689f227e0ced6e8723dead007f))
* **interaction:** wrong hidden column icon position ([#329](https://github.com/antvis/S2/issues/329)) ([19d4497](https://github.com/antvis/S2/commit/19d4497b3112cf543d170e65f230f0e885ece8a4))
* pagination err ([#453](https://github.com/antvis/S2/issues/453)) ([3d0535e](https://github.com/antvis/S2/commit/3d0535e2390a2ce258df00430dd387745251bd04))
* **performance:** optimize performance when table switch to pivot, [#415](https://github.com/antvis/S2/issues/415) ([#429](https://github.com/antvis/S2/issues/429)) ([215e6c4](https://github.com/antvis/S2/commit/215e6c4755c1101bd4920847a398cf48c07448ce))
* **poivt-table:** fix render apply font crash on ios15 ([#394](https://github.com/antvis/S2/issues/394)) ([cbb7045](https://github.com/antvis/S2/commit/cbb7045354e674c858185c307b1e5ac2ecd0a70f))
* **povit-table:** resolve scroll shake issue close [#374](https://github.com/antvis/S2/issues/374) ([#379](https://github.com/antvis/S2/issues/379)) ([014d683](https://github.com/antvis/S2/commit/014d683a8cc251f0f4cddb28662b45b7b96d4edb))
* **resize:** fix set width and height problem ([#402](https://github.com/antvis/S2/issues/402)) ([41caf18](https://github.com/antvis/S2/commit/41caf1812687130d9d4d595b680c544a69a49843))
* return filtered dataset on range_filtered event ([#513](https://github.com/antvis/S2/issues/513)) ([ed7e78a](https://github.com/antvis/S2/commit/ed7e78adea7b8bd1c629c579f36ae6f2b5f2c15f))
* revert code ([#325](https://github.com/antvis/S2/issues/325)) ([6ece5e8](https://github.com/antvis/S2/commit/6ece5e89f50b7d450c412e224546e923792d0aca))
* row-col-click's show about pivot and table, formatter when showSingleTips ([#327](https://github.com/antvis/S2/issues/327)) ([23d3508](https://github.com/antvis/S2/commit/23d3508bc42954e1561c350cc11db54cc54bf321))
* **spreadsheet:** solve the workflow and test case ([#286](https://github.com/antvis/S2/issues/286)) ([c44e469](https://github.com/antvis/S2/commit/c44e4691435623d7de84b70c08308d2b1943d6bc)), closes [#269](https://github.com/antvis/S2/issues/269) [#270](https://github.com/antvis/S2/issues/270) [#268](https://github.com/antvis/S2/issues/268) [#267](https://github.com/antvis/S2/issues/267) [#271](https://github.com/antvis/S2/issues/271) [#272](https://github.com/antvis/S2/issues/272) [#265](https://github.com/antvis/S2/issues/265) [#274](https://github.com/antvis/S2/issues/274) [#276](https://github.com/antvis/S2/issues/276) [#277](https://github.com/antvis/S2/issues/277) [#283](https://github.com/antvis/S2/issues/283) [#273](https://github.com/antvis/S2/issues/273) [#267](https://github.com/antvis/S2/issues/267)
* table dataset spec ([#288](https://github.com/antvis/S2/issues/288)) ([63bef22](https://github.com/antvis/S2/commit/63bef22319ab05c7d1b3d9aeace49e043731d3af))
* **table:** frozen pagination issue ([#338](https://github.com/antvis/S2/issues/338)) ([39d26a5](https://github.com/antvis/S2/commit/39d26a56de3ecc862c529d72b9dc431b1af0611a))
* **table-facet:** calulate colsHierarchy width after layoutCoordinate hook ([#518](https://github.com/antvis/S2/issues/518)) ([c0636fb](https://github.com/antvis/S2/commit/c0636fbc35ffcb27e95064fd6e04b596d09118cd))
* **table:** scroll position issue when re-render ([#459](https://github.com/antvis/S2/issues/459)) ([4dfa275](https://github.com/antvis/S2/commit/4dfa275ac8cbac33767dd6a8d4def60190c4afa4))
* **table:** table mode corner width err ([#396](https://github.com/antvis/S2/issues/396)) ([e3b9442](https://github.com/antvis/S2/commit/e3b9442ef2952b1047f9e46b3cdf5c153318b768))
* **tooltip:** custom tooltip keep right position wrong calc ([#436](https://github.com/antvis/S2/issues/436)) ([88fe05e](https://github.com/antvis/S2/commit/88fe05e7241e38e817ec60ddc40ef63315dbb3be))
* **tooltip:** fix cannot render tooltip element when first show ([#354](https://github.com/antvis/S2/issues/354)) ([78c22a6](https://github.com/antvis/S2/commit/78c22a6c8d3abb6357451e6752ad4fb4c2334e25))
* **tooltip:** fix cannot show sort menu when icon first clicked ([#366](https://github.com/antvis/S2/issues/366)) ([9c800a5](https://github.com/antvis/S2/commit/9c800a55291c36fed84bbf4e393e1b4dd6576e60))
* **tooltip:** tooltip will hide if cliced ([#370](https://github.com/antvis/S2/issues/370)) ([dccd4f5](https://github.com/antvis/S2/commit/dccd4f5bf667af0401e9d517f729992ba6dc7068))
* update d.ts path ([#319](https://github.com/antvis/S2/issues/319)) ([4117fa5](https://github.com/antvis/S2/commit/4117fa5bc3a23956f6e61cf0284cdd11356f7e39))
* update external using regex ([#304](https://github.com/antvis/S2/issues/304)) ([c40d3cc](https://github.com/antvis/S2/commit/c40d3cc6d37395b9c45d6ee2720126a2a1c8a87d))

### Features

* :sparkles: add column header labels for the corner header ([#320](https://github.com/antvis/S2/issues/320)) ([1b87bda](https://github.com/antvis/S2/commit/1b87bda6e6c2decfbd60c975d78afbcf5f0eb400))
* :sparkles: allow users to set different display condition for headerActionIcons ([#352](https://github.com/antvis/S2/issues/352)) ([9375f2b](https://github.com/antvis/S2/commit/9375f2b8e594355b2e456fb18910085139f76932))
* :sparkles: init examples gallery for the site ([#280](https://github.com/antvis/S2/issues/280)) ([891ce39](https://github.com/antvis/S2/commit/891ce391e5009384a34b7b91ee3507f8c1cae708))
* ✨ add custom header action icons ([#331](https://github.com/antvis/S2/issues/331)) ([4dcb1a2](https://github.com/antvis/S2/commit/4dcb1a2344783c8df283071bee1f8b07988b9b01))
* ✨ enable users to set the page size of the pagination configuration and close [#302](https://github.com/antvis/S2/issues/302) ([#309](https://github.com/antvis/S2/issues/309)) ([e5e961e](https://github.com/antvis/S2/commit/e5e961e306092c7ebabefa782a7ea54324656018))
* ✨ part drill down based on the new data process ([#399](https://github.com/antvis/S2/issues/399)) ([6a8889b](https://github.com/antvis/S2/commit/6a8889be5c47c49f335528548b3289577e0bd175))
* 🎸 added ability to filter field values ([#356](https://github.com/antvis/S2/issues/356)) ([92d9698](https://github.com/antvis/S2/commit/92d9698cf40de4fb3a5f099fd6a44821cb2a1bab))
* 🔖 publish v0.1.3 ([#257](https://github.com/antvis/S2/issues/257)) ([92e452a](https://github.com/antvis/S2/commit/92e452ab6fef1bd4b3a3ed0e424e405e362ce425)), closes [#238](https://github.com/antvis/S2/issues/238) [#237](https://github.com/antvis/S2/issues/237) [#7](https://github.com/antvis/S2/issues/7) [#10](https://github.com/antvis/S2/issues/10) [#12](https://github.com/antvis/S2/issues/12) [#13](https://github.com/antvis/S2/issues/13) [#16](https://github.com/antvis/S2/issues/16) [#17](https://github.com/antvis/S2/issues/17) [#11](https://github.com/antvis/S2/issues/11) [#19](https://github.com/antvis/S2/issues/19) [#18](https://github.com/antvis/S2/issues/18) [#21](https://github.com/antvis/S2/issues/21) [#23](https://github.com/antvis/S2/issues/23) [#20](https://github.com/antvis/S2/issues/20) [#24](https://github.com/antvis/S2/issues/24) [#20](https://github.com/antvis/S2/issues/20) [#26](https://github.com/antvis/S2/issues/26) [#27](https://github.com/antvis/S2/issues/27) [#28](https://github.com/antvis/S2/issues/28) [#29](https://github.com/antvis/S2/issues/29) [#35](https://github.com/antvis/S2/issues/35) [#37](https://github.com/antvis/S2/issues/37) [#38](https://github.com/antvis/S2/issues/38) [#39](https://github.com/antvis/S2/issues/39) [#42](https://github.com/antvis/S2/issues/42) [#43](https://github.com/antvis/S2/issues/43) [#44](https://github.com/antvis/S2/issues/44) [#45](https://github.com/antvis/S2/issues/45) [#47](https://github.com/antvis/S2/issues/47) [#46](https://github.com/antvis/S2/issues/46) [#48](https://github.com/antvis/S2/issues/48) [#32](https://github.com/antvis/S2/issues/32) [#31](https://github.com/antvis/S2/issues/31) [#49](https://github.com/antvis/S2/issues/49) [#32](https://github.com/antvis/S2/issues/32) [#31](https://github.com/antvis/S2/issues/31) [#50](https://github.com/antvis/S2/issues/50) [#51](https://github.com/antvis/S2/issues/51) [#52](https://github.com/antvis/S2/issues/52) [#55](https://github.com/antvis/S2/issues/55) [#57](https://github.com/antvis/S2/issues/57) [#58](https://github.com/antvis/S2/issues/58) [#59](https://github.com/antvis/S2/issues/59) [#14](https://github.com/antvis/S2/issues/14) [#30](https://github.com/antvis/S2/issues/30) [#60](https://github.com/antvis/S2/issues/60) [#61](https://github.com/antvis/S2/issues/61) [#64](https://github.com/antvis/S2/issues/64) [#65](https://github.com/antvis/S2/issues/65) [#69](https://github.com/antvis/S2/issues/69) [#70](https://github.com/antvis/S2/issues/70) [#71](https://github.com/antvis/S2/issues/71) [#70](https://github.com/antvis/S2/issues/70) [#70](https://github.com/antvis/S2/issues/70) [#72](https://github.com/antvis/S2/issues/72) [#73](https://github.com/antvis/S2/issues/73) [#74](https://github.com/antvis/S2/issues/74) [#75](https://github.com/antvis/S2/issues/75) [#76](https://github.com/antvis/S2/issues/76) [#82](https://github.com/antvis/S2/issues/82) [#85](https://github.com/antvis/S2/issues/85) [#91](https://github.com/antvis/S2/issues/91) [#81](https://github.com/antvis/S2/issues/81) [#94](https://github.com/antvis/S2/issues/94) [#95](https://github.com/antvis/S2/issues/95) [#100](https://github.com/antvis/S2/issues/100) [#99](https://github.com/antvis/S2/issues/99) [#101](https://github.com/antvis/S2/issues/101) [#107](https://github.com/antvis/S2/issues/107) [#108](https://github.com/antvis/S2/issues/108) [#109](https://github.com/antvis/S2/issues/109) [#112](https://github.com/antvis/S2/issues/112) [#114](https://github.com/antvis/S2/issues/114) [#115](https://github.com/antvis/S2/issues/115) [#116](https://github.com/antvis/S2/issues/116) [#117](https://github.com/antvis/S2/issues/117) [#119](https://github.com/antvis/S2/issues/119) [#121](https://github.com/antvis/S2/issues/121) [#122](https://github.com/antvis/S2/issues/122) [#124](https://github.com/antvis/S2/issues/124) [#125](https://github.com/antvis/S2/issues/125) [#123](https://github.com/antvis/S2/issues/123) [#120](https://github.com/antvis/S2/issues/120) [#126](https://github.com/antvis/S2/issues/126) [#128](https://github.com/antvis/S2/issues/128) [#130](https://github.com/antvis/S2/issues/130) [#129](https://github.com/antvis/S2/issues/129) [#113](https://github.com/antvis/S2/issues/113) [#132](https://github.com/antvis/S2/issues/132) [#135](https://github.com/antvis/S2/issues/135) [#138](https://github.com/antvis/S2/issues/138) [#118](https://github.com/antvis/S2/issues/118) [#139](https://github.com/antvis/S2/issues/139) [#118](https://github.com/antvis/S2/issues/118) [#142](https://github.com/antvis/S2/issues/142) [#143](https://github.com/antvis/S2/issues/143) [#137](https://github.com/antvis/S2/issues/137) [#136](https://github.com/antvis/S2/issues/136) [#148](https://github.com/antvis/S2/issues/148) [#146](https://github.com/antvis/S2/issues/146) [#149](https://github.com/antvis/S2/issues/149) [#152](https://github.com/antvis/S2/issues/152) [#153](https://github.com/antvis/S2/issues/153) [#155](https://github.com/antvis/S2/issues/155) [#156](https://github.com/antvis/S2/issues/156) [#151](https://github.com/antvis/S2/issues/151) [#157](https://github.com/antvis/S2/issues/157) [#154](https://github.com/antvis/S2/issues/154) [#160](https://github.com/antvis/S2/issues/160) [#162](https://github.com/antvis/S2/issues/162) [#164](https://github.com/antvis/S2/issues/164) [#158](https://github.com/antvis/S2/issues/158) [#167](https://github.com/antvis/S2/issues/167) [#170](https://github.com/antvis/S2/issues/170) [#165](https://github.com/antvis/S2/issues/165) [#171](https://github.com/antvis/S2/issues/171) [#163](https://github.com/antvis/S2/issues/163) [#174](https://github.com/antvis/S2/issues/174) [#172](https://github.com/antvis/S2/issues/172) [#175](https://github.com/antvis/S2/issues/175) [#173](https://github.com/antvis/S2/issues/173) [#179](https://github.com/antvis/S2/issues/179) [#183](https://github.com/antvis/S2/issues/183) [#182](https://github.com/antvis/S2/issues/182) [#180](https://github.com/antvis/S2/issues/180) [#184](https://github.com/antvis/S2/issues/184) [#185](https://github.com/antvis/S2/issues/185) [#181](https://github.com/antvis/S2/issues/181) [#178](https://github.com/antvis/S2/issues/178) [#192](https://github.com/antvis/S2/issues/192) [#189](https://github.com/antvis/S2/issues/189) [#190](https://github.com/antvis/S2/issues/190) [#194](https://github.com/antvis/S2/issues/194) [#197](https://github.com/antvis/S2/issues/197) [#196](https://github.com/antvis/S2/issues/196) [#203](https://github.com/antvis/S2/issues/203) [#207](https://github.com/antvis/S2/issues/207) [#204](https://github.com/antvis/S2/issues/204) [#206](https://github.com/antvis/S2/issues/206) [#208](https://github.com/antvis/S2/issues/208) [#202](https://github.com/antvis/S2/issues/202) [#201](https://github.com/antvis/S2/issues/201) [#209](https://github.com/antvis/S2/issues/209) [#200](https://github.com/antvis/S2/issues/200) [#210](https://github.com/antvis/S2/issues/210) [#211](https://github.com/antvis/S2/issues/211) [#214](https://github.com/antvis/S2/issues/214) [#213](https://github.com/antvis/S2/issues/213) [#212](https://github.com/antvis/S2/issues/212) [#216](https://github.com/antvis/S2/issues/216) [#217](https://github.com/antvis/S2/issues/217) [#218](https://github.com/antvis/S2/issues/218) [#219](https://github.com/antvis/S2/issues/219) [#221](https://github.com/antvis/S2/issues/221) [#222](https://github.com/antvis/S2/issues/222) [#240](https://github.com/antvis/S2/issues/240) [#241](https://github.com/antvis/S2/issues/241) [#242](https://github.com/antvis/S2/issues/242) [#248](https://github.com/antvis/S2/issues/248) [#245](https://github.com/antvis/S2/issues/245) [#252](https://github.com/antvis/S2/issues/252) [#249](https://github.com/antvis/S2/issues/249)
* add advanced sort component ([#428](https://github.com/antvis/S2/issues/428)) ([c3a3fb5](https://github.com/antvis/S2/commit/c3a3fb5ba16dc4ef65f301b054a78095c36f5524))
* add confirm and cancel button for switcher ([#495](https://github.com/antvis/S2/issues/495)) ([d31ce63](https://github.com/antvis/S2/commit/d31ce63a87d87878f033f51ac2a0e7f4d90c2b31))
* add doc for table ([#360](https://github.com/antvis/S2/issues/360)) ([a7ee65e](https://github.com/antvis/S2/commit/a7ee65e4f46a0e8253a756d6c2619166e36a8c8e))
* add group sort in col's values and refactor tooltip's style ([#284](https://github.com/antvis/S2/issues/284)) ([ad02d9d](https://github.com/antvis/S2/commit/ad02d9db301f6be34112ac99e6db2de48af4c2dc)), closes [#269](https://github.com/antvis/S2/issues/269) [#270](https://github.com/antvis/S2/issues/270) [#268](https://github.com/antvis/S2/issues/268) [#267](https://github.com/antvis/S2/issues/267) [#271](https://github.com/antvis/S2/issues/271) [#272](https://github.com/antvis/S2/issues/272) [#265](https://github.com/antvis/S2/issues/265) [#274](https://github.com/antvis/S2/issues/274) [#276](https://github.com/antvis/S2/issues/276) [#277](https://github.com/antvis/S2/issues/277) [#283](https://github.com/antvis/S2/issues/283)
* add tooltip col and row config handle ([#440](https://github.com/antvis/S2/issues/440)) ([b457d27](https://github.com/antvis/S2/commit/b457d27ce1ba6de368e39632675c295ff3af8174))
* add total measure formatter for values in rows ([#462](https://github.com/antvis/S2/issues/462)) ([615be65](https://github.com/antvis/S2/commit/615be65b2f1afe9815c7889a34b6aa17a303dc66))
* copy with row and col ([#387](https://github.com/antvis/S2/issues/387)) ([7602ef8](https://github.com/antvis/S2/commit/7602ef87d5821b7a897c779f90d37bfc1e52d25f))
* dimensions switcher ([#298](https://github.com/antvis/S2/issues/298)) ([f223319](https://github.com/antvis/S2/commit/f2233194850604f5245e7eb19ea61f3993a592fe)), closes [#269](https://github.com/antvis/S2/issues/269) [#270](https://github.com/antvis/S2/issues/270) [#268](https://github.com/antvis/S2/issues/268) [#267](https://github.com/antvis/S2/issues/267) [#271](https://github.com/antvis/S2/issues/271)
* **facet:** add scroll speed ratio ([#438](https://github.com/antvis/S2/issues/438)) ([9ba97fb](https://github.com/antvis/S2/commit/9ba97fb716132b5c5bd49f03e16a6cb5d0ae51e4))
* **interaction:** add autoResetSheetStyle options ([#465](https://github.com/antvis/S2/issues/465)) ([00f316d](https://github.com/antvis/S2/commit/00f316d99566478c96660ff72d2f0541af572c74))
* **interaction:** hidden columns ([#296](https://github.com/antvis/S2/issues/296)) ([f5f4a69](https://github.com/antvis/S2/commit/f5f4a69dbd2b436f36e874323115d54af9f0aa16))
* **interaction:** select interaction imporement ([#324](https://github.com/antvis/S2/issues/324)) ([6b5479d](https://github.com/antvis/S2/commit/6b5479d9cb9718ce0c657277ef2ad30c56b8ded7))
* refactor switcher component ([#380](https://github.com/antvis/S2/issues/380)) ([f5c2993](https://github.com/antvis/S2/commit/f5c2993801d4f2b0d09ecaf4b8f751deefbac0d0))
* select all ([#348](https://github.com/antvis/S2/issues/348)) ([334aac4](https://github.com/antvis/S2/commit/334aac41ac9511c3b417a7006591fdbf138ab618)), closes [#342](https://github.com/antvis/S2/issues/342) [#339](https://github.com/antvis/S2/issues/339)
* **util:** add generateId export function ([#488](https://github.com/antvis/S2/issues/488)) ([0e6025e](https://github.com/antvis/S2/commit/0e6025e20e5b2eeca0692dbb90fabcaffd66d3c1))

## [0.2.1](https://github.com/antvis/S2/compare/v0.1.1...v0.2.1) (2021-10-15)

### Bug Fixes

* :bug: correct the condition of the adustTotalNodesCoordinate ([#455](https://github.com/antvis/S2/issues/455)) ([34c9f87](https://github.com/antvis/S2/commit/34c9f87897186a2ab62c26062ddeae08c9704308))
* :bug: optimize the subTotal cells layout logic and close [#368](https://github.com/antvis/S2/issues/368) ([#425](https://github.com/antvis/S2/issues/425)) ([7fe2cbf](https://github.com/antvis/S2/commit/7fe2cbf1728b223e4717add85e0b6e27a398b56f))
* :bug: solve the wrong numbers of headerActionIcons config in drill-down mode ([#445](https://github.com/antvis/S2/issues/445)) ([7ca0a70](https://github.com/antvis/S2/commit/7ca0a70a8f822146c9a672fa420e22ea5f2f617a))
* 🐛 solve the wrong position of the grandTotal cell in multi-value mode and close [#372](https://github.com/antvis/S2/issues/372) ([#437](https://github.com/antvis/S2/issues/437)) ([b24657c](https://github.com/antvis/S2/commit/b24657c65d027f3447cbbc07d089022f3edfbe27))
* 🐛 add the `spreadsheet` for the meta of the corner cell in tree mode and tweak the style of cell borders ([#342](https://github.com/antvis/S2/issues/342)) ([f322519](https://github.com/antvis/S2/commit/f322519fe42659286c0d4306eef0fa2922ad69aa)), closes [#339](https://github.com/antvis/S2/issues/339)
* 🐛 solve the wrong render state when updating the dataCfg and close [#285](https://github.com/antvis/S2/issues/285) ([#299](https://github.com/antvis/S2/issues/299)) ([b69cf24](https://github.com/antvis/S2/commit/b69cf2405584483cc1639adc2d44af1b728f8d05))
* expand corner cell width, make it nowrap initially ([#408](https://github.com/antvis/S2/issues/408)) ([c73bb6d](https://github.com/antvis/S2/commit/c73bb6d391f8f030212eed9ff7b9da249ae95d4a))
* export feature ([#412](https://github.com/antvis/S2/issues/412)) ([6c2a5b8](https://github.com/antvis/S2/commit/6c2a5b8ad625567de5cf138aca51c9faf5d4c354))
* **export:** 🐛 solve the table sheet export problem and close [#446](https://github.com/antvis/S2/issues/446) ([#466](https://github.com/antvis/S2/issues/466)) ([d5eda7c](https://github.com/antvis/S2/commit/d5eda7c8461cc651b6653afcdea71cee5611bbb8))
* **facet:** fix issue [#291](https://github.com/antvis/S2/issues/291) ([#297](https://github.com/antvis/S2/issues/297)) ([28a5c11](https://github.com/antvis/S2/commit/28a5c115501ddbe78432682c9c8cfb4b8b5c7780))
* **facet:** frozen clip and resizer issue ([#275](https://github.com/antvis/S2/issues/275)) ([6b53061](https://github.com/antvis/S2/commit/6b53061583e0062242a6473c2413bae339ff1338)), closes [#269](https://github.com/antvis/S2/issues/269) [#270](https://github.com/antvis/S2/issues/270) [#268](https://github.com/antvis/S2/issues/268) [#267](https://github.com/antvis/S2/issues/267) [#271](https://github.com/antvis/S2/issues/271) [#272](https://github.com/antvis/S2/issues/272) [#265](https://github.com/antvis/S2/issues/265) [#274](https://github.com/antvis/S2/issues/274) [#276](https://github.com/antvis/S2/issues/276)
* fix merge cells translate wrong position issue ([#458](https://github.com/antvis/S2/issues/458)) ([5bc7ede](https://github.com/antvis/S2/commit/5bc7ede4fbcb53e83cc77455f1b3ac353e6c1d87))
* **interaction:** add brush move distance validate ([#321](https://github.com/antvis/S2/issues/321)) ([2ee8f9d](https://github.com/antvis/S2/commit/2ee8f9d163ad60692b6ee2e1173e4bfc397430cd))
* **interaction:** invalid "hiddenColumnFields" config close [#417](https://github.com/antvis/S2/issues/417) ([#431](https://github.com/antvis/S2/issues/431)) ([6cd461e](https://github.com/antvis/S2/commit/6cd461e6d132a18cc7192bf90d946f5de8b8d1f7))
* **interaction:** optimize reset state logic ([#441](https://github.com/antvis/S2/issues/441)) ([f07e657](https://github.com/antvis/S2/commit/f07e657c0c2be5090a390fcc0ee7f4c74a008e3f))
* **interaction:** support batch hidden columns ([#439](https://github.com/antvis/S2/issues/439)) ([d0a4d97](https://github.com/antvis/S2/commit/d0a4d97d4f343c689f227e0ced6e8723dead007f))
* **interaction:** wrong hidden column icon position ([#329](https://github.com/antvis/S2/issues/329)) ([19d4497](https://github.com/antvis/S2/commit/19d4497b3112cf543d170e65f230f0e885ece8a4))
* pagination err ([#453](https://github.com/antvis/S2/issues/453)) ([3d0535e](https://github.com/antvis/S2/commit/3d0535e2390a2ce258df00430dd387745251bd04))
* **performance:** optimize performance when table switch to pivot, [#415](https://github.com/antvis/S2/issues/415) ([#429](https://github.com/antvis/S2/issues/429)) ([215e6c4](https://github.com/antvis/S2/commit/215e6c4755c1101bd4920847a398cf48c07448ce))
* **poivt-table:** fix render apply font crash on ios15 ([#394](https://github.com/antvis/S2/issues/394)) ([cbb7045](https://github.com/antvis/S2/commit/cbb7045354e674c858185c307b1e5ac2ecd0a70f))
* **povit-table:** resolve scroll shake issue close [#374](https://github.com/antvis/S2/issues/374) ([#379](https://github.com/antvis/S2/issues/379)) ([014d683](https://github.com/antvis/S2/commit/014d683a8cc251f0f4cddb28662b45b7b96d4edb))
* **resize:** fix set width and height problem ([#402](https://github.com/antvis/S2/issues/402)) ([41caf18](https://github.com/antvis/S2/commit/41caf1812687130d9d4d595b680c544a69a49843))
* revert code ([#325](https://github.com/antvis/S2/issues/325)) ([6ece5e8](https://github.com/antvis/S2/commit/6ece5e89f50b7d450c412e224546e923792d0aca))
* row-col-click's show about pivot and table, formatter when showSingleTips ([#327](https://github.com/antvis/S2/issues/327)) ([23d3508](https://github.com/antvis/S2/commit/23d3508bc42954e1561c350cc11db54cc54bf321))
* **spreadsheet:** solve the workflow and test case ([#286](https://github.com/antvis/S2/issues/286)) ([c44e469](https://github.com/antvis/S2/commit/c44e4691435623d7de84b70c08308d2b1943d6bc)), closes [#269](https://github.com/antvis/S2/issues/269) [#270](https://github.com/antvis/S2/issues/270) [#268](https://github.com/antvis/S2/issues/268) [#267](https://github.com/antvis/S2/issues/267) [#271](https://github.com/antvis/S2/issues/271) [#272](https://github.com/antvis/S2/issues/272) [#265](https://github.com/antvis/S2/issues/265) [#274](https://github.com/antvis/S2/issues/274) [#276](https://github.com/antvis/S2/issues/276) [#277](https://github.com/antvis/S2/issues/277) [#283](https://github.com/antvis/S2/issues/283) [#273](https://github.com/antvis/S2/issues/273) [#267](https://github.com/antvis/S2/issues/267)
* table dataset spec ([#288](https://github.com/antvis/S2/issues/288)) ([63bef22](https://github.com/antvis/S2/commit/63bef22319ab05c7d1b3d9aeace49e043731d3af))
* **table:** frozen pagination issue ([#338](https://github.com/antvis/S2/issues/338)) ([39d26a5](https://github.com/antvis/S2/commit/39d26a56de3ecc862c529d72b9dc431b1af0611a))
* **table:** scroll position issue when re-render ([#459](https://github.com/antvis/S2/issues/459)) ([4dfa275](https://github.com/antvis/S2/commit/4dfa275ac8cbac33767dd6a8d4def60190c4afa4))
* **table:** table mode corner width err ([#396](https://github.com/antvis/S2/issues/396)) ([e3b9442](https://github.com/antvis/S2/commit/e3b9442ef2952b1047f9e46b3cdf5c153318b768))
* **tooltip:** custom tooltip keep right position wrong calc ([#436](https://github.com/antvis/S2/issues/436)) ([88fe05e](https://github.com/antvis/S2/commit/88fe05e7241e38e817ec60ddc40ef63315dbb3be))
* **tooltip:** fix cannot render tooltip element when first show ([#354](https://github.com/antvis/S2/issues/354)) ([78c22a6](https://github.com/antvis/S2/commit/78c22a6c8d3abb6357451e6752ad4fb4c2334e25))
* **tooltip:** fix cannot show sort menu when icon first clicked ([#366](https://github.com/antvis/S2/issues/366)) ([9c800a5](https://github.com/antvis/S2/commit/9c800a55291c36fed84bbf4e393e1b4dd6576e60))
* **tooltip:** tooltip will hide if cliced ([#370](https://github.com/antvis/S2/issues/370)) ([dccd4f5](https://github.com/antvis/S2/commit/dccd4f5bf667af0401e9d517f729992ba6dc7068))
* update d.ts path ([#319](https://github.com/antvis/S2/issues/319)) ([4117fa5](https://github.com/antvis/S2/commit/4117fa5bc3a23956f6e61cf0284cdd11356f7e39))
* update external using regex ([#304](https://github.com/antvis/S2/issues/304)) ([c40d3cc](https://github.com/antvis/S2/commit/c40d3cc6d37395b9c45d6ee2720126a2a1c8a87d))

### Features

* :sparkles: add column header labels for the corner header ([#320](https://github.com/antvis/S2/issues/320)) ([1b87bda](https://github.com/antvis/S2/commit/1b87bda6e6c2decfbd60c975d78afbcf5f0eb400))
* :sparkles: allow users to set different display condition for headerActionIcons ([#352](https://github.com/antvis/S2/issues/352)) ([9375f2b](https://github.com/antvis/S2/commit/9375f2b8e594355b2e456fb18910085139f76932))
* :sparkles: init examples gallery for the site ([#280](https://github.com/antvis/S2/issues/280)) ([891ce39](https://github.com/antvis/S2/commit/891ce391e5009384a34b7b91ee3507f8c1cae708))
* ✨ add custom header action icons ([#331](https://github.com/antvis/S2/issues/331)) ([4dcb1a2](https://github.com/antvis/S2/commit/4dcb1a2344783c8df283071bee1f8b07988b9b01))
* ✨ enable users to set the page size of the pagination configuration and close [#302](https://github.com/antvis/S2/issues/302) ([#309](https://github.com/antvis/S2/issues/309)) ([e5e961e](https://github.com/antvis/S2/commit/e5e961e306092c7ebabefa782a7ea54324656018))
* ✨ part drill down based on the new data process ([#399](https://github.com/antvis/S2/issues/399)) ([6a8889b](https://github.com/antvis/S2/commit/6a8889be5c47c49f335528548b3289577e0bd175))
* 🎸 added ability to filter field values ([#356](https://github.com/antvis/S2/issues/356)) ([92d9698](https://github.com/antvis/S2/commit/92d9698cf40de4fb3a5f099fd6a44821cb2a1bab))
* 🔖 publish v0.1.3 ([#257](https://github.com/antvis/S2/issues/257)) ([92e452a](https://github.com/antvis/S2/commit/92e452ab6fef1bd4b3a3ed0e424e405e362ce425)), closes [#238](https://github.com/antvis/S2/issues/238) [#237](https://github.com/antvis/S2/issues/237) [#7](https://github.com/antvis/S2/issues/7) [#10](https://github.com/antvis/S2/issues/10) [#12](https://github.com/antvis/S2/issues/12) [#13](https://github.com/antvis/S2/issues/13) [#16](https://github.com/antvis/S2/issues/16) [#17](https://github.com/antvis/S2/issues/17) [#11](https://github.com/antvis/S2/issues/11) [#19](https://github.com/antvis/S2/issues/19) [#18](https://github.com/antvis/S2/issues/18) [#21](https://github.com/antvis/S2/issues/21) [#23](https://github.com/antvis/S2/issues/23) [#20](https://github.com/antvis/S2/issues/20) [#24](https://github.com/antvis/S2/issues/24) [#20](https://github.com/antvis/S2/issues/20) [#26](https://github.com/antvis/S2/issues/26) [#27](https://github.com/antvis/S2/issues/27) [#28](https://github.com/antvis/S2/issues/28) [#29](https://github.com/antvis/S2/issues/29) [#35](https://github.com/antvis/S2/issues/35) [#37](https://github.com/antvis/S2/issues/37) [#38](https://github.com/antvis/S2/issues/38) [#39](https://github.com/antvis/S2/issues/39) [#42](https://github.com/antvis/S2/issues/42) [#43](https://github.com/antvis/S2/issues/43) [#44](https://github.com/antvis/S2/issues/44) [#45](https://github.com/antvis/S2/issues/45) [#47](https://github.com/antvis/S2/issues/47) [#46](https://github.com/antvis/S2/issues/46) [#48](https://github.com/antvis/S2/issues/48) [#32](https://github.com/antvis/S2/issues/32) [#31](https://github.com/antvis/S2/issues/31) [#49](https://github.com/antvis/S2/issues/49) [#32](https://github.com/antvis/S2/issues/32) [#31](https://github.com/antvis/S2/issues/31) [#50](https://github.com/antvis/S2/issues/50) [#51](https://github.com/antvis/S2/issues/51) [#52](https://github.com/antvis/S2/issues/52) [#55](https://github.com/antvis/S2/issues/55) [#57](https://github.com/antvis/S2/issues/57) [#58](https://github.com/antvis/S2/issues/58) [#59](https://github.com/antvis/S2/issues/59) [#14](https://github.com/antvis/S2/issues/14) [#30](https://github.com/antvis/S2/issues/30) [#60](https://github.com/antvis/S2/issues/60) [#61](https://github.com/antvis/S2/issues/61) [#64](https://github.com/antvis/S2/issues/64) [#65](https://github.com/antvis/S2/issues/65) [#69](https://github.com/antvis/S2/issues/69) [#70](https://github.com/antvis/S2/issues/70) [#71](https://github.com/antvis/S2/issues/71) [#70](https://github.com/antvis/S2/issues/70) [#70](https://github.com/antvis/S2/issues/70) [#72](https://github.com/antvis/S2/issues/72) [#73](https://github.com/antvis/S2/issues/73) [#74](https://github.com/antvis/S2/issues/74) [#75](https://github.com/antvis/S2/issues/75) [#76](https://github.com/antvis/S2/issues/76) [#82](https://github.com/antvis/S2/issues/82) [#85](https://github.com/antvis/S2/issues/85) [#91](https://github.com/antvis/S2/issues/91) [#81](https://github.com/antvis/S2/issues/81) [#94](https://github.com/antvis/S2/issues/94) [#95](https://github.com/antvis/S2/issues/95) [#100](https://github.com/antvis/S2/issues/100) [#99](https://github.com/antvis/S2/issues/99) [#101](https://github.com/antvis/S2/issues/101) [#107](https://github.com/antvis/S2/issues/107) [#108](https://github.com/antvis/S2/issues/108) [#109](https://github.com/antvis/S2/issues/109) [#112](https://github.com/antvis/S2/issues/112) [#114](https://github.com/antvis/S2/issues/114) [#115](https://github.com/antvis/S2/issues/115) [#116](https://github.com/antvis/S2/issues/116) [#117](https://github.com/antvis/S2/issues/117) [#119](https://github.com/antvis/S2/issues/119) [#121](https://github.com/antvis/S2/issues/121) [#122](https://github.com/antvis/S2/issues/122) [#124](https://github.com/antvis/S2/issues/124) [#125](https://github.com/antvis/S2/issues/125) [#123](https://github.com/antvis/S2/issues/123) [#120](https://github.com/antvis/S2/issues/120) [#126](https://github.com/antvis/S2/issues/126) [#128](https://github.com/antvis/S2/issues/128) [#130](https://github.com/antvis/S2/issues/130) [#129](https://github.com/antvis/S2/issues/129) [#113](https://github.com/antvis/S2/issues/113) [#132](https://github.com/antvis/S2/issues/132) [#135](https://github.com/antvis/S2/issues/135) [#138](https://github.com/antvis/S2/issues/138) [#118](https://github.com/antvis/S2/issues/118) [#139](https://github.com/antvis/S2/issues/139) [#118](https://github.com/antvis/S2/issues/118) [#142](https://github.com/antvis/S2/issues/142) [#143](https://github.com/antvis/S2/issues/143) [#137](https://github.com/antvis/S2/issues/137) [#136](https://github.com/antvis/S2/issues/136) [#148](https://github.com/antvis/S2/issues/148) [#146](https://github.com/antvis/S2/issues/146) [#149](https://github.com/antvis/S2/issues/149) [#152](https://github.com/antvis/S2/issues/152) [#153](https://github.com/antvis/S2/issues/153) [#155](https://github.com/antvis/S2/issues/155) [#156](https://github.com/antvis/S2/issues/156) [#151](https://github.com/antvis/S2/issues/151) [#157](https://github.com/antvis/S2/issues/157) [#154](https://github.com/antvis/S2/issues/154) [#160](https://github.com/antvis/S2/issues/160) [#162](https://github.com/antvis/S2/issues/162) [#164](https://github.com/antvis/S2/issues/164) [#158](https://github.com/antvis/S2/issues/158) [#167](https://github.com/antvis/S2/issues/167) [#170](https://github.com/antvis/S2/issues/170) [#165](https://github.com/antvis/S2/issues/165) [#171](https://github.com/antvis/S2/issues/171) [#163](https://github.com/antvis/S2/issues/163) [#174](https://github.com/antvis/S2/issues/174) [#172](https://github.com/antvis/S2/issues/172) [#175](https://github.com/antvis/S2/issues/175) [#173](https://github.com/antvis/S2/issues/173) [#179](https://github.com/antvis/S2/issues/179) [#183](https://github.com/antvis/S2/issues/183) [#182](https://github.com/antvis/S2/issues/182) [#180](https://github.com/antvis/S2/issues/180) [#184](https://github.com/antvis/S2/issues/184) [#185](https://github.com/antvis/S2/issues/185) [#181](https://github.com/antvis/S2/issues/181) [#178](https://github.com/antvis/S2/issues/178) [#192](https://github.com/antvis/S2/issues/192) [#189](https://github.com/antvis/S2/issues/189) [#190](https://github.com/antvis/S2/issues/190) [#194](https://github.com/antvis/S2/issues/194) [#197](https://github.com/antvis/S2/issues/197) [#196](https://github.com/antvis/S2/issues/196) [#203](https://github.com/antvis/S2/issues/203) [#207](https://github.com/antvis/S2/issues/207) [#204](https://github.com/antvis/S2/issues/204) [#206](https://github.com/antvis/S2/issues/206) [#208](https://github.com/antvis/S2/issues/208) [#202](https://github.com/antvis/S2/issues/202) [#201](https://github.com/antvis/S2/issues/201) [#209](https://github.com/antvis/S2/issues/209) [#200](https://github.com/antvis/S2/issues/200) [#210](https://github.com/antvis/S2/issues/210) [#211](https://github.com/antvis/S2/issues/211) [#214](https://github.com/antvis/S2/issues/214) [#213](https://github.com/antvis/S2/issues/213) [#212](https://github.com/antvis/S2/issues/212) [#216](https://github.com/antvis/S2/issues/216) [#217](https://github.com/antvis/S2/issues/217) [#218](https://github.com/antvis/S2/issues/218) [#219](https://github.com/antvis/S2/issues/219) [#221](https://github.com/antvis/S2/issues/221) [#222](https://github.com/antvis/S2/issues/222) [#240](https://github.com/antvis/S2/issues/240) [#241](https://github.com/antvis/S2/issues/241) [#242](https://github.com/antvis/S2/issues/242) [#248](https://github.com/antvis/S2/issues/248) [#245](https://github.com/antvis/S2/issues/245) [#252](https://github.com/antvis/S2/issues/252) [#249](https://github.com/antvis/S2/issues/249)
* add advanced sort component ([#428](https://github.com/antvis/S2/issues/428)) ([c3a3fb5](https://github.com/antvis/S2/commit/c3a3fb5ba16dc4ef65f301b054a78095c36f5524))
* add doc for table ([#360](https://github.com/antvis/S2/issues/360)) ([a7ee65e](https://github.com/antvis/S2/commit/a7ee65e4f46a0e8253a756d6c2619166e36a8c8e))
* add group sort in col's values and refactor tooltip's style ([#284](https://github.com/antvis/S2/issues/284)) ([ad02d9d](https://github.com/antvis/S2/commit/ad02d9db301f6be34112ac99e6db2de48af4c2dc)), closes [#269](https://github.com/antvis/S2/issues/269) [#270](https://github.com/antvis/S2/issues/270) [#268](https://github.com/antvis/S2/issues/268) [#267](https://github.com/antvis/S2/issues/267) [#271](https://github.com/antvis/S2/issues/271) [#272](https://github.com/antvis/S2/issues/272) [#265](https://github.com/antvis/S2/issues/265) [#274](https://github.com/antvis/S2/issues/274) [#276](https://github.com/antvis/S2/issues/276) [#277](https://github.com/antvis/S2/issues/277) [#283](https://github.com/antvis/S2/issues/283)
* add tooltip col and row config handle ([#440](https://github.com/antvis/S2/issues/440)) ([b457d27](https://github.com/antvis/S2/commit/b457d27ce1ba6de368e39632675c295ff3af8174))
* add total measure formatter for values in rows ([#462](https://github.com/antvis/S2/issues/462)) ([615be65](https://github.com/antvis/S2/commit/615be65b2f1afe9815c7889a34b6aa17a303dc66))
* copy with row and col ([#387](https://github.com/antvis/S2/issues/387)) ([7602ef8](https://github.com/antvis/S2/commit/7602ef87d5821b7a897c779f90d37bfc1e52d25f))
* dimensions switcher ([#298](https://github.com/antvis/S2/issues/298)) ([f223319](https://github.com/antvis/S2/commit/f2233194850604f5245e7eb19ea61f3993a592fe)), closes [#269](https://github.com/antvis/S2/issues/269) [#270](https://github.com/antvis/S2/issues/270) [#268](https://github.com/antvis/S2/issues/268) [#267](https://github.com/antvis/S2/issues/267) [#271](https://github.com/antvis/S2/issues/271)
* **facet:** add scroll speed ratio ([#438](https://github.com/antvis/S2/issues/438)) ([9ba97fb](https://github.com/antvis/S2/commit/9ba97fb716132b5c5bd49f03e16a6cb5d0ae51e4))
* **interaction:** add autoResetSheetStyle options ([#465](https://github.com/antvis/S2/issues/465)) ([00f316d](https://github.com/antvis/S2/commit/00f316d99566478c96660ff72d2f0541af572c74))
* **interaction:** hidden columns ([#296](https://github.com/antvis/S2/issues/296)) ([f5f4a69](https://github.com/antvis/S2/commit/f5f4a69dbd2b436f36e874323115d54af9f0aa16))
* **interaction:** select interaction imporement ([#324](https://github.com/antvis/S2/issues/324)) ([6b5479d](https://github.com/antvis/S2/commit/6b5479d9cb9718ce0c657277ef2ad30c56b8ded7))
* refactor switcher component ([#380](https://github.com/antvis/S2/issues/380)) ([f5c2993](https://github.com/antvis/S2/commit/f5c2993801d4f2b0d09ecaf4b8f751deefbac0d0))
* select all ([#348](https://github.com/antvis/S2/issues/348)) ([334aac4](https://github.com/antvis/S2/commit/334aac41ac9511c3b417a7006591fdbf138ab618)), closes [#342](https://github.com/antvis/S2/issues/342) [#339](https://github.com/antvis/S2/issues/339)

# [0.2.0](https://github.com/antvis/S2/compare/v0.1.0-alpha.15...v0.2.0) (2021-10-12)

### Bug Fixes

* :bug: optimize the subTotal cells layout logic and close [#368](https://github.com/antvis/S2/issues/368) ([#425](https://github.com/antvis/S2/issues/425)) ([7fe2cbf](https://github.com/antvis/S2/commit/7fe2cbf1728b223e4717add85e0b6e27a398b56f))
* 🐛 solve the wrong position of the grandTotal cell in multi-value mode and close [#372](https://github.com/antvis/S2/issues/372) ([#437](https://github.com/antvis/S2/issues/437)) ([b24657c](https://github.com/antvis/S2/commit/b24657c65d027f3447cbbc07d089022f3edfbe27))
* 🐛 add the `spreadsheet` for the meta of the corner cell in tree mode and tweak the style of cell borders ([#342](https://github.com/antvis/S2/issues/342)) ([f322519](https://github.com/antvis/S2/commit/f322519fe42659286c0d4306eef0fa2922ad69aa)), closes [#339](https://github.com/antvis/S2/issues/339)
* 🐛 fix the wrong params of export function ([#159](https://github.com/antvis/S2/issues/159)) ([ce66363](https://github.com/antvis/S2/commit/ce663637c63ef173019d8233237ed8ee7d98eaa9))
* 🐛 solve the wrong render state when updating the dataCfg and close [#285](https://github.com/antvis/S2/issues/285) ([#299](https://github.com/antvis/S2/issues/299)) ([b69cf24](https://github.com/antvis/S2/commit/b69cf2405584483cc1639adc2d44af1b728f8d05))
* expand corner cell width, make it nowrap initially ([#408](https://github.com/antvis/S2/issues/408)) ([c73bb6d](https://github.com/antvis/S2/commit/c73bb6d391f8f030212eed9ff7b9da249ae95d4a))
* export feature ([#412](https://github.com/antvis/S2/issues/412)) ([6c2a5b8](https://github.com/antvis/S2/commit/6c2a5b8ad625567de5cf138aca51c9faf5d4c354))
* **facet:** fix issue [#291](https://github.com/antvis/S2/issues/291) ([#297](https://github.com/antvis/S2/issues/297)) ([28a5c11](https://github.com/antvis/S2/commit/28a5c115501ddbe78432682c9c8cfb4b8b5c7780))
* **facet:** frozen clip and resizer issue ([#275](https://github.com/antvis/S2/issues/275)) ([6b53061](https://github.com/antvis/S2/commit/6b53061583e0062242a6473c2413bae339ff1338)), closes [#269](https://github.com/antvis/S2/issues/269) [#270](https://github.com/antvis/S2/issues/270) [#268](https://github.com/antvis/S2/issues/268) [#267](https://github.com/antvis/S2/issues/267) [#271](https://github.com/antvis/S2/issues/271) [#272](https://github.com/antvis/S2/issues/272) [#265](https://github.com/antvis/S2/issues/265) [#274](https://github.com/antvis/S2/issues/274) [#276](https://github.com/antvis/S2/issues/276)
* **interaction:** add brush move distance validate ([#321](https://github.com/antvis/S2/issues/321)) ([2ee8f9d](https://github.com/antvis/S2/commit/2ee8f9d163ad60692b6ee2e1173e4bfc397430cd))
* **interaction:** invalid "hiddenColumnFields" config close [#417](https://github.com/antvis/S2/issues/417) ([#431](https://github.com/antvis/S2/issues/431)) ([6cd461e](https://github.com/antvis/S2/commit/6cd461e6d132a18cc7192bf90d946f5de8b8d1f7))
* **interaction:** optimize reset state logic ([#441](https://github.com/antvis/S2/issues/441)) ([f07e657](https://github.com/antvis/S2/commit/f07e657c0c2be5090a390fcc0ee7f4c74a008e3f))
* **interaction:** support batch hidden columns ([#439](https://github.com/antvis/S2/issues/439)) ([d0a4d97](https://github.com/antvis/S2/commit/d0a4d97d4f343c689f227e0ced6e8723dead007f))
* **interaction:** wrong hidden column icon position ([#329](https://github.com/antvis/S2/issues/329)) ([19d4497](https://github.com/antvis/S2/commit/19d4497b3112cf543d170e65f230f0e885ece8a4))
* **performance:** optimize performance when table switch to pivot, [#415](https://github.com/antvis/S2/issues/415) ([#429](https://github.com/antvis/S2/issues/429)) ([215e6c4](https://github.com/antvis/S2/commit/215e6c4755c1101bd4920847a398cf48c07448ce))
* **poivt-table:** fix render apply font crash on ios15 ([#394](https://github.com/antvis/S2/issues/394)) ([cbb7045](https://github.com/antvis/S2/commit/cbb7045354e674c858185c307b1e5ac2ecd0a70f))
* **povit-table:** resolve scroll shake issue close [#374](https://github.com/antvis/S2/issues/374) ([#379](https://github.com/antvis/S2/issues/379)) ([014d683](https://github.com/antvis/S2/commit/014d683a8cc251f0f4cddb28662b45b7b96d4edb))
* **resize:** fix set width and height problem ([#402](https://github.com/antvis/S2/issues/402)) ([41caf18](https://github.com/antvis/S2/commit/41caf1812687130d9d4d595b680c544a69a49843))
* revert code ([#325](https://github.com/antvis/S2/issues/325)) ([6ece5e8](https://github.com/antvis/S2/commit/6ece5e89f50b7d450c412e224546e923792d0aca))
* row-col-click's show about pivot and table, formatter when showSingleTips ([#327](https://github.com/antvis/S2/issues/327)) ([23d3508](https://github.com/antvis/S2/commit/23d3508bc42954e1561c350cc11db54cc54bf321))
* **spreadsheet:** solve the workflow and test case ([#286](https://github.com/antvis/S2/issues/286)) ([c44e469](https://github.com/antvis/S2/commit/c44e4691435623d7de84b70c08308d2b1943d6bc)), closes [#269](https://github.com/antvis/S2/issues/269) [#270](https://github.com/antvis/S2/issues/270) [#268](https://github.com/antvis/S2/issues/268) [#267](https://github.com/antvis/S2/issues/267) [#271](https://github.com/antvis/S2/issues/271) [#272](https://github.com/antvis/S2/issues/272) [#265](https://github.com/antvis/S2/issues/265) [#274](https://github.com/antvis/S2/issues/274) [#276](https://github.com/antvis/S2/issues/276) [#277](https://github.com/antvis/S2/issues/277) [#283](https://github.com/antvis/S2/issues/283) [#273](https://github.com/antvis/S2/issues/273) [#267](https://github.com/antvis/S2/issues/267)
* table dataset spec ([#288](https://github.com/antvis/S2/issues/288)) ([63bef22](https://github.com/antvis/S2/commit/63bef22319ab05c7d1b3d9aeace49e043731d3af))
* **table:** frozen pagination issue ([#338](https://github.com/antvis/S2/issues/338)) ([39d26a5](https://github.com/antvis/S2/commit/39d26a56de3ecc862c529d72b9dc431b1af0611a))
* **table:** table mode corner width err ([#396](https://github.com/antvis/S2/issues/396)) ([e3b9442](https://github.com/antvis/S2/commit/e3b9442ef2952b1047f9e46b3cdf5c153318b768))
* **tooltip:** custom tooltip keep right position wrong calc ([#436](https://github.com/antvis/S2/issues/436)) ([88fe05e](https://github.com/antvis/S2/commit/88fe05e7241e38e817ec60ddc40ef63315dbb3be))
* **tooltip:** fix cannot render tooltip element when first show ([#354](https://github.com/antvis/S2/issues/354)) ([78c22a6](https://github.com/antvis/S2/commit/78c22a6c8d3abb6357451e6752ad4fb4c2334e25))
* **tooltip:** fix cannot show sort menu when icon first clicked ([#366](https://github.com/antvis/S2/issues/366)) ([9c800a5](https://github.com/antvis/S2/commit/9c800a55291c36fed84bbf4e393e1b4dd6576e60))
* **tooltip:** tooltip will hide if cliced ([#370](https://github.com/antvis/S2/issues/370)) ([dccd4f5](https://github.com/antvis/S2/commit/dccd4f5bf667af0401e9d517f729992ba6dc7068))
* update d.ts path ([#319](https://github.com/antvis/S2/issues/319)) ([4117fa5](https://github.com/antvis/S2/commit/4117fa5bc3a23956f6e61cf0284cdd11356f7e39))
* update external using regex ([#304](https://github.com/antvis/S2/issues/304)) ([c40d3cc](https://github.com/antvis/S2/commit/c40d3cc6d37395b9c45d6ee2720126a2a1c8a87d))

### Features

* :sparkles: add column header labels for the corner header ([#320](https://github.com/antvis/S2/issues/320)) ([1b87bda](https://github.com/antvis/S2/commit/1b87bda6e6c2decfbd60c975d78afbcf5f0eb400))
* :sparkles: allow users to set different display condition for headerActionIcons ([#352](https://github.com/antvis/S2/issues/352)) ([9375f2b](https://github.com/antvis/S2/commit/9375f2b8e594355b2e456fb18910085139f76932))
* :sparkles: init examples gallery for the site ([#280](https://github.com/antvis/S2/issues/280)) ([891ce39](https://github.com/antvis/S2/commit/891ce391e5009384a34b7b91ee3507f8c1cae708))
* ✨ add custom header action icons ([#331](https://github.com/antvis/S2/issues/331)) ([4dcb1a2](https://github.com/antvis/S2/commit/4dcb1a2344783c8df283071bee1f8b07988b9b01))
* ✨ enable users to set the page size of the pagination configuration and close [#302](https://github.com/antvis/S2/issues/302) ([#309](https://github.com/antvis/S2/issues/309)) ([e5e961e](https://github.com/antvis/S2/commit/e5e961e306092c7ebabefa782a7ea54324656018))
* ✨ part drill down based on the new data process ([#399](https://github.com/antvis/S2/issues/399)) ([6a8889b](https://github.com/antvis/S2/commit/6a8889be5c47c49f335528548b3289577e0bd175))
* ✨ refactor the s2 based on new data-process ([#235](https://github.com/antvis/S2/issues/235)) ([31dd6a0](https://github.com/antvis/S2/commit/31dd6a0b9c96065b0f2bebb71fdb645b1d75db54)), closes [#7](https://github.com/antvis/S2/issues/7) [#10](https://github.com/antvis/S2/issues/10) [#12](https://github.com/antvis/S2/issues/12) [#13](https://github.com/antvis/S2/issues/13) [#16](https://github.com/antvis/S2/issues/16) [#17](https://github.com/antvis/S2/issues/17) [#11](https://github.com/antvis/S2/issues/11) [#19](https://github.com/antvis/S2/issues/19) [#18](https://github.com/antvis/S2/issues/18) [#21](https://github.com/antvis/S2/issues/21) [#23](https://github.com/antvis/S2/issues/23) [#20](https://github.com/antvis/S2/issues/20) [#24](https://github.com/antvis/S2/issues/24) [#20](https://github.com/antvis/S2/issues/20) [#26](https://github.com/antvis/S2/issues/26) [#27](https://github.com/antvis/S2/issues/27) [#28](https://github.com/antvis/S2/issues/28) [#29](https://github.com/antvis/S2/issues/29) [#35](https://github.com/antvis/S2/issues/35) [#37](https://github.com/antvis/S2/issues/37) [#38](https://github.com/antvis/S2/issues/38) [#39](https://github.com/antvis/S2/issues/39) [#42](https://github.com/antvis/S2/issues/42) [#43](https://github.com/antvis/S2/issues/43) [#44](https://github.com/antvis/S2/issues/44) [#45](https://github.com/antvis/S2/issues/45) [#47](https://github.com/antvis/S2/issues/47) [#46](https://github.com/antvis/S2/issues/46) [#48](https://github.com/antvis/S2/issues/48) [#32](https://github.com/antvis/S2/issues/32) [#31](https://github.com/antvis/S2/issues/31) [#49](https://github.com/antvis/S2/issues/49) [#32](https://github.com/antvis/S2/issues/32) [#31](https://github.com/antvis/S2/issues/31) [#50](https://github.com/antvis/S2/issues/50) [#51](https://github.com/antvis/S2/issues/51) [#52](https://github.com/antvis/S2/issues/52) [#55](https://github.com/antvis/S2/issues/55) [#57](https://github.com/antvis/S2/issues/57) [#58](https://github.com/antvis/S2/issues/58) [#59](https://github.com/antvis/S2/issues/59) [#14](https://github.com/antvis/S2/issues/14) [#30](https://github.com/antvis/S2/issues/30) [#60](https://github.com/antvis/S2/issues/60) [#61](https://github.com/antvis/S2/issues/61) [#64](https://github.com/antvis/S2/issues/64) [#65](https://github.com/antvis/S2/issues/65) [#69](https://github.com/antvis/S2/issues/69) [#70](https://github.com/antvis/S2/issues/70) [#71](https://github.com/antvis/S2/issues/71) [#70](https://github.com/antvis/S2/issues/70) [#70](https://github.com/antvis/S2/issues/70) [#72](https://github.com/antvis/S2/issues/72) [#73](https://github.com/antvis/S2/issues/73) [#74](https://github.com/antvis/S2/issues/74) [#75](https://github.com/antvis/S2/issues/75) [#76](https://github.com/antvis/S2/issues/76) [#82](https://github.com/antvis/S2/issues/82) [#85](https://github.com/antvis/S2/issues/85) [#91](https://github.com/antvis/S2/issues/91) [#81](https://github.com/antvis/S2/issues/81) [#94](https://github.com/antvis/S2/issues/94) [#95](https://github.com/antvis/S2/issues/95) [#100](https://github.com/antvis/S2/issues/100) [#99](https://github.com/antvis/S2/issues/99) [#101](https://github.com/antvis/S2/issues/101) [#107](https://github.com/antvis/S2/issues/107) [#108](https://github.com/antvis/S2/issues/108) [#109](https://github.com/antvis/S2/issues/109) [#112](https://github.com/antvis/S2/issues/112) [#114](https://github.com/antvis/S2/issues/114) [#115](https://github.com/antvis/S2/issues/115) [#116](https://github.com/antvis/S2/issues/116) [#117](https://github.com/antvis/S2/issues/117) [#119](https://github.com/antvis/S2/issues/119) [#121](https://github.com/antvis/S2/issues/121) [#122](https://github.com/antvis/S2/issues/122) [#124](https://github.com/antvis/S2/issues/124) [#125](https://github.com/antvis/S2/issues/125) [#123](https://github.com/antvis/S2/issues/123) [#120](https://github.com/antvis/S2/issues/120) [#126](https://github.com/antvis/S2/issues/126) [#128](https://github.com/antvis/S2/issues/128) [#130](https://github.com/antvis/S2/issues/130) [#129](https://github.com/antvis/S2/issues/129) [#113](https://github.com/antvis/S2/issues/113) [#132](https://github.com/antvis/S2/issues/132) [#135](https://github.com/antvis/S2/issues/135) [#138](https://github.com/antvis/S2/issues/138) [#118](https://github.com/antvis/S2/issues/118) [#139](https://github.com/antvis/S2/issues/139) [#118](https://github.com/antvis/S2/issues/118) [#142](https://github.com/antvis/S2/issues/142) [#143](https://github.com/antvis/S2/issues/143) [#137](https://github.com/antvis/S2/issues/137) [#136](https://github.com/antvis/S2/issues/136) [#148](https://github.com/antvis/S2/issues/148) [#146](https://github.com/antvis/S2/issues/146) [#149](https://github.com/antvis/S2/issues/149) [#152](https://github.com/antvis/S2/issues/152) [#153](https://github.com/antvis/S2/issues/153) [#155](https://github.com/antvis/S2/issues/155) [#156](https://github.com/antvis/S2/issues/156) [#151](https://github.com/antvis/S2/issues/151) [#157](https://github.com/antvis/S2/issues/157) [#154](https://github.com/antvis/S2/issues/154) [#160](https://github.com/antvis/S2/issues/160) [#162](https://github.com/antvis/S2/issues/162) [#164](https://github.com/antvis/S2/issues/164) [#158](https://github.com/antvis/S2/issues/158) [#167](https://github.com/antvis/S2/issues/167) [#170](https://github.com/antvis/S2/issues/170) [#165](https://github.com/antvis/S2/issues/165) [#171](https://github.com/antvis/S2/issues/171) [#163](https://github.com/antvis/S2/issues/163) [#174](https://github.com/antvis/S2/issues/174) [#172](https://github.com/antvis/S2/issues/172) [#175](https://github.com/antvis/S2/issues/175) [#173](https://github.com/antvis/S2/issues/173) [#179](https://github.com/antvis/S2/issues/179) [#183](https://github.com/antvis/S2/issues/183) [#182](https://github.com/antvis/S2/issues/182) [#180](https://github.com/antvis/S2/issues/180) [#184](https://github.com/antvis/S2/issues/184) [#185](https://github.com/antvis/S2/issues/185) [#181](https://github.com/antvis/S2/issues/181) [#178](https://github.com/antvis/S2/issues/178) [#192](https://github.com/antvis/S2/issues/192) [#189](https://github.com/antvis/S2/issues/189) [#190](https://github.com/antvis/S2/issues/190) [#194](https://github.com/antvis/S2/issues/194) [#197](https://github.com/antvis/S2/issues/197) [#196](https://github.com/antvis/S2/issues/196) [#203](https://github.com/antvis/S2/issues/203) [#207](https://github.com/antvis/S2/issues/207) [#204](https://github.com/antvis/S2/issues/204) [#206](https://github.com/antvis/S2/issues/206) [#208](https://github.com/antvis/S2/issues/208) [#202](https://github.com/antvis/S2/issues/202) [#201](https://github.com/antvis/S2/issues/201) [#209](https://github.com/antvis/S2/issues/209) [#200](https://github.com/antvis/S2/issues/200) [#210](https://github.com/antvis/S2/issues/210) [#211](https://github.com/antvis/S2/issues/211) [#214](https://github.com/antvis/S2/issues/214) [#213](https://github.com/antvis/S2/issues/213) [#212](https://github.com/antvis/S2/issues/212) [#216](https://github.com/antvis/S2/issues/216) [#217](https://github.com/antvis/S2/issues/217) [#218](https://github.com/antvis/S2/issues/218) [#219](https://github.com/antvis/S2/issues/219) [#221](https://github.com/antvis/S2/issues/221) [#222](https://github.com/antvis/S2/issues/222) [#223](https://github.com/antvis/S2/issues/223) [#227](https://github.com/antvis/S2/issues/227) [#228](https://github.com/antvis/S2/issues/228) [#231](https://github.com/antvis/S2/issues/231) [#234](https://github.com/antvis/S2/issues/234) [#230](https://github.com/antvis/S2/issues/230) [#233](https://github.com/antvis/S2/issues/233) [#230](https://github.com/antvis/S2/issues/230) [#236](https://github.com/antvis/S2/issues/236)
* 🔖 publish v0.1.3 ([#257](https://github.com/antvis/S2/issues/257)) ([92e452a](https://github.com/antvis/S2/commit/92e452ab6fef1bd4b3a3ed0e424e405e362ce425)), closes [#238](https://github.com/antvis/S2/issues/238) [#237](https://github.com/antvis/S2/issues/237) [#7](https://github.com/antvis/S2/issues/7) [#10](https://github.com/antvis/S2/issues/10) [#12](https://github.com/antvis/S2/issues/12) [#13](https://github.com/antvis/S2/issues/13) [#16](https://github.com/antvis/S2/issues/16) [#17](https://github.com/antvis/S2/issues/17) [#11](https://github.com/antvis/S2/issues/11) [#19](https://github.com/antvis/S2/issues/19) [#18](https://github.com/antvis/S2/issues/18) [#21](https://github.com/antvis/S2/issues/21) [#23](https://github.com/antvis/S2/issues/23) [#20](https://github.com/antvis/S2/issues/20) [#24](https://github.com/antvis/S2/issues/24) [#20](https://github.com/antvis/S2/issues/20) [#26](https://github.com/antvis/S2/issues/26) [#27](https://github.com/antvis/S2/issues/27) [#28](https://github.com/antvis/S2/issues/28) [#29](https://github.com/antvis/S2/issues/29) [#35](https://github.com/antvis/S2/issues/35) [#37](https://github.com/antvis/S2/issues/37) [#38](https://github.com/antvis/S2/issues/38) [#39](https://github.com/antvis/S2/issues/39) [#42](https://github.com/antvis/S2/issues/42) [#43](https://github.com/antvis/S2/issues/43) [#44](https://github.com/antvis/S2/issues/44) [#45](https://github.com/antvis/S2/issues/45) [#47](https://github.com/antvis/S2/issues/47) [#46](https://github.com/antvis/S2/issues/46) [#48](https://github.com/antvis/S2/issues/48) [#32](https://github.com/antvis/S2/issues/32) [#31](https://github.com/antvis/S2/issues/31) [#49](https://github.com/antvis/S2/issues/49) [#32](https://github.com/antvis/S2/issues/32) [#31](https://github.com/antvis/S2/issues/31) [#50](https://github.com/antvis/S2/issues/50) [#51](https://github.com/antvis/S2/issues/51) [#52](https://github.com/antvis/S2/issues/52) [#55](https://github.com/antvis/S2/issues/55) [#57](https://github.com/antvis/S2/issues/57) [#58](https://github.com/antvis/S2/issues/58) [#59](https://github.com/antvis/S2/issues/59) [#14](https://github.com/antvis/S2/issues/14) [#30](https://github.com/antvis/S2/issues/30) [#60](https://github.com/antvis/S2/issues/60) [#61](https://github.com/antvis/S2/issues/61) [#64](https://github.com/antvis/S2/issues/64) [#65](https://github.com/antvis/S2/issues/65) [#69](https://github.com/antvis/S2/issues/69) [#70](https://github.com/antvis/S2/issues/70) [#71](https://github.com/antvis/S2/issues/71) [#70](https://github.com/antvis/S2/issues/70) [#70](https://github.com/antvis/S2/issues/70) [#72](https://github.com/antvis/S2/issues/72) [#73](https://github.com/antvis/S2/issues/73) [#74](https://github.com/antvis/S2/issues/74) [#75](https://github.com/antvis/S2/issues/75) [#76](https://github.com/antvis/S2/issues/76) [#82](https://github.com/antvis/S2/issues/82) [#85](https://github.com/antvis/S2/issues/85) [#91](https://github.com/antvis/S2/issues/91) [#81](https://github.com/antvis/S2/issues/81) [#94](https://github.com/antvis/S2/issues/94) [#95](https://github.com/antvis/S2/issues/95) [#100](https://github.com/antvis/S2/issues/100) [#99](https://github.com/antvis/S2/issues/99) [#101](https://github.com/antvis/S2/issues/101) [#107](https://github.com/antvis/S2/issues/107) [#108](https://github.com/antvis/S2/issues/108) [#109](https://github.com/antvis/S2/issues/109) [#112](https://github.com/antvis/S2/issues/112) [#114](https://github.com/antvis/S2/issues/114) [#115](https://github.com/antvis/S2/issues/115) [#116](https://github.com/antvis/S2/issues/116) [#117](https://github.com/antvis/S2/issues/117) [#119](https://github.com/antvis/S2/issues/119) [#121](https://github.com/antvis/S2/issues/121) [#122](https://github.com/antvis/S2/issues/122) [#124](https://github.com/antvis/S2/issues/124) [#125](https://github.com/antvis/S2/issues/125) [#123](https://github.com/antvis/S2/issues/123) [#120](https://github.com/antvis/S2/issues/120) [#126](https://github.com/antvis/S2/issues/126) [#128](https://github.com/antvis/S2/issues/128) [#130](https://github.com/antvis/S2/issues/130) [#129](https://github.com/antvis/S2/issues/129) [#113](https://github.com/antvis/S2/issues/113) [#132](https://github.com/antvis/S2/issues/132) [#135](https://github.com/antvis/S2/issues/135) [#138](https://github.com/antvis/S2/issues/138) [#118](https://github.com/antvis/S2/issues/118) [#139](https://github.com/antvis/S2/issues/139) [#118](https://github.com/antvis/S2/issues/118) [#142](https://github.com/antvis/S2/issues/142) [#143](https://github.com/antvis/S2/issues/143) [#137](https://github.com/antvis/S2/issues/137) [#136](https://github.com/antvis/S2/issues/136) [#148](https://github.com/antvis/S2/issues/148) [#146](https://github.com/antvis/S2/issues/146) [#149](https://github.com/antvis/S2/issues/149) [#152](https://github.com/antvis/S2/issues/152) [#153](https://github.com/antvis/S2/issues/153) [#155](https://github.com/antvis/S2/issues/155) [#156](https://github.com/antvis/S2/issues/156) [#151](https://github.com/antvis/S2/issues/151) [#157](https://github.com/antvis/S2/issues/157) [#154](https://github.com/antvis/S2/issues/154) [#160](https://github.com/antvis/S2/issues/160) [#162](https://github.com/antvis/S2/issues/162) [#164](https://github.com/antvis/S2/issues/164) [#158](https://github.com/antvis/S2/issues/158) [#167](https://github.com/antvis/S2/issues/167) [#170](https://github.com/antvis/S2/issues/170) [#165](https://github.com/antvis/S2/issues/165) [#171](https://github.com/antvis/S2/issues/171) [#163](https://github.com/antvis/S2/issues/163) [#174](https://github.com/antvis/S2/issues/174) [#172](https://github.com/antvis/S2/issues/172) [#175](https://github.com/antvis/S2/issues/175) [#173](https://github.com/antvis/S2/issues/173) [#179](https://github.com/antvis/S2/issues/179) [#183](https://github.com/antvis/S2/issues/183) [#182](https://github.com/antvis/S2/issues/182) [#180](https://github.com/antvis/S2/issues/180) [#184](https://github.com/antvis/S2/issues/184) [#185](https://github.com/antvis/S2/issues/185) [#181](https://github.com/antvis/S2/issues/181) [#178](https://github.com/antvis/S2/issues/178) [#192](https://github.com/antvis/S2/issues/192) [#189](https://github.com/antvis/S2/issues/189) [#190](https://github.com/antvis/S2/issues/190) [#194](https://github.com/antvis/S2/issues/194) [#197](https://github.com/antvis/S2/issues/197) [#196](https://github.com/antvis/S2/issues/196) [#203](https://github.com/antvis/S2/issues/203) [#207](https://github.com/antvis/S2/issues/207) [#204](https://github.com/antvis/S2/issues/204) [#206](https://github.com/antvis/S2/issues/206) [#208](https://github.com/antvis/S2/issues/208) [#202](https://github.com/antvis/S2/issues/202) [#201](https://github.com/antvis/S2/issues/201) [#209](https://github.com/antvis/S2/issues/209) [#200](https://github.com/antvis/S2/issues/200) [#210](https://github.com/antvis/S2/issues/210) [#211](https://github.com/antvis/S2/issues/211) [#214](https://github.com/antvis/S2/issues/214) [#213](https://github.com/antvis/S2/issues/213) [#212](https://github.com/antvis/S2/issues/212) [#216](https://github.com/antvis/S2/issues/216) [#217](https://github.com/antvis/S2/issues/217) [#218](https://github.com/antvis/S2/issues/218) [#219](https://github.com/antvis/S2/issues/219) [#221](https://github.com/antvis/S2/issues/221) [#222](https://github.com/antvis/S2/issues/222) [#240](https://github.com/antvis/S2/issues/240) [#241](https://github.com/antvis/S2/issues/241) [#242](https://github.com/antvis/S2/issues/242) [#248](https://github.com/antvis/S2/issues/248) [#245](https://github.com/antvis/S2/issues/245) [#252](https://github.com/antvis/S2/issues/252) [#249](https://github.com/antvis/S2/issues/249)
* add advanced sort component ([#428](https://github.com/antvis/S2/issues/428)) ([c3a3fb5](https://github.com/antvis/S2/commit/c3a3fb5ba16dc4ef65f301b054a78095c36f5524))
* add doc for table ([#360](https://github.com/antvis/S2/issues/360)) ([a7ee65e](https://github.com/antvis/S2/commit/a7ee65e4f46a0e8253a756d6c2619166e36a8c8e))
* add group sort in col's values and refactor tooltip's style ([#284](https://github.com/antvis/S2/issues/284)) ([ad02d9d](https://github.com/antvis/S2/commit/ad02d9db301f6be34112ac99e6db2de48af4c2dc)), closes [#269](https://github.com/antvis/S2/issues/269) [#270](https://github.com/antvis/S2/issues/270) [#268](https://github.com/antvis/S2/issues/268) [#267](https://github.com/antvis/S2/issues/267) [#271](https://github.com/antvis/S2/issues/271) [#272](https://github.com/antvis/S2/issues/272) [#265](https://github.com/antvis/S2/issues/265) [#274](https://github.com/antvis/S2/issues/274) [#276](https://github.com/antvis/S2/issues/276) [#277](https://github.com/antvis/S2/issues/277) [#283](https://github.com/antvis/S2/issues/283)
* copy with row and col ([#387](https://github.com/antvis/S2/issues/387)) ([7602ef8](https://github.com/antvis/S2/commit/7602ef87d5821b7a897c779f90d37bfc1e52d25f))
* dimensions switcher ([#298](https://github.com/antvis/S2/issues/298)) ([f223319](https://github.com/antvis/S2/commit/f2233194850604f5245e7eb19ea61f3993a592fe)), closes [#269](https://github.com/antvis/S2/issues/269) [#270](https://github.com/antvis/S2/issues/270) [#268](https://github.com/antvis/S2/issues/268) [#267](https://github.com/antvis/S2/issues/267) [#271](https://github.com/antvis/S2/issues/271)
* **facet:** add scroll speed ratio ([#438](https://github.com/antvis/S2/issues/438)) ([9ba97fb](https://github.com/antvis/S2/commit/9ba97fb716132b5c5bd49f03e16a6cb5d0ae51e4))
* **interaction:** hidden columns ([#296](https://github.com/antvis/S2/issues/296)) ([f5f4a69](https://github.com/antvis/S2/commit/f5f4a69dbd2b436f36e874323115d54af9f0aa16))
* **interaction:** select interaction imporement ([#324](https://github.com/antvis/S2/issues/324)) ([6b5479d](https://github.com/antvis/S2/commit/6b5479d9cb9718ce0c657277ef2ad30c56b8ded7))
* refactor switcher component ([#380](https://github.com/antvis/S2/issues/380)) ([f5c2993](https://github.com/antvis/S2/commit/f5c2993801d4f2b0d09ecaf4b8f751deefbac0d0))
* select all ([#348](https://github.com/antvis/S2/issues/348)) ([334aac4](https://github.com/antvis/S2/commit/334aac41ac9511c3b417a7006591fdbf138ab618)), closes [#342](https://github.com/antvis/S2/issues/342) [#339](https://github.com/antvis/S2/issues/339)

## [0.1.14](https://github.com/antvis/S2/compare/v0.1.1...v0.1.14) (2021-10-09)

### Bug Fixes

* 🐛 add the `spreadsheet` for the meta of the corner cell in tree mode and tweak the style of cell borders ([#342](https://github.com/antvis/S2/issues/342)) ([f322519](https://github.com/antvis/S2/commit/f322519fe42659286c0d4306eef0fa2922ad69aa)), closes [#339](https://github.com/antvis/S2/issues/339)
* 🐛 solve the wrong render state when updating the dataCfg and close [#285](https://github.com/antvis/S2/issues/285) ([#299](https://github.com/antvis/S2/issues/299)) ([b69cf24](https://github.com/antvis/S2/commit/b69cf2405584483cc1639adc2d44af1b728f8d05))
* **facet:** fix issue [#291](https://github.com/antvis/S2/issues/291) ([#297](https://github.com/antvis/S2/issues/297)) ([28a5c11](https://github.com/antvis/S2/commit/28a5c115501ddbe78432682c9c8cfb4b8b5c7780))
* **facet:** frozen clip and resizer issue ([#275](https://github.com/antvis/S2/issues/275)) ([6b53061](https://github.com/antvis/S2/commit/6b53061583e0062242a6473c2413bae339ff1338)), closes [#269](https://github.com/antvis/S2/issues/269) [#270](https://github.com/antvis/S2/issues/270) [#268](https://github.com/antvis/S2/issues/268) [#267](https://github.com/antvis/S2/issues/267) [#271](https://github.com/antvis/S2/issues/271) [#272](https://github.com/antvis/S2/issues/272) [#265](https://github.com/antvis/S2/issues/265) [#274](https://github.com/antvis/S2/issues/274) [#276](https://github.com/antvis/S2/issues/276)
* **interaction:** add brush move distance validate ([#321](https://github.com/antvis/S2/issues/321)) ([2ee8f9d](https://github.com/antvis/S2/commit/2ee8f9d163ad60692b6ee2e1173e4bfc397430cd))
* **interaction:** wrong hidden column icon position ([#329](https://github.com/antvis/S2/issues/329)) ([19d4497](https://github.com/antvis/S2/commit/19d4497b3112cf543d170e65f230f0e885ece8a4))
* **poivt-table:** fix render apply font crash on ios15 ([#394](https://github.com/antvis/S2/issues/394)) ([cbb7045](https://github.com/antvis/S2/commit/cbb7045354e674c858185c307b1e5ac2ecd0a70f))
* **povit-table:** resolve scroll shake issue close [#374](https://github.com/antvis/S2/issues/374) ([#379](https://github.com/antvis/S2/issues/379)) ([014d683](https://github.com/antvis/S2/commit/014d683a8cc251f0f4cddb28662b45b7b96d4edb))
* **resize:** fix set width and height problem ([#402](https://github.com/antvis/S2/issues/402)) ([41caf18](https://github.com/antvis/S2/commit/41caf1812687130d9d4d595b680c544a69a49843))
* revert code ([#325](https://github.com/antvis/S2/issues/325)) ([6ece5e8](https://github.com/antvis/S2/commit/6ece5e89f50b7d450c412e224546e923792d0aca))
* row-col-click's show about pivot and table, formatter when showSingleTips ([#327](https://github.com/antvis/S2/issues/327)) ([23d3508](https://github.com/antvis/S2/commit/23d3508bc42954e1561c350cc11db54cc54bf321))
* **spreadsheet:** solve the workflow and test case ([#286](https://github.com/antvis/S2/issues/286)) ([c44e469](https://github.com/antvis/S2/commit/c44e4691435623d7de84b70c08308d2b1943d6bc)), closes [#269](https://github.com/antvis/S2/issues/269) [#270](https://github.com/antvis/S2/issues/270) [#268](https://github.com/antvis/S2/issues/268) [#267](https://github.com/antvis/S2/issues/267) [#271](https://github.com/antvis/S2/issues/271) [#272](https://github.com/antvis/S2/issues/272) [#265](https://github.com/antvis/S2/issues/265) [#274](https://github.com/antvis/S2/issues/274) [#276](https://github.com/antvis/S2/issues/276) [#277](https://github.com/antvis/S2/issues/277) [#283](https://github.com/antvis/S2/issues/283) [#273](https://github.com/antvis/S2/issues/273) [#267](https://github.com/antvis/S2/issues/267)
* table dataset spec ([#288](https://github.com/antvis/S2/issues/288)) ([63bef22](https://github.com/antvis/S2/commit/63bef22319ab05c7d1b3d9aeace49e043731d3af))
* **table:** frozen pagination issue ([#338](https://github.com/antvis/S2/issues/338)) ([39d26a5](https://github.com/antvis/S2/commit/39d26a56de3ecc862c529d72b9dc431b1af0611a))
* **table:** table mode corner width err ([#396](https://github.com/antvis/S2/issues/396)) ([e3b9442](https://github.com/antvis/S2/commit/e3b9442ef2952b1047f9e46b3cdf5c153318b768))
* **tooltip:** fix cannot render tooltip element when first show ([#354](https://github.com/antvis/S2/issues/354)) ([78c22a6](https://github.com/antvis/S2/commit/78c22a6c8d3abb6357451e6752ad4fb4c2334e25))
* **tooltip:** fix cannot show sort menu when icon first clicked ([#366](https://github.com/antvis/S2/issues/366)) ([9c800a5](https://github.com/antvis/S2/commit/9c800a55291c36fed84bbf4e393e1b4dd6576e60))
* **tooltip:** tooltip will hide if cliced ([#370](https://github.com/antvis/S2/issues/370)) ([dccd4f5](https://github.com/antvis/S2/commit/dccd4f5bf667af0401e9d517f729992ba6dc7068))
* update d.ts path ([#319](https://github.com/antvis/S2/issues/319)) ([4117fa5](https://github.com/antvis/S2/commit/4117fa5bc3a23956f6e61cf0284cdd11356f7e39))
* update external using regex ([#304](https://github.com/antvis/S2/issues/304)) ([c40d3cc](https://github.com/antvis/S2/commit/c40d3cc6d37395b9c45d6ee2720126a2a1c8a87d))

### Features

* :sparkles: add column header labels for the corner header ([#320](https://github.com/antvis/S2/issues/320)) ([1b87bda](https://github.com/antvis/S2/commit/1b87bda6e6c2decfbd60c975d78afbcf5f0eb400))
* :sparkles: allow users to set different display condition for headerActionIcons ([#352](https://github.com/antvis/S2/issues/352)) ([9375f2b](https://github.com/antvis/S2/commit/9375f2b8e594355b2e456fb18910085139f76932))
* :sparkles: init examples gallery for the site ([#280](https://github.com/antvis/S2/issues/280)) ([891ce39](https://github.com/antvis/S2/commit/891ce391e5009384a34b7b91ee3507f8c1cae708))
* ✨ add custom header action icons ([#331](https://github.com/antvis/S2/issues/331)) ([4dcb1a2](https://github.com/antvis/S2/commit/4dcb1a2344783c8df283071bee1f8b07988b9b01))
* ✨ enable users to set the page size of the pagination configuration and close [#302](https://github.com/antvis/S2/issues/302) ([#309](https://github.com/antvis/S2/issues/309)) ([e5e961e](https://github.com/antvis/S2/commit/e5e961e306092c7ebabefa782a7ea54324656018))
* ✨ part drill down based on the new data process ([#399](https://github.com/antvis/S2/issues/399)) ([6a8889b](https://github.com/antvis/S2/commit/6a8889be5c47c49f335528548b3289577e0bd175))
* 🔖 publish v0.1.3 ([#257](https://github.com/antvis/S2/issues/257)) ([92e452a](https://github.com/antvis/S2/commit/92e452ab6fef1bd4b3a3ed0e424e405e362ce425)), closes [#238](https://github.com/antvis/S2/issues/238) [#237](https://github.com/antvis/S2/issues/237) [#7](https://github.com/antvis/S2/issues/7) [#10](https://github.com/antvis/S2/issues/10) [#12](https://github.com/antvis/S2/issues/12) [#13](https://github.com/antvis/S2/issues/13) [#16](https://github.com/antvis/S2/issues/16) [#17](https://github.com/antvis/S2/issues/17) [#11](https://github.com/antvis/S2/issues/11) [#19](https://github.com/antvis/S2/issues/19) [#18](https://github.com/antvis/S2/issues/18) [#21](https://github.com/antvis/S2/issues/21) [#23](https://github.com/antvis/S2/issues/23) [#20](https://github.com/antvis/S2/issues/20) [#24](https://github.com/antvis/S2/issues/24) [#20](https://github.com/antvis/S2/issues/20) [#26](https://github.com/antvis/S2/issues/26) [#27](https://github.com/antvis/S2/issues/27) [#28](https://github.com/antvis/S2/issues/28) [#29](https://github.com/antvis/S2/issues/29) [#35](https://github.com/antvis/S2/issues/35) [#37](https://github.com/antvis/S2/issues/37) [#38](https://github.com/antvis/S2/issues/38) [#39](https://github.com/antvis/S2/issues/39) [#42](https://github.com/antvis/S2/issues/42) [#43](https://github.com/antvis/S2/issues/43) [#44](https://github.com/antvis/S2/issues/44) [#45](https://github.com/antvis/S2/issues/45) [#47](https://github.com/antvis/S2/issues/47) [#46](https://github.com/antvis/S2/issues/46) [#48](https://github.com/antvis/S2/issues/48) [#32](https://github.com/antvis/S2/issues/32) [#31](https://github.com/antvis/S2/issues/31) [#49](https://github.com/antvis/S2/issues/49) [#32](https://github.com/antvis/S2/issues/32) [#31](https://github.com/antvis/S2/issues/31) [#50](https://github.com/antvis/S2/issues/50) [#51](https://github.com/antvis/S2/issues/51) [#52](https://github.com/antvis/S2/issues/52) [#55](https://github.com/antvis/S2/issues/55) [#57](https://github.com/antvis/S2/issues/57) [#58](https://github.com/antvis/S2/issues/58) [#59](https://github.com/antvis/S2/issues/59) [#14](https://github.com/antvis/S2/issues/14) [#30](https://github.com/antvis/S2/issues/30) [#60](https://github.com/antvis/S2/issues/60) [#61](https://github.com/antvis/S2/issues/61) [#64](https://github.com/antvis/S2/issues/64) [#65](https://github.com/antvis/S2/issues/65) [#69](https://github.com/antvis/S2/issues/69) [#70](https://github.com/antvis/S2/issues/70) [#71](https://github.com/antvis/S2/issues/71) [#70](https://github.com/antvis/S2/issues/70) [#70](https://github.com/antvis/S2/issues/70) [#72](https://github.com/antvis/S2/issues/72) [#73](https://github.com/antvis/S2/issues/73) [#74](https://github.com/antvis/S2/issues/74) [#75](https://github.com/antvis/S2/issues/75) [#76](https://github.com/antvis/S2/issues/76) [#82](https://github.com/antvis/S2/issues/82) [#85](https://github.com/antvis/S2/issues/85) [#91](https://github.com/antvis/S2/issues/91) [#81](https://github.com/antvis/S2/issues/81) [#94](https://github.com/antvis/S2/issues/94) [#95](https://github.com/antvis/S2/issues/95) [#100](https://github.com/antvis/S2/issues/100) [#99](https://github.com/antvis/S2/issues/99) [#101](https://github.com/antvis/S2/issues/101) [#107](https://github.com/antvis/S2/issues/107) [#108](https://github.com/antvis/S2/issues/108) [#109](https://github.com/antvis/S2/issues/109) [#112](https://github.com/antvis/S2/issues/112) [#114](https://github.com/antvis/S2/issues/114) [#115](https://github.com/antvis/S2/issues/115) [#116](https://github.com/antvis/S2/issues/116) [#117](https://github.com/antvis/S2/issues/117) [#119](https://github.com/antvis/S2/issues/119) [#121](https://github.com/antvis/S2/issues/121) [#122](https://github.com/antvis/S2/issues/122) [#124](https://github.com/antvis/S2/issues/124) [#125](https://github.com/antvis/S2/issues/125) [#123](https://github.com/antvis/S2/issues/123) [#120](https://github.com/antvis/S2/issues/120) [#126](https://github.com/antvis/S2/issues/126) [#128](https://github.com/antvis/S2/issues/128) [#130](https://github.com/antvis/S2/issues/130) [#129](https://github.com/antvis/S2/issues/129) [#113](https://github.com/antvis/S2/issues/113) [#132](https://github.com/antvis/S2/issues/132) [#135](https://github.com/antvis/S2/issues/135) [#138](https://github.com/antvis/S2/issues/138) [#118](https://github.com/antvis/S2/issues/118) [#139](https://github.com/antvis/S2/issues/139) [#118](https://github.com/antvis/S2/issues/118) [#142](https://github.com/antvis/S2/issues/142) [#143](https://github.com/antvis/S2/issues/143) [#137](https://github.com/antvis/S2/issues/137) [#136](https://github.com/antvis/S2/issues/136) [#148](https://github.com/antvis/S2/issues/148) [#146](https://github.com/antvis/S2/issues/146) [#149](https://github.com/antvis/S2/issues/149) [#152](https://github.com/antvis/S2/issues/152) [#153](https://github.com/antvis/S2/issues/153) [#155](https://github.com/antvis/S2/issues/155) [#156](https://github.com/antvis/S2/issues/156) [#151](https://github.com/antvis/S2/issues/151) [#157](https://github.com/antvis/S2/issues/157) [#154](https://github.com/antvis/S2/issues/154) [#160](https://github.com/antvis/S2/issues/160) [#162](https://github.com/antvis/S2/issues/162) [#164](https://github.com/antvis/S2/issues/164) [#158](https://github.com/antvis/S2/issues/158) [#167](https://github.com/antvis/S2/issues/167) [#170](https://github.com/antvis/S2/issues/170) [#165](https://github.com/antvis/S2/issues/165) [#171](https://github.com/antvis/S2/issues/171) [#163](https://github.com/antvis/S2/issues/163) [#174](https://github.com/antvis/S2/issues/174) [#172](https://github.com/antvis/S2/issues/172) [#175](https://github.com/antvis/S2/issues/175) [#173](https://github.com/antvis/S2/issues/173) [#179](https://github.com/antvis/S2/issues/179) [#183](https://github.com/antvis/S2/issues/183) [#182](https://github.com/antvis/S2/issues/182) [#180](https://github.com/antvis/S2/issues/180) [#184](https://github.com/antvis/S2/issues/184) [#185](https://github.com/antvis/S2/issues/185) [#181](https://github.com/antvis/S2/issues/181) [#178](https://github.com/antvis/S2/issues/178) [#192](https://github.com/antvis/S2/issues/192) [#189](https://github.com/antvis/S2/issues/189) [#190](https://github.com/antvis/S2/issues/190) [#194](https://github.com/antvis/S2/issues/194) [#197](https://github.com/antvis/S2/issues/197) [#196](https://github.com/antvis/S2/issues/196) [#203](https://github.com/antvis/S2/issues/203) [#207](https://github.com/antvis/S2/issues/207) [#204](https://github.com/antvis/S2/issues/204) [#206](https://github.com/antvis/S2/issues/206) [#208](https://github.com/antvis/S2/issues/208) [#202](https://github.com/antvis/S2/issues/202) [#201](https://github.com/antvis/S2/issues/201) [#209](https://github.com/antvis/S2/issues/209) [#200](https://github.com/antvis/S2/issues/200) [#210](https://github.com/antvis/S2/issues/210) [#211](https://github.com/antvis/S2/issues/211) [#214](https://github.com/antvis/S2/issues/214) [#213](https://github.com/antvis/S2/issues/213) [#212](https://github.com/antvis/S2/issues/212) [#216](https://github.com/antvis/S2/issues/216) [#217](https://github.com/antvis/S2/issues/217) [#218](https://github.com/antvis/S2/issues/218) [#219](https://github.com/antvis/S2/issues/219) [#221](https://github.com/antvis/S2/issues/221) [#222](https://github.com/antvis/S2/issues/222) [#240](https://github.com/antvis/S2/issues/240) [#241](https://github.com/antvis/S2/issues/241) [#242](https://github.com/antvis/S2/issues/242) [#248](https://github.com/antvis/S2/issues/248) [#245](https://github.com/antvis/S2/issues/245) [#252](https://github.com/antvis/S2/issues/252) [#249](https://github.com/antvis/S2/issues/249)
* add doc for table ([#360](https://github.com/antvis/S2/issues/360)) ([a7ee65e](https://github.com/antvis/S2/commit/a7ee65e4f46a0e8253a756d6c2619166e36a8c8e))
* add group sort in col's values and refactor tooltip's style ([#284](https://github.com/antvis/S2/issues/284)) ([ad02d9d](https://github.com/antvis/S2/commit/ad02d9db301f6be34112ac99e6db2de48af4c2dc)), closes [#269](https://github.com/antvis/S2/issues/269) [#270](https://github.com/antvis/S2/issues/270) [#268](https://github.com/antvis/S2/issues/268) [#267](https://github.com/antvis/S2/issues/267) [#271](https://github.com/antvis/S2/issues/271) [#272](https://github.com/antvis/S2/issues/272) [#265](https://github.com/antvis/S2/issues/265) [#274](https://github.com/antvis/S2/issues/274) [#276](https://github.com/antvis/S2/issues/276) [#277](https://github.com/antvis/S2/issues/277) [#283](https://github.com/antvis/S2/issues/283)
* copy with row and col ([#387](https://github.com/antvis/S2/issues/387)) ([7602ef8](https://github.com/antvis/S2/commit/7602ef87d5821b7a897c779f90d37bfc1e52d25f))
* dimensions switcher ([#298](https://github.com/antvis/S2/issues/298)) ([f223319](https://github.com/antvis/S2/commit/f2233194850604f5245e7eb19ea61f3993a592fe)), closes [#269](https://github.com/antvis/S2/issues/269) [#270](https://github.com/antvis/S2/issues/270) [#268](https://github.com/antvis/S2/issues/268) [#267](https://github.com/antvis/S2/issues/267) [#271](https://github.com/antvis/S2/issues/271)
* **interaction:** hidden columns ([#296](https://github.com/antvis/S2/issues/296)) ([f5f4a69](https://github.com/antvis/S2/commit/f5f4a69dbd2b436f36e874323115d54af9f0aa16))
* **interaction:** select interaction imporement ([#324](https://github.com/antvis/S2/issues/324)) ([6b5479d](https://github.com/antvis/S2/commit/6b5479d9cb9718ce0c657277ef2ad30c56b8ded7))
* refactor switcher component ([#380](https://github.com/antvis/S2/issues/380)) ([f5c2993](https://github.com/antvis/S2/commit/f5c2993801d4f2b0d09ecaf4b8f751deefbac0d0))
* select all ([#348](https://github.com/antvis/S2/issues/348)) ([334aac4](https://github.com/antvis/S2/commit/334aac41ac9511c3b417a7006591fdbf138ab618)), closes [#342](https://github.com/antvis/S2/issues/342) [#339](https://github.com/antvis/S2/issues/339)

## [0.1.13](https://github.com/antvis/S2/compare/v0.1.0-alpha.15...v0.1.13) (2021-09-30)

### Bug Fixes

* 🐛 add the `spreadsheet` for the meta of the corner cell in tree mode and tweak the style of cell borders ([#342](https://github.com/antvis/S2/issues/342)) ([f322519](https://github.com/antvis/S2/commit/f322519fe42659286c0d4306eef0fa2922ad69aa)), closes [#339](https://github.com/antvis/S2/issues/339)
* 🐛 fix the wrong params of export function ([#159](https://github.com/antvis/S2/issues/159)) ([ce66363](https://github.com/antvis/S2/commit/ce663637c63ef173019d8233237ed8ee7d98eaa9))
* 🐛 solve the wrong render state when updating the dataCfg and close [#285](https://github.com/antvis/S2/issues/285) ([#299](https://github.com/antvis/S2/issues/299)) ([b69cf24](https://github.com/antvis/S2/commit/b69cf2405584483cc1639adc2d44af1b728f8d05))
* **facet:** fix issue [#291](https://github.com/antvis/S2/issues/291) ([#297](https://github.com/antvis/S2/issues/297)) ([28a5c11](https://github.com/antvis/S2/commit/28a5c115501ddbe78432682c9c8cfb4b8b5c7780))
* **facet:** frozen clip and resizer issue ([#275](https://github.com/antvis/S2/issues/275)) ([6b53061](https://github.com/antvis/S2/commit/6b53061583e0062242a6473c2413bae339ff1338)), closes [#269](https://github.com/antvis/S2/issues/269) [#270](https://github.com/antvis/S2/issues/270) [#268](https://github.com/antvis/S2/issues/268) [#267](https://github.com/antvis/S2/issues/267) [#271](https://github.com/antvis/S2/issues/271) [#272](https://github.com/antvis/S2/issues/272) [#265](https://github.com/antvis/S2/issues/265) [#274](https://github.com/antvis/S2/issues/274) [#276](https://github.com/antvis/S2/issues/276)
* **interaction:** add brush move distance validate ([#321](https://github.com/antvis/S2/issues/321)) ([2ee8f9d](https://github.com/antvis/S2/commit/2ee8f9d163ad60692b6ee2e1173e4bfc397430cd))
* **interaction:** wrong hidden column icon position ([#329](https://github.com/antvis/S2/issues/329)) ([19d4497](https://github.com/antvis/S2/commit/19d4497b3112cf543d170e65f230f0e885ece8a4))
* **poivt-table:** fix render apply font crash on ios15 ([#394](https://github.com/antvis/S2/issues/394)) ([cbb7045](https://github.com/antvis/S2/commit/cbb7045354e674c858185c307b1e5ac2ecd0a70f))
* **povit-table:** resolve scroll shake issue close [#374](https://github.com/antvis/S2/issues/374) ([#379](https://github.com/antvis/S2/issues/379)) ([014d683](https://github.com/antvis/S2/commit/014d683a8cc251f0f4cddb28662b45b7b96d4edb))
* revert code ([#325](https://github.com/antvis/S2/issues/325)) ([6ece5e8](https://github.com/antvis/S2/commit/6ece5e89f50b7d450c412e224546e923792d0aca))
* row-col-click's show about pivot and table, formatter when showSingleTips ([#327](https://github.com/antvis/S2/issues/327)) ([23d3508](https://github.com/antvis/S2/commit/23d3508bc42954e1561c350cc11db54cc54bf321))
* **spreadsheet:** solve the workflow and test case ([#286](https://github.com/antvis/S2/issues/286)) ([c44e469](https://github.com/antvis/S2/commit/c44e4691435623d7de84b70c08308d2b1943d6bc)), closes [#269](https://github.com/antvis/S2/issues/269) [#270](https://github.com/antvis/S2/issues/270) [#268](https://github.com/antvis/S2/issues/268) [#267](https://github.com/antvis/S2/issues/267) [#271](https://github.com/antvis/S2/issues/271) [#272](https://github.com/antvis/S2/issues/272) [#265](https://github.com/antvis/S2/issues/265) [#274](https://github.com/antvis/S2/issues/274) [#276](https://github.com/antvis/S2/issues/276) [#277](https://github.com/antvis/S2/issues/277) [#283](https://github.com/antvis/S2/issues/283) [#273](https://github.com/antvis/S2/issues/273) [#267](https://github.com/antvis/S2/issues/267)
* table dataset spec ([#288](https://github.com/antvis/S2/issues/288)) ([63bef22](https://github.com/antvis/S2/commit/63bef22319ab05c7d1b3d9aeace49e043731d3af))
* **table:** frozen pagination issue ([#338](https://github.com/antvis/S2/issues/338)) ([39d26a5](https://github.com/antvis/S2/commit/39d26a56de3ecc862c529d72b9dc431b1af0611a))
* **tooltip:** fix cannot render tooltip element when first show ([#354](https://github.com/antvis/S2/issues/354)) ([78c22a6](https://github.com/antvis/S2/commit/78c22a6c8d3abb6357451e6752ad4fb4c2334e25))
* **tooltip:** fix cannot show sort menu when icon first clicked ([#366](https://github.com/antvis/S2/issues/366)) ([9c800a5](https://github.com/antvis/S2/commit/9c800a55291c36fed84bbf4e393e1b4dd6576e60))
* **tooltip:** tooltip will hide if cliced ([#370](https://github.com/antvis/S2/issues/370)) ([dccd4f5](https://github.com/antvis/S2/commit/dccd4f5bf667af0401e9d517f729992ba6dc7068))
* update d.ts path ([#319](https://github.com/antvis/S2/issues/319)) ([4117fa5](https://github.com/antvis/S2/commit/4117fa5bc3a23956f6e61cf0284cdd11356f7e39))
* update external using regex ([#304](https://github.com/antvis/S2/issues/304)) ([c40d3cc](https://github.com/antvis/S2/commit/c40d3cc6d37395b9c45d6ee2720126a2a1c8a87d))

### Features

* :sparkles: add column header labels for the corner header ([#320](https://github.com/antvis/S2/issues/320)) ([1b87bda](https://github.com/antvis/S2/commit/1b87bda6e6c2decfbd60c975d78afbcf5f0eb400))
* :sparkles: allow users to set different display condition for headerActionIcons ([#352](https://github.com/antvis/S2/issues/352)) ([9375f2b](https://github.com/antvis/S2/commit/9375f2b8e594355b2e456fb18910085139f76932))
* :sparkles: init examples gallery for the site ([#280](https://github.com/antvis/S2/issues/280)) ([891ce39](https://github.com/antvis/S2/commit/891ce391e5009384a34b7b91ee3507f8c1cae708))
* ✨ add custom header action icons ([#331](https://github.com/antvis/S2/issues/331)) ([4dcb1a2](https://github.com/antvis/S2/commit/4dcb1a2344783c8df283071bee1f8b07988b9b01))
* ✨ enable users to set the page size of the pagination configuration and close [#302](https://github.com/antvis/S2/issues/302) ([#309](https://github.com/antvis/S2/issues/309)) ([e5e961e](https://github.com/antvis/S2/commit/e5e961e306092c7ebabefa782a7ea54324656018))
* ✨ refactor the s2 based on new data-process ([#235](https://github.com/antvis/S2/issues/235)) ([31dd6a0](https://github.com/antvis/S2/commit/31dd6a0b9c96065b0f2bebb71fdb645b1d75db54)), closes [#7](https://github.com/antvis/S2/issues/7) [#10](https://github.com/antvis/S2/issues/10) [#12](https://github.com/antvis/S2/issues/12) [#13](https://github.com/antvis/S2/issues/13) [#16](https://github.com/antvis/S2/issues/16) [#17](https://github.com/antvis/S2/issues/17) [#11](https://github.com/antvis/S2/issues/11) [#19](https://github.com/antvis/S2/issues/19) [#18](https://github.com/antvis/S2/issues/18) [#21](https://github.com/antvis/S2/issues/21) [#23](https://github.com/antvis/S2/issues/23) [#20](https://github.com/antvis/S2/issues/20) [#24](https://github.com/antvis/S2/issues/24) [#20](https://github.com/antvis/S2/issues/20) [#26](https://github.com/antvis/S2/issues/26) [#27](https://github.com/antvis/S2/issues/27) [#28](https://github.com/antvis/S2/issues/28) [#29](https://github.com/antvis/S2/issues/29) [#35](https://github.com/antvis/S2/issues/35) [#37](https://github.com/antvis/S2/issues/37) [#38](https://github.com/antvis/S2/issues/38) [#39](https://github.com/antvis/S2/issues/39) [#42](https://github.com/antvis/S2/issues/42) [#43](https://github.com/antvis/S2/issues/43) [#44](https://github.com/antvis/S2/issues/44) [#45](https://github.com/antvis/S2/issues/45) [#47](https://github.com/antvis/S2/issues/47) [#46](https://github.com/antvis/S2/issues/46) [#48](https://github.com/antvis/S2/issues/48) [#32](https://github.com/antvis/S2/issues/32) [#31](https://github.com/antvis/S2/issues/31) [#49](https://github.com/antvis/S2/issues/49) [#32](https://github.com/antvis/S2/issues/32) [#31](https://github.com/antvis/S2/issues/31) [#50](https://github.com/antvis/S2/issues/50) [#51](https://github.com/antvis/S2/issues/51) [#52](https://github.com/antvis/S2/issues/52) [#55](https://github.com/antvis/S2/issues/55) [#57](https://github.com/antvis/S2/issues/57) [#58](https://github.com/antvis/S2/issues/58) [#59](https://github.com/antvis/S2/issues/59) [#14](https://github.com/antvis/S2/issues/14) [#30](https://github.com/antvis/S2/issues/30) [#60](https://github.com/antvis/S2/issues/60) [#61](https://github.com/antvis/S2/issues/61) [#64](https://github.com/antvis/S2/issues/64) [#65](https://github.com/antvis/S2/issues/65) [#69](https://github.com/antvis/S2/issues/69) [#70](https://github.com/antvis/S2/issues/70) [#71](https://github.com/antvis/S2/issues/71) [#70](https://github.com/antvis/S2/issues/70) [#70](https://github.com/antvis/S2/issues/70) [#72](https://github.com/antvis/S2/issues/72) [#73](https://github.com/antvis/S2/issues/73) [#74](https://github.com/antvis/S2/issues/74) [#75](https://github.com/antvis/S2/issues/75) [#76](https://github.com/antvis/S2/issues/76) [#82](https://github.com/antvis/S2/issues/82) [#85](https://github.com/antvis/S2/issues/85) [#91](https://github.com/antvis/S2/issues/91) [#81](https://github.com/antvis/S2/issues/81) [#94](https://github.com/antvis/S2/issues/94) [#95](https://github.com/antvis/S2/issues/95) [#100](https://github.com/antvis/S2/issues/100) [#99](https://github.com/antvis/S2/issues/99) [#101](https://github.com/antvis/S2/issues/101) [#107](https://github.com/antvis/S2/issues/107) [#108](https://github.com/antvis/S2/issues/108) [#109](https://github.com/antvis/S2/issues/109) [#112](https://github.com/antvis/S2/issues/112) [#114](https://github.com/antvis/S2/issues/114) [#115](https://github.com/antvis/S2/issues/115) [#116](https://github.com/antvis/S2/issues/116) [#117](https://github.com/antvis/S2/issues/117) [#119](https://github.com/antvis/S2/issues/119) [#121](https://github.com/antvis/S2/issues/121) [#122](https://github.com/antvis/S2/issues/122) [#124](https://github.com/antvis/S2/issues/124) [#125](https://github.com/antvis/S2/issues/125) [#123](https://github.com/antvis/S2/issues/123) [#120](https://github.com/antvis/S2/issues/120) [#126](https://github.com/antvis/S2/issues/126) [#128](https://github.com/antvis/S2/issues/128) [#130](https://github.com/antvis/S2/issues/130) [#129](https://github.com/antvis/S2/issues/129) [#113](https://github.com/antvis/S2/issues/113) [#132](https://github.com/antvis/S2/issues/132) [#135](https://github.com/antvis/S2/issues/135) [#138](https://github.com/antvis/S2/issues/138) [#118](https://github.com/antvis/S2/issues/118) [#139](https://github.com/antvis/S2/issues/139) [#118](https://github.com/antvis/S2/issues/118) [#142](https://github.com/antvis/S2/issues/142) [#143](https://github.com/antvis/S2/issues/143) [#137](https://github.com/antvis/S2/issues/137) [#136](https://github.com/antvis/S2/issues/136) [#148](https://github.com/antvis/S2/issues/148) [#146](https://github.com/antvis/S2/issues/146) [#149](https://github.com/antvis/S2/issues/149) [#152](https://github.com/antvis/S2/issues/152) [#153](https://github.com/antvis/S2/issues/153) [#155](https://github.com/antvis/S2/issues/155) [#156](https://github.com/antvis/S2/issues/156) [#151](https://github.com/antvis/S2/issues/151) [#157](https://github.com/antvis/S2/issues/157) [#154](https://github.com/antvis/S2/issues/154) [#160](https://github.com/antvis/S2/issues/160) [#162](https://github.com/antvis/S2/issues/162) [#164](https://github.com/antvis/S2/issues/164) [#158](https://github.com/antvis/S2/issues/158) [#167](https://github.com/antvis/S2/issues/167) [#170](https://github.com/antvis/S2/issues/170) [#165](https://github.com/antvis/S2/issues/165) [#171](https://github.com/antvis/S2/issues/171) [#163](https://github.com/antvis/S2/issues/163) [#174](https://github.com/antvis/S2/issues/174) [#172](https://github.com/antvis/S2/issues/172) [#175](https://github.com/antvis/S2/issues/175) [#173](https://github.com/antvis/S2/issues/173) [#179](https://github.com/antvis/S2/issues/179) [#183](https://github.com/antvis/S2/issues/183) [#182](https://github.com/antvis/S2/issues/182) [#180](https://github.com/antvis/S2/issues/180) [#184](https://github.com/antvis/S2/issues/184) [#185](https://github.com/antvis/S2/issues/185) [#181](https://github.com/antvis/S2/issues/181) [#178](https://github.com/antvis/S2/issues/178) [#192](https://github.com/antvis/S2/issues/192) [#189](https://github.com/antvis/S2/issues/189) [#190](https://github.com/antvis/S2/issues/190) [#194](https://github.com/antvis/S2/issues/194) [#197](https://github.com/antvis/S2/issues/197) [#196](https://github.com/antvis/S2/issues/196) [#203](https://github.com/antvis/S2/issues/203) [#207](https://github.com/antvis/S2/issues/207) [#204](https://github.com/antvis/S2/issues/204) [#206](https://github.com/antvis/S2/issues/206) [#208](https://github.com/antvis/S2/issues/208) [#202](https://github.com/antvis/S2/issues/202) [#201](https://github.com/antvis/S2/issues/201) [#209](https://github.com/antvis/S2/issues/209) [#200](https://github.com/antvis/S2/issues/200) [#210](https://github.com/antvis/S2/issues/210) [#211](https://github.com/antvis/S2/issues/211) [#214](https://github.com/antvis/S2/issues/214) [#213](https://github.com/antvis/S2/issues/213) [#212](https://github.com/antvis/S2/issues/212) [#216](https://github.com/antvis/S2/issues/216) [#217](https://github.com/antvis/S2/issues/217) [#218](https://github.com/antvis/S2/issues/218) [#219](https://github.com/antvis/S2/issues/219) [#221](https://github.com/antvis/S2/issues/221) [#222](https://github.com/antvis/S2/issues/222) [#223](https://github.com/antvis/S2/issues/223) [#227](https://github.com/antvis/S2/issues/227) [#228](https://github.com/antvis/S2/issues/228) [#231](https://github.com/antvis/S2/issues/231) [#234](https://github.com/antvis/S2/issues/234) [#230](https://github.com/antvis/S2/issues/230) [#233](https://github.com/antvis/S2/issues/233) [#230](https://github.com/antvis/S2/issues/230) [#236](https://github.com/antvis/S2/issues/236)
* 🔖 publish v0.1.3 ([#257](https://github.com/antvis/S2/issues/257)) ([92e452a](https://github.com/antvis/S2/commit/92e452ab6fef1bd4b3a3ed0e424e405e362ce425)), closes [#238](https://github.com/antvis/S2/issues/238) [#237](https://github.com/antvis/S2/issues/237) [#7](https://github.com/antvis/S2/issues/7) [#10](https://github.com/antvis/S2/issues/10) [#12](https://github.com/antvis/S2/issues/12) [#13](https://github.com/antvis/S2/issues/13) [#16](https://github.com/antvis/S2/issues/16) [#17](https://github.com/antvis/S2/issues/17) [#11](https://github.com/antvis/S2/issues/11) [#19](https://github.com/antvis/S2/issues/19) [#18](https://github.com/antvis/S2/issues/18) [#21](https://github.com/antvis/S2/issues/21) [#23](https://github.com/antvis/S2/issues/23) [#20](https://github.com/antvis/S2/issues/20) [#24](https://github.com/antvis/S2/issues/24) [#20](https://github.com/antvis/S2/issues/20) [#26](https://github.com/antvis/S2/issues/26) [#27](https://github.com/antvis/S2/issues/27) [#28](https://github.com/antvis/S2/issues/28) [#29](https://github.com/antvis/S2/issues/29) [#35](https://github.com/antvis/S2/issues/35) [#37](https://github.com/antvis/S2/issues/37) [#38](https://github.com/antvis/S2/issues/38) [#39](https://github.com/antvis/S2/issues/39) [#42](https://github.com/antvis/S2/issues/42) [#43](https://github.com/antvis/S2/issues/43) [#44](https://github.com/antvis/S2/issues/44) [#45](https://github.com/antvis/S2/issues/45) [#47](https://github.com/antvis/S2/issues/47) [#46](https://github.com/antvis/S2/issues/46) [#48](https://github.com/antvis/S2/issues/48) [#32](https://github.com/antvis/S2/issues/32) [#31](https://github.com/antvis/S2/issues/31) [#49](https://github.com/antvis/S2/issues/49) [#32](https://github.com/antvis/S2/issues/32) [#31](https://github.com/antvis/S2/issues/31) [#50](https://github.com/antvis/S2/issues/50) [#51](https://github.com/antvis/S2/issues/51) [#52](https://github.com/antvis/S2/issues/52) [#55](https://github.com/antvis/S2/issues/55) [#57](https://github.com/antvis/S2/issues/57) [#58](https://github.com/antvis/S2/issues/58) [#59](https://github.com/antvis/S2/issues/59) [#14](https://github.com/antvis/S2/issues/14) [#30](https://github.com/antvis/S2/issues/30) [#60](https://github.com/antvis/S2/issues/60) [#61](https://github.com/antvis/S2/issues/61) [#64](https://github.com/antvis/S2/issues/64) [#65](https://github.com/antvis/S2/issues/65) [#69](https://github.com/antvis/S2/issues/69) [#70](https://github.com/antvis/S2/issues/70) [#71](https://github.com/antvis/S2/issues/71) [#70](https://github.com/antvis/S2/issues/70) [#70](https://github.com/antvis/S2/issues/70) [#72](https://github.com/antvis/S2/issues/72) [#73](https://github.com/antvis/S2/issues/73) [#74](https://github.com/antvis/S2/issues/74) [#75](https://github.com/antvis/S2/issues/75) [#76](https://github.com/antvis/S2/issues/76) [#82](https://github.com/antvis/S2/issues/82) [#85](https://github.com/antvis/S2/issues/85) [#91](https://github.com/antvis/S2/issues/91) [#81](https://github.com/antvis/S2/issues/81) [#94](https://github.com/antvis/S2/issues/94) [#95](https://github.com/antvis/S2/issues/95) [#100](https://github.com/antvis/S2/issues/100) [#99](https://github.com/antvis/S2/issues/99) [#101](https://github.com/antvis/S2/issues/101) [#107](https://github.com/antvis/S2/issues/107) [#108](https://github.com/antvis/S2/issues/108) [#109](https://github.com/antvis/S2/issues/109) [#112](https://github.com/antvis/S2/issues/112) [#114](https://github.com/antvis/S2/issues/114) [#115](https://github.com/antvis/S2/issues/115) [#116](https://github.com/antvis/S2/issues/116) [#117](https://github.com/antvis/S2/issues/117) [#119](https://github.com/antvis/S2/issues/119) [#121](https://github.com/antvis/S2/issues/121) [#122](https://github.com/antvis/S2/issues/122) [#124](https://github.com/antvis/S2/issues/124) [#125](https://github.com/antvis/S2/issues/125) [#123](https://github.com/antvis/S2/issues/123) [#120](https://github.com/antvis/S2/issues/120) [#126](https://github.com/antvis/S2/issues/126) [#128](https://github.com/antvis/S2/issues/128) [#130](https://github.com/antvis/S2/issues/130) [#129](https://github.com/antvis/S2/issues/129) [#113](https://github.com/antvis/S2/issues/113) [#132](https://github.com/antvis/S2/issues/132) [#135](https://github.com/antvis/S2/issues/135) [#138](https://github.com/antvis/S2/issues/138) [#118](https://github.com/antvis/S2/issues/118) [#139](https://github.com/antvis/S2/issues/139) [#118](https://github.com/antvis/S2/issues/118) [#142](https://github.com/antvis/S2/issues/142) [#143](https://github.com/antvis/S2/issues/143) [#137](https://github.com/antvis/S2/issues/137) [#136](https://github.com/antvis/S2/issues/136) [#148](https://github.com/antvis/S2/issues/148) [#146](https://github.com/antvis/S2/issues/146) [#149](https://github.com/antvis/S2/issues/149) [#152](https://github.com/antvis/S2/issues/152) [#153](https://github.com/antvis/S2/issues/153) [#155](https://github.com/antvis/S2/issues/155) [#156](https://github.com/antvis/S2/issues/156) [#151](https://github.com/antvis/S2/issues/151) [#157](https://github.com/antvis/S2/issues/157) [#154](https://github.com/antvis/S2/issues/154) [#160](https://github.com/antvis/S2/issues/160) [#162](https://github.com/antvis/S2/issues/162) [#164](https://github.com/antvis/S2/issues/164) [#158](https://github.com/antvis/S2/issues/158) [#167](https://github.com/antvis/S2/issues/167) [#170](https://github.com/antvis/S2/issues/170) [#165](https://github.com/antvis/S2/issues/165) [#171](https://github.com/antvis/S2/issues/171) [#163](https://github.com/antvis/S2/issues/163) [#174](https://github.com/antvis/S2/issues/174) [#172](https://github.com/antvis/S2/issues/172) [#175](https://github.com/antvis/S2/issues/175) [#173](https://github.com/antvis/S2/issues/173) [#179](https://github.com/antvis/S2/issues/179) [#183](https://github.com/antvis/S2/issues/183) [#182](https://github.com/antvis/S2/issues/182) [#180](https://github.com/antvis/S2/issues/180) [#184](https://github.com/antvis/S2/issues/184) [#185](https://github.com/antvis/S2/issues/185) [#181](https://github.com/antvis/S2/issues/181) [#178](https://github.com/antvis/S2/issues/178) [#192](https://github.com/antvis/S2/issues/192) [#189](https://github.com/antvis/S2/issues/189) [#190](https://github.com/antvis/S2/issues/190) [#194](https://github.com/antvis/S2/issues/194) [#197](https://github.com/antvis/S2/issues/197) [#196](https://github.com/antvis/S2/issues/196) [#203](https://github.com/antvis/S2/issues/203) [#207](https://github.com/antvis/S2/issues/207) [#204](https://github.com/antvis/S2/issues/204) [#206](https://github.com/antvis/S2/issues/206) [#208](https://github.com/antvis/S2/issues/208) [#202](https://github.com/antvis/S2/issues/202) [#201](https://github.com/antvis/S2/issues/201) [#209](https://github.com/antvis/S2/issues/209) [#200](https://github.com/antvis/S2/issues/200) [#210](https://github.com/antvis/S2/issues/210) [#211](https://github.com/antvis/S2/issues/211) [#214](https://github.com/antvis/S2/issues/214) [#213](https://github.com/antvis/S2/issues/213) [#212](https://github.com/antvis/S2/issues/212) [#216](https://github.com/antvis/S2/issues/216) [#217](https://github.com/antvis/S2/issues/217) [#218](https://github.com/antvis/S2/issues/218) [#219](https://github.com/antvis/S2/issues/219) [#221](https://github.com/antvis/S2/issues/221) [#222](https://github.com/antvis/S2/issues/222) [#240](https://github.com/antvis/S2/issues/240) [#241](https://github.com/antvis/S2/issues/241) [#242](https://github.com/antvis/S2/issues/242) [#248](https://github.com/antvis/S2/issues/248) [#245](https://github.com/antvis/S2/issues/245) [#252](https://github.com/antvis/S2/issues/252) [#249](https://github.com/antvis/S2/issues/249)
* add doc for table ([#360](https://github.com/antvis/S2/issues/360)) ([a7ee65e](https://github.com/antvis/S2/commit/a7ee65e4f46a0e8253a756d6c2619166e36a8c8e))
* add group sort in col's values and refactor tooltip's style ([#284](https://github.com/antvis/S2/issues/284)) ([ad02d9d](https://github.com/antvis/S2/commit/ad02d9db301f6be34112ac99e6db2de48af4c2dc)), closes [#269](https://github.com/antvis/S2/issues/269) [#270](https://github.com/antvis/S2/issues/270) [#268](https://github.com/antvis/S2/issues/268) [#267](https://github.com/antvis/S2/issues/267) [#271](https://github.com/antvis/S2/issues/271) [#272](https://github.com/antvis/S2/issues/272) [#265](https://github.com/antvis/S2/issues/265) [#274](https://github.com/antvis/S2/issues/274) [#276](https://github.com/antvis/S2/issues/276) [#277](https://github.com/antvis/S2/issues/277) [#283](https://github.com/antvis/S2/issues/283)
* dimensions switcher ([#298](https://github.com/antvis/S2/issues/298)) ([f223319](https://github.com/antvis/S2/commit/f2233194850604f5245e7eb19ea61f3993a592fe)), closes [#269](https://github.com/antvis/S2/issues/269) [#270](https://github.com/antvis/S2/issues/270) [#268](https://github.com/antvis/S2/issues/268) [#267](https://github.com/antvis/S2/issues/267) [#271](https://github.com/antvis/S2/issues/271)
* **interaction:** hidden columns ([#296](https://github.com/antvis/S2/issues/296)) ([f5f4a69](https://github.com/antvis/S2/commit/f5f4a69dbd2b436f36e874323115d54af9f0aa16))
* **interaction:** select interaction imporement ([#324](https://github.com/antvis/S2/issues/324)) ([6b5479d](https://github.com/antvis/S2/commit/6b5479d9cb9718ce0c657277ef2ad30c56b8ded7))
* refactor switcher component ([#380](https://github.com/antvis/S2/issues/380)) ([f5c2993](https://github.com/antvis/S2/commit/f5c2993801d4f2b0d09ecaf4b8f751deefbac0d0))
* select all ([#348](https://github.com/antvis/S2/issues/348)) ([334aac4](https://github.com/antvis/S2/commit/334aac41ac9511c3b417a7006591fdbf138ab618)), closes [#342](https://github.com/antvis/S2/issues/342) [#339](https://github.com/antvis/S2/issues/339)

## [0.1.12](https://github.com/antvis/S2/compare/v0.1.0-alpha.15...v0.1.12) (2021-09-28)

### Bug Fixes

* 🐛 add the `spreadsheet` for the meta of the corner cell in tree mode and tweak the style of cell borders ([#342](https://github.com/antvis/S2/issues/342)) ([f322519](https://github.com/antvis/S2/commit/f322519fe42659286c0d4306eef0fa2922ad69aa)), closes [#339](https://github.com/antvis/S2/issues/339)
* 🐛 fix the wrong params of export function ([#159](https://github.com/antvis/S2/issues/159)) ([ce66363](https://github.com/antvis/S2/commit/ce663637c63ef173019d8233237ed8ee7d98eaa9))
* 🐛 solve the wrong render state when updating the dataCfg and close [#285](https://github.com/antvis/S2/issues/285) ([#299](https://github.com/antvis/S2/issues/299)) ([b69cf24](https://github.com/antvis/S2/commit/b69cf2405584483cc1639adc2d44af1b728f8d05))
* **facet:** fix issue [#291](https://github.com/antvis/S2/issues/291) ([#297](https://github.com/antvis/S2/issues/297)) ([28a5c11](https://github.com/antvis/S2/commit/28a5c115501ddbe78432682c9c8cfb4b8b5c7780))
* **facet:** frozen clip and resizer issue ([#275](https://github.com/antvis/S2/issues/275)) ([6b53061](https://github.com/antvis/S2/commit/6b53061583e0062242a6473c2413bae339ff1338)), closes [#269](https://github.com/antvis/S2/issues/269) [#270](https://github.com/antvis/S2/issues/270) [#268](https://github.com/antvis/S2/issues/268) [#267](https://github.com/antvis/S2/issues/267) [#271](https://github.com/antvis/S2/issues/271) [#272](https://github.com/antvis/S2/issues/272) [#265](https://github.com/antvis/S2/issues/265) [#274](https://github.com/antvis/S2/issues/274) [#276](https://github.com/antvis/S2/issues/276)
* **interaction:** add brush move distance validate ([#321](https://github.com/antvis/S2/issues/321)) ([2ee8f9d](https://github.com/antvis/S2/commit/2ee8f9d163ad60692b6ee2e1173e4bfc397430cd))
* **interaction:** wrong hidden column icon position ([#329](https://github.com/antvis/S2/issues/329)) ([19d4497](https://github.com/antvis/S2/commit/19d4497b3112cf543d170e65f230f0e885ece8a4))
* **povit-table:** resolve scroll shake issue close [#374](https://github.com/antvis/S2/issues/374) ([#379](https://github.com/antvis/S2/issues/379)) ([014d683](https://github.com/antvis/S2/commit/014d683a8cc251f0f4cddb28662b45b7b96d4edb))
* revert code ([#325](https://github.com/antvis/S2/issues/325)) ([6ece5e8](https://github.com/antvis/S2/commit/6ece5e89f50b7d450c412e224546e923792d0aca))
* row-col-click's show about pivot and table, formatter when showSingleTips ([#327](https://github.com/antvis/S2/issues/327)) ([23d3508](https://github.com/antvis/S2/commit/23d3508bc42954e1561c350cc11db54cc54bf321))
* **spreadsheet:** solve the workflow and test case ([#286](https://github.com/antvis/S2/issues/286)) ([c44e469](https://github.com/antvis/S2/commit/c44e4691435623d7de84b70c08308d2b1943d6bc)), closes [#269](https://github.com/antvis/S2/issues/269) [#270](https://github.com/antvis/S2/issues/270) [#268](https://github.com/antvis/S2/issues/268) [#267](https://github.com/antvis/S2/issues/267) [#271](https://github.com/antvis/S2/issues/271) [#272](https://github.com/antvis/S2/issues/272) [#265](https://github.com/antvis/S2/issues/265) [#274](https://github.com/antvis/S2/issues/274) [#276](https://github.com/antvis/S2/issues/276) [#277](https://github.com/antvis/S2/issues/277) [#283](https://github.com/antvis/S2/issues/283) [#273](https://github.com/antvis/S2/issues/273) [#267](https://github.com/antvis/S2/issues/267)
* table dataset spec ([#288](https://github.com/antvis/S2/issues/288)) ([63bef22](https://github.com/antvis/S2/commit/63bef22319ab05c7d1b3d9aeace49e043731d3af))
* **table:** frozen pagination issue ([#338](https://github.com/antvis/S2/issues/338)) ([39d26a5](https://github.com/antvis/S2/commit/39d26a56de3ecc862c529d72b9dc431b1af0611a))
* **tooltip:** fix cannot render tooltip element when first show ([#354](https://github.com/antvis/S2/issues/354)) ([78c22a6](https://github.com/antvis/S2/commit/78c22a6c8d3abb6357451e6752ad4fb4c2334e25))
* **tooltip:** fix cannot show sort menu when icon first clicked ([#366](https://github.com/antvis/S2/issues/366)) ([9c800a5](https://github.com/antvis/S2/commit/9c800a55291c36fed84bbf4e393e1b4dd6576e60))
* **tooltip:** tooltip will hide if cliced ([#370](https://github.com/antvis/S2/issues/370)) ([dccd4f5](https://github.com/antvis/S2/commit/dccd4f5bf667af0401e9d517f729992ba6dc7068))
* update d.ts path ([#319](https://github.com/antvis/S2/issues/319)) ([4117fa5](https://github.com/antvis/S2/commit/4117fa5bc3a23956f6e61cf0284cdd11356f7e39))
* update external using regex ([#304](https://github.com/antvis/S2/issues/304)) ([c40d3cc](https://github.com/antvis/S2/commit/c40d3cc6d37395b9c45d6ee2720126a2a1c8a87d))

### Features

* :sparkles: add column header labels for the corner header ([#320](https://github.com/antvis/S2/issues/320)) ([1b87bda](https://github.com/antvis/S2/commit/1b87bda6e6c2decfbd60c975d78afbcf5f0eb400))
* :sparkles: allow users to set different display condition for headerActionIcons ([#352](https://github.com/antvis/S2/issues/352)) ([9375f2b](https://github.com/antvis/S2/commit/9375f2b8e594355b2e456fb18910085139f76932))
* :sparkles: init examples gallery for the site ([#280](https://github.com/antvis/S2/issues/280)) ([891ce39](https://github.com/antvis/S2/commit/891ce391e5009384a34b7b91ee3507f8c1cae708))
* ✨ add custom header action icons ([#331](https://github.com/antvis/S2/issues/331)) ([4dcb1a2](https://github.com/antvis/S2/commit/4dcb1a2344783c8df283071bee1f8b07988b9b01))
* ✨ enable users to set the page size of the pagination configuration and close [#302](https://github.com/antvis/S2/issues/302) ([#309](https://github.com/antvis/S2/issues/309)) ([e5e961e](https://github.com/antvis/S2/commit/e5e961e306092c7ebabefa782a7ea54324656018))
* ✨ refactor the s2 based on new data-process ([#235](https://github.com/antvis/S2/issues/235)) ([31dd6a0](https://github.com/antvis/S2/commit/31dd6a0b9c96065b0f2bebb71fdb645b1d75db54)), closes [#7](https://github.com/antvis/S2/issues/7) [#10](https://github.com/antvis/S2/issues/10) [#12](https://github.com/antvis/S2/issues/12) [#13](https://github.com/antvis/S2/issues/13) [#16](https://github.com/antvis/S2/issues/16) [#17](https://github.com/antvis/S2/issues/17) [#11](https://github.com/antvis/S2/issues/11) [#19](https://github.com/antvis/S2/issues/19) [#18](https://github.com/antvis/S2/issues/18) [#21](https://github.com/antvis/S2/issues/21) [#23](https://github.com/antvis/S2/issues/23) [#20](https://github.com/antvis/S2/issues/20) [#24](https://github.com/antvis/S2/issues/24) [#20](https://github.com/antvis/S2/issues/20) [#26](https://github.com/antvis/S2/issues/26) [#27](https://github.com/antvis/S2/issues/27) [#28](https://github.com/antvis/S2/issues/28) [#29](https://github.com/antvis/S2/issues/29) [#35](https://github.com/antvis/S2/issues/35) [#37](https://github.com/antvis/S2/issues/37) [#38](https://github.com/antvis/S2/issues/38) [#39](https://github.com/antvis/S2/issues/39) [#42](https://github.com/antvis/S2/issues/42) [#43](https://github.com/antvis/S2/issues/43) [#44](https://github.com/antvis/S2/issues/44) [#45](https://github.com/antvis/S2/issues/45) [#47](https://github.com/antvis/S2/issues/47) [#46](https://github.com/antvis/S2/issues/46) [#48](https://github.com/antvis/S2/issues/48) [#32](https://github.com/antvis/S2/issues/32) [#31](https://github.com/antvis/S2/issues/31) [#49](https://github.com/antvis/S2/issues/49) [#32](https://github.com/antvis/S2/issues/32) [#31](https://github.com/antvis/S2/issues/31) [#50](https://github.com/antvis/S2/issues/50) [#51](https://github.com/antvis/S2/issues/51) [#52](https://github.com/antvis/S2/issues/52) [#55](https://github.com/antvis/S2/issues/55) [#57](https://github.com/antvis/S2/issues/57) [#58](https://github.com/antvis/S2/issues/58) [#59](https://github.com/antvis/S2/issues/59) [#14](https://github.com/antvis/S2/issues/14) [#30](https://github.com/antvis/S2/issues/30) [#60](https://github.com/antvis/S2/issues/60) [#61](https://github.com/antvis/S2/issues/61) [#64](https://github.com/antvis/S2/issues/64) [#65](https://github.com/antvis/S2/issues/65) [#69](https://github.com/antvis/S2/issues/69) [#70](https://github.com/antvis/S2/issues/70) [#71](https://github.com/antvis/S2/issues/71) [#70](https://github.com/antvis/S2/issues/70) [#70](https://github.com/antvis/S2/issues/70) [#72](https://github.com/antvis/S2/issues/72) [#73](https://github.com/antvis/S2/issues/73) [#74](https://github.com/antvis/S2/issues/74) [#75](https://github.com/antvis/S2/issues/75) [#76](https://github.com/antvis/S2/issues/76) [#82](https://github.com/antvis/S2/issues/82) [#85](https://github.com/antvis/S2/issues/85) [#91](https://github.com/antvis/S2/issues/91) [#81](https://github.com/antvis/S2/issues/81) [#94](https://github.com/antvis/S2/issues/94) [#95](https://github.com/antvis/S2/issues/95) [#100](https://github.com/antvis/S2/issues/100) [#99](https://github.com/antvis/S2/issues/99) [#101](https://github.com/antvis/S2/issues/101) [#107](https://github.com/antvis/S2/issues/107) [#108](https://github.com/antvis/S2/issues/108) [#109](https://github.com/antvis/S2/issues/109) [#112](https://github.com/antvis/S2/issues/112) [#114](https://github.com/antvis/S2/issues/114) [#115](https://github.com/antvis/S2/issues/115) [#116](https://github.com/antvis/S2/issues/116) [#117](https://github.com/antvis/S2/issues/117) [#119](https://github.com/antvis/S2/issues/119) [#121](https://github.com/antvis/S2/issues/121) [#122](https://github.com/antvis/S2/issues/122) [#124](https://github.com/antvis/S2/issues/124) [#125](https://github.com/antvis/S2/issues/125) [#123](https://github.com/antvis/S2/issues/123) [#120](https://github.com/antvis/S2/issues/120) [#126](https://github.com/antvis/S2/issues/126) [#128](https://github.com/antvis/S2/issues/128) [#130](https://github.com/antvis/S2/issues/130) [#129](https://github.com/antvis/S2/issues/129) [#113](https://github.com/antvis/S2/issues/113) [#132](https://github.com/antvis/S2/issues/132) [#135](https://github.com/antvis/S2/issues/135) [#138](https://github.com/antvis/S2/issues/138) [#118](https://github.com/antvis/S2/issues/118) [#139](https://github.com/antvis/S2/issues/139) [#118](https://github.com/antvis/S2/issues/118) [#142](https://github.com/antvis/S2/issues/142) [#143](https://github.com/antvis/S2/issues/143) [#137](https://github.com/antvis/S2/issues/137) [#136](https://github.com/antvis/S2/issues/136) [#148](https://github.com/antvis/S2/issues/148) [#146](https://github.com/antvis/S2/issues/146) [#149](https://github.com/antvis/S2/issues/149) [#152](https://github.com/antvis/S2/issues/152) [#153](https://github.com/antvis/S2/issues/153) [#155](https://github.com/antvis/S2/issues/155) [#156](https://github.com/antvis/S2/issues/156) [#151](https://github.com/antvis/S2/issues/151) [#157](https://github.com/antvis/S2/issues/157) [#154](https://github.com/antvis/S2/issues/154) [#160](https://github.com/antvis/S2/issues/160) [#162](https://github.com/antvis/S2/issues/162) [#164](https://github.com/antvis/S2/issues/164) [#158](https://github.com/antvis/S2/issues/158) [#167](https://github.com/antvis/S2/issues/167) [#170](https://github.com/antvis/S2/issues/170) [#165](https://github.com/antvis/S2/issues/165) [#171](https://github.com/antvis/S2/issues/171) [#163](https://github.com/antvis/S2/issues/163) [#174](https://github.com/antvis/S2/issues/174) [#172](https://github.com/antvis/S2/issues/172) [#175](https://github.com/antvis/S2/issues/175) [#173](https://github.com/antvis/S2/issues/173) [#179](https://github.com/antvis/S2/issues/179) [#183](https://github.com/antvis/S2/issues/183) [#182](https://github.com/antvis/S2/issues/182) [#180](https://github.com/antvis/S2/issues/180) [#184](https://github.com/antvis/S2/issues/184) [#185](https://github.com/antvis/S2/issues/185) [#181](https://github.com/antvis/S2/issues/181) [#178](https://github.com/antvis/S2/issues/178) [#192](https://github.com/antvis/S2/issues/192) [#189](https://github.com/antvis/S2/issues/189) [#190](https://github.com/antvis/S2/issues/190) [#194](https://github.com/antvis/S2/issues/194) [#197](https://github.com/antvis/S2/issues/197) [#196](https://github.com/antvis/S2/issues/196) [#203](https://github.com/antvis/S2/issues/203) [#207](https://github.com/antvis/S2/issues/207) [#204](https://github.com/antvis/S2/issues/204) [#206](https://github.com/antvis/S2/issues/206) [#208](https://github.com/antvis/S2/issues/208) [#202](https://github.com/antvis/S2/issues/202) [#201](https://github.com/antvis/S2/issues/201) [#209](https://github.com/antvis/S2/issues/209) [#200](https://github.com/antvis/S2/issues/200) [#210](https://github.com/antvis/S2/issues/210) [#211](https://github.com/antvis/S2/issues/211) [#214](https://github.com/antvis/S2/issues/214) [#213](https://github.com/antvis/S2/issues/213) [#212](https://github.com/antvis/S2/issues/212) [#216](https://github.com/antvis/S2/issues/216) [#217](https://github.com/antvis/S2/issues/217) [#218](https://github.com/antvis/S2/issues/218) [#219](https://github.com/antvis/S2/issues/219) [#221](https://github.com/antvis/S2/issues/221) [#222](https://github.com/antvis/S2/issues/222) [#223](https://github.com/antvis/S2/issues/223) [#227](https://github.com/antvis/S2/issues/227) [#228](https://github.com/antvis/S2/issues/228) [#231](https://github.com/antvis/S2/issues/231) [#234](https://github.com/antvis/S2/issues/234) [#230](https://github.com/antvis/S2/issues/230) [#233](https://github.com/antvis/S2/issues/233) [#230](https://github.com/antvis/S2/issues/230) [#236](https://github.com/antvis/S2/issues/236)
* 🔖 publish v0.1.3 ([#257](https://github.com/antvis/S2/issues/257)) ([92e452a](https://github.com/antvis/S2/commit/92e452ab6fef1bd4b3a3ed0e424e405e362ce425)), closes [#238](https://github.com/antvis/S2/issues/238) [#237](https://github.com/antvis/S2/issues/237) [#7](https://github.com/antvis/S2/issues/7) [#10](https://github.com/antvis/S2/issues/10) [#12](https://github.com/antvis/S2/issues/12) [#13](https://github.com/antvis/S2/issues/13) [#16](https://github.com/antvis/S2/issues/16) [#17](https://github.com/antvis/S2/issues/17) [#11](https://github.com/antvis/S2/issues/11) [#19](https://github.com/antvis/S2/issues/19) [#18](https://github.com/antvis/S2/issues/18) [#21](https://github.com/antvis/S2/issues/21) [#23](https://github.com/antvis/S2/issues/23) [#20](https://github.com/antvis/S2/issues/20) [#24](https://github.com/antvis/S2/issues/24) [#20](https://github.com/antvis/S2/issues/20) [#26](https://github.com/antvis/S2/issues/26) [#27](https://github.com/antvis/S2/issues/27) [#28](https://github.com/antvis/S2/issues/28) [#29](https://github.com/antvis/S2/issues/29) [#35](https://github.com/antvis/S2/issues/35) [#37](https://github.com/antvis/S2/issues/37) [#38](https://github.com/antvis/S2/issues/38) [#39](https://github.com/antvis/S2/issues/39) [#42](https://github.com/antvis/S2/issues/42) [#43](https://github.com/antvis/S2/issues/43) [#44](https://github.com/antvis/S2/issues/44) [#45](https://github.com/antvis/S2/issues/45) [#47](https://github.com/antvis/S2/issues/47) [#46](https://github.com/antvis/S2/issues/46) [#48](https://github.com/antvis/S2/issues/48) [#32](https://github.com/antvis/S2/issues/32) [#31](https://github.com/antvis/S2/issues/31) [#49](https://github.com/antvis/S2/issues/49) [#32](https://github.com/antvis/S2/issues/32) [#31](https://github.com/antvis/S2/issues/31) [#50](https://github.com/antvis/S2/issues/50) [#51](https://github.com/antvis/S2/issues/51) [#52](https://github.com/antvis/S2/issues/52) [#55](https://github.com/antvis/S2/issues/55) [#57](https://github.com/antvis/S2/issues/57) [#58](https://github.com/antvis/S2/issues/58) [#59](https://github.com/antvis/S2/issues/59) [#14](https://github.com/antvis/S2/issues/14) [#30](https://github.com/antvis/S2/issues/30) [#60](https://github.com/antvis/S2/issues/60) [#61](https://github.com/antvis/S2/issues/61) [#64](https://github.com/antvis/S2/issues/64) [#65](https://github.com/antvis/S2/issues/65) [#69](https://github.com/antvis/S2/issues/69) [#70](https://github.com/antvis/S2/issues/70) [#71](https://github.com/antvis/S2/issues/71) [#70](https://github.com/antvis/S2/issues/70) [#70](https://github.com/antvis/S2/issues/70) [#72](https://github.com/antvis/S2/issues/72) [#73](https://github.com/antvis/S2/issues/73) [#74](https://github.com/antvis/S2/issues/74) [#75](https://github.com/antvis/S2/issues/75) [#76](https://github.com/antvis/S2/issues/76) [#82](https://github.com/antvis/S2/issues/82) [#85](https://github.com/antvis/S2/issues/85) [#91](https://github.com/antvis/S2/issues/91) [#81](https://github.com/antvis/S2/issues/81) [#94](https://github.com/antvis/S2/issues/94) [#95](https://github.com/antvis/S2/issues/95) [#100](https://github.com/antvis/S2/issues/100) [#99](https://github.com/antvis/S2/issues/99) [#101](https://github.com/antvis/S2/issues/101) [#107](https://github.com/antvis/S2/issues/107) [#108](https://github.com/antvis/S2/issues/108) [#109](https://github.com/antvis/S2/issues/109) [#112](https://github.com/antvis/S2/issues/112) [#114](https://github.com/antvis/S2/issues/114) [#115](https://github.com/antvis/S2/issues/115) [#116](https://github.com/antvis/S2/issues/116) [#117](https://github.com/antvis/S2/issues/117) [#119](https://github.com/antvis/S2/issues/119) [#121](https://github.com/antvis/S2/issues/121) [#122](https://github.com/antvis/S2/issues/122) [#124](https://github.com/antvis/S2/issues/124) [#125](https://github.com/antvis/S2/issues/125) [#123](https://github.com/antvis/S2/issues/123) [#120](https://github.com/antvis/S2/issues/120) [#126](https://github.com/antvis/S2/issues/126) [#128](https://github.com/antvis/S2/issues/128) [#130](https://github.com/antvis/S2/issues/130) [#129](https://github.com/antvis/S2/issues/129) [#113](https://github.com/antvis/S2/issues/113) [#132](https://github.com/antvis/S2/issues/132) [#135](https://github.com/antvis/S2/issues/135) [#138](https://github.com/antvis/S2/issues/138) [#118](https://github.com/antvis/S2/issues/118) [#139](https://github.com/antvis/S2/issues/139) [#118](https://github.com/antvis/S2/issues/118) [#142](https://github.com/antvis/S2/issues/142) [#143](https://github.com/antvis/S2/issues/143) [#137](https://github.com/antvis/S2/issues/137) [#136](https://github.com/antvis/S2/issues/136) [#148](https://github.com/antvis/S2/issues/148) [#146](https://github.com/antvis/S2/issues/146) [#149](https://github.com/antvis/S2/issues/149) [#152](https://github.com/antvis/S2/issues/152) [#153](https://github.com/antvis/S2/issues/153) [#155](https://github.com/antvis/S2/issues/155) [#156](https://github.com/antvis/S2/issues/156) [#151](https://github.com/antvis/S2/issues/151) [#157](https://github.com/antvis/S2/issues/157) [#154](https://github.com/antvis/S2/issues/154) [#160](https://github.com/antvis/S2/issues/160) [#162](https://github.com/antvis/S2/issues/162) [#164](https://github.com/antvis/S2/issues/164) [#158](https://github.com/antvis/S2/issues/158) [#167](https://github.com/antvis/S2/issues/167) [#170](https://github.com/antvis/S2/issues/170) [#165](https://github.com/antvis/S2/issues/165) [#171](https://github.com/antvis/S2/issues/171) [#163](https://github.com/antvis/S2/issues/163) [#174](https://github.com/antvis/S2/issues/174) [#172](https://github.com/antvis/S2/issues/172) [#175](https://github.com/antvis/S2/issues/175) [#173](https://github.com/antvis/S2/issues/173) [#179](https://github.com/antvis/S2/issues/179) [#183](https://github.com/antvis/S2/issues/183) [#182](https://github.com/antvis/S2/issues/182) [#180](https://github.com/antvis/S2/issues/180) [#184](https://github.com/antvis/S2/issues/184) [#185](https://github.com/antvis/S2/issues/185) [#181](https://github.com/antvis/S2/issues/181) [#178](https://github.com/antvis/S2/issues/178) [#192](https://github.com/antvis/S2/issues/192) [#189](https://github.com/antvis/S2/issues/189) [#190](https://github.com/antvis/S2/issues/190) [#194](https://github.com/antvis/S2/issues/194) [#197](https://github.com/antvis/S2/issues/197) [#196](https://github.com/antvis/S2/issues/196) [#203](https://github.com/antvis/S2/issues/203) [#207](https://github.com/antvis/S2/issues/207) [#204](https://github.com/antvis/S2/issues/204) [#206](https://github.com/antvis/S2/issues/206) [#208](https://github.com/antvis/S2/issues/208) [#202](https://github.com/antvis/S2/issues/202) [#201](https://github.com/antvis/S2/issues/201) [#209](https://github.com/antvis/S2/issues/209) [#200](https://github.com/antvis/S2/issues/200) [#210](https://github.com/antvis/S2/issues/210) [#211](https://github.com/antvis/S2/issues/211) [#214](https://github.com/antvis/S2/issues/214) [#213](https://github.com/antvis/S2/issues/213) [#212](https://github.com/antvis/S2/issues/212) [#216](https://github.com/antvis/S2/issues/216) [#217](https://github.com/antvis/S2/issues/217) [#218](https://github.com/antvis/S2/issues/218) [#219](https://github.com/antvis/S2/issues/219) [#221](https://github.com/antvis/S2/issues/221) [#222](https://github.com/antvis/S2/issues/222) [#240](https://github.com/antvis/S2/issues/240) [#241](https://github.com/antvis/S2/issues/241) [#242](https://github.com/antvis/S2/issues/242) [#248](https://github.com/antvis/S2/issues/248) [#245](https://github.com/antvis/S2/issues/245) [#252](https://github.com/antvis/S2/issues/252) [#249](https://github.com/antvis/S2/issues/249)
* add doc for table ([#360](https://github.com/antvis/S2/issues/360)) ([a7ee65e](https://github.com/antvis/S2/commit/a7ee65e4f46a0e8253a756d6c2619166e36a8c8e))
* add group sort in col's values and refactor tooltip's style ([#284](https://github.com/antvis/S2/issues/284)) ([ad02d9d](https://github.com/antvis/S2/commit/ad02d9db301f6be34112ac99e6db2de48af4c2dc)), closes [#269](https://github.com/antvis/S2/issues/269) [#270](https://github.com/antvis/S2/issues/270) [#268](https://github.com/antvis/S2/issues/268) [#267](https://github.com/antvis/S2/issues/267) [#271](https://github.com/antvis/S2/issues/271) [#272](https://github.com/antvis/S2/issues/272) [#265](https://github.com/antvis/S2/issues/265) [#274](https://github.com/antvis/S2/issues/274) [#276](https://github.com/antvis/S2/issues/276) [#277](https://github.com/antvis/S2/issues/277) [#283](https://github.com/antvis/S2/issues/283)
* dimensions switcher ([#298](https://github.com/antvis/S2/issues/298)) ([f223319](https://github.com/antvis/S2/commit/f2233194850604f5245e7eb19ea61f3993a592fe)), closes [#269](https://github.com/antvis/S2/issues/269) [#270](https://github.com/antvis/S2/issues/270) [#268](https://github.com/antvis/S2/issues/268) [#267](https://github.com/antvis/S2/issues/267) [#271](https://github.com/antvis/S2/issues/271)
* **interaction:** hidden columns ([#296](https://github.com/antvis/S2/issues/296)) ([f5f4a69](https://github.com/antvis/S2/commit/f5f4a69dbd2b436f36e874323115d54af9f0aa16))
* **interaction:** select interaction imporement ([#324](https://github.com/antvis/S2/issues/324)) ([6b5479d](https://github.com/antvis/S2/commit/6b5479d9cb9718ce0c657277ef2ad30c56b8ded7))
* refactor switcher component ([#380](https://github.com/antvis/S2/issues/380)) ([f5c2993](https://github.com/antvis/S2/commit/f5c2993801d4f2b0d09ecaf4b8f751deefbac0d0))
* select all ([#348](https://github.com/antvis/S2/issues/348)) ([334aac4](https://github.com/antvis/S2/commit/334aac41ac9511c3b417a7006591fdbf138ab618)), closes [#342](https://github.com/antvis/S2/issues/342) [#339](https://github.com/antvis/S2/issues/339)

# [0.1.0-alpha.15](https://github.com/antvis/S2/compare/e1937df32e2d2bb70bdba298adb8d7209658e3e9...v0.1.0-alpha.15) (2021-08-02)

### Bug Fixes

* 🐛 do not handle tooltip options when using the custom tooltip ([#80](https://github.com/antvis/S2/issues/80)) ([77456eb](https://github.com/antvis/S2/commit/77456eb40098d758db3576c6292d264565afbb33))
* 🐛 fix the min dragging width for the adaptive mode ([#110](https://github.com/antvis/S2/issues/110)) ([c854bc8](https://github.com/antvis/S2/commit/c854bc81674e6ea2e16a4e75fdc5ea89bdd455a1))
* 🐛 replace function names with the constant map ([#84](https://github.com/antvis/S2/issues/84)) ([a0c7a21](https://github.com/antvis/S2/commit/a0c7a210e5dceddd1c33fef03d7ecd6bbe12c1c0))
* 🐛 rollback the version of jest ([#111](https://github.com/antvis/S2/issues/111)) ([61c517f](https://github.com/antvis/S2/commit/61c517f40d29bb9dcb4c79076cff0388afb3cd1e))

### Features

* :heavy_plus_sign: add gitmoji-cli ([e5dc17d](https://github.com/antvis/S2/commit/e5dc17d23586a2f632318c12634183dc94d7cd12))
* ✨ v0.1.0 ([#66](https://github.com/antvis/S2/issues/66)) ([a8cff41](https://github.com/antvis/S2/commit/a8cff413a15a4c050c82e87808e9ec2af8eb576d)), closes [#7](https://github.com/antvis/S2/issues/7) [#10](https://github.com/antvis/S2/issues/10) [#12](https://github.com/antvis/S2/issues/12) [#13](https://github.com/antvis/S2/issues/13) [#16](https://github.com/antvis/S2/issues/16) [#17](https://github.com/antvis/S2/issues/17) [#11](https://github.com/antvis/S2/issues/11) [#19](https://github.com/antvis/S2/issues/19) [#18](https://github.com/antvis/S2/issues/18) [#21](https://github.com/antvis/S2/issues/21) [#23](https://github.com/antvis/S2/issues/23) [#20](https://github.com/antvis/S2/issues/20) [#24](https://github.com/antvis/S2/issues/24) [#20](https://github.com/antvis/S2/issues/20) [#26](https://github.com/antvis/S2/issues/26) [#27](https://github.com/antvis/S2/issues/27) [#28](https://github.com/antvis/S2/issues/28) [#29](https://github.com/antvis/S2/issues/29) [#35](https://github.com/antvis/S2/issues/35) [#37](https://github.com/antvis/S2/issues/37) [#38](https://github.com/antvis/S2/issues/38) [#39](https://github.com/antvis/S2/issues/39) [#42](https://github.com/antvis/S2/issues/42) [#43](https://github.com/antvis/S2/issues/43) [#44](https://github.com/antvis/S2/issues/44) [#45](https://github.com/antvis/S2/issues/45) [#47](https://github.com/antvis/S2/issues/47) [#46](https://github.com/antvis/S2/issues/46) [#48](https://github.com/antvis/S2/issues/48) [#32](https://github.com/antvis/S2/issues/32) [#31](https://github.com/antvis/S2/issues/31) [#49](https://github.com/antvis/S2/issues/49) [#32](https://github.com/antvis/S2/issues/32) [#31](https://github.com/antvis/S2/issues/31) [#50](https://github.com/antvis/S2/issues/50) [#51](https://github.com/antvis/S2/issues/51) [#52](https://github.com/antvis/S2/issues/52) [#55](https://github.com/antvis/S2/issues/55) [#57](https://github.com/antvis/S2/issues/57) [#58](https://github.com/antvis/S2/issues/58) [#59](https://github.com/antvis/S2/issues/59) [#14](https://github.com/antvis/S2/issues/14) [#30](https://github.com/antvis/S2/issues/30) [#60](https://github.com/antvis/S2/issues/60) [#61](https://github.com/antvis/S2/issues/61) [#64](https://github.com/antvis/S2/issues/64) [#65](https://github.com/antvis/S2/issues/65)
* add basic configurations ([e1937df](https://github.com/antvis/S2/commit/e1937df32e2d2bb70bdba298adb8d7209658e3e9))
* add docs ([7eef384](https://github.com/antvis/S2/commit/7eef38427028d0edb595119224f4ee6bb3549b14))
* add new rules of eslint and package ([abe0342](https://github.com/antvis/S2/commit/abe0342078379f92315ceba648234740fa12409b))
* add quick start ([08da33e](https://github.com/antvis/S2/commit/08da33e01679a76e48a3e52466fc66401b5522ed))
* site init ([6f6f4e4](https://github.com/antvis/S2/commit/6f6f4e4c4c7ecf12e3bd2bfe985aeed0349b0827))

### Reverts

* Revert "chore: :wrench: add git actions and update configuration files" (#4) ([4861d46](https://github.com/antvis/S2/commit/4861d460410e26fecec3974adf2a8efebb39ac6f)), closes [#4](https://github.com/antvis/S2/issues/4)
