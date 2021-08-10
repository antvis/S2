/*
扩展 G2 的自定义交互，供给交叉图使用：

// 1. hover 显示 tooltip
2. click 选中单元格，显示 tooltip 和工具栏按钮
3. 拖拽圈选单元格，显示圈选数据和工具栏按钮（过滤、排序）
4. hover 表头，显示下钻上卷按钮，点击进行下钻上卷、交换字段拖拽等
5. 拖拽字段，交换字段顺序
6. 拖拽字段值，交互顺序
7. 点击表头选中行列
8. 按需渲染的 scroll 交互
9. 左上角corner的文字点击
*/

// export { Tooltip } from './tooltip'; // 扩展 tooltip，不使用交互实现
export { BrushSelection } from './brush-selection';
export { RowColResize } from './row-col-resize';
export { DataCellMultiSelection } from './data-cell-multi-selection';
export { ColRowMultiSelection } from './col-row-multi-selection';
