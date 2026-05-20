import {
  PivotSheet,
  S2Event,
  type S2Options,
  type SpreadSheet,
} from '@antv/s2';
import { nextTick, shallowRef } from 'vue';
import {
  DEFAULT_PAGE_NUMBER,
  DEFAULT_PAGE_SIZE,
  usePagination,
} from '../../../src/hooks/usePagination';
import type { BaseSheetProps } from '../../../src/utils/initPropAndEmits';
import * as mockDataConfig from '../../data/mock-dataset.json';
import { getContainer } from '../../util/helpers';

const s2Options: S2Options = {
  width: 200,
  height: 200,
  hd: false,
  pagination: {
    current: 1,
    pageSize: 5,
  },
};

describe('usePagination tests', () => {
  let s2: SpreadSheet;
  let container: HTMLDivElement;

  const getProps = (options: S2Options = s2Options): BaseSheetProps =>
    ({
      options,
      dataCfg: mockDataConfig as any,
    }) as BaseSheetProps;

  beforeEach(async () => {
    container = getContainer();
    s2 = new PivotSheet(container, mockDataConfig as any, s2Options);
    await s2.render();
  });

  afterEach(() => {
    s2?.destroy();
    container?.remove();
  });

  test('should be defined', () => {
    const s2Ref = shallowRef<SpreadSheet | undefined>(s2);
    const result = usePagination(s2Ref, getProps());

    expect(result).toBeDefined();
  });

  test('should get default pagination when no config', () => {
    const s2Ref = shallowRef<SpreadSheet | undefined>(undefined);
    const propsWithoutPagination = getProps({
      ...s2Options,
      pagination: undefined,
    });
    const result = usePagination(s2Ref, propsWithoutPagination);

    expect(result.current.value).toBe(DEFAULT_PAGE_NUMBER);
    expect(result.pageSize.value).toBe(DEFAULT_PAGE_SIZE);
    expect(result.total.value).toBe(0);
  });

  test('should get pagination from config', () => {
    const s2Ref = shallowRef<SpreadSheet | undefined>(s2);
    const result = usePagination(s2Ref, getProps());

    expect(result.current.value).toBe(1);
    expect(result.pageSize.value).toBe(5);
  });

  test('should update pagination on page change', async () => {
    const s2Ref = shallowRef<SpreadSheet | undefined>(s2);
    const result = usePagination(s2Ref, getProps());

    expect(result.current.value).toBe(1);

    result.change(2);
    await nextTick();

    expect(result.current.value).toBe(2);
  });

  test('should update pagination on page size change', async () => {
    const s2Ref = shallowRef<SpreadSheet | undefined>(s2);
    const result = usePagination(s2Ref, getProps());

    expect(result.pageSize.value).toBe(5);

    result.showSizeChange(15);
    await nextTick();

    expect(result.pageSize.value).toBe(15);
  });

  test('should compute visible correctly', () => {
    const s2Ref = shallowRef<SpreadSheet | undefined>(s2);

    // With pagination and showPagination
    const propsWithPagination = {
      ...getProps(),
      showPagination: true,
    };
    const result1 = usePagination(s2Ref, propsWithPagination);

    expect(result1.visible.value).toBeTruthy();

    // Without showPagination
    const propsWithoutShow = {
      ...getProps(),
      showPagination: false,
    };
    const result2 = usePagination(s2Ref, propsWithoutShow);

    expect(result2.visible.value).toBeFalsy();
  });

  test('should update total on LAYOUT_PAGINATION event', async () => {
    const s2Ref = shallowRef<SpreadSheet | undefined>(undefined);
    const result = usePagination(s2Ref, getProps());

    expect(result.total.value).toBe(0);

    s2Ref.value = s2;
    await nextTick();

    s2.emit(S2Event.LAYOUT_PAGINATION, { total: 100 } as any);
    await nextTick();

    expect(result.total.value).toBe(100);
  });
});
