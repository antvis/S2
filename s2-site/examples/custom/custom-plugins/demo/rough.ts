import { PivotSheet, S2DataConfig, S2Options } from '@antv/s2';
import { Plugin as PluginRoughCanvasRenderer } from '@antv/g-plugin-rough-canvas-renderer';

/**
 * 需要注意的是一旦使用该插件，“脏矩形渲染”便无法使用，这意味着任何图形的任何样式属性改变，都会导致画布的全量重绘, 性能会严重下降。
 */
fetch(
  'https://gw.alipayobjects.com/os/bmw-prod/cd9814d0-6dfa-42a6-8455-5a6bd0ff93ca.json',
)
  .then((res) => res.json())
  .then(async (res) => {
    const container = document.getElementById('container');
    const s2DataConfig: S2DataConfig = {
      fields: {
        rows: ['province', 'city'],
        columns: ['type', 'sub_type'],
        values: ['number'],
      },
      data: res.data,
      meta: [
        {
          field: 'number',
          name: '数量',
        },
        {
          field: 'province',
          name: '省份',
        },
        {
          field: 'city',
          name: '城市',
        },
        {
          field: 'type',
          name: '类别',
        },
        {
          field: 'sub_type',
          name: '子类别',
        },
      ],
    };

    const s2Options: S2Options = {
      width: 800,
      height: 600,
      interaction: {
        brushSelection: {
          rowCell: true,
          colCell: true,
          dataCell: true,
        },
      },
      transformCanvasConfig(renderer) {
        renderer.registerPlugin(new PluginRoughCanvasRenderer());

        console.log(
          '当前已注册插件:',
          renderer.getPlugins(),
          renderer.getConfig(),
        );

        return {
          supportsCSSTransform: true,
          devicePixelRatio: 2,
          cursor: 'crosshair',
        };
      },
    };

    const s2 = new PivotSheet(container, s2DataConfig, s2Options);

    await s2.render();
  });
