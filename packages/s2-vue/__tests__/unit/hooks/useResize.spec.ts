import { PivotSheet, type S2Options, type SpreadSheet } from '@antv/s2';
import { nextTick, ref, shallowRef } from 'vue';
import { useResize } from '../../../src/hooks/useResize';
import type { BaseSheetProps } from '../../../src/utils/initPropAndEmits';
import * as mockDataConfig from '../../data/mock-dataset.json';
import { getContainer } from '../../util/helpers';

const s2Options: S2Options = {
  width: 200,
  height: 200,
  hd: false,
};

describe('useResize tests', () => {
  let s2: SpreadSheet;
  let container: HTMLDivElement;
  let wrapper: HTMLDivElement;

  const getProps = (adaptive?: boolean): BaseSheetProps =>
    ({
      adaptive,
      options: s2Options,
      dataCfg: mockDataConfig as any,
    }) as BaseSheetProps;

  beforeEach(async () => {
    container = getContainer();
    wrapper = getContainer();
    s2 = new PivotSheet(container, mockDataConfig as any, s2Options);
    await s2.render();
  });

  afterEach(() => {
    s2?.destroy();
    container?.remove();
    wrapper?.remove();
  });

  test('should be called without error', () => {
    const s2Ref = shallowRef<SpreadSheet | undefined>(s2);
    const wrapperRef = ref<HTMLDivElement | undefined>(wrapper);
    const containerRef = ref<HTMLDivElement | undefined>(container);

    expect(() => {
      useResize(s2Ref, getProps(true), { wrapperRef, containerRef });
    }).not.toThrow();
  });

  test('should not throw when s2 is undefined', () => {
    const s2Ref = shallowRef<SpreadSheet | undefined>(undefined);
    const wrapperRef = ref<HTMLDivElement | undefined>(wrapper);
    const containerRef = ref<HTMLDivElement | undefined>(container);

    expect(() => {
      useResize(s2Ref, getProps(true), { wrapperRef, containerRef });
    }).not.toThrow();
  });

  test('should handle adaptive mode change', async () => {
    const s2Ref = shallowRef<SpreadSheet | undefined>(s2);
    const wrapperRef = ref<HTMLDivElement | undefined>(wrapper);
    const containerRef = ref<HTMLDivElement | undefined>(container);
    const props = getProps(true);

    useResize(s2Ref, props, { wrapperRef, containerRef });
    await nextTick();

    // Change adaptive to false - should still not throw
    props.adaptive = false;
    await nextTick();

    // If we get here, no error
    expect(true).toBeTruthy();
  });
});
