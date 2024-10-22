import { PivotSheet } from '../../../../src';
import { analyzeAdaptive, createResizeObserver } from '../../../../src/shared';

describe('resize test', () => {
  test('#analyzeAdaptive()', () => {
    const container = document.createElement('div');

    expect(analyzeAdaptive(container)).toEqual({
      container,
      adaptiveWidth: true,
      adaptiveHeight: true,
    });

    expect(analyzeAdaptive(container, true)).toEqual({
      container,
      adaptiveWidth: true,
      adaptiveHeight: false,
    });

    expect(analyzeAdaptive(container, false)).toEqual({
      container,
      adaptiveWidth: true,
      adaptiveHeight: false,
    });
  });

  test('#createResizeObserver()', () => {
    const container = document.createElement('div');
    const wrapper = document.createElement('div');
    const s2 = new PivotSheet(
      container,
      { data: [], fields: { rows: [], columns: [], values: [] } },
      {
        width: 200,
        height: 200,
      },
    );

    expect(
      createResizeObserver({
        s2,
        container: null,
        wrapper: null,
        adaptive: true,
      }),
    ).toBeUndefined();

    expect(
      createResizeObserver({
        s2,
        container,
        wrapper,
        adaptive: true,
      }),
    ).toBeFunction();
  });
});
