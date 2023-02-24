import * as mockDataConfig from 'tests/data/simple-data.json';
import { getContainer, sleep } from 'tests/util/helpers';
import { pick } from 'lodash';
import { PivotSheet, TableSheet } from '@/sheet-type';
import {
  DEFAULT_OPTIONS,
  S2Event,
  type S2Options,
  type TextTheme,
} from '@/common';

const s2Options: S2Options = {
  width: 200,
  height: 200,
  hierarchyType: 'grid',
  hdAdapter: true,
};

describe('SpreadSheet Tests', () => {
  describe('Mount Sheet Tests', () => {
    let container: HTMLElement;

    beforeAll(() => {
      container = getContainer();
    });

    afterAll(() => {
      container?.remove();
    });

    test('should init sheet by dom container', () => {
      const s2 = new PivotSheet(container, mockDataConfig, s2Options);
      s2.render();

      expect(s2.container).toBeDefined();
      expect(s2.container.get('el')).toBeInstanceOf(HTMLCanvasElement);
      expect(container.querySelector('canvas')).toBeDefined();

      s2.destroy();
    });

    test('should init sheet by selector container', () => {
      const CONTAINER_ID = 'container';
      container.id = CONTAINER_ID;

      const containerSelector = `#${CONTAINER_ID}`;
      const s2 = new PivotSheet(containerSelector, mockDataConfig, s2Options);
      s2.render();

      expect(s2.container).toBeDefined();
      expect(s2.container.get('el')).toBeInstanceOf(HTMLCanvasElement);
      expect(container.querySelector('canvas')).toBeDefined();

      s2.destroy();
    });

    test('should throw error when init sheet by selector container if container not found', () => {
      const mountContainer = null;

      function init() {
        const s2 = new PivotSheet(mountContainer, mockDataConfig, s2Options);
        s2.render();
        s2.destroy();
        s2.render();
      }

      expect(init).toThrowError('Target mount container is not a DOM element');
    });

    // https://github.com/antvis/S2/issues/1050
    test.each([
      { devicePixelRatio: 1 },
      { devicePixelRatio: 2 },
      { devicePixelRatio: 3 },
    ])('should render sheet by custom DPR by %s', ({ devicePixelRatio }) => {
      const s2 = new PivotSheet(container, mockDataConfig, {
        ...s2Options,
        devicePixelRatio,
      });
      s2.render();

      const canvas = s2.container.get('el') as HTMLCanvasElement;
      expect(canvas.width).toEqual(s2Options.width * devicePixelRatio);
      expect(canvas.height).toEqual(s2Options.height * devicePixelRatio);
      expect(canvas.style.width).toEqual(`${s2Options.width}px`);
      expect(canvas.style.height).toEqual(`${s2Options.height}px`);

      s2.destroy();
    });

    test('should render sheet if custom DPR less than zero', () => {
      const s2 = new PivotSheet(container, mockDataConfig, {
        ...s2Options,
        devicePixelRatio: 0,
      });
      s2.render();

      const canvas = s2.container.get('el') as HTMLCanvasElement;
      expect(canvas.width).toEqual(s2Options.width);
      expect(canvas.height).toEqual(s2Options.height);
      expect(canvas.style.width).toEqual(`${s2Options.width}px`);
      expect(canvas.style.height).toEqual(`${s2Options.height}px`);

      s2.destroy();
    });

    test('should update scroll offset x immediately', () => {
      const s2 = new PivotSheet(container, mockDataConfig, s2Options);
      s2.render();

      expect(s2.facet.hScrollBar.current()).toEqual(0);

      s2.updateScrollOffset({
        offsetX: { value: 30 },
      });
      expect(s2.facet.hScrollBar.current()).toBeGreaterThan(0);
      expect(s2.facet.getScrollOffset()).toMatchInlineSnapshot(`
        Object {
          "rowHeaderScrollX": 0,
          "scrollX": 30,
          "scrollY": 0,
        }
      `);
    });

    test('should update scroll offset y immediately', () => {
      const s2 = new PivotSheet(container, mockDataConfig, {
        ...s2Options,
        style: {
          cellCfg: {
            height: 200,
          },
        },
      });
      s2.render();

      s2.updateScrollOffset({
        offsetY: { value: 20 },
      });
      expect(s2.facet.vScrollBar.current()).toBeGreaterThan(0);
      expect(s2.facet.getScrollOffset()).toMatchInlineSnapshot(`
        Object {
          "rowHeaderScrollX": 0,
          "scrollX": 0,
          "scrollY": 20,
        }
      `);
    });

    test('should update row header scroll offset x immediately', () => {
      const s2 = new PivotSheet(container, mockDataConfig, {
        ...s2Options,
        frozenRowHeader: true,
        style: {
          rowCfg: {
            width: 400,
          },
        },
      });
      s2.render();

      expect(s2.facet.hRowScrollBar.current()).toEqual(0);
      expect(s2.facet.getScrollOffset()).toMatchInlineSnapshot(`
        Object {
          "rowHeaderScrollX": 0,
          "scrollX": 0,
          "scrollY": 0,
        }
      `);

      s2.updateScrollOffset({
        rowHeaderOffsetX: { value: 30 },
      });
      expect(s2.facet.hRowScrollBar.current()).toBeGreaterThan(0);
      expect(s2.facet.getScrollOffset()).toMatchInlineSnapshot(`
        Object {
          "rowHeaderScrollX": 30,
          "scrollX": 0,
          "scrollY": 0,
        }
      `);
    });

    test('should update scroll offset immediately', () => {
      const s2 = new PivotSheet(container, mockDataConfig, {
        ...s2Options,
        style: {
          rowCfg: {
            width: 400,
          },
          cellCfg: {
            height: 200,
          },
        },
      });
      s2.render();

      s2.updateScrollOffset({
        offsetY: { value: 20 },
        offsetX: { value: 30 },
        rowHeaderOffsetX: { value: 40 },
      });
      expect(s2.facet.vScrollBar.current()).toBeGreaterThan(0);
      expect(s2.facet.hScrollBar.current()).toBeGreaterThan(0);
      expect(s2.facet.hRowScrollBar.current()).toBeGreaterThan(0);
      expect(s2.facet.getScrollOffset()).toMatchInlineSnapshot(`
        Object {
          "rowHeaderScrollX": 40,
          "scrollX": 30,
          "scrollY": 20,
        }
      `);
    });

    // https://github.com/antvis/S2/issues/1197
    test('should not rerender when window or visual viewport resize', async () => {
      const render = jest.fn();
      const s2 = new PivotSheet(container, mockDataConfig, s2Options);

      s2.on(S2Event.LAYOUT_BEFORE_RENDER, render);
      s2.render();

      window.dispatchEvent(new Event('resize'));
      visualViewport.dispatchEvent(new Event('resize'));

      // await debounce
      await sleep(1000);

      expect(render).toHaveBeenCalledTimes(1);

      s2.destroy();
    });

    test.each([PivotSheet, TableSheet])(
      'should not crash if style config is empty',
      (Sheet) => {
        function render() {
          const s2 = new Sheet(container, mockDataConfig, {
            width: 400,
            height: 400,
            style: {
              rowCfg: null,
              colCfg: null,
              cellCfg: null,
            },
          });

          s2.render();
        }

        expect(render).not.toThrowError();
      },
    );
  });

  describe('Destroy Sheet Tests', () => {
    let container: HTMLElement;

    beforeAll(() => {
      container = getContainer();
    });

    afterAll(() => {
      container?.remove();
    });

    test.each([PivotSheet, TableSheet])(
      'should destroy sheet correctly',
      (Sheet) => {
        const s2 = new Sheet(container, mockDataConfig, s2Options);
        s2.render();

        expect(s2.container).toBeDefined();
        expect(s2.container.get('el')).toBeInstanceOf(HTMLCanvasElement);
        expect(container.querySelectorAll('canvas')).toHaveLength(1);

        s2.destroy();

        expect(s2.container.get('el')).not.toBeDefined();
        expect(container.querySelectorAll('canvas')).toHaveLength(0);
        expect(document.body.style.overscrollBehavior).toBeFalsy();
      },
    );

    test.each([PivotSheet, TableSheet])(
      'should not throw error when repeat render after sheet destroyed',
      (Sheet) => {
        function init() {
          const s2 = new Sheet(container, mockDataConfig, s2Options);
          s2.render();
          s2.destroy();

          Array.from({ length: 10 }).forEach(() => {
            s2.render();
          });
        }

        expect(init).not.toThrowError();
      },
    );

    // https://github.com/antvis/S2/issues/1349
    test.each([PivotSheet, TableSheet])(
      'should not throw error when change sheet size after sheet destroyed',
      (Sheet) => {
        function init() {
          const s2 = new Sheet(container, mockDataConfig, s2Options);
          s2.render();
          s2.destroy();
          s2.changeSheetSize(200, 200);
        }

        expect(init).not.toThrowError();
      },
    );

    test.each([PivotSheet, TableSheet])(
      'should not throw error when window resize after sheet destroyed',
      (Sheet) => {
        function init() {
          const s2 = new Sheet(container, mockDataConfig, s2Options);
          s2.render();
          s2.destroy();

          visualViewport.dispatchEvent(new Event('resize'));
        }

        expect(init).not.toThrowError();
      },
    );

    test.each([PivotSheet, TableSheet])(
      'should not build sheet when sheet destroy before sheet render',
      (Sheet) => {
        const s2 = new Sheet(container, mockDataConfig, s2Options);

        const beforeRender = jest.fn();
        const afterRender = jest.fn();

        const clearDrillDownDataSpy = jest
          .spyOn(s2, 'clearDrillDownData')
          .mockImplementationOnce(() => {});

        s2.on(S2Event.LAYOUT_BEFORE_RENDER, beforeRender);
        s2.on(S2Event.LAYOUT_AFTER_RENDER, afterRender);
        s2.destroy();

        Array.from({ length: 10 }).forEach(() => {
          s2.render();
        });

        expect(beforeRender).toHaveBeenCalledTimes(0);
        expect(afterRender).toHaveBeenCalledTimes(0);
        expect(clearDrillDownDataSpy).toHaveBeenCalledTimes(0);
      },
    );

    // https://github.com/antvis/S2/issues/1011
    test.each([PivotSheet, TableSheet])(
      'should delay destroy sheet correctly',
      async (Sheet) => {
        const s2 = new Sheet(container, mockDataConfig, s2Options);
        s2.render();

        expect(s2.container.get('el')).toBeInstanceOf(HTMLCanvasElement);
        expect(container.querySelectorAll('canvas')).toHaveLength(1);

        await new Promise((resolve) =>
          setTimeout(() => {
            s2.destroy();
            resolve(true);
          }, 1000),
        );

        expect(s2.container.get('el')).not.toBeDefined();
        expect(container.querySelectorAll('canvas')).toHaveLength(0);

        s2.destroy();
      },
    );

    // https://github.com/antvis/S2/issues/1011
    test('should toggle sheet type', () => {
      const s2 = new PivotSheet(container, mockDataConfig, s2Options);
      s2.render();

      expect(s2).toBeInstanceOf(PivotSheet);
      expect(container.querySelectorAll('canvas')).toHaveLength(1);

      s2.destroy();
      const tableSheet = new TableSheet(container, mockDataConfig, s2Options);
      tableSheet.render();

      expect(tableSheet).toBeInstanceOf(TableSheet);
      expect(container.querySelectorAll('canvas')).toHaveLength(1);
    });
  });

  describe('Sheet Config Change Tests', () => {
    let container: HTMLElement;

    beforeAll(() => {
      container = getContainer();
    });

    afterAll(() => {
      container?.remove();
    });

    test('should update all Data Config when reset is true', () => {
      const totalData = [
        {
          province: '浙江',
          type: '笔',
          price: 3,
          cost: 6,
        },
      ];
      const s2 = new PivotSheet(
        container,
        { ...mockDataConfig, totalData },
        s2Options,
      );
      s2.render();

      expect(s2.dataSet.totalData).toEqual([
        {
          $$extra$$: 'price',
          $$value$$: 3,
          cost: 6,
          price: 3,
          province: '浙江',
          type: '笔',
        },
        {
          $$extra$$: 'cost',
          $$value$$: 6,
          cost: 6,
          price: 3,
          province: '浙江',
          type: '笔',
        },
      ]);
      expect(s2.dataCfg.totalData).toEqual(totalData);

      // 改变 totalData 为 undefined 再次渲染
      s2.setDataCfg({ ...mockDataConfig, totalData: undefined }, true);
      s2.render();

      expect(s2.dataSet.totalData).toEqual([]);
      expect(s2.dataCfg.fields).toEqual({
        ...mockDataConfig.fields,
        customTreeItems: [],
      });
      expect(s2.dataCfg.totalData).toEqual([]);
      s2.destroy();
    });

    test('should update all Data Config when reset is false', () => {
      const totalData = [
        {
          province: '浙江',
          type: '笔',
          price: 3,
          cost: 6,
        },
      ];
      const s2 = new PivotSheet(
        container,
        { ...mockDataConfig, totalData },
        s2Options,
      );
      s2.render();

      const totalDataSet = [
        {
          $$extra$$: 'price',
          $$value$$: 3,
          cost: 6,
          price: 3,
          province: '浙江',
          type: '笔',
        },
        {
          $$extra$$: 'cost',
          $$value$$: 6,
          cost: 6,
          price: 3,
          province: '浙江',
          type: '笔',
        },
      ];

      // 改变 totalData 为 undefined 再次渲染
      s2.setDataCfg({ ...mockDataConfig, totalData: undefined }, false);
      s2.render();

      expect(s2.dataSet.totalData).toEqual(totalDataSet);
      expect(s2.dataCfg.fields).toEqual({
        ...mockDataConfig.fields,
        customTreeItems: [],
      });
      expect(s2.dataCfg.totalData).toEqual(totalData);
      s2.destroy();
    });

    test('should update all Options when reset is true', () => {
      const s2 = new PivotSheet(container, mockDataConfig, s2Options);
      s2.render();
      const emitAttrs = ['width', 'height', 'hierarchyType', 'hdAdapter'];
      const partialOptions = pick(s2.options, emitAttrs);
      expect(partialOptions).toEqual(s2Options);

      s2.setOptions(
        {
          width: 300,
          hdAdapter: false,
        },
        true,
      );
      expect(pick(s2.options, emitAttrs)).toEqual({
        height: DEFAULT_OPTIONS.height,
        hierarchyType: DEFAULT_OPTIONS.hierarchyType,
        width: 300,
        hdAdapter: false,
      });
    });

    test('should update all Options when reset is false', () => {
      const s2 = new PivotSheet(container, mockDataConfig, s2Options);
      s2.render();
      const emitAttrs = ['width', 'height', 'hierarchyType', 'hdAdapter'];

      s2.setOptions(
        {
          width: 300,
          hdAdapter: false,
        },
        false,
      );

      expect(pick(s2.options, emitAttrs)).toEqual({
        height: s2Options.height,
        hierarchyType: s2Options.hierarchyType,
        width: 300,
        hdAdapter: false,
      });
    });

    describe('Measure Text Tests', () => {
      const text = '测试';
      const font: TextTheme = {
        textAlign: 'center',
        fontSize: 12,
      };
      const s2 = new PivotSheet(getContainer(), mockDataConfig, s2Options);
      s2.render();

      test('should measure text', () => {
        expect(s2.measureText(text, null)).toBeNull();
        expect(s2.measureText(text, font)).toBeInstanceOf(TextMetrics);
      });

      test('should measure text width', () => {
        expect(s2.measureTextWidth(text, null)).toEqual(0);
        expect(s2.measureTextWidth(text, font)).not.toBeLessThanOrEqual(0);
      });

      test('should measure text height', () => {
        expect(s2.measureTextHeight(text, null)).toEqual(0);
        expect(s2.measureTextHeight(text, font)).not.toBeLessThanOrEqual(0);
      });
    });
  });
});
