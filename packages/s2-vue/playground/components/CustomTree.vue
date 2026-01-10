<script setup lang="ts">
import { ref } from 'vue';
import type { S2DataConfig, S2Options, HierarchyType } from '@antv/s2';
import { SheetComponent } from '../../src';
import { customTreeData, customTreeFields } from '../config';

const hierarchyType = ref<HierarchyType>('tree');

const dataCfg = ref<S2DataConfig>({
  data: customTreeData,
  fields: customTreeFields,
});

const options = ref<S2Options>({
  debug: true,
  width: 600,
  height: 480,
  hierarchyType: 'tree',
  showDefaultHeaderActionIcon: false,
  interaction: {
    copy: {
      enable: true,
      withHeader: true,
      withFormat: true,
    },
  },
  style: {
    rowCell: {},
  },
});

const toggleHierarchy = (checked: boolean) => {
  hierarchyType.value = checked ? 'tree' : 'grid';
};
</script>

<template>
  <div>
    <a-space style="margin-bottom: 8px">
      <a-switch
        checked-children="树状"
        un-checked-children="平铺"
        :checked="hierarchyType === 'tree'"
        @change="toggleHierarchy"
      />
    </a-space>
    <SheetComponent
      sheetType="pivot"
      :dataCfg="dataCfg"
      :options="{ ...options, hierarchyType }"
      :adaptive="false"
    />
  </div>
</template>
