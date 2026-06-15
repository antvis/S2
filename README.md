# AntV S2 3.0

AI native 分析表格计算引擎。

## 架构

```
┌─────────────────────────────────────────────────┐
│  Framework Bindings (React / Vue)                │
├─────────────────────────────────────────────────┤
│  Canvas Runtime + Renderer                       │
├─────────────────────────────────────────────────┤
│  Interaction Engine                              │
├─────────────────────────────────────────────────┤
│  Layout Engine                                   │
├─────────────────────────────────────────────────┤
│  Capability Modules (Pivot/Formula/Filter/...)   │
├─────────────────────────────────────────────────┤
│  Operation Engine + Query Layer                  │
├─────────────────────────────────────────────────┤
│  Core Model (Workbook/Sheet/Cell)                │
└─────────────────────────────────────────────────┘
```

## 快速开始

```typescript
import { createWorkbook, PivotModule, mountCanvas } from '@antv/s2';

const workbook = createWorkbook({ modules: [PivotModule] });
workbook.registerDataSource('sales', records);
workbook.apply([{
  type: 'pivot.setConfig',
  payload: {
    sheet: 0,
    dataSourceId: 'sales',
    rows: ['province', 'city'],
    columns: ['type'],
    values: ['price'],
    valueAggregation: { price: 'SUM' },
  },
}]);

mountCanvas(workbook, document.getElementById('app'));
```

## Headless 模式

```typescript
const workbook = createWorkbook({ modules: [PivotModule] });
workbook.registerDataSource('data', records);
workbook.apply([{ type: 'pivot.setConfig', payload: { ... } }]);

const value = workbook.query.getCellDisplayValue({ sheet: 0, row: 0, col: 0 });
const csv = workbook.exportCSV();
const json = workbook.toJSON();
```

## 内置 Modules

| Module | 功能 |
|---|---|
| `PivotModule` | 透视表聚合、多层级行列树、下钻、小计/总计 |
| `FormulaModule` | 公式计算、依赖追踪 |
| `FilterModule` | 条件筛选 |
| `SortModule` | 多列排序 |
| `FreezeModule` | 冻结窗格 |
| `EditModule` | 编辑、复制/粘贴 |
| `ConditionalFormatModule` | 条件格式、色阶 |

## 核心设计

- **Headless first** — 核心不依赖 DOM/Canvas，可在 Node.js/Worker/服务端运行
- **Operation 驱动** — 所有状态变更通过 Operation，支持 undo/redo
- **单一 Sheet 类型** — 透视表作为 Module，聚合结果写入普通 cell
- **Module 系统** — 功能按需加载，tree-shaking 友好
- **零第三方依赖** — 核心运行时无外部依赖

## 开发

```bash
pnpm install
pnpm --filter @antv/s2 test
```

## License

MIT
