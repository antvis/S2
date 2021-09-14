/**
 * 明细表核心数据流程
 * 差别：
 * - 明细表不需要计算二维数组数据
 * - 明细表不需要生成 Row Hierarchy（但为了流程一致会生成空结构）
 */
 import { get } from 'lodash';
 import { SpreadSheet } from 'src/sheet-type';
 import { assembleDataCfg, assembleOptions } from 'tests/util/sheet-entry';
 import { getContainer } from 'tests/util/helpers';
 
 describe('List Table Core Data Process', () => {
   const ss = new SpreadSheet(getContainer(), assembleDataCfg({
     meta: [],
     fields: {
       columns: ['province', 'city', 'type', 'sub_type', 'price'],
     },
   }), assembleOptions({ mode: 'table' }));
   ss.render();
 
   describe('1、Generate Col Hierarchy', () => {
     const layoutResult = ss.facet.layoutResult;
     const { colsHierarchy } = layoutResult;
 
     test('should get correct col hierarchy structure', () => {
       // 节点正确
       expect(colsHierarchy.getIndexNodes()).toHaveLength(5);
       expect(colsHierarchy.getLeaves()).toHaveLength(5);
       // 层级正确
       expect(colsHierarchy.getNodes().map((node) => node.label)).toEqual([
         'province',
         'city',
         'type',
         'sub_type',
         'price',
       ]);
       // 父子关系正确
       const nodes = colsHierarchy.getNodes();
       nodes.forEach((node) => {
         expect(node.children).toEqual([]);
         expect(node.parent.id).toEqual('root');
       });
     });
   });
 
   describe('2、Calculate Col Coordinates', () => {
     const { width, style } = ss.options;
     const { colLeafNodes, colsHierarchy } = ss.facet.layoutResult;
     const { cellCfg, rowCfg, colCfg } = get(ss, 'facet.cfg');
 
     test('should calc correct cell width', () => {
       expect(cellCfg.width).toEqual(
         Math.max(style.cellCfg.width, width / colLeafNodes.length),
       );
       expect(rowCfg.width).toEqual(
         Math.max(style.cellCfg.width, width / colLeafNodes.length),
       );
     });
 
     test('should calc correct col node size and coordinate', () => {
       // sample height
       expect(colsHierarchy.sampleNodesForAllLevels[0]?.height).toEqual(
         colCfg.height,
       );
 
       const nodes = colsHierarchy.getNodes();
       // node width
       nodes.forEach((node, index) => {
         expect(node.x).toEqual(node.width * index);
         expect(node.width).toEqual(cellCfg.width);
         expect(node.y).toEqual(0);
         expect(node.height).toEqual(colCfg.height);
       });
     });
   });
 
   describe('3、Calculate overlapped data cell info', () => {
     const { getCellMeta } = ss.facet.layoutResult;
     test('should get correct data value', () => {
       // 第一行
       expect(getCellMeta(0, 0).data).toEqual({ province: '浙江省' });
       expect(getCellMeta(0, 1).data).toEqual({ city: '杭州市' });
       expect(getCellMeta(0, 2).data).toEqual({ type: '家具' });
       expect(getCellMeta(0, 3).data).toEqual({ sub_type: '桌子' });
       expect(getCellMeta(0, 4).data).toEqual({ price: 1 });
       // 第三行
       expect(getCellMeta(2, 0).data).toEqual({ province: '浙江省' });
       expect(getCellMeta(2, 1).data).toEqual({ city: '宁波市' });
       expect(getCellMeta(2, 2).data).toEqual({ type: '家具' });
       expect(getCellMeta(2, 3).data).toEqual({ sub_type: '桌子' });
       expect(getCellMeta(2, 4).data).toEqual({ price: 3 });
     });
   });
 });
 