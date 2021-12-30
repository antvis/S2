import * as mockDataConfig from 'tests/data/simple-data.json';
import { PivotSheet } from '@/sheet-type';
import { S2Options } from '@/common';

const s2options: S2Options = {
  width: 200,
  height: 200,
  hierarchyType: 'grid',
};

describe('SpreadSheet Tests', () => {
  let container: HTMLElement;

  beforeAll(() => {
    container = document.createElement('div');
    container.id = 'container';
    document.body.appendChild(container);
  });

  describe('Mount Sheet tests', () => {
    test('should init sheet by dom container', () => {
      const mountContainer = document.querySelector('#container');
      const s2 = new PivotSheet(mountContainer, mockDataConfig, s2options);
      s2.render();

      expect(s2.container).toBeDefined();
      expect(container.querySelector('canvas')).toBeDefined();
      s2.destroy();
    });

    test('should init sheet by selector container', () => {
      const containerSelector = '#container';
      const s2 = new PivotSheet(containerSelector, mockDataConfig, s2options);
      s2.render();

      expect(s2.container).toBeDefined();
      expect(container.querySelector('canvas')).toBeDefined();

      s2.destroy();
    });

    test('should throw error when init sheet by selector container if container not found', () => {
      const mountContainer = null;

      function init() {
        const s2 = new PivotSheet(mountContainer, mockDataConfig, s2options);
        s2.render();
        s2.destroy();
      }

      expect(init).toThrowError('Target mount container is not a DOM element');
    });

    test('should update scroll offset immediately', () => {
      const s2 = new PivotSheet(container, mockDataConfig, s2options);
      s2.render();
      expect(s2.facet.hScrollBar.current()).toEqual(0);
      s2.updateScrollOffset({
        offsetX: { value: 30 },
      });

      expect(s2.facet.hScrollBar.current()).toBeGreaterThan(0);
    });
  });
});
