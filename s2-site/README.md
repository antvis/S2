# S2 官网

- 老官网：<https://s2.antv.vision>
- 新官网 （推荐）：<https://s2.antv.antgroup.com>

## 开发

```bash
# 安装依赖
yarn

# 调试
yarn start
```

## 发布

记得将 `package.json` 对应的 `@antv/s2` 和 `@antv/s2-react` **更新到最新版本**, 并将更新后的 `yarn.lock` 提交上来。

```bash
yarn deploy
```

## 内容建设

- 参数配置说明请参考 [Dumi Theme for AntV](https://github.com/antvis/dumi-theme-antv)

- 具体用法请参考 [Dumi 官网](https://d.umijs.org/)

## 文档编写

- API 文档参考示例： `./docs/api/general/dataCfg.zh.md`
- 公共部分都放在 common 目录，方便引用。
- 教程文档可以适当插入 live demo，参考 `./docs/manual/getting-started.zh.md`
- 英文版都先简单引用一份中文文档即可

## Demo 调试

- 参考示例：`./examples/sheets/pivot`
- 新增加的 demo 需要到 `./gatsby-config.js` 增加 example 的对应配置
- 目录说明：

  ```bash
  pivot
  ├── demo
  │   ├── grid.ts               # 平铺模式示例代码
  │   ├── tree.ts               # 树状模式示例代码
  │   └── meta.json             # gallery 信息
  ├── API.zh.md                 # 右侧 api 文档中文版，请根据右侧文档目录解析出来的层级顺序调整格式
  ├── API.en.md                 # 右侧 api 文档英文版（直接引用英文即可）
  ├── design.zh.md              # 中文设计指引，没有可不创建
  ├── design.en.md              # 英文设计指引，没有可不创建
  ├── index.zh.md               # 中文版左侧快捷菜单顺序和标题（必须创建，需要解析改文件创建对应 demo 页面）
  └── index.en.md               # 英文版左侧快捷菜单顺序和标题

  ```

- 热更新没有特别灵敏，如果没有时时更新请手动重刷或重启服务
