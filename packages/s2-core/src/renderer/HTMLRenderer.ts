import { DisplayObjectConfig, HTML, HTMLStyleProps } from '@antv/g';
import type { BaseCell } from '../cell';
import { HTMLRendererConfig } from '../common/interface';
import { SimpleBBox } from '../engine';
import { BaseRenderer } from './BaseRenderer';

export class HTMLRenderer extends BaseRenderer {
  prepare() {
    return Promise.resolve(null);
  }

  public generateConfig(
    renderer: HTMLRendererConfig,
    cell: BaseCell<SimpleBBox>,
  ): DisplayObjectConfig<HTMLStyleProps> {
    const { x, y, text } = this.getCellInfo(cell);

    return {
      style: {
        x,
        y,
        innerHTML: text,
        pointerEvents: 'auto',
        ...renderer.config,
      },
    };
  }

  render(
    cell: BaseCell<SimpleBBox>,
    config: DisplayObjectConfig<HTMLStyleProps>,
  ) {
    cell.appendChild(new HTML(config));
  }
}
