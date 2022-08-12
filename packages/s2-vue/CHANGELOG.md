# [@antv/s2-vue-v1.3.0-alpha.1](https://github.com/antvis/S2/compare/@antv/s2-vue-v1.2.1...@antv/s2-vue-v1.3.0-alpha.1) (2022-08-12)


### Features

* 趋势分析表支持配置图标条件 ([#1683](https://github.com/antvis/S2/issues/1683)) ([2137372](https://github.com/antvis/S2/commit/213737269d8453d8fa2af6f7d589005b3d331064)), closes [#1590](https://github.com/antvis/S2/issues/1590) [#1583](https://github.com/antvis/S2/issues/1583) [#1571](https://github.com/antvis/S2/issues/1571) [#1599](https://github.com/antvis/S2/issues/1599) [#1594](https://github.com/antvis/S2/issues/1594) [#1601](https://github.com/antvis/S2/issues/1601) [#1606](https://github.com/antvis/S2/issues/1606) [#1607](https://github.com/antvis/S2/issues/1607) [#1610](https://github.com/antvis/S2/issues/1610) [#1611](https://github.com/antvis/S2/issues/1611) [#1618](https://github.com/antvis/S2/issues/1618) [#1616](https://github.com/antvis/S2/issues/1616) [#1640](https://github.com/antvis/S2/issues/1640) [#1644](https://github.com/antvis/S2/issues/1644) [#1633](https://github.com/antvis/S2/issues/1633) [#1647](https://github.com/antvis/S2/issues/1647) [#1638](https://github.com/antvis/S2/issues/1638) [#1623](https://github.com/antvis/S2/issues/1623) [#1649](https://github.com/antvis/S2/issues/1649) [#1622](https://github.com/antvis/S2/issues/1622) [#1646](https://github.com/antvis/S2/issues/1646) [#1622](https://github.com/antvis/S2/issues/1622) [#1650](https://github.com/antvis/S2/issues/1650) [#1654](https://github.com/antvis/S2/issues/1654) [#1652](https://github.com/antvis/S2/issues/1652) [#1655](https://github.com/antvis/S2/issues/1655) [#1653](https://github.com/antvis/S2/issues/1653) [#1661](https://github.com/antvis/S2/issues/1661) [#1664](https://github.com/antvis/S2/issues/1664) [#1673](https://github.com/antvis/S2/issues/1673) [#1675](https://github.com/antvis/S2/issues/1675) [#1678](https://github.com/antvis/S2/issues/1678) [#1677](https://github.com/antvis/S2/issues/1677)

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
