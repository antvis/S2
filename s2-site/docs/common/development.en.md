Eager to contribute? [View contribution guidelines](https://s2.antv.antgroup.com/manual/contribution)

> S2 uses pnpm as package manager

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
pnpm react:Playground

# 调试 s2-vue
pnpm vue:Playground

# 单元测试
pnpm test

# 代码风格和类型检测
pnpm lint

# 本地启动官网
pnpm site:start
```
