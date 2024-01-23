跃跃欲试想贡献？[查看贡献指南](https://s2.antv.antgroup.com/manual/contribution) , 欢迎 [Pull Request](https://github.com/antvis/S2/pulls)，或给我们 [报告 Bug](https://github.com/antvis/S2/issues/new?assignees=&labels=&projects=&template=bug-report.md&title=%F0%9F%90%9B).

> 强烈建议花一点你的宝贵时间阅读：

- [《提 Issue 前必读》](https://github.com/antvis/S2/issues/1904)
- [《如何向开源项目提交无法解答的问题》](https://zhuanlan.zhihu.com/p/25795393)
- [《如何有效地报告 Bug》](https://www.chiark.greenend.org.uk/~sgtatham/bugs-cn.html)
- [《提问的智慧》](https://github.com/ryanhanwu/How-To-Ask-Questions-The-Smart-Way)
- [《如何向开源社区提问题》](https://github.com/seajs/seajs/issues/545)

> S2 使用 pnpm 作为包管理器

```bash
git clone git@github.com:antvis/S2.git

cd S2

# 安装依赖
pnpm install # 或者 pnpm bootstrap

# 打包
pnpm build

# 调试 s2-core
pnpm core:start

# 调试 s2-react
pnpm react:playground

# 调试 s2-vue
pnpm vue:playground

# 单元测试
pnpm test

# 代码风格和类型检测
pnpm lint

# 本地启动官网
pnpm site:start
```
