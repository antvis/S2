import * as mockDataConfig from 'tests/data/simple-data.json';
import { getContainer } from 'tests/util/helpers';
import { PivotSheet, TableSheet } from '@/sheet-type';
import { S2Options } from '@/common';

const s2Options: S2Options = {
  width: 200,
  height: 200,
  hierarchyType: 'grid',
};

describe('SpreadSheet Tests', () => {
  describe('Mount Sheet Tests', () => {
    let container: HTMLElement;
    beforeAll(() => {
      container = document.createElement('div');
      container.id = 'container';
      document.body.appendChild(container);
    });

    afterAll(() => {
      container?.remove();
    });

    test('should init sheet by dom container', () => {
      const mountContainer = document.querySelector('#container');
      const s2 = new PivotSheet(mountContainer, mockDataConfig, s2Options);
      s2.render();

      expect(s2.container).toBeDefined();
      expect(s2.container.get('el')).toBeInstanceOf(HTMLCanvasElement);
      expect(container.querySelector('canvas')).toBeDefined();
    });

    test('should init sheet by selector container', () => {
      const containerSelector = '#container';
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
    });

    test('should update scroll offset immediately', () => {
      const s2 = new PivotSheet(container, mockDataConfig, s2Options);
      s2.render();

      expect(s2.facet.hScrollBar.current()).toEqual(0);

      s2.updateScrollOffset({
        offsetX: { value: 30 },
      });
      expect(s2.facet.hScrollBar.current()).toBeGreaterThan(0);
    });
  });

  describe('Destroy Sheet Tests', () => {
    test.each([PivotSheet, TableSheet])(
      'should destroy %s correctly',
      async (Sheet) => {
        const container = getContainer();
        const s2 = new Sheet(container, mockDataConfig, s2Options);
        s2.render();

        expect(s2.container).toBeDefined();
        expect(s2.container.get('el')).toBeInstanceOf(HTMLCanvasElement);
        expect(container.querySelectorAll('canvas')).toHaveLength(1);

        s2.destroy();

        expect(s2.container.get('el')).not.toBeDefined();
        expect(container.querySelectorAll('canvas')).toHaveLength(0);
      },
    );

    // https://github.com/antvis/S2/issues/1011
    test.each([PivotSheet, TableSheet])(
      'should delay destroy %s correctly',
      async (Sheet) => {
        const container = getContainer();
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
      },
    );

    // https://github.com/antvis/S2/issues/1011
    test('should toggle sheet type', () => {
      const container = getContainer();
      const pivotSheet = new PivotSheet(container, mockDataConfig, s2Options);
      pivotSheet.render();

      expect(pivotSheet).toBeInstanceOf(PivotSheet);
      expect(container.querySelectorAll('canvas')).toHaveLength(1);

      pivotSheet.destroy();
      const tableSheet = new TableSheet(container, mockDataConfig, s2Options);
      tableSheet.render();

      expect(tableSheet).toBeInstanceOf(TableSheet);
      expect(container.querySelectorAll('canvas')).toHaveLength(1);
    });
  });
});
