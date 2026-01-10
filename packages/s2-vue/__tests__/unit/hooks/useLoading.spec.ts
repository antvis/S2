import {
  PivotSheet,
  S2Event,
  type S2Options,
  type SpreadSheet,
} from '@antv/s2';
import { nextTick, ref, shallowRef } from 'vue';
import { useLoading } from '../../../src/hooks/useLoading';
import * as mockDataConfig from '../../data/mock-dataset.json';
import { getContainer } from '../../util/helpers';

const s2Options: S2Options = {
  width: 200,
  height: 200,
  hd: false,
};

describe('useLoading tests', () => {
  let s2: SpreadSheet;
  let container: HTMLDivElement;

  beforeEach(() => {
    container = getContainer();
    s2 = new PivotSheet(container, mockDataConfig as any, s2Options);
  });

  afterEach(() => {
    s2?.destroy();
    container?.remove();
  });

  test('should be defined', () => {
    const s2Ref = shallowRef<SpreadSheet | undefined>(s2);
    const loadingProp = ref<boolean | undefined>(undefined);
    const result = useLoading(s2Ref, loadingProp);

    expect(result).toBeDefined();
    expect(result.loading).toBeDefined();
    expect(result.setLoading).toBeDefined();
  });

  test('should update loading state', async () => {
    const s2Ref = shallowRef<SpreadSheet | undefined>(s2);
    const loadingProp = ref<boolean | undefined>(undefined);
    const { loading, setLoading } = useLoading(s2Ref, loadingProp);

    expect(loading.value).toBeFalsy();

    setLoading(true);
    await nextTick();

    expect(loading.value).toBeTruthy();
  });

  test('should use config loading state with true', async () => {
    const s2Ref = shallowRef<SpreadSheet | undefined>(s2);
    const loadingProp = ref<boolean | undefined>(true);
    const { loading, setLoading } = useLoading(s2Ref, loadingProp);

    expect(loading.value).toBeTruthy();

    setLoading(false);
    await nextTick();

    // setLoading can override the initial value
    expect(loading.value).toBeFalsy();
  });

  test('should sync with external loading prop', async () => {
    const s2Ref = shallowRef<SpreadSheet | undefined>(s2);
    const loadingProp = ref<boolean | undefined>(false);
    const { loading } = useLoading(s2Ref, loadingProp);

    expect(loading.value).toBeFalsy();

    loadingProp.value = true;
    await nextTick();

    expect(loading.value).toBeTruthy();
  });

  test('should update loading state on render events', async () => {
    const s2Ref = shallowRef<SpreadSheet | undefined>(undefined);
    const loadingProp = ref<boolean | undefined>(undefined);
    const { loading } = useLoading(s2Ref, loadingProp);

    // Set s2Ref to trigger the watch
    s2Ref.value = s2;
    await nextTick();

    s2.emit(S2Event.LAYOUT_BEFORE_RENDER);
    await nextTick();

    expect(loading.value).toBeTruthy();

    s2.emit(S2Event.LAYOUT_AFTER_RENDER);
    await nextTick();

    expect(loading.value).toBeFalsy();
  });
});
