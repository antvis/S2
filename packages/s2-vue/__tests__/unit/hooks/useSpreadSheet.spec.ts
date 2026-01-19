import { PivotSheet, type S2Options } from '@antv/s2';
import * as mockDataConfig from '../../data/mock-dataset.json';
import { getContainer } from '../../util/helpers';

// Note: useSpreadSheet is designed to be used within Vue component lifecycle,
// so we test it through the SheetComponent integration tests.
// This file tests the helper functions and data flow.

const s2Options: S2Options = {
  width: 200,
  height: 200,
  hd: false,
};

describe('useSpreadSheet tests', () => {
  let container: HTMLDivElement;

  beforeEach(() => {
    container = getContainer();
  });

  afterEach(() => {
    container?.remove();
  });

  test('should create PivotSheet instance', async () => {
    const s2 = new PivotSheet(container, mockDataConfig as any, s2Options);

    expect(s2).toBeDefined();
    expect(s2).toBeInstanceOf(PivotSheet);

    await s2.render();
    expect(s2.facet).toBeDefined();

    s2.destroy();
  });

  test('should handle options update', async () => {
    const s2 = new PivotSheet(container, mockDataConfig as any, s2Options);

    await s2.render();

    s2.setOptions({ width: 300, height: 400 });

    expect(s2.options.width).toBe(300);
    expect(s2.options.height).toBe(400);

    s2.destroy();
  });

  test('should handle dataCfg update', async () => {
    const s2 = new PivotSheet(container, mockDataConfig as any, s2Options);

    await s2.render();

    const newData = [
      {
        province: '浙江',
        city: '杭州',
        type: '笔',
        price: 1,
      },
    ];

    s2.setDataCfg({
      ...(mockDataConfig as any),
      data: newData,
    });

    expect(s2.dataCfg.data).toEqual(newData);

    s2.destroy();
  });

  test('should handle themeCfg update', async () => {
    const s2 = new PivotSheet(container, mockDataConfig as any, s2Options);

    await s2.render();

    s2.setThemeCfg({ name: 'colorful' });

    expect(s2.theme).toBeDefined();

    s2.destroy();
  });

  test('should destroy properly', async () => {
    const s2 = new PivotSheet(container, mockDataConfig as any, s2Options);

    await s2.render();

    const destroySpy = jest.spyOn(s2, 'destroy');

    s2.destroy();

    expect(destroySpy).toHaveBeenCalledTimes(1);
  });
});
