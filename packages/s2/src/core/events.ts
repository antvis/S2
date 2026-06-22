import type { Operation } from '../operation/types';
import type { Selection } from '../interaction/types';

export type CoreEventMap = {
  // 数据变更:undo/redo 也走这条,payload 是实际被执行的 operations
  'operationApplied': Operation[];

  // 选区(setSelection operation 触发)
  'selectionChanged': { sheet: number; selection: Selection | null };

  // 排序(sort.set / sort.clear operation 触发)
  'sorted': { sheet: number; sortBy: { col: number; order: 'asc' | 'desc' }[] };

  // 过滤(filter.set / filter.clear operation 触发)
  'filtered': { sheet: number };

  // 树形折叠/展开(list.toggleCollapse / pivot.toggleCollapse)
  'collapse': { sheet: number; nodeId: string; isCollapsed: boolean };

  // 编辑(EditModule operation 触发)
  'editStart': { sheet: number; row: number; col: number };
  'editEnd': { sheet: number; row: number; col: number; value: unknown };
  'editCancel': { sheet: number; row: number; col: number };

  // 剪贴板(edit.copy / edit.paste operation 触发)
  'copied': { sheet: number; range: { startRow: number; endRow: number; startCol: number; endCol: number } };
  'pasted': { sheet: number; row: number; col: number };

  // 生命周期 — workbook.destroy() 触发
  'destroy': Record<string, never>;
};
