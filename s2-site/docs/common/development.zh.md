跃跃欲试想贡献？[查看贡献指南](https://s2.antv.antgroup.com/manual/contribution) , 欢迎 [Pull Request](https://github.com/antvis/S2/pulls)，或给我们 [报告 Bug](https://github.com/antvis/S2/issues/new?assignees=&labels=&projects=&template=bug-report.md&title=%F0%9F%90%9B).

> 强烈建议花一点你的宝贵时间阅读：

- [《提 Issue 前必读》](https://github.com/antvis/S2/issues/1904)
- [《如何向开源项目提交无法解答的问题》](https://zhuanlan.zhihu.com/p/25795393)
- [《如何有效地报告 Bug》](https://www.chiark.greenend.org.uk/~sgtatham/bugs-cn.html)
- [《提问的智慧》](https://github.com/ryanhanwu/How-To-Ask-Questions-The-Smart-Way)
- [《如何向开源社区提问题》](https://github.com/seajs/seajs/issues/545)

```bash
git clone git@github.com:antvis/S2.git

cd S2

# 安装依赖
yarn # 或者 yarn bootstrap

# 调试 s2-core
yarn core:start

# 调试 s2-react
yarn react:playground

# 调试 s2-vue
yarn vue:playground

# 单元测试
yarn test

# 打包
yarn build

# 代码风格和类型检测
yarn lint

# 本地启动官网
yarn site:bootstrap
yarn site:start
```
