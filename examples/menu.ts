export const menus = [
  {
    title: '基础',
    children: [
      { path: 'basic', name: 'spreadsheet', label: '电子表格' },
      { path: 'basic', name: 'large-data', label: '大数据量' },
      { path: 'basic', name: 'showcase', label: '功能展示' },
      { path: 'basic', name: 'autofit', label: 'AutoFit 验证' },
    ],
  },
  {
    title: '明细表 (ListTable)',
    children: [
      { path: 'list-table', name: 'basic', label: '基础明细表' },
      { path: 'list-table', name: 'tree', label: '树形展示' },
      { path: 'list-table', name: 'group', label: '分组展示' },
      { path: 'list-table', name: 'transpose', label: '转置展示' },
      { path: 'list-table', name: 'grid', label: '平铺分组' },
      { path: 'list-table', name: 'multi-header', label: '多级表头' },
    ],
  },
  {
    title: '透视表 (Pivot)',
    children: [
      { path: 'pivot', name: 'basic', label: '基础透视表' },
      { path: 'pivot', name: 'tree-mode', label: '树形模式' },
      { path: 'pivot', name: 'grid-tree', label: 'Grid-Tree 模式' },
      { path: 'pivot', name: 'full', label: '完整透视表' },
    ],
  },
  {
    title: '公式',
    children: [
      { path: 'formula', name: 'basic', label: '基础公式' },
    ],
  },
  {
    title: '交互',
    children: [
      { path: 'interaction', name: 'selection', label: '选区' },
      { path: 'interaction', name: 'edit', label: '编辑' },
      { path: 'interaction', name: 'copy-paste', label: '复制粘贴' },
      { path: 'interaction', name: 'fill-handle', label: '自动填充' },
      { path: 'interaction', name: 'freeze', label: '冻结' },
    ],
  },
  {
    title: '排序/过滤',
    children: [
      { path: 'data', name: 'sort', label: '排序' },
      { path: 'data', name: 'filter', label: '过滤' },
      { path: 'data', name: 'conditional-format', label: '条件格式' },
    ],
  },
];
