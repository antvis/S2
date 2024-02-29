import * as mockDataConfig from 'tests/data/simple-data.json';
import { createPivotSheet, getContainer, sleep } from 'tests/util/helpers';
import { pick } from 'lodash';
import { CanvasEvent, type CanvasContext } from '@antv/g';
import { PivotSheet, SpreadSheet, TableSheet } from '@/sheet-type';
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
  hd: true,
};

describe('SpreadSheet Tests', () => {
  beforeEach(() => {
    window.devicePixelRatio = 1;
  });

  describe('Mount Sheet Tests', () => {
    let container: HTMLElement;

    beforeEach(() => {
      container = getContainer();
    });

    afterEach(() => {
      container?.remove();
    });

    test('should init sheet by dom container', async () => {
      const s2 = new PivotSheet(container, mockDataConfig, s2Options);

      await s2.render();

      expect(s2.container).toBeDefined();
      expect(s2.getCanvasElement()).toBeInstanceOf(HTMLCanvasElement);
      expect(container.querySelector('canvas')).toBeDefined();

      s2.destroy();
    });

    test('should generate header node by field value', async () => {
      const s2 = new PivotSheet(container, mockDataConfig, s2Options);

      await s2.render();

      expect(s2.facet.getRowNodes().map((node) => node.id)).toEqual([
        'root[&]浙江',
        'root[&]浙江[&]义乌',
        'root[&]浙江[&]杭州',
      ]);
      expect(s2.facet.getColNodes().map((node) => node.id)).toEqual([
        'root[&]笔',
        'root[&]笔[&]price',
        'root[&]笔[&]cost',
      ]);
    });

    test('should init sheet by selector container', async () => {
      const CONTAINER_ID = 'container';

      container.id = CONTAINER_ID;

      const containerSelector = `#${CONTAINER_ID}`;
      const s2 = new PivotSheet(containerSelector, mockDataConfig, s2Options);

      await s2.render();

      expect(s2.container).toBeDefined();
      expect(s2.getCanvasElement()).toBeInstanceOf(HTMLCanvasElement);
      expect(container.querySelector('canvas')).toBeDefined();

      s2.destroy();
    });

    test('should throw error when init sheet by selector container if container not found', async () => {
      const mountContainer = null;

      async function init() {
        const s2 = new PivotSheet(mountContainer!, mockDataConfig, s2Options);

        await s2.render();
        s2.destroy();
        await s2.render();
      }

      await expect(init()).rejects.toThrow(
        'Target mount container is not a DOM element',
      );
    });

    // https://github.com/antvis/S2/issues/1050
    test.each([
      { devicePixelRatio: 1 },
      { devicePixelRatio: 2 },
      { devicePixelRatio: 3 },
    ])(
      'should render sheet by custom DPR by %s',
      async ({ devicePixelRatio }) => {
        const s2 = new PivotSheet(container, mockDataConfig, {
          ...s2Options,
          transformCanvasConfig() {
            return {
              devicePixelRatio,
            };
          },
        });

        await s2.render();

        const canvas = s2.getCanvasElement() as HTMLCanvasElement;

        expect(canvas.width).toEqual(s2Options.width! * devicePixelRatio);
        expect(canvas.height).toEqual(s2Options.height! * devicePixelRatio);
        expect(canvas.style.width).toEqual(`${s2Options.width}px`);
        expect(canvas.style.height).toEqual(`${s2Options.height}px`);

        s2.destroy();
      },
    );

    test('should render sheet if custom DPR less than zero', async () => {
      const s2 = new PivotSheet(container, mockDataConfig, {
        ...s2Options,
        transformCanvasConfig() {
          return {
            devicePixelRatio: 0,
          };
        },
      });

      await s2.render();

      const canvas = s2.getCanvasElement() as HTMLCanvasElement;

      expect(canvas.width).toEqual(s2Options.width);
      expect(canvas.height).toEqual(s2Options.height);
      expect(canvas.style.width).toEqual(`${s2Options.width}px`);
      expect(canvas.style.height).toEqual(`${s2Options.height}px`);

      s2.destroy();
    });

    test('should update scroll offset x immediately', async () => {
      const s2 = new PivotSheet(container, mockDataConfig, s2Options);

      await s2.render();

      expect(s2.facet.hScrollBar.current()).toEqual(0);

      s2.updateScrollOffset({
        offsetX: { value: 30 },
      });
      await sleep(500);

      expect(s2.facet.hScrollBar.current()).toBeGreaterThan(0);
      expect(s2.facet.getScrollOffset()).toMatchInlineSnapshot(`
        Object {
          "rowHeaderScrollX": 0,
          "scrollX": 30,
          "scrollY": 0,
        }
      `);
    });

    test('should update scroll offset y immediately', async () => {
      const s2 = new PivotSheet(container, mockDataConfig, {
        ...s2Options,
        style: {
          dataCell: {
            height: 200,
          },
        },
      });

      await s2.render();

      s2.updateScrollOffset({
        offsetY: { value: 20 },
      });

      await sleep(500);
      expect(s2.facet.vScrollBar.current()).toBeGreaterThan(0);
      expect(s2.facet.getScrollOffset()).toMatchInlineSnapshot(`
        Object {
          "rowHeaderScrollX": 0,
          "scrollX": 0,
          "scrollY": 20,
        }
      `);
    });

    test('should update row header scroll offset x immediately', async () => {
      const s2 = new PivotSheet(container, mockDataConfig, {
        ...s2Options,
        frozen: { rowHeader: true },
        style: {
          rowCell: {
            width: 400,
          },
        },
      });

      await s2.render();

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

      await sleep(500);
      expect(s2.facet.hRowScrollBar.current()).toBeGreaterThan(0);
      expect(s2.facet.getScrollOffset()).toMatchInlineSnapshot(`
        Object {
          "rowHeaderScrollX": 30,
          "scrollX": 0,
          "scrollY": 0,
        }
      `);
    });

    test('should update scroll offset immediately', async () => {
      const s2 = new PivotSheet(container, mockDataConfig, {
        ...s2Options,
        style: {
          rowCell: {
            width: 400,
          },
          dataCell: {
            height: 200,
          },
        },
      });

      await s2.render();

      s2.updateScrollOffset({
        offsetY: { value: 20 },
        offsetX: { value: 30 },
        rowHeaderOffsetX: { value: 40 },
      });

      await sleep(500);

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
      await s2.render();

      window.dispatchEvent(new Event('resize'));
      visualViewport!.dispatchEvent(new Event('resize'));

      // await debounce
      await sleep(1000);

      expect(render).toHaveBeenCalledTimes(1);

      s2.destroy();
    });

    test.each([PivotSheet, TableSheet])(
      'should not crash if style config is empty',
      async (Sheet) => {
        async function render() {
          const s2 = new Sheet(container, mockDataConfig, {
            width: 400,
            height: 400,
            style: {
              rowCell: null,
              colCell: null,
              dataCell: null,
            },
          });

          await s2.render();
        }

        await expect(render()).resolves.toBe(undefined);
      },
    );
  });

  describe('Destroy Sheet Tests', () => {
    let container: HTMLElement;

    beforeEach(() => {
      container = getContainer();
    });

    afterEach(() => {
      container?.remove();
    });

    test.each([PivotSheet, TableSheet])(
      'should destroy sheet correctly',
      async (Sheet) => {
        const s2 = new Sheet(container, mockDataConfig, s2Options);
        const destroyFn = jest.fn();

        s2.container.addEventListener(CanvasEvent.AFTER_DESTROY, destroyFn);
        await s2.render();

        expect(s2.container).toBeDefined();
        expect(s2.getCanvasElement()).toBeInstanceOf(HTMLCanvasElement);
        expect(container.querySelectorAll('canvas')).toHaveLength(1);

        s2.destroy();

        expect(destroyFn).toHaveBeenCalled();
        expect(container.querySelectorAll('canvas')).toHaveLength(0);
        expect(document.body.style.overscrollBehavior).toBeFalsy();
      },
    );

    test.each([PivotSheet, TableSheet])(
      'should not throw error when repeat render after sheet destroyed',
      async (Sheet) => {
        async function init() {
          const s2 = new Sheet(container, mockDataConfig, s2Options);

          await s2.render();
          s2.destroy();

          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          for (const _ of Array.from({ length: 10 })) {
            // eslint-disable-next-line no-await-in-loop
            await s2.render();
          }
        }

        await expect(init()).resolves.toBe(undefined);
      },
    );

    // https://github.com/antvis/S2/issues/1349
    test.each([PivotSheet, TableSheet])(
      'should not throw error when change sheet size after sheet destroyed',
      async (Sheet) => {
        async function init() {
          const s2 = new Sheet(container, mockDataConfig, s2Options);

          await s2.render();
          s2.destroy();
          s2.changeSheetSize(200, 200);
        }

        await expect(init()).resolves.toBe(undefined);
      },
    );

    test.each([PivotSheet, TableSheet])(
      'should not throw error when window resize after sheet destroyed',
      async (Sheet) => {
        async function init() {
          const s2 = new Sheet(container, mockDataConfig, s2Options);

          await s2.render();
          s2.destroy();

          visualViewport!.dispatchEvent(new Event('resize'));
        }

        await expect(init()).resolves.toBe(undefined);
      },
    );

    test.each([PivotSheet, TableSheet])(
      'should not build sheet when sheet destroy before sheet render',
      async (Sheet) => {
        const s2 = new Sheet(container, mockDataConfig, s2Options);

        const beforeRender = jest.fn();
        const afterRender = jest.fn();

        s2.on(S2Event.LAYOUT_BEFORE_RENDER, beforeRender);
        s2.on(S2Event.LAYOUT_AFTER_RENDER, afterRender);
        s2.destroy();

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        for (const _ of Array.from({ length: 10 })) {
          // eslint-disable-next-line no-await-in-loop
          await s2.render();
        }

        expect(beforeRender).toHaveBeenCalledTimes(0);
        expect(afterRender).toHaveBeenCalledTimes(0);
      },
    );

    // https://github.com/antvis/S2/issues/1011
    test.each([PivotSheet, TableSheet])(
      'should delay destroy sheet correctly',
      async (Sheet) => {
        const s2 = new Sheet(container, mockDataConfig, s2Options);
        const destroyFn = jest.fn();

        s2.container.addEventListener(CanvasEvent.AFTER_DESTROY, destroyFn);
        await s2.render();

        expect(s2.getCanvasElement()).toBeInstanceOf(HTMLCanvasElement);
        expect(container.querySelectorAll('canvas')).toHaveLength(1);

        await new Promise((resolve) => {
          setTimeout(() => {
            s2.destroy();
            resolve(true);
          }, 1000);
        });

        expect(destroyFn).toHaveBeenCalled();
        expect(container.querySelectorAll('canvas')).toHaveLength(0);

        s2.destroy();
      },
    );

    // https://github.com/antvis/S2/issues/1011
    test('should toggle sheet type', async () => {
      const s2 = new PivotSheet(container, mockDataConfig, s2Options);

      await s2.render();

      expect(s2).toBeInstanceOf(PivotSheet);
      expect(container.querySelectorAll('canvas')).toHaveLength(1);

      s2.destroy();
      const tableSheet = new TableSheet(container, mockDataConfig, s2Options);

      await tableSheet.render();

      expect(tableSheet).toBeInstanceOf(TableSheet);
      expect(container.querySelectorAll('canvas')).toHaveLength(1);
    });
  });

  describe('Sheet Config Change Tests', () => {
    let container: HTMLElement;

    beforeEach(() => {
      container = getContainer();
    });

    afterEach(() => {
      container?.remove();
    });

    test('should update all Data Config when reset is true', async () => {
      const s2 = new PivotSheet(
        container,
        { ...mockDataConfig, meta: [{ field: 'price', name: '价格' }] },
        s2Options,
      );

      await s2.render();

      expect(s2.dataSet.originData).toHaveLength(3);
      expect(s2.dataCfg.meta).toHaveLength(1);

      // 改变 totalData 为 undefined 再次渲染
      s2.setDataCfg({ ...mockDataConfig, data: [] }, true);
      await s2.render();

      expect(s2.dataSet.originData).toHaveLength(0);
      expect(s2.dataCfg.meta).toHaveLength(0);
      s2.destroy();
    });

    test('should update all Data Config when reset is false', async () => {
      const s2 = new PivotSheet(
        container,
        { ...mockDataConfig, meta: [{ field: 'price', name: '价格' }] },
        s2Options,
      );

      await s2.render();

      expect(s2.dataSet.originData).toHaveLength(3);
      expect(s2.dataCfg.meta).toHaveLength(1);

      // 改变 totalData 为 undefined 再次渲染
      s2.setDataCfg({ ...mockDataConfig, data: [] }, false);
      await s2.render();

      expect(s2.dataSet.originData).toHaveLength(0);
      expect(s2.dataCfg.meta).toHaveLength(1);
      s2.destroy();
    });

    test('should update all Options when reset is true', async () => {
      const s2 = new PivotSheet(container, mockDataConfig, s2Options);

      await s2.render();
      const emitAttrs = ['width', 'height', 'hierarchyType', 'hd'];
      const partialOptions = pick(s2.options, emitAttrs);

      expect(partialOptions).toEqual(s2Options);

      s2.setOptions(
        {
          width: 300,
          hd: false,
        },
        true,
      );

      expect(pick(s2.options, emitAttrs)).toEqual({
        height: DEFAULT_OPTIONS.height,
        hierarchyType: DEFAULT_OPTIONS.hierarchyType,
        width: 300,
        hd: false,
      });
    });

    test('should update all Options when reset is false', async () => {
      const s2 = new PivotSheet(container, mockDataConfig, s2Options);

      await s2.render();
      const emitAttrs = ['width', 'height', 'hierarchyType', 'hd'];

      s2.setOptions(
        {
          width: 300,
          hd: false,
        },
        false,
      );

      expect(pick(s2.options, emitAttrs)).toEqual({
        height: s2Options.height,
        hierarchyType: s2Options.hierarchyType,
        width: 300,
        hd: false,
      });
    });

    test('should reset config', () => {
      const s2 = new PivotSheet(container, mockDataConfig, s2Options);

      s2.setOptions({
        hierarchyType: 'tree',
        tooltip: { enable: true },
        frozen: { firstRow: true },
      });

      s2.setDataCfg({
        fields: { rows: [], columns: [], values: [] },
      });

      s2.resetOptions();
      s2.resetDataCfg();

      expect(s2.options).toMatchSnapshot();
      expect(s2.dataCfg).toMatchSnapshot();
    });

    describe('Measure Text Tests', () => {
      const text = '测试';
      const font: TextTheme = {
        textAlign: 'center',
        fontSize: 12,
      };
      let s2: SpreadSheet;

      beforeAll(async () => {
        s2 = new PivotSheet(getContainer(), mockDataConfig, s2Options);

        await s2.render();
      });

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

  describe('Custom G Canvas Plugins & Options Tests', () => {
    test('should custom canvas options', async () => {
      const DPR = 3;
      const s2 = createPivotSheet({
        ...s2Options,
        transformCanvasConfig() {
          return {
            supportsCSSTransform: true,
            devicePixelRatio: DPR,
            cursor: 'crosshair',
          };
        },
      });

      await s2.render();

      const { width, height } = s2.getCanvasElement();
      const { supportsCSSTransform, devicePixelRatio, cursor } =
        s2.container.getConfig();

      expect(width).toStrictEqual(s2Options.width! * devicePixelRatio!);
      expect(height).toStrictEqual(s2Options.height! * devicePixelRatio!);
      expect(supportsCSSTransform).toBeTruthy();
      expect(cursor).toEqual('crosshair');
    });

    test('should register custom canvas plugins', async () => {
      let s2Instance = null;

      const s2 = createPivotSheet({
        ...s2Options,
        transformCanvasConfig(renderer, spreadsheet) {
          renderer.registerPlugin({
            name: 'custom',
            init: jest.fn(),
            destroy: jest.fn(),
            context: {} as CanvasContext,
          });

          s2Instance = spreadsheet;
        },
      });

      await s2.render();

      const { renderer } = s2.container.getConfig();

      const pluginsNames = renderer?.getPlugins().map(({ name }) => name);

      expect(pluginsNames).toEqual([
        'canvas-context-register',
        'image-loader',
        'canvas-path-generator',
        'canvas-renderer',
        'dom-interaction',
        'canvas-picker',
        'html-renderer',
        'custom',
      ]);
      expect(s2Instance).toEqual(s2);
    });
  });
});
