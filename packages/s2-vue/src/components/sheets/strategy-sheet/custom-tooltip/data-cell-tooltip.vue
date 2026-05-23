<script lang="ts">
import type { ViewMeta, MultiData, SimpleData } from '@antv/s2';
import {
  i18n,
  getEmptyPlaceholder,
  isUnchangedValue,
  isUpDataValue,
  getStrategySheetTooltipClsName as tooltipCls,
} from '@antv/s2';
import { first, get, isEmpty, isFunction, isNil } from 'lodash';
import { defineComponent, computed, type PropType } from 'vue';
import type { CustomTooltipProps } from './interface';

export default defineComponent({
  name: 'StrategySheetDataCellTooltip',
  props: {
    cell: {
      type: Object as PropType<CustomTooltipProps['cell']>,
      required: true,
    },
    label: {
      type: [Object, Function] as PropType<CustomTooltipProps['label']>,
      default: undefined,
    },
    showOriginalValue: {
      type: Boolean,
      default: false,
    },
    renderDerivedValue: {
      type: Function as PropType<CustomTooltipProps['renderDerivedValue']>,
      default: undefined,
    },
  },
  setup(props) {
    const meta = computed(() => props.cell.getMeta() as ViewMeta);
    const spreadsheet = computed(() => meta.value.spreadsheet);
    const metaFieldValue = computed(
      () => meta.value?.fieldValue as MultiData<SimpleData[][]>,
    );

    const rowDescription = computed(() =>
      spreadsheet.value.dataSet.getCustomFieldDescription(props.cell),
    );

    const rowName = computed(() => {
      const defaultRowName = spreadsheet.value.dataSet.getCustomRowFieldName(
        props.cell,
      );
      const customLabel = isFunction(props.label)
        ? props.label(props.cell, defaultRowName)
        : props.label;

      return customLabel ?? defaultRowName;
    });

    const colLeafNode = computed(() =>
      spreadsheet.value.facet.getColLeafNodeByIndex(meta.value.colIndex),
    );

    const derivedLabels = computed(() => {
      try {
        const [, ...labels] = JSON.parse(colLeafNode.value?.value!);

        return labels;
      } catch {
        return [];
      }
    });

    const valuesCfg = computed(
      () => spreadsheet.value.options.style?.dataCell?.valuesCfg,
    );

    const values = computed(() => {
      const firstValues = first(metaFieldValue.value?.values) || [
        metaFieldValue.value,
      ];

      return {
        value: firstValues[0],
        derivedValues: firstValues.slice(1) as SimpleData[],
      };
    });

    const originalValues = computed(() => {
      const originalValuesField = get(
        metaFieldValue.value,
        valuesCfg.value?.originalValueField!,
      ) as SimpleData[][];
      const firstOriginal = first(originalValuesField) || [values.value.value];

      return {
        originalValue: firstOriginal[0],
        derivedOriginalValues: firstOriginal.slice(1) as SimpleData[],
      };
    });

    const emptyPlaceholder = computed(() =>
      getEmptyPlaceholder(meta.value, spreadsheet.value.options.placeholder),
    );

    const shouldShowOriginalValue = computed(
      () => valuesCfg.value?.showOriginalValue || props.showOriginalValue,
    );

    const getDerivedValueInfo = (derivedValue: SimpleData, index: number) => {
      const isUnchanged = isUnchangedValue(
        derivedValue,
        values.value.value as SimpleData,
      );
      const isUp = !isUnchanged && isUpDataValue(derivedValue);
      const isDown = !isUnchanged && !isUp;
      const originalDerivedValue =
        originalValues.value.derivedOriginalValues[index];

      return { isUnchanged, isUp, isDown, originalDerivedValue };
    };

    return {
      tooltipCls,
      i18n,
      isEmpty,
      isNil,
      rowName,
      rowDescription,
      values,
      originalValues,
      derivedLabels,
      emptyPlaceholder,
      shouldShowOriginalValue,
      getDerivedValueInfo,
    };
  },
});
</script>

<template>
  <div :class="[tooltipCls(), tooltipCls('data')]">
    <div :class="tooltipCls('header')">
      <span class="header-label">{{ rowName }}</span>
      <span>{{ values.value ?? emptyPlaceholder }}</span>
    </div>

    <div v-if="shouldShowOriginalValue" :class="tooltipCls('original-value')">
      {{
        isNil(originalValues.originalValue)
          ? emptyPlaceholder
          : originalValues.originalValue
      }}
    </div>

    <template v-if="!isEmpty(values.derivedValues)">
      <div :class="tooltipCls('divider')" />
      <ul :class="tooltipCls('derived-values')">
        <li
          v-for="(derivedValue, i) in values.derivedValues"
          :key="i"
          class="derived-value-item"
        >
          <span class="derived-value-label">{{ derivedLabels[i] }}</span>
          <span
            :class="[
              'derived-value-group',
              {
                'derived-value-trend-up': getDerivedValueInfo(derivedValue, i)
                  .isUp,
                'derived-value-trend-down': getDerivedValueInfo(derivedValue, i)
                  .isDown,
              },
            ]"
          >
            <span
              v-if="!getDerivedValueInfo(derivedValue, i).isUnchanged"
              class="derived-value-trend-icon"
            />
            <template
              v-if="
                renderDerivedValue?.(
                  derivedValue,
                  getDerivedValueInfo(derivedValue, i).originalDerivedValue,
                  cell,
                )
              "
            >
              {{
                renderDerivedValue(
                  derivedValue,
                  getDerivedValueInfo(derivedValue, i).originalDerivedValue,
                  cell,
                )
              }}
            </template>
            <span v-else class="derived-value-content">
              {{ derivedValue ?? emptyPlaceholder }}
            </span>
          </span>
        </li>
      </ul>
    </template>

    <div v-if="rowDescription" :class="tooltipCls('description')">
      <span :class="tooltipCls('description-label')">{{ i18n('说明') }}</span>
      <span :class="tooltipCls('description-text')">{{ rowDescription }}</span>
    </div>
  </div>
</template>

<style lang="less">
@import './index.less';
</style>
