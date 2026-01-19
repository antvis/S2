<!-- eslint-disable no-console -->
<script setup lang="ts">
import { Plugin as PluginA11y } from '@antv/g-plugin-a11y';
import { Plugin as PluginRoughCanvasRenderer } from '@antv/g-plugin-rough-canvas-renderer';
import type { S2DataConfig, S2Options } from '@antv/s2';
import { ref } from 'vue';
import { SheetComponent } from '../../src';

const dataCfg = ref<S2DataConfig>({
  fields: {
    rows: ['province', 'city'],
    columns: ['type', 'sub_type'],
    values: ['number'],
    valueInCols: true,
  },
  meta: [
    { field: 'number', name: '数量' },
    { field: 'province', name: '省份' },
    { field: 'city', name: '城市' },
    { field: 'type', name: '类别' },
    { field: 'sub_type', name: '子类别' },
  ],
  data: [
    {
      number: 7789,
      province: '浙江省',
      city: '杭州市',
      type: '家具',
      sub_type: '桌子',
    },
    {
      number: 2367,
      province: '浙江省',
      city: '绍兴市',
      type: '家具',
      sub_type: '桌子',
    },
    {
      number: 3877,
      province: '浙江省',
      city: '宁波市',
      type: '家具',
      sub_type: '桌子',
    },
    {
      number: 5343,
      province: '浙江省',
      city: '杭州市',
      type: '家具',
      sub_type: '沙发',
    },
    {
      number: 632,
      province: '浙江省',
      city: '绍兴市',
      type: '家具',
      sub_type: '沙发',
    },
    {
      number: 7234,
      province: '浙江省',
      city: '宁波市',
      type: '家具',
      sub_type: '沙发',
    },
    {
      number: 945,
      province: '浙江省',
      city: '杭州市',
      type: '办公用品',
      sub_type: '笔',
    },
    {
      number: 1304,
      province: '浙江省',
      city: '绍兴市',
      type: '办公用品',
      sub_type: '笔',
    },
    {
      number: 1145,
      province: '浙江省',
      city: '宁波市',
      type: '办公用品',
      sub_type: '笔',
    },
    {
      number: 1343,
      province: '浙江省',
      city: '杭州市',
      type: '办公用品',
      sub_type: '纸张',
    },
    {
      number: 1354,
      province: '浙江省',
      city: '绍兴市',
      type: '办公用品',
      sub_type: '纸张',
    },
    {
      number: 1523,
      province: '浙江省',
      city: '宁波市',
      type: '办公用品',
      sub_type: '纸张',
    },
  ],
});

const options = ref<S2Options>({
  width: 800,
  height: 600,
  interaction: {
    brushSelection: { rowCell: true, colCell: true, dataCell: true },
  },
  transformCanvasConfig(renderer) {
    // 需要注意的是一旦使用该插件，"脏矩形渲染"便无法使用，这意味着任何图形的任何样式属性改变，都会导致画布的全量重绘, 性能会严重下降。
    renderer.registerPlugin(new PluginRoughCanvasRenderer());
    renderer.registerPlugin(
      new PluginA11y({
        enableExtractingText: true,
      }),
    );

    console.log('当前已注册插件:', renderer.getPlugins(), renderer.getConfig());

    return {
      devicePixelRatio: 2,
      cursor: 'crosshair',
    };
  },
});
</script>

<template>
  <div>
    <h3>AntV/G 插件系统 (Plugins Sheet)</h3>
    <p>支持 AntV/G 渲染引擎插件系统集成</p>
    <p style="color: #666; font-size: 12px">
      提示：可通过 transformCanvasConfig 添加插件，如 rough-canvas-renderer
    </p>
    <SheetComponent
      sheetType="pivot"
      :dataCfg="dataCfg"
      :options="options"
      :adaptive="true"
    />
  </div>
</template>
