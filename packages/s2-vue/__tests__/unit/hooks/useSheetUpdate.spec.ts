import { PivotSheet, type S2Options, type SpreadSheet } from '@antv/s2';
import { reactive, shallowRef } from 'vue';
import { useSheetUpdate } from '../../../src/hooks/useSheetUpdate';
import type { BaseSheetProps } from '../../../src/utils/initPropAndEmits';
import * as mockDataConfig from '../../data/mock-dataset.json';
import { getContainer } from '../../util/helpers';

const s2Options: S2Options = {
  width: 200,
  height: 200,
  hd: false,
};

describe('useSheetUpdate tests', () => {
  let s2: SpreadSheet;
  let container: HTMLDivElement;

  beforeEach(async () => {
    container = getContainer();
    s2 = new PivotSheet(container, mockDataConfig as any, s2Options);
    await s2.render();
  });

  afterEach(() => {
    s2?.destroy();
    container?.remove();
  });

  test('should be callable without error', () => {
    const s2Ref = shallowRef<SpreadSheet | undefined>(s2);
    // Use reactive for props to enable Vue reactivity
    const props = reactive({
      options: { ...s2Options },
      dataCfg: { ...mockDataConfig } as any,
      themeCfg: { name: 'default' as const },
    }) as BaseSheetProps;

    expect(() => {
      useSheetUpdate(s2Ref, props);
    }).not.toThrow();
  });

  test('should not throw when s2Ref is undefined', () => {
    const s2Ref = shallowRef<SpreadSheet | undefined>(undefined);
    const props = reactive({
      options: { ...s2Options },
      dataCfg: { ...mockDataConfig } as any,
      themeCfg: { name: 'default' as const },
    }) as BaseSheetProps;

    expect(() => {
      useSheetUpdate(s2Ref, props);
    }).not.toThrow();
  });

  test('should accept hooks parameter', () => {
    const s2Ref = shallowRef<SpreadSheet | undefined>(s2);
    const props = reactive({
      options: { ...s2Options },
      dataCfg: { ...mockDataConfig } as any,
      themeCfg: { name: 'default' as const },
    }) as BaseSheetProps;

    const before = jest.fn();
    const after = jest.fn();

    expect(() => {
      useSheetUpdate(s2Ref, props, { before, after });
    }).not.toThrow();
  });

  test('should accept onUpdate callback in props', () => {
    const s2Ref = shallowRef<SpreadSheet | undefined>(s2);
    const onUpdate = jest.fn((options) => options);
    const props = reactive({
      options: { ...s2Options },
      dataCfg: { ...mockDataConfig } as any,
      themeCfg: { name: 'default' as const },
      onUpdate,
    }) as BaseSheetProps;

    expect(() => {
      useSheetUpdate(s2Ref, props);
    }).not.toThrow();
  });

  test('should accept onUpdateAfterRender callback in props', () => {
    const s2Ref = shallowRef<SpreadSheet | undefined>(s2);
    const onUpdateAfterRender = jest.fn();
    const props = reactive({
      options: { ...s2Options },
      dataCfg: { ...mockDataConfig } as any,
      themeCfg: { name: 'default' as const },
      onUpdateAfterRender,
    }) as BaseSheetProps;

    expect(() => {
      useSheetUpdate(s2Ref, props);
    }).not.toThrow();
  });
});
