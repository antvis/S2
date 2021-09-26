/**
 * pivot mode pivot test.
 */
 import { Canvas } from '@antv/g-canvas';
 import { SpreadSheet } from '@/sheet-type';
 import { PivotDataSet } from '@/data-set/pivot-data-set';
 import { PivotFacet } from '@/facet/pivot-facet';
 import { Store } from '@/common/store';
 import { getTheme } from '@/theme';
 import { defaultStyle } from '@/common/interface/s2Options';
 import { assembleDataCfg, assembleOptions } from '../../util/sheet-entry';
 import { getMockRowPivotMeta } from './util';
 
 const actualPivotDataSet = jest.requireActual('src/data-set/pivot-data-set').PivotDataSet;

 jest.mock('src/sheet-type', () => {
   const container = new Canvas({ width: 100, height: 100, container: document.body});
   return {
     SpreadSheet: jest.fn().mockImplementation(() => {
       return {
         dataCfg: {
           ...assembleDataCfg(),
         },
         options: assembleOptions(),
         panelScrollGroup: {
           setClip: jest.fn(),
         },
         container,
         theme: getTheme({}),
         panelGroup: container.addGroup(),
         foregroundGroup: container.addGroup(),
         backgroundGroup: container.addGroup(),
         store: new Store(),
         on: jest.fn(),
         isTableMode: jest.fn().mockReturnValue(false),
         isPivotMode: jest.fn().mockReturnValue(true),
         getTotalsConfig: jest.fn().mockReturnValue({}),
         isColAdaptive: jest.fn().mockReturnValue('adaptive'),
         emit: jest.fn(),
         isScrollContainsRowHeader: jest.fn(),
         isHierarchyTreeType: jest.fn(),
       };
     })
   };
   
 });
 jest.mock('src/data-set/pivot-data-set', () => {
   return {
     PivotDataSet: jest.fn().mockImplementation(() => {
       return {
         ...assembleDataCfg(),
         rowPivotMeta: getMockRowPivotMeta(),
         colPivotMeta: new Map(),
         sortedDimensionValues: new Map(),
         moreThanOneValue: jest.fn(),
         getFieldName: jest.fn(),
         getDimensionValues: actualPivotDataSet.prototype.getDimensionValues,
       };
     })
   }
 });
 const MockSpreadSheet = SpreadSheet as any as jest.Mock<SpreadSheet>;
 const MockPivotDataSet = PivotDataSet as any as jest.Mock<PivotDataSet>;
 
 describe('Pivot Mode Facet Test', () => {
   let s2:SpreadSheet = new MockSpreadSheet();
   let dataSet:PivotDataSet = new MockPivotDataSet(s2);
   debugger;

   let facet:PivotFacet = new PivotFacet({
     spreadsheet: s2,
     dataSet: dataSet,
     ...assembleDataCfg().fields,
     ...assembleOptions(),
     ...defaultStyle,
   });
 
   describe('should get correct hierarchy', () => {
     const { rowsHierarchy, colsHierarchy } = facet.layoutResult;
     debugger;
     test('row hierarchy', () => {
       expect(rowsHierarchy.height).toBe(0);
       expect(rowsHierarchy.width).toBe(0);
       expect(rowsHierarchy.getIndexNodes()).toHaveLength(0);
     });
     test('col hierarchy', () => {
      expect(rowsHierarchy.height).toBe(0);
     });
   });

   describe('should get correct cell meta', () => {
    //
   });

   describe('tree mode', () => {
    //
   });

   describe('render', () => {
    //
   });

   
 });
