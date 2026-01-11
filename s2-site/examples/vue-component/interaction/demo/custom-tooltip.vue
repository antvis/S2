<script setup lang="ts">
import { ref, onMounted, defineComponent, h, createVNode, render as vueRender } from 'vue';
import { SheetComponent } from '@antv/s2-vue';
import { BaseTooltip } from '@antv/s2';
import '@antv/s2-vue/dist/s2-vue.min.css';

const TooltipContent = defineComponent({
  props: ['meta'],
  render() {
    const value = this.meta?.value ?? this.meta?.label ?? 'N/A';
    return h('div', { style: 'padding: 12px; font-size: 14px; color: #333;' }, [
      h('div', { style: 'font-weight: bold; margin-bottom: 8px;' }, 'Custom Tooltip'),
      h('div', `Value: ${value}`)
    ]);
  }
});

class CustomTooltip extends BaseTooltip {
  constructor(spreadsheet) {
    super(spreadsheet);
  }

  renderContent() {
    const cell = this.spreadsheet.getCell(this.options.event?.target);
    const meta = cell?.getMeta();

    // Use Vue to render the tooltip content
    const tooltipVNode = createVNode(TooltipContent, { meta });
    vueRender(tooltipVNode, this.container);
  }

  destroy() {
    super.destroy();
    if (this.container) {
        vueRender(null, this.container);
    }
  }
}

const dataCfg = ref(null);
const options = {
  width: 600,
  height: 480,
  tooltip: {
    enable: true,
    render: (spreadsheet) => new CustomTooltip(spreadsheet),
  },
  interaction: {
      hoverHighlight: true,
  }
};
const sheetType = 'pivot';

const s2DataConfig = {
  meta: [
    { field: 'province', name: '省份' },
    { field: 'city', name: '城市' },
    { field: 'type', name: '商品类别' },
    { field: 'sub_type', name: '子类别' },
    { field: 'number', name: '数量' },
  ],
};

onMounted(() => {
  fetch('https://gw.alipayobjects.com/os/bmw-prod/2a5dbbc8-d0a7-4d02-b7c9-34f6ca63cff6.json')
    .then(res => res.json())
    .then(data => {
      dataCfg.value = {
          ...data,
          ...s2DataConfig
      };
    });
});
</script>

<template>
  <SheetComponent
    v-if="dataCfg"
    :sheetType="sheetType"
    :dataCfg="dataCfg"
    :options="options"
  />
</template>
