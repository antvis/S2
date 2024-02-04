/* eslint-disable no-console */
/* eslint-disable import/no-extraneous-dependencies */
import { Plugin as PluginRoughCanvasRenderer } from '@antv/g-plugin-rough-canvas-renderer';
import { Plugin as PluginA11y } from '@antv/g-plugin-a11y';
import { SpreadSheet } from '@antv/s2';
import React from 'react';
import {
  SheetComponent,
  type SheetComponentOptions,
  type SheetComponentsProps,
} from '../../src/components';
import { pivotSheetDataCfg } from '../config';

export const options: SheetComponentOptions = {
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
    // 需要注意的是一旦使用该插件，“脏矩形渲染”便无法使用，这意味着任何图形的任何样式属性改变，都会导致画布的全量重绘, 性能会严重下降。
    renderer.registerPlugin(new PluginRoughCanvasRenderer());
    renderer.registerPlugin(
      new PluginA11y({
        enableExtractingText: true,
      }),
    );

    console.log('当前已注册插件:', renderer.getPlugins(), renderer.getConfig());

    return {
      supportsCSSTransform: true,
      devicePixelRatio: 2,
      cursor: 'crosshair',
    };
  },
};

export const PluginsSheet: React.FC<
  Partial<SheetComponentsProps> & React.RefAttributes<SpreadSheet>
> = React.forwardRef((props, ref) => (
  <SheetComponent
    {...props}
    sheetType="pivot"
    dataCfg={pivotSheetDataCfg}
    options={options}
    ref={ref}
    header={{
      title: '手绘风格 & Canvas 内部文本可被搜索',
    }}
  />
));
