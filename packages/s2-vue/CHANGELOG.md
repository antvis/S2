# [@antv/s2-vue-v1.6.0](https://github.com/antvis/S2/compare/@antv/s2-vue-v1.5.0...@antv/s2-vue-v1.6.0) (2023-12-15)


### Features

* **perf:** 优化 dataset 数据结构转化，以及交互过程中 layout性能 ([#2476](https://github.com/antvis/S2/issues/2476)) ([6fa8fbb](https://github.com/antvis/S2/commit/6fa8fbb054dc1dd9964b33a5ac8ec0d7fbee723e))

# [@antv/s2-vue-v1.5.0](https://github.com/antvis/S2/compare/@antv/s2-vue-v1.4.0...@antv/s2-vue-v1.5.0) (2022-12-09)


### Bug Fixes

* **tooltip:** 修复自定义操作菜单传入自定义 ReactNode 不显示 ([#1969](https://github.com/antvis/S2/issues/1969)) ([3eff993](https://github.com/antvis/S2/commit/3eff9932438cc95093686c03510b57648ff44391))


### Features

* 暴露afterRealCellRender，这样能够更灵活的使用datacell ([#1970](https://github.com/antvis/S2/issues/1970)) ([66c5ab9](https://github.com/antvis/S2/commit/66c5ab9992c51b475be8acaf9a198d49f3114a49))

# [@antv/s2-vue-v1.4.0](https://github.com/antvis/S2/compare/@antv/s2-vue-v1.3.0...@antv/s2-vue-v1.4.0) (2022-10-24)


### Features

* 组件层新增 onMounted 事件 ([#1830](https://github.com/antvis/S2/issues/1830)) ([0758160](https://github.com/antvis/S2/commit/0758160833c6be06c96dc851cab4605dd709e8ad))


### Reverts

* Revert "chore(release): 🔖@antv/s2@1.32.0 @antv/s2-react@1.29.0 @antv/s2-vue@1…" (#1846) ([7b0bcea](https://github.com/antvis/S2/commit/7b0bceab42acf8dae4a437f86148207848502c8b)), closes [#1846](https://github.com/antvis/S2/issues/1846) [#1844](https://github.com/antvis/S2/issues/1844)

# [@antv/s2-vue-v1.3.0](https://github.com/antvis/S2/compare/@antv/s2-vue-v1.2.2...@antv/s2-vue-v1.3.0) (2022-09-05)


### Bug Fixes

* **types:** 修复严格模式下 S2Options 类型报错 ([#1723](https://github.com/antvis/S2/issues/1723)) ([ef55f55](https://github.com/antvis/S2/commit/ef55f559f940614b19f76fbc5c941e114f220461))


### Features

* 导出组件层CustomTooltip类 ([#1726](https://github.com/antvis/S2/issues/1726)) ([46270ab](https://github.com/antvis/S2/commit/46270ab0ae6e42cf92dcf77c0a35a70e07b9b10c))

# [@antv/s2-vue-v1.2.2](https://github.com/antvis/S2/compare/@antv/s2-vue-v1.2.1...@antv/s2-vue-v1.2.2) (2022-08-29)


### Bug Fixes

* **pagination:** 透传组件分页参数 & 修复国际化不生效 close [#1697](https://github.com/antvis/S2/issues/1697) ([#1698](https://github.com/antvis/S2/issues/1698)) ([be334fc](https://github.com/antvis/S2/commit/be334fcef6a11d08358f007eba805cbd380560d5))

# [@antv/s2-vue-v1.2.1](https://github.com/antvis/S2/compare/@antv/s2-vue-v1.2.0...@antv/s2-vue-v1.2.1) (2022-08-05)


### Bug Fixes

* 修复pivot模式 cell点击事件无法触发BUG ([#1623](https://github.com/antvis/S2/issues/1623)) ([a9172a0](https://github.com/antvis/S2/commit/a9172a04c32d8b02a258e2ac2650970ea3f241e5))

# [@antv/s2-vue-v1.2.0](https://github.com/antvis/S2/compare/@antv/s2-vue-v1.1.0...@antv/s2-vue-v1.2.0) (2022-07-22)


### Bug Fixes

* s2-vue 保持和react组件一致的tooltip summary渲染逻辑 ([#1576](https://github.com/antvis/S2/issues/1576)) ([32135f7](https://github.com/antvis/S2/commit/32135f7f5a3cb2be8183d313bccdfaef2d3ceebd))
* **s2-vue:** 修复表头排序交互不起作用的问题 ([#1559](https://github.com/antvis/S2/issues/1559)) ([4008894](https://github.com/antvis/S2/commit/40088947f3dd959e6d09e052076b2071653d5710))
* 去除 vue prop warning 信息 ([#1555](https://github.com/antvis/S2/issues/1555)) ([d703737](https://github.com/antvis/S2/commit/d7037377ff1c47ad858fe7225c2229344c8b7092))


### Features

* 增加允许/禁用指标在行列维度中相互切换的能力 ([#1558](https://github.com/antvis/S2/issues/1558)) ([39f0f89](https://github.com/antvis/S2/commit/39f0f89cc999313d55077c06f72da13dab1f1316))

# [@antv/s2-vue-v1.1.0](https://github.com/antvis/S2/compare/@antv/s2-vue-v1.0.2...@antv/s2-vue-v1.1.0) (2022-06-24)


### Bug Fixes

* **strategysheet:** 修复趋势分析表多列头切换为单列头后, 隐藏列头功能失效 ([#1470](https://github.com/antvis/S2/issues/1470)) ([b39742e](https://github.com/antvis/S2/commit/b39742e3a7276836c504f2a0d5343ff201a65bba))


### Features

* **interaction:** 增加行头单元格和全局单元格滚动事件及文档 ([#1483](https://github.com/antvis/S2/issues/1483)) ([329aaa6](https://github.com/antvis/S2/commit/329aaa6c9f9ae926f392e3e8f676af1ec201cce2))
* **interaction:** 添加 onDataCellSelectMove 事件 ([#1468](https://github.com/antvis/S2/issues/1468)) ([da2a78e](https://github.com/antvis/S2/commit/da2a78ec511a85380824fa2b7147854e857df7f3))
* s2-vue 添加下钻组件 ([#1471](https://github.com/antvis/S2/issues/1471)) ([7f42b82](https://github.com/antvis/S2/commit/7f42b82264230f4b914adc39277e8ca6fbcf0cd3))

# [@antv/s2-vue-v1.0.2](https://github.com/antvis/S2/compare/@antv/s2-vue-v1.0.1...@antv/s2-vue-v1.0.2) (2022-06-17)


### Bug Fixes

* 修复打包core层源码中样式文件错误问题 ([#1408](https://github.com/antvis/S2/issues/1408)) ([d2c0894](https://github.com/antvis/S2/commit/d2c08949d22dc61dbc73e01a779756e1d7a78fb6))

# [@antv/s2-vue-v1.0.1](https://github.com/antvis/S2/compare/@antv/s2-vue-v1.0.0...@antv/s2-vue-v1.0.1) (2022-06-02)


### Bug Fixes

* **locale:** 修复国际化配置不生效 close [#1394](https://github.com/antvis/S2/issues/1394) ([#1397](https://github.com/antvis/S2/issues/1397)) ([cfd5dbe](https://github.com/antvis/S2/commit/cfd5dbe0344afbb6f3929bece1778c02f9bbc00b))
* **vue:** 统一表组件变量名保持和 react 版本一致 Sheet => SheetComponent ([#1389](https://github.com/antvis/S2/issues/1389)) ([0bee476](https://github.com/antvis/S2/commit/0bee4767ecfbe9b87c71f4f52b5569f13bb58686))

# @antv/s2-vue-v1.0.0 (2022-05-30)


### Features

* Vue 1.0 ([#1290](https://github.com/antvis/S2/issues/1290)) ([0745836](https://github.com/antvis/S2/commit/07458368d7eafd3ddee168d5b2adca463374ab5a))


### Reverts

* Revert "chore(release): @antv/s2@1.18.0 @antv/s2-react@1.16.0 @antv/s2-vue@1.0.0 (#1384)" (#1386) ([60cdf6a](https://github.com/antvis/S2/commit/60cdf6abe7fb3b44f831051bd55622587a0f5bf8)), closes [#1384](https://github.com/antvis/S2/issues/1384) [#1386](https://github.com/antvis/S2/issues/1386)
