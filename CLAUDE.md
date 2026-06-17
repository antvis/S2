# S2 v3 AI Agent / Claude Code Instructions

## 项目概况

S2 v3 是 AI native 分析表格计算引擎。Monorepo 结构：
- `packages/s2` — 主包（Core Model + Operation Engine + Layout + Canvas + Renderer + 所有 Module）
- `packages/s2-react` — React 绑定
- `examples/` — HTML demo

## 架构原则（不可违反）

1. **依赖方向单向**：`core → layout → canvas → framework bindings`。Modules 可依赖 core/layout types，反过来不行。
2. **所有状态变更通过 Operation**。不直接修改 Model。
3. **单一 Sheet 类型**。透视表作为 Module 写入普通 cell，下游层不区分数据来源。
4. **Headless first**。`src/core/` 不 import `src/canvas/` 的任何文件。
5. **Module 通过 Query Layer 暴露数据**，消费方不直接引用 Module 内部类型。

## 源码结构

```
packages/s2/src/
├── core/           # WorkbookModel, Sparse 存储, 类型定义
├── operation/      # OperationEngine, OperationRegistry, 内置 operations
├── query/          # QueryLayer, ChangeSet 缓存失效
├── module/         # ModuleRegistry, ModuleDefinition 类型
├── modules/        # 内置 Module (pivot, formula, filter, sort, freeze, edit, conditional-format, agent)
├── mcp/            # MCP Server adapter (@antv/s2/mcp subpath export)
├── facade/         # Facade API (createPivotTable / createTable 链式调用)
├── layout/         # LayoutEngine, PrefixSumArray, LayoutPlan 类型, HierarchyLayout
├── canvas/         # CanvasRuntime, mountCanvas
├── renderer/       # renderFrame (detail + hierarchy 两条路径)
├── interaction/    # InteractionEngine, hitTest, 状态机
└── index.ts        # 公共导出
```

## 关键类型位置

- `HierarchyLayout` / `HierarchyTreeNode` → `layout/types.ts`（canonical 定义）
- `LayoutPlan` → `layout/types.ts`（包含 `headerArea`, `hierarchyRowHeaders`, `cornerHeaders` 等）
- `CellRendererFn` / `CellRenderContext` → `module/types.ts`
- `RenderState` → `renderer/frame.ts`
- 布局常量 `DETAIL_HEADER_WIDTH` 等 → `layout/types.ts`（统一来源）

## 代码规范

- TypeScript strict mode
- 不加注释，除非解释 WHY
- 不加不需要的抽象
- Module query 签名：`(state, params, model) => unknown`
- Operation execute 签名：`(model, payload) => inverseOps[]`
- 空 inverse = 不进 undo 栈

## 测试

```bash
cd packages/s2
npx vitest run          # 运行全部测试
npx tsc --noEmit        # 类型检查
```

测试文件在 `packages/s2/tests/`。每个 Module 有独立测试文件。

## npm registry

安装依赖：`pnpm install`
