<script setup lang="ts">
import { ref, onMounted, defineComponent, h, createVNode, render as vueRender, shallowRef } from 'vue';
import { SheetComponent } from '@antv/s2-vue';
import '@antv/s2-vue/dist/s2-vue.min.css';

const s2Ref = shallowRef();
const dataCfg = ref(null);
const fullData = ref(null);
const drillDownField = ref('');

const options = {
  width: 800,
  height: 600,
  tooltip: {
      enable: false, // implementation manual tooltip
  },
  style: {
      layoutWidthType: 'colAdaptive',
      dataCell: {
          width: 400,
          height: 100,
          valuesCfg: {
            widthPercent: [40, 20, 20, 20],
          },
      }
  },
  conditions: {
    text: [
      {
        mapping: (value, cellInfo) => {
          const { colIndex } = cellInfo;
          if (colIndex <= 1) {
            return { fill: '#000' };
          }
          return {
            fill: parseFloat(value) >= 0 ? '#FF4D4F' : '#29A294',
          };
        },
      },
    ],
  },
};

const TooltipContent = defineComponent({
  props: ['meta', 'onDrillDown', 'onMerge'],
  render() {
    const { meta, onDrillDown, onMerge } = this;
    const { fieldValue } = meta;

    return h('div', { class: 'custom-tooltip' }, [
        h('div', { class: 'tooltip-operator' }, [
            h('div', { class: 'tooltip-action', onClick: onDrillDown }, 'Drill Down'),
            h('div', { class: 'tooltip-action', onClick: onMerge }, 'Merge Cells'),
        ]),
        h('div', { class: 'tooltip-divider' }),
        h('div', { class: 'tooltip-head' }, fieldValue.label),
        h('div', { class: 'tooltip-detail-list' },
            fieldValue.values.map((item, key) =>
                h('div', { class: 'tooltip-detail-item', key }, [
                    h('span', { class: 'tooltip-key' }, item[0]),
                    h('span', { class: 'tooltip-val' }, `${item[1]} | Ratio: ${item[2]} | Diff: ${item[3]}`)
                ])
            )
        )
    ]);
  }
});

const onDataCellClick = ({ viewMeta, event }) => {
    if (!viewMeta) return;

    const container = document.createElement('div');
    const vnode = createVNode(TooltipContent, {
        meta: viewMeta,
        onDrillDown: () => {
             dataCfg.value = fullData.value.drillDownDataCfg;
             drillDownField.value = viewMeta.fieldValue.label;
             s2Ref.value?.instance.hideTooltip();
        },
        onMerge: () => {
            s2Ref.value?.instance.interaction.mergeCells();
            s2Ref.value?.instance.hideTooltip();
        }
    });
    vueRender(vnode, container);

    s2Ref.value?.instance.showTooltip({
        position: { x: event.clientX, y: event.clientY },
        content: container
    });
};

const resetDrillDown = () => {
    dataCfg.value = fullData.value.dataCfg;
    drillDownField.value = '';
};

onMounted(() => {
  fetch('https://gw.alipayobjects.com/os/bmw-prod/ff31b171-17a7-4d29-b20a-0b90a810d2de.json')
    .then(res => res.json())
    .then(data => {
      fullData.value = data;
      dataCfg.value = data.dataCfg;
    });
});

const onSheetMounted = (instance) => {
    // s2Ref is automatically handled by ref="s2Ref" on template?
    // s2-vue SheetComponent exposes instance via @mounted or defineExpose?
    // It emits 'mounted' event with instance.
    s2Ref.value = { instance };
};

</script>

<template>
  <div class="drill-down-container">
      <div v-if="drillDownField" class="breadcrumb">
          <span class="breadcrumb-all" @click="resetDrillDown">All</span>
          <span> / {{ drillDownField }}</span>
      </div>
      <SheetComponent
        v-if="dataCfg"
        ref="s2Ref"
        sheetType="gridAnalysis"
        :dataCfg="dataCfg"
        :options="options"
        @dataCellClick="onDataCellClick"
        @mounted="onSheetMounted"
      />
  </div>
</template>

<style>
.custom-tooltip {
    padding: 10px;
    background: #fff;
}
.tooltip-operator {
    display: flex;
    border-bottom: 1px solid #eee;
    padding-bottom: 8px;
    margin-bottom: 8px;
}
.tooltip-action {
    flex: 1;
    text-align: center;
    cursor: pointer;
    color: #1890ff;
}
.tooltip-action:hover {
    text-decoration: underline;
}
.tooltip-divider {
    height: 1px;
    background: #eee;
    margin: 8px 0;
}
.tooltip-detail-item {
    display: flex;
    justify-content: space-between;
    margin-bottom: 4px;
}
.tooltip-val {
    margin-left: 8px;
    font-weight: bold;
}
.breadcrumb {
    margin-bottom: 10px;
    padding: 10px;
}
.breadcrumb-all {
    cursor: pointer;
    color: #1890ff;
}
</style>
