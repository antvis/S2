<script setup lang="ts">
import { ref, watch } from 'vue';
import {
  Button,
  Form,
  Layout,
  Modal,
  Select,
  Cascader,
  Radio,
  type FormInstance,
} from 'ant-design-vue';
import { OrderedListOutlined, DeleteOutlined } from '@ant-design/icons-vue';
import {
  ADVANCED_SORT_PRE_CLS,
  EXTRA_FIELD,
  TOTAL_VALUE,
  getSortMethod,
  getSortRuleOptions,
  i18n,
  type SortParam,
} from '@antv/s2';
import {
  filter,
  find,
  forEach,
  includes,
  isEqual,
  keys,
  map,
  toUpper,
  uniq,
} from 'lodash';
import type {
  AdvancedSortProps,
  Dimension,
  RuleItem,
  RuleValue,
} from './interface';
import CustomSort from './CustomSort.vue';

const props = defineProps<AdvancedSortProps>();

const emit = defineEmits<{
  (e: 'sort-confirm', ruleValues: RuleValue[], sortParams: SortParam[]): void;
  (e: 'sort-open'): void;
}>();

const { Sider, Content } = Layout;

const isSortVisible = ref(false);
const isCustomVisible = ref(false);
const ruleList = ref<RuleItem[]>([]);
const rules = ref<any[]>([]);
const manualDimensionList = ref<Dimension[]>([]);
const dimensionList = ref<Dimension[]>([]);
const sortBy = ref<string[]>([]);
const currentDimension = ref<Dimension>();
const formRef = ref<FormInstance>();
const formData = ref<Record<string, any>>({});

// Constants
const SORT_RULE_OPTIONS = getSortRuleOptions();
const SORT_METHOD = getSortMethod();

const handleModal = () => {
  isSortVisible.value = !isSortVisible.value;
};

const sortClick = () => {
  emit('sort-open');
  handleModal();
};

const handleCustom = () => {
  isCustomVisible.value = !isCustomVisible.value;
};

const handleDimension = (dimension: Dimension) => {
  if (!find(ruleList.value, (item) => item.field === dimension.field)) {
    currentDimension.value = dimension;
    formData.value[dimension.field] = {
      name: dimension.name,
      rule: ['sortMethod'],
      sortMethod: 'ASC',
      sortBy: [],
    };
    ruleList.value = [...ruleList.value, dimension as unknown as RuleItem];
  }

  dimensionList.value = filter(
    dimensionList.value,
    (item) => item.field !== dimension.field,
  );
};

const handleCustomSort = (
  dimension: RuleItem | Dimension,
  splitOrders?: string[],
) => {
  handleCustom();
  // Find the correct Dimension object to ensure type safety
  const correctDimension = find(
    manualDimensionList.value,
    (item) => item.field === dimension.field,
  );

  if (correctDimension) {
    currentDimension.value = correctDimension;
  }

  if (splitOrders && splitOrders.length > 0) {
    sortBy.value = uniq(splitOrders);
  } else {
    const list = correctDimension?.list || [];

    sortBy.value = uniq(list);
  }
};

const customSort = () => {
  handleCustom();
  // Update formData directly since we are using v-model / form binding
  // In React strict controlled form: form.setFieldsValue.
  // In Vue we might need to manually update if we use v-model on form items
  // But here we might rely on re-initializing form state or reactivity.

  if (!currentDimension.value) {
    return;
  }

  const field = currentDimension.value.field;

  // Update local state that reflects back to form
  if (!formData.value[field]) {
    formData.value[field] = {};
  }

  formData.value[field].sortBy = sortBy.value;

  // Update ruleList 's view
  ruleList.value = map(ruleList.value, (item) => {
    if (item.field === field) {
      return {
        ...item,
        // Force rule to sortBy
        rule: ['sortBy'],
        sortBy: sortBy.value,
        sortMethod: undefined,
        sortByMeasure: undefined,
      };
    }

    return item;
  }) as RuleItem[];

  // Also update Form data explicitly if needed (Antdv Form)
  if (formRef.value) {
    formRef.value.validateFields();
  }
};

const customCancel = () => {
  handleCustom();
};

const deleteRule = (dimension: RuleItem | Dimension) => {
  ruleList.value = filter(
    ruleList.value,
    (item) => item.field !== dimension.field,
  );
  const originalDimension = find(
    manualDimensionList.value,
    (item) => item.field === dimension.field,
  );

  if (originalDimension) {
    dimensionList.value = [...dimensionList.value, originalDimension];
  }

  // Clean up form data
  delete formData.value[dimension.field];
};

const onFinish = () => {
  const ruleValues: RuleValue[] = [];
  const currentSortParams: SortParam[] = [];

  // Use formData.value instead of form.getFieldsValue() if we bind v-model
  // Or use formRef.value.getFieldsValue(). simpler to trust reactive state here,
  // but for Antdv Form, getting all fields value is safer.

  // Let's assume formData.value is sync with UI via v-model
  const formValues = formData.value;
  const { values = [] } = props.sheetInstance.dataCfg.fields;

  forEach(keys(formValues), (field) => {
    // Check if valid rule in list
    if (!find(ruleList.value, (r) => r.field === field)) {
      return;
    }

    const { sortMethod, rule = [], sortBy: currentSortBy } = formValues[field];

    // Default fallback
    const safeRule = rule || ['sortMethod'];

    const current: SortParam = { sortFieldId: field };

    if (safeRule[0] === 'sortByMeasure' || safeRule[1]) {
      if (!includes(values, safeRule[1])) {
        current.sortByMeasure = TOTAL_VALUE;
      } else {
        current.sortByMeasure = safeRule[1];
      }

      current.sortMethod = sortMethod;
      current.query = {
        [EXTRA_FIELD]: safeRule[1],
      };
    } else if (safeRule[0] === 'sortBy') {
      current.sortBy = currentSortBy;
    } else {
      current.sortMethod = sortMethod;
    }

    ruleValues.push({
      field,
      name: '',
      sortMethod: formValues[field].sortMethod,
      sortBy: formValues[field].sortBy,
      sortByMeasure: formValues[field].sortByMeasure,
      rule: formValues[field].rule,
    });
    currentSortParams.push(current);
  });

  emit('sort-confirm', ruleValues, currentSortParams);
  handleModal();
};

const getDimensionList = (list: Dimension[]) =>
  filter(
    list,
    (item: Dimension) =>
      !find(
        props.sortParams,
        (sortParam) => sortParam.sortFieldId === item.field,
      ),
  );

const getManualDimensionList = (): Dimension[] => {
  if (props.dimensions) {
    return props.dimensions;
  }

  const { fields = {} } = props.sheetInstance.dataCfg || {};
  const { rows = [], columns = [] } = fields;

  return map([...rows, ...columns], (item: any) => {
    const name = typeof item === 'string' ? item : item.field;

    return {
      field: item,
      name: props.sheetInstance.dataSet.getFieldName(name),
      list: props.sheetInstance.dataSet.getDimensionValues(name),
    };
  }) as unknown as Dimension[];
};

const getRuleOptions = () => {
  if (props.ruleOptions) {
    return props.ruleOptions;
  }

  return map(SORT_RULE_OPTIONS, (item) => {
    if (item.value === 'sortByMeasure') {
      const { values = [] } = props.sheetInstance.dataCfg.fields || {};

      item.children = map(values, (field) => {
        return {
          label: props.sheetInstance.dataSet.getFieldName(field),
          value: field,
        };
      });
    }

    return item;
  });
};

const getRuleList = (): RuleItem[] =>
  map(props.sortParams, (item) => {
    const {
      sortFieldId,
      sortMethod,
      sortBy: currentSortBy,
      sortByMeasure,
    } = item;
    let rule: string[];

    if (currentSortBy) {
      rule = ['sortBy'];
    } else if (sortByMeasure) {
      rule = ['sortByMeasure', sortByMeasure];
    } else {
      rule = ['sortMethod'];
    }

    return {
      field: sortFieldId,
      name: props.sheetInstance.dataSet.getFieldName(sortFieldId),
      rule,
      sortMethod,
      sortBy: currentSortBy,
      sortByMeasure,
    };
  }) as RuleItem[];

watch(isSortVisible, (val) => {
  if (val) {
    const initRuleList = getRuleList();
    const manualDimensions = getManualDimensionList();
    const initDimensionList = getDimensionList(manualDimensions);
    const initRuleOptions = getRuleOptions();

    ruleList.value = initRuleList;
    manualDimensionList.value = manualDimensions;
    dimensionList.value = initDimensionList;
    rules.value = initRuleOptions;

    // Initialize form data
    const newFormData: Record<string, any> = {};

    initRuleList.forEach((item) => {
      newFormData[item.field] = {
        name: item.name,
        rule: item.rule,
        sortMethod: item.sortMethod ? toUpper(item.sortMethod) : 'ASC',
        sortBy: item.sortBy,
      };
    });
    formData.value = newFormData;
  }
});

const onSplitOrdersChange = (orders: string[]) => {
  sortBy.value = orders;
};
</script>

<template>
  <div :class="[ADVANCED_SORT_PRE_CLS, className]">
    <Button
      size="small"
      :class="`${ADVANCED_SORT_PRE_CLS}-btn`"
      @click="sortClick"
    >
      <template #icon>
        <component :is="icon || OrderedListOutlined" />
      </template>
      {{ text || i18n('高级排序') }}
    </Button>

    <Modal
      :title="text || i18n('高级排序')"
      :open="isSortVisible"
      :okText="i18n('确定')"
      :cancelText="i18n('取消')"
      :destroyOnClose="true"
      :class="`${ADVANCED_SORT_PRE_CLS}-modal`"
      @ok="onFinish"
      @cancel="handleModal"
    >
      <Layout>
        <Sider width="120" :class="`${ADVANCED_SORT_PRE_CLS}-sider-layout`">
          <div :class="`${ADVANCED_SORT_PRE_CLS}-title`">
            {{ i18n('可选字段') }}
          </div>
          <div>
            <div
              v-for="item in dimensionList"
              :key="item.field"
              :class="`${ADVANCED_SORT_PRE_CLS}-dimension-item`"
              :title="item.name"
              @click="handleDimension(item)"
            >
              {{ item.name }}
            </div>
          </div>
        </Sider>
        <Content :class="`${ADVANCED_SORT_PRE_CLS}-content-layout`">
          <div :class="`${ADVANCED_SORT_PRE_CLS}-title`">
            {{ ruleText || i18n('按以下规则进行排序（优先级由低到高）') }}
          </div>
          <Form
            ref="formRef"
            :model="formData"
            name="form"
            :class="`${ADVANCED_SORT_PRE_CLS}-custom-form`"
          >
            <div v-for="item in ruleList" :key="item.field">
              <!-- Field Name (ReadOnly) -->
              <Form.Item style="margin-bottom: 4px">
                <Select
                  :value="item.name"
                  disabled
                  :class="`${ADVANCED_SORT_PRE_CLS}-select`"
                  size="small"
                  style="width: 120px"
                />
                <span :class="`${ADVANCED_SORT_PRE_CLS}-field-prefix`">
                  {{ i18n('按') }}
                </span>

                <!-- Rule Cascader -->
                <Form.Item :name="[item.field, 'rule']" noStyle>
                  <Cascader
                    v-model:value="formData[item.field].rule"
                    :options="rules"
                    expandTrigger="hover"
                    size="small"
                    :allowClear="false"
                    style="width: 120px; margin-left: 8px"
                  />
                </Form.Item>

                <!-- Conditional Render based on rule -->
                <template
                  v-if="!isEqual(formData[item.field].rule, ['sortBy'])"
                >
                  <Form.Item :name="[item.field, 'sortMethod']" noStyle>
                    <Radio.Group
                      v-model:value="formData[item.field].sortMethod"
                      :class="`${ADVANCED_SORT_PRE_CLS}-rule-end`"
                    >
                      <Radio
                        v-for="method in SORT_METHOD"
                        :key="method.value"
                        :value="method.value"
                      >
                        {{ method.name }}
                      </Radio>
                    </Radio.Group>
                  </Form.Item>
                </template>
                <template v-else>
                  <a
                    :class="`${ADVANCED_SORT_PRE_CLS}-rule-end`"
                    @click="handleCustomSort(item, formData[item.field].sortBy)"
                  >
                    {{ i18n('设置顺序') }}
                  </a>
                  <!-- Hidden sortBy field storage -->
                  <!-- formData[item.field].sortBy is stored in state -->
                </template>

                <DeleteOutlined
                  :class="`${ADVANCED_SORT_PRE_CLS}-rule-end-delete`"
                  @click="deleteRule(item)"
                />
              </Form.Item>
            </div>
          </Form>
        </Content>
      </Layout>
    </Modal>

    <Modal
      :title="i18n('手动排序')"
      :open="isCustomVisible"
      :okText="i18n('确定')"
      :cancelText="i18n('取消')"
      :destroyOnClose="true"
      :class="`${ADVANCED_SORT_PRE_CLS}-custom-modal`"
      @ok="customSort"
      @cancel="customCancel"
    >
      <CustomSort
        :splitOrders="sortBy"
        @split-orders-change="onSplitOrdersChange"
      />
    </Modal>
  </div>
</template>

<style lang="less">
@import './index.less';
</style>
